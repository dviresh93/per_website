# Resume Optimization System - Startup Checklist

## After Reboot / Fresh Login:

### Quick Start (Recommended):

```bash
# Option 1: One-line startup
/home/virus/Documents/repo/per_wesite/resume-memory-mcp/start-system.sh

# Option 2: Manual startup
cd /home/virus/Documents/repo/per_wesite/resume-memory-mcp/semantic-search-api
source venv/bin/activate
CUDA_VISIBLE_DEVICES="" nohup uvicorn main:app --host 127.0.0.1 --port 8001 > /tmp/txtai-api.log 2>&1 &
```

Then:
```bash
cd /home/virus/Documents/repo/per_wesite
claude
```

---

## Verification Checklist:

### ✅ Check 1: txtai API Running

```bash
ps aux | grep "uvicorn main:app" | grep -v grep
```

**Expected:** See process running on port 8001

**If not running:** Run startup script above

---

### ✅ Check 2: MCP Server Loaded

In Claude Code:
```
What resume-memory tools do you have?
```

**Expected:** See 8 tools:
- get_profile_summary
- save_profile
- track_application
- query_knowledge_graph
- get_learned_patterns
- check_resume_similarity
- validate_resume
- process_similarity_reasoning

**If not loaded:** Restart Claude Code

---

### ✅ Check 3: Database Accessible

```bash
sqlite3 /home/virus/Documents/repo/per_wesite/resume-memory-mcp/data/memory.db "SELECT COUNT(*) FROM applications;"
```

**Expected:** Number ≥ 16

**If error:** Database file corrupted or missing

---

### ✅ Check 4: End-to-End Test

In Claude Code:
```
Check similarity for:
Company: Test
Role: AI Engineer
Requirements: LangChain RAG Python
```

**Expected:** Top 3 matches displayed with scores

**If "API not running":** Go back to Check 1

---

## Status Dashboard:

```bash
# One-line status check
echo "txtai API:" && (pgrep -f "uvicorn main:app" > /dev/null && echo "✅ Running" || echo "❌ Stopped") && \
echo "Database:" && (test -f /home/virus/Documents/repo/per_wesite/resume-memory-mcp/data/memory.db && echo "✅ Exists" || echo "❌ Missing")
```

---

## Troubleshooting:

| Problem | Fix |
|---------|-----|
| txtai API won't start | Check logs: `tail -50 /tmp/txtai-api.log` |
| Port 8001 already in use | Kill process: `fuser -k 8001/tcp` |
| MCP tools not showing | Restart Claude Code |
| "No applications in database" | Run populate script: `node resume-memory-mcp/scripts/populate-database.js` |

---

## Daily Workflow:

**Morning:**
1. Run `start-system.sh`
2. Launch Claude Code
3. Ready to apply!

**Evening:**
- txtai API keeps running (low resource usage, 880MB RAM)
- Optional: Stop when done: `./resume-memory-mcp/stop-system.sh`

---

## What Runs Where:

| Component | Auto-Start? | Resource Usage |
|-----------|-------------|----------------|
| txtai API | ❌ Manual | 880MB RAM, 3% CPU |
| MCP Server | ✅ Auto | Minimal (part of Claude Code) |
| Database | ✅ Always | 172KB disk space |

---

**TL;DR:** After reboot, run `start-system.sh`, then launch Claude Code. That's it!
