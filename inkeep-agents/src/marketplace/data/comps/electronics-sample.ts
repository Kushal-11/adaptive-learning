/**
 * Sample Electronics Comparables
 * Seed data for electronics pricing comparisons
 */

export const electronicsComparables = {
  category: 'electronics',
  lastUpdated: '2024-01-01',
  
  // Sample iPhone comparables
  iphone: {
    model: 'iPhone 14 Pro',
    storage: '128GB',
    color: 'Space Black',
    comparables: [
      {
        id: 'comp-001',
        condition: 'like-new',
        price: 899,
        soldDate: '2024-01-15',
        location: 'San Francisco, CA',
        daysToSell: 3,
        originalPrice: 999,
        source: 'internal',
      },
      {
        id: 'comp-002',
        condition: 'good',
        price: 750,
        soldDate: '2024-01-10',
        location: 'Los Angeles, CA',
        daysToSell: 7,
        originalPrice: 850,
        source: 'internal',
      },
      {
        id: 'comp-003',
        condition: 'fair',
        price: 650,
        soldDate: '2024-01-05',
        location: 'Seattle, WA',
        daysToSell: 14,
        originalPrice: 750,
        source: 'external-ebay',
      },
    ],
  },

  // Sample laptop comparables
  laptop: {
    model: 'MacBook Air M2',
    storage: '256GB',
    memory: '8GB',
    comparables: [
      {
        id: 'comp-004',
        condition: 'like-new',
        price: 1050,
        soldDate: '2024-01-12',
        location: 'Austin, TX',
        daysToSell: 5,
        originalPrice: 1199,
        source: 'internal',
      },
      {
        id: 'comp-005',
        condition: 'good',
        price: 900,
        soldDate: '2024-01-08',
        location: 'Denver, CO',
        daysToSell: 10,
        originalPrice: 1000,
        source: 'external-facebook',
      },
    ],
  },

  // Sample gaming console comparables
  gaming: {
    model: 'PlayStation 5',
    variant: 'Standard Edition',
    comparables: [
      {
        id: 'comp-006',
        condition: 'new',
        price: 499,
        soldDate: '2024-01-20',
        location: 'New York, NY',
        daysToSell: 1,
        originalPrice: 499,
        source: 'internal',
      },
      {
        id: 'comp-007',
        condition: 'like-new',
        price: 450,
        soldDate: '2024-01-18',
        location: 'Chicago, IL',
        daysToSell: 2,
        originalPrice: 480,
        source: 'external-ebay',
      },
    ],
  },

  // Market trends for electronics
  marketTrends: {
    smartphones: {
      demandLevel: 'high',
      supplyLevel: 'medium',
      priceDirection: 'declining',
      seasonality: 'new_model_releases_affect_pricing',
      averageDaysToSell: 5,
    },
    laptops: {
      demandLevel: 'high',
      supplyLevel: 'medium',
      priceDirection: 'stable',
      seasonality: 'back_to_school_boost',
      averageDaysToSell: 8,
    },
    gaming: {
      demandLevel: 'very-high',
      supplyLevel: 'low',
      priceDirection: 'rising',
      seasonality: 'holiday_season_premium',
      averageDaysToSell: 2,
    },
  },
};

export type ElectronicsComparables = typeof electronicsComparables;
