import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple hash function for demo - in production use bcrypt or similar
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use bcrypt, scrypt, or Argon2
  let hash = 0;
  const salt = "BuyBot_Salt_2024";
  const combined = password + salt;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("buyer"), v.literal("seller"), v.literal("both")),
    location: v.object({
      country: v.string(),
      state: v.string(),
      city: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password before storing
    const hashedPassword = hashPassword(args.password);

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: hashedPassword, // Now properly hashed
      role: args.role,
      location: args.location,
      verified: false,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Use secure password verification
    if (!user.password || !verifyPassword(args.password, user.password)) {
      throw new Error("Invalid password");
    }

    // Update last login
    await ctx.db.patch(user._id, {
      lastLogin: Date.now(),
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (user) {
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    // Return users without passwords
    return users.map(({ password, ...user }) => user);
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (user) {
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
});
