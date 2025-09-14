import { z } from 'zod';
import { SellerListingSpec, ConditionGrade } from './data-components';

/**
 * Condition Grade Graph
 * Purpose: compute ConditionGrade from SellerListingSpec using a rubric.
 * 
 * Rubric criteria and weights per category:
 * - packaging present: 0.25
 * - accessories completeness: 0.25  
 * - defect severity: 0.25
 * - age/usage: 0.25
 * 
 * Acceptance gate: Given the same SellerListingSpec, the grade is reproducible 
 * and the justification references rubric criteria, not photos.
 */

// Rubric weights for condition grading
const RUBRIC_WEIGHTS = {
  packaging: 0.25,
  accessories: 0.25,
  defects: 0.25,
  ageUsage: 0.25,
} as const;

// Grade thresholds based on total weighted score
const GRADE_THRESHOLDS = {
  'new': 0.95,
  'open-box': 0.85,
  'like-new': 0.75,
  'good': 0.60,
  'fair': 0.40,
  'poor': 0.0,
} as const;

// Standard accessories by category
const STANDARD_ACCESSORIES: Record<string, string[]> = {
  'electronics': ['original_box', 'charger', 'manual', 'warranty_card'],
  'phone': ['original_box', 'charger', 'cable', 'manual', 'sim_tool'],
  'laptop': ['original_box', 'charger', 'manual', 'warranty_card'],
  'tablet': ['original_box', 'charger', 'cable', 'manual'],
  'gaming': ['original_box', 'controller', 'cables', 'manual'],
  'default': ['original_box', 'manual'],
};

/**
 * Compute packaging score based on original packaging presence
 */
function computePackagingScore(accessories: string[]): number {
  const hasOriginalBox = accessories.some(acc => 
    acc.toLowerCase().includes('box') || 
    acc.toLowerCase().includes('packaging')
  );
  
  if (hasOriginalBox) {
    // Check for complete packaging elements
    const hasManual = accessories.some(acc => 
      acc.toLowerCase().includes('manual') || 
      acc.toLowerCase().includes('documentation')
    );
    const hasWarranty = accessories.some(acc => 
      acc.toLowerCase().includes('warranty')
    );
    
    if (hasManual && hasWarranty) return 1.0; // Complete packaging
    if (hasManual || hasWarranty) return 0.8; // Partial documentation
    return 0.6; // Box only
  }
  
  return 0.0; // No original packaging
}

/**
 * Compute accessories completeness score
 */
function computeAccessoriesScore(accessories: string[], category: string): number {
  const standardAccessories = STANDARD_ACCESSORIES[category.toLowerCase()] || STANDARD_ACCESSORIES.default;
  
  let matchCount = 0;
  const accessoriesLower = accessories.map(acc => acc.toLowerCase());
  
  for (const standardAcc of standardAccessories) {
    const accKeywords = standardAcc.split('_');
    const hasAccessory = accKeywords.some(keyword => 
      accessoriesLower.some(acc => acc.includes(keyword))
    );
    if (hasAccessory) matchCount++;
  }
  
  return Math.min(matchCount / standardAccessories.length, 1.0);
}

/**
 * Compute defect severity score (inverted - lower defects = higher score)
 */
function computeDefectScore(defects: Array<{ area: string; severity: number; notes: string }>): number {
  if (defects.length === 0) return 1.0;
  
  // Calculate weighted defect impact
  let totalImpact = 0;
  let maxPossibleImpact = 0;
  
  for (const defect of defects) {
    const severityWeight = defect.severity / 3; // Normalize 1-3 to 0.33-1.0
    totalImpact += severityWeight;
    maxPossibleImpact += 1.0;
  }
  
  // Invert score - fewer/less severe defects = higher score
  const defectRatio = totalImpact / Math.max(maxPossibleImpact, 1);
  return Math.max(0, 1.0 - defectRatio);
}

/**
 * Compute age/usage score based on purchase date and usage patterns
 */
function computeAgeUsageScore(
  purchaseDateISO: string, 
  usage: { hours?: number; cycles?: number; notes: string }
): number {
  const purchaseDate = new Date(purchaseDateISO);
  const now = new Date();
  const ageInMonths = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  // Age factor (newer = better score)
  let ageScore = 1.0;
  if (ageInMonths > 36) ageScore = 0.3; // > 3 years
  else if (ageInMonths > 24) ageScore = 0.5; // > 2 years  
  else if (ageInMonths > 12) ageScore = 0.7; // > 1 year
  else if (ageInMonths > 6) ageScore = 0.85; // > 6 months
  else ageScore = 1.0; // < 6 months
  
  // Usage factor
  let usageScore = 1.0;
  if (usage.hours && usage.hours > 0) {
    // Heavy usage patterns
    if (usage.hours > 5000) usageScore = 0.3;
    else if (usage.hours > 2000) usageScore = 0.5;
    else if (usage.hours > 1000) usageScore = 0.7;
    else if (usage.hours > 500) usageScore = 0.85;
  }
  
  if (usage.cycles && usage.cycles > 0) {
    // Battery/mechanical cycles
    if (usage.cycles > 1000) usageScore = Math.min(usageScore, 0.4);
    else if (usage.cycles > 500) usageScore = Math.min(usageScore, 0.6);
    else if (usage.cycles > 200) usageScore = Math.min(usageScore, 0.8);
  }
  
  // Usage notes analysis for additional context
  const usageNotes = usage.notes.toLowerCase();
  if (usageNotes.includes('heavy') || usageNotes.includes('intensive')) {
    usageScore *= 0.8;
  } else if (usageNotes.includes('light') || usageNotes.includes('occasional')) {
    usageScore *= 1.1; // Slight bonus for light usage
  }
  
  return Math.min(ageScore * usageScore, 1.0);
}

