import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Call OpenAI Vision API with GPT-4 Vision using a multi-step analysis approach
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert product appraiser and marketplace analyst. Your job is to accurately identify and evaluate products from images. You have extensive knowledge of:
- Product identification across all categories
- Brand recognition and model variants
- Condition assessment and defect detection
- Current market values and pricing trends
- Authentication markers and quality indicators

Always be conservative in your assessments and clearly state your confidence level. If you're uncertain about any aspect, indicate this in your response.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this product image step by step:

STEP 1: PRODUCT IDENTIFICATION
- What is the main product in the image?
- Can you identify the brand, model, or specific variant?
- What category does this belong to?
- Are there any distinguishing features or markings?

STEP 2: CONDITION ASSESSMENT
- Examine the image carefully for any visible wear, damage, or defects
- Look for scratches, dents, discoloration, missing parts, or signs of use
- Assess the overall condition based on what you can see
- Note any areas where the image quality might limit your assessment

STEP 3: MARKET ANALYSIS
- Based on the identified product and condition, estimate current market value
- Consider depreciation, demand, and typical resale values
- Provide a realistic price range

Provide your analysis in this exact JSON format:

{
  "productIdentification": {
    "mainProduct": "specific product name",
    "brand": "brand name or unknown",
    "model": "model name/number or unknown",
    "variant": "color/size/version or unknown"
  },
  "category": "choose the most specific category from: Electronics - Smartphones, Electronics - Laptops, Electronics - Gaming, Electronics - Cameras, Electronics - Audio, Electronics - Tablets, Electronics - Wearables, Electronics - Accessories, Home & Garden - Appliances, Home & Garden - Furniture, Home & Garden - Kitchen, Home & Garden - Tools, Home & Garden - Decor, Fashion & Accessories - Clothing, Fashion & Accessories - Shoes, Fashion & Accessories - Bags, Fashion & Accessories - Jewelry, Fashion & Accessories - Watches, Fashion & Accessories - Luxury, Sports & Outdoors - Fitness, Sports & Outdoors - Cycling, Sports & Outdoors - Camping, Sports & Outdoors - Water Sports, Automotive - Parts, Automotive - Accessories, Books & Media - Textbooks, Books & Media - Comics, Books & Media - Music, Art & Collectibles - Vintage, Art & Collectibles - Antiques, Art & Collectibles - Art, Toys & Games - Video Games, Toys & Games - Board Games, Toys & Games - Collectibles, Other",
  "condition": "new, like-new, good, fair, or poor",
  "confidence": 0.85,
  "description": "Detailed description including brand, model, condition, and notable features",
  "defectsDetected": ["list specific visible defects, wear marks, or damage"],
  "conditionNotes": "detailed explanation of condition assessment and any limitations due to image quality",
  "suggestedPrice": 750,
  "marketComparison": {
    "averagePrice": 765,
    "priceRange": { "min": 650, "max": 850 },
    "marketTrend": "stable, increasing, or decreasing",
    "pricingNotes": "explanation of pricing rationale"
  },
  "valuationBreakdown": {
    "baseValue": 900,
    "conditionAdjustment": -120,
    "marketDemand": -30,
    "finalEstimate": 750,
    "reasoning": "explanation of how the price was calculated"
  },
  "uncertainties": ["list any aspects you're unsure about"],
  "recommendedActions": ["suggestions for better photos, additional info needed, etc."]
}

Be thorough, accurate, and honest about limitations. If you cannot clearly identify something, say so rather than guessing.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1,
    });

    const analysisText = response.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis received from OpenAI');
    }

    // Parse the JSON response
    let analysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(analysisText);
      }

      // Transform the new format to maintain backward compatibility if needed
      // The new format includes more detailed fields, so we'll keep it as is
      // but ensure all required fields are present
      if (!analysisResult.category) {
        analysisResult.category = "Other";
      }
      if (!analysisResult.condition) {
        analysisResult.condition = "good";
      }
      if (!analysisResult.confidence) {
        analysisResult.confidence = 0.5;
      }

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw response:', analysisText);
      throw new Error('Invalid JSON response from OpenAI');
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Return a fallback response matching the new structure
    return NextResponse.json({
      productIdentification: {
        mainProduct: "Unknown product",
        brand: "unknown",
        model: "unknown",
        variant: "unknown"
      },
      category: "Other",
      condition: "good",
      confidence: 0.3,
      description: "Unable to analyze image automatically. Please fill in the details manually.",
      defectsDetected: ["Please inspect manually"],
      conditionNotes: "Analysis failed - manual inspection required",
      suggestedPrice: 100,
      marketComparison: {
        averagePrice: 100,
        priceRange: { min: 50, max: 150 },
        marketTrend: "unknown",
        pricingNotes: "Unable to determine pricing automatically"
      },
      valuationBreakdown: {
        baseValue: 100,
        conditionAdjustment: 0,
        marketDemand: 0,
        finalEstimate: 100,
        reasoning: "Default fallback pricing due to analysis failure"
      },
      uncertainties: ["Unable to identify product", "Cannot assess condition", "Cannot determine market value"],
      recommendedActions: ["Take clearer photos", "Provide product details manually", "Check image quality and lighting"]
    }, { status: 200 });
  }
}
