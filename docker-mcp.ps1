# MCP server launcher via Docker (Windows)
# Called by Claude Desktop via claude_desktop_config.json — do not run directly

param([string]$Server)

$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path

docker run --rm -i `
  -v "${RepoDir}\job-prep\applications:/workspace/job-prep/applications" `
  -v "${RepoDir}\resume-memory-mcp\data:/workspace/resume-memory-mcp/data" `
  -e RESUME_OUTPUT_DIR=/workspace/job-prep/applications `
  resume-tool `
  node "$Server/server.js"
