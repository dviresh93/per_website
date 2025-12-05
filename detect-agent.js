#!/usr/bin/env node

/**
 * Agent Detection Script
 *
 * Detects which coding agent is currently running and returns agent type.
 * Used by the resume generation system to adapt workflows automatically.
 *
 * Returns: "claude", "gemini", "openai", "custom", or "unknown"
 *
 * Usage:
 *   node detect-agent.js
 *
 * Environment Variables Checked:
 *   - CLAUDE_CODE_SESSION: Claude Code CLI
 *   - GEMINI_API_KEY or GOOGLE_AI_STUDIO: Gemini
 *   - OPENAI_API_KEY + OPENAI_ORGANIZATION: OpenAI/GPT-4
 */

const fs = require('fs');
const path = require('path');

function detectAgent() {
  // Check for Claude Code
  if (process.env.CLAUDE_CODE_SESSION) {
    return "claude";
  }

  // Check for .claude directory (alternative Claude Code detection)
  const claudeDir = path.join(process.cwd(), '.claude');
  if (fs.existsSync(claudeDir) && fs.existsSync(path.join(claudeDir, 'CLAUDE.md'))) {
    return "claude";
  }

  // Check for Gemini CLI
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO) {
    return "gemini";
  }

  // Check for .gemini directory
  const geminiDir = path.join(process.cwd(), '.gemini');
  if (fs.existsSync(geminiDir) && fs.existsSync(path.join(geminiDir, 'GEMINI.md'))) {
    return "gemini";
  }

  // Check for OpenAI
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_ORGANIZATION) {
    return "openai";
  }

  // Check for config file preference
  const configPath = path.join(process.cwd(), '.agent-config', 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.agent && config.agent.current !== "auto-detect") {
        return config.agent.current;
      }
    } catch (err) {
      // Config file exists but couldn't be parsed, continue detection
      console.error(`Warning: Could not parse config file: ${err.message}`);
    }
  }

  return "unknown";
}

function getAgentInfo(agentType) {
  const agentInfo = {
    claude: {
      name: "Claude Code",
      features: ["MCP Support", "Slash Commands", "Task Tool"],
      workflow: ".agent-config/agents/claude-resume-agent.md"
    },
    gemini: {
      name: "Gemini CLI",
      features: ["File-Based Operations", "Keyword Similarity"],
      workflow: ".agent-config/agents/gemini-resume-agent.md"
    },
    openai: {
      name: "OpenAI GPT-4",
      features: ["Function Calling", "API Integration"],
      workflow: ".agent-config/agents/openai-resume-agent.md"
    },
    custom: {
      name: "Custom Agent",
      features: ["Configurable"],
      workflow: ".agent-config/agents/universal-resume-agent.md"
    },
    unknown: {
      name: "Unknown Agent",
      features: ["Unknown"],
      workflow: ".agent-config/UNIVERSAL_WORKFLOW.md"
    }
  };

  return agentInfo[agentType] || agentInfo.unknown;
}

// Main execution
if (require.main === module) {
  const agentType = detectAgent();
  const info = getAgentInfo(agentType);

  // If called with --verbose flag, show detailed info
  if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
    console.log(JSON.stringify({
      agent: agentType,
      name: info.name,
      features: info.features,
      workflow: info.workflow,
      detected_via: getDetectionMethod(agentType)
    }, null, 2));
  } else if (process.argv.includes('--json')) {
    // JSON output for programmatic use
    console.log(JSON.stringify({ agent: agentType }));
  } else {
    // Simple output (just the agent type)
    console.log(agentType);
  }

  // Exit with appropriate code
  process.exit(agentType === "unknown" ? 1 : 0);
}

function getDetectionMethod(agentType) {
  if (agentType === "claude") {
    if (process.env.CLAUDE_CODE_SESSION) {
      return "CLAUDE_CODE_SESSION environment variable";
    }
    return ".claude/CLAUDE.md file detected";
  }
  if (agentType === "gemini") {
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO) {
      return "GEMINI_API_KEY or GOOGLE_AI_STUDIO environment variable";
    }
    return ".gemini/GEMINI.md file detected";
  }
  if (agentType === "openai") {
    return "OPENAI_API_KEY and OPENAI_ORGANIZATION environment variables";
  }
  if (agentType === "custom") {
    return ".agent-config/config.json preference";
  }
  return "No detection method matched";
}

// Export for use in other scripts
module.exports = {
  detectAgent,
  getAgentInfo,
  getDetectionMethod
};
