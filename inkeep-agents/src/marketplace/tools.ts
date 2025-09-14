import { z } from 'zod';

/**
 * Tool definitions for marketplace operations
 * Each tool performs specific marketplace functions with clear scope and safety constraints
 */

// ===== GEO TOOLS =====

/**
 * GeoTools: Provides geographic calculations for location-based marketplace features
 * Scope: Distance calculations and proximity bucketing for local marketplace operations
 * Safety: Pure mathematical operations with no external API calls or data persistence
 */

export const distanceKmTool = {
  name: 'distance_km',
  description: 'Calculate distance between two geographic points using Haversine formula',
  parameters: z.object({
    pointA: z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
    }),
    pointB: z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
    }),
  }),
  execute: async (params: z.infer<typeof distanceKmTool.parameters>) => {
    const { pointA, pointB } = params;
    
    // Haversine formula implementation
    const R = 6371; // Earth's radius in kilometers
    const dLat = (pointB.lat - pointA.lat) * Math.PI / 180;
    const dLon = (pointB.lon - pointA.lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pointA.lat * Math.PI / 180) * Math.cos(pointB.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return {
      distanceKm: Math.round(distance * 100) / 100, // Round to 2 decimal places
      pointA,
      pointB,
    };
  },
};

export const geohashTool = {
  name: 'geohash',
  description: 'Generate geohash for geographic coordinates to enable proximity bucketing',
  parameters: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    precision: z.number().int().min(1).max(12).default(8),
  }),
  execute: async (params: z.infer<typeof geohashTool.parameters>) => {
    const { lat, lon, precision } = params;
    
    // Simple geohash implementation for proximity bucketing
    const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    let latRange = [-90, 90];
    let lonRange = [-180, 180];
    let geohash = '';
    let isEven = true;
    let bit = 0;
    let ch = 0;
    
    while (geohash.length < precision) {
      if (isEven) {
        const mid = (lonRange[0] + lonRange[1]) / 2;
        if (lon >= mid) {
          ch |= (1 << (4 - bit));
          lonRange[0] = mid;
        } else {
          lonRange[1] = mid;
        }
      } else {
        const mid = (latRange[0] + latRange[1]) / 2;
        if (lat >= mid) {
          ch |= (1 << (4 - bit));
          latRange[0] = mid;
        } else {
          latRange[1] = mid;
        }
      }
      
      isEven = !isEven;
      if (bit < 4) {
        bit++;
      } else {
        geohash += base32[ch];
        bit = 0;
        ch = 0;
      }
    }
    
    return {
      geohash,
      lat,
      lon,
      precision,
    };
  },
};

// ===== TIMESLOT TOOLS =====

/**
 * TimeslotTools: Handles time-based scheduling and availability calculations
 * Scope: Intersection calculations for delivery/pickup scheduling coordination
 * Safety: Pure algorithmic operations with no external dependencies or side effects
 */

export const intersectTimeslotsTool = {
  name: 'intersect_timeslots',
  description: 'Find maximal overlapping time periods between two timeslot sets',
  parameters: z.object({
    timeslotsA: z.array(z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
      id: z.string().optional(),
    })),
    timeslotsB: z.array(z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
      id: z.string().optional(),
    })),
  }),
  execute: async (params: z.infer<typeof intersectTimeslotsTool.parameters>) => {
    const { timeslotsA, timeslotsB } = params;
    const overlaps: Array<{
      start: string;
      end: string;
      durationMinutes: number;
      sourceA: string | undefined;
      sourceB: string | undefined;
    }> = [];
    
    for (const slotA of timeslotsA) {
      for (const slotB of timeslotsB) {
        const startA = new Date(slotA.start);
        const endA = new Date(slotA.end);
        const startB = new Date(slotB.start);
        const endB = new Date(slotB.end);
        
        // Find intersection
        const overlapStart = new Date(Math.max(startA.getTime(), startB.getTime()));
        const overlapEnd = new Date(Math.min(endA.getTime(), endB.getTime()));
        
        // Check if there's actual overlap
        if (overlapStart < overlapEnd) {
          const durationMs = overlapEnd.getTime() - overlapStart.getTime();
          const durationMinutes = Math.floor(durationMs / (1000 * 60));
          
          overlaps.push({
            start: overlapStart.toISOString(),
            end: overlapEnd.toISOString(),
            durationMinutes,
            sourceA: slotA.id,
            sourceB: slotB.id,
          });
        }
      }
    }
    
    // Sort by duration (maximal overlaps first)
    overlaps.sort((a, b) => b.durationMinutes - a.durationMinutes);
    
    return {
      overlaps,
      totalOverlaps: overlaps.length,
      maxDurationMinutes: overlaps.length > 0 ? overlaps[0].durationMinutes : 0,
    };
  },
};

// ===== PHOTO QUALITY TOOL =====

/**
 * PhotoQualityTool: Analyzes image technical quality without semantic understanding
 * Scope: Detects blur, low-light, and glare issues that affect marketplace photo usability
 * Safety: Technical analysis only - no content interpretation or object recognition
 */

