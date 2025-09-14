# 🤖 Inkeep Agents Integration Guide - PathSmith Marketplace

## Overview

This guide explains how your PathSmith marketplace integrates with Inkeep's multi-agent framework for sophisticated AI-powered buyer/seller interactions.

## 🏗️ Current Architecture

### **Inkeep Agents Running:**
- **Management API**: http://localhost:3002
- **OpenAPI Docs**: http://localhost:3002/openapi.json
- **Status**: ✅ Running (as seen in terminal output)

### **Available Agent Graphs:**

#### 1. **Buyer Intake Agent** (`buyer-intake.graph.ts`)
- **Purpose**: Onboard new buyers and establish preferences
- **Flow**: Collect info → Understand goals → Setup preferences → Verify credentials → Generate recommendations
- **Output**: Complete buyer profile with personalized recommendations

#### 2. **Seller Intake Agent** (`seller-intake.graph.ts`)
- **Purpose**: Collect structured listing info and seller timeslots
- **Flow**: Ask category → Confirm → Collect details → Convert address to geohash → Validate timeslots
- **Output**: Complete SellerListingSpec with geohash and timeslots

#### 3. **Negotiation Agent** (`negotiation.graph.ts`)
- **Purpose**: Handle buyer/seller negotiations
- **Flow**: Analyze situation → Calculate strategy → Make decision → Execute action
- **Output**: Negotiation decisions (offer/accept/reject)

#### 4. **Price Oracle Agent** (`price-oracle.graph.ts`)
- **Purpose**: Provide market valuations and pricing insights
- **Output**: Suggested pricing based on market conditions

#### 5. **Photo QA Agent** (`photo-qa.graph.ts`)
- **Purpose**: Analyze product photos for quality and completeness
- **Output**: Photo quality assessment and missing angle detection

#### 6. **Deal Negotiator Agent** (`deal-negotiator.graph.ts`)
- **Purpose**: Orchestrate complex multi-party negotiations
- **Output**: Complete deal orchestration

#### 7. **Matcher Agent** (`matcher.graph.ts`)
- **Purpose**: Match buyers with suitable products
- **Output**: Ranked product matches based on preferences

#### 8. **Orchestrator Agent** (`orchestrator.graph.ts`)
- **Purpose**: Coordinate multiple agents for complex workflows
- **Output**: End-to-end deal orchestration

## 🔗 Integration Points

### **1. React UI → Inkeep Agents**

Your marketplace UI now has direct integration via `lib/inkeep-integration.ts`:

```typescript
import { buyerAgent, sellerAgent, negotiationAgent } from '../lib/inkeep-integration';

// Example: Process buyer intake
const buyerResult = await buyerAgent.processIntake({
  name: "John Smith",
  email: "john@example.com",
  location: { city: "San Francisco", state: "CA", zipCode: "94102" },
  shoppingExperience: "frequent",
  categories: ["electronics"],
  priceRange: { min: 100, max: 1000 },
  conditionPreferences: ["new", "like-new"],
  locationRadius: 25
});

// Example: Process seller intake
const sellerResult = await sellerAgent.processIntake({
  category: "electronics",
  makeModel: "iPhone 15 Pro",
  variant: "256GB Space Black",
  purchaseDateISO: "2024-01-15",
  origPrice: 1099,
  usage: { hours: 500, notes: "Light daily use" },
  defects: [],
  accessories: ["original box", "charger"],
  disclosures: ["smoke-free home"],
  address: "123 Main St, San Francisco, CA 94102",
  timeslots: [
    { startISO: "2024-12-15T10:00:00.000Z", endISO: "2024-12-15T12:00:00.000Z" },
    { startISO: "2024-12-16T14:00:00.000Z", endISO: "2024-12-16T16:00:00.000Z" }
  ]
});
```

### **2. Inkeep Agents → Convex Database**

Your Inkeep agents are configured to integrate with your Convex backend:

```typescript
// From inkeep.config.ts
convex: {
  deploymentUrl: "https://reliable-snail-326.convex.cloud",
  functions: {
    getDealById: "deals:getDealById",
    updateDealState: "deals:updateDealState",
    finalizeDeal: "deals:finalizeDeal",
    createEvent: "events:createEvent",
    simulateNegotiationStep: "negotiations:simulateNegotiationStep",
  }
}
```

### **3. Fallback to OpenAI**

When Inkeep agents are unavailable, the system falls back to your OpenAI integration:

```typescript
// Automatic fallback logic
if (!INKEEP_CONFIG.ENABLED || !(await isInkeepAvailable())) {
  // Fall back to OpenAI agents
  return await openAIBuyerAgent.processQuery(context);
}
```

## 🚀 How to Use Inkeep Agents

### **Option 1: Direct Agent Calls**

```typescript
import { marketplaceOrchestrator } from '../lib/inkeep-integration';

// Use individual agents
const buyerResponse = await marketplaceOrchestrator.buyer.processIntake(buyerData);
const sellerResponse = await marketplaceOrchestrator.seller.processIntake(sellerData);
const negotiationResponse = await marketplaceOrchestrator.negotiation.startNegotiation(dealData);
```

### **Option 2: Full Orchestration**

```typescript
// Let the orchestrator handle the complete workflow
const dealResult = await marketplaceOrchestrator.orchestrateFullDeal({
  buyer: buyerProfile,
  seller: sellerProfile,
  product: productListing,
  initialOffer: 850
});
```

