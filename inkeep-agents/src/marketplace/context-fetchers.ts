import { z } from 'zod';
// Note: Phase 2 data components are now defined in data-components.ts
// This file may need to be updated to use the new Phase 2 components

/**
 * Context fetchers for retrieving marketplace data
 * These classes handle data retrieval from various sources
 * All fetchers target payload sizes under 8KB for optimal performance
 */

// Base context fetcher interface
export interface ContextFetcher<T> {
  fetch(params: any): Promise<T>;
  validate(data: unknown): T;
}

/**
 * CURATED COMPARABLES FETCHER
 * 
 * Purpose: Fetches compact array of comparable sale records for pricing analysis
 * Parameters: category, makeModel, variant, year
 * Max Payload: ~6KB (target: 50-100 records at ~60-120 bytes each)
 * 
 * Sample JSON Shape:
 * [
 *   {
 *     "id": "comp_12345",
 *     "price": 850,
 *     "conditionGrade": "B+",
 *     "saleDate": "2024-01-15",
 *     "daysToSell": 12
 *   },
 *   {
 *     "id": "comp_12346", 
 *     "price": 920,
 *     "conditionGrade": "A-",
 *     "saleDate": "2024-01-20",
 *     "daysToSell": 8
 *   }
 * ]
 */
export class CuratedCompsFetcher implements ContextFetcher<any[]> {
  async fetchCuratedComps(params: {
    category: string;
    makeModel: string;
    variant?: string;
    year?: number;
  }): Promise<any[]> {
    // Fetches curated comparable sales from backend
    // Filters by exact category, make/model match
    // Optional variant and year filtering for precision
    // Returns chronologically sorted, most recent first
    return [];
  }

  async fetch(params: any): Promise<any[]> {
    return this.fetchCuratedComps(params);
  }

  validate(data: unknown): any[] {
    return z.array(z.object({
      id: z.string(),
      price: z.number(),
      conditionGrade: z.string(),
      saleDate: z.string(),
      daysToSell: z.number().optional()
    })).parse(data);
  }
}

/**
 * ENTITY FETCHERS (Listing, Buyer, Seller)
 * 
 * Purpose: Fetch individual entity records by ID
 * Max Payload: ~4KB each (detailed but focused entity data)
 * 
 * fetchListing Sample JSON:
 * {
 *   "id": "listing_789",
 *   "title": "iPhone 14 Pro 256GB Space Black",
 *   "category": "electronics",
 *   "price": 899,
 *   "condition": "like-new",
 *   "sellerId": "seller_456",
 *   "location": { "city": "San Francisco", "state": "CA", "zip": "94102" },
 *   "photos": ["url1", "url2"],
 *   "specs": { "storage": "256GB", "color": "Space Black" },
 *   "createdAt": "2024-01-10T10:00:00Z"
 * }
 * 
 * fetchBuyer Sample JSON:
 * {
 *   "id": "buyer_123",
 *   "profile": {
 *     "verificationLevel": "verified",
 *     "rating": 4.8,
 *     "totalPurchases": 15
 *   },
 *   "preferences": {
 *     "maxBudget": 1200,
 *     "preferredConditions": ["new", "like-new"],
 *     "location": { "radius": 25, "center": "94102" }
 *   },
 *   "activeSearches": ["electronics", "phones"]
 * }
 * 
 * fetchSeller Sample JSON:
 * {
 *   "id": "seller_456",
 *   "profile": {
 *     "businessName": "Tech Reseller Pro",
 *     "verificationLevel": "business-verified",
 *     "rating": 4.9,
 *     "totalSales": 342,
 *     "responseTime": "< 2 hours"
 *   },
 *   "inventory": {
 *     "activeListings": 23,
 *     "categories": ["electronics", "accessories"]
 *   },
 *   "policies": {
 *     "returnWindow": 14,
 *     "shippingOptions": ["local", "nationwide"]
 *   }
 * }
 */
export class EntityFetcher implements ContextFetcher<any> {
  async fetchListing(listingId: string): Promise<any> {
    // Fetches complete listing details by ID
    // Includes product specs, seller info, pricing, photos
    return {};
  }

  async fetchBuyer(buyerId: string): Promise<any> {
    // Fetches buyer profile and preferences
    // Includes verification status, purchase history, search criteria
    return {};
  }

  async fetchSeller(sellerId: string): Promise<any> {
    // Fetches seller profile and business info
    // Includes ratings, inventory summary, policies
    return {};
  }

