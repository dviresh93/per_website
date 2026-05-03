# System Management Scripts

## Quick Reference

```bash
# Start the system
./start-system.sh

# Stop the system
./stop-system.sh

# Check status
ps aux | grep "uvicorn main:app" | grep -v grep
```

---

## Start System (`start-system.sh`)

**What it does:**
- Starts txtai API on port 8001
- Loads 16+ applications from database
- Enables semantic similarity search

**Usage:**
```bash
cd /home/virus/Documents/repo/per_wesite/resume-memory-mcp
./start-system.sh
```

**Output:**
```
🚀 Starting Resume Optimization System...
Starting txtai API on port 8001...
✅ txtai API started successfully (PID: 12345)
📊 Logs: /tmp/txtai-api.log
```

---

## Stop System (`stop-system.sh`)

**What it does:**
- Gracefully shuts down txtai API
- Tries SIGTERM first (clean shutdown)
- Falls back to SIGKILL if needed
- Cleans up port 8001

**Usage:**
```bash
cd /home/virus/Documents/repo/per_wesite/resume-memory-mcp
./stop-system.sh
```

**Output:**
```
🛑 Stopping Resume Optimization System...
Found txtai API (PID: 12345)
Sending shutdown signal...
✅ txtai API stopped gracefully
```

---

## When to Use:

**Start:**
- After reboot
- After manually stopping
- If similarity check fails

**Stop:**
- Before system shutdown (optional)
- To free up 880MB RAM
- To restart with new code changes

---

## Troubleshooting:

### Port Already in Use
```bash
fuser -k 8001/tcp
./start-system.sh
```

### API Won't Stop
```bash
pkill -9 -f "uvicorn main:app"
```

### Check Logs
```bash
tail -50 /tmp/txtai-api.log
```

---

## System Requirements:

- Python 3.x with venv
- 880MB RAM for txtai API
- Port 8001 available
- Database: `data/memory.db` (auto-created)
