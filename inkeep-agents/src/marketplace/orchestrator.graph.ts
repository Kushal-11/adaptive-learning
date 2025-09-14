import { z } from 'zod';

/**
 * Orchestrator Graph
 * Master coordination graph that manages the entire marketplace workflow
 * 
 * Flow:
 * 1. Receive marketplace request and determine type
 * 2. Route to appropriate specialized graph
 * 3. Coordinate between multiple graphs when needed
 * 4. Monitor progress and handle cross-graph dependencies
 * 5. Aggregate results and provide unified response
 * 6. Handle errors and fallback scenarios
 */

export const orchestratorGraph = {
  name: 'orchestrator',
  description: 'Master coordination graph for all marketplace operations',
  
  nodes: {
    // Entry point - receive marketplace request
    receiveMarketplaceRequest: {
      type: 'input',
      description: 'Receive and classify incoming marketplace requests',
      schema: z.object({
        requestId: z.string(),
        userId: z.string(),
        requestType: z.enum([
          'seller_onboarding',
          'buyer_onboarding', 
          'create_listing',
          'search_products',
          'make_offer',
          'negotiate_deal',
          'check_compliance',
          'grade_condition',
          'price_analysis',
        ]),
        requestData: z.any(),
        priority: z.enum(['low', 'medium', 'high']).default('medium'),
        context: z.record(z.any()).optional(),
      }),
    },

    // Classify and route request
    classifyAndRoute: {
      type: 'routing',
      description: 'Classify request type and route to appropriate specialized graph',
      dependencies: ['receiveMarketplaceRequest'],
      routing_rules: {
        seller_onboarding: 'seller-intake',
        buyer_onboarding: 'buyer-intake',
        create_listing: 'seller-intake',
        search_products: 'matcher',
        make_offer: 'deal-negotiator',
        negotiate_deal: 'deal-negotiator',
        check_compliance: 'compliance',
        grade_condition: 'condition-grade',
        price_analysis: 'price-oracle',
      },
    },

    // Execute seller intake workflow
    executeSellerIntake: {
      type: 'subgraph',
      description: 'Execute seller intake and listing creation workflow',
      dependencies: ['classifyAndRoute'],
      subgraph: 'seller-intake',
      condition: 'requestType in [seller_onboarding, create_listing]',
    },

    // Execute buyer intake workflow
    executeBuyerIntake: {
      type: 'subgraph',
      description: 'Execute buyer onboarding workflow',
      dependencies: ['classifyAndRoute'],
      subgraph: 'buyer-intake',
      condition: 'requestType == buyer_onboarding',
    },

    // Execute product matching
    executeMatching: {
      type: 'subgraph',
      description: 'Execute product search and matching',
      dependencies: ['classifyAndRoute'],
      subgraph: 'matcher',
      condition: 'requestType == search_products',
    },

    // Execute deal negotiation
    executeDealNegotiation: {
      type: 'subgraph',
      description: 'Execute deal negotiation workflow',
      dependencies: ['classifyAndRoute'],
      subgraph: 'deal-negotiator',
      condition: 'requestType in [make_offer, negotiate_deal]',
    },

    // Execute compliance checking
    executeComplianceCheck: {
      type: 'subgraph',
      description: 'Execute compliance checking workflow',
      dependencies: ['classifyAndRoute'],
      subgraph: 'compliance',
      condition: 'requestType == check_compliance',
    },

    // Execute condition grading
    executeConditionGrading: {
      type: 'subgraph',
      description: 'Execute condition grading workflow',
      dependencies: ['classifyAndRoute'],
      subgraph: 'condition-grade',
      condition: 'requestType == grade_condition',
    },

    // Execute price analysis
    executePriceAnalysis: {
      type: 'subgraph',
      description: 'Execute price analysis workflow',
      dependencies: ['classifyAndRoute'],
      subgraph: 'price-oracle',
      condition: 'requestType == price_analysis',
    },

    // Coordinate multi-graph workflows
    coordinateMultiGraph: {
      type: 'coordination',
      description: 'Coordinate workflows that require multiple specialized graphs',
      dependencies: ['classifyAndRoute'],
      coordination_scenarios: {
        full_listing_creation: ['condition-grade', 'price-oracle', 'compliance'],
        comprehensive_buyer_matching: ['matcher', 'price-oracle'],
        deal_with_compliance: ['deal-negotiator', 'compliance'],
      },
    },

    // Monitor workflow progress
    monitorProgress: {
      type: 'monitoring',
      description: 'Monitor progress across all active workflows',
      dependencies: [
        'executeSellerIntake',
        'executeBuyerIntake', 
        'executeMatching',
        'executeDealNegotiation',
        'executeComplianceCheck',
        'executeConditionGrading',
        'executePriceAnalysis',
        'coordinateMultiGraph',
      ],
      monitoring_metrics: [
        'workflow_status',
        'completion_percentage',
        'error_rates',
        'performance_metrics',
        'user_satisfaction',
      ],
    },

    // Aggregate results
    aggregateResults: {
      type: 'synthesis',
      description: 'Aggregate results from all completed workflows',
      dependencies: ['monitorProgress'],
      aggregation_strategies: [
        'merge_compatible_results',
        'resolve_conflicts',
        'prioritize_by_importance',
        'format_unified_response',
      ],
    },

    // Handle errors and fallbacks
    handleErrors: {
      type: 'error_handling',
      description: 'Handle errors and provide fallback responses',
      dependencies: ['monitorProgress'],
      error_strategies: {
        retry: 'temporary_failures',
        fallback: 'service_unavailable',
        escalate: 'critical_errors',
        graceful_degradation: 'partial_failures',
      },
    },

    // Successful completion
    workflowComplete: {
      type: 'output',
      description: 'All workflows completed successfully',
      dependencies: ['aggregateResults'],
      outputs: {
        request_id: 'string',
        workflow_results: 'object',
        execution_summary: 'string',
        performance_metrics: 'object',
        next_steps: 'array',
      },
    },

    // Partial completion with errors
    partialCompletion: {
      type: 'output',
      description: 'Workflows completed with some errors or limitations',
      dependencies: ['handleErrors'],
      outputs: {
        completed_workflows: 'array',
        failed_workflows: 'array',
        error_summary: 'string',
        available_results: 'object',
        retry_recommendations: 'array',
      },
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receiveMarketplaceRequest',
    max_iterations: 1,
    timeout: 3600, // 60 minutes
    error_handling: 'comprehensive',
    parallel_execution: true,
  },

  // Context requirements
  context: {
    required: ['userProfile'],
    optional: ['marketData', 'products', 'policies', 'rubrics', 'comparables'],
  },

  // Subgraph registry
  subgraphs: {
    'seller-intake': 'sellerIntakeGraph',
    'buyer-intake': 'buyerIntakeGraph',
    'matcher': 'matcherGraph',
    'deal-negotiator': 'dealNegotiatorGraph',
    'compliance': 'complianceGraph',
    'condition-grade': 'conditionGradeGraph',
    'price-oracle': 'priceOracleGraph',
    'photo-qa': 'photoQAGraph',
  },
};

export type OrchestratorGraph = typeof orchestratorGraph;
