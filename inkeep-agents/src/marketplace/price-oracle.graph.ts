import { z } from 'zod';
import { SellerListingSpec, ConditionGrade, PriceBand } from './data-components';

/**
 * Price Oracle Graph
 * Purpose: produce a PriceBand (quickSale/fair/holdOut) from curated comparables and computed condition grade.
 * 
 * Uses fetchCuratedComps to retrieve comps.
 * Explains adjustments for condition/age/accessories in the explainMd text.
 * Clamps outliers; avoids suggesting prices more than ~20% above comp median unless scarcity is explicitly detected.
 * 
 * Acceptance gate: Output includes comparableIds and a short explanation referencing them.
 */

// Condition adjustment multipliers
const CONDITION_MULTIPLIERS = {
  'new': 1.0,
  'open-box': 0.92,
  'like-new': 0.85,
  'good': 0.72,
  'fair': 0.58,
  'poor': 0.35,
} as const;

// Age adjustment factors (months since purchase)
const AGE_ADJUSTMENTS = {
  0: 1.0,    // 0-3 months
  3: 0.95,   // 3-6 months
  6: 0.90,   // 6-12 months
  12: 0.82,  // 1-2 years
  24: 0.70,  // 2-3 years
  36: 0.55,  // 3+ years
} as const;

// Pricing band spreads from fair market value
const PRICING_SPREADS = {
  quickSale: 0.85,  // 15% below fair
  fair: 1.0,        // baseline
  holdOut: 1.15,    // 15% above fair
} as const;

// Maximum price premium above median (20% cap unless scarcity detected)
const MAX_PREMIUM_CAP = 1.20;
const SCARCITY_PREMIUM_CAP = 1.35;

/**
 * Interface for curated comparable data
 */
interface CuratedComparable {
  id: string;
  price: number;
  conditionGrade: string;
  saleDate: string;
  daysToSell?: number;
  ageAtSale?: number; // months old when sold
  accessoriesIncluded?: string[];
}

/**
 * Fetch curated comparables using the context fetcher
 */
async function fetchCuratedComps(params: {
  category: string;
  makeModel?: string;
  variant?: string;
  year?: number;
}): Promise<CuratedComparable[]> {
  // This would use the CuratedCompsFetcher from context-fetchers.ts
  // For now, return mock data structure
  return [
    {
      id: 'comp_001',
      price: 850,
      conditionGrade: 'good',
      saleDate: '2024-01-15',
      daysToSell: 12,
      ageAtSale: 18,
    },
    {
      id: 'comp_002', 
      price: 920,
      conditionGrade: 'like-new',
      saleDate: '2024-01-20',
      daysToSell: 8,
      ageAtSale: 12,
    },
    {
      id: 'comp_003',
      price: 780,
      conditionGrade: 'fair',
      saleDate: '2024-01-25',
      daysToSell: 18,
      ageAtSale: 24,
    },
  ];
}

/**
 * Calculate age in months from purchase date
 */
