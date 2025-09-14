import { z } from 'zod';

/**
 * Buyer Intake Graph
 * Handles buyer onboarding and preference collection
 * 
 * Flow:
 * 1. Collect buyer information and preferences
 * 2. Understand shopping goals and constraints
 * 3. Set up search preferences and alerts
 * 4. Provide personalized recommendations
 * 5. Guide through first purchase process
 * 6. Establish ongoing relationship
 */

export const buyerIntakeGraph = {
  name: 'buyer-intake',
  description: 'Onboards new buyers and establishes their marketplace preferences',
  
  nodes: {
    // Entry point - collect buyer information
    collectBuyerInfo: {
      type: 'input',
      description: 'Collect basic buyer information and contact details',
      schema: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        location: z.object({
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
        }),
        shoppingExperience: z.enum(['first-time', 'occasional', 'frequent']),
      }),
    },

    // Understand shopping goals
    understandShoppingGoals: {
      type: 'interactive',
      description: 'Interactive session to understand buyer goals and needs',
      dependencies: ['collectBuyerInfo'],
      conversation_topics: [
        'primary_shopping_categories',
        'budget_constraints',
        'quality_preferences',
        'urgency_factors',
        'deal_preferences',
      ],
    },

    // Set up search preferences
    setupSearchPreferences: {
      type: 'configuration',
      description: 'Configure search preferences and filtering options',
      dependencies: ['understandShoppingGoals'],
      schema: z.object({
        categories: z.array(z.string()),
        priceRange: z.object({
          min: z.number().min(0),
          max: z.number().positive(),
        }),
        conditionPreferences: z.array(z.enum(['new', 'like-new', 'good', 'fair', 'poor'])),
        locationRadius: z.number().positive(),
        dealAlerts: z.boolean(),
        savedSearches: z.array(z.string()),
      }),
    },

    // Verify buyer credentials
    verifyBuyerCredentials: {
      type: 'validation',
      description: 'Verify buyer identity and payment methods',
      dependencies: ['collectBuyerInfo'],
      tools: ['verifyIdentity', 'validatePaymentMethod'],
      verification_steps: [
        'identity_check',
        'payment_verification',
        'address_confirmation',
        'phone_verification',
      ],
    },

    // Generate personalized recommendations
    generateRecommendations: {
      type: 'analysis',
      description: 'Generate initial product recommendations based on preferences',
      dependencies: ['setupSearchPreferences', 'verifyBuyerCredentials'],
      tools: ['findMatches'],
      context: ['products', 'marketData'],
      recommendation_types: [
        'trending_in_categories',
        'best_deals',
        'new_arrivals',
        'personalized_matches',
      ],
    },

    // Set up alerts and notifications
    setupAlerts: {
      type: 'configuration',
      description: 'Configure alerts for new listings and price drops',
      dependencies: ['setupSearchPreferences'],
      alert_types: [
        'new_listing_alerts',
        'price_drop_notifications',
        'deal_expiration_warnings',
        'saved_search_updates',
      ],
    },

    // Provide marketplace education
    provideEducation: {
      type: 'informational',
      description: 'Educate buyer about marketplace features and best practices',
      dependencies: ['generateRecommendations'],
      education_topics: [
        'how_to_evaluate_listings',
        'negotiation_best_practices',
        'safety_guidelines',
        'return_policies',
      ],
    },

    // Complete onboarding
    completeOnboarding: {
      type: 'output',
      description: 'Buyer onboarding completed successfully',
      dependencies: ['setupAlerts', 'provideEducation'],
      outputs: {
        buyer_profile: 'object',
        initial_recommendations: 'array',
        configured_alerts: 'array',
        onboarding_score: 'number',
      },
    },
  },

  // Graph configuration
  config: {
    entry_point: 'collectBuyerInfo',
    max_iterations: 1,
    timeout: 1800, // 30 minutes
    error_handling: 'graceful',
  },

  // Context requirements
  context: {
    required: ['products', 'userProfile'],
    optional: ['marketData', 'recommendations'],
  },
};

export type BuyerIntakeGraph = typeof buyerIntakeGraph;
