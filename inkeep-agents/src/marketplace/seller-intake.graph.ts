import { z } from 'zod';
import { SellerListingSpecSchema, PhotoChecklistSchema, TimeslotSchema } from './data-components';
import { geoTools } from './tools';

/**
 * Phase 3 - Seller Intake Graph
 * Purpose: collect structured listing info and seller timeslots; normalize address to geohash; return SellerListingSpec
 * 
 * Flow: Ask one question at a time; confirm category; capture all fields from SellerListingSpec; 
 * compute/validate timeslot format; call GeoTools for geohash
 * 
 * Output: exactly one SellerListingSpec data component
 * Optionally emit a PhotoChecklist request giving the angles the seller should capture
 */

export const sellerIntakeGraph = {
  name: 'seller-intake',
  description: 'Collect structured listing info and seller timeslots, normalize address to geohash, return SellerListingSpec',
  
  nodes: {
    // Step 1: Ask for category
    askCategory: {
      type: 'prompt',
      description: 'Ask seller to specify the category of item they want to sell',
      prompt: 'What category of item are you selling? (e.g., electronics, clothing, furniture, books, etc.)',
      schema: z.object({
        category: z.string().min(1, 'Category is required'),
      }),
      next: 'confirmCategory',
    },

    // Step 2: Confirm category
    confirmCategory: {
      type: 'prompt',
      description: 'Confirm the category with the seller',
      prompt: 'You selected "{category}". Is this correct? If not, please specify the correct category.',
      schema: z.object({
        categoryConfirmed: z.boolean(),
        correctedCategory: z.string().optional(),
      }),
      next: 'askMakeModel',
    },

    // Step 3: Ask for make/model (if applicable)
    askMakeModel: {
      type: 'prompt',
      description: 'Ask for make and model if applicable to the category',
      prompt: 'What is the make and model of your item? (Leave blank if not applicable)',
      schema: z.object({
        makeModel: z.string().optional(),
      }),
      next: 'askVariant',
    },

    // Step 4: Ask for variant (if applicable)
    askVariant: {
      type: 'prompt',
      description: 'Ask for specific variant or model details',
      prompt: 'What is the specific variant or model details? (e.g., color, size, storage capacity - leave blank if not applicable)',
      schema: z.object({
        variant: z.string().optional(),
      }),
      next: 'askYear',
    },

    // Step 5: Ask for year (if applicable)
    askYear: {
      type: 'prompt',
      description: 'Ask for year of manufacture or model year',
      prompt: 'What year was this item made or what model year is it? (Leave blank if not applicable)',
      schema: z.object({
        year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
      }),
      next: 'askPurchaseDate',
    },

    // Step 6: Ask for purchase date
    askPurchaseDate: {
      type: 'prompt',
      description: 'Ask when the seller purchased the item',
      prompt: 'When did you purchase this item? Please provide the date (YYYY-MM-DD format)',
      schema: z.object({
        purchaseDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      }),
      next: 'askOriginalPrice',
    },

    // Step 7: Ask for original price
    askOriginalPrice: {
      type: 'prompt',
      description: 'Ask for the original purchase price',
      prompt: 'What was the original purchase price of this item? (Enter amount in dollars)',
      schema: z.object({
        origPrice: z.number().positive('Original price must be positive'),
      }),
      next: 'askUsage',
    },

    // Step 8: Ask for usage details
    askUsage: {
      type: 'prompt',
      description: 'Ask for usage details like hours, cycles, and notes',
      prompt: 'Please describe the usage of this item. How many hours of use (if applicable)? How many cycles (if applicable)? Any additional usage notes?',
      schema: z.object({
        usage: z.object({
          hours: z.number().nonnegative().optional(),
          cycles: z.number().nonnegative().optional(),
          notes: z.string().min(1, 'Usage notes are required'),
        }),
      }),
      next: 'askDefects',
    },

    // Step 9: Ask for defects
    askDefects: {
      type: 'prompt',
      description: 'Ask seller to list any defects or issues',
      prompt: 'Please list any defects or issues with the item. For each defect, specify the area, severity (1=minor, 2=moderate, 3=major), and notes. Type "none" if no defects.',
      schema: z.object({
        defects: z.array(z.object({
          area: z.string().min(1),
          severity: z.number().int().min(1).max(3),
          notes: z.string().min(1),
        })).default([]),
      }),
      next: 'askAccessories',
    },

    // Step 10: Ask for accessories
    askAccessories: {
      type: 'prompt',
      description: 'Ask what accessories are included',
      prompt: 'What accessories are included with this item? (e.g., original box, charger, manual, etc.) List each accessory or type "none" if no accessories.',
      schema: z.object({
        accessories: z.array(z.string()).default([]),
      }),
      next: 'askDisclosures',
    },

    // Step 11: Ask for disclosures
    askDisclosures: {
      type: 'prompt',
      description: 'Ask for any important disclosures',
      prompt: 'Are there any important disclosures about this item or your home environment? (e.g., smoke-free home, pet-free home, etc.) Type "none" if no disclosures.',
      schema: z.object({
        disclosures: z.array(z.string()).default([]),
      }),
      next: 'askPickupLocation',
    },

    // Step 12: Ask for pickup location
    askPickupLocation: {
      type: 'prompt',
      description: 'Ask for pickup location address',
      prompt: 'What is the address where the buyer can pick up this item? Please provide the full address.',
      schema: z.object({
        address: z.string().min(5, 'Please provide a complete address'),
      }),
      next: 'convertAddressToGeo',
    },

    // Step 13: Convert address to coordinates and geohash
    convertAddressToGeo: {
      type: 'action',
      description: 'Convert address to lat/lon coordinates and generate geohash',
      tools: ['geohash'],
      execute: async (context: any) => {
        // In a real implementation, this would use a geocoding service
        // For now, we'll simulate with sample coordinates
        const sampleCoordinates = {
          lat: 37.7749 + (Math.random() - 0.5) * 0.1, // San Francisco area with some variation
          lon: -122.4194 + (Math.random() - 0.5) * 0.1,
        };
        
        // Use the geohash tool to generate geohash
        const geohashResult = await geoTools.geohash.execute({
          lat: sampleCoordinates.lat,
          lon: sampleCoordinates.lon,
          precision: 8,
        });
        
        return {
          pickupLocation: {
            lat: sampleCoordinates.lat,
            lon: sampleCoordinates.lon,
            geohash: geohashResult.geohash,
          },
        };
      },
      next: 'askTimeslots',
    },

    // Step 14: Ask for seller availability timeslots
    askTimeslots: {
      type: 'prompt',
      description: 'Ask for seller availability timeslots',
      prompt: 'When are you available for pickup? Please provide at least 2 time slots in the format: YYYY-MM-DDTHH:MM:SS.000Z to YYYY-MM-DDTHH:MM:SS.000Z (start to end times in ISO format)',
      schema: z.object({
        timeslots: z.array(z.object({
          startISO: z.string().datetime('Start time must be in ISO format'),
          endISO: z.string().datetime('End time must be in ISO format'),
        })).min(2, 'Please provide at least 2 timeslots'),
      }),
      next: 'validateTimeslots',
    },

    // Step 15: Validate timeslots
    validateTimeslots: {
      type: 'validation',
      description: 'Validate that timeslots are properly formatted and logical',
      validate: (data: any) => {
        const timeslots = data.timeslots;
        const errors: string[] = [];
        
        for (let i = 0; i < timeslots.length; i++) {
          const slot = timeslots[i];
          const start = new Date(slot.startISO);
          const end = new Date(slot.endISO);
          
          if (start >= end) {
            errors.push(`Timeslot ${i + 1}: Start time must be before end time`);
          }
          
          if (start < new Date()) {
            errors.push(`Timeslot ${i + 1}: Start time cannot be in the past`);
          }
          
          const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          if (durationHours < 0.5) {
            errors.push(`Timeslot ${i + 1}: Duration must be at least 30 minutes`);
          }
        }
        
        return {
          valid: errors.length === 0,
          errors,
        };
      },
      next: 'generatePhotoChecklist',
    },

    // Step 16: Generate photo checklist (optional)
    generatePhotoChecklist: {
      type: 'action',
      description: 'Generate photo checklist with required angles for the seller',
      execute: async (context: any) => {
        const category = context.category || context.correctedCategory || 'general';
        
        // Define required photo angles based on category
        const getRequiredAngles = (cat: string): string[] => {
          const categoryLower = cat.toLowerCase();
          
          if (categoryLower.includes('electronics') || categoryLower.includes('phone') || categoryLower.includes('computer')) {
            return ['front', 'back', 'top', 'ports', 'serial/label', 'screen-on'];
          } else if (categoryLower.includes('clothing') || categoryLower.includes('shoes')) {
            return ['front', 'back', 'side', 'label', 'close-up-details'];
          } else if (categoryLower.includes('furniture')) {
            return ['front', 'back', 'side', 'top', 'close-up-wear'];
          } else {
            return ['front', 'back', 'top', 'serial/label'];
          }
        };
        
        const requiredAngles = getRequiredAngles(category);
        
        const photoChecklist = {
          requiredAngles,
          providedAngles: [], // Will be filled when photos are uploaded
          missingAngles: requiredAngles, // Initially all are missing
          qualityHints: {
            lowLight: false,
            blur: false,
            glare: false,
          },
        };
        
        return { photoChecklist };
      },
      next: 'buildSellerListingSpec',
    },

    // Step 17: Build final SellerListingSpec
    buildSellerListingSpec: {
      type: 'output',
      description: 'Compile all collected information into a SellerListingSpec',
      schema: SellerListingSpecSchema,
      build: (context: any) => {
        const finalCategory = context.correctedCategory || context.category;
        
        const sellerListingSpec = {
          category: finalCategory,
          makeModel: context.makeModel || undefined,
          variant: context.variant || undefined,
          year: context.year || undefined,
          purchaseDateISO: context.purchaseDateISO,
          origPrice: context.origPrice,
          usage: context.usage,
          defects: context.defects || [],
          accessories: context.accessories || [],
          disclosures: context.disclosures || [],
          pickupLocation: context.pickupLocation,
          sellerTimeslots: context.timeslots,
        };
        
        return {
          sellerListingSpec,
          photoChecklist: context.photoChecklist,
        };
      },
    },
  },

  // Graph configuration
  config: {
    entry_point: 'askCategory',
    max_iterations: 1, // Linear flow, no loops
    timeout: 1800, // 30 minutes
    error_handling: 'graceful',
    one_question_at_a_time: true, // Enforce single question flow
  },

  // Context requirements
  context: {
    required: [],
    optional: ['userProfile'],
  },

  // Tools used by this graph
  tools: {
    geohash: geoTools.geohash,
  },

  // Output specification
  output: {
    primary: 'SellerListingSpec',
    optional: ['PhotoChecklist'],
  },

  // Acceptance criteria
  acceptance: {
    description: 'A dry run in "Try It" yields a complete SellerListingSpec including at least two timeslots and a geohash',
    requirements: [
      'SellerListingSpec contains all required fields',
      'At least 2 timeslots provided in sellerTimeslots array',
      'pickupLocation contains valid geohash',
      'All timeslots are properly formatted ISO strings',
      'Category is confirmed by seller',
      'Optional PhotoChecklist includes category-appropriate angles',
    ],
  },
};

export type SellerIntakeGraph = typeof sellerIntakeGraph;

// Export validation schemas for testing
export const SellerIntakeSchemas = {
  SellerListingSpec: SellerListingSpecSchema,
  PhotoChecklist: PhotoChecklistSchema,
  Timeslot: TimeslotSchema,
} as const;