/**
 * Determine final grade from weighted score
 */
function determineGrade(totalScore: number): ConditionGrade['grade'] {
  for (const [grade, threshold] of Object.entries(GRADE_THRESHOLDS)) {
    if (totalScore >= threshold) {
      return grade as ConditionGrade['grade'];
    }
  }
  return 'poor';
}

/**
 * Generate markdown justification referencing rubric criteria
 */
function generateJustification(
  grade: ConditionGrade['grade'],
  scores: {
    packaging: number;
    accessories: number;
    defects: number;
    ageUsage: number;
    total: number;
  },
  spec: SellerListingSpec
): string {
  const lines: string[] = [];
  
  lines.push(`**Condition Grade: ${grade.toUpperCase()}** (Score: ${scores.total.toFixed(2)})`);
  lines.push('');
  lines.push('**Rubric Assessment:**');
  
  // Packaging assessment
  lines.push(`- **Packaging (25%):** ${(scores.packaging * 100).toFixed(0)}%`);
  if (scores.packaging >= 0.8) {
    lines.push('  - Original packaging with documentation present');
  } else if (scores.packaging >= 0.4) {
    lines.push('  - Original packaging present, some documentation missing');
  } else {
    lines.push('  - No original packaging or documentation');
  }
  
  // Accessories assessment  
  lines.push(`- **Accessories (25%):** ${(scores.accessories * 100).toFixed(0)}%`);
  const accessoryCount = spec.accessories.length;
  if (scores.accessories >= 0.8) {
    lines.push(`  - Most/all standard accessories included (${accessoryCount} items)`);
  } else if (scores.accessories >= 0.4) {
    lines.push(`  - Some standard accessories included (${accessoryCount} items)`);
  } else {
    lines.push(`  - Few/no standard accessories included (${accessoryCount} items)`);
  }
  
  // Defects assessment
  lines.push(`- **Defect Severity (25%):** ${(scores.defects * 100).toFixed(0)}%`);
  if (spec.defects.length === 0) {
    lines.push('  - No defects reported');
  } else {
    const avgSeverity = spec.defects.reduce((sum, d) => sum + d.severity, 0) / spec.defects.length;
    lines.push(`  - ${spec.defects.length} defect(s) reported, avg severity ${avgSeverity.toFixed(1)}/3`);
    
    // List major defects
    const majorDefects = spec.defects.filter(d => d.severity >= 3);
    if (majorDefects.length > 0) {
      lines.push(`  - Major issues: ${majorDefects.map(d => d.area).join(', ')}`);
    }
  }
  
  // Age/Usage assessment
  lines.push(`- **Age/Usage (25%):** ${(scores.ageUsage * 100).toFixed(0)}%`);
  const purchaseDate = new Date(spec.purchaseDateISO);
  const ageInMonths = Math.round((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  lines.push(`  - ${ageInMonths} months old since purchase`);
  
  if (spec.usage.hours) {
    lines.push(`  - ${spec.usage.hours} usage hours reported`);
  }
  if (spec.usage.cycles) {
    lines.push(`  - ${spec.usage.cycles} usage cycles reported`);
  }
  if (spec.usage.notes.trim()) {
    lines.push(`  - Usage notes: "${spec.usage.notes}"`);
  }
  
  return lines.join('\n');
}

/**
 * Main function to compute ConditionGrade from SellerListingSpec
 */
export function computeConditionGrade(spec: SellerListingSpec): ConditionGrade {
  // Compute individual rubric scores
  const packagingScore = computePackagingScore(spec.accessories);
  const accessoriesScore = computeAccessoriesScore(spec.accessories, spec.category);
  const defectScore = computeDefectScore(spec.defects);
  const ageUsageScore = computeAgeUsageScore(spec.purchaseDateISO, spec.usage);
  
  // Calculate weighted total score
  const totalScore = 
    (packagingScore * RUBRIC_WEIGHTS.packaging) +
    (accessoriesScore * RUBRIC_WEIGHTS.accessories) +
    (defectScore * RUBRIC_WEIGHTS.defects) +
    (ageUsageScore * RUBRIC_WEIGHTS.ageUsage);
  
  // Determine final grade
  const grade = determineGrade(totalScore);
  
  // Prepare scores object for justification
  const scores = {
    packaging: packagingScore,
    accessories: accessoriesScore,
    defects: defectScore,
    ageUsage: ageUsageScore,
    total: totalScore,
  };
  
  // Generate justification
  const justificationMd = generateJustification(grade, scores, spec);
  
  // Build rubric scores array
  const rubricScores = [
    {
      criterionName: 'packaging',
      score: packagingScore,
      notes: `Original packaging and documentation assessment`,
    },
    {
      criterionName: 'accessories',
      score: accessoriesScore,
      notes: `Standard accessories completeness for ${spec.category}`,
    },
    {
      criterionName: 'defects',
      score: defectScore,
      notes: `${spec.defects.length} defect(s) with severity analysis`,
    },
    {
      criterionName: 'ageUsage',
      score: ageUsageScore,
      notes: `Age and usage pattern assessment`,
    },
  ];
  
  return {
    grade,
    justificationMd,
    rubricScores,
  };
}

// Graph definition for the condition grading system
export const conditionGradeGraph = {
  name: 'condition-grade',
  description: 'Compute ConditionGrade from SellerListingSpec using standardized rubric',
  
  nodes: {
    // Entry point - receive SellerListingSpec
    receiveSellerListing: {
      type: 'input',
      description: 'Receive seller listing specification for condition assessment',
      schema: z.object({
        sellerListingSpec: z.custom<SellerListingSpec>(),
      }),
    },

    // Load category-specific rubric criteria
    loadRubricCriteria: {
      type: 'data_retrieval',
      description: 'Load rubric criteria and weights for condition assessment',
      dependencies: ['receiveSellerListing'],
      context: ['rubrics'],
      outputs: [
        'packaging_weight',
        'accessories_weight', 
        'defects_weight',
        'age_usage_weight',
        'grade_thresholds',
      ],
    },

    // Compute packaging score
    assessPackaging: {
      type: 'scoring',
      description: 'Assess packaging completeness and documentation',
      dependencies: ['receiveSellerListing', 'loadRubricCriteria'],
      scoring_factors: [
        'original_box_present',
        'documentation_included',
        'warranty_materials',
      ],
    },

    // Compute accessories completeness score
    assessAccessories: {
      type: 'scoring', 
      description: 'Assess accessories completeness against category standards',
      dependencies: ['receiveSellerListing', 'loadRubricCriteria'],
      scoring_factors: [
        'standard_accessories_match',
        'essential_items_present',
        'category_specific_requirements',
      ],
    },

    // Compute defect severity score
    assessDefects: {
      type: 'scoring',
      description: 'Assess defect severity and impact on condition',
      dependencies: ['receiveSellerListing', 'loadRubricCriteria'],
      scoring_factors: [
        'defect_count',
        'severity_levels',
        'functional_impact',
        'cosmetic_impact',
      ],
    },

    // Compute age and usage score
    assessAgeUsage: {
      type: 'scoring',
      description: 'Assess age and usage impact on condition',
      dependencies: ['receiveSellerListing', 'loadRubricCriteria'],
      scoring_factors: [
        'time_since_purchase',
        'usage_hours',
        'usage_cycles',
        'usage_intensity',
      ],
    },

    // Calculate weighted total score
    calculateWeightedScore: {
      type: 'calculation',
      description: 'Calculate weighted total score from rubric components',
      dependencies: ['assessPackaging', 'assessAccessories', 'assessDefects', 'assessAgeUsage'],
      calculation_method: 'weighted_sum',
      weights: RUBRIC_WEIGHTS,
    },

    // Determine final grade from score
    determineFinalGrade: {
      type: 'decision',
      description: 'Map weighted score to condition grade using thresholds',
      dependencies: ['calculateWeightedScore'],
      decision_logic: 'threshold_mapping',
      thresholds: GRADE_THRESHOLDS,
    },

    // Generate justification markdown
    generateJustification: {
      type: 'synthesis',
      description: 'Generate markdown justification referencing rubric criteria',
      dependencies: ['determineFinalGrade'],
      output_format: 'markdown',
      content_requirements: [
        'reference_rubric_criteria',
        'exclude_photo_references',
        'include_score_breakdown',
        'provide_reasoning',
      ],
    },

    // Final output - ConditionGrade
    conditionGradeComplete: {
      type: 'output',
      description: 'Final condition grade with rubric scores and justification',
      dependencies: ['generateJustification'],
      outputs: {
        grade: 'enum',
        justificationMd: 'string',
        rubricScores: 'array',
      },
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receiveSellerListing',
    max_iterations: 1,
    timeout: 300, // 5 minutes
    error_handling: 'graceful',
    reproducible: true, // Ensures same input produces same output
  },

  // Context requirements
  context: {
    required: ['rubrics'],
    optional: [],
  },
};

export type ConditionGradeGraph = typeof conditionGradeGraph;
