#!/bin/bash

echo "🚀 Starting PathSmith - Hackathon Project Demo"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "pathsmith_demo.py" ]; then
    echo "❌ Please run this script from the PathSmith directory"
    exit 1
fi

echo "📋 Available Commands:"
echo "1. demo     - Run the complete PathSmith demo"
echo "2. convex   - Test Convex integration only"
echo "3. setup    - Show setup instructions"
echo "4. help     - Show this help message"
echo ""

case "$1" in
    "demo")
        echo "🎯 Running PathSmith Demo..."
        ./convex-env/bin/python pathsmith_demo.py
        ;;
    "convex")
        echo "📊 Testing Convex Integration..."
        ./convex-env/bin/python main.py
        ;;
    "setup")
        echo "🔧 PathSmith Setup Instructions:"
        echo ""
        echo "1. Convex (✅ Already configured):"
        echo "   - Run: npx convex dev (in separate terminal)"
        echo "   - Database: https://moonlit-anteater-55.convex.cloud"
        echo ""
        echo "2. Inkeep (✅ Already configured):"
        echo "   - CLI installed globally"
        echo "   - Agents project ready in inkeep-agents/"
        echo ""
        echo "3. Daytona (⚠️ CLI needs installation):"
        echo "   - API keys configured"
        echo "   - Install CLI: curl -fsSL https://download.daytona.io/daytona/install.sh | bash"
        echo ""
        ;;
    "help"|*)
        echo "Usage: ./run_pathsmith.sh [command]"
        echo ""
        echo "Commands:"
        echo "  demo     - Run complete demo"
        echo "  convex   - Test Convex only"
        echo "  setup    - Show setup info"
        echo "  help     - Show this help"
        echo ""
        echo "🎉 PathSmith integrates Convex, Inkeep, and Daytona!"
        ;;
esac
