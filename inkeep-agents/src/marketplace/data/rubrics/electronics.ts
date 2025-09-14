/**
 * Electronics Category Grading Rubric
 * Standardized criteria for grading electronic devices and components
 */

export const electronicsRubric = {
  category: 'electronics',
  version: '1.0',
  lastUpdated: '2024-01-01',
  
  // Condition definitions specific to electronics
  conditionDefinitions: {
    new: {
      description: 'Brand new, unopened, with original packaging and all accessories',
      criteria: [
        'Original sealed packaging',
        'All original accessories included',
        'No signs of use or wear',
        'Valid warranty',
        'Original documentation',
      ],
      priceMultiplier: 1.0,
    },
    
    'like-new': {
      description: 'Opened but unused, or minimal use with no visible wear',
      criteria: [
        'Original packaging (may be opened)',
        'All accessories present',
        'No visible wear or scratches',
        'Full functionality',
        'Warranty may be activated',
      ],
      priceMultiplier: 0.85,
    },
    
    good: {
      description: 'Used with minor signs of wear but fully functional',
      criteria: [
        'Minor cosmetic wear acceptable',
        'All major functions work properly',
        'May have light scratches or scuffs',
        'Most accessories present',
        'No significant damage',
      ],
      priceMultiplier: 0.70,
    },
    
    fair: {
      description: 'Noticeable wear but still functional',
      criteria: [
        'Visible wear and tear',
        'All essential functions work',
        'May have minor functional issues',
        'Some accessories may be missing',
        'Cosmetic damage acceptable',
      ],
      priceMultiplier: 0.50,
    },
    
    poor: {
      description: 'Significant wear or functional issues, sold as-is',
      criteria: [
        'Major cosmetic damage',
        'Some functions may not work',
        'Missing accessories common',
        'Sold for parts or repair',
        'No warranty implied',
      ],
      priceMultiplier: 0.25,
    },
  },

  // Specific inspection points for electronics
  inspectionPoints: {
    physical: [
      'Screen condition (if applicable)',
      'Button functionality',
      'Port condition',
      'Case/housing integrity',
      'Battery condition',
    ],
    functional: [
      'Power on/off',
      'All advertised features work',
      'Connectivity (WiFi, Bluetooth, etc.)',
      'Audio/video quality',
      'Performance benchmarks',
    ],
    accessories: [
      'Original charger/power adapter',
      'Cables and connectors',
      'Remote controls',
      'Documentation/manuals',
      'Original packaging',
    ],
  },

  // Common defects and their impact
  defectImpact: {
    minor: {
      examples: ['Light scratches', 'Minor scuffs', 'Worn labels'],
      gradeImpact: 0,
      priceImpact: 0.95,
    },
    moderate: {
      examples: ['Visible scratches', 'Dents', 'Missing non-essential accessories'],
      gradeImpact: -1,
      priceImpact: 0.85,
    },
    major: {
      examples: ['Cracked screen', 'Non-functional buttons', 'Missing essential accessories'],
      gradeImpact: -2,
      priceImpact: 0.60,
    },
    severe: {
      examples: ['Water damage', 'Multiple non-functional features', 'Structural damage'],
      gradeImpact: -3,
      priceImpact: 0.30,
    },
  },
};

export type ElectronicsRubric = typeof electronicsRubric;
