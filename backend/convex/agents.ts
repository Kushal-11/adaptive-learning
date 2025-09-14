import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAgent = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("buyer"), v.literal("seller")),
    preferences: v.object({
      categories: v.array(v.string()),
      maxPrice: v.optional(v.number()),
      minPrice: v.optional(v.number()),
      location: v.optional(v.string()),
      urgency: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    }),
    thresholds: v.object({
      maxNegotiationRounds: v.number(),
      acceptableMargin: v.number(),
      timeoutMinutes: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    // Validate user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create agent
    const agentId = await ctx.db.insert("agents", {
      userId: args.userId,
      name: args.name,
      type: args.type,
      preferences: args.preferences,
      thresholds: args.thresholds,
      status: "active",
      createdAt: Date.now(),
    });

    return agentId;
  },
});

export const getAgentsByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const agents = await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return agents;
  },
});

export const getAllActiveAgents = query({
  handler: async (ctx) => {
    const agents = await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return agents;
  },
});

export const getAgentById = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    return agent;
  },
});

export const updateAgentStatus = mutation({
  args: {
    agentId: v.id("agents"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("negotiating")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      status: args.status,
    });

    return args.agentId;
  },
});

export const getAgentsByType = query({
  args: {
    type: v.union(v.literal("buyer"), v.literal("seller")),
  },
  handler: async (ctx, args) => {
    const agents = await ctx.db
      .query("agents")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), args.type),
          q.eq(q.field("status"), "active")
        )
      )
      .collect();

    return agents;
  },
});

// AUTONOMOUS NEGOTIATOR AGENT - Runs in background
export const runNegotiatorAgent = mutation({
  handler: async (ctx) => {
    console.log("🤖 Negotiator Agent: Starting autonomous matching and negotiation...");
    
    // Get all active products and agents
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    
    const buyerAgents = await ctx.db
      .query("agents")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "buyer"),
          q.eq(q.field("status"), "active")
        )
      )
      .collect();

    const sellerAgents = await ctx.db
      .query("agents")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "seller"),
          q.eq(q.field("status"), "active")
        )
      )
      .collect();

    console.log(`🔍 Found ${products.length} products, ${buyerAgents.length} buyers, ${sellerAgents.length} sellers`);

    // Match buyers with products
    const matches = [];
    for (const buyer of buyerAgents) {
      for (const product of products) {
        const seller = sellerAgents.find(s => s.userId === product.sellerId);
        if (!seller) continue;

        const matchScore = calculateMatchScore(buyer, product, seller);
        if (matchScore > 0.6) { // 60% match threshold
          matches.push({
            buyer,
            seller,
            product,
            matchScore,
            negotiationPotential: calculateNegotiationPotential(buyer, product)
          });
        }
      }
    }

    console.log(`🎯 Found ${matches.length} potential matches`);

    // Process top matches for negotiation
    const sortedMatches = matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Process top 5 matches

    for (const match of sortedMatches) {
      await processNegotiation(ctx, match);
    }

    return {
      processed: sortedMatches.length,
      totalMatches: matches.length,
      timestamp: Date.now()
    };
  },
});

// Calculate match score between buyer and product
function calculateMatchScore(buyer: any, product: any, seller: any): number {
  let score = 0;
  
  // Category match (40% weight)
  if (buyer.preferences.categories.includes(product.category)) {
    score += 0.4;
  }
  
  // Price range match (30% weight)
  if (buyer.preferences.maxPrice && product.currentPrice <= buyer.preferences.maxPrice) {
    const priceRatio = product.currentPrice / buyer.preferences.maxPrice;
    score += 0.3 * (1 - priceRatio); // Better score for lower prices
  }
  
  // Location proximity (20% weight) - simplified
  if (buyer.preferences.location && product.location?.address?.includes(buyer.preferences.location)) {
    score += 0.2;
  }
  
  // Urgency factor (10% weight)
  const urgencyBonus = buyer.preferences.urgency === "high" ? 0.1 : 
                      buyer.preferences.urgency === "medium" ? 0.05 : 0;
  score += urgencyBonus;
  
  return Math.min(score, 1.0);
}

