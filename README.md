# PathSmith 🚀

**An AI-Powered Project Management System**  
*Integrating Convex, Inkeep, and Daytona for Hackathon Excellence*

## Overview

PathSmith is a comprehensive hackathon project that demonstrates the integration of three powerful sponsor tools:

- **📊 Convex** - Real-time backend database with Python integration
- **🤖 Inkeep** - Multi-agent AI framework for intelligent assistance
- **☁️ Daytona** - Development environment platform for team collaboration

## Project Structure

```
PathSmith/
├── README.md                 # This file
├── pathsmith_demo.py        # Unified demo script
├── main.py                  # Basic Convex Python integration
├── sampleData.jsonl         # Sample task data
├── package.json             # Node.js dependencies
├── .env.local              # Convex environment variables
├── convex/                 # Convex backend functions
│   ├── tasks.js            # Task query functions
│   └── _generated/         # Auto-generated Convex files
├── convex-env/             # Python virtual environment
└── inkeep-agents/          # Inkeep multi-agent framework
    ├── src/default/        # Default agent configurations
    ├── apps/               # Agent applications
    └── package.json        # Inkeep dependencies
```

## Quick Start

### 1. Prerequisites

- **Node.js** (v18+)
- **Python** (3.8+)
- **pnpm** (for Inkeep)
- **Git**

### 2. Environment Setup

The project includes pre-configured API keys for Daytona:
```bash
# Already configured in parent .env file
DAYTONA_API_KEY=dtn_9ec29014a911422c3832541d6a0339d49e3ab8c556a93337b269cbf7d336c57a
DAYTONA_API_URL=https://app.daytona.io/api
```

### 3. Run the Demo

```bash
cd PathSmith
./convex-env/bin/python pathsmith_demo.py
```

## Tool Integrations

### 🔹 Convex Integration

**Status**: ✅ **Fully Working**

- **Backend**: Real-time database with task management
- **Python Client**: Direct integration for data queries
- **Features**:
  - Task storage and retrieval
  - Real-time synchronization
  - Python-JavaScript bridge

**Test the integration**:
```bash
cd PathSmith
./convex-env/bin/python main.py
```

### 🔹 Inkeep Agents

**Status**: ✅ **Ready for Development**

- **Framework**: Multi-agent AI system
- **Default Agent**: Weather information service
- **Features**:
  - Agent graph definitions
  - Multi-agent workflows
  - Development dashboard

**Key Files**:
- `inkeep-agents/src/default/weather.graph.ts` - Weather agent
- `inkeep-agents/src/default/inkeep.config.ts` - Configuration

### 🔹 Daytona Platform

**Status**: ✅ **API Configured**

- **API Keys**: Pre-configured and ready
- **Platform**: Development environment management
- **Features**:
  - Workspace provisioning
  - Team collaboration
  - Standardized environments

**API Endpoints**: `https://app.daytona.io/api`

## Development Commands

### Convex Commands
```bash
# Start Convex development server
npx convex dev

# Import sample data
npx convex import --table tasks sampleData.jsonl

# Run Python integration
./convex-env/bin/python main.py
```

### Inkeep Commands
```bash
# Install dependencies
cd inkeep-agents && pnpm install

# Start development server
pnpm dev

# Push agent graph (requires Inkeep CLI)
cd src/default && inkeep push weather.graph.ts

# Start dashboard
inkeep dev
```

### Daytona Commands
```bash
# Install Daytona CLI (if needed)
curl -fsSL https://download.daytona.io/daytona/install.sh | bash

# Configure with existing API key
daytona config set api-key $DAYTONA_API_KEY
daytona config set api-url $DAYTONA_API_URL
```

## PathSmith Vision

PathSmith represents the future of AI-powered project management by combining:

1. **Real-time Data Synchronization** (Convex)
   - Instant updates across team members
   - Persistent task and project state
   - Python backend integration

2. **Intelligent AI Assistance** (Inkeep)
   - Multi-agent workflows
   - Context-aware assistance
   - Automated task management

3. **Seamless Development Environment** (Daytona)
   - Standardized team workspaces
   - Automated environment provisioning
   - Cloud-based collaboration

## Demo Features

Run `python pathsmith_demo.py` to see:

- ✅ Convex database connectivity test
- ✅ Task retrieval and display
- ✅ Inkeep agents framework verification
- ✅ Daytona API configuration check
- 🎯 Integration concept explanation

## Next Steps

1. **Expand Convex Schema**: Add more complex data models
2. **Custom Inkeep Agents**: Create project-specific AI agents
3. **Daytona Workspaces**: Set up team development environments
4. **Web Interface**: Build a React frontend
5. **Real-time Features**: Implement live collaboration

## Contributing

This project was created for the "Build Your AI Teammate" hackathon, showcasing the integration of sponsor tools in a meaningful way.

## License

MIT License - Built for hackathon demonstration purposes.

---

**🚀 PathSmith - Where AI meets Project Management**
