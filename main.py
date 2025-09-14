import os
from dotenv import load_dotenv
from convex import ConvexClient

# Load environment variables
load_dotenv(".env.local")

CONVEX_URL = os.getenv("CONVEX_URL")
print(f"Connecting to Convex at: {CONVEX_URL}")

# Create Convex client
client = ConvexClient(CONVEX_URL)

# Query tasks once
print("\n=== PathSmith Tasks from Convex ===")
tasks = client.query("tasks:get")
for i, task in enumerate(tasks, 1):
    status = "✅" if task["isCompleted"] else "❌"
    print(f"{i}. {status} {task['text']}")

print(f"\nTotal tasks: {len(tasks)}")
print("Convex integration successful! 🎉")
