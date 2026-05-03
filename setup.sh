#!/bin/bash
set -e

echo "Setting up resume tool..."

# Node dependencies
echo "Installing MCP server dependencies..."
npm install --prefix resume-memory-mcp --silent
npm install --prefix resumake-mcp --silent
echo "✅ Node dependencies installed"

# LaTeX
if command -v pdflatex &>/dev/null; then
  echo "✅ LaTeX already installed"
else
  echo "Installing LaTeX..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v brew &>/dev/null; then
      brew install --cask mactex-no-gui
    else
      echo "⚠️  Homebrew not found. Install LaTeX manually: https://www.tug.org/mactex/"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v apt-get &>/dev/null; then
      sudo apt-get install -y texlive-xetex texlive-latex-extra
    elif command -v dnf &>/dev/null; then
      sudo dnf install -y texlive-xetex
    elif command -v pacman &>/dev/null; then
      sudo pacman -S --noconfirm texlive-core
    else
      echo "⚠️  Could not detect package manager. Install LaTeX manually: https://www.latex-project.org/get/"
      exit 1
    fi
  fi
fi

echo ""
echo "✅ Setup complete. Open this folder in Claude Code — MCPs load automatically."
