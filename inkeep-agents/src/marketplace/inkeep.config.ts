// Inkeep configuration for AI Agent Marketplace
export const inkeepMarketplaceConfig = {
  // Agent runtime configuration
  runtime: {
    environment: "development", // development | production
    logLevel: "info", // debug | info | warn | error
    maxConcurrentNegotiations: 10,
    defaultTimeout: 300000, // 5 minutes in milliseconds
  },

  // Convex integration settings
  convex: {
    deploymentUrl: process.env.CONVEX_URL || "https://your-convex-deployment.convex.cloud",
    apiKey: process.env.CONVEX_API_KEY,
    functions: {
      // Query functions
      getDealById: "deals:getDealById",
      listDeals: "deals:listDeals",
      getAgentById: "agents:getAgentById",
      getEventsByDeal: "events:getEventsByDeal",
      
      // Mutation functions
      updateDealState: "deals:updateDealState",
      finalizeDeal: "deals:finalizeDeal",
      createEvent: "events:createEvent",
      
      // Action functions
      simulateNegotiationStep: "negotiations:simulateNegotiationStep",
      processInkeepNegotiation: "negotiations:processInkeepNegotiation",
    },
  },

  // Agent behavior profiles
  agentProfiles: {
    conservative_buyer: {
      type: "buyer",
      aggressiveness: 0.3,
      patience: 0.8,
      riskTolerance: 0.2,
      description: "Conservative buyer that prefers safe, low-risk negotiations",
    },
    aggressive_buyer: {
      type: "buyer", 
      aggressiveness: 0.8,
      patience: 0.4,
      riskTolerance: 0.7,
      description: "Aggressive buyer that pushes for the best deals",
    },
    conservative_seller: {
      type: "seller",
      aggressiveness: 0.4,
      patience: 0.9,
      riskTolerance: 0.2,
      description: "Conservative seller that maintains steady prices",
    },
    aggressive_seller: {
      type: "seller",
      aggressiveness: 0.7,
      patience: 0.5,
      riskTolerance: 0.6,
      description: "Aggressive seller that maximizes profit margins",
    },
  },

  // Negotiation strategies
  strategies: {
    buyer: {
      // Price reduction strategies
      opening_discount: 0.15, // Start 15% below asking price
      minimum_increment: 0.02, // Minimum 2% price adjustments
      maximum_increment: 0.10, // Maximum 10% price adjustments
      
      // Decision thresholds
      accept_threshold: 0.05, // Accept if within 5% of target
      walk_away_threshold: 0.25, // Walk away if more than 25% over budget
      
      // Time-based adjustments
      urgency_multiplier: {
        low: 0.8,    // More patient, smaller increments
        medium: 1.0, // Standard behavior
        high: 1.3,   // More aggressive, larger increments
      },
    },
    
    seller: {
      // Price maintenance strategies
      opening_premium: 0.05, // Start 5% above minimum acceptable
      minimum_increment: 0.01, // Minimum 1% price adjustments
      maximum_increment: 0.08, // Maximum 8% price adjustments
      
      // Decision thresholds
      accept_threshold: 0.03, // Accept if within 3% of minimum
      walk_away_threshold: 0.20, // Walk away if more than 20% below minimum
      
      // Time-based adjustments
      urgency_multiplier: {
        low: 1.2,    // Less willing to compromise
        medium: 1.0, // Standard behavior
        high: 0.7,   // More willing to accept lower offers
      },
    },
  },

  // Machine learning configuration (placeholder for future ML integration)
  ml: {
    enabled: false, // Enable ML-based decision making
    modelEndpoint: process.env.ML_MODEL_ENDPOINT,
    features: [
      "price_history",
      "agent_behavior",
      "market_conditions",
      "negotiation_patterns",
    ],
    updateFrequency: "daily", // How often to retrain models
  },

  // Monitoring and analytics
  monitoring: {
    enabled: true,
    metrics: [
      "negotiation_success_rate",
      "average_negotiation_time",
      "price_improvement",
      "agent_satisfaction",
    ],
    webhooks: {
      negotiation_completed: process.env.WEBHOOK_NEGOTIATION_COMPLETED,
      negotiation_failed: process.env.WEBHOOK_NEGOTIATION_FAILED,
      agent_error: process.env.WEBHOOK_AGENT_ERROR,
    },
  },

  // Rate limiting and safety
  rateLimiting: {
    maxRequestsPerMinute: 60,
    maxNegotiationsPerAgent: 5,
    cooldownPeriod: 30000, // 30 seconds between negotiations
  },

  // Error handling
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    fallbackToSimulation: true, // Use simulation if Inkeep is unavailable
  },

  // Development and testing
  development: {
    mockMode: process.env.NODE_ENV === "development",
    simulationSpeed: 1.0, // 1.0 = real-time, 2.0 = 2x speed, etc.
    debugLogging: true,
    testScenarios: [
      "quick_agreement",
      "prolonged_negotiation", 
      "failed_negotiation",
      "timeout_scenario",
    ],
  },
};

// Type definitions for configuration
export interface AgentProfile {
  type: "buyer" | "seller";
  aggressiveness: number;
  patience: number;
  riskTolerance: number;
  description: string;
}

export interface NegotiationStrategy {
  opening_discount?: number;
  opening_premium?: number;
  minimum_increment: number;
  maximum_increment: number;
  accept_threshold: number;
  walk_away_threshold: number;
  urgency_multiplier: {
    low: number;
    medium: number;
    high: number;
  };
}

// Export configuration as default
export default inkeepMarketplaceConfig;