export const checkQualityTool = {
  name: 'check_quality',
  description: 'Check photo quality for blur, low-light, and glare issues without semantic analysis',
  parameters: z.object({
    fileList: z.array(z.object({
      url: z.string().url(),
      filename: z.string(),
      sizeBytes: z.number().positive().optional(),
    })),
  }),
  execute: async (params: z.infer<typeof checkQualityTool.parameters>) => {
    const { fileList } = params;
    
    type QualityResult = {
      filename: string;
      url: string;
      qualityScore: number;
      flags: {
        blur: boolean;
        lowLight: boolean;
        glare: boolean;
      };
      issues: string[];
      acceptable: boolean;
    };
    
    const results: QualityResult[] = [];
    
    for (const file of fileList) {
      // Simulate technical quality analysis (blur, lighting, glare detection)
      // In real implementation, this would use image processing algorithms
      const qualityFlags = {
        blur: Math.random() > 0.8, // 20% chance of blur detection
        lowLight: Math.random() > 0.85, // 15% chance of low light
        glare: Math.random() > 0.9, // 10% chance of glare
      };
      
      const qualityScore = 100 - 
        (qualityFlags.blur ? 30 : 0) - 
        (qualityFlags.lowLight ? 25 : 0) - 
        (qualityFlags.glare ? 20 : 0);
      
      results.push({
        filename: file.filename,
        url: file.url,
        qualityScore,
        flags: qualityFlags,
        issues: [
          ...(qualityFlags.blur ? ['Image appears blurry'] : []),
          ...(qualityFlags.lowLight ? ['Insufficient lighting'] : []),
          ...(qualityFlags.glare ? ['Glare detected'] : []),
        ],
        acceptable: qualityScore >= 70,
      });
    }
    
    return {
      results,
      overallAcceptable: results.every(r => r.acceptable),
      averageQualityScore: results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length,
    };
  },
};

// ===== COMP SCORER TOOL =====

/**
 * CompScorerTool: Generates pricing anchors based on comparable sales analysis
 * Scope: Statistical analysis of comparables to produce quickSale/fair/holdOut price points
 * Safety: Mathematical calculations only - no external market data fetching or storage
 */

export const compScorerTool = {
  name: 'comp_scorer',
  description: 'Generate pricing anchors from comparable sales using weighted percentiles and adjustments',
  parameters: z.object({
    sellerListingSpec: z.object({
      category: z.string(),
      condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']),
      age: z.number().nonnegative(), // in months
      accessories: z.array(z.string()),
      brand: z.string().optional(),
    }),
    comparables: z.array(z.object({
      soldPrice: z.number().positive(),
      condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']),
      age: z.number().nonnegative(),
      accessories: z.array(z.string()),
      daysSinceSold: z.number().nonnegative(),
      weight: z.number().positive().default(1.0),
    })),
  }),
  execute: async (params: z.infer<typeof compScorerTool.parameters>) => {
    const { sellerListingSpec, comparables } = params;
    
    if (comparables.length === 0) {
      throw new Error('No comparables provided for scoring');
    }
    
    // Apply condition adjustments
    const conditionMultipliers = {
      'new': 1.0,
      'like-new': 0.95,
      'good': 0.85,
      'fair': 0.70,
      'poor': 0.50,
    };
    
    // Apply age adjustments (depreciation)
    const ageAdjustment = (age: number) => Math.max(0.5, 1 - (age * 0.02)); // 2% per month
    
    // Calculate adjusted prices with weights
    const adjustedPrices = comparables.map(comp => {
      let adjustedPrice = comp.soldPrice;
      
      // Condition adjustment
      const conditionDiff = conditionMultipliers[sellerListingSpec.condition] / conditionMultipliers[comp.condition];
      adjustedPrice *= conditionDiff;
      
      // Age adjustment
      const ageDiff = ageAdjustment(sellerListingSpec.age) / ageAdjustment(comp.age);
      adjustedPrice *= ageDiff;
      
      // Accessories bonus (5% per matching accessory)
      const matchingAccessories = sellerListingSpec.accessories.filter(acc => 
        comp.accessories.includes(acc)
      ).length;
      adjustedPrice *= (1 + matchingAccessories * 0.05);
      
      return {
        price: adjustedPrice,
        weight: comp.weight,
      };
    });
    
    // Sort by price for percentile calculations
    adjustedPrices.sort((a, b) => a.price - b.price);
    
    // Calculate weighted percentiles
    const totalWeight = adjustedPrices.reduce((sum, item) => sum + item.weight, 0);
    let cumulativeWeight = 0;
    
    const findWeightedPercentile = (targetPercentile: number) => {
      const targetWeight = totalWeight * targetPercentile;
      for (const item of adjustedPrices) {
        cumulativeWeight += item.weight;
        if (cumulativeWeight >= targetWeight) {
          return item.price;
        }
      }
      return adjustedPrices[adjustedPrices.length - 1].price;
    };
    
    const quickSale = Math.round(findWeightedPercentile(0.25)); // 25th percentile
    const fair = Math.round(findWeightedPercentile(0.50)); // 50th percentile (median)
    const holdOut = Math.round(findWeightedPercentile(0.75)); // 75th percentile
    
    return {
      anchors: {
        quickSale,
        fair,
        holdOut,
      },
      analysis: {
        comparablesUsed: comparables.length,
        averagePrice: Math.round(adjustedPrices.reduce((sum, item) => sum + item.price, 0) / adjustedPrices.length),
        priceRange: {
          min: Math.round(adjustedPrices[0].price),
          max: Math.round(adjustedPrices[adjustedPrices.length - 1].price),
        },
        conditionAdjustment: conditionMultipliers[sellerListingSpec.condition],
        ageAdjustment: ageAdjustment(sellerListingSpec.age),
      },
    };
  },
};

