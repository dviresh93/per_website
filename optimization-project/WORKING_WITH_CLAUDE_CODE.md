# Working with Claude Code: Progress Tracking & Session Recovery

**Purpose:** How to implement this project safely across multiple Claude Code sessions

---

## The Problem

Claude Code sessions can end due to:
1. **Token limits** (200k tokens per session)
2. **Network disconnection**
3. **Manual interruption** (you need to stop)
4. **System crashes**

**Risk:** Losing context mid-task = forgetting what we were doing

---

## The Solution: Multi-Layer Safety Net

### Layer 1: Git Auto-Commits (After Each File Change)

**Strategy:** Commit IMMEDIATELY after every file is created/modified

**How it works:**
```bash
# After creating/editing a file, Claude Code will:
git add <file>
git commit -m "WIP: [Task] - [What changed]"
git push origin main

# Example:
git add resumake-mcp/lib/template-expander.js
git commit -m "WIP: Phase 1.2 - Created template expander (incomplete)"
git push origin main
```

**Benefits:**
- ✅ Every file change is saved to git
- ✅ Can always recover to last file state
- ✅ WIP (Work In Progress) commits show what was being worked on
- ✅ Push to remote = safe even if local machine crashes

**When to use:**
- After creating any new file
- After editing any existing file
- Before running tests
- Before installing dependencies

### Layer 2: Session State File (Updated Every 5 Minutes)

**File:** `optimization-project/SESSION_STATE.md`

**What Claude Code will do:**
- Update this file every 5 minutes with current state
- Save it as a regular file (auto-committed by Layer 1)
- You can read it anytime to see what's happening

**Contents:**
```markdown
## Current Task
Phase 1, Task 1.2: Template-Based Locked Content
Status: In progress (50% done)

## Last Action (2 minutes ago)
Created lib/template-expander.js with expandTemplates() function

## Next Action
Add unit tests for template expansion

## Files Modified
- resumake-mcp/lib/template-expander.js (created)
- resumake-mcp/package.json (added micromustache)

## To Resume
1. Run: npm install (in resumake-mcp/)
2. Create: tests/template-expander.test.js
3. Test with: npm test
```

### Layer 3: Markdown Checkboxes (Manual Updates)

**File:** `optimization-project/IMPLEMENTATION_TRACKER.md`

**You update this manually:**
```markdown
### Task 1.2: Template-Based Locked Content
- [x] Install micromustache
- [x] Create lib/locked-templates.js
- [x] Create lib/template-expander.js
- [ ] Update server.js to use expander  ← We're here!
- [ ] Write tests
```

**When to update:**
- After completing each sub-step
- Before ending a session
- When you want to see overall progress

### Layer 4: Git Tags (After Each Complete Task)

**After completing a full task:**
```bash
git tag -a phase-1.2-complete -m "Phase 1.2: Template-based content complete"
git push origin --tags
```

**Benefits:**
- Easy to see what's been completed
- Can jump back to any completed task
- Gives you confidence in progress

---

## Session Workflow (Step-by-Step)

### Starting a New Session

```bash
# 1. Check where we left off
cat optimization-project/SESSION_STATE.md

# 2. Check git status
git status
git log --oneline -5  # See last 5 commits

# 3. Check implementation tracker
cat optimization-project/IMPLEMENTATION_TRACKER.md | grep "Status: In progress"

# 4. Start Claude Code and say:
"Let's continue from Phase X, Task X.X.
 Last session we [what you see in SESSION_STATE.md].
 What should we do next?"
```

### During a Session

**Claude Code will:**
1. Make a file change
2. Immediately commit: `git commit -m "WIP: [what changed]"`
3. Update SESSION_STATE.md every 5 minutes
4. Tell you: "✅ Committed [filename]" after each save

**You should:**
- Watch for "✅ Committed" messages
- If you don't see one for 10+ minutes, ask: "Did you commit the last changes?"

### Ending a Session (Gracefully)

```bash
# Claude Code will:
1. Finish current sub-task
2. Update IMPLEMENTATION_TRACKER.md checkboxes
3. Update SESSION_STATE.md with "Next session: start here"
4. Make final git commit
5. Git push to remote
6. Tell you: "✅ Safe to close. Resume from: [exact task]"
```

### Session Interrupted (Lost Connection)

```bash
# You do:
1. Open terminal
2. cd /home/virus/Documents/repo/per_wesite/optimization-project
3. cat SESSION_STATE.md  # See what was happening
4. git status            # See what files were modified
5. git diff              # See what changes weren't committed

# Two options:

Option A: Keep changes
git add .
git commit -m "WIP: Recovered from interrupted session"
git push

Option B: Discard changes (if broken)
git restore .  # Discard all uncommitted changes
# Returns to last committed state
```

---

## Token Usage Strategy

Claude Code has **200,000 tokens per session**. Here's how to manage it:

### Token-Efficient Workflow

**High-token activities (avoid):**
- Reading large files multiple times
- Long back-and-forth discussions
- Exploring many files without direction

**Low-token activities (prefer):**
- Focused tasks with clear goals
- Creating new files (no reading required)
- Testing with bash commands
- Committing to git

### Session Planning

**Break work into ~40k token chunks:**

**Session 1: Phase 1.1 + 1.2** (~40k tokens)
- Split baseline files
- Template-based content
- Test and commit
- **End session**

**Session 2: Phase 1.3 + validation** (~40k tokens)
- Job-aware context loading
- Phase 1 validation
- Test and commit
- **End session**

**Session 3: Phase 2.1** (~50k tokens)
- Setup Memory MCP server
- Database and basic tools
- Test and commit
- **End session**

(and so on...)

