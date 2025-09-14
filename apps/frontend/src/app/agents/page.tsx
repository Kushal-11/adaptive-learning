'use client'

import { useState } from 'react'

type AgentType = 'buyer' | 'seller'
type Urgency = 'low' | 'medium' | 'high'

interface AgentFormData {
  name: string
  type: AgentType
  categories: string[]
  maxPrice?: number
  minPrice?: number
  location?: string
  urgency: Urgency
  maxNegotiationRounds: number
  acceptableMargin: number
  timeoutMinutes: number
}

export default function AgentsPage() {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    type: 'buyer',
    categories: [],
    urgency: 'medium',
    maxNegotiationRounds: 10,
    acceptableMargin: 15,
    timeoutMinutes: 30,
  })

  const [newCategory, setNewCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        name: '',
        type: 'buyer',
        categories: [],
        urgency: 'medium',
        maxNegotiationRounds: 10,
        acceptableMargin: 15,
        timeoutMinutes: 30,
      })
    }, 2000)
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create AI Agent</h1>
          <p className="text-lg text-gray-600">
            Configure your autonomous negotiation agent with custom preferences and strategies
          </p>
        </div>

        {showSuccess && (
          <div className="floating-card p-4 mb-6 bg-green-50 border-green-200">
            <div className="flex items-center">
              <div className="text-green-600 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-green-800 font-semibold">Agent Created Successfully!</h3>
                <p className="text-green-700">Your AI agent is now ready to negotiate deals.</p>
              </div>
            </div>
          </div>
        )}

        <div className="floating-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Smart Buyer Bot"
              />
            </div>

            {/* Agent Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'buyer' }))}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'buyer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛒</div>
                    <div className="font-semibold">Buyer Agent</div>
                    <div className="text-sm text-gray-600">Seeks best deals</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'seller' }))}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'seller'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-semibold">Seller Agent</div>
                    <div className="text-sm text-gray-600">Maximizes profit</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Categories
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Electronics, Books, Clothing"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'buyer' ? 'Max Price ($)' : 'Min Price ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.type === 'buyer' ? formData.maxPrice || '' : formData.minPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined
                    setFormData(prev => ({
                      ...prev,
                      [formData.type === 'buyer' ? 'maxPrice' : 'minPrice']: value
                    }))
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as Urgency }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - Patient</option>
                  <option value="medium">Medium - Balanced</option>
                  <option value="high">High - Aggressive</option>
                </select>
              </div>
            </div>

            {/* Negotiation Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Negotiation Settings</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Rounds
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxNegotiationRounds}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxNegotiationRounds: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.acceptableMargin}
                    onChange={(e) => setFormData(prev => ({ ...prev, acceptableMargin: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.timeoutMinutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeoutMinutes: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || formData.categories.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Agent...
                  </div>
                ) : (
                  'Create AI Agent'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
