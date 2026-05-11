# Resume Tool Setup - Windows
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "Setting up resume tool..."

# Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Install it from https://nodejs.org/ then re-run this script."
    exit 1
}
Write-Host "✅ Node.js $(node --version) found"

# npm dependencies
Write-Host "Installing MCP server dependencies..."
npm install --prefix resume-memory-mcp --silent
npm install --prefix resumake-mcp --silent
Write-Host "✅ Node dependencies installed"

# LaTeX (pdflatex)
if (Get-Command pdflatex -ErrorAction SilentlyContinue) {
    Write-Host "✅ LaTeX already installed"
} else {
    Write-Host "Installing LaTeX via MiKTeX..."
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install miktex -y
        # Refresh PATH so pdflatex is findable in this session
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        if (Get-Command pdflatex -ErrorAction SilentlyContinue) {
            Write-Host "✅ LaTeX installed"
        } else {
            Write-Host "⚠️  MiKTeX installed but pdflatex not on PATH yet. Restart your terminal, then try again."
        }
    } else {
        Write-Host ""
        Write-Host "⚠️  Chocolatey not found. Install LaTeX manually:"
        Write-Host "    1. Download MiKTeX from https://miktex.org/download"
        Write-Host "    2. Run the installer, accept defaults"
        Write-Host "    3. Re-run this script to verify"
        Write-Host ""
        Write-Host "Or install Chocolatey first (https://chocolatey.org/install) then re-run this script."
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Setup complete. Open this folder in Claude Code — MCPs load automatically."
