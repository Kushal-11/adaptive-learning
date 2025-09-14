"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface Country {
  name: string;
  iso2: string;
}

interface State {
  name: string;
  iso2: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer" as "buyer" | "seller" | "both",
    location: {
      country: "",
      state: "",
      city: ""
    }
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  const createUser = useMutation(api.users.createUser);
  const loginUser = useMutation(api.users.loginUser);

  // Load countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await response.json();
        
        if (data.error === false && data.data) {
          const countryList: Country[] = data.data.map((country: any) => ({
            name: country.country,
            iso2: country.iso2 || country.country.substring(0, 2).toUpperCase()
          }));
          setCountries(countryList.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback to a basic list if API fails
        setCountries([
          { name: "United States", iso2: "US" },
          { name: "Canada", iso2: "CA" },
          { name: "United Kingdom", iso2: "GB" },
          { name: "Australia", iso2: "AU" },
          { name: "Germany", iso2: "DE" },
          { name: "France", iso2: "FR" },
          { name: "India", iso2: "IN" },
          { name: "Japan", iso2: "JP" },
          { name: "Brazil", iso2: "BR" },
          { name: "Mexico", iso2: "MX" }
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.location.country) {
        setStates([]);
        return;
      }

      try {
        setLoadingStates(true);
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: formData.location.country
          })
        });
        
        const data = await response.json();
        
        if (data.error === false && data.data && data.data.states) {
          const stateList: State[] = data.data.states.map((state: any) => ({
            name: state.name,
            iso2: state.state_code || state.name.substring(0, 2).toUpperCase()
          }));
          setStates(stateList.sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [formData.location.country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
          // Reset state and city when country changes
          ...(locationField === "country" && { state: "", city: "" })
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const user = await loginUser({
          email: formData.email,
          password: formData.password
        });
        setMessage(`Welcome back, ${user.name}!`);
        // In a real app, you'd store the user session and redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        // Validation for signup
        if (!formData.name || !formData.email || !formData.password) {
          setMessage("Please fill in all required fields");
          setIsLoading(false);
          return;
        }
        
        if (!formData.location.country || !formData.location.state || !formData.location.city) {
          setMessage("Please complete your location information");
          setIsLoading(false);
          return;
        }

        const userId = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          location: formData.location
        });
        
        setMessage(`Account created successfully! Welcome, ${formData.name}!`);
        // In a real app, you'd automatically log them in and redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // availableStates is now handled by the states array from API

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
              {/* Logo placeholder - space reserved for future logo */}
              <span className="text-white font-bold text-xl">BB</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Welcome Back to BuyBot" : "Join BuyBot"}
            </h1>
          </div>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your marketplace account" : "Create your BuyBot marketplace account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="buyer">🛒 Buyer</option>
                  <option value="seller">🏪 Seller</option>
                  <option value="both">🔄 Both Buyer & Seller</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Location Information *</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isLogin}
                  >
                    <option value="">
                      {loadingCountries ? "Loading countries..." : "Select your country"}
                    </option>
                    {countries.map(country => (
                      <option key={country.iso2} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <select
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isLogin}
                    disabled={!formData.location.country}
                  >
                    <option value="">
                      {loadingStates ? "Loading states..." : "Select your state/province"}
                    </option>
                    {states.map(state => (
                      <option key={state.iso2} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                    required={!isLogin}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center ${
            message.includes("error") || message.includes("failed") 
              ? "bg-red-100 text-red-700" 
              : "bg-green-100 text-green-700"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "buyer",
                location: { country: "", state: "", city: "" }
              });
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}