// ===== COMPLIANCE RULES TOOL =====

/**
 * ComplianceRulesTool: Validates listings against prohibited categories and risky content
 * Scope: Rule-based checking for policy violations and risk indicators
 * Safety: Pattern matching only - no external API calls or data collection
 */

export const complianceRulesTool = {
  name: 'compliance_rules',
  description: 'Check listings against prohibited categories and risky phrases for policy compliance',
  parameters: z.object({
    listing: z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      price: z.number().positive(),
      images: z.array(z.string().url()).optional(),
    }),
  }),
  execute: async (params: z.infer<typeof complianceRulesTool.parameters>) => {
    const { listing } = params;
    
    // Prohibited categories
    const prohibitedCategories = [
      'weapons',
      'ammunition',
      'explosives',
      'drugs',
      'prescription-medications',
      'tobacco',
      'alcohol',
      'adult-content',
      'live-animals',
      'human-remains',
      'hazardous-materials',
    ];
    
    // Risky phrases that indicate potential violations
    const riskyPhrases = [
      'replica',
      'counterfeit',
      'fake',
      'knock-off',
      'bootleg',
      'recalled',
      'defective',
      'broken',
      'not working',
      'for parts',
      'stolen',
      'hot',
      'no questions asked',
      'cash only',
      'untraceable',
    ];
    
    // Recall indicators
    const recallIndicators = [
      'recall',
      'safety warning',
      'consumer alert',
      'hazard',
      'injury risk',
      'choking hazard',
      'fire risk',
    ];
    
    const violations: string[] = [];
    const warnings: string[] = [];
    const risks: string[] = [];
    
    // Check prohibited categories
    const categoryLower = listing.category.toLowerCase();
    for (const prohibited of prohibitedCategories) {
      if (categoryLower.includes(prohibited)) {
        violations.push(`Prohibited category detected: ${prohibited}`);
      }
    }
    
    // Check risky phrases in title and description
    const textToCheck = `${listing.title} ${listing.description}`.toLowerCase();
    
    for (const phrase of riskyPhrases) {
      if (textToCheck.includes(phrase)) {
        warnings.push(`Risky phrase detected: "${phrase}"`);
      }
    }
    
    for (const indicator of recallIndicators) {
      if (textToCheck.includes(indicator)) {
        risks.push(`Recall indicator detected: "${indicator}"`);
      }
    }
    
    // Price-based risk assessment
    if (listing.price < 1) {
      warnings.push('Suspiciously low price (under $1)');
    }
    
    // Calculate compliance score
    const totalIssues = violations.length + warnings.length + risks.length;
    const complianceScore = Math.max(0, 100 - (violations.length * 30) - (warnings.length * 15) - (risks.length * 10));
    
    return {
      compliant: violations.length === 0,
      complianceScore,
      violations,
      warnings,
      risks,
      summary: {
        totalIssues,
        riskLevel: violations.length > 0 ? 'high' : warnings.length > 2 ? 'medium' : 'low',
        actionRequired: violations.length > 0 ? 'reject' : warnings.length > 3 ? 'review' : 'approve',
      },
    };
  },
};

// ===== TOOL REGISTRY =====

export const geoTools = {
  distanceKm: distanceKmTool,
  geohash: geohashTool,
};

export const timeslotTools = {
  intersectTimeslots: intersectTimeslotsTool,
};

export const photoQualityTools = {
  checkQuality: checkQualityTool,
};

export const compScorerTools = {
  compScorer: compScorerTool,
};

export const complianceTools = {
  complianceRules: complianceRulesTool,
};

// Combined tool registry
export const marketplaceTools = {
  ...geoTools,
  ...timeslotTools,
  ...photoQualityTools,
  ...compScorerTools,
  ...complianceTools,
};

export type MarketplaceToolType = keyof typeof marketplaceTools;

// Tool categories for organized access
export const toolCategories = {
  geo: geoTools,
  timeslot: timeslotTools,
  photoQuality: photoQualityTools,
  compScorer: compScorerTools,
  compliance: complianceTools,
} as const;
