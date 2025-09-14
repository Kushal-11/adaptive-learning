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

    // Call OpenAI Vision API with GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this product image for marketplace listing. Provide detailed analysis in JSON format with the following structure:

{
  "category": "Electronics - Smartphones" (choose from: Electronics - Smartphones, Electronics - Laptops, Electronics - Gaming, Electronics - Cameras, Electronics - Audio, Home & Garden - Appliances, Home & Garden - Furniture, Home & Garden - Kitchen, Home & Garden - Tools, Fashion & Accessories - Clothing, Fashion & Accessories - Shoes, Fashion & Accessories - Jewelry, Fashion & Accessories - Luxury, Sports & Outdoors - Fitness, Sports & Outdoors - Cycling, Sports & Outdoors - Camping, Automotive - Parts, Automotive - Accessories, Books & Media - Textbooks, Books & Media - Comics, Art & Collectibles - Vintage, Art & Collectibles - Antiques),
  "condition": "good" (new, like-new, good, fair),
  "confidence": 0.85 (0-1 scale),
  "description": "Detailed product description based on visual analysis",
  "suggestedPrice": 750 (estimated market value in USD),
  "marketComparison": {
    "averagePrice": 765,
    "priceRange": { "min": 650, "max": 850 },
    "similarListings": 47,
    "marketTrend": "stable"
  },
  "defectsDetected": ["List of visible defects or wear"],
  "valuationBreakdown": {
    "baseValue": 900,
    "conditionAdjustment": -120,
    "marketDemand": -30,
    "finalEstimate": 750
  }
}

Analyze the image carefully for:
1. Product identification (brand, model, variant)
2. Condition assessment (scratches, wear, damage)
3. Market value estimation
4. Visible defects or issues
5. Overall quality and authenticity

Provide accurate, realistic pricing based on current market conditions. Be thorough in defect detection.`
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
      max_tokens: 1500,
      temperature: 0.3,
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
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Return a fallback response
    return NextResponse.json({
      category: "Electronics - General",
      condition: "good",
      confidence: 0.5,
      description: "Unable to analyze image automatically. Please fill in the details manually.",
      suggestedPrice: 100,
      marketComparison: {
        averagePrice: 100,
        priceRange: { min: 50, max: 150 },
        similarListings: 0,
        marketTrend: 'unknown'
      },
      defectsDetected: ["Please inspect manually"],
      valuationBreakdown: {
        baseValue: 100,
        conditionAdjustment: 0,
        marketDemand: 0,
        finalEstimate: 100
      }
    }, { status: 200 });
  }
}
