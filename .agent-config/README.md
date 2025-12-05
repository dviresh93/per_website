# Multi-Agent Configuration System

**Version:** 1.0.0
**Purpose:** Enable resume generation system to work with any coding agent (Claude Code, Gemini CLI, GPT-4, etc.)

---

## Overview

This directory contains the **agent-agnostic core** of the resume generation system. It provides:

1. **Universal workflows** - Agent-independent process definitions
2. **Agent adapters** - Thin compatibility layers for each agent type
3. **Configuration** - Centralized settings for all features
4. **Context templates** - Shared and agent-specific context

---

## Directory Structure

```
.agent-config/
├── README.md                    # This file
├── config.json                  # Central configuration
├── UNIVERSAL_WORKFLOW.md        # Agent-agnostic workflow definitions
├── DIFFERENCES.md               # Agent-specific differences
│
├── agents/                      # Agent-specific instructions
│   ├── universal-resume-agent.md
│   ├── claude-resume-agent.md
│   ├── gemini-resume-agent.md
│   └── openai-resume-agent.md
│
└── context/                     # Context templates
    ├── universal-context.md
    ├── claude-context.md
    └── gemini-context.md
```

---

## How It Works

### Agent Detection

The system automatically detects which agent is running:

- **Claude Code:** Checks for `CLAUDE_CODE_SESSION` env var or `.claude/` directory
- **Gemini CLI:** Checks for `GEMINI_API_KEY` or `GOOGLE_AI_STUDIO` env var
- **GPT-4:** Checks for `OPENAI_API_KEY` and `OPENAI_ORGANIZATION` env vars
- **Custom:** User-specified in `config.json`

### Workflow Adaptation

Based on detected agent, the system adapts:

| Feature | Claude Code | Gemini CLI | GPT-4 |
|---------|------------|-----------|-------|
| **Context Loading** | Slash commands | Explicit Read | Function calls |
| **MCP Tools** | Native | Manual subprocess | Function calling |
| **Isolation** | Task tool | Single session | Separate calls |
| **Approval** | Interactive | File-based | Callback-based |

### Configuration Override

You can override auto-detection by setting `agent.current` in `config.json`:

```json
{
  "agent": {
    "current": "gemini"
  }
}
```

---

## For Agent Developers

### Adding Support for a New Agent

1. **Create agent adapter:** `.agent-config/agents/{agent-name}-resume-agent.md`
2. **Add detection logic:** Update `detect-agent.js` in project root
3. **Create context template:** `.agent-config/context/{agent-name}-context.md`
4. **Document differences:** Update `DIFFERENCES.md`
5. **Test workflow:** Verify all approval checkpoints work

### Agent Requirements

Minimum capabilities needed:
- ✅ File Read/Write/Glob
- ✅ User interaction (approval checkpoints)
- ✅ JSON parsing and generation
- ⚠️ Optional: MCP tool calling (can use standalone mode)
- ⚠️ Optional: Subprocess execution (for git operations)

---

## Configuration Reference

### `config.json` Structure

```json
{
  "agent": {
    "type": "auto-detect",          // Auto-detect or manual
    "current": "claude"              // Override detection
  },
  "features": {
    "mcp_servers": {
      "enabled": true,               // Use MCP tools
      "fallback_mode": "standalone"  // Fallback if MCP unavailable
    },
    "similarity_checking": {
      "enabled": true,               // Check for similar resumes
      "semantic_api_required": false // Graceful degradation
    }
  },
  "paths": {
    "database": "./resume-memory-mcp/data/memory.db",
    "applications": "./job-prep/applications"
  },
  "workflow": {
    "approval_checkpoints": [       // Where to wait for user
      "fit_analysis",
      "option_selection",
      "json_draft"
    ],
    "similarity_threshold": 0.80    // Reuse threshold
  }
}
```

---

## Supported Agents

### ✅ Claude Code (Full Support)
- Native MCP integration
- Slash commands for routing
- Task tool for agent isolation
- Auto-context loading

### ✅ Gemini CLI (Full Support)
- Manual MCP tool calling
- Explicit context injection
- File-based checkpoints
- Direct prompting

### ⚠️ GPT-4 (Experimental)
- Function calling for MCP
- Explicit context injection
- Callback-based approval
- Standard API integration

### 🔧 Custom Agents
- Configure via `config.json`
- Implement file access
- Follow universal workflow
- See `UNIVERSAL_WORKFLOW.md`

---

## Next Steps

1. **Read:** `UNIVERSAL_WORKFLOW.md` for process overview
2. **Choose:** Your agent type (auto-detected or manual)
3. **Setup:** Follow agent-specific instructions in `agents/`
4. **Test:** Generate a resume using the workflow

---

## Troubleshooting

### Agent Not Detected
- Check environment variables
- Verify `.claude/`, `.gemini/`, or API key presence
- Manually set `agent.current` in `config.json`

### MCP Tools Not Working
- Verify MCP server configuration
- Check `~/.claude/settings.json` (Claude Code)
- Enable `fallback_mode: "standalone"` in config

### Context Not Loading
- For Claude: Check `.claude/CLAUDE.md` exists
- For Gemini: Explicitly Read context files
- For GPT-4: Inject context in system prompt

---

**For detailed workflow steps, see:** `UNIVERSAL_WORKFLOW.md`
**For agent differences, see:** `DIFFERENCES.md`
**For examples, see:** Agent-specific files in `agents/`
