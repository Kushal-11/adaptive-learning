import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const simulateNegotiationStep = action({
  args: {
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    // Get deal information
    const deal = await ctx.runQuery(api.deals.getDealById, { dealId: args.dealId });
    
    if (!deal || deal.status !== "active") {
      return { success: false, reason: "Deal not active" };
    }

    const { negotiationState, buyerAgent, sellerAgent } = deal;
    
    // Simple negotiation logic for demo purposes
    const currentPrice = negotiationState.currentPrice;
    const initialPrice = deal.item.initialPrice;
    const rounds = negotiationState.rounds;
    const maxRounds = Math.min(buyerAgent?.thresholds.maxNegotiationRounds || 10, sellerAgent?.thresholds.maxNegotiationRounds || 10);
    
    // Check if negotiation should timeout
    if (rounds >= maxRounds) {
      await ctx.runMutation(api.deals.finalizeDeal, {
        dealId: args.dealId,
        finalPrice: currentPrice,
        status: "timeout",
      });
      
      await ctx.runMutation(api.events.createSystemEvent, {
        dealId: args.dealId,
        message: "Negotiation timed out after maximum rounds",
        data: { reason: "timeout" },
      });
      
      return { success: true, action: "timeout" };
    }

    // Determine next actor (alternate between buyer and seller)
    const nextActor = negotiationState.lastOffer.fromAgent === "buyer" ? "seller" : "buyer";
    
    // Simple price adjustment logic
    let newPrice: number;
    let message: string;
    let eventType: "offer" | "counteroffer" | "accept";
    
    if (nextActor === "buyer") {
      // Buyer tries to lower the price
      const targetPrice = initialPrice * 0.8; // Buyer wants 20% discount
      const priceReduction = Math.max(10, (currentPrice - targetPrice) * 0.3);
      newPrice = Math.max(targetPrice, currentPrice - priceReduction);
      
      if (Math.abs(newPrice - currentPrice) < 5) {
        // Accept if close enough
        eventType = "accept";
        message = `Buyer agent accepts offer at $${currentPrice.toFixed(2)}`;
        
        await ctx.runMutation(api.deals.finalizeDeal, {
          dealId: args.dealId,
          finalPrice: currentPrice,
          status: "completed",
        });
      } else {
        eventType = rounds === 0 ? "offer" : "counteroffer";
        message = `Buyer agent ${eventType === "offer" ? "offers" : "counters with"} $${newPrice.toFixed(2)}`;
        
        await ctx.runMutation(api.deals.updateDealState, {
          dealId: args.dealId,
          newPrice,
          fromAgent: "buyer",
        });
      }
    } else {
      // Seller tries to maintain higher price
      const minPrice = initialPrice * 0.85; // Seller minimum is 15% discount
      const priceIncrease = Math.max(5, (currentPrice - minPrice) * 0.2);
      newPrice = Math.min(initialPrice, currentPrice + priceIncrease);
      
      if (currentPrice >= minPrice && Math.random() > 0.3) {
        // Accept if price is acceptable
        eventType = "accept";
        message = `Seller agent accepts offer at $${currentPrice.toFixed(2)}`;
        
        await ctx.runMutation(api.deals.finalizeDeal, {
          dealId: args.dealId,
          finalPrice: currentPrice,
          status: "completed",
        });
      } else {
        eventType = "counteroffer";
        message = `Seller agent counters with $${newPrice.toFixed(2)}`;
        
        await ctx.runMutation(api.deals.updateDealState, {
          dealId: args.dealId,
          newPrice,
          fromAgent: "seller",
        });
      }
    }

    // Create event
    await ctx.runMutation(api.events.createEvent, {
      dealId: args.dealId,
      message,
      agentActor: nextActor,
      eventType,
      data: { price: eventType === "accept" ? currentPrice : newPrice },
    });

    return { 
      success: true, 
      action: eventType,
      price: eventType === "accept" ? currentPrice : newPrice,
      actor: nextActor 
    };
  },
});

export const startNegotiation = mutation({
  args: {
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    // Create initial system event
    await ctx.db.insert("events", {
      dealId: args.dealId,
      message: "Negotiation started between buyer and seller agents",
      timestamp: Date.now(),
      agentActor: "system",
      eventType: "system",
    });

    return args.dealId;
  },
});

// Mock function for Inkeep integration
export const processInkeepNegotiation = action({
  args: {
    dealId: v.id("deals"),
    agentDecision: v.object({
      action: v.union(v.literal("offer"), v.literal("accept"), v.literal("reject")),
      price: v.optional(v.number()),
      reasoning: v.string(),
    }),
    agentType: v.union(v.literal("buyer"), v.literal("seller")),
  },
  handler: async (ctx, args) => {
    const { dealId, agentDecision, agentType } = args;
    
    // This would be called by Inkeep agents to make negotiation decisions
    // For now, it's a placeholder that processes the agent's decision
    
    if (agentDecision.action === "accept") {
      const deal = await ctx.runQuery(api.deals.getDealById, { dealId });
      if (deal) {
        await ctx.runMutation(api.deals.finalizeDeal, {
          dealId,
          finalPrice: deal.negotiationState.currentPrice,
          status: "completed",
        });
      }
    } else if (agentDecision.action === "offer" && agentDecision.price) {
      await ctx.runMutation(api.deals.updateDealState, {
        dealId,
        newPrice: agentDecision.price,
        fromAgent: agentType,
      });
    }

    // Log the decision
    await ctx.runMutation(api.events.createEvent, {
      dealId,
      message: `${agentType} agent ${agentDecision.action}: ${agentDecision.reasoning}`,
      agentActor: agentType,
      eventType: agentDecision.action === "offer" ? "counteroffer" : agentDecision.action,
      data: { 
        price: agentDecision.price,
        reason: agentDecision.reasoning 
      },
    });

    return { success: true };
  },
});