// Calculate negotiation potential
function calculateNegotiationPotential(buyer: any, product: any): number {
  if (!buyer.preferences.maxPrice) return 0.5;
  
  const buyerMax = buyer.preferences.maxPrice;
  const sellerPrice = product.currentPrice;
  const quickSalePrice = product.quickSalePrice || sellerPrice * 0.85;
  
  if (buyerMax >= sellerPrice) return 0.9; // Easy deal
  if (buyerMax >= quickSalePrice) return 0.7; // Negotiable
  if (buyerMax >= quickSalePrice * 0.9) return 0.4; // Challenging
  
  return 0.1; // Unlikely
}

// Process negotiation between matched parties
async function processNegotiation(ctx: any, match: any) {
  const { buyer, seller, product, matchScore, negotiationPotential } = match;
  
  console.log(`💬 Starting negotiation for ${product.makeModel} between buyer ${buyer.name} and seller ${seller.name}`);
  
  // Check if negotiation already exists
  const existingNegotiation = await ctx.db
    .query("negotiations")
    .filter((q) => 
      q.and(
        q.eq(q.field("productId"), product._id),
        q.eq(q.field("buyerId"), buyer.userId),
        q.eq(q.field("status"), "active")
      )
    )
    .first();
  
  if (existingNegotiation) {
    console.log(`⏭️ Negotiation already exists for this match`);
    return;
  }
  
  // Create new negotiation
  const negotiationId = await ctx.db.insert("negotiations", {
    productId: product._id,
    buyerId: buyer.userId,
    sellerId: seller.userId,
    buyerAgentId: buyer._id,
    sellerAgentId: seller._id,
    status: "active",
    currentRound: 1,
    maxRounds: Math.min(buyer.thresholds.maxNegotiationRounds, seller.thresholds.maxNegotiationRounds),
    startedAt: Date.now(),
    lastActivity: Date.now(),
    offers: [],
    matchScore,
    negotiationPotential
  });
  
  // Start negotiation with buyer's opening offer
  const openingOffer = calculateOpeningOffer(buyer, product);
  await makeCounterOffer(ctx, negotiationId, buyer.userId, openingOffer, "Opening offer from buyer agent");
  
  console.log(`🚀 Negotiation ${negotiationId} started with opening offer: $${openingOffer}`);
}

// Calculate buyer's opening offer
function calculateOpeningOffer(buyer: any, product: any): number {
  const maxPrice = buyer.preferences.maxPrice || product.currentPrice;
  const currentPrice = product.currentPrice;
  const quickSalePrice = product.quickSalePrice || currentPrice * 0.85;
  
  // Strategic opening offer based on urgency and negotiation style
  if (buyer.preferences.urgency === "high") {
    return Math.min(maxPrice * 0.95, currentPrice * 0.92); // Aggressive but fair
  } else if (buyer.preferences.urgency === "medium") {
    return Math.min(maxPrice * 0.85, quickSalePrice * 1.05); // Moderate
  } else {
    return Math.min(maxPrice * 0.75, quickSalePrice * 0.95); // Conservative
  }
}

