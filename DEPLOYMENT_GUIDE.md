# 🚀 Convex Database Deployment Guide

This guide will help you deploy your marketplace with Convex database integration.

## Current Status ✅

- **Database Schema**: Complete with products, users, agents, deals, and events tables
- **Database Functions**: All CRUD operations for products implemented
- **Sample Data**: Seeding function ready with your HTML marketplace data
- **Frontend**: Two versions available (Convex-connected and local demo)

## Files Created

```
apps/backend/convex/
├── schema.ts           # Enhanced schema with products table
├── products.ts         # Complete product management functions
├── seedData.ts         # Sample data from your HTML files
├── users.ts            # User management (existing)
├── deals.ts            # Deal management (existing)
└── convex.json         # Convex configuration

Root/
├── marketplace-convex.html      # Full Convex integration
├── marketplace-local-demo.html  # Local demo with instructions
└── CONVEX_SETUP.md             # Setup documentation
```

## Deployment Steps

### 1. Interactive Setup (Recommended)

Open a terminal and run these commands interactively:

```bash
cd apps/backend
npx convex dev
```

This will:
- Prompt you to create a new Convex project or select existing one
- Set up authentication if needed
- Give you a deployment URL
- Start the development server

### 2. Deploy Functions

Once the dev server is running:

```bash
# In another terminal
cd apps/backend
npx convex deploy
```

### 3. Get Your Deployment URL

After deployment, you'll get a URL like:
```
https://your-project-name.convex.cloud
```

### 4. Update Frontend

Edit `marketplace-convex.html` line ~332:

```javascript
// Replace this line:
const convex = new ConvexHttpClient(process.env.CONVEX_URL || "https://your-convex-deployment.convex.cloud");

// With your actual URL:
const convex = new ConvexHttpClient("https://YOUR-ACTUAL-DEPLOYMENT.convex.cloud");
```

### 5. Test Everything

1. Open `marketplace-convex.html` in your browser
2. Click "🌱 Seed Database" to populate with sample data
3. Test searching and creating products
4. Switch between buyer and seller modes

## Available Demo Files

### 1. `marketplace-local-demo.html`
- **Use this first** to test functionality
- Works without Convex deployment
- Local storage simulation
- Full UI with sample products
- Shows exactly how the real version will work

### 2. `marketplace-convex.html`
- **Use after Convex deployment**
- Real database integration
- Persistent storage
- Multi-user capable

## Database Functions Available

### Products (`products.ts`)
- `createProduct` - Add new listings
- `listProducts` - Query with filters
- `searchProducts` - Full-text search
- `getProductById` - Single product details
- `getProductsBySeller` - Seller's products
- `updateProduct` - Modify products
- `deleteProduct` - Remove products
- `markProductSold` - Mark as sold

### Sample Data (`seedData.ts`)
- `seedProductData` - Populate with your HTML sample data
- Creates users and products from your original JavaScript arrays

## Testing Checklist

After deployment, verify:

- [ ] Database seeding works
- [ ] Product search and filtering
- [ ] Product creation by sellers
- [ ] Real-time updates
- [ ] Data persists after page refresh
- [ ] Multiple browsers can see same data

## Troubleshooting

### Connection Issues
- Verify deployment URL is correct
- Check browser console for CORS errors
- Ensure functions are deployed

### Data Issues
- Run seed function only once
- Check Convex dashboard for data
- Verify schema matches functions

### Performance
- Database is indexed for fast queries
- Search is client-side filtered for now
- Consider server-side search for large datasets

## Next Steps After Deployment

1. **Authentication**: Add user login/signup
2. **Real-time Updates**: Enable live data sync
3. **Image Upload**: Add actual image storage
4. **Payment Integration**: Connect payment processing
5. **Mobile App**: Use same Convex backend for mobile
6. **AI Agents**: Connect the AI negotiation system

## Local Demo First!

**⭐ Recommended**: Start with `marketplace-local-demo.html` to see everything working locally, then proceed with Convex deployment when ready.

The local demo shows exactly how your marketplace will behave with the database integration! 🎉