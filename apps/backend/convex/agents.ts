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
