/**
 * Clothing Category Grading Rubric
 * Standardized criteria for grading clothing and apparel items
 */

export const clothingRubric = {
  category: 'clothing',
  version: '1.0',
  lastUpdated: '2024-01-01',
  
  // Condition definitions specific to clothing
  conditionDefinitions: {
    new: {
      description: 'Brand new with tags, never worn',
      criteria: [
        'Original tags attached',
        'No signs of wear',
        'No odors or stains',
        'Original packaging if applicable',
        'Perfect condition',
      ],
      priceMultiplier: 1.0,
    },
    
    'like-new': {
      description: 'Worn once or twice, excellent condition',
      criteria: [
        'May not have original tags',
        'No visible wear',
        'No stains or odors',
        'Maintains original shape',
        'Like new appearance',
      ],
      priceMultiplier: 0.80,
    },
    
    good: {
      description: 'Gently used with minimal signs of wear',
      criteria: [
        'Minor signs of wear acceptable',
        'No stains or holes',
        'Good structural integrity',
        'Clean and odor-free',
        'Still fashionable/current',
      ],
      priceMultiplier: 0.60,
    },
    
    fair: {
      description: 'Noticeable wear but still wearable',
      criteria: [
        'Visible wear patterns',
        'Minor stains may be present',
        'Some fading acceptable',
        'Structural integrity intact',
        'Clean condition',
      ],
      priceMultiplier: 0.40,
    },
    
    poor: {
      description: 'Significant wear, damage, or for parts/repair',
      criteria: [
        'Major stains or damage',
        'Structural issues (tears, holes)',
        'Significant fading or discoloration',
        'May need repairs',
        'Sold as-is',
      ],
      priceMultiplier: 0.20,
    },
  },

  // Specific inspection points for clothing
  inspectionPoints: {
    fabric: [
      'Fabric integrity (no holes or tears)',
      'Color retention/fading',
      'Texture and feel',
      'Pilling or fuzzing',
      'Stretch retention',
    ],
    construction: [
      'Seam integrity',
      'Button/zipper functionality',
      'Hem condition',
      'Lining condition',
      'Hardware condition',
    ],
    cleanliness: [
      'Stain presence and severity',
      'Odor assessment',
      'General cleanliness',
      'Pet hair/lint',
      'Washing care followed',
    ],
    fit: [
      'Size accuracy',
      'Shape retention',
      'Stretch/shrinkage',
      'Proportional wear',
      'Alteration quality',
    ],
  },

  // Common defects and their impact
  defectImpact: {
    minor: {
      examples: ['Light pilling', 'Minor fading', 'Small loose thread'],
      gradeImpact: 0,
      priceImpact: 0.95,
    },
    moderate: {
      examples: ['Noticeable fading', 'Small stain', 'Missing button'],
      gradeImpact: -1,
      priceImpact: 0.80,
    },
    major: {
      examples: ['Large stain', 'Small hole', 'Broken zipper'],
      gradeImpact: -2,
      priceImpact: 0.50,
    },
    severe: {
      examples: ['Multiple holes', 'Large tears', 'Permanent stains'],
      gradeImpact: -3,
      priceImpact: 0.25,
    },
  },

  // Brand-specific considerations
  brandFactors: {
    luxury: {
      brands: ['Gucci', 'Louis Vuitton', 'Chanel', 'Hermès'],
      conditionSensitivity: 'high',
      authenticityRequired: true,
      priceRetention: 0.7,
    },
    designer: {
      brands: ['Ralph Lauren', 'Calvin Klein', 'Tommy Hilfiger'],
      conditionSensitivity: 'medium',
      authenticityRequired: false,
      priceRetention: 0.5,
    },
    mainstream: {
      brands: ['Gap', 'Old Navy', 'Target'],
      conditionSensitivity: 'low',
      authenticityRequired: false,
      priceRetention: 0.3,
    },
  },
};

export type ClothingRubric = typeof clothingRubric;
