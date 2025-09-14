import { z } from 'zod';

/**
 * Phase 2 - Shared primitives for marketplace system
 * Defines the exact data components for UI/back-end consumption
 */

// Base Timeslot component used across multiple specs
export const TimeslotSchema = z.object({
  startISO: z.string(), // ISO 8601 datetime string
  endISO: z.string(),   // ISO 8601 datetime string
});

export type Timeslot = z.infer<typeof TimeslotSchema>;

// SellerListingSpec - Complete seller listing specification
export const SellerListingSpecSchema = z.object({
  category: z.string(), // enumeration tied to category tree
  makeModel: z.string().optional(), // as applicable
  variant: z.string().optional(),   // as applicable
  year: z.number().optional(),      // as applicable
  purchaseDateISO: z.string(),      // ISO 8601 date string
  origPrice: z.number(),
  
  // Usage details
  usage: z.object({
    hours: z.number().optional(),
    cycles: z.number().optional(),
    notes: z.string(),
  }),
  
  // Defects list
  defects: z.array(z.object({
    area: z.string(),
    severity: z.number().min(1).max(3), // 1-3 scale
    notes: z.string(),
  })),
  
  // Accessories list
  accessories: z.array(z.string()), // included items (box, charger, etc.)
  
  // Disclosures list
  disclosures: z.array(z.string()), // e.g., smoke-free home
  
  // Pickup location
  pickupLocation: z.object({
    lat: z.number(),
    lon: z.number(),
    geohash: z.string(),
  }),
  
  // Seller availability
  sellerTimeslots: z.array(TimeslotSchema),
});

export type SellerListingSpec = z.infer<typeof SellerListingSpecSchema>;

// PhotoChecklist - Photo validation and requirements
export const PhotoChecklistSchema = z.object({
  requiredAngles: z.array(z.string()),
  providedAngles: z.array(z.string()),
  missingAngles: z.array(z.string()),
  
  // Quality hints (flags only)
  qualityHints: z.object({
    lowLight: z.boolean(),
    blur: z.boolean(),
    glare: z.boolean(),
  }),
});

export type PhotoChecklist = z.infer<typeof PhotoChecklistSchema>;

// ConditionGrade - Item condition assessment
export const ConditionGradeSchema = z.object({
  grade: z.enum(['new', 'open-box', 'like-new', 'good', 'fair', 'poor']),
  justificationMd: z.string(), // short markdown explaining the decision
  
  // Rubric scores
  rubricScores: z.array(z.object({
    criterionName: z.string(),
    score: z.number().min(0).max(1), // 0..1 scale
    notes: z.string(),
  })),
});

export type ConditionGrade = z.infer<typeof ConditionGradeSchema>;

// PriceBand - Pricing recommendations
export const PriceBandSchema = z.object({
  quickSale: z.number(),  // quick sale price
  fair: z.number(),       // fair market price
  holdOut: z.number(),    // hold out for higher price
  
  comparableIds: z.array(z.string()), // ids from curated comps
  explainMd: z.string(), // how comps mapped and adjustments made
});

export type PriceBand = z.infer<typeof PriceBandSchema>;

// BuyerQuerySpec - Buyer search and requirements
export const BuyerQuerySpecSchema = z.object({
  category: z.string(),
  searchString: z.string(),
  
  // Budget constraints
  budgetMin: z.number(),
  budgetMax: z.number(),
  
  // Condition preferences
  desiredCondition: z.array(z.enum(['new', 'open-box', 'like-new', 'good', 'fair', 'poor'])),
  
  // Location preferences
  radiusKm: z.number(),
  pickupOrigin: z.object({
    lat: z.number(),
    lon: z.number(),
    geohash: z.string(),
  }),
  
  // Buyer availability
  buyerTimeslots: z.array(TimeslotSchema),
});

export type BuyerQuerySpec = z.infer<typeof BuyerQuerySpecSchema>;

// MatchProposal - Matching algorithm results
export const MatchProposalSchema = z.object({
  listingId: z.string(),
  distanceKm: z.number(),
  
  priceFit: z.enum(['inside', 'slightly-over', 'over']),
  conditionFit: z.boolean(),
  
  timeslotIntersections: z.array(TimeslotSchema),
  score: z.number(), // composite matching score
});

export type MatchProposal = z.infer<typeof MatchProposalSchema>;

// DealSheet - Finalized deal terms
export const DealSheetSchema = z.object({
  listingId: z.string(),
  buyerId: z.string(),
  
  agreedPrice: z.number(),
  agreedTimeslot: TimeslotSchema, // single agreed timeslot
  
  location: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  
  notes: z.string().optional(),
});

export type DealSheet = z.infer<typeof DealSheetSchema>;

// MessageDraft - Communication templates
export const MessageDraftSchema = z.object({
  audience: z.enum(['buyer', 'seller']),
  text: z.string(),
});

export type MessageDraft = z.infer<typeof MessageDraftSchema>;

// Export all schemas for validation
export const DataComponentSchemas = {
  Timeslot: TimeslotSchema,
  SellerListingSpec: SellerListingSpecSchema,
  PhotoChecklist: PhotoChecklistSchema,
  ConditionGrade: ConditionGradeSchema,
  PriceBand: PriceBandSchema,
  BuyerQuerySpec: BuyerQuerySpecSchema,
  MatchProposal: MatchProposalSchema,
  DealSheet: DealSheetSchema,
  MessageDraft: MessageDraftSchema,
} as const;
