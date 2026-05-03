#!/bin/bash

# Resume Optimization System - Stop Script
# Gracefully shuts down txtai API

echo "🛑 Stopping Resume Optimization System..."
echo ""

# Check if running
if ! pgrep -f "uvicorn main:app --host 127.0.0.1 --port 8001" > /dev/null; then
    echo "ℹ️  txtai API is not running"
    exit 0
fi

# Get PID
PID=$(pgrep -f "uvicorn main:app --host 127.0.0.1 --port 8001")
echo "Found txtai API (PID: $PID)"

# Try graceful shutdown first (SIGTERM)
echo "Sending shutdown signal..."
kill $PID 2>/dev/null

# Wait up to 5 seconds for graceful shutdown
for i in {1..5}; do
    if ! pgrep -f "uvicorn main:app --host 127.0.0.1 --port 8001" > /dev/null; then
        echo "✅ txtai API stopped gracefully"
        exit 0
    fi
    sleep 1
done

# Force kill if still running (SIGKILL)
echo "⚠️  Process still running, force stopping..."
kill -9 $PID 2>/dev/null

# Verify stopped
sleep 1
if ! pgrep -f "uvicorn main:app --host 127.0.0.1 --port 8001" > /dev/null; then
    echo "✅ txtai API force stopped"
else
    echo "❌ Failed to stop txtai API"
    echo "Try manually: fuser -k 8001/tcp"
    exit 1
fi

# Clean up port (just in case)
fuser -k 8001/tcp 2>/dev/null

echo ""
echo "System stopped. To restart: ./start-system.sh"
