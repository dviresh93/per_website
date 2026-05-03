#!/bin/bash

# Resume Optimization System - Startup Script
# Run this after reboot to start txtai API

echo "🚀 Starting Resume Optimization System..."
echo ""

# Check if already running
if pgrep -f "uvicorn main:app --host 127.0.0.1 --port 8001" > /dev/null; then
    echo "✅ txtai API already running"
    exit 0
fi

# Navigate to API directory
cd "$(dirname "$0")/semantic-search-api" || exit 1

# Activate virtual environment
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

source venv/bin/activate

# Start txtai API in background
echo "Starting txtai API on port 8001..."
CUDA_VISIBLE_DEVICES="" nohup uvicorn main:app --host 127.0.0.1 --port 8001 > /tmp/txtai-api.log 2>&1 &
API_PID=$!

# Wait for startup
sleep 3

# Check if running
if pgrep -f "uvicorn main:app --host 127.0.0.1 --port 8001" > /dev/null; then
    echo "✅ txtai API started successfully (PID: $API_PID)"
    echo "📊 Logs: /tmp/txtai-api.log"
    echo ""
    echo "Next steps:"
    echo "1. Launch Claude Code: cd /home/virus/Documents/repo/per_wesite && claude"
    echo "2. Verify MCP loaded: Ask 'What resume-memory tools do you have?'"
    echo "3. Start applying: 'Help me apply to [job]'"
else
    echo "❌ Failed to start txtai API"
    echo "Check logs: tail -50 /tmp/txtai-api.log"
    exit 1
fi
