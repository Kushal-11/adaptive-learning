import { z } from 'zod';

/**
 * Deal Negotiator Graph
 * Handles price negotiations between buyers and sellers
 * 
 * Flow:
 * 1. Receive negotiation request (offer or counter-offer)
 * 2. Analyze market context and participant profiles
 * 3. Evaluate offer fairness and market positioning
 * 4. Generate appropriate response strategy
 * 5. Craft negotiation message with market justification
 * 6. Track negotiation progress and suggest next steps
 */

export const dealNegotiatorGraph = {
  name: 'deal-negotiator',
  description: 'Intelligent negotiation system for marketplace transactions',
  
  nodes: {
    // Entry point - receive negotiation request
    receiveNegotiationRequest: {
      type: 'input',
      description: 'Receive offer, counter-offer, or negotiation inquiry',
      schema: z.object({
        dealId: z.string(),
        productId: z.string(),
        buyerId: z.string(),
        sellerId: z.string(),
        negotiationType: z.enum(['initial_offer', 'counter_offer', 'final_offer']),
        offer: z.object({
          amount: z.number().positive(),
          message: z.string().optional(),
          conditions: z.array(z.string()).optional(),
        }),
        listingPrice: z.number().positive(),
        negotiationHistory: z.array(z.any()).optional(),
      }),
    },

    // Load participant profiles
    loadParticipantProfiles: {
      type: 'data_retrieval',
      description: 'Load buyer and seller profiles for negotiation context',
      dependencies: ['receiveNegotiationRequest'],
      context: ['userProfile'],
      profile_data: [
        'negotiation_style',
        'price_flexibility',
        'response_patterns',
        'success_rates',
        'preferences',
      ],
    },

    // Analyze market context
    analyzeMarketContext: {
      type: 'analysis',
      description: 'Analyze current market conditions for the product',
      dependencies: ['receiveNegotiationRequest'],
      context: ['marketData', 'comparables'],
      tools: ['researchMarket', 'analyzePrice'],
      market_factors: [
        'current_demand',
        'supply_levels',
        'price_trends',
        'seasonal_effects',
        'competitive_landscape',
      ],
    },

    // Evaluate offer fairness
    evaluateOfferFairness: {
      type: 'analysis',
      description: 'Evaluate the fairness and market positioning of the offer',
      dependencies: ['analyzeMarketContext', 'loadParticipantProfiles'],
      evaluation_criteria: [
        'market_value_comparison',
        'condition_adjustment',
        'location_factors',
        'urgency_consideration',
        'negotiation_room',
      ],
    },

    // Determine negotiation strategy
    determineStrategy: {
      type: 'decision',
      description: 'Determine optimal negotiation strategy based on context',
      dependencies: ['evaluateOfferFairness'],
      strategies: {
        accept: 'offer_within_acceptable_range',
        counter: 'offer_below_threshold_but_reasonable',
        reject: 'offer_too_low_or_unreasonable',
        hold: 'wait_for_better_market_conditions',
      },
    },

    // Generate counter-offer
    generateCounterOffer: {
      type: 'calculation',
      description: 'Calculate appropriate counter-offer amount',
      dependencies: ['determineStrategy'],
      calculation_factors: [
        'market_value',
        'negotiation_position',
        'buyer_budget_signals',
        'seller_flexibility',
        'time_pressure',
      ],
    },

    // Craft negotiation message
    craftNegotiationMessage: {
      type: 'synthesis',
      description: 'Craft professional negotiation message with market justification',
      dependencies: ['generateCounterOffer', 'determineStrategy'],
      tools: ['generateNegotiationResponse'],
      message_components: [
        'professional_greeting',
        'offer_acknowledgment',
        'market_justification',
        'counter_proposal',
        'next_steps',
      ],
    },

    // Track negotiation progress
    trackProgress: {
      type: 'monitoring',
      description: 'Track negotiation progress and identify patterns',
      dependencies: ['craftNegotiationMessage'],
      tracking_metrics: [
        'rounds_completed',
        'price_movement',
        'response_times',
        'engagement_level',
        'closing_probability',
      ],
    },

    // Successful negotiation
    negotiationSuccess: {
      type: 'output',
      description: 'Negotiation completed successfully with agreed terms',
      dependencies: ['trackProgress'],
      outputs: {
        final_price: 'number',
        agreed_terms: 'object',
        negotiation_summary: 'string',
        success_factors: 'array',
      },
    },

    // Continue negotiation
    continueNegotiation: {
      type: 'feedback',
      description: 'Continue negotiation with updated strategy',
      dependencies: ['trackProgress'],
      loops_to: 'receiveNegotiationRequest',
      continuation_logic: [
        'update_strategy',
        'adjust_expectations',
        'consider_alternatives',
      ],
    },

    // Negotiation stalled
    negotiationStalled: {
      type: 'escalation',
      description: 'Handle stalled negotiations with alternative approaches',
      dependencies: ['trackProgress'],
      escalation_options: [
        'suggest_meeting_halfway',
        'propose_alternative_terms',
        'recommend_timeout',
        'suggest_mediation',
      ],
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receiveNegotiationRequest',
    max_iterations: 5,
    timeout: 2400, // 40 minutes
    error_handling: 'graceful',
  },

  // Context requirements
  context: {
    required: ['userProfile', 'marketData'],
    optional: ['negotiationHistory', 'comparables'],
  },
};

export type DealNegotiatorGraph = typeof dealNegotiatorGraph;
