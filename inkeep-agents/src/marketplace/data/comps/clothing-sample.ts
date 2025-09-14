/**
 * Sample Clothing Comparables
 * Seed data for clothing pricing comparisons
 */

export const clothingComparables = {
  category: 'clothing',
  lastUpdated: '2024-01-01',
  
  // Sample designer jeans comparables
  designerJeans: {
    brand: 'Levi\'s',
    model: '501 Original',
    size: '32x32',
    color: 'Dark Blue',
    comparables: [
      {
        id: 'comp-c001',
        condition: 'like-new',
        price: 45,
        soldDate: '2024-01-15',
        location: 'Portland, OR',
        daysToSell: 4,
        originalPrice: 60,
        source: 'internal',
      },
      {
        id: 'comp-c002',
        condition: 'good',
        price: 35,
        soldDate: '2024-01-12',
        location: 'San Diego, CA',
        daysToSell: 8,
        originalPrice: 45,
        source: 'internal',
      },
      {
        id: 'comp-c003',
        condition: 'fair',
        price: 25,
        soldDate: '2024-01-08',
        location: 'Phoenix, AZ',
        daysToSell: 12,
        originalPrice: 35,
        source: 'external-poshmark',
      },
    ],
  },

  // Sample luxury handbag comparables
  luxuryBag: {
    brand: 'Coach',
    model: 'Signature Tote',
    color: 'Brown',
    material: 'Leather',
    comparables: [
      {
        id: 'comp-c004',
        condition: 'like-new',
        price: 180,
        soldDate: '2024-01-18',
        location: 'Miami, FL',
        daysToSell: 2,
        originalPrice: 220,
        source: 'internal',
        authenticity: 'verified',
      },
      {
        id: 'comp-c005',
        condition: 'good',
        price: 140,
        soldDate: '2024-01-14',
        location: 'Boston, MA',
        daysToSell: 6,
        originalPrice: 170,
        source: 'external-vestiaire',
        authenticity: 'verified',
      },
    ],
  },

  // Sample sneaker comparables
  sneakers: {
    brand: 'Nike',
    model: 'Air Jordan 1',
    size: '10',
    colorway: 'Bred',
    comparables: [
      {
        id: 'comp-c006',
        condition: 'new',
        price: 180,
        soldDate: '2024-01-22',
        location: 'Atlanta, GA',
        daysToSell: 1,
        originalPrice: 170,
        source: 'internal',
        authenticity: 'verified',
      },
      {
        id: 'comp-c007',
        condition: 'like-new',
        price: 160,
        soldDate: '2024-01-20',
        location: 'Las Vegas, NV',
        daysToSell: 3,
        originalPrice: 175,
        source: 'external-stockx',
        authenticity: 'verified',
      },
    ],
  },

  // Market trends for clothing
  marketTrends: {
    denim: {
      demandLevel: 'medium',
      supplyLevel: 'high',
      priceDirection: 'stable',
      seasonality: 'consistent_year_round',
      averageDaysToSell: 10,
    },
    luxury_accessories: {
      demandLevel: 'high',
      supplyLevel: 'low',
      priceDirection: 'rising',
      seasonality: 'holiday_gift_season_boost',
      averageDaysToSell: 5,
    },
    sneakers: {
      demandLevel: 'very-high',
      supplyLevel: 'medium',
      priceDirection: 'volatile',
      seasonality: 'release_driven_spikes',
      averageDaysToSell: 3,
    },
    formal_wear: {
      demandLevel: 'low',
      supplyLevel: 'high',
      priceDirection: 'declining',
      seasonality: 'wedding_season_boost',
      averageDaysToSell: 20,
    },
  },

  // Size impact factors
  sizeFactors: {
    common_sizes: {
      sizes: ['M', 'L', '32x32', '10', '9'],
      priceMultiplier: 1.0,
      demandMultiplier: 1.2,
    },
    uncommon_sizes: {
      sizes: ['XS', 'XXL', '28x30', '13', '5'],
      priceMultiplier: 0.85,
      demandMultiplier: 0.7,
    },
  },
};

export type ClothingComparables = typeof clothingComparables;
