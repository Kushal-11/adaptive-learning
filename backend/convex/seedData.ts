import { mutation } from "./_generated/server";

export const seedProductData = mutation({
  handler: async (ctx) => {
    // First, create some sample users/sellers
    const users = [
      { 
        name: "Sarah Johnson", 
        email: "sarah.johnson@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Palo Alto" }
      },
      { 
        name: "Mike Chen", 
        email: "mike.chen@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "San Francisco" }
      },
      { 
        name: "David Kim", 
        email: "david.kim@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Sunnyvale" }
      },
      { 
        name: "Emma Wilson", 
        email: "emma.wilson@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "San Jose" }
      },
      { 
        name: "Alex Rodriguez", 
        email: "alex.rodriguez@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Santa Clara" }
      },
      { 
        name: "Ryan Cooper", 
        email: "ryan.cooper@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Palo Alto" }
      },
      { 
        name: "Michelle Wang", 
        email: "michelle.wang@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "San Francisco" }
      },
      { 
        name: "Lisa Wang", 
        email: "lisa.wang@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Mountain View" }
      },
      { 
        name: "Robert Taylor", 
        email: "robert.taylor@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Fremont" }
      },
      { 
        name: "Maria Garcia", 
        email: "maria.garcia@email.com", 
        password: "password123",
        role: "seller" as const,
        location: { country: "USA", state: "California", city: "Cupertino" }
      },
      { 
        name: "John Smith", 
        email: "john.smith@email.com", 
        password: "password123",
        role: "buyer" as const,
        location: { country: "USA", state: "California", city: "San Francisco" }
      },
    ];

    const createdUsers: any[] = [];
    for (const user of users) {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", user.email))
        .first();

      if (!existingUser) {
        const userId = await ctx.db.insert("users", {
          ...user,
          createdAt: Date.now(),
        });
        createdUsers.push({ ...user, _id: userId });
      } else {
        createdUsers.push(existingUser);
      }
    }

    // Find sellers by email for easy reference
    const getSeller = (email: string) => createdUsers.find((u: any) => u.email === email)?._id;

    // Product data from your HTML files
    const products = [
      // Electronics
      {
        sellerId: getSeller("sarah.johnson@email.com")!,
        category: "electronics",
        makeModel: "iPhone 14 Pro",
        variant: "256GB Space Black",
        condition: "good" as const,
        originalPrice: 1099,
        currentPrice: 750,
        quickSalePrice: 700,
        holdOutPrice: 800,
        description: "Excellent condition iPhone with minor wear",
        defects: "Minor scratches on screen protector",
        accessories: ["Original box", "Charger", "EarPods"],
        images: ["📱"],
        location: {
          address: "Palo Alto, CA",
          coordinates: { lat: 37.4419, lng: -122.1430 }
        },
        timeRanges: [
          { start: "2024-02-01T18:00", end: "2024-02-01T20:00" },
          { start: "2024-02-02T10:00", end: "2024-02-02T12:00" }
        ],
      },
      {
        sellerId: getSeller("mike.chen@email.com")!,
        category: "electronics",
        makeModel: "MacBook Air M2",
        variant: "256GB Silver",
        condition: "like-new" as const,
        originalPrice: 1299,
        currentPrice: 1050,
        quickSalePrice: 950,
        holdOutPrice: 1150,
        description: "Barely used MacBook Air in excellent condition",
        defects: "None",
        accessories: ["Original box", "Charger", "Documentation"],
        images: ["💻"],
        location: {
          address: "San Francisco, CA",
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        timeRanges: [
          { start: "2024-02-01T14:00", end: "2024-02-01T18:00" },
          { start: "2024-02-03T09:00", end: "2024-02-03T17:00" }
        ],
      },
      {
        sellerId: getSeller("david.kim@email.com")!,
        category: "electronics",
        makeModel: "AirPods Pro",
        variant: "2nd Generation",
        condition: "like-new" as const,
        originalPrice: 249,
        currentPrice: 180,
        quickSalePrice: 160,
        holdOutPrice: 200,
        description: "Excellent noise canceling earbuds",
        defects: "None",
        accessories: ["Charging case", "Extra ear tips", "Original box"],
        images: ["🎧"],
        location: {
          address: "Sunnyvale, CA",
          coordinates: { lat: 37.3688, lng: -122.0363 }
        },
        timeRanges: [
          { start: "2024-02-02T12:00", end: "2024-02-02T15:00" },
          { start: "2024-02-02T18:00", end: "2024-02-02T21:00" }
        ],
      },
      {
        sellerId: getSeller("emma.wilson@email.com")!,
        category: "electronics",
        makeModel: "iPad Air",
        variant: "64GB Wi-Fi Space Gray",
        condition: "good" as const,
        originalPrice: 599,
        currentPrice: 420,
        quickSalePrice: 380,
        holdOutPrice: 460,
        description: "Great tablet for work and entertainment",
        defects: "Small scratch on back, screen protector applied",
        accessories: ["Charger", "Screen protector"],
        images: ["📱"],
        location: {
          address: "San Jose, CA",
          coordinates: { lat: 37.3382, lng: -121.8863 }
        },
        timeRanges: [
          { start: "2024-02-01T16:00", end: "2024-02-01T19:00" }
        ],
      },
      {
        sellerId: getSeller("alex.rodriguez@email.com")!,
        category: "electronics",
        makeModel: "Nintendo Switch",
        variant: "OLED Model",
        condition: "good" as const,
        originalPrice: 349,
        currentPrice: 280,
        quickSalePrice: 250,
        holdOutPrice: 310,
        description: "Popular gaming console with great games",
        defects: "Joy-Con slight drift on left controller",
        accessories: ["Dock", "Joy-Con controllers", "Pro Controller", "3 games"],
        images: ["🎮"],
        location: {
          address: "Santa Clara, CA",
          coordinates: { lat: 37.3541, lng: -121.9552 }
        },
        timeRanges: [
          { start: "2024-02-02T19:00", end: "2024-02-02T21:00" },
          { start: "2024-02-03T14:00", end: "2024-02-03T17:00" }
        ],
      },

      // Appliances
      {
        sellerId: getSeller("lisa.wang@email.com")!,
        category: "appliances",
        makeModel: "Dyson V15",
        variant: "Cordless Vacuum",
        condition: "good" as const,
        originalPrice: 449,
        currentPrice: 320,
        quickSalePrice: 290,
        holdOutPrice: 350,
        description: "Powerful cordless vacuum with laser detection",
        defects: "Minor wear on handle grip",
        accessories: ["Multiple attachments", "Wall mount", "Extra filter"],
        images: ["🧹"],
        location: {
          address: "Mountain View, CA",
          coordinates: { lat: 37.3861, lng: -122.0839 }
        },
        timeRanges: [
          { start: "2024-02-01T16:00", end: "2024-02-01T19:00" }
        ],
      },
      {
        sellerId: getSeller("robert.taylor@email.com")!,
        category: "appliances",
        makeModel: "Ninja Blender",
        variant: "Professional BL610",
        condition: "fair" as const,
        originalPrice: 149,
        currentPrice: 85,
        quickSalePrice: 70,
        holdOutPrice: 100,
        description: "Professional-grade blender for smoothies and more",
        defects: "Base has some staining, blades slightly dull",
        accessories: ["Multiple cups", "Lids", "Recipe book"],
        images: ["🥤"],
        location: {
          address: "Fremont, CA",
          coordinates: { lat: 37.5485, lng: -121.9886 }
        },
        timeRanges: [
          { start: "2024-02-01T19:00", end: "2024-02-01T21:00" }
        ],
      },
      {
        sellerId: getSeller("maria.garcia@email.com")!,
        category: "appliances",
        makeModel: "KitchenAid Stand Mixer",
        variant: "Artisan 5-Qt",
        condition: "like-new" as const,
        originalPrice: 379,
        currentPrice: 280,
        quickSalePrice: 250,
        holdOutPrice: 310,
        description: "Professional stand mixer for all your baking needs",
        defects: "None",
        accessories: ["Dough hook", "Wire whip", "Flat beater", "Pouring shield"],
        images: ["🍰"],
        location: {
          address: "Cupertino, CA",
          coordinates: { lat: 37.3230, lng: -122.0322 }
        },
        timeRanges: [
          { start: "2024-02-02T10:00", end: "2024-02-02T14:00" },
          { start: "2024-02-03T15:00", end: "2024-02-03T18:00" }
        ],
      },

      // Fan products as requested
      {
        sellerId: getSeller("michelle.wang@email.com")!,
        category: "appliances",
        makeModel: "Dyson Pure Cool",
        variant: "TP01 Tower Fan",
        condition: "good" as const,
        originalPrice: 249,
        currentPrice: 180,
        quickSalePrice: 160,
        holdOutPrice: 200,
        description: "Tower fan with air purification",
        defects: "Remote control missing, minor dust buildup",
        accessories: ["Filter", "Manual"],
        images: ["🌀"],
        location: {
          address: "San Francisco, CA",
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        timeRanges: [
          { start: "2024-02-01T15:00", end: "2024-02-01T18:00" },
          { start: "2024-02-02T19:00", end: "2024-02-02T21:00" }
        ],
      },
      {
        sellerId: getSeller("ryan.cooper@email.com")!,
        category: "appliances",
        makeModel: "Honeywell Tower Fan",
        variant: "HYF290B Quietset",
        condition: "like-new" as const,
        originalPrice: 119,
        currentPrice: 85,
        quickSalePrice: 75,
        holdOutPrice: 95,
        description: "Quiet tower fan perfect for bedrooms",
        defects: "None",
        accessories: ["Remote control", "Manual", "Original box"],
        images: ["🌀"],
        location: {
          address: "Palo Alto, CA",
          coordinates: { lat: 37.4419, lng: -122.1430 }
        },
        timeRanges: [
          { start: "2024-02-02T14:00", end: "2024-02-02T17:00" }
        ],
      },
    ];

    // Insert products
    const createdProducts = [];
    for (const product of products) {
      const productId = await ctx.db.insert("products", {
        ...product,
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      createdProducts.push({ ...product, _id: productId });
    }

    return {
      message: "Database seeded successfully!",
      usersCreated: createdUsers.length,
      productsCreated: createdProducts.length,
    };
  },
});