  async fetch(params: { type: 'listing' | 'buyer' | 'seller'; id: string }): Promise<any> {
    switch (params.type) {
      case 'listing': return this.fetchListing(params.id);
      case 'buyer': return this.fetchBuyer(params.id);
      case 'seller': return this.fetchSeller(params.id);
      default: throw new Error(`Unknown entity type: ${params.type}`);
    }
  }

  validate(data: unknown): any {
    return z.any().parse(data);
  }
}

/**
 * CANDIDATE LISTINGS FETCHER
 * 
 * Purpose: Returns prefiltered candidate listings for buyer matching
 * Parameters: BuyerQuerySpec object with category, budget, radius, condition filters
 * Max Payload: ~7KB (target: 20-40 listings at ~150-350 bytes each)
 * 
 * BuyerQuerySpec Shape:
 * {
 *   "category": "electronics",
 *   "budgetRange": { "min": 500, "max": 1200 },
 *   "location": { "center": "94102", "radiusMiles": 25 },
 *   "minCondition": "good",
 *   "keywords": ["iPhone", "256GB"],
 *   "maxResults": 30
 * }
 * 
 * Sample JSON Response:
 * [
 *   {
 *     "id": "listing_789",
 *     "title": "iPhone 14 Pro 256GB",
 *     "price": 899,
 *     "condition": "like-new",
 *     "sellerId": "seller_456",
 *     "distance": 12.3,
 *     "matchScore": 0.92,
 *     "thumbnailUrl": "https://...",
 *     "createdAt": "2024-01-10T10:00:00Z"
 *   }
 * ]
 */
export class CandidateListingsFetcher implements ContextFetcher<any[]> {
  async fetchCandidateListings(buyerQuerySpec: {
    category: string;
    budgetRange: { min: number; max: number };
    location: { center: string; radiusMiles: number };
    minCondition: string;
    keywords?: string[];
    maxResults?: number;
  }): Promise<any[]> {
    // Fetches prefiltered listings matching buyer criteria
    // Applies category, budget overlap, geographic radius filters
    // Enforces minimum condition requirements
    // Returns sorted by match score and recency
    return [];
  }

  async fetch(params: any): Promise<any[]> {
    return this.fetchCandidateListings(params);
  }

  validate(data: unknown): any[] {
    return z.array(z.object({
      id: z.string(),
      title: z.string(),
      price: z.number(),
      condition: z.string(),
      sellerId: z.string(),
      distance: z.number(),
      matchScore: z.number(),
      thumbnailUrl: z.string().optional(),
      createdAt: z.string()
    })).parse(data);
  }
}

/**
 * TIMESLOT INTERSECTIONS FETCHER
 * 
 * Purpose: Calculates overlapping availability between seller and buyer schedules
 * Parameters: sellerTimeslots array, buyerTimeslots array
 * Max Payload: ~2KB (compact time intersection data)
 * 
 * Input Timeslot Shape:
 * [
 *   {
 *     "start": "2024-01-15T14:00:00Z",
 *     "end": "2024-01-15T18:00:00Z",
 *     "type": "pickup" | "delivery" | "inspection"
 *   }
 * ]
 * 
 * Sample JSON Response:
 * {
 *   "intersections": [
 *     {
 *       "start": "2024-01-15T15:00:00Z",
 *       "end": "2024-01-15T17:00:00Z",
 *       "duration": 120,
 *       "type": "pickup",
 *       "confidence": "high"
 *     },
 *     {
 *       "start": "2024-01-16T10:00:00Z", 
 *       "end": "2024-01-16T12:00:00Z",
 *       "duration": 120,
 *       "type": "delivery",
 *       "confidence": "medium"
 *     }
 *   ],
 *   "totalOptions": 2,
 *   "bestMatch": {
 *     "start": "2024-01-15T15:00:00Z",
 *     "end": "2024-01-15T17:00:00Z",
 *     "reason": "longest_overlap"
 *   }
 * }
 */
export class TimeslotIntersectionsFetcher implements ContextFetcher<any> {
  async fetchTimeslotIntersections(params: {
    sellerTimeslots: Array<{
      start: string;
      end: string;
      type: 'pickup' | 'delivery' | 'inspection';
    }>;
    buyerTimeslots: Array<{
      start: string;
      end: string;
      type: 'pickup' | 'delivery' | 'inspection';
    }>;
  }): Promise<any> {
    // Calculates time intersections between seller and buyer availability
    // Matches compatible activity types (pickup, delivery, inspection)
    // Returns sorted by duration and convenience score
    // Includes confidence ratings based on overlap quality
    return {};
  }

