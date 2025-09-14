"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ImageAnalysis {
  category: string;
  condition: string;
  confidence: number;
  description: string;
  suggestedPrice: number;
  marketComparison: {
    averagePrice: number;
    priceRange: { min: number; max: number };
    similarListings: number;
    marketTrend: 'rising' | 'stable' | 'declining';
  };
  defectsDetected: string[];
  valuationBreakdown: {
    baseValue: number;
    conditionAdjustment: number;
    marketDemand: number;
    finalEstimate: number;
  };
  reverseSearchResults: {
    found: boolean;
    matchingProducts: number;
    averageMarketPrice: number;
    confidence: number;
  };
}

export default function SellPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [formData, setFormData] = useState({
    makeModel: "",
    variant: "",
    category: "",
    condition: "",
    originalPrice: "",
    currentPrice: "",
    quickSalePrice: "",
    holdOutPrice: "",
    description: "",
    defects: "",
    location: ""
  });

  // const createProduct = useMutation(api.products?.createProduct);

  const analyzeImage = async (imageFile: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Enhanced AI analysis with comprehensive valuation and reverse search
    const mockAnalyses: ImageAnalysis[] = [
      {
        category: "electronics",
        condition: "good",
        confidence: 0.92,
        description: "iPhone 14 Pro 256GB in good condition with minor wear on edges and back. Screen is pristine with no cracks. Battery health appears good based on visual inspection.",
        suggestedPrice: 750,
        marketComparison: {
          averagePrice: 765,
          priceRange: { min: 650, max: 850 },
          similarListings: 47,
          marketTrend: 'stable'
        },
        defectsDetected: ["Minor edge wear", "Small scratches on back", "Slight discoloration on charging port"],
        valuationBreakdown: {
          baseValue: 900,
          conditionAdjustment: -120,
          marketDemand: -30,
          finalEstimate: 750
        },
        reverseSearchResults: {
          found: true,
          matchingProducts: 23,
          averageMarketPrice: 765,
          confidence: 0.89
        }
      },
      {
        category: "electronics", 
        condition: "like-new",
        confidence: 0.88,
        description: "MacBook Air M2 13-inch in excellent condition with minimal usage signs. No visible scratches or dents. Original packaging and accessories included.",
        suggestedPrice: 1050,
        marketComparison: {
          averagePrice: 1075,
          priceRange: { min: 950, max: 1200 },
          similarListings: 31,
          marketTrend: 'rising'
        },
        defectsDetected: ["Very minor keyboard wear", "Slight palm rest shine"],
        valuationBreakdown: {
          baseValue: 1299,
          conditionAdjustment: -200,
          marketDemand: -49,
          finalEstimate: 1050
        },
        reverseSearchResults: {
          found: true,
          matchingProducts: 18,
          averageMarketPrice: 1075,
          confidence: 0.91
        }
      },
      {
        category: "appliances",
        condition: "good", 
        confidence: 0.85,
        description: "Dyson V8 cordless vacuum in good working condition with normal wear patterns. All attachments included. Battery holds charge well.",
        suggestedPrice: 180,
        marketComparison: {
          averagePrice: 195,
          priceRange: { min: 150, max: 240 },
          similarListings: 28,
          marketTrend: 'declining'
        },
        defectsDetected: ["Dust buildup in crevices", "Minor scratches on body", "Slight wear on trigger"],
        valuationBreakdown: {
          baseValue: 250,
          conditionAdjustment: -50,
          marketDemand: -20,
          finalEstimate: 180
        },
        reverseSearchResults: {
          found: true,
          matchingProducts: 15,
          averageMarketPrice: 195,
          confidence: 0.82
        }
      },
      {
        category: "furniture",
        condition: "fair",
        confidence: 0.78,
        description: "Wooden dining chair with visible scratches and minor structural wear. Still functional but shows age. Could benefit from refinishing.",
        suggestedPrice: 45,
        marketComparison: {
          averagePrice: 55,
          priceRange: { min: 30, max: 80 },
          similarListings: 12,
          marketTrend: 'stable'
        },
        defectsDetected: ["Multiple scratches on surface", "Minor wobble in legs", "Faded finish", "Small dent on backrest"],
        valuationBreakdown: {
          baseValue: 120,
          conditionAdjustment: -60,
          marketDemand: -15,
          finalEstimate: 45
        },
        reverseSearchResults: {
          found: true,
          matchingProducts: 8,
          averageMarketPrice: 55,
          confidence: 0.75
        }
      }
    ];
    
    const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
    setAnalysis(randomAnalysis);
    
    // Auto-fill form fields including defects
    setFormData(prev => ({
      ...prev,
      category: randomAnalysis.category,
      condition: randomAnalysis.condition,
      description: randomAnalysis.description,
      defects: randomAnalysis.defectsDetected.join(", "),
      currentPrice: randomAnalysis.suggestedPrice.toString(),
      quickSalePrice: Math.round(randomAnalysis.suggestedPrice * 0.85).toString(),
      holdOutPrice: Math.round(randomAnalysis.suggestedPrice * 1.15).toString()
    }));
    
    setIsAnalyzing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      // Start AI analysis
      await analyzeImage(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In real implementation, this would save to Convex
      console.log("Creating product:", formData);
      alert("Product listed successfully!");
      
      // Reset form
      setFormData({
        makeModel: "",
        variant: "",
        category: "",
        condition: "",
        originalPrice: "",
        currentPrice: "",
        quickSalePrice: "",
        holdOutPrice: "",
        description: "",
        defects: "",
        location: ""
      });
      setUploadedImage(null);
      setAnalysis(null);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">BB</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">🏪 BuyBot Seller Portal</h1>
                <p className="text-green-100">AI-Powered Product Analysis & Listing</p>
              </div>
            </div>
            <a
              href="/"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              ← Back to Marketplace
            </a>
          </div>
        </header>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Image Upload - FIRST */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                📷 Upload Product Image
              </h2>
              <p className="text-gray-600 mb-4">
                Our AI will analyze your image to automatically detect category, condition, and suggest pricing
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div>
                  <div 
                    className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded product" 
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-green-600 font-semibold">✅ Image uploaded successfully!</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                            setAnalysis(null);
                            setFormData(prev => ({
                              ...prev,
                              category: "",
                              condition: "",
                              description: "",
                              currentPrice: ""
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 text-sm underline"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-6xl">📷</div>
                        <div>
                          <p className="text-xl font-semibold text-gray-700">Click to upload product image</p>
                          <p className="text-gray-500 mt-2">or drag and drop your image here</p>
                          <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, WebP (max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                </div>

                {/* AI Analysis Results */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    🤖 AI Analysis Results
                  </h3>
                  
                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-blue-600 font-semibold">🔍 Analyzing your image...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-green-800 mb-2">✅ Analysis Complete</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Category:</strong> <span className="capitalize bg-blue-100 px-2 py-1 rounded">{analysis.category}</span></p>
                          <p><strong>Condition:</strong> <span className="capitalize bg-yellow-100 px-2 py-1 rounded">{analysis.condition}</span></p>
                          <p><strong>Confidence:</strong> <span className="bg-green-100 px-2 py-1 rounded">{(analysis.confidence * 100).toFixed(0)}%</span></p>
                          <p><strong>Suggested Price:</strong> <span className="bg-purple-100 px-2 py-1 rounded font-bold">${analysis.suggestedPrice}</span></p>
                        </div>
                      </div>

                      {/* Reverse Search Results */}
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                          🔍 Reverse Image Search
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Found:</strong> <span className={analysis.reverseSearchResults.found ? "text-green-600" : "text-red-600"}>{analysis.reverseSearchResults.found ? "✅ Yes" : "❌ No"}</span></p>
                          <p><strong>Similar Products:</strong> {analysis.reverseSearchResults.matchingProducts}</p>
                          <p><strong>Market Average:</strong> <span className="font-bold">${analysis.reverseSearchResults.averageMarketPrice}</span></p>
                          <p><strong>Search Confidence:</strong> <span className="bg-orange-100 px-2 py-1 rounded">{(analysis.reverseSearchResults.confidence * 100).toFixed(0)}%</span></p>
                        </div>
                      </div>

                      {/* Market Comparison */}
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                          📊 Market Analysis
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Market Average:</strong> <span className="font-bold">${analysis.marketComparison.averagePrice}</span></p>
                          <p><strong>Price Range:</strong> ${analysis.marketComparison.priceRange.min} - ${analysis.marketComparison.priceRange.max}</p>
                          <p><strong>Similar Listings:</strong> {analysis.marketComparison.similarListings}</p>
                          <p><strong>Market Trend:</strong> 
                            <span className={`px-2 py-1 rounded text-xs font-bold ml-1 ${
                              analysis.marketComparison.marketTrend === 'rising' ? 'bg-green-100 text-green-800' :
                              analysis.marketComparison.marketTrend === 'declining' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {analysis.marketComparison.marketTrend === 'rising' ? '📈 Rising' :
                               analysis.marketComparison.marketTrend === 'declining' ? '📉 Declining' :
                               '➡️ Stable'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Valuation Breakdown */}
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                          💰 Valuation Breakdown
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Base Value:</strong> <span className="text-green-600">${analysis.valuationBreakdown.baseValue}</span></p>
                          <p><strong>Condition Adjustment:</strong> <span className="text-red-600">${analysis.valuationBreakdown.conditionAdjustment}</span></p>
                          <p><strong>Market Demand:</strong> <span className="text-red-600">${analysis.valuationBreakdown.marketDemand}</span></p>
                          <hr className="my-2 border-indigo-200" />
                          <p><strong>Final Estimate:</strong> <span className="font-bold text-lg text-indigo-800">${analysis.valuationBreakdown.finalEstimate}</span></p>
                        </div>
                      </div>

                      {/* Detected Defects */}
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                          ⚠️ Detected Issues
                        </h4>
                        <div className="space-y-1 text-sm">
                          {analysis.defectsDetected.map((defect, index) => (
                            <p key={index} className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                              {defect}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-2">📝 AI Description</h4>
                        <p className="text-sm text-gray-700">{analysis.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">🤖</div>
                      <p>Upload an image to start AI analysis</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Product Details - Auto-filled by AI */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                📝 Product Details
                {analysis && <span className="text-sm text-green-600 font-normal">(Auto-filled by AI)</span>}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="">Select category...</option>
                      <option value="electronics">📱 Electronics</option>
                      <option value="appliances">🏠 Appliances</option>
                      <option value="furniture">🪑 Furniture</option>
                      <option value="clothing">👕 Clothing</option>
                      <option value="books">📚 Books</option>
                      <option value="sports">⚽ Sports & Recreation</option>
                      <option value="automotive">🚗 Automotive</option>
                      <option value="other">🔧 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="">Select condition...</option>
                      <option value="new">🆕 New</option>
                      <option value="like-new">✨ Like New</option>
                      <option value="good">👍 Good</option>
                      <option value="fair">⚠️ Fair</option>
                      <option value="poor">❌ Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make & Model *</label>
                    <input
                      type="text"
                      name="makeModel"
                      value={formData.makeModel}
                      onChange={handleInputChange}
                      placeholder="e.g., iPhone 14 Pro, MacBook Air M2"
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant/Specifications</label>
                    <input
                      type="text"
                      name="variant"
                      value={formData.variant}
                      onChange={handleInputChange}
                      placeholder="e.g., 256GB Space Black, 13-inch Silver"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($) *</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="1099"
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Asking Price ($) *
                      {analysis && <span className="text-green-600 text-xs">(AI Suggested: ${analysis.suggestedPrice})</span>}
                    </label>
                    <input
                      type="number"
                      name="currentPrice"
                      value={formData.currentPrice}
                      onChange={handleInputChange}
                      placeholder="899"
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-red-600 mb-2">Quick Sale ($)</label>
                      <input
                        type="number"
                        name="quickSalePrice"
                        value={formData.quickSalePrice}
                        onChange={handleInputChange}
                        placeholder="750"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-600 mb-2">Hold Out ($)</label>
                      <input
                        type="number"
                        name="holdOutPrice"
                        value={formData.holdOutPrice}
                        onChange={handleInputChange}
                        placeholder="950"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                    {analysis && <span className="text-green-600 text-xs">(Auto-generated by AI)</span>}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product in detail..."
                    rows={4}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Known Defects or Issues</label>
                  <textarea
                    name="defects"
                    value={formData.defects}
                    onChange={handleInputChange}
                    placeholder="Minor scratches on screen, small dent on back corner, etc."
                    rows={2}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your address or general area"
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!uploadedImage || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isAnalyzing ? "🔍 Analyzing..." : "🚀 List My Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    makeModel: "",
                    variant: "",
                    category: "",
                    condition: "",
                    originalPrice: "",
                    currentPrice: "",
                    quickSalePrice: "",
                    holdOutPrice: "",
                    description: "",
                    defects: "",
                    location: ""
                  });
                  setUploadedImage(null);
                  setAnalysis(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-bold transition-colors"
              >
                🔄 Clear All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
