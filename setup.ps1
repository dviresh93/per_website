# Resume Tool Setup - Windows
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "Setting up resume tool..."

# Node dependencies
Write-Host "Installing MCP server dependencies..."
npm install --prefix resume-memory-mcp --silent
npm install --prefix resumake-mcp --silent
Write-Host "✅ Node dependencies installed"

# LaTeX
if (Get-Command pdflatex -ErrorAction SilentlyContinue) {
    Write-Host "✅ LaTeX already installed"
} else {
    Write-Host "Installing LaTeX via MiKTeX..."
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install MiKTeX.MiKTeX
        Write-Host "✅ MiKTeX installed"
    } elseif (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install miktex -y
        Write-Host "✅ MiKTeX installed via Chocolatey"
    } else {
        Write-Host "⚠️  Could not auto-install LaTeX."
        Write-Host "    Download MiKTeX manually: https://miktex.org/download"
        Write-Host "    Then re-run this script."
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Setup complete. Open this folder in Claude Code — MCPs load automatically."
