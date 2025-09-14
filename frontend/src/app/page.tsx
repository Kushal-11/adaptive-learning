"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [profile, setProfile] = useState<"buyer" | "seller" | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

  // Mock data for demo
  useEffect(() => {
    const sampleProducts = [
      {
        _id: "1",
        makeModel: "iPhone 15 Pro",
        variant: "256GB Space Black",
        condition: "good",
        currentPrice: 899,
        originalPrice: 1099,
        quickSalePrice: 750,
        holdOutPrice: 950,
        description: "Excellent condition iPhone with minor wear",
        defects: "Minor scratches on screen protector",
        images: ["📱"],
        location: { address: "Palo Alto, CA" },
        status: "active",
        createdAt: Date.now(),
        category: "electronics",
        sellerId: "seller1"
      },
      {
        _id: "2", 
        makeModel: "MacBook Air M2",
        variant: "256GB Silver",
        condition: "like-new",
        currentPrice: 1050,
        originalPrice: 1299,
        quickSalePrice: 950,
        holdOutPrice: 1150,
        description: "Barely used MacBook Air in excellent condition",
        defects: "None",
        images: ["💻"],
        location: { address: "San Francisco, CA" },
        status: "active",
        createdAt: Date.now(),
        category: "electronics",
        sellerId: "seller2"
      },
      {
        _id: "3",
        makeModel: "Dyson Pure Cool",
        variant: "TP01 Tower Fan",
        condition: "good",
        currentPrice: 180,
        originalPrice: 249,
        quickSalePrice: 160,
        holdOutPrice: 200,
        description: "Tower fan with air purification",
        defects: "Remote control missing, minor dust buildup",
        images: ["🌀"],
        location: { address: "San Francisco, CA" },
        status: "active",
        createdAt: Date.now(),
        category: "appliances",
        sellerId: "seller3"
      }
    ];

    const sampleUsers = [
      { _id: "seller1", name: "Sarah Johnson", email: "sarah.johnson@email.com", role: "seller" },
      { _id: "seller2", name: "Mike Chen", email: "mike.chen@email.com", role: "seller" },
      { _id: "seller3", name: "Michelle Wang", email: "michelle.wang@email.com", role: "seller" },
      { _id: "buyer1", name: "John Smith", email: "john.smith@email.com", role: "buyer" }
    ];

    setProducts(sampleProducts);
    setUsers(sampleUsers);
  }, []);

  const showNotification = (message: string, type: string = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredProducts = products.filter(product => 
    searchTerm === "" || 
    product.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSellerChange = (sellerId: string) => {
    setSelectedSeller(sellerId);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (!selectedSeller) {
      showNotification("Please select a seller first", "error");
      return;
    }
    
    const newProduct = {
      _id: Date.now().toString(),
      makeModel: formData.get('makeModel') as string,
      variant: formData.get('variant') as string,
      condition: formData.get('condition') as string,
      currentPrice: parseInt(formData.get('currentPrice') as string),
      originalPrice: parseInt(formData.get('originalPrice') as string),
      quickSalePrice: parseInt(formData.get('quickSalePrice') as string) || undefined,
      holdOutPrice: parseInt(formData.get('holdOutPrice') as string) || undefined,
      description: formData.get('description') as string,
      defects: formData.get('defects') as string,
      category: formData.get('category') as string,
      location: { address: formData.get('location') as string || "Location not specified" },
      images: ['📦'],
      status: "active",
      createdAt: Date.now(),
      sellerId: selectedSeller
    };

    setProducts([...products, newProduct]);
    showNotification("Product listed successfully!", "success");
    
    // Reset form
    (e.target as HTMLFormElement).reset();
    setUploadedImage(null);
    setAnalysis(null);
  };

  const analyzeImage = async (imageFile: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalyses = [
      {
        category: "Electronics - Smartphones",
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
        }
      },
      {
        category: "Electronics - Laptops", 
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
        }
      },
      {
        category: "Home & Garden - Appliances",
        condition: "good",
        confidence: 0.85,
        description: "Dyson V15 cordless vacuum in good working condition with all attachments. Shows normal wear from regular use.",
        suggestedPrice: 320,
        marketComparison: {
          averagePrice: 340,
          priceRange: { min: 280, max: 400 },
          similarListings: 23,
          marketTrend: 'stable'
        },
        defectsDetected: ["Minor scuff marks on body", "Slight wear on trigger"],
        valuationBreakdown: {
          baseValue: 450,
          conditionAdjustment: -100,
          marketDemand: -30,
          finalEstimate: 320
        }
      },
      {
        category: "Fashion & Accessories - Luxury",
        condition: "like-new",
        confidence: 0.90,
        description: "Louis Vuitton Neverfull MM in Damier Ebene canvas, barely used with original dust bag and receipt.",
        suggestedPrice: 1200,
        marketComparison: {
          averagePrice: 1250,
          priceRange: { min: 1100, max: 1400 },
          similarListings: 15,
          marketTrend: 'rising'
        },
        defectsDetected: ["Very minor corner wear"],
        valuationBreakdown: {
          baseValue: 1500,
          conditionAdjustment: -250,
          marketDemand: -50,
          finalEstimate: 1200
        }
      }
    ];
    
    const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
    setAnalysis(randomAnalysis);
    
    // Auto-fill form fields
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const categoryInput = form.querySelector('input[name="category"]') as HTMLInputElement;
      const conditionSelect = form.querySelector('select[name="condition"]') as HTMLSelectElement;
      const descriptionTextarea = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      const defectsTextarea = form.querySelector('textarea[name="defects"]') as HTMLTextAreaElement;
      const currentPriceInput = form.querySelector('input[name="currentPrice"]') as HTMLInputElement;
      const quickSalePriceInput = form.querySelector('input[name="quickSalePrice"]') as HTMLInputElement;
      const holdOutPriceInput = form.querySelector('input[name="holdOutPrice"]') as HTMLInputElement;
      
      if (categoryInput) categoryInput.value = randomAnalysis.category;
      if (conditionSelect) conditionSelect.value = randomAnalysis.condition;
      if (descriptionTextarea) descriptionTextarea.value = randomAnalysis.description;
      if (defectsTextarea) defectsTextarea.value = randomAnalysis.defectsDetected.join(", ");
      if (currentPriceInput) currentPriceInput.value = randomAnalysis.suggestedPrice.toString();
      if (quickSalePriceInput) quickSalePriceInput.value = Math.round(randomAnalysis.suggestedPrice * 0.85).toString();
      if (holdOutPriceInput) holdOutPriceInput.value = Math.round(randomAnalysis.suggestedPrice * 1.15).toString();
    }
    
    setIsAnalyzing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      await analyzeImage(file);
      showNotification(`AI analysis complete! Form auto-filled.`, "success");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl text-white z-50 transition-all duration-300 transform shadow-2xl backdrop-blur-sm ${
          notification.type === 'success' ? 'bg-emerald-500/90 border border-emerald-400/50' : 
          notification.type === 'error' ? 'bg-red-500/90 border border-red-400/50' : 'bg-blue-500/90 border border-blue-400/50'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                    <span className="text-white font-bold text-2xl">BB</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      🤖 BuyBot Multi-Agent Marketplace
                    </h1>
                    <p className="text-blue-200/80 text-lg font-medium mt-1">AI Agents with Convex Database - Modern UI Experience</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="/auth"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg"
                >
                  👤 Sign In
                </a>
                <a
                  href="/auth"
                  className="bg-white text-slate-900 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  📝 Sign Up
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Connection Status */}
        <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-150"></div>
            </div>
            <span className="font-semibold text-slate-800">Status: Connected to Convex Database</span>
            <span className="text-sm text-slate-600 bg-white/60 px-3 py-1 rounded-full">Real-time data synchronization enabled</span>
          </div>
        </div>

        {/* Database Controls */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6 m-6 shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
            🗄️ Database Management
            <div className="h-px bg-gradient-to-r from-amber-300 to-transparent flex-1 ml-4"></div>
          </h3>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => showNotification("Data refreshed!", "success")}
            >
              🔄 Refresh Data
            </button>
            <button 
              className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => showNotification("Database seeded with sample data!", "success")}
            >
              🌱 Seed Database
            </button>
            <div className="text-sm text-slate-700 bg-white/70 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/50">
              Products: <span className="font-bold text-blue-600">{products.length}</span> |
              Users: <span className="font-bold text-emerald-600">{users.length}</span>
            </div>
          </div>
        </div>

        {/* Autonomous AI Agent Controls */}
        <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 border border-violet-200/50 rounded-2xl p-6 m-6 shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-slate-800">
            🤖 Autonomous Negotiator Agent
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm px-3 py-1 rounded-full animate-pulse shadow-lg border border-emerald-400/50">ACTIVE</span>
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The AI negotiator agent runs in the background, automatically matching buyers with sellers and negotiating win-win deals.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button 
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => {
                showNotification("🤖 Negotiator agent triggered! Matching buyers and sellers...", "info");
                setTimeout(() => {
                  showNotification("✅ Agent processed 3 matches, 1 deal completed!", "success");
                }, 3000);
              }}
            >
              🚀 Trigger Agent
            </button>
            <button 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => showNotification("📊 Agent Status: 5 active negotiations, 12 completed deals today", "info")}
            >
              📊 Agent Status
            </button>
            <button 
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => showNotification("📧 Email notifications sent to 4 users for completed deals", "success")}
            >
              📧 View Notifications
            </button>
            <div className="text-sm text-slate-700 bg-white/70 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/50 font-semibold">
              🎯 Match Rate: <span className="text-purple-600">87%</span> | 💰 Avg Savings: <span className="text-emerald-600">$127</span>
            </div>
          </div>
        </div>

        {/* Profile Selector */}
        {!profile ? (
          <div className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Choose Your Profile</h2>
            <div className="flex gap-8 justify-center">
              <button
                onClick={() => setProfile("buyer")}
                className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 border border-blue-400/20"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🛒</div>
                <div className="text-xl font-bold">Buyer Profile</div>
              </button>
              <button
                onClick={() => setProfile("seller")}
                className="group bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 border border-emerald-400/20"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏪</div>
                <div className="text-xl font-bold">Seller Profile</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Profile Switch Buttons */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => setProfile("buyer")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  profile === "buyer" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25 transform scale-105" 
                    : "bg-white/80 text-slate-700 hover:bg-white hover:shadow-xl backdrop-blur-sm border border-slate-200/50"
                }`}
              >
                🛒 Buyer Profile
              </button>
              <button
                onClick={() => setProfile("seller")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  profile === "seller" 
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/25 transform scale-105" 
                    : "bg-white/80 text-slate-700 hover:bg-white hover:shadow-xl backdrop-blur-sm border border-slate-200/50"
                }`}
              >
                🏪 Seller Profile
              </button>
              <button
                onClick={() => setProfile(null)}
                className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ← Back
              </button>
            </div>

            {/* Seller Section */}
            {profile === "seller" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Seller Panel */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200/50 shadow-xl backdrop-blur-sm">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    🏪 Seller Profile
                  </h2>

                  {/* Seller Profile Info */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border-l-4 border-emerald-500 shadow-lg">
                    <h4 className="font-bold mb-3 text-lg text-slate-800 flex items-center gap-2">
                      👤 Demo Seller
                      <div className="h-px bg-gradient-to-r from-emerald-300 to-transparent flex-1 ml-3"></div>
                    </h4>
                    <div className="space-y-2 text-slate-700">
                      <p><strong>Name:</strong> Demo Seller</p>
                      <p><strong>Email:</strong> seller@example.com</p>
                      <p><strong>Location:</strong> Palo Alto, CA</p>
                      <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (4.8/5)</p>
                      <p><strong>Verified:</strong> ✅ Email, Phone & ID</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block font-semibold mb-3 text-slate-800">Select Seller Account</label>
                    <select 
                      value={selectedSeller}
                      onChange={(e) => handleSellerChange(e.target.value)}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200"
                    >
                      <option value="">Choose existing seller...</option>
                      {users.filter(u => u.role === 'seller').map(seller => (
                        <option key={seller._id} value={seller._id}>
                          {seller.name} ({seller.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Creation Form */}
                  <form onSubmit={handleCreateListing} className="space-y-4 mt-6">
                    {/* AI-Powered Product Analysis - MOVED TO TOP */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        ✨ AI-Powered Product Analysis
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload your product image first - our AI will automatically analyze and fill the form!
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-white">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="imageUpload"
                          />
                          <label htmlFor="imageUpload" className="cursor-pointer">
                            {uploadedImage ? (
                              <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover rounded-lg mb-2" />
                            ) : (
                              <div className="text-6xl mb-2">📷</div>
                            )}
                            <div className="text-sm font-medium">Click to upload product image</div>
                            <div className="text-xs text-gray-500">JPG, PNG, WebP (max 10MB)</div>
                          </label>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            🤖 AI Analysis
                          </h4>
                          {isAnalyzing ? (
                            <div className="text-center">
                              <div className="animate-spin text-2xl mb-2">🔄</div>
                              <div className="text-sm">Analyzing image...</div>
                            </div>
                          ) : analysis ? (
                            <div className="space-y-2 text-sm">
                              <div><strong>Category:</strong> {analysis.category}</div>
                              <div><strong>Condition:</strong> {analysis.condition}</div>
                              <div><strong>Suggested Price:</strong> ${analysis.suggestedPrice}</div>
                              <div><strong>Market Average:</strong> ${analysis.marketComparison.averagePrice}</div>
                              <div><strong>Confidence:</strong> {Math.round(analysis.confidence * 100)}%</div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Upload image for AI analysis
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-2">Category</label>
                        <input
                          type="text"
                          name="category"
                          placeholder="e.g., Electronics - Smartphones, Home & Garden - Appliances"
                          required
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          💡 Popular: Electronics - Smartphones/Laptops/Gaming, Home & Garden - Appliances/Tools, Fashion & Accessories - Clothing/Jewelry/Luxury, Sports & Outdoors - Fitness/Camping, Automotive - Parts/Accessories, Books & Media - Textbooks/Collectibles
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Condition</label>
                        <select name="condition" required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none">
                          <option value="new">New</option>
                          <option value="like-new">Like New</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Make & Model</label>
                      <input
                        type="text"
                        name="makeModel"
                        placeholder="e.g., iPhone 14 Pro"
                        required
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Variant</label>
                      <input
                        type="text"
                        name="variant"
                        placeholder="e.g., 256GB Space Black"
                        required
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Original Price ($)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        placeholder="1099"
                        required
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-2 text-red-600">Quick Sale ($)</label>
                        <input
                          type="number"
                          name="quickSalePrice"
                          placeholder="659"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-green-600">Fair Market ($)</label>
                        <input
                          type="number"
                          name="currentPrice"
                          placeholder="769"
                          required
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-orange-600">Hold Out ($)</label>
                        <input
                          type="number"
                          name="holdOutPrice"
                          placeholder="879"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Pickup Location</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Enter your address or use current location"
                        required
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Description</label>
                      <textarea
                        name="description"
                        placeholder="Describe your product in detail..."
                        required
                        rows={3}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Known Defects</label>
                      <textarea
                        name="defects"
                        placeholder="Minor scratches on screen, small dent on back corner"
                        rows={2}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      🚀 List Item
                    </button>
                  </form>
                </div>

                {/* Products Display */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-4">📦 Available Products</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{product.makeModel}</h4>
                          <span className="text-2xl">{product.images[0]}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.variant}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-green-600">${product.currentPrice}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.condition === 'new' ? 'bg-green-100 text-green-800' :
                            product.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                            product.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.condition}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="text-xs text-gray-500">
                          📍 {product.location.address} • Listed {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Buyer Section */}
            {profile === "buyer" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Buyer Panel */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-blue-200">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    🛒 Buyer Agent
                  </h2>

                  {/* Buyer Profile Info */}
                  <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-green-500">
                    <h4 className="font-bold mb-2">👤 Buyer Profile</h4>
                    <p><strong>Name:</strong> John Smith</p>
                    <p><strong>Email:</strong> john.smith@email.com</p>
                    <p><strong>Location:</strong> San Francisco, CA</p>
                    <p><strong>Verified:</strong> ✅ Email & Phone</p>
                  </div>

                  {/* Search Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2">Looking For (Category)</label>
                      <input
                        type="text"
                        placeholder="e.g., Electronics - Smartphones, Home & Garden, Fashion"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        💡 Browse: Electronics - Smartphones/Laptops/Gaming/Audio, Home & Garden - Appliances/Furniture/Tools/Decor, Fashion & Accessories - Clothing/Shoes/Jewelry/Luxury, Sports & Outdoors - Fitness/Camping/Cycling, Automotive - Parts/Accessories/Tools, Books & Media - Textbooks/Comics/Vinyl, Art & Collectibles - Vintage/Antiques/Memorabilia
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Search Terms</label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="iPhone 14 Pro, MacBook, fan, etc."
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        💡 Try searching: "fan", "iPhone", "laptop", "MacBook"
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-2">Min Price ($)</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Max Price ($)</label>
                        <input
                          type="number"
                          placeholder="1000"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Display */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-4">🔍 Search Results</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{product.makeModel}</h4>
                          <span className="text-2xl">{product.images[0]}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.variant}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-blue-600">${product.currentPrice}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.condition === 'new' ? 'bg-green-100 text-green-800' :
                            product.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                            product.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.condition}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="text-xs text-gray-500">
                          📍 {product.location.address} • Listed {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