// Make counter offer in negotiation
export const makeCounterOffer = mutation({
  args: {
    negotiationId: v.id("negotiations"),
    userId: v.id("users"),
    offerAmount: v.number(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const negotiation = await ctx.db.get(args.negotiationId);
    if (!negotiation || negotiation.status !== "active") {
      throw new Error("Negotiation not found or not active");
    }
    
    // Add offer to negotiation
    const newOffer = {
      userId: args.userId,
      amount: args.offerAmount,
      message: args.message,
      timestamp: Date.now(),
      round: negotiation.currentRound
    };
    
    const updatedOffers = [...(negotiation.offers || []), newOffer];
    
    await ctx.db.patch(args.negotiationId, {
      offers: updatedOffers,
      lastActivity: Date.now(),
      currentRound: negotiation.currentRound + 1
    });
    
    // Auto-respond from the other party's agent
    setTimeout(async () => {
      await processAutoResponse(ctx, args.negotiationId, args.userId, args.offerAmount);
    }, 2000); // 2 second delay for realism
    
    return args.negotiationId;
  },
});

// Process automatic response from the other party's agent
async function processAutoResponse(ctx: any, negotiationId: string, lastOffererUserId: string, lastOffer: number) {
  const negotiation = await ctx.db.get(negotiationId);
  if (!negotiation || negotiation.status !== "active") return;
  
  const product = await ctx.db.get(negotiation.productId);
  if (!product) return;
  
  const isLastOffererBuyer = negotiation.buyerId === lastOffererUserId;
  const respondingUserId = isLastOffererBuyer ? negotiation.sellerId : negotiation.buyerId;
  
  // Get responding agent
  const respondingAgent = await ctx.db
    .query("agents")
    .filter((q) => q.eq(q.field("userId"), respondingUserId))
    .first();
  
  if (!respondingAgent) return;
  
  // Calculate response
  const response = calculateAgentResponse(
    negotiation, 
    product, 
    respondingAgent, 
    lastOffer, 
    isLastOffererBuyer
  );
  
  if (response.action === "accept") {
    // Accept the deal
    await ctx.db.patch(negotiationId, {
      status: "completed",
      finalPrice: lastOffer,
      completedAt: Date.now()
    });
    
    // Update product status
    await ctx.db.patch(negotiation.productId, {
      status: "sold",
      finalPrice: lastOffer,
      soldAt: Date.now(),
      buyerId: negotiation.buyerId
    });
    
    // Send success notifications
    await sendDealCompletionEmails(ctx, negotiation, product, lastOffer);
    
    console.log(`✅ Deal completed! ${product.makeModel} sold for $${lastOffer}`);
    
  } else if (response.action === "counter" && negotiation.currentRound < negotiation.maxRounds) {
    // Make counter offer
    const counterOffer = {
      userId: respondingUserId,
      amount: response.counterOffer,
      message: response.message,
      timestamp: Date.now(),
      round: negotiation.currentRound
    };
    
    const updatedOffers = [...(negotiation.offers || []), counterOffer];
    
    await ctx.db.patch(negotiationId, {
      offers: updatedOffers,
      lastActivity: Date.now(),
      currentRound: negotiation.currentRound + 1
    });
    
    console.log(`💬 Counter offer: $${response.counterOffer} - ${response.message}`);
    
  } else {
    // Reject or timeout
    await ctx.db.patch(negotiationId, {
      status: "failed",
      failureReason: response.action === "reject" ? "Offer rejected" : "Max rounds reached",
      completedAt: Date.now()
    });
    
    console.log(`❌ Negotiation failed: ${response.action}`);
  }
}

// Calculate agent's response to an offer
function calculateAgentResponse(negotiation: any, product: any, agent: any, offer: number, isOfferFromBuyer: boolean) {
  const currentPrice = product.currentPrice;
  const quickSalePrice = product.quickSalePrice || currentPrice * 0.85;
  const holdOutPrice = product.holdOutPrice || currentPrice * 1.15;
  
  if (isOfferFromBuyer) {
    // Seller agent responding to buyer offer
    const acceptanceThreshold = quickSalePrice * (1 - agent.thresholds.acceptableMargin);
    
    if (offer >= acceptanceThreshold) {
      return { action: "accept" };
    } else if (offer >= quickSalePrice * 0.8) {
      const counterOffer = Math.max(
        offer * 1.1, 
        quickSalePrice * 0.95
      );
      return {
        action: "counter",
        counterOffer: Math.round(counterOffer),
        message: `Thanks for your offer! I can do $${Math.round(counterOffer)}. This is a great deal for this ${product.condition} condition ${product.makeModel}.`
      };
    } else {
      return { action: "reject" };
    }
  }
}

// Send deal completion emails to both parties
async function sendDealCompletionEmails(ctx: any, negotiation: any, product: any, finalPrice: number) {
  // Get buyer and seller details
  const buyer = await ctx.db.get(negotiation.buyerId);
  const seller = await ctx.db.get(negotiation.sellerId);
  
  if (!buyer || !seller) return;
  
  // In a real implementation, this would use a service like SendGrid, Mailgun, or AWS SES
  // For demo purposes, we'll log the email content and store notifications
  
  const buyerEmailContent = generateBuyerSuccessEmail(buyer, seller, product, finalPrice);
  const sellerEmailContent = generateSellerSuccessEmail(buyer, seller, product, finalPrice);
  
  // Store email notifications in database
  await ctx.db.insert("notifications", {
    userId: buyer._id,
    type: "deal_completed",
    title: "🎉 Purchase Successful!",
    message: `You successfully purchased ${product.makeModel} for $${finalPrice}`,
    emailContent: buyerEmailContent,
    read: false,
    createdAt: Date.now()
  });
  
  await ctx.db.insert("notifications", {
    userId: seller._id,
    type: "deal_completed", 
    title: "💰 Sale Completed!",
    message: `Your ${product.makeModel} sold for $${finalPrice}`,
    emailContent: sellerEmailContent,
    read: false,
    createdAt: Date.now()
  });
  
  console.log(`📧 Email notifications sent to buyer (${buyer.email}) and seller (${seller.email})`);
  console.log(`📧 Buyer Email:\n${buyerEmailContent}`);
  console.log(`📧 Seller Email:\n${sellerEmailContent}`);
}

// Generate personalized buyer success email
function generateBuyerSuccessEmail(buyer: any, seller: any, product: any, finalPrice: number): string {
  return `
🎉 Congratulations ${buyer.name}!

Your BuyBot agent successfully negotiated and purchased:

📱 Product: ${product.makeModel} ${product.variant || ''}
💰 Final Price: $${finalPrice} (Original: $${product.originalPrice})
🏪 Seller: ${seller.name}
📍 Pickup Location: ${product.location?.address || 'TBD'}
⭐ Condition: ${product.condition}

💡 Your AI agent saved you $${product.originalPrice - finalPrice}!

Next Steps:
1. Contact seller at ${seller.email} to arrange pickup
2. Inspect the item upon pickup
3. Complete the transaction
4. Leave a review for the seller

Thank you for using BuyBot! Your AI agent is always working to find you the best deals.

Best regards,
The BuyBot Team
🤖 Powered by AI Agents
  `.trim();
}

// Generate personalized seller success email  
function generateSellerSuccessEmail(buyer: any, seller: any, product: any, finalPrice: number): string {
  const profit = finalPrice - (product.quickSalePrice || finalPrice * 0.85);
  const profitText = profit > 0 ? `Your agent negotiated $${profit} above quick sale price!` : '';
  
  return `
💰 Great news ${seller.name}!

Your BuyBot agent successfully sold your item:

📱 Product: ${product.makeModel} ${product.variant || ''}
💰 Sale Price: $${finalPrice} (Listed: $${product.currentPrice})
🛒 Buyer: ${buyer.name}
📍 Pickup Location: ${product.location?.address || 'Your location'}
${profitText}

Next Steps:
1. Buyer will contact you at ${seller.email} to arrange pickup
2. Prepare the item for inspection
3. Complete the transaction safely
4. Leave a review for the buyer

Thank you for using BuyBot! Your AI agent worked hard to get you a great price.

Best regards,
The BuyBot Team
🤖 Powered by AI Agents
  `.trim();
}

// Background scheduler to run negotiator agent
export const scheduleNegotiatorAgent = mutation({
  handler: async (ctx) => {
    // This would typically be called by a cron job or scheduled task
    // For demo purposes, we'll run it manually
    
    console.log("⏰ Scheduler: Running background negotiator agent...");
    
    const result = await ctx.runMutation("agents:runNegotiatorAgent", {});
    
    console.log(`✅ Negotiator agent completed: ${result.processed} negotiations processed`);
    
    return result;
  },
});

// Get all active negotiations for monitoring
export const getActiveNegotiations = query({
  handler: async (ctx) => {
    const negotiations = await ctx.db
      .query("negotiations")
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .collect();
    
    return negotiations;
  },
});

// Get negotiation history for a user
export const getNegotiationHistory = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const negotiations = await ctx.db
      .query("negotiations")
      .filter((q: any) => 
        q.or(
          q.eq(q.field("buyerId"), args.userId),
          q.eq(q.field("sellerId"), args.userId)
        )
      )
      .collect();
    
    return negotiations;
  },
});

// Manual trigger for testing the negotiator agent
export const triggerNegotiatorAgent = mutation({
  handler: async (ctx) => {
    console.log("🔧 Manual trigger: Starting negotiator agent...");
    
    try {
      const result = await runNegotiatorAgent.handler(ctx);
      
      return {
        success: true,
        message: `Negotiator agent processed ${result.processed} matches`,
        details: result
      };
    } catch (error) {
      console.error("Error running negotiator agent:", error);
      return {
        success: false,
        message: "Failed to run negotiator agent",
        error: error.message
      };
    }
  },
});
