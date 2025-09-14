import { z } from "zod";

// Define the negotiation agent graph for Inkeep integration
export const negotiationAgentGraph = {
  // Agent configuration
  agentConfig: {
    name: "AI Negotiation Agent",
    description: "Autonomous agent for marketplace negotiations",
    version: "1.0.0",
  },

  // Input schema for negotiation decisions
  inputSchema: z.object({
    dealId: z.string(),
    agentType: z.enum(["buyer", "seller"]),
    currentPrice: z.number(),
    initialPrice: z.number(),
    rounds: z.number(),
    maxRounds: z.number(),
    preferences: z.object({
      categories: z.array(z.string()),
      maxPrice: z.number().optional(),
      minPrice: z.number().optional(),
      urgency: z.enum(["low", "medium", "high"]),
    }),
    thresholds: z.object({
      acceptableMargin: z.number(),
      timeoutMinutes: z.number(),
    }),
    negotiationHistory: z.array(z.object({
      price: z.number(),
      fromAgent: z.enum(["buyer", "seller"]),
      timestamp: z.number(),
    })),
  }),

  // Output schema for agent decisions
  outputSchema: z.object({
    action: z.enum(["offer", "accept", "reject"]),
    price: z.number().optional(),
    reasoning: z.string(),
    confidence: z.number().min(0).max(1),
  }),

  // Negotiation workflow steps
  workflow: {
    steps: [
      {
        id: "analyze_situation",
        name: "Analyze Current Negotiation State",
        description: "Evaluate the current deal state and negotiation history",
        inputs: ["dealId", "currentPrice", "rounds", "negotiationHistory"],
        outputs: ["situationAnalysis"],
      },
      {
        id: "calculate_strategy",
        name: "Calculate Negotiation Strategy",
        description: "Determine optimal negotiation approach based on agent type and preferences",
        inputs: ["situationAnalysis", "agentType", "preferences", "thresholds"],
        outputs: ["strategy"],
      },
      {
        id: "make_decision",
        name: "Make Negotiation Decision",
        description: "Decide on the next action (offer, accept, or reject)",
        inputs: ["strategy", "currentPrice", "rounds", "maxRounds"],
        outputs: ["decision"],
      },
      {
        id: "execute_action",
        name: "Execute Negotiation Action",
        description: "Execute the decided action through Convex API",
        inputs: ["decision", "dealId"],
        outputs: ["result"],
      },
    ],
  },

  // Integration points with Convex backend
  convexIntegration: {
    endpoints: {
      getDealInfo: "api.deals.getDealById",
      updateDealState: "api.deals.updateDealState",
      finalizeDeal: "api.deals.finalizeDeal",
      createEvent: "api.events.createEvent",
      simulateStep: "api.negotiations.simulateNegotiationStep",
    },
    
    // Webhook for real-time updates
    webhookUrl: process.env.CONVEX_WEBHOOK_URL || "http://localhost:3001/webhook/negotiation",
  },

  // Agent behavior configuration
  behaviorConfig: {
    buyer: {
      // Buyer agent tries to minimize price
      strategy: "minimize_cost",
      aggressiveness: 0.7, // How aggressively to negotiate (0-1)
      patience: 0.6, // How long to wait before accepting (0-1)
      riskTolerance: 0.4, // Willingness to risk losing the deal (0-1)
    },
    seller: {
      // Seller agent tries to maximize price
      strategy: "maximize_profit",
      aggressiveness: 0.6,
      patience: 0.8,
      riskTolerance: 0.3,
    },
  },

  // Decision-making logic templates
  decisionLogic: {
    buyer: {
      // When to accept an offer
      acceptConditions: [
        "currentPrice <= preferences.maxPrice",
        "currentPrice <= initialPrice * (1 - thresholds.acceptableMargin / 100)",
        "rounds >= maxRounds * 0.8", // Accept if near timeout
      ],
      
      // How to calculate counter-offers
      counterOfferFormula: "currentPrice * (1 - (aggressiveness * (1 - rounds/maxRounds)))",
      
      // When to reject and walk away
      rejectConditions: [
        "currentPrice > preferences.maxPrice * 1.2",
        "rounds >= maxRounds",
      ],
    },
    
    seller: {
      acceptConditions: [
        "currentPrice >= preferences.minPrice",
        "currentPrice >= initialPrice * (1 - thresholds.acceptableMargin / 100)",
        "rounds >= maxRounds * 0.9",
      ],
      
      counterOfferFormula: "currentPrice * (1 + (aggressiveness * (1 - rounds/maxRounds)))",
      
      rejectConditions: [
        "currentPrice < preferences.minPrice * 0.8",
        "rounds >= maxRounds",
      ],
    },
  },
};

// Export type definitions for TypeScript
export type NegotiationAgentInput = z.infer<typeof negotiationAgentGraph.inputSchema>;
export type NegotiationAgentOutput = z.infer<typeof negotiationAgentGraph.outputSchema>;
export type AgentType = "buyer" | "seller";
export type NegotiationAction = "offer" | "accept" | "reject";
