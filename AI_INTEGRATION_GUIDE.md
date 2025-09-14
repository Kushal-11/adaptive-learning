# 🤖 AI Integration Guide - PathSmith Marketplace

## Overview

This guide explains how to integrate OpenAI's LLM with your PathSmith marketplace to enable real AI agents for buyer/seller interactions.

## 🔧 Setup Instructions

### 1. Environment Configuration

Your `.env.local` file has been created with all necessary configuration options. To enable AI agents:

```bash
# 1. Get your OpenAI API key from: https://platform.openai.com/api-keys
# 2. Replace the placeholder in .env.local:
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# 3. Enable AI agents:
AI_AGENTS_ENABLED=true
AI_MOCK_MODE=false

# 4. Configure your Convex URL:
CONVEX_URL=https://your-actual-convex-deployment.convex.cloud
```

### 2. Dependencies Installed

✅ **OpenAI SDK** has been installed (`npm install openai`)

### 3. AI Agent Services Created

The following AI services are now available in `lib/openai.ts`:

- **BuyerAgent**: Analyzes products and suggests offers
- **SellerAgent**: Evaluates listings and handles negotiations  
- **ProductAnalysisService**: Provides market valuations

## 🤖 AI Agent Capabilities

### Buyer Agent Features:
- **Product Analysis**: Evaluates if prices are fair based on condition
- **Smart Offers**: Suggests reasonable counter-offers
- **Budget Compliance**: Respects user's maximum price limits
- **Defect Consideration**: Factors in known defects when pricing
- **Negotiation Strategy**: Professional and ethical negotiation approach

### Seller Agent Features:
- **Market Valuation**: Suggests competitive pricing
- **Negotiation Handling**: Responds to buyer offers intelligently
- **Condition Assessment**: Adjusts prices based on item condition
- **Profit Optimization**: Balances profit with quick sales
- **Professional Communication**: Maintains good customer relationships

### Product Analysis Service:
- **Market Research**: Analyzes current market conditions
- **Condition Adjustments**: Calculates depreciation based on wear
- **Confidence Scoring**: Provides reliability metrics for valuations
- **Category-Specific**: Tailored analysis for different product types

## 🔗 Integration Points

### Current Inkeep Agents Configuration

Your project already has sophisticated Inkeep agents configured:

**Location**: `inkeep-agents/src/marketplace/`
- ✅ **inkeep.config.ts**: Complete agent behavior profiles
- ✅ **negotiation.graph.ts**: Advanced negotiation workflow
- ✅ **Agent Profiles**: Conservative/Aggressive buyer/seller types
- ✅ **Negotiation Strategies**: Price adjustment algorithms
- ✅ **Decision Logic**: Accept/reject/counter-offer conditions

### Convex Integration Ready

Your Convex backend is configured for AI integration:
- **Functions**: `negotiations:processInkeepNegotiation`
- **Schemas**: Deal, agent, and event management
- **Real-time**: Live updates via Convex subscriptions

## 🚀 How to Enable AI Agents

### Option 1: Quick Test (Recommended)

1. **Add your OpenAI API key** to `.env.local`
2. **Restart your development servers**:
   ```bash
   # Stop current servers (Ctrl+C)
   # Then restart:
   cd marketplace-app/frontend && npm run dev
   cd marketplace-app/backend && npm run dev
   ```

3. **Test AI integration** by creating a product listing
4. **Check console logs** for AI agent responses

### Option 2: Full Integration

To integrate AI agents with your React frontend:

```typescript
// Example usage in your React components
import { buyerAgent, sellerAgent, productAnalysis } from '../lib/openai';

// Analyze a product listing
const analysis = await productAnalysis.analyzeProduct({
  name: "iPhone 15 Pro",
  description: "Excellent condition",
  condition: "good",
  defects: "Minor scratches",
  category: "electronics",
  originalPrice: 1099
});

// Get buyer agent recommendation
const buyerResponse = await buyerAgent.processQuery({
  agentType: 'buyer',
  productInfo: {
    name: "iPhone 15 Pro",
    price: 899,
    condition: "good",
    defects: "Minor scratches"
  },
  userPreferences: {
    maxPrice: 950,
    urgency: 'medium',
    categories: ['electronics']
  },
  negotiationHistory: []
});
```

## 📊 AI Agent Status Dashboard

### Current Implementation Status:

| Component | Status | Description |
|-----------|--------|-------------|
| **OpenAI Integration** | ✅ Ready | Complete AI service layer |
| **Buyer Agent** | ✅ Ready | Smart product analysis & offers |
| **Seller Agent** | ✅ Ready | Intelligent pricing & negotiations |
| **Product Analysis** | ✅ Ready | Market valuation service |
| **Inkeep Agents** | ✅ Configured | Advanced negotiation workflows |
| **Environment Config** | ✅ Ready | Complete .env setup |
| **Fallback System** | ✅ Ready | Works without API key |

### What Happens When AI is Enabled:

1. **Real LLM Calls**: Actual OpenAI API requests
2. **Intelligent Responses**: Context-aware agent decisions
3. **Market Analysis**: Real-time product valuations
4. **Smart Negotiations**: AI-powered offer/counter-offer logic
5. **Professional Communication**: Natural language responses

### What Happens When AI is Disabled:

1. **Fallback Logic**: Rule-based decision making
2. **Mock Responses**: Simulated agent behavior
3. **Basic Analysis**: Simple condition-based pricing
4. **Static Messages**: Pre-defined response templates

## 🔍 Testing Your AI Integration

### 1. Verify Environment
```bash
# Check if AI is enabled
echo $AI_AGENTS_ENABLED  # Should be 'true'
echo $OPENAI_API_KEY     # Should start with 'sk-'
```

### 2. Test Product Analysis
Create a product listing and check console for:
```
✅ AI Analysis: Product analyzed successfully
✅ Suggested Price: $X based on condition
✅ Confidence: X% confidence in valuation
```

### 3. Test Agent Responses
Interact with buyer/seller agents and look for:
```
✅ AI Agent Response: Intelligent reasoning provided
✅ Action: offer/accept/reject with explanation
✅ Confidence: Agent confidence score
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"No OpenAI API Key
