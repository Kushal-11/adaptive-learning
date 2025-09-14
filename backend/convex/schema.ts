import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // In production, this should be hashed
    role: v.union(v.literal("buyer"), v.literal("seller"), v.literal("both")),
    location: v.optional(v.object({
      country: v.string(),
      state: v.string(),
      city: v.string(),
    })),
    verified: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    profileImage: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  agents: defineTable({
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
      acceptableMargin: v.number(), // percentage
      timeoutMinutes: v.number(),
    }),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("negotiating")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  deals: defineTable({
    buyerAgentId: v.id("agents"),
    sellerAgentId: v.id("agents"),
    item: v.object({
      name: v.string(),
      description: v.string(),
      category: v.string(),
      initialPrice: v.number(),
    }),
    negotiationState: v.object({
      currentPrice: v.number(),
      rounds: v.number(),
      lastOffer: v.object({
        price: v.number(),
        fromAgent: v.union(v.literal("buyer"), v.literal("seller")),
        timestamp: v.number(),
      }),
    }),
    finalPrice: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("timeout")
    ),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_buyer_agent", ["buyerAgentId"])
    .index("by_seller_agent", ["sellerAgentId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  events: defineTable({
    dealId: v.id("deals"),
    message: v.string(),
    timestamp: v.number(),
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
  }).index("by_deal", ["dealId"]).index("by_timestamp", ["timestamp"]),

  products: defineTable({
    sellerId: v.id("users"),
    category: v.string(),
    makeModel: v.string(),
    variant: v.string(),
    condition: v.union(
      v.literal("new"),
      v.literal("like-new"),
      v.literal("good"),
      v.literal("fair")
    ),
    originalPrice: v.number(),
    currentPrice: v.number(),
    quickSalePrice: v.optional(v.number()),
    holdOutPrice: v.optional(v.number()),
    description: v.optional(v.string()),
    defects: v.optional(v.string()),
    accessories: v.array(v.string()),
    images: v.array(v.string()),
    location: v.object({
      address: v.string(),
      coordinates: v.optional(v.object({
        lat: v.number(),
        lng: v.number(),
      })),
    }),
    timeRanges: v.array(v.object({
      start: v.string(),
      end: v.string(),
    })),
    status: v.union(
      v.literal("active"),
      v.literal("sold"),
      v.literal("inactive")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_price_range", ["currentPrice"])
    .index("by_condition", ["condition"])
    .index("by_created_at", ["createdAt"]),
});
