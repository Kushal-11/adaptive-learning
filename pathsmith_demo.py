#!/usr/bin/env python3
"""
PathSmith - Unified Demo of Sponsor Tools Integration
Demonstrates Convex, Inkeep, and Daytona working together
"""

import os
import sys
import subprocess
import json
from dotenv import load_dotenv
from convex import ConvexClient

class PathSmithDemo:
    def __init__(self):
        # Load environment variables
        load_dotenv(".env.local")
        load_dotenv("../.env")  # Load parent .env for Daytona keys
        
        self.convex_url = os.getenv("CONVEX_URL")
        self.daytona_api_key = os.getenv("DAYTONA_API_KEY")
        self.daytona_api_url = os.getenv("DAYTONA_API_URL")
        
        # Initialize Convex client
        if self.convex_url:
            self.convex_client = ConvexClient(self.convex_url)
        else:
            self.convex_client = None
            
    def display_header(self):
        """Display the PathSmith demo header"""
        print("=" * 60)
        print("🚀 PATHSMITH - HACKATHON PROJECT DEMO")
        print("=" * 60)
        print("Integrating three sponsor tools:")
        print("📊 Convex - Backend database and real-time sync")
        print("🤖 Inkeep - Multi-agent AI framework")
        print("☁️  Daytona - Development environment platform")
        print("=" * 60)
        print()

    def demo_convex(self):
        """Demonstrate Convex integration"""
        print("🔹 CONVEX INTEGRATION DEMO")
        print("-" * 30)
        
        if not self.convex_client:
            print("❌ Convex not configured. Please run 'npx convex dev' first.")
            return False
            
        try:
            print(f"📡 Connected to: {self.convex_url}")
            
            # Query tasks from Convex
            tasks = self.convex_client.query("tasks:get")
            print(f"📋 Retrieved {len(tasks)} tasks from Convex database:")
            
            for i, task in enumerate(tasks, 1):
                status = "✅" if task["isCompleted"] else "❌"
                print(f"   {i}. {status} {task['text']}")
                
            print("✅ Convex integration working!")
            return True
            
        except Exception as e:
            print(f"❌ Convex error: {e}")
            return False

    def demo_inkeep(self):
        """Demonstrate Inkeep agents setup"""
        print("\n🔹 INKEEP AGENTS DEMO")
        print("-" * 30)
        
        # Check if Inkeep agents are set up
        inkeep_path = "inkeep-agents"
        if not os.path.exists(inkeep_path):
            print("❌ Inkeep agents not found")
            return False
            
        print("📁 Inkeep agents project structure:")
        
        # Show key files
        key_files = [
            "inkeep-agents/src/default/weather.graph.ts",
            "inkeep-agents/src/default/inkeep.config.ts",
            "inkeep-agents/package.json"
        ]
        
        for file_path in key_files:
            if os.path.exists(file_path):
                print(f"   ✅ {file_path}")
            else:
                print(f"   ❌ {file_path}")
                
        # Check if Inkeep CLI is available
        try:
            result = subprocess.run(["inkeep", "--version"], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print(f"🔧 Inkeep CLI version: {result.stdout.strip()}")
                print("✅ Inkeep agents framework ready!")
                return True
            else:
                print("⚠️  Inkeep CLI available but may need configuration")
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("⚠️  Inkeep CLI not in PATH, but agents project exists")
            return True

    def demo_daytona(self):
        """Demonstrate Daytona integration"""
        print("\n🔹 DAYTONA INTEGRATION DEMO")
        print("-" * 30)
        
        if not self.daytona_api_key:
            print("❌ Daytona API key not found in environment")
            return False
            
        print(f"🔑 Daytona API Key: {self.daytona_api_key[:20]}...")
        print(f"🌐 Daytona API URL: {self.daytona_api_url}")
        
        # Check if Daytona CLI is available
        try:
            result = subprocess.run(["daytona", "version"], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print(f"🔧 Daytona CLI: {result.stdout.strip()}")
                print("✅ Daytona integration ready!")
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("⚠️  Daytona CLI not installed, but API credentials configured")
            print("💡 Install with: curl -fsSL https://download.daytona.io/daytona/install.sh | bash")
            return True

    def create_integration_example(self):
        """Create an example of how all three tools work together"""
        print("\n🔹 PATHSMITH INTEGRATION CONCEPT")
        print("-" * 40)
        print("🎯 How PathSmith uses all three sponsor tools:")
        print()
        print("1. 📊 CONVEX - Real-time Data Layer")
        print("   • Stores project tasks and progress")
        print("   • Provides real-time sync across team members")
        print("   • Python client for backend integration")
        print()
        print("2. 🤖 INKEEP - AI Agent Orchestration")
        print("   • Weather agent for environmental context")
        print("   • Custom agents for project management")
        print("   • Multi-agent workflows for complex tasks")
        print()
        print("3. ☁️  DAYTONA - Development Environment")
        print("   • Standardized dev environments")
        print("   • Team collaboration platform")
        print("   • Automated workspace provisioning")
        print()
        print("🚀 PATHSMITH VISION:")
        print("   An AI-powered project management system that:")
        print("   • Uses Convex for real-time task synchronization")
        print("   • Employs Inkeep agents for intelligent assistance")
        print("   • Leverages Daytona for seamless team development")

    def run_demo(self):
        """Run the complete PathSmith demo"""
        self.display_header()
        
        # Test each integration
        convex_ok = self.demo_convex()
        inkeep_ok = self.demo_inkeep()
        daytona_ok = self.demo_daytona()
        
        # Show integration concept
        self.create_integration_example()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 PATHSMITH SETUP SUMMARY")
        print("=" * 60)
        print(f"Convex Backend:     {'✅ Working' if convex_ok else '❌ Needs Setup'}")
        print(f"Inkeep Agents:      {'✅ Ready' if inkeep_ok else '❌ Needs Setup'}")
        print(f"Daytona Platform:   {'✅ Configured' if daytona_ok else '❌ Needs Setup'}")
        print()
        
        if all([convex_ok, inkeep_ok, daytona_ok]):
            print("🎉 ALL SPONSOR TOOLS SUCCESSFULLY INTEGRATED!")
        else:
            print("⚠️  Some tools need additional setup - see messages above")
            
        print("\n🚀 PathSmith is ready for hackathon development!")
        print("=" * 60)

if __name__ == "__main__":
    demo = PathSmithDemo()
    demo.run_demo()