### **Option 3: Check Agent Status**

```typescript
import { getInkeepStatus, isInkeepAvailable } from '../lib/inkeep-integration';

// Check if Inkeep is available
const available = await isInkeepAvailable();

// Get detailed status
const status = await getInkeepStatus();
console.log(status);
// {
//   available: true,
//   agents: [...],
//   managementApiUrl: 'http://localhost:3002',
//   openApiDocs: 'http://localhost:3002/openapi.json'
// }
```

## 🧪 Testing Your Agents

### **1. Test Individual Agents**

Your project includes test files:
- `inkeep-agents/test-seller-intake.js`
- `inkeep-agents/test-photo-qa.js`
- `inkeep-agents/test-condition-price.js`

### **2. Use the Inkeep Dashboard**

1. **Access the dashboard**: http://localhost:3002
2. **View OpenAPI docs**: http://localhost:3002/openapi.json
3. **Test agents directly** through the management interface

### **3. Test from Your React UI**

Add this to your marketplace component:

```typescript
const testInkeepIntegration = async () => {
  try {
    const status = await getInkeepStatus();
    console.log('Inkeep Status:', status);
    
    if (status.available) {
      // Test buyer agent
      const buyerResult = await buyerAgent.processIntake({
        name: "Test Buyer",
        email: "test@example.com",
        location: { city: "San Francisco", state: "CA", zipCode: "94102" },
        shoppingExperience: "frequent",
        categories: ["electronics"],
        priceRange: { min: 100, max: 1000 },
        conditionPreferences: ["new", "like-new"],
        locationRadius: 25
      });
      
      console.log('Buyer Agent Result:', buyerResult);
    }
  } catch (error) {
    console.error('Inkeep Integration Test Failed:', error);
  }
};
```

## 📊 Agent Capabilities

### **Buyer Agent Features:**
- ✅ **Smart Onboarding**: Collects preferences and shopping history
- ✅ **Personalized Recommendations**: AI-powered product matching
- ✅ **Budget Management**: Respects price constraints
- ✅ **Location-Based Search**: Geohash-powered proximity matching
- ✅ **Condition Preferences**: Filters by item condition
- ✅ **Alert Setup**: Configures notifications for new listings

### **Seller Agent Features:**
- ✅ **Structured Intake**: Step-by-step listing creation
- ✅ **Address Geocoding**: Converts addresses to geohash
- ✅ **Timeslot Management**: Validates pickup availability
- ✅ **Photo Analysis**: Ensures complete product documentation
- ✅ **Defect Assessment**: Captures condition details
- ✅ **Price Optimization**: Market-based pricing suggestions

### **Negotiation Agent Features:**
- ✅ **Multi-Round Negotiations**: Handles complex back-and-forth
- ✅ **Strategy Calculation**: AI-powered negotiation tactics
- ✅ **Decision Making**: Intelligent offer/accept/reject logic
- ✅ **Context Awareness**: Considers market conditions and preferences
- ✅ **Timeout Handling**: Manages negotiation deadlines

## 🔧 Configuration

### **Environment Variables:**
```bash
# Enable Inkeep agents
INKEEP_ENABLED=true
INKEEP_MANAGEMENT_API_URL=http://localhost:3002
INKEEP_FALLBACK_TO_OPENAI=true

# Your OpenAI key (for fallback)
OPENAI_API_KEY=sk-your-key-here
```

### **Agent Behavior Profiles:**
Your agents support different behavior profiles:
- **Conservative Buyer**: Low risk, patient negotiation
- **Aggressive Buyer**: Fast decisions, pushes for best deals
- **Conservative Seller**: Maintains steady prices
- **Aggressive Seller**: Maximizes profit margins

## 🎯 Next Steps

### **1. Test the Integration**
```bash
# Make sure Inkeep agents are running
cd inkeep-agents && pnpm dev

# Test from your marketplace UI
# Add the test function above to your React component
```

### **2. Push Agents to Inkeep Platform** (Optional)
```bash
cd inkeep-agents/src/marketplace
inkeep push buyer-intake.graph.ts
inkeep push seller-intake.graph.ts
inkeep push negotiation.graph.ts
```

### **3. Monitor Agent Performance**
- Check logs in the Inkeep management console
- Monitor negotiation success rates
- Track agent response times
- Analyze user satisfaction metrics

## 🚨 Troubleshooting

### **Common Issues:**

1. **"Inkeep agents not available"**
   - Check if `pnpm dev` is running in `inkeep-agents/`
   - Verify http://localhost:3002 is accessible
   - Check console for connection errors

2. **"Agent execution failed"**
   - Check agent input schemas match expected format
   - Verify all required fields are provided
   - Check Inkeep management console for detailed errors

3. **"Fallback to OpenAI not working"**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check `INKEEP_FALLBACK_TO_OPENAI=true`
   - Ensure OpenAI integration is working independently

## 🎉 Success Indicators

When everything is working correctly, you should see:

✅ **Inkeep Management API** running on http://localhost:3002
✅ **Agent graphs** responding to test calls
✅ **Marketplace UI** successfully calling Inkeep agents
✅ **Fallback system** working when Inkeep is unavailable
✅ **Real-time negotiations** between buyer/seller agents
✅ **Intelligent recommendations** based on user preferences

Your PathSmith marketplace now has **enterprise-grade AI agents** powered by both Inkeep's multi-agent framework and OpenAI's language models!
