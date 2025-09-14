'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Event {
  id: string
  message: string
  timestamp: number
  agentActor: 'buyer' | 'seller' | 'system'
  eventType: 'offer' | 'counteroffer' | 'accept' | 'reject' | 'timeout' | 'system'
  data?: {
    price?: number
    reason?: string
  }
}

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
  events: Event[]
}

// Mock data for demonstration
const mockDeal: Deal = {
  id: '1',
  item: {
    name: 'MacBook Pro 16"',
    description: 'Latest M3 chip, 32GB RAM, 1TB SSD, Space Gray',
    category: 'Electronics',
    initialPrice: 3200
  },
  negotiationState: {
    currentPrice: 2850,
    rounds: 5,
    lastOffer: {
      price: 2850,
      fromAgent: 'buyer',
      timestamp: Date.now() - 300000
    }
  },
  status: 'active',
  buyerAgent: { name: 'Tech Bargain Hunter', type: 'buyer' },
  sellerAgent: { name: 'Premium Seller Pro', type: 'seller' },
  createdAt: Date.now() - 1800000,
  events: [
    {
      id: '1',
      message: 'Negotiation started between buyer and seller agents',
      timestamp: Date.now() - 1800000,
      agentActor: 'system',
      eventType: 'system'
    },
    {
      id: '2',
      message: 'Seller agent offers $3,200',
      timestamp: Date.now() - 1700000,
      agentActor: 'seller',
      eventType: 'offer',
      data: { price: 3200 }
    },
    {
      id: '3',
      message: 'Buyer agent counters with $2,800',
      timestamp: Date.now() - 1600000,
      agentActor: 'buyer',
      eventType: 'counteroffer',
      data: { price: 2800 }
    },
    {
      id: '4',
      message: 'Seller agent counters with $3,000',
      timestamp: Date.now() - 1500000,
      agentActor: 'seller',
      eventType: 'counteroffer',
      data: { price: 3000 }
    },
    {
      id: '5',
      message: 'Buyer agent counters with $2,850',
      timestamp: Date.now() - 300000,
      agentActor: 'buyer',
      eventType: 'counteroffer',
      data: { price: 2850 }
    }
  ]
}

export default function DealDetailPage() {
  const params = useParams()
  const [deal, setDeal] = useState<Deal>(mockDeal)
  const [liveUpdates, setLiveUpdates] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (!liveUpdates || deal.status !== 'active') return

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const fromAgent = Math.random() > 0.5 ? 'buyer' : 'seller'
        const priceChange = fromAgent === 'buyer' ? -50 : 25
        const newPrice = Math.max(0, deal.negotiationState.currentPrice + priceChange)
        
        const newEvent: Event = {
          id: Date.now().toString(),
          message: `${fromAgent === 'buyer' ? 'Buyer' : 'Seller'} agent counters with $${newPrice.toLocaleString()}`,
          timestamp: Date.now(),
          agentActor: fromAgent,
          eventType: 'counteroffer',
          data: { price: newPrice }
        }

        setDeal(prev => ({
          ...prev,
          negotiationState: {
            ...prev.negotiationState,
            currentPrice: newPrice,
            rounds: prev.negotiationState.rounds + 1,
            lastOffer: {
              price: newPrice,
              fromAgent,
              timestamp: Date.now()
            }
          },
          events: [...prev.events, newEvent]
        }))
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [liveUpdates, deal.status, deal.negotiationState.currentPrice])

  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      case 'timeout': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEventIcon = (eventType: Event['eventType'], agentActor: Event['agentActor']) => {
    if (agentActor === 'system') return '⚙️'
    if (agentActor === 'buyer') return '🛒'
    if (agentActor === 'seller') return '💰'
    return '📝'
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Deal Details</h1>
              <p className="text-lg text-gray-600">Real-time negotiation between AI agents</p>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={liveUpdates}
                  onChange={(e) => setLiveUpdates(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Live Updates</span>
              </label>
              {liveUpdates && deal.status === 'active' && (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Deal Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Item Details */}
            <div className="floating-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{deal.item.name}</h3>
                  <p className="text-gray-600 mt-1">{deal.item.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                    {deal.item.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Initial Price:</span>
                  <span className="font-semibold">${deal.item.initialPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Price:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${deal.negotiationState.currentPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="floating-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                    {deal.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rounds:</span>
                  <span className="font-semibold">{deal.negotiationState.rounds}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Offer:</span>
                  <span className="text-sm">
                    {deal.negotiationState.lastOffer.fromAgent === 'buyer' ? '🛒' : '💰'} 
                    {formatTimeAgo(deal.negotiationState.lastOffer.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            {/* Agents */}
            <div className="floating-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Negotiating Agents</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🛒</span>
                    <div>
                      <div className="font-medium text-blue-900">{deal.buyerAgent.name}</div>
                      <div className="text-sm text-blue-600">Buyer Agent</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <div className="font-medium text-green-900">{deal.sellerAgent.name}</div>
                      <div className="text-sm text-green-600">Seller Agent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Negotiation Timeline */}
          <div className="lg:col-span-2">
            <div className="floating-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Negotiation Timeline</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {deal.events.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{getEventIcon(event.eventType, event.agentActor)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {event.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(event.timestamp)}
                        </p>
                      </div>
                      
                      {event.data?.price && (
                        <p className="text-sm text-gray-600 mt-1">
                          Price: ${event.data.price.toLocaleString()}
                        </p>
                      )}
                      
                      {event.data?.reason && (
                        <p className="text-sm text-gray-600 mt-1">
                          Reason: {event.data.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {deal.status === 'active' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-yellow-800">
                      Negotiation in progress... Agents are analyzing the current offer.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
