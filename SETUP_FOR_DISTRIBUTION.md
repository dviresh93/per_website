# Setup Guide for Resume Generation System

**Version:** 1.0.0
**Estimated Time:** 15-30 minutes
**Last Updated:** 2025-12-03

---

## Overview

This guide helps you set up the **Agent-Agnostic Resume Generation System** from scratch. The system works with:

- ✅ **Claude Code** (full MCP support)
- ✅ **Gemini CLI** (file-based mode)
- ⚠️ **GPT-4** (experimental)
- 🔧 **Custom agents** (via universal template)

**Choose your path:**
- **Quick Start** (10 min) - Basic setup, works immediately
- **Full Setup** (30 min) - All features, MCP servers, semantic search

---

## Prerequisites

### Required for All Agents

```bash
# Check Node.js version (18+ required)
node --version  # Should show v18.0.0 or higher

# Check npm
npm --version

# Check git
git --version
```

**If missing:**
- **Node.js 18+:** Download from [nodejs.org](https://nodejs.org/)
- **npm:** Comes with Node.js
- **git:** [git-scm.com](https://git-scm.com/)

### Optional (for Full Features)

```bash
# Python 3.9+ (for semantic similarity)
python3 --version  # Should show 3.9.0 or higher

# pdflatex (for local PDF generation)
pdflatex --version
```

---

## Quick Start (10 minutes)

### For Any Agent

**1. Clone the Repository**

```bash
git clone https://github.com/yourusername/resume-generation-system.git
cd resume-generation-system
```

**2. Install Dependencies**

```bash
# Install Node.js dependencies
npm install

# (Optional) Install Python dependencies for semantic search
cd resume-memory-mcp/semantic-search-api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

**3. Configure Environment**

```bash
# Copy example configuration
cp .env.example .env

# Edit .env with your preferences (optional)
nano .env  # or use your preferred editor
```

**4. Customize Your Data**

```bash
# Copy example files and customize
cp data/profile.json.example data/profile.json
cp resume-memory-mcp/data/knowledge-graph.json.example resume-memory-mcp/data/knowledge-graph.json
cp job-prep/applications/_resources/profile-summary.md.example job-prep/applications/_resources/profile-summary.md

# Edit these files with your information
nano data/profile.json
nano resume-memory-mcp/data/knowledge-graph.json
nano job-prep/applications/_resources/profile-summary.md
```

**5. Detect Your Agent**

```bash
# Check which agent is detected
node detect-agent.js --verbose
```

**6. Ready to Use!**

You're done! The system will automatically adapt to your agent type.

---

## Agent-Specific Setup

### For Claude Code Users

**1. Configure MCP Servers**

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "resume-memory": {
      "command": "node",
      "args": ["/absolute/path/to/resume-memory-mcp/server.js"]
    },
    "resume-generator": {
      "command": "node",
      "args": ["/absolute/path/to/resumake-mcp/server.js"]
    }
  }
}
```

**Replace `/absolute/path/to/` with your actual path. Example:**
```
/home/username/Documents/resume-generation-system/resume-memory-mcp/server.js
```

**2. Verify MCP Connection**

```bash
# Restart Claude Code
# Then in Claude Code:
mcp__resume-memory__get_profile_summary()
# Should return your profile summary
```

**3. Test Workflow**

```
User: Help me apply to Google AI Engineer
Claude: [Should start fit analysis automatically]
```

---

### For Gemini CLI Users

**1. Create Gemini Configuration**

```bash
mkdir -p .gemini
```

**2. Create Configuration File**

Create `.gemini/GEMINI.md`:

```markdown
# Gemini Resume Agent Configuration

You are a Resume Generation Agent for Gemini CLI.

## Context Loading

At session start, load these files:
- .agent-config/UNIVERSAL_WORKFLOW.md (workflow steps)
- job-prep/applications/_resources/profile-summary.md (user profile)
- job-prep/applications/_resources/FORMAT-STANDARDS.md (formatting rules)

## Workflow

Follow the universal workflow exactly as defined.
Use file operations (Read/Write/Glob) instead of MCP tools.
Generate PDFs using: `node generate-resume-standalone.mjs`

You're now ready to assist with job applications.
```

**3. Test Detection**

```bash
# Should detect Gemini
GEMINI_API_KEY=test node detect-agent.js
# Output: gemini
```

**4. Test Standalone Generator**

```bash
# Verify standalone generator works
node generate-resume-standalone.mjs --help
```

---

### For GPT-4 Users

**Setup guide coming soon. For now, follow Gemini CLI setup (similar approach).**

---

## Full Setup (30 minutes)

For maximum features, including semantic similarity and MCP optimization.

### 1. Enable Semantic Search API

**Start the Python API:**

```bash
cd resume-memory-mcp/semantic-search-api
source venv/bin/activate
python main.py
```

**In another terminal, verify it's running:**

```bash
curl http://127.0.0.1:8001/health
# Should return: {"status": "healthy"}
```

**Enable in .env:**

```bash
# Edit .env
SEMANTIC_API_ENABLED=true
SEMANTIC_API_URL=http://127.0.0.1:8001
```

### 2. Initialize Database

```bash
cd resume-memory-mcp
node scripts/populate-database.js
# Creates memory.db with empty schema
```

### 3. Load Your Profile

**If using Claude Code:**

```
In Claude Code:
mcp__resume-memory__save_profile({
  fullContext: "[Your full profile text]"
})
```

**If using Gemini/other:**

Just ensure `profile-summary.md` is filled out (already done in Quick Start).

### 4. Test Full Workflow

**Claude Code:**
```
User: Help me apply to Google AI Engineer
[Follow complete workflow with all MCP tools]
```

**Gemini CLI:**
```
User: Help me apply to Google AI Engineer
[Follow file-based workflow]
```

---

## Verification Checklist

### Basic Setup ✅

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install` succeeded)
- [ ] `.env` file created and customized
- [ ] Profile data customized (`data/profile.json`)
- [ ] Knowledge graph customized (`knowledge-graph.json`)
- [ ] Profile summary created (`profile-summary.md`)
- [ ] Agent detected correctly (`node detect-agent.js`)

### Agent-Specific ✅

**For Claude Code:**
- [ ] MCP servers configured in `~/.claude/settings.json`
- [ ] MCP tools accessible (test with `mcp__resume-memory__get_profile_summary()`)
- [ ] `.claude/CLAUDE.md` exists and is auto-loaded

**For Gemini CLI:**
- [ ] `.gemini/GEMINI.md` created with context loading instructions
- [ ] Standalone generator works (`node generate-resume-standalone.mjs --help`)

### Full Features (Optional) ✅

- [ ] Python 3.9+ installed
- [ ] Python venv created and activated
- [ ] Semantic search API running (`curl http://127.0.0.1:8001/health`)
- [ ] `SEMANTIC_API_ENABLED=true` in `.env`
- [ ] Database initialized (`memory.db` exists)
- [ ] Profile loaded (if using MCP)

---

## Troubleshooting

### Issue: "Node version too old"

**Error:**
```
Error: Node.js version 16.x detected. Requires 18+
```

**Fix:**
```bash
# Update Node.js
# Option A: Use nvm
nvm install 18
nvm use 18

# Option B: Download from nodejs.org
# https://nodejs.org/en/download/
```

### Issue: "MCP servers not detected" (Claude Code)

**Fix:**

1. Check path in `~/.claude/settings.json`:
   ```bash
   # Use absolute path, not relative
   "args": ["/home/username/full/path/to/server.js"]
   ```

2. Verify server starts manually:
   ```bash
   node /path/to/resume-memory-mcp/server.js
   # Should show: "Resume Memory MCP Server running on stdio"
   ```

3. Restart Claude Code completely

### Issue: "Semantic API not starting"

**Fix:**

1. Check Python version:
   ```bash
   python3 --version  # Must be 3.9+
   ```

2. Install dependencies:
   ```bash
   cd resume-memory-mcp/semantic-search-api
   pip install -r requirements.txt
   ```

3. Check port 8001 is free:
   ```bash
   lsof -i :8001  # Should be empty
   ```

4. Start API:
   ```bash
   python main.py
   # Should show: "INFO: Uvicorn running on http://127.0.0.1:8001"
   ```

### Issue: "Standalone generator fails"

**Fix:**

1. Verify file exists:
   ```bash
   ls -l generate-resume-standalone.mjs
   ```

2. Check Node.js version (must be 18+)

3. Reinstall dependencies:
   ```bash
   npm install
   ```

### Issue: "Agent detection wrong"

**Fix:**

1. Set agent type manually in `.env`:
   ```bash
   AGENT_TYPE=claude  # or gemini, openai, custom
   ```

2. Verify detection:
   ```bash
   node detect-agent.js --verbose
   ```

### Issue: "Example files not found"

**Fix:**

Files are in:
- `data/profile.json.example`
- `resume-memory-mcp/data/knowledge-graph.json.example`
- `job-prep/applications/_resources/profile-summary.md.example`

If missing, check git clone succeeded:
```bash
git status
# Should show clean working tree
```

---

## Next Steps

After setup is complete:

1. **Read Customization Guide:** `CUSTOMIZATION_GUIDE.md`
2. **Learn the Workflow:** `.agent-config/UNIVERSAL_WORKFLOW.md`
3. **Test with Example:** Try generating a resume for a fake job
4. **Explore Agent-Specific Features:** See `.agent-config/agents/[your-agent]-resume-agent.md`

---

## Getting Help

**Documentation:**
- Setup issues: This file
- Customization: `CUSTOMIZATION_GUIDE.md`
- Workflow: `.agent-config/UNIVERSAL_WORKFLOW.md`
- Agent-specific: `.agent-config/agents/`

**Common Issues:**
- Check `.gitignore` - personal data may be excluded
- Verify file paths are absolute (not relative) in configs
- Ensure Node.js 18+ and Python 3.9+ for full features

**Community:**
- GitHub Issues: [link to repo]
- Discussions: [link to discussions]

---

## Summary

**Minimum setup (works immediately):**
1. Clone repo
2. `npm install`
3. Copy `.env.example` → `.env`
4. Customize example files
5. Done!

**Full setup (all features):**
1. Minimum setup above
2. Configure MCP servers (if Claude Code)
3. Start semantic API (optional)
4. Initialize database
5. Load profile
6. Enjoy 70-94% cost savings!

**Time investment:** 10-30 minutes
**Benefit:** Automated, optimized resume generation for life

---

**Ready to customize? See:** `CUSTOMIZATION_GUIDE.md`
**Ready to use? See:** `.agent-config/UNIVERSAL_WORKFLOW.md`
