import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEvent = mutation({
  args: {
    dealId: v.id("deals"),
    message: v.string(),
    agentActor: v.union(v.literal("buyer"), v.literal("seller"), v.literal("system")),
    eventType: v.union(
      v.literal("offer"),
      v.literal("counteroffer"),
      v.literal("accept"),
      v.literal("reject"),
      v.literal("timeout"),
      v.literal("system")
    ),
    data: v.optional(v.object({
      price: v.optional(v.number()),
      reason: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Validate deal exists
    const deal = await ctx.db.get(args.dealId);
    if (!deal) {
      throw new Error("Deal not found");
    }

    // Create event
    const eventId = await ctx.db.insert("events", {
      dealId: args.dealId,
      message: args.message,
      timestamp: Date.now(),
      agentActor: args.agentActor,
      eventType: args.eventType,
      data: args.data,
    });

    return eventId;
  },
});

export const getEventsByDeal = query({
  args: {
    dealId: v.id("deals"),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("dealId"), args.dealId))
      .order("asc")
      .collect();

    return events;
  },
});

export const getRecentEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    const events = await ctx.db
      .query("events")
      .order("desc")
      .take(limit);

    // Enrich events with deal information
    const enrichedEvents = await Promise.all(
      events.map(async (event: any) => {
        const deal = await ctx.db.get(event.dealId);
        return {
          ...event,
          deal,
        };
      })
    );

    return enrichedEvents;
  },
});

export const getEventsByType = query({
  args: {
    eventType: v.union(
      v.literal("offer"),
      v.literal("counteroffer"),
      v.literal("accept"),
      v.literal("reject"),
      v.literal("timeout"),
      v.literal("system")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("eventType"), args.eventType))
      .order("desc")
      .take(limit);

    return events;
  },
});

export const createSystemEvent = mutation({
  args: {
    dealId: v.id("deals"),
    message: v.string(),
    data: v.optional(v.object({
      price: v.optional(v.number()),
      reason: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      dealId: args.dealId,
      message: args.message,
      timestamp: Date.now(),
      agentActor: "system",
      eventType: "system",
      data: args.data,
    });
  },
});