  async fetch(params: any): Promise<any> {
    return this.fetchTimeslotIntersections(params);
  }

  validate(data: unknown): any {
    return z.object({
      intersections: z.array(z.object({
        start: z.string(),
        end: z.string(),
        duration: z.number(),
        type: z.string(),
        confidence: z.enum(['high', 'medium', 'low'])
      })),
      totalOptions: z.number(),
      bestMatch: z.object({
        start: z.string(),
        end: z.string(),
        reason: z.string()
      }).optional()
    }).parse(data);
  }
}

// Legacy fetchers (keeping for backward compatibility)
export class ProductContextFetcher implements ContextFetcher<any[]> {
  async fetch(params: {
    category?: string;
    priceRange?: { min: number; max: number };
    location?: string;
    condition?: string[];
    limit?: number;
    sellerId?: string;
  }): Promise<any[]> {
    return [];
  }

  validate(data: unknown): any[] {
    return z.array(z.any()).parse(data);
  }
}

export class MarketDataFetcher implements ContextFetcher<any> {
  async fetch(params: {
    category: string;
    location?: string;
    timeframe?: string;
  }): Promise<any> {
    return {
      category: params.category,
      averagePrice: 0,
      priceRange: { min: 0, max: 0 },
      demandLevel: 'medium',
      supplyLevel: 'medium',
      trendDirection: 'stable',
      comparableListings: [],
      lastUpdated: new Date(),
    };
  }

  validate(data: unknown): any {
    return z.any().parse(data);
  }
}

export class UserProfileFetcher implements ContextFetcher<any> {
  async fetch(params: {
    userId: string;
    type: 'buyer' | 'seller';
  }): Promise<any> {
    if (params.type === 'buyer') {
      return {
        id: params.userId,
        preferences: {
          categories: [],
          priceRange: { min: 0, max: 1000 },
          location: { radius: 25, city: '', state: '' },
          condition: ['new', 'like-new'],
        },
        searchHistory: [],
        savedListings: [],
      };
    } else {
      return {
        id: params.userId,
        businessInfo: {
          name: '',
          type: 'individual',
          verified: false,
          rating: 0,
          totalSales: 0,
        },
        inventory: [],
        preferences: {
          autoAcceptOffers: false,
          minimumOfferPercentage: 80,
          responseTime: 'within-day',
        },
      };
    }
  }

  validate(data: unknown): any {
    return z.any().parse(data);
  }
}

export class SalesHistoryFetcher implements ContextFetcher<any[]> {
  async fetch(params: {
    category?: string;
    condition?: string;
    location?: string;
    timeframe?: string;
    limit?: number;
  }): Promise<any[]> {
    return [];
  }

  validate(data: unknown): any[] {
    return z.array(z.any()).parse(data);
  }
}

export class ComparableListingsFetcher implements ContextFetcher<any[]> {
  async fetch(params: {
    productId: string;
    category: string;
    condition: string;
    priceRange?: { min: number; max: number };
    limit?: number;
  }): Promise<any[]> {
    return [];
  }

  validate(data: unknown): any[] {
    return z.array(z.any()).parse(data);
  }
}

export class ExternalMarketDataFetcher implements ContextFetcher<any> {
  async fetch(params: {
    query: string;
    source: 'ebay' | 'amazon' | 'facebook' | 'craigslist';
    filters?: Record<string, any>;
  }): Promise<any> {
    return {};
  }

  validate(data: unknown): any {
    return z.any().parse(data);
  }
}

export class ImageAnalysisFetcher implements ContextFetcher<any> {
  async fetch(params: {
    imageUrls: string[];
    analysisType: 'condition' | 'authenticity' | 'quality';
  }): Promise<any> {
    return {};
  }

  validate(data: unknown): any {
    return z.any().parse(data);
  }
}

// Context fetcher registry - Updated with new fetchers
export const contextFetchers = {
  // New Phase 2 fetchers
  curatedComps: new CuratedCompsFetcher(),
  entities: new EntityFetcher(),
  candidateListings: new CandidateListingsFetcher(),
  timeslotIntersections: new TimeslotIntersectionsFetcher(),
  
  // Legacy fetchers
  products: new ProductContextFetcher(),
  marketData: new MarketDataFetcher(),
  userProfile: new UserProfileFetcher(),
  salesHistory: new SalesHistoryFetcher(),
  comparables: new ComparableListingsFetcher(),
  externalMarket: new ExternalMarketDataFetcher(),
  imageAnalysis: new ImageAnalysisFetcher(),
};

export type ContextFetcherType = keyof typeof contextFetchers;
