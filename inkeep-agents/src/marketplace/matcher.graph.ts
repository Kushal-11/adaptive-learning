import { z } from 'zod';

/**
 * Matcher Graph
 * Intelligent matching system that connects buyers with relevant products
 * 
 * Flow:
 * 1. Receive matching request (buyer profile or search query)
 * 2. Analyze buyer preferences and behavior patterns
 * 3. Search and filter available products
 * 4. Apply ML-based similarity scoring
 * 5. Rank results by relevance and buyer fit
 * 6. Return personalized product recommendations
 */

export const matcherGraph = {
  name: 'matcher',
  description: 'Intelligent product matching system for connecting buyers with relevant listings',
  
  nodes: {
    // Entry point - receive matching request
    receiveMatchingRequest: {
      type: 'input',
      description: 'Receive buyer profile and search parameters for matching',
      schema: z.object({
        buyerId: z.string(),
        searchQuery: z.string().optional(),
        filters: z.object({
          category: z.string().optional(),
          priceRange: z.object({ min: z.number(), max: z.number() }).optional(),
          condition: z.array(z.string()).optional(),
          location: z.string().optional(),
          radius: z.number().optional(),
        }).optional(),
        matchingMode: z.enum(['search', 'browse', 'recommendations']).default('search'),
        limit: z.number().default(20),
      }),
    },

    // Load buyer profile and preferences
    loadBuyerProfile: {
      type: 'data_retrieval',
      description: 'Load buyer profile, preferences, and behavioral data',
      dependencies: ['receiveMatchingRequest'],
      context: ['userProfile'],
      data_points: [
        'explicit_preferences',
        'search_history',
        'purchase_history',
        'saved_items',
        'browsing_patterns',
      ],
    },

    // Analyze buyer behavior patterns
    analyzeBuyerBehavior: {
      type: 'analysis',
      description: 'Analyze buyer behavior to infer implicit preferences',
      dependencies: ['loadBuyerProfile'],
      tools: ['analyzeBehaviorPatterns'],
      analysis_dimensions: [
        'category_affinity',
        'price_sensitivity',
        'quality_preference',
        'brand_loyalty',
        'timing_patterns',
      ],
    },

    // Search and filter products
    searchProducts: {
      type: 'data_retrieval',
      description: 'Search available products based on criteria and filters',
      dependencies: ['receiveMatchingRequest'],
      context: ['products'],
      search_strategies: [
        'keyword_matching',
        'category_filtering',
        'price_range_filtering',
        'location_proximity',
        'availability_check',
      ],
    },

    // Apply similarity scoring
    applySimilarityScoring: {
      type: 'analysis',
      description: 'Apply ML-based similarity scoring between buyer and products',
      dependencies: ['analyzeBuyerBehavior', 'searchProducts'],
      tools: ['calculateSimilarity'],
      scoring_factors: {
        category_match: 0.25,
        price_fit: 0.2,
        condition_preference: 0.15,
        location_proximity: 0.1,
        behavioral_similarity: 0.3,
      },
    },

    // Rank and personalize results
    rankResults: {
      type: 'ranking',
      description: 'Rank products by relevance and personalization score',
      dependencies: ['applySimilarityScoring'],
      ranking_algorithms: [
        'relevance_score',
        'personalization_boost',
        'freshness_factor',
        'seller_quality_score',
      ],
    },

    // Apply diversity and exploration
    applyDiversification: {
      type: 'optimization',
      description: 'Apply diversity to avoid filter bubbles and encourage exploration',
      dependencies: ['rankResults'],
      diversification_strategies: [
        'category_diversity',
        'price_range_spread',
        'seller_diversity',
        'exploration_injection',
      ],
    },

    // Generate explanations
    generateExplanations: {
      type: 'synthesis',
      description: 'Generate explanations for why products were recommended',
      dependencies: ['applyDiversification'],
      explanation_types: [
        'preference_match',
        'similar_buyers_liked',
        'trending_in_category',
        'great_deal_alert',
      ],
    },

    // Final matching results
    matchingComplete: {
      type: 'output',
      description: 'Return ranked, personalized product matches',
      dependencies: ['generateExplanations'],
      outputs: {
        matched_products: 'array',
        total_matches: 'number',
        personalization_score: 'number',
        search_suggestions: 'array',
        filter_recommendations: 'object',
      },
    },

    // No matches found state
    noMatchesFound: {
      type: 'feedback',
      description: 'Handle case when no suitable matches are found',
      dependencies: ['searchProducts'],
      suggestions: [
        'broaden_search_criteria',
        'adjust_price_range',
        'expand_location_radius',
        'consider_different_conditions',
      ],
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receiveMatchingRequest',
    max_iterations: 1,
    timeout: 600, // 10 minutes
    error_handling: 'graceful',
  },

  // Context requirements
  context: {
    required: ['products', 'userProfile'],
    optional: ['marketData', 'behaviorData'],
  },
};

export type MatcherGraph = typeof matcherGraph;
