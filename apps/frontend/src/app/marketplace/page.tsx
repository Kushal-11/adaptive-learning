'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Deal {
  id: string
  item: {
    name: string
    description: string
    category: string
    initialPrice: number
  }
  negotiationState: {
    currentPrice: number
    rounds: number
    lastOffer: {
      price: number
      fromAgent: 'buyer' | 'seller'
      timestamp: number
    }
  }
  status: 'active' | 'completed' | 'failed' | 'timeout'
  buyerAgent: {
    name: string
    type: 'buyer'
  }
  sellerAgent: {
    name: string
    type: 'seller'
  }
  createdAt: number
  completedAt?: number
}

// Mock data for demonstration
const mockDeals: Deal[] = [
  {
    id: '1',
    item: {
      name: 'MacBook Pro 16"',
      description: 'Latest M3 chip, 32GB RAM, 1TB SSD',
      category: 'Electronics',
      initialPrice: 3200
    },
    negotiationState: {
      currentPrice: 2850,
      rounds: 3,
      lastOffer: {
        price: 2850,
        fromAgent: 'buyer',
        timestamp: Date.now() - 300000
      }
    },
    status: 'active',
    buyerAgent: { name: 'Tech Bargain Hunter', type: 'buyer' },
    sellerAgent: { name: 'Premium Seller Pro', type: 'seller' },
    createdAt: Date.now() - 1800000
  },
  {
    id: '2',
    item: {
      name: 'Vintage Guitar',
      description: '1965 Fender Stratocaster in excellent condition',
      category: 'Musical Instruments',
      initialPrice: 8500
    },
    negotiationState: {
      currentPrice: 7800,
      rounds: 7,
      lastOffer: {
        price: 7800,
        fromAgent: 'seller',
        timestamp: Date.now() - 120000
      }
    },
    status: 'active',
    buyerAgent: { name: 'Music Collector Bot', type: 'buyer' },
    sellerAgent: { name: 'Vintage Dealer AI', type: 'seller' },
    createdAt: Date.now() - 3600000
  },
  {
    id: '3',
    item: {
      name: 'Designer Handbag',
      description: 'Louis Vuitton Neverfull MM, authentic',
      category: 'Fashion',
      initialPrice: 1200
    },
    negotiationState: {
      currentPrice: 1050,
      rounds: 5,
      lastOffer: {
        price: 1050,
        fromAgent: 'buyer',
        timestamp: Date.now() - 60000
      }
    },
    status: 'completed',
    buyerAgent: { name: 'Fashion Hunter', type: 'buyer' },
    sellerAgent: { name: 'Luxury Reseller', type: 'seller' },
    createdAt: Date.now() - 7200000,
    completedAt: Date.now() - 300000
  }
]

export default function MarketplacePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [liveUpdates, setLiveUpdates] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (!liveUpdates) return

    const interval = setInterval(() => {
      setDeals(prevDeals => 
        prevDeals.map(deal => {
          if (deal.status === 'active' && Math.random() > 0.7) {
            const priceChange = (Math.random() - 0.5) * 100
            const newPrice = Math.max(0, deal.negotiationState.currentPrice + priceChange)
            const fromAgent = Math.random() > 0.5 ? 'buyer' : 'seller'
            
            return {
              ...deal,
              negotiationState: {
                ...deal.negotiationState,
                currentPrice: Math.round(newPrice),
                rounds: deal.negotiationState.rounds + 1,
                lastOffer: {
                  price: Math.round(newPrice),
                  fromAgent,
                  timestamp: Date.now()
                }
              }
            }
          }
          return deal
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [liveUpdates])

  const filteredDeals = deals.filter(deal => 
    filter === 'all' || deal.status === filter
  )

  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      case 'timeout': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Agent Marketplace</h1>
          <p className="text-lg text-gray-600 mb-6">
            Watch autonomous AI agents negotiate deals in real-time
          </p>
          
          {/* Live Updates Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={liveUpdates}
                onChange={(e) => setLiveUpdates(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Live Updates</span>
            </label>
            {liveUpdates && (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="floating-card p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Deals ({deals.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({deals.filter(d => d.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({deals.filter(d => d.status === 'completed').length})
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <div className="floating-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                    {deal.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(deal.negotiationState.lastOffer.timestamp)}
                  </span>
                </div>

                {/* Item Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {deal.item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {deal.item.description}
                  </p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {deal.item.category}
                  </span>
                </div>

                {/* Price Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Price:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${deal.negotiationState.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Initial:</span>
                    <span className="text-gray-500">
                      ${deal.item.initialPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Agents */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600">🛒 {deal.buyerAgent.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">💰 {deal.sellerAgent.name}</span>
                  </div>
                </div>

                {/* Negotiation Progress */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rounds: {deal.negotiationState.rounds}</span>
                    <span className="text-gray-600">
                      Last: {deal.negotiationState.lastOffer.fromAgent === 'buyer' ? '🛒' : '💰'}
                    </span>
                  </div>
                  {deal.status === 'active' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (deal.negotiationState.rounds / 10) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No deals are currently available in the marketplace.'
                : `No ${filter} deals found. Try changing the filter.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
