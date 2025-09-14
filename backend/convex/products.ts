import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProduct = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Validate seller exists
    const seller = await ctx.db.get(args.sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    if (seller.role !== "seller" && seller.role !== "both") {
      throw new Error("User is not authorized to sell items");
    }

    // Create product
    const productId = await ctx.db.insert("products", {
      ...args,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return productId;
  },
});

export const listProducts = query({
  args: {
    category: v.optional(v.string()),
    condition: v.optional(v.union(
      v.literal("new"),
      v.literal("like-new"),
      v.literal("good"),
      v.literal("fair")
    )),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("sold"),
      v.literal("inactive")
    )),
    searchTerm: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products");

    // Apply filters
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    } else {
      // Default to active products only
      query = query.filter((q) => q.eq(q.field("status"), "active"));
    }

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.condition) {
      query = query.filter((q) => q.eq(q.field("condition"), args.condition));
    }

    if (args.minPrice !== undefined) {
      query = query.filter((q) => q.gte(q.field("currentPrice"), args.minPrice!));
    }

    if (args.maxPrice !== undefined) {
      query = query.filter((q) => q.lte(q.field("currentPrice"), args.maxPrice!));
    }

    const products = await query
      .order("desc")
      .take(args.limit || 100);

    // Filter by search term if provided (client-side filtering since Convex doesn't support text search yet)
    let filteredProducts = products;
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      filteredProducts = products.filter(product =>
        product.makeModel.toLowerCase().includes(searchLower) ||
        product.variant.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Enrich with seller information
    const enrichedProducts = await Promise.all(
      filteredProducts.map(async (product) => {
        const seller = await ctx.db.get(product.sellerId);
        return {
          ...product,
          seller: seller ? {
            _id: seller._id,
            name: seller.name,
            email: seller.email,
          } : null,
        };
      })
    );

    return enrichedProducts;
  },
});

export const getProductById = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    const seller = await ctx.db.get(product.sellerId);

    return {
      ...product,
      seller: seller ? {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
      } : null,
    };
  },
});

export const getProductsBySeller = query({
  args: {
    sellerId: v.id("users"),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("sold"),
      v.literal("inactive")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("products")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const products = await query
      .order("desc")
      .collect();

    return products;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    updates: v.object({
      category: v.optional(v.string()),
      makeModel: v.optional(v.string()),
      variant: v.optional(v.string()),
      condition: v.optional(v.union(
        v.literal("new"),
        v.literal("like-new"),
        v.literal("good"),
        v.literal("fair")
      )),
      currentPrice: v.optional(v.number()),
      quickSalePrice: v.optional(v.number()),
      holdOutPrice: v.optional(v.number()),
      description: v.optional(v.string()),
      defects: v.optional(v.string()),
      accessories: v.optional(v.array(v.string())),
      images: v.optional(v.array(v.string())),
      location: v.optional(v.object({
        address: v.string(),
        coordinates: v.optional(v.object({
          lat: v.number(),
          lng: v.number(),
        })),
      })),
      timeRanges: v.optional(v.array(v.object({
        start: v.string(),
        end: v.string(),
      }))),
      status: v.optional(v.union(
        v.literal("active"),
        v.literal("sold"),
        v.literal("inactive")
      )),
    }),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Update product with new fields and updated timestamp
    await ctx.db.patch(args.productId, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    return args.productId;
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    await ctx.db.delete(args.productId);
    return true;
  },
});

export const markProductSold = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    await ctx.db.patch(args.productId, {
      status: "sold",
      updatedAt: Date.now(),
    });

    return args.productId;
  },
});

export const searchProducts = query({
  args: {
    searchTerm: v.string(),
    filters: v.optional(v.object({
      category: v.optional(v.string()),
      minPrice: v.optional(v.number()),
      maxPrice: v.optional(v.number()),
      condition: v.optional(v.array(v.string())),
      maxDistance: v.optional(v.number()),
      buyerLocation: v.optional(v.object({
        lat: v.number(),
        lng: v.number(),
      })),
    })),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get active products
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(args.limit || 100);

    // Filter by search term
    const searchLower = args.searchTerm.toLowerCase();
    let filteredProducts = products.filter(product =>
      product.makeModel.toLowerCase().includes(searchLower) ||
      product.variant.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );

    // Apply additional filters if provided
    if (args.filters) {
      if (args.filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === args.filters!.category);
      }

      if (args.filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.currentPrice >= args.filters!.minPrice!);
      }

      if (args.filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.currentPrice <= args.filters!.maxPrice!);
      }

      if (args.filters.condition && args.filters.condition.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          args.filters!.condition!.includes(p.condition)
        );
      }

      // TODO: Implement distance filtering when needed
      // This would require calculating distance between buyer and seller locations
    }

    // Enrich with seller information
    const enrichedProducts = await Promise.all(
      filteredProducts.map(async (product) => {
        const seller = await ctx.db.get(product.sellerId);
        return {
          ...product,
          seller: seller ? {
            _id: seller._id,
            name: seller.name,
            email: seller.email,
          } : null,
        };
      })
    );

    return enrichedProducts;
  },
});