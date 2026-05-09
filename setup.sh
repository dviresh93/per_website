#!/bin/bash
set -e

echo "Setting up resume tool..."

if ! command -v docker &>/dev/null; then
  echo "❌ Docker not found. Install Docker Desktop: https://www.docker.com/products/docker-desktop/"
  exit 1
fi

echo "Building Docker image (first time takes a few minutes — LaTeX is large)..."
docker build -f Dockerfile.mcp -t resume-tool .

echo ""
echo "✅ Setup complete. Open this folder in Claude Code — MCPs load automatically."
