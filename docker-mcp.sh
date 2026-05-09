#!/bin/bash
# MCP server launcher via Docker
# Called by Claude Code via .mcp.json — do not run directly
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER="$1"

exec docker run --rm -i \
  -v "$REPO_DIR/job-prep/applications:/workspace/job-prep/applications" \
  -v "$REPO_DIR/resume-memory-mcp/data:/workspace/resume-memory-mcp/data" \
  -e RESUME_OUTPUT_DIR=/workspace/job-prep/applications \
  resume-tool \
  node "$SERVER/server.js"
