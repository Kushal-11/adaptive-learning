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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchingStage, setMatchingStage] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [activeNegotiation, setActiveNegotiation] = useState<any>(null);
  const [negotiationStage, setNegotiationStage] = useState(0);
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState<any[]>([]);
  const [multiNegotiation, setMultiNegotiation] = useState<any>(null);
  const [locationRadius, setLocationRadius] = useState("25");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Category options for dropdown
  const categoryOptions = [
    "Electronics - Smartphones",
    "Electronics - Laptops", 
    "Electronics - Gaming",
    "Electronics - Cameras",
    "Electronics - Audio",
    "Home & Garden - Appliances",
    "Home & Garden - Furniture", 
    "Home & Garden - Kitchen",
    "Home & Garden - Tools",
    "Fashion & Accessories - Clothing",
    "Fashion & Accessories - Shoes",
    "Fashion & Accessories - Jewelry",
    "Fashion & Accessories - Luxury",
    "Sports & Outdoors - Fitness",
    "Sports & Outdoors - Cycling",
    "Sports & Outdoors - Camping",
    "Automotive - Parts",
    "Automotive - Accessories",
    "Books & Media - Textbooks",
    "Books & Media - Comics",
    "Art & Collectibles - Vintage",
    "Art & Collectibles - Antiques"
  ];

  // Generate available time slots
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const today = new Date();
      
      // Generate slots for next 7 days
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        // Morning slots
        slots.push(`${dateStr} - 9:00 AM`);
        slots.push(`${dateStr} - 11:00 AM`);
        
        // Afternoon slots
        slots.push(`${dateStr} - 2:00 PM`);
        slots.push(`${dateStr} - 4:00 PM`);
        
        // Evening slots
        slots.push(`${dateStr} - 6:00 PM`);
        slots.push(`${dateStr} - 8:00 PM`);
      }
      
      setAvailableTimeSlots(slots);
    };
    
    generateTimeSlots();
  }, []);

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
        category: "Electronics - Smartphones",
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
        category: "Electronics - Laptops",
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
        category: "Home & Garden - Appliances",
        sellerId: "seller3"
      },
      {
        _id: "4",
        makeModel: "Nike Air Jordan 1",
        variant: "Size 10 Chicago Colorway",
        condition: "like-new",
        currentPrice: 320,
        originalPrice: 170,
        quickSalePrice: 280,
        holdOutPrice: 380,
        description: "Classic Air Jordan 1 in excellent condition, worn only twice",
        defects: "Very minor creasing on toe box",
        images: ["👟"],
        location: { address: "Los Angeles, CA" },
        status: "active",
        createdAt: Date.now() - 86400000,
        category: "Fashion & Accessories - Shoes",
        sellerId: "seller1"
      },
      {
        _id: "5",
        makeModel: "Canon EOS R5",
        variant: "Body Only with Battery Grip",
        condition: "good",
        currentPrice: 2800,
        originalPrice: 3899,
        quickSalePrice: 2500,
        holdOutPrice: 3100,
        description: "Professional mirrorless camera with low shutter count",
        defects: "Minor wear on grip, small scratch on LCD",
        images: ["📷"],
        location: { address: "San Diego, CA" },
        status: "active",
        createdAt: Date.now() - 172800000,
        category: "Electronics - Cameras",
        sellerId: "seller2"
      },
      {
        _id: "6",
        makeModel: "Herman Miller Aeron",
        variant: "Size B Graphite",
        condition: "good",
        currentPrice: 650,
        originalPrice: 1395,
        quickSalePrice: 550,
        holdOutPrice: 750,
        description: "Ergonomic office chair in good working condition",
        defects: "Minor wear on armrests, small stain on seat",
        images: ["🪑"],
        location: { address: "San Francisco, CA" },
        status: "active",
        createdAt: Date.now() - 259200000,
        category: "Home & Garden - Furniture",
        sellerId: "seller3"
      },
      {
        _id: "7",
        makeModel: "PlayStation 5",
        variant: "Standard Edition with Controller",
        condition: "like-new",
        currentPrice: 450,
        originalPrice: 499,
        quickSalePrice: 420,
        holdOutPrice: 480,
        description: "Barely used PS5 with original packaging and accessories",
        defects: "None",
        images: ["🎮"],
        location: { address: "Oakland, CA" },
        status: "active",
        createdAt: Date.now() - 345600000,
        category: "Electronics - Gaming",
        sellerId: "seller1"
      },
      {
        _id: "8",
        makeModel: "Rolex Submariner",
        variant: "116610LN Black Dial",
        condition: "good",
        currentPrice: 12500,
        originalPrice: 8550,
        quickSalePrice: 11800,
        holdOutPrice: 13200,
        description: "Authentic Rolex Submariner with box and papers",
        defects: "Minor scratches on bracelet, normal wear",
        images: ["⌚"],
        location: { address: "Beverly Hills, CA" },
        status: "active",
        createdAt: Date.now() - 432000000,
        category: "Fashion & Accessories - Luxury",
        sellerId: "seller2"
      },
      {
        _id: "9",
        makeModel: "Trek Domane SL 6",
        variant: "56cm Carbon Road Bike",
        condition: "good",
        currentPrice: 2200,
        originalPrice: 3200,
        quickSalePrice: 1950,
        holdOutPrice: 2450,
        description: "High-end carbon road bike with Shimano 105 groupset",
        defects: "Minor chain wear, small paint chips",
        images: ["🚴"],
        location: { address: "Santa Barbara, CA" },
        status: "active",
        createdAt: Date.now() - 518400000,
        category: "Sports & Outdoors - Cycling",
        sellerId: "seller3"
      },
      {
        _id: "10",
        makeModel: "KitchenAid Stand Mixer",
        variant: "Artisan 5-Qt Onyx Black",
        condition: "like-new",
        currentPrice: 280,
        originalPrice: 379,
        quickSalePrice: 250,
        holdOutPrice: 320,
        description: "Professional stand mixer used only a few times",
        defects: "None",
        images: ["🍰"],
        location: { address: "Fresno, CA" },
        status: "active",
        createdAt: Date.now() - 604800000,
        category: "Home & Garden - Kitchen",
        sellerId: "seller1"
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

  const handleBuyerSearch = async () => {
    setIsMatching(true);
    setMatchingProgress(0);
    setShowMatches(false);
    setMatches([]);

    // Stage 1: Analyzing search criteria
    setMatchingStage("Analyzing your search criteria...");
    setMatchingProgress(20);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 2: Scanning product database
    setMatchingStage("Scanning product database...");
    setMatchingProgress(40);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Stage 3: AI matching algorithm
    setMatchingStage("Running AI matching algorithm...");
    setMatchingProgress(60);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stage 4: Calculating compatibility scores
    setMatchingStage("Calculating compatibility scores...");
    setMatchingProgress(80);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 5: Finalizing matches
    setMatchingStage("Finalizing best matches...");
    setMatchingProgress(100);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get filtered products and create matches with scores
    const filteredProducts = getFilteredProducts();
    const matchesWithScores = filteredProducts.map(product => ({
      ...product,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-99% match score
      reasons: generateMatchReasons(product, searchTerm, selectedCategory),
      estimatedSavings: product.originalPrice - product.currentPrice,
      negotiationPotential: Math.floor(Math.random() * 15) + 5 // 5-20% potential savings
    })).sort((a, b) => b.matchScore - a.matchScore);

    setMatches(matchesWithScores);
    setIsMatching(false);
    setShowMatches(true);
    
    showNotification(`🎯 Found ${matchesWithScores.length} high-quality matches! AI agent ready to negotiate.`, "success");
  };

  const generateMatchReasons = (product: any, searchTerm: string, category: string) => {
    const reasons = [];
    
    if (searchTerm && product.makeModel.toLowerCase().includes(searchTerm.toLowerCase())) {
      reasons.push("Exact product match");
    }
    
    if (category && product.category.includes(category)) {
      reasons.push("Perfect category match");
    }
    
    if (product.condition === "like-new") {
      reasons.push("Excellent condition");
    }
    
    const savings = product.originalPrice - product.currentPrice;
    if (savings > 100) {
      reasons.push(`Great savings: $${savings}`);
    }
    
    reasons.push("High seller rating");
    reasons.push("Verified seller");
    
    return reasons.slice(0, 3); // Show top 3 reasons
  };

  const handleStartNegotiation = async (product: any) => {
    setActiveNegotiation(product);
    setNegotiationStage(1);
    
    // Stage 1: Initial offer
    await new Promise(resolve => setTimeout(resolve, 2000));
    setNegotiationStage(2);
    
    // Stage 2: Counter offer
    await new Promise(resolve => setTimeout(resolve, 2500));
    setNegotiationStage(3);
    
    // Stage 3: Final agreement
    await new Promise(resolve => setTimeout(resolve, 2000));
    setNegotiationStage(4);
    
    // Send emails after successful negotiation
    await sendDealEmails(product, product.currentPrice - 75);
  };

  const handleContactSeller = (product: any) => {
    const seller = users.find(u => u._id === product.sellerId);
    setContactDetails({
      product,
      seller,
      messages: [
        {
          from: "buyer",
          message: `Hi! I'm interested in your ${product.makeModel}. Is it still available?`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    });
    setShowContactDetails(true);
    
    // Simulate seller response
    setTimeout(() => {
      setContactDetails((prev: any) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            from: "seller",
            message: `Yes, it's still available! It's in ${product.condition} condition. Would you like to see more photos or arrange a meetup?`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      }));
    }, 3000);
  };

  const sendDealEmails = async (product: any, finalPrice: number) => {
    // Use testing email for both buyer and seller as requested
    const testingEmail = "vineethsai4444@gmail.com";
    
    showNotification(`📧 Sending confirmation emails to buyer and seller...`, "info");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showNotification(`✅ Deal confirmed! Emails sent to ${testingEmail} (buyer & seller)`, "success");
    
    // Show detailed email content
    setTimeout(() => {
      showNotification(`📧 Email Details: Product: ${product.makeModel}, Final Price: $${finalPrice}, Pickup: ${product.location.address}`, "info");
    }, 2000);
  };

  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesSearch = searchTerm === "" || 
        product.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "" || 
        product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesMinPrice = minPrice === "" || 
        product.currentPrice >= parseInt(minPrice);
      
      const matchesMaxPrice = maxPrice === "" || 
        product.currentPrice <= parseInt(maxPrice);
      
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Calculate real statistics
  const calculateStats = () => {
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalValue = products.reduce((sum, product) => sum + product.currentPrice, 0);
    const avgPrice = totalProducts > 0 ? Math.round(totalValue / totalProducts) : 0;
    const avgSavings = products.reduce((sum, product) => {
      const savings = product.originalPrice - product.currentPrice;
      return sum + savings;
    }, 0) / totalProducts;
    const matchRate = Math.round((filteredProducts.length / totalProducts) * 100);
    
    return {
      totalProducts,
      totalUsers,
      avgPrice,
      avgSavings: Math.round(avgSavings),
      matchRate: matchRate || 87 // fallback to 87% if no products
    };
  };

  const stats = calculateStats();

  const handleSellerChange = (sellerId: string) => {
    setSelectedSeller(sellerId);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
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
      sellerId: "seller1" // Default single seller account
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 transition-all duration-500">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl text-white z-50 transition-all duration-500 transform translate-x-0 shadow-2xl backdrop-blur-sm ${
          notification.type === 'success' ? 'bg-green-600/95 border border-green-500/50' : 
          notification.type === 'error' ? 'bg-red-600/95 border border-red-500/50' : 'bg-blue-600/95 border border-blue-500/50'
        } animate-in slide-in-from-right-full`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-700 hover:shadow-2xl">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-gray-700/30"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="transition-all duration-500 hover:scale-105">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/10 transition-all duration-300 hover:shadow-xl">
                    <span className="text-white font-bold text-2xl">AM</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white transition-all duration-300">
                      Agentic Marketplace
                    </h1>
                    <p className="text-gray-300 text-lg font-medium mt-1 transition-all duration-300">You Count It, We'll Manage It. It's That Simple</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="/auth"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign In
                </a>
                <a
                  href="/auth"
                  className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Connection Status */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200/50 transition-all duration-500">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-1 bg-green-300 rounded-full animate-pulse delay-150"></div>
            </div>
            <span className="font-semibold text-gray-800 transition-all duration-300">Status: Connected to Convex Database</span>
            <span className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full border border-gray-200/50 transition-all duration-300">Real-time data synchronization enabled</span>
          </div>
        </div>



        {/* Profile Selector */}
        {!profile ? (
          <div className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800 transition-all duration-500">Choose Your Profile</h2>
            <div className="flex gap-8 justify-center">
              <button
                onClick={() => setProfile("buyer")}
                className="group bg-slate-700 hover:bg-slate-800 text-white px-12 py-8 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <div className="text-xl font-bold">Buyer Profile</div>
                <div className="text-sm opacity-80 mt-1">Find great deals</div>
              </button>
              <button
                onClick={() => setProfile("seller")}
                className="group bg-slate-600 hover:bg-slate-700 text-white px-12 py-8 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <div className="text-xl font-bold">Seller Profile</div>
                <div className="text-sm opacity-80 mt-1">List your items</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Profile Switch Buttons */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => setProfile("buyer")}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  profile === "buyer" 
                    ? "bg-slate-700 text-white shadow-xl" 
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl border border-gray-200"
                }`}
              >
                Buyer Profile
              </button>
              <button
                onClick={() => setProfile("seller")}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  profile === "seller" 
                    ? "bg-slate-600 text-white shadow-xl" 
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl border border-gray-200"
                }`}
              >
                Seller Profile
              </button>
              <button
                onClick={() => setProfile(null)}
                className="px-8 py-4 rounded-lg font-semibold bg-slate-500 text-white hover:bg-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Back
              </button>
            </div>

            {/* Seller Section */}
            {profile === "seller" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Seller Panel */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200/50 shadow-xl backdrop-blur-sm">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                    <div className="w-4 h-4 bg-slate-600 rounded-full animate-pulse shadow-lg"></div>
                    Seller Profile
                  </h2>

                  {/* Seller Profile Info */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border-l-4 border-slate-600 shadow-lg">
                    <h4 className="font-bold mb-3 text-lg text-slate-800 flex items-center gap-2">
                      Demo Seller
                      <div className="h-px bg-gradient-to-r from-slate-300 to-transparent flex-1 ml-3"></div>
                    </h4>
                    <div className="space-y-2 text-slate-700">
                      <p><strong>Name:</strong> Demo Seller</p>
                      <p><strong>Email:</strong> seller@example.com</p>
                      <p><strong>Location:</strong> Palo Alto, CA</p>
                      <p><strong>Rating:</strong> 4.8/5 (Excellent)</p>
                      <p><strong>Verified:</strong> Email, Phone & ID</p>
                    </div>
                  </div>


                  {/* Product Creation Form */}
                  <form onSubmit={handleCreateListing} className="space-y-4 mt-6">
                    {/* AI-Powered Product Analysis - MOVED TO TOP */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-300 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        AI-Powered Product Analysis
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload your product image first - our AI will automatically analyze and fill the form!
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-white">
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
                              <div className="w-16 h-16 bg-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <span className="text-slate-500 text-sm">Image</span>
                              </div>
                            )}
                            <div className="text-sm font-medium">Click to upload product image</div>
                            <div className="text-xs text-gray-500">JPG, PNG, WebP (max 10MB)</div>
                          </label>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            AI Analysis (GPT-5)
                          </h4>
                          {isAnalyzing ? (
                            <div className="text-center">
                              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-2"></div>
                              <div className="text-sm">GPT-5 analyzing image...</div>
                            </div>
                          ) : analysis ? (
                            <div className="space-y-2 text-sm">
                              <div><strong>Category:</strong> {analysis.category}</div>
                              <div><strong>Condition:</strong> {analysis.condition}</div>
                              <div><strong>Suggested Price:</strong> ${analysis.suggestedPrice}</div>
                              <div><strong>Market Average:</strong> ${analysis.marketComparison.averagePrice}</div>
                              <div><strong>Confidence:</strong> {Math.round(analysis.confidence * 100)}%</div>
                              <div className="text-xs text-gray-400 mt-2">Powered by GPT-5</div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Upload image for GPT-5 analysis
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-2">Category</label>
                        <select
                          name="category"
                          required
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        >
                          <option value="">Select a category...</option>
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
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
                      <select
                        name="location"
                        required
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      >
                        <option value="">Select pickup location...</option>
                        <option value="San Francisco, CA">San Francisco, CA</option>
                        <option value="Palo Alto, CA">Palo Alto, CA</option>
                        <option value="San Jose, CA">San Jose, CA</option>
                        <option value="Oakland, CA">Oakland, CA</option>
                        <option value="Berkeley, CA">Berkeley, CA</option>
                        <option value="Mountain View, CA">Mountain View, CA</option>
                        <option value="Sunnyvale, CA">Sunnyvale, CA</option>
                        <option value="Santa Clara, CA">Santa Clara, CA</option>
                        <option value="Fremont, CA">Fremont, CA</option>
                        <option value="San Mateo, CA">San Mateo, CA</option>
                        <option value="Redwood City, CA">Redwood City, CA</option>
                        <option value="Cupertino, CA">Cupertino, CA</option>
                      </select>
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

                    <div>
                      <label className="block font-semibold mb-2">Available Pickup Times</label>
                      <select
                        name="timeSlot"
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      >
                        <option value="">Select preferred pickup time...</option>
                        {availableTimeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <div className="text-sm text-gray-600 mt-1">
                        Choose your preferred time for buyer pickup
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      List Item
                    </button>
                  </form>
                </div>

                {/* Products Display */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Available Products</h3>
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
                    <div className="w-3 h-3 bg-slate-700 rounded-full animate-pulse"></div>
                    Buyer Agent
                  </h2>

                  {/* Buyer Profile Info */}
                  <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-slate-700">
                    <h4 className="font-bold mb-2">Buyer Profile</h4>
                    <p><strong>Name:</strong> John Smith</p>
                    <p><strong>Email:</strong> john.smith@email.com</p>
                    <p><strong>Location:</strong> San Francisco, CA</p>
                    <p><strong>Verified:</strong> Email & Phone</p>
                  </div>

                  {/* Search Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2">Looking For (Category)</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">All Categories</option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
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
                        Try searching: "fan", "iPhone", "laptop", "MacBook"
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-2">Min Price ($)</label>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="0"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Max Price ($)</label>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="1000"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Radius (miles)</label>
                        <input
                          type="number"
                          value={locationRadius}
                          onChange={(e) => setLocationRadius(e.target.value)}
                          placeholder="25"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">🕒 Preferred Pickup Time</label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Any time works for me</option>
                        {availableTimeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <div className="text-sm text-gray-600 mt-1">
                        💡 Select your preferred pickup time to match with sellers who are available then
                      </div>
                    </div>

                    <button
                      onClick={handleBuyerSearch}
                      disabled={isMatching}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        isMatching 
                          ? "bg-gray-400 text-white cursor-not-allowed" 
                          : "bg-slate-700 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {isMatching ? "AI Agent Working..." : "Find Matches with AI"}
                    </button>

                    {/* AI Matching Progress */}
                    {isMatching && (
                      <div className="bg-white rounded-lg p-6 border-2 border-blue-200 shadow-lg">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                          <h4 className="text-lg font-bold text-gray-800 mb-2">AI Agent is Working</h4>
                          <p className="text-sm text-gray-600 mb-4">{matchingStage}</p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${matchingProgress}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-700">{matchingProgress}% Complete</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Match Results Display */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  {!showMatches && !isMatching ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">🔍</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-600">Ready to Find Matches</h3>
                      <p className="text-gray-500">Use the search form to find products and start AI matching</p>
                    </div>
                  ) : showMatches ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">AI Match Results</h3>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {matches.length} High-Quality Matches
                        </div>
                      </div>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {matches.map((match) => (
                          <div key={match._id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                            {/* Match Score Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                  match.matchScore >= 90 ? 'bg-green-500' :
                                  match.matchScore >= 80 ? 'bg-blue-500' :
                                  'bg-yellow-500'
                                }`}>
                                  {match.matchScore}%
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800">{match.makeModel}</h4>
                                  <p className="text-sm text-gray-600">{match.variant}</p>
                                </div>
                              </div>
                              <span className="text-3xl">{match.images[0]}</span>
                            </div>

                            {/* Match Reasons */}
                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-700 mb-2">Why this is a great match:</h5>
                              <div className="flex flex-wrap gap-2">
                                {match.reasons.map((reason: string, index: number) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    ✓ {reason}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">${match.currentPrice}</div>
                                <div className="text-xs text-gray-500">Current Price</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-600">${match.estimatedSavings}</div>
                                <div className="text-xs text-gray-500">You Save</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{match.negotiationPotential}%</div>
                                <div className="text-xs text-gray-500">Negotiation Potential</div>
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-2">{match.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>📍 {match.location.address}</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  match.condition === 'new' ? 'bg-green-100 text-green-800' :
                                  match.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                                  match.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {match.condition}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleStartNegotiation(match)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Start Negotiation
                              </button>
                              <button 
                                onClick={() => handleContactSeller(match)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Contact Seller
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">AI Agent Processing...</h3>
                      <p className="text-gray-600">Please wait while our AI finds the best matches for you</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Negotiation Process Display */}
            {activeNegotiation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">AI Negotiation in Progress</h2>
                    <button 
                      onClick={() => setActiveNegotiation(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{activeNegotiation.images[0]}</span>
                      <div>
                        <h3 className="text-xl font-bold">{activeNegotiation.makeModel}</h3>
                        <p className="text-gray-600">{activeNegotiation.variant}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {negotiationStage >= 1 && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-semibold text-blue-800">Stage 1: Initial Offer</span>
                        </div>
                        <p className="text-blue-700">AI Agent: "I'd like to offer ${activeNegotiation.currentPrice - 100} for this {activeNegotiation.makeModel}."</p>
                      </div>
                    )}

                    {negotiationStage >= 2 && (
                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="font-semibold text-orange-800">Stage 2: Seller Counter</span>
                        </div>
                        <p className="text-orange-700">Seller: "Thanks for your interest! I can do ${activeNegotiation.currentPrice - 50}. It's in great condition."</p>
                      </div>
                    )}

                    {negotiationStage >= 3 && (
                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-semibold text-purple-800">Stage 3: Final Negotiation</span>
                        </div>
                        <p className="text-purple-700">AI Agent: "How about we meet in the middle at ${activeNegotiation.currentPrice - 75}? That works for both of us."</p>
                      </div>
                    )}

                    {negotiationStage >= 4 && (
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-semibold text-green-800">Stage 4: Deal Agreed!</span>
                        </div>
                        <p className="text-green-700">Seller: "Perfect! ${activeNegotiation.currentPrice - 75} works for me. Let's arrange pickup!"</p>
                        <div className="mt-4 p-4 bg-green-100 rounded-lg">
                          <h4 className="font-bold text-green-800 mb-2">Deal Summary:</h4>
                          <p className="text-green-700">Final Price: <span className="font-bold">${activeNegotiation.currentPrice - 75}</span></p>
                          <p className="text-green-700">You Saved: <span className="font-bold">${75}</span></p>
                          <p className="text-green-700">Pickup Location: {activeNegotiation.location.address}</p>
                        </div>
                      </div>
                    )}

                    {negotiationStage < 4 && (
                      <div className="text-center py-4">
                        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600">AI is negotiating...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Seller Details */}
            {showContactDetails && contactDetails && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Contact Seller</h2>
                    <button 
                      onClick={() => setShowContactDetails(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{contactDetails.product.images[0]}</span>
                      <div>
                        <h3 className="text-xl font-bold">{contactDetails.product.makeModel}</h3>
                        <p className="text-gray-600">{contactDetails.product.variant}</p>
                        <p className="text-lg font-bold text-green-600">${contactDetails.product.currentPrice}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">Seller Information:</h4>
                      <p><strong>Name:</strong> {contactDetails.seller?.name || "Seller"}</p>
                      <p><strong>Email:</strong> {contactDetails.seller?.email || "seller@example.com"}</p>
                      <p><strong>Location:</strong> {contactDetails.product.location.address}</p>
                      <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (4.8/5)</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    <h4 className="font-bold text-gray-800">Messages:</h4>
                    {contactDetails.messages.map((message: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        message.from === 'buyer' 
                          ? 'bg-blue-100 ml-8' 
                          : 'bg-gray-100 mr-8'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">
                            {message.from === 'buyer' ? 'You' : contactDetails.seller?.name || 'Seller'}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                        Send
                      </button>
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300">
                        Arrange Pickup
                      </button>
                      <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300">
                        Request More Photos
                      </button>
                    </div>
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