### Monitoring Token Usage

```bash
# Claude Code shows token usage at bottom of responses:
Token usage: 42000 / 200000

# If you see usage > 150k:
"Let's wrap up this task and end the session.
 Update SESSION_STATE.md with where to resume."
```

### What Happens at 200k Tokens?

**Claude Code will:**
1. Warn you at ~180k tokens: "Approaching session limit"
2. At 200k: Session ends automatically
3. You lose unsaved context (but files are committed!)

**Recovery:**
1. Read SESSION_STATE.md
2. Start new Claude Code session
3. Say: "Resume from [task in SESSION_STATE.md]"

---

## Recovery Scenarios

### Scenario 1: Lost Connection Mid-Task

**Symptoms:**
- Claude Code disconnected
- Terminal shows partial changes

**Recovery:**
```bash
cd optimization-project/
cat SESSION_STATE.md

# See what was being worked on
git status
git diff

# If changes look good:
git add .
git commit -m "WIP: Recovered from Session X"
git push

# Start new session:
claude
"Resume from: [task in SESSION_STATE.md]"
```

### Scenario 2: Hit Token Limit

**Symptoms:**
- Session ended automatically
- Message: "Session limit reached"

**Recovery:**
```bash
# Files are already committed (if Layer 1 worked)
cat SESSION_STATE.md

# Start new session:
claude
"Resume Phase X, Task X.X. Last session completed [X]. Next: [Y]"
```

### Scenario 3: You Forgot What You Were Doing

**Recovery:**
```bash
# Check multiple sources:
cat SESSION_STATE.md              # What was happening
git log --oneline -10             # Last 10 commits
cat IMPLEMENTATION_TRACKER.md | grep "\[x\]"  # What's done

# Resume:
claude
"Show me where we are in the implementation.
 I see we last worked on [task from git log]."
```

### Scenario 4: Test Failed, Unsure How to Fix

**Recovery:**
```bash
# Revert to last known-good state:
git log --oneline  # Find last working commit
git checkout <commit-hash>

# Or just revert last commit:
git revert HEAD

# Start new session with fresh context:
claude
"The test failed in last session. Let's debug [specific test]."
```

---

## File Structure for Progress Tracking

```
optimization-project/
├── IMPLEMENTATION_TRACKER.md     # Manual checklist (YOU update)
├── SESSION_STATE.md              # Auto-updated every 5 min (CLAUDE updates)
├── SESSION_RECOVERY_GUIDE.md     # Template for recovery
├── WORKING_WITH_CLAUDE_CODE.md   # This file (HOW TO)
│
├── phase-1/
│   └── [implementation files]
├── phase-2/
│   └── [implementation files]
└── phase-3/
    └── [implementation files]
```

**All committed to git after every change!**

---

## Best Practices

### ✅ DO:

1. **Commit after every file change** (Layer 1)
2. **Read SESSION_STATE.md before resuming**
3. **Update IMPLEMENTATION_TRACKER.md manually** when completing tasks
4. **End sessions before hitting 180k tokens**
5. **Test frequently** (catch errors early)
6. **Git push to remote** (backup to cloud)

### ❌ DON'T:

1. **Don't work for hours without committing** (commit per file!)
2. **Don't rely on memory** (write down state)
3. **Don't ignore token warnings** (end session gracefully)
4. **Don't skip tests** (find bugs early)
5. **Don't edit SESSION_STATE.md manually** (let Claude update it)

---

## Quick Reference Commands

### Check Status
```bash
cat optimization-project/SESSION_STATE.md
git status
git log --oneline -5
```

### Commit Current Work
```bash
git add .
git commit -m "WIP: [description]"
git push
```

### Recover from Interruption
```bash
cat optimization-project/SESSION_STATE.md
git status
git diff
# If good: git add . && git commit -m "WIP: Recovered"
# If bad: git restore .
```

### Start New Session
```bash
claude
"Resume from Phase X, Task X.X.
 Last session: [check SESSION_STATE.md]"
```

---

## Example Session

### Session Start
```bash
$ cat SESSION_STATE.md
## Current Task
Phase 1, Task 1.2: Template-Based Locked Content
Status: In progress (75% done)

## Last Action
Created lib/template-expander.js and lib/locked-templates.js

## Next Action
Update server.js to integrate template expansion

$ claude
User: "Resume Phase 1.2. Need to update server.js to use template expander."
```

### During Session
```
Claude: Creating template-expander.js...
✅ Committed: resumake-mcp/lib/template-expander.js

Claude: Updating server.js...
✅ Committed: resumake-mcp/server.js

Claude: Creating tests...
✅ Committed: resumake-mcp/tests/template-expander.test.js

Claude: Running tests... (npm test)
✅ All tests passing

Claude: Updating SESSION_STATE.md...
✅ Committed: SESSION_STATE.md
```

### Session End
```
Claude: "Task 1.2 complete!
         Token usage: 38,000 / 200,000
         All changes committed and pushed.

         Next session: Start Phase 1.3 (Job-Aware Context Loading)

         Safe to close."

User: Ctrl+D (exit)
```

---

## Summary

**Three-layer safety:**
1. **Git commits** after every file (instant backup)
2. **SESSION_STATE.md** updated every 5 min (context preservation)
3. **IMPLEMENTATION_TRACKER.md** manual checkboxes (big picture)

**Recovery is always possible:**
- Read SESSION_STATE.md
- Check git log
- Resume from last known state

**Token management:**
- Sessions = ~40-50k tokens each
- End gracefully before 180k
- Start fresh session, reference SESSION_STATE.md

**You're safe to implement across many sessions!**

---

**Ready to start Phase 1?** 🚀