function calculateAgeInMonths(purchaseDateISO: string): number {
  const purchaseDate = new Date(purchaseDateISO);
  const now = new Date();
  return Math.round((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
}

/**
 * Get age adjustment factor based on months since purchase
 */
function getAgeAdjustment(ageInMonths: number): number {
  const ageKeys = Object.keys(AGE_ADJUSTMENTS).map(Number).sort((a, b) => a - b);
  
  for (let i = ageKeys.length - 1; i >= 0; i--) {
    if (ageInMonths >= ageKeys[i]) {
      return AGE_ADJUSTMENTS[ageKeys[i] as keyof typeof AGE_ADJUSTMENTS];
    }
  }
  
  return AGE_ADJUSTMENTS[0];
}

/**
 * Calculate accessories adjustment based on completeness
 */
function calculateAccessoriesAdjustment(
  accessories: string[],
  category: string
): number {
  // Standard accessories expected by category
  const standardAccessories: Record<string, string[]> = {
    'electronics': ['original_box', 'charger', 'manual', 'warranty_card'],
    'phone': ['original_box', 'charger', 'cable', 'manual', 'sim_tool'],
    'laptop': ['original_box', 'charger', 'manual', 'warranty_card'],
    'tablet': ['original_box', 'charger', 'cable', 'manual'],
    'gaming': ['original_box', 'controller', 'cables', 'manual'],
    'default': ['original_box', 'manual'],
  };
  
  const expected = standardAccessories[category.toLowerCase()] || standardAccessories.default;
  const accessoriesLower = accessories.map(acc => acc.toLowerCase());
  
  let matchCount = 0;
  for (const expectedAcc of expected) {
    const keywords = expectedAcc.split('_');
    const hasAccessory = keywords.some(keyword => 
      accessoriesLower.some(acc => acc.includes(keyword))
    );
    if (hasAccessory) matchCount++;
  }
  
  const completeness = matchCount / expected.length;
  
  // Accessories adjustment: 0.95-1.05 range
  return 0.95 + (completeness * 0.10);
}

/**
 * Detect scarcity based on comparable data
 */
function detectScarcity(comparables: CuratedComparable[]): boolean {
  if (comparables.length < 3) return true; // Few comparables = scarcity
  
  // Check if average days to sell is very low (high demand)
  const avgDaysToSell = comparables
    .filter(c => c.daysToSell !== undefined)
    .reduce((sum, c) => sum + (c.daysToSell || 0), 0) / comparables.length;
  
  if (avgDaysToSell < 5) return true; // Very fast sales = scarcity
  
  // Check price trend (recent sales significantly higher)
  const sortedByDate = [...comparables].sort((a, b) => 
    new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
  );
  
  if (sortedByDate.length >= 3) {
    const recentAvg = sortedByDate.slice(0, 2).reduce((sum, c) => sum + c.price, 0) / 2;
    const olderAvg = sortedByDate.slice(2).reduce((sum, c) => sum + c.price, 0) / (sortedByDate.length - 2);
    
    if (recentAvg > olderAvg * 1.15) return true; // 15% price increase = scarcity
  }
  
  return false;
}

/**
 * Calculate condition-adjusted price from comparables
 */
function calculateConditionAdjustedPrice(
  comparables: CuratedComparable[],
  targetCondition: ConditionGrade['grade']
): number {
  if (comparables.length === 0) return 0;
  
  // Calculate condition-adjusted prices for each comparable
  const adjustedPrices = comparables.map(comp => {
    const compConditionMultiplier = CONDITION_MULTIPLIERS[comp.conditionGrade as keyof typeof CONDITION_MULTIPLIERS] || 0.7;
    const targetConditionMultiplier = CONDITION_MULTIPLIERS[targetCondition];
    
    // Adjust comparable price to target condition
    return comp.price * (targetConditionMultiplier / compConditionMultiplier);
  });
  
  // Return median of adjusted prices
  adjustedPrices.sort((a, b) => a - b);
  const mid = Math.floor(adjustedPrices.length / 2);
  
  if (adjustedPrices.length % 2 === 0) {
    return (adjustedPrices[mid - 1] + adjustedPrices[mid]) / 2;
  } else {
    return adjustedPrices[mid];
  }
}

/**
 * Generate explanation markdown
 */
function generateExplanation(
  priceBand: Omit<PriceBand, 'explainMd'>,
  comparables: CuratedComparable[],
  adjustments: {
    condition: number;
    age: number;
    accessories: number;
    scarcity: boolean;
  },
  spec: SellerListingSpec,
  conditionGrade: ConditionGrade
): string {
  const lines: string[] = [];
  
  lines.push(`**Price Analysis for ${spec.category}**`);
  lines.push('');
  
  // Comparables summary
  lines.push(`**Comparable Sales Analysis:**`);
  lines.push(`- Found ${comparables.length} comparable sales`);
  lines.push(`- Comparable IDs: ${comparables.map(c => c.id).join(', ')}`);
  
  if (comparables.length > 0) {
    const prices = comparables.map(c => c.price);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const medianPrice = [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)];
    
    lines.push(`- Price range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
    lines.push(`- Average: $${Math.round(avgPrice)}, Median: $${Math.round(medianPrice)}`);
  }
  
  lines.push('');
  lines.push(`**Adjustments Applied:**`);
  
  // Condition adjustment
  lines.push(`- **Condition (${conditionGrade.grade}):** ${(adjustments.condition * 100).toFixed(0)}% of base price`);
  if (adjustments.condition < 1.0) {
    lines.push(`  - Condition grade reduces value due to wear/defects`);
  } else if (adjustments.condition > 1.0) {
    lines.push(`  - Premium condition maintains higher value`);
  }
  
  // Age adjustment
  const ageInMonths = calculateAgeInMonths(spec.purchaseDateISO);
  lines.push(`- **Age (${ageInMonths} months old):** ${(adjustments.age * 100).toFixed(0)}% adjustment`);
  if (adjustments.age < 1.0) {
    lines.push(`  - Age depreciation applied for ${ageInMonths}-month-old item`);
  }
  
  // Accessories adjustment
  lines.push(`- **Accessories (${spec.accessories.length} items):** ${(adjustments.accessories * 100).toFixed(0)}% adjustment`);
  if (adjustments.accessories > 1.0) {
    lines.push(`  - Complete accessories package adds value`);
  } else if (adjustments.accessories < 1.0) {
    lines.push(`  - Missing accessories reduce value`);
  }
  
  // Scarcity detection
  if (adjustments.scarcity) {
    lines.push(`- **Scarcity Premium:** Applied due to limited supply or high demand`);
  }
  
  lines.push('');
  lines.push(`**Final Price Recommendations:**`);
  lines.push(`- **Quick Sale:** $${priceBand.quickSale} (sell within days)`);
  lines.push(`- **Fair Market:** $${priceBand.fair} (balanced approach)`);
  lines.push(`- **Hold Out:** $${priceBand.holdOut} (patient seller)`);
  
  return lines.join('\n');
}

/**
 * Main function to compute PriceBand from SellerListingSpec and ConditionGrade
 */
export async function computePriceBand(
  spec: SellerListingSpec,
  conditionGrade: ConditionGrade
): Promise<PriceBand> {
  // Fetch curated comparables
  const comparables = await fetchCuratedComps({
    category: spec.category,
    makeModel: spec.makeModel,
    variant: spec.variant,
    year: spec.year,
  });
  
  if (comparables.length === 0) {
    throw new Error('No comparable sales found for pricing analysis');
  }
  
  // Calculate base price from condition-adjusted comparables
  const basePrice = calculateConditionAdjustedPrice(comparables, conditionGrade.grade);
  
  // Calculate adjustments
  const ageInMonths = calculateAgeInMonths(spec.purchaseDateISO);
  const conditionMultiplier = CONDITION_MULTIPLIERS[conditionGrade.grade];
  const ageAdjustment = getAgeAdjustment(ageInMonths);
  const accessoriesAdjustment = calculateAccessoriesAdjustment(spec.accessories, spec.category);
  const scarcityDetected = detectScarcity(comparables);
  
  // Apply all adjustments to base price
  let adjustedPrice = basePrice * ageAdjustment * accessoriesAdjustment;
  
  // Calculate median comparable price for capping
  const comparablePrices = comparables.map(c => c.price).sort((a, b) => a - b);
  const medianComparablePrice = comparablePrices[Math.floor(comparablePrices.length / 2)];
  
  // Apply premium cap (20% above median unless scarcity detected)
  const premiumCap = scarcityDetected ? SCARCITY_PREMIUM_CAP : MAX_PREMIUM_CAP;
  const maxAllowedPrice = medianComparablePrice * premiumCap;
  
  if (adjustedPrice > maxAllowedPrice) {
    adjustedPrice = maxAllowedPrice;
  }
  
  // Calculate price band
  const fairPrice = Math.round(adjustedPrice);
  const quickSalePrice = Math.round(fairPrice * PRICING_SPREADS.quickSale);
  const holdOutPrice = Math.round(fairPrice * PRICING_SPREADS.holdOut);
  
  // Prepare adjustments object for explanation
  const adjustments = {
    condition: conditionMultiplier,
    age: ageAdjustment,
    accessories: accessoriesAdjustment,
    scarcity: scarcityDetected,
  };
  
  // Build price band object
  const priceBand: Omit<PriceBand, 'explainMd'> = {
    quickSale: quickSalePrice,
    fair: fairPrice,
    holdOut: holdOutPrice,
    comparableIds: comparables.map(c => c.id),
  };
  
  // Generate explanation
  const explainMd = generateExplanation(priceBand, comparables, adjustments, spec, conditionGrade);
  
  return {
    ...priceBand,
    explainMd,
  };
}

// Graph definition for the price oracle system
export const priceOracleGraph = {
  name: 'price-oracle',
  description: 'Produce PriceBand from curated comparables and computed condition grade',
  
  nodes: {
    // Entry point - receive SellerListingSpec and ConditionGrade
    receivePricingInputs: {
      type: 'input',
      description: 'Receive seller listing spec and condition grade for pricing',
      schema: z.object({
        sellerListingSpec: z.custom<SellerListingSpec>(),
        conditionGrade: z.custom<ConditionGrade>(),
      }),
    },

    // Fetch curated comparables
    fetchCuratedComparables: {
      type: 'data_retrieval',
      description: 'Fetch curated comparable sales data',
      dependencies: ['receivePricingInputs'],
      context: ['curatedComps'],
      tools: ['fetchCuratedComps'],
      outputs: [
        'comparable_sales',
        'price_ranges',
        'sale_velocities',
        'condition_distributions',
      ],
    },

    // Analyze comparable sales data
    analyzeComparables: {
      type: 'analysis',
      description: 'Analyze comparable sales for pricing patterns',
      dependencies: ['fetchCuratedComparables'],
      analysis_types: [
        'price_distribution',
        'condition_correlation',
        'age_depreciation',
        'market_velocity',
      ],
    },

    // Calculate condition adjustments
    calculateConditionAdjustments: {
      type: 'calculation',
      description: 'Apply condition-based pricing adjustments',
      dependencies: ['analyzeComparables', 'receivePricingInputs'],
      adjustment_factors: CONDITION_MULTIPLIERS,
    },

    // Calculate age and usage adjustments
    calculateAgeAdjustments: {
      type: 'calculation',
      description: 'Apply age and usage depreciation adjustments',
      dependencies: ['receivePricingInputs'],
      adjustment_factors: AGE_ADJUSTMENTS,
    },

    // Calculate accessories adjustments
    calculateAccessoriesAdjustments: {
      type: 'calculation',
      description: 'Apply accessories completeness adjustments',
      dependencies: ['receivePricingInputs'],
      calculation_method: 'completeness_scoring',
    },

    // Detect market scarcity
    detectMarketScarcity: {
      type: 'analysis',
      description: 'Detect scarcity conditions for premium pricing',
      dependencies: ['analyzeComparables'],
      scarcity_indicators: [
        'low_supply_count',
        'fast_sale_velocity',
        'price_trend_upward',
        'demand_signals',
      ],
    },

    // Apply pricing caps and limits
    applyPricingCaps: {
      type: 'validation',
      description: 'Apply maximum pricing caps to prevent outliers',
      dependencies: ['calculateConditionAdjustments', 'calculateAgeAdjustments', 'calculateAccessoriesAdjustments', 'detectMarketScarcity'],
      caps: {
        standard_premium: MAX_PREMIUM_CAP,
        scarcity_premium: SCARCITY_PREMIUM_CAP,
      },
    },

    // Generate price band recommendations
    generatePriceBand: {
      type: 'synthesis',
      description: 'Generate final price band with quick/fair/holdout prices',
      dependencies: ['applyPricingCaps'],
      pricing_spreads: PRICING_SPREADS,
    },

    // Generate pricing explanation
    generatePricingExplanation: {
      type: 'synthesis',
      description: 'Generate markdown explanation referencing comparables and adjustments',
      dependencies: ['generatePriceBand'],
      output_format: 'markdown',
      content_requirements: [
        'reference_comparable_ids',
        'explain_condition_adjustments',
        'explain_age_adjustments',
        'explain_accessories_impact',
        'justify_pricing_decisions',
      ],
    },

    // Final output - PriceBand
    priceBandComplete: {
      type: 'output',
      description: 'Final price band with comparables and explanation',
      dependencies: ['generatePricingExplanation'],
      outputs: {
        quickSale: 'number',
        fair: 'number',
        holdOut: 'number',
        comparableIds: 'array',
        explainMd: 'string',
      },
    },

    // Insufficient data state
    requestMoreComparables: {
      type: 'feedback',
      description: 'Request more comparable data for accurate pricing',
      dependencies: ['fetchCuratedComparables'],
      loops_to: 'receivePricingInputs',
      data_requests: [
        'additional_comparables',
        'broader_search_criteria',
        'alternative_categories',
        'manual_price_research',
      ],
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receivePricingInputs',
    max_iterations: 2,
    timeout: 600, // 10 minutes
    error_handling: 'graceful',
    reproducible: true,
  },

  // Context requirements
  context: {
    required: ['curatedComps'],
    optional: ['marketData', 'externalMarket'],
  },
};

export type PriceOracleGraph = typeof priceOracleGraph;
