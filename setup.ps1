# Resume Tool Setup - Windows
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "Setting up resume tool..."

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Install Docker Desktop: https://www.docker.com/products/docker-desktop/"
    exit 1
}

Write-Host "Building Docker image (first time takes a few minutes — LaTeX is large)..."
docker build -f Dockerfile.mcp -t resume-tool .

Write-Host ""
Write-Host "✅ Setup complete. Open this folder in Claude Code — MCPs load automatically."
