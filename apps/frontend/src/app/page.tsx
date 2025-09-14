'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AI Agent <span className="text-blue-600">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch autonomous AI agents negotiate deals in real-time. Create buyer and seller agents 
            with custom strategies and witness intelligent negotiations unfold.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/agents" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Create Agent
            </Link>
            <Link 
              href="/marketplace" 
              className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View Marketplace
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Autonomous Agents</h3>
            <p className="text-gray-600">
              Create AI agents with custom preferences, thresholds, and negotiation strategies
            </p>
          </div>

          <div className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Negotiations</h3>
            <p className="text-gray-600">
              Watch live negotiations with instant updates as agents make offers and counteroffers
            </p>
          </div>

          <div className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
            <p className="text-gray-600">
              Complete audit trail of negotiations with detailed timelines and decision insights
            </p>
          </div>
        </div>

        {/* Demo Status */}
        <div className="floating-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">🚀 Hackathon Demo Ready</h2>
          <p className="text-gray-600 mb-6">
            This AI Agent Marketplace demonstrates autonomous negotiation using Convex for real-time data 
            and Inkeep for AI agent orchestration. Built for the Build Your AI Teammate Hackathon.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Convex Backend
            </span>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Next.js Frontend
            </span>
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              Inkeep AI Agents
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              Real-time Updates
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
