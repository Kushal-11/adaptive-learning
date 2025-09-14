import { z } from 'zod';
import { PhotoChecklistSchema } from './data-components';
import { photoQualityTools } from './tools';

/**
 * Photo QA Graph (Optional but nice)
 * Purpose: confirm coverage and flag obvious quality issues (no semantics).
 * 
 * What to put in:
 * Prompt goal: compare the seller's "providedAngles" vs "requiredAngles" and produce "missingAngles". 
 * If available, call PhotoQualityTool to flag blur/low light only.
 * 
 * Output: a PhotoChecklist.
 * 
 * Acceptance gate:
 * The output never states "what the product is" or assigns a condition from photos; 
 * it only lists missing angles and generic quality hints.
 */

export const photoQAGraph = {
  name: 'photo-qa',
  description: 'Compare provided vs required photo angles and check basic quality issues without semantic analysis',
  
  nodes: {
    // Entry point - receive photos and angle requirements
    receivePhotoData: {
      type: 'input',
      description: 'Receive photos with angle labels and required angles list',
      schema: z.object({
        photos: z.array(z.object({
          url: z.string().url(),
          filename: z.string(),
          angle: z.string(), // e.g., 'front', 'back', 'top', 'ports', etc.
          sizeBytes: z.number().positive().optional(),
        })),
        requiredAngles: z.array(z.string()), // Expected angles for this category
        category: z.string().optional(), // For context only, not for semantic analysis
      }),
    },

    // Compare provided vs required angles
    compareAngles: {
      type: 'analysis',
      description: 'Compare providedAngles vs requiredAngles to identify missing angles',
      dependencies: ['receivePhotoData'],
      execute: async (context: any) => {
        const { photos, requiredAngles } = context;
        
        // Extract provided angles from photos
        const providedAngles = photos.map((photo: any) => photo.angle);
        
        // Find missing angles (required but not provided)
        const missingAngles = requiredAngles.filter((required: string) => 
          !providedAngles.some((provided: string) => 
            provided.toLowerCase().includes(required.toLowerCase()) ||
            required.toLowerCase().includes(provided.toLowerCase())
          )
        );
        
        return {
          providedAngles,
          missingAngles,
        };
      },
      next: 'checkPhotoQuality',
    },

    // Check photo quality using PhotoQualityTool
    checkPhotoQuality: {
      type: 'analysis',
      description: 'Use PhotoQualityTool to flag blur/low light only - no semantic analysis',
      dependencies: ['compareAngles'],
      tools: ['checkQuality'],
      execute: async (context: any) => {
        const { photos } = context;
        
        // Prepare file list for quality tool
        const fileList = photos.map((photo: any) => ({
          url: photo.url,
          filename: photo.filename,
          sizeBytes: photo.sizeBytes,
        }));
        
        // Call PhotoQualityTool for technical quality analysis only
        const qualityResult = await photoQualityTools.checkQuality.execute({
          fileList,
        });
        
        // Extract only blur and low light flags (no semantic analysis)
        const qualityHints = {
          blur: qualityResult.results.some(r => r.flags.blur),
          lowLight: qualityResult.results.some(r => r.flags.lowLight),
          glare: qualityResult.results.some(r => r.flags.glare),
        };
        
        return {
          qualityHints,
          qualityDetails: qualityResult.results.map(r => ({
            filename: r.filename,
            issues: r.issues, // Generic quality issues only
            acceptable: r.acceptable,
          })),
        };
      },
      next: 'buildPhotoChecklist',
    },

    // Build final PhotoChecklist output
    buildPhotoChecklist: {
      type: 'output',
      description: 'Compile angle comparison and quality hints into PhotoChecklist',
      dependencies: ['checkPhotoQuality'],
      schema: PhotoChecklistSchema,
      build: (context: any) => {
        const { requiredAngles, providedAngles, missingAngles, qualityHints } = context;
        
        // Build PhotoChecklist according to schema
        const photoChecklist = {
          requiredAngles,
          providedAngles,
          missingAngles,
          qualityHints: {
            lowLight: qualityHints.lowLight,
            blur: qualityHints.blur,
            glare: qualityHints.glare,
          },
        };
        
        return {
          photoChecklist,
          summary: {
            totalPhotos: providedAngles.length,
            missingCount: missingAngles.length,
            qualityIssues: Object.values(qualityHints).filter(Boolean).length,
            complete: missingAngles.length === 0,
            qualityAcceptable: !qualityHints.blur && !qualityHints.lowLight,
          },
        };
      },
    },
  },

  // Graph configuration
  config: {
    entry_point: 'receivePhotoData',
    max_iterations: 1, // Linear flow, no loops
    timeout: 300, // 5 minutes
    error_handling: 'graceful',
  },

  // Context requirements
  context: {
    required: ['photos', 'requiredAngles'],
    optional: ['category'],
  },

  // Tools used by this graph
  tools: {
    checkQuality: photoQualityTools.checkQuality,
  },

  // Output specification
  output: {
    primary: 'PhotoChecklist',
    optional: ['summary'],
  },

  // Acceptance criteria
  acceptance: {
    description: 'The output never states "what the product is" or assigns a condition from photos; it only lists missing angles and generic quality hints.',
    requirements: [
      'PhotoChecklist contains requiredAngles, providedAngles, and missingAngles arrays',
      'qualityHints only includes blur, lowLight, and glare flags',
      'No semantic analysis or product identification',
      'No condition grading or assessment from photos',
      'Only technical quality issues are flagged',
      'Missing angles are accurately identified by comparing provided vs required',
    ],
    constraints: [
      'NEVER identify what the product is',
      'NEVER assign condition grades based on photos',
      'NEVER perform semantic analysis of photo content',
      'ONLY flag technical quality issues (blur, lighting, glare)',
      'ONLY compare angle coverage against requirements',
    ],
  },
};

export type PhotoQAGraph = typeof photoQAGraph;

// Export validation schemas for testing
export const PhotoQASchemas = {
  PhotoChecklist: PhotoChecklistSchema,
} as const;
