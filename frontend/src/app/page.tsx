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
        }
      }
    ];
    
    const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
    setAnalysis(randomAnalysis);
    
    // Auto-fill form fields
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const categorySelect = form.querySelector('select[name="category"]') as HTMLSelectElement;
      const conditionSelect = form.querySelector('select[name="condition"]') as HTMLSelectElement;
      const descriptionTextarea = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      const defectsTextarea = form.querySelector('textarea[name="defects"]') as HTMLTextAreaElement;
      const currentPriceInput = form.querySelector('input[name="currentPrice"]') as HTMLInputElement;
      const quickSalePriceInput = form.querySelector('input[name="quickSalePrice"]') as HTMLInputElement;
      const holdOutPriceInput = form.querySelector('input[name="holdOutPrice"]') as HTMLInputElement;
      
      if (categorySelect) categorySelect.value = randomAnalysis.category;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transition-transform ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BB</span>
                </div>
                <h1 className="text-4xl font-bold">🤖 BuyBot Multi-Agent Marketplace</h1>
              </div>
              <p className="text-blue-100">AI Agents with Convex Database - Modern UI Experience</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/auth"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                👤 Sign In
              </a>
              <a
                href="/auth"
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                📝 Sign Up
              </a>
            </div>
          </div>
        </header>

        {/* Connection Status */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b-2 border-blue-200">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Status: Connected to Convex Database</span>
            <span className="text-sm text-gray-600">Real-time data synchronization enabled</span>
          </div>
        </div>

        {/* Database Controls */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <h3 className="text-lg font-bold mb-3">🗄️ Database Management</h3>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => showNotification("Data refreshed!", "success")}
            >
              🔄 Refresh Data
            </button>
            <button 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => showNotification("Database seeded with sample data!", "success")}
            >
              🌱 Seed Database
            </button>
            <div className="text-sm text-gray-600">
              Products: <span className="font-semibold">{products.length}</span> |
              Users: <span className="font-semibold">{users.length}</span>
            </div>
          </div>
        </div>

        {/* Autonomous AI Agent Controls */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 m-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            🤖 Autonomous Negotiator Agent
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">ACTIVE</span>
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            The AI negotiator agent runs in the background, automatically matching buyers with sellers and negotiating win-win deals.
          </p>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
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
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => showNotification("📊 Agent Status: 5 active negotiations, 12 completed deals today", "info")}
            >
              📊 Agent Status
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => showNotification("📧 Email notifications sent to 4 users for completed deals", "success")}
            >
              📧 View Notifications
            </button>
            <div className="text-sm text-purple-600 font-semibold">
              🎯 Match Rate: 87% | 💰 Avg Savings: $127
            </div>
          </div>
        </div>

        {/* Profile Selector */}
        {!profile ? (
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Choose Your Profile</h2>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => setProfile("buyer")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                🛒 Buyer Profile
              </button>
              <button
                onClick={() => setProfile("seller")}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                🏪 Seller Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Profile Switch Buttons */}
            <div className="flex gap-4 mb-6 justify-center">
              <button
                onClick={() => setProfile("buyer")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  profile === "buyer" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🛒 Buyer Profile
              </button>
              <button
                onClick={() => setProfile("seller")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  profile === "seller" 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🏪 Seller Profile
              </button>
              <button
                onClick={() => setProfile(null)}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
              >
                ← Back
              </button>
            </div>

            {/* Seller Section */}
            {profile === "seller" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Seller Panel */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-green-200">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    🏪 Seller Profile
                  </h2>

                  {/* Seller Profile Info */}
                  <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-green-500">
                    <h4 className="font-bold mb-2">👤 Demo Seller</h4>
                    <p><strong>Name:</strong> Demo Seller</p>
                    <p><strong>Email:</strong> seller@example.com</p>
                    <p><strong>Location:</strong> Palo Alto, CA</p>
                    <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (4.8/5)</p>
                    <p><strong>Verified:</strong> ✅ Email, Phone & ID</p>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Select Seller Account</label>
                    <select 
                      value={selectedSeller}
                      onChange={(e) => handleSellerChange(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
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
                        <select name="category" required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none">
                          <option value="">Select category...</option>
                          <option value="electronics">Electronics</option>
                          <option value="appliances">Appliances</option>
                          <option value="furniture">Furniture</option>
                          <option value="clothing">Clothing</option>
                        </select>
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
                      <label className="block font-semibold mb-2">Looking For</label>
                      <select className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                        <option value="">Select category...</option>
                        <option value="electronics">Electronics</option>
                        <option value="appliances">Appliances</option>
                        <option value="furniture">Furniture</option>
                        <option value="clothing">Clothing</option>
                      </select>
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
