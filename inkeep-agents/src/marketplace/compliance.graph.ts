import { z } from 'zod';

/**
 * Compliance Graph
 * Ensures all marketplace activities comply with policies and regulations
 * 
 * Flow:
 * 1. Receive compliance check request
 * 2. Load applicable policies and regulations
 * 3. Analyze content for policy violations
 * 4. Check against legal requirements
 * 5. Generate compliance report with recommendations
 * 6. Approve, flag, or reject based on findings
 */

export const complianceGraph = {
  name: 'compliance',
  description: 'Comprehensive compliance checking for marketplace listings and activities',
  
  nodes: {
    // Entry point - receive compliance check request
    receiveComplianceRequest: {
      type: 'input',
      description: 'Receive listing or activity data for compliance review',
      schema: z.object({
        requestId: z.string(),
        type: z.enum(['listing', 'user_profile', 'transaction', 'message']),
        content: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          images: z.array(z.string().url()).optional(),
          price: z.number().optional(),
          userContent: z.string().optional(),
        }),
        userId: z.string(),
        urgency: z.enum(['low', 'medium', 'high']).default('medium'),
      }),
    },

    // Load applicable policies
    loadApplicablePolicies: {
      type: 'data_retrieval',
      description: 'Load relevant policies and regulations for the content type',
      dependencies: ['receiveComplianceRequest'],
      context: ['policies', 'regulations'],
      policy_categories: [
        'marketplace_policies',
        'content_guidelines',
        'prohibited_items',
        'legal_requirements',
        'safety_standards',
      ],
    },

    // Analyze content for violations
    analyzeContentViolations: {
      type: 'analysis',
      description: 'Analyze content for potential policy violations',
      dependencies: ['receiveComplianceRequest', 'loadApplicablePolicies'],
      tools: ['checkCompliance', 'detectProhibitedContent'],
      analysis_areas: [
        'prohibited_items',
        'misleading_descriptions',
        'inappropriate_content',
        'copyright_violations',
        'trademark_issues',
      ],
    },

    // Check legal requirements
    checkLegalRequirements: {
      type: 'validation',
      description: 'Verify compliance with legal and regulatory requirements',
      dependencies: ['loadApplicablePolicies'],
      legal_checks: [
        'age_restrictions',
        'licensing_requirements',
        'safety_certifications',
        'import_export_restrictions',
        'tax_compliance',
      ],
    },

    // Analyze image compliance
    analyzeImageCompliance: {
      type: 'analysis',
      description: 'Check images for compliance issues and inappropriate content',
      dependencies: ['receiveComplianceRequest'],
      tools: ['analyzeImageContent', 'detectInappropriateContent'],
      image_checks: [
        'inappropriate_content',
        'copyright_violations',
        'misleading_representations',
        'quality_standards',
        'watermark_violations',
      ],
    },

    // Calculate compliance score
    calculateComplianceScore: {
      type: 'scoring',
      description: 'Calculate overall compliance score based on all checks',
      dependencies: ['analyzeContentViolations', 'checkLegalRequirements', 'analyzeImageCompliance'],
      scoring_weights: {
        content_compliance: 0.3,
        legal_compliance: 0.4,
        image_compliance: 0.2,
        policy_adherence: 0.1,
      },
    },

    // Generate compliance report
    generateComplianceReport: {
      type: 'synthesis',
      description: 'Generate detailed compliance report with findings and recommendations',
      dependencies: ['calculateComplianceScore'],
      report_sections: [
        'executive_summary',
        'violation_details',
        'risk_assessment',
        'recommendations',
        'required_actions',
      ],
    },

    // Make compliance decision
    makeComplianceDecision: {
      type: 'decision',
      description: 'Make final compliance decision based on score and violations',
      dependencies: ['generateComplianceReport'],
      decision_criteria: {
        approve: 'score >= 85 && no_high_severity_violations',
        flag_for_review: 'score >= 70 && score < 85',
        reject: 'score < 70 || high_severity_violations_present',
      },
    },

    // Approved state
    complianceApproved: {
      type: 'output',
      description: 'Content approved for marketplace publication',
      dependencies: ['makeComplianceDecision'],
      outputs: {
        approval_status: 'approved',
        compliance_score: 'number',
        minor_recommendations: 'array',
        approval_timestamp: 'date',
      },
    },

    // Flagged for review state
    flaggedForReview: {
      type: 'escalation',
      description: 'Content flagged for human review',
      dependencies: ['makeComplianceDecision'],
      escalation_data: {
        flag_reasons: 'array',
        review_priority: 'string',
        estimated_review_time: 'string',
        reviewer_notes: 'string',
      },
    },

    // Rejected state
    complianceRejected: {
      type: 'feedback',
      description: 'Content rejected due to compliance violations',
      dependencies: ['makeComplianceDecision'],
      rejection_data: {
        violation_summary: 'string',
        required_changes: 'array',
        resubmission_guidelines: 'array',
        appeal_process: 'string',
      },
    },

    // Appeal process
    handleAppeal: {
      type: 'review',
      description: 'Handle compliance decision appeals',
      dependencies: ['complianceRejected'],
      appeal_process: [
        'review_original_decision',
        'consider_new_evidence',
        'escalate_to_human_reviewer',
        'update_decision',
      ],
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receiveComplianceRequest',
    max_iterations: 2,
    timeout: 900, // 15 minutes
    error_handling: 'strict',
  },

  // Context requirements
  context: {
    required: ['policies', 'regulations'],
    optional: ['userProfile', 'violationHistory'],
  },
};

export type ComplianceGraph = typeof complianceGraph;
