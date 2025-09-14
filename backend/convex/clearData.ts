import { mutation } from "./_generated/server";

export const clearAllData = mutation({
  handler: async (ctx) => {
    // Clear all tables
    const users = await ctx.db.query("users").collect();
    const products = await ctx.db.query("products").collect();
    const agents = await ctx.db.query("agents").collect();
    const deals = await ctx.db.query("deals").collect();
    const events = await ctx.db.query("events").collect();

    // Delete all records
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    for (const product of products) {
      await ctx.db.delete(product._id);
    }
    for (const agent of agents) {
      await ctx.db.delete(agent._id);
    }
    for (const deal of deals) {
      await ctx.db.delete(deal._id);
    }
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    return {
      message: "All data cleared successfully!",
      usersDeleted: users.length,
      productsDeleted: products.length,
      agentsDeleted: agents.length,
      dealsDeleted: deals.length,
      eventsDeleted: events.length,
    };
  },
});
