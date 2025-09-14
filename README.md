# AI Agent Marketplace

An autonomous negotiation platform where AI agents buy and sell items through intelligent negotiations. Built with Convex for real-time data synchronization and Inkeep for AI agent orchestration.

## 🚀 Project Overview

The AI Agent Marketplace is a hackathon project that demonstrates autonomous AI agents conducting negotiations in real-time. Users can create buyer and seller agents with custom preferences and thresholds, then watch as these agents negotiate deals automatically.

### Key Features

- **Autonomous AI Agents**: Create buyer and seller agents with custom negotiation strategies
- **Real-time Negotiations**: Watch live negotiations unfold with real-time updates
- **Smart Decision Making**: Agents use configurable thresholds and preferences to make decisions
- **Deal Timeline**: Complete audit trail of all negotiation steps and decisions
- **Marketplace Feed**: Live feed of all active and completed deals
- **Responsive UI**: Modern, floating card design with smooth animations

## 🏗️ Architecture

This project uses a modern monorepo structure with the following components:

### Backend (`apps/backend`)
- **Convex Database**: Real-time database with schema for users, agents, deals, and events
- **Negotiation Engine**: Simulated negotiation logic with hooks for Inkeep integration
- **Sample Data**: Pre-populated data for demonstration purposes

### Frontend (`apps/frontend`)
- **Next.js 14**: Modern React framework with app router
- **TailwindCSS**: Utility-first CSS with custom floating card design
- **Real-time Updates**: Convex React client for live data synchronization

### Shared Types (`packages/shared-types`)
- **TypeScript Definitions**: Shared interfaces and types across frontend and backend
- **Type Safety**: Ensures consistency between all applications

### Inkeep Integration (`inkeep-agents`)
- **Agent Graphs**: Negotiation workflow definitions for AI agents
- **Configuration**: Behavior profiles and strategies for different agent types
- **Convex Integration**: Seamless connection between Inkeep agents and Convex backend

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Convex CLI

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ai-agent-marketplace
   pnpm install
   ```

2. **Set up Convex backend**
   ```bash
   cd apps/backend
   npx convex dev
   # Follow the prompts to create a new Convex project
   ```

3. **Configure environment variables**
   ```bash
   # apps/backend/.env.local
   CONVEX_DEPLOYMENT=your-deployment-url
   
   # apps/frontend/.env.local
   NEXT_PUBLIC_CONVEX_URL=your-convex-url
   ```

4. **Build shared types**
   ```bash
   pnpm run setup
   ```

### Development

1. **Start all services**
   ```bash
   pnpm run dev:all
   ```

2. **Or start services individually**
   ```bash
   # Backend (Convex)
   pnpm run dev:backend
   
   # Frontend (Next.js)
   pnpm run dev:frontend
   ```

3. **Import sample data** (optional)
   ```bash
   cd apps/backend
   pnpm run import:sample-data
   ```

## 🎮 Demo Instructions

### Creating Agents

1. Navigate to `/agents` to create new buyer or seller agents
2. Configure agent preferences:
   - **Categories**: What items the agent is interested in
   - **Price Range**: Min/max acceptable prices
   - **Urgency**: How quickly the agent wants to complete deals
   - **Negotiation Thresholds**: Maximum rounds, acceptable margins, timeouts

### Watching Negotiations

1. Visit `/marketplace` to see the live marketplace feed
2. Active negotiations show real-time updates as agents make offers
3. Click on any deal to see the detailed negotiation timeline at `/deals/[id]`

### Understanding the Process

1. **Deal Creation**: Buyer and seller agents are matched for compatible items
2. **Negotiation**: Agents exchange offers based on their configured strategies
3. **Decision Making**: Each agent evaluates offers against their thresholds
4. **Resolution**: Deals complete successfully, fail, or timeout

## 🧪 Hackathon Features

### Real-time Demonstration
- Live marketplace ticker showing recent activity
- Real-time negotiation updates without page refresh
- Animated UI elements to show agent activity

### AI Integration Ready
- Inkeep agent graph definitions for sophisticated AI behavior
- Configurable negotiation strategies and decision-making logic
- Webhook endpoints for external AI agent integration

### Scalable Architecture
- Monorepo structure for easy development and deployment
- Shared type definitions ensure consistency
- Modular design allows easy extension of features

## 🔧 Technical Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Convex (real-time database and functions)
- **AI Agents**: Inkeep (agent orchestration platform)
- **Language**: TypeScript throughout
- **Build System**: Turbo (monorepo build system)
- **Package Manager**: pnpm

## 📁 Project Structure

```
ai-agent-marketplace/
├── apps/
│   ├── backend/           # Convex backend
│   │   ├── convex/        # Database schema and functions
│   │   └── sampleData/    # Demo data
│   └── frontend/          # Next.js application
│       └── src/           # React components and pages
├── packages/
│   └── shared-types/      # TypeScript definitions
├── inkeep-agents/         # AI agent configurations
│   └── src/marketplace/   # Negotiation agent graphs
└── package.json           # Monorepo configuration
```

## 🚀 Deployment

### Backend (Convex)
```bash
cd apps/backend
npx convex deploy
```

### Frontend (Vercel/Netlify)
```bash
cd apps/frontend
npm run build
# Deploy dist folder to your preferred platform
```

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Convex** for providing the real-time backend infrastructure
- **Inkeep** for AI agent orchestration capabilities
- **Build Your AI Teammate Hackathon** for the inspiration and platform

---

Built with ❤️ for the Build Your AI Teammate Hackathon
