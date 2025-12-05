#!/bin/bash
# quick-test.sh - Verify resume system works
# Version: 1.0.0

echo "🧪 Testing Resume Generation System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Structure
echo "1️⃣  Checking file structure..."
test -f .agent-config/config.json && echo -e "  ${GREEN}✅${NC} Config exists" || echo -e "  ${RED}❌${NC} Config missing"
test -f detect-agent.js && echo -e "  ${GREEN}✅${NC} Detection script exists" || echo -e "  ${RED}❌${NC} Detection script missing"
test -f .env.example && echo -e "  ${GREEN}✅${NC} .env.example exists" || echo -e "  ${RED}❌${NC} .env.example missing"
test -f SETUP_FOR_DISTRIBUTION.md && echo -e "  ${GREEN}✅${NC} Setup guide exists" || echo -e "  ${RED}❌${NC} Setup guide missing"
test -f CUSTOMIZATION_GUIDE.md && echo -e "  ${GREEN}✅${NC} Customization guide exists" || echo -e "  ${RED}❌${NC} Customization guide missing"
echo ""

# Test 2: Dependencies
echo "2️⃣  Checking dependencies..."
if node --version > /dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "  ${GREEN}✅${NC} Node.js installed ($NODE_VERSION)"

    # Check if Node version is 18+
    NODE_MAJOR=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "  ${GREEN}✅${NC} Node.js version is 18+ (good!)"
    else
        echo -e "  ${YELLOW}⚠️${NC}  Node.js version < 18 (upgrade recommended)"
    fi
else
    echo -e "  ${RED}❌${NC} Node.js missing (required)"
fi

if npm list --depth=0 2>/dev/null | grep -q "modelcontextprotocol"; then
    echo -e "  ${GREEN}✅${NC} MCP SDK installed"
else
    echo -e "  ${YELLOW}⚠️${NC}  MCP SDK not installed (run npm install)"
fi

if python3 --version > /dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "  ${GREEN}✅${NC} Python installed ($PYTHON_VERSION) - optional"
else
    echo -e "  ${YELLOW}⚠️${NC}  Python not installed (optional, for semantic search)"
fi
echo ""

# Test 3: Agent Detection
echo "3️⃣  Detecting agent..."
if [ -f detect-agent.js ]; then
    AGENT=$(node detect-agent.js 2>/dev/null)

    case "$AGENT" in
        "claude")
            echo -e "  ${GREEN}✅${NC} Detected: Claude Code"
            test -f .claude/CLAUDE.md && echo -e "  ${GREEN}✅${NC} Claude config exists" || echo -e "  ${YELLOW}⚠️${NC}  .claude/CLAUDE.md missing"
            ;;
        "gemini")
            echo -e "  ${GREEN}✅${NC} Detected: Gemini CLI"
            test -f .gemini/GEMINI.md && echo -e "  ${GREEN}✅${NC} Gemini config exists" || echo -e "  ${YELLOW}⚠️${NC}  .gemini/GEMINI.md missing"
            ;;
        "openai")
            echo -e "  ${GREEN}✅${NC} Detected: OpenAI/GPT-4"
            ;;
        "unknown")
            echo -e "  ${YELLOW}⚠️${NC}  Agent: Unknown (will use file-based mode)"
            echo -e "  ${YELLOW}ℹ️${NC}   Tip: Set AGENT_TYPE in .env or create .claude/CLAUDE.md"
            ;;
        *)
            echo -e "  ${YELLOW}⚠️${NC}  Agent detection failed"
            ;;
    esac
else
    echo -e "  ${RED}❌${NC} detect-agent.js not found"
fi
echo ""

# Test 4: Example Data
echo "4️⃣  Checking example data..."
test -f data/profile.json.example && echo -e "  ${GREEN}✅${NC} Profile example exists" || echo -e "  ${RED}❌${NC} Profile example missing"
test -f resume-memory-mcp/data/knowledge-graph.json.example && echo -e "  ${GREEN}✅${NC} Knowledge graph example exists" || echo -e "  ${RED}❌${NC} Knowledge graph example missing"
test -f job-prep/applications/_resources/profile-summary.md.example && echo -e "  ${GREEN}✅${NC} Profile summary example exists" || echo -e "  ${RED}❌${NC} Profile summary example missing"

