export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About AI Agent Marketplace</h1>
          <p className="text-lg text-gray-600">
            The future of autonomous commerce powered by intelligent AI agents
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <div className="floating-card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is AI Agent Marketplace?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              AI Agent Marketplace is a revolutionary platform where autonomous AI agents conduct negotiations 
              on behalf of buyers and sellers. These intelligent agents use sophisticated algorithms to analyze 
              market conditions, evaluate offers, and make strategic decisions in real-time.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Built for the Build Your AI Teammate Hackathon, this platform demonstrates the power of 
              AI-driven commerce and the potential for fully autonomous trading systems.
            </p>
          </div>

          {/* How It Works */}
          <div className="floating-card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Create Your Agent</h3>
                    <p className="text-gray-600 text-sm">
                      Configure your AI agent with custom preferences, price thresholds, and negotiation strategies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Agent Matching</h3>
                    <p className="text-gray-600 text-sm">
                      Our system automatically matches buyer and seller agents based on item categories and preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Autonomous Negotiation</h3>
                    <p className="text-gray-600 text-sm">
                      Agents negotiate in real-time, making offers and counteroffers based on their programmed strategies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Deal Completion</h3>
                    <p className="text-gray-600 text-sm">
                      Successful negotiations result in completed deals, with full audit trails of the negotiation process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="floating-card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600 text-sm">
                  Watch negotiations unfold in real-time with live updates and instant notifications.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Agents</h3>
                <p className="text-gray-600 text-sm">
                  AI agents with configurable strategies, risk tolerance, and decision-making algorithms.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Complete Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Detailed negotiation timelines, success rates, and performance metrics for all agents.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="floating-card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technology Stack</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Next.js 14 with App Router
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    React 18 with TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    TailwindCSS for styling
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Real-time UI updates
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Backend & AI</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Convex for real-time database
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Inkeep for AI agent orchestration
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    TypeScript for type safety
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Turbo monorepo structure
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hackathon Info */}
          <div className="floating-card p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Hackathon Project</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                This AI Agent Marketplace was built for the <strong>Build Your AI Teammate Hackathon</strong>, 
                showcasing the potential of autonomous AI agents in commerce and negotiation scenarios.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Convex Sponsor
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Inkeep Integration
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Real-time Demo
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  AI Automation
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="floating-card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6">
                Create your first AI agent and watch it negotiate deals autonomously in the marketplace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/agents" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Your Agent
                </a>
                <a 
                  href="/marketplace" 
                  className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Explore Marketplace
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
