import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDeal = mutation({
  args: {
    buyerAgentId: v.id("agents"),
    sellerAgentId: v.id("agents"),
    item: v.object({
      name: v.string(),
      description: v.string(),
      category: v.string(),
      initialPrice: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    // Validate agents exist
    const buyerAgent = await ctx.db.get(args.buyerAgentId);
    const sellerAgent = await ctx.db.get(args.sellerAgentId);

    if (!buyerAgent || !sellerAgent) {
      throw new Error("One or both agents not found");
    }

    if (buyerAgent.type !== "buyer" || sellerAgent.type !== "seller") {
      throw new Error("Invalid agent types for deal");
    }

    // Create deal
    const dealId = await ctx.db.insert("deals", {
      buyerAgentId: args.buyerAgentId,
      sellerAgentId: args.sellerAgentId,
      item: args.item,
      negotiationState: {
        currentPrice: args.item.initialPrice,
        rounds: 0,
        lastOffer: {
          price: args.item.initialPrice,
          fromAgent: "seller",
          timestamp: Date.now(),
        },
      },
      status: "active",
      createdAt: Date.now(),
    });

    // Update agent statuses
    await ctx.db.patch(args.buyerAgentId, { status: "negotiating" });
    await ctx.db.patch(args.sellerAgentId, { status: "negotiating" });

    return dealId;
  },
});

export const listDeals = query({
  args: {
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("timeout")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("deals");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const deals = await query
      .order("desc")
      .take(args.limit || 100);

    // Enrich deals with agent information
    const enrichedDeals = await Promise.all(
      deals.map(async (deal) => {
        const buyerAgent = await ctx.db.get(deal.buyerAgentId);
        const sellerAgent = await ctx.db.get(deal.sellerAgentId);
        
        return {
          ...deal,
          buyerAgent,
          sellerAgent,
        };
      })
    );

    return enrichedDeals;
  },
});

export const getDealById = query({
  args: {
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) return null;

    const buyerAgent = await ctx.db.get(deal.buyerAgentId);
    const sellerAgent = await ctx.db.get(deal.sellerAgentId);

    return {
      ...deal,
      buyerAgent,
      sellerAgent,
    };
  },
});

export const updateDealState = mutation({
  args: {
    dealId: v.id("deals"),
    newPrice: v.number(),
    fromAgent: v.union(v.literal("buyer"), v.literal("seller")),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) {
      throw new Error("Deal not found");
    }

    if (deal.status !== "active") {
      throw new Error("Deal is not active");
    }

    // Update negotiation state
    await ctx.db.patch(args.dealId, {
      negotiationState: {
        currentPrice: args.newPrice,
        rounds: deal.negotiationState.rounds + 1,
        lastOffer: {
          price: args.newPrice,
          fromAgent: args.fromAgent,
          timestamp: Date.now(),
        },
      },
    });

    return args.dealId;
  },
});

export const finalizeDeal = mutation({
  args: {
    dealId: v.id("deals"),
    finalPrice: v.number(),
    status: v.union(v.literal("completed"), v.literal("failed"), v.literal("timeout")),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) {
      throw new Error("Deal not found");
    }

    // Update deal
    await ctx.db.patch(args.dealId, {
      finalPrice: args.finalPrice,
      status: args.status,
      completedAt: Date.now(),
    });

    // Reset agent statuses
    await ctx.db.patch(deal.buyerAgentId, { status: "active" });
    await ctx.db.patch(deal.sellerAgentId, { status: "active" });

    return args.dealId;
  },
});

export const getDealsByAgent = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const deals = await ctx.db
      .query("deals")
      .filter((q) => 
        q.or(
          q.eq(q.field("buyerAgentId"), args.agentId),
          q.eq(q.field("sellerAgentId"), args.agentId)
        )
      )
      .order("desc")
      .collect();

    return deals;
  },
});