# Check if customized
if test -f data/profile.json; then
    echo -e "  ${GREEN}✅${NC} Profile customized (data/profile.json exists)"
else
    echo -e "  ${YELLOW}⚠️${NC}  Profile not customized yet (expected for new setup)"
fi

if test -f resume-memory-mcp/data/knowledge-graph.json; then
    echo -e "  ${GREEN}✅${NC} Knowledge graph customized"
else
    echo -e "  ${YELLOW}⚠️${NC}  Knowledge graph not customized yet"
fi
echo ""

# Test 5: Configuration
echo "5️⃣  Checking configuration..."
if test -f .env; then
    echo -e "  ${GREEN}✅${NC} .env file exists"
else
    echo -e "  ${YELLOW}⚠️${NC}  .env not found (copy from .env.example)"
fi

if test -f .agent-config/config.json; then
    # Validate JSON
    if node -e "JSON.parse(require('fs').readFileSync('.agent-config/config.json'))" 2>/dev/null; then
        echo -e "  ${GREEN}✅${NC} config.json is valid JSON"
    else
        echo -e "  ${RED}❌${NC} config.json has syntax errors"
    fi
else
    echo -e "  ${RED}❌${NC} config.json missing"
fi
echo ""

# Test 6: MCP Setup (if Claude Code detected)
if [ "$AGENT" = "claude" ]; then
    echo "6️⃣  Checking MCP setup (Claude Code)..."

    if test -f ~/.claude/settings.json; then
        echo -e "  ${GREEN}✅${NC} Claude settings.json exists"

        if grep -q "resume-memory" ~/.claude/settings.json 2>/dev/null; then
            echo -e "  ${GREEN}✅${NC} resume-memory MCP server configured"
        else
            echo -e "  ${YELLOW}⚠️${NC}  resume-memory MCP server not configured"
        fi

        if grep -q "resume-generator" ~/.claude/settings.json 2>/dev/null; then
            echo -e "  ${GREEN}✅${NC} resume-generator MCP server configured"
        else
            echo -e "  ${YELLOW}⚠️${NC}  resume-generator MCP server not configured"
        fi
    else
        echo -e "  ${YELLOW}⚠️${NC}  ~/.claude/settings.json not found"
    fi
    echo ""
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Basic tests complete!"
echo ""

# Next steps based on results
if [ "$AGENT" = "unknown" ]; then
    echo "📋 Next steps:"
    echo "1. Set up your agent:"
    echo "   - For Claude Code: Create .claude/CLAUDE.md"
    echo "   - For Gemini: Create .gemini/GEMINI.md"
    echo "   - Or set AGENT_TYPE in .env"
    echo ""
fi

if ! test -f .env; then
    echo "📋 Next steps:"
    echo "1. Copy .env.example to .env:"
    echo "   cp .env.example .env"
    echo ""
fi

if ! test -f data/profile.json; then
    echo "📋 Next steps:"
    echo "1. Customize your data:"
    echo "   cp data/profile.json.example data/profile.json"
    echo "   cp resume-memory-mcp/data/knowledge-graph.json.example resume-memory-mcp/data/knowledge-graph.json"
    echo "   cp job-prep/applications/_resources/profile-summary.md.example job-prep/applications/_resources/profile-summary.md"
    echo ""
    echo "2. Edit these files with your information (see CUSTOMIZATION_GUIDE.md)"
    echo ""
fi

echo "📖 For detailed setup: see SETUP_FOR_DISTRIBUTION.md"
echo "📖 For customization: see CUSTOMIZATION_GUIDE.md"
echo "📖 For testing: see TESTING_GUIDE.md"
echo ""
echo "🧪 To run end-to-end test:"
echo "   - See 'Test 14' in TESTING_GUIDE.md"
echo "   - Use the provided fake job posting"
echo ""
