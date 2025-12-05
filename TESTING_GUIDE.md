# Testing Guide - Resume Generation System

**Version:** 1.0.0
**Purpose:** Verify the system works correctly for you and others
**Time Required:** 15-30 minutes for full test suite

---

## Overview

This guide provides **practical tests** to verify everything works. Tests are organized by:

1. **Quick Smoke Tests** (5 min) - Basic functionality
2. **Agent Detection Tests** (2 min) - Verify your agent is detected
3. **MCP Integration Tests** (5 min) - For Claude Code users
4. **File-Based Tests** (5 min) - For Gemini/other agents
5. **End-to-End Workflow Test** (10 min) - Complete resume generation
6. **Validation Tests** (3 min) - Ensure locked content protection works

---

## Quick Smoke Tests (5 minutes)

### Test 1: Repository Structure

**Verify all essential files exist:**

```bash
# Run this test
./tests/test-structure.sh
```

**Or manually check:**

```bash
# Check core files
ls -l .agent-config/config.json
ls -l .agent-config/UNIVERSAL_WORKFLOW.md
ls -l detect-agent.js
ls -l .env.example

# Check example files
ls -l data/profile.json.example
ls -l resume-memory-mcp/data/knowledge-graph.json.example

# Expected: All files should exist
```

**✅ Pass if:** All files exist
**❌ Fail if:** Any file missing → Re-run setup

---

### Test 2: Dependencies Installed

```bash
# Check Node.js
node --version
# Expected: v18.0.0 or higher

# Check npm dependencies
npm list --depth=0 2>/dev/null | grep -E "(modelcontextprotocol|better-sqlite3)"
# Expected: Should show MCP SDK and sqlite3

# Check Python (optional)
python3 --version
# Expected: 3.9.0 or higher (if using semantic search)
```

**✅ Pass if:** Node 18+, dependencies installed
**❌ Fail if:** Old Node version → Upgrade Node.js

---

### Test 3: Configuration Files Valid

```bash
# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('.agent-config/config.json')))"
# Expected: Should print config object without errors

# Check .env exists (or can be created)
test -f .env && echo "✅ .env exists" || echo "⚠️  Copy .env.example to .env"
```

**✅ Pass if:** No JSON errors
**❌ Fail if:** JSON syntax error → Fix config.json

---

## Agent Detection Tests (2 minutes)

### Test 4: Basic Agent Detection

```bash
# Run agent detection
node detect-agent.js

# Expected output (one of):
# - "claude" (if using Claude Code)
# - "gemini" (if GEMINI_API_KEY set or .gemini/ exists)
# - "openai" (if OPENAI_API_KEY set)
# - "unknown" (if none detected)
```

**✅ Pass if:** Correct agent detected
**❌ Fail if:** Wrong agent → Check environment variables

---

### Test 5: Verbose Detection

```bash
# Get detailed detection info
node detect-agent.js --verbose

# Expected: JSON output with:
# {
#   "agent": "claude",
#   "name": "Claude Code",
#   "features": [...],
#   "workflow": ".agent-config/agents/claude-resume-agent.md",
#   "detected_via": "..."
# }
```

**✅ Pass if:** Shows correct agent and detection method
**❌ Fail if:** Shows "unknown" → Create agent config file

---

### Test 6: Manual Agent Override

```bash
# Test manual override in .env
echo "AGENT_TYPE=gemini" > .env.test
AGENT_TYPE=gemini node detect-agent.js
# Expected: "gemini"

# Clean up
rm .env.test
```

**✅ Pass if:** Returns "gemini"
**❌ Fail if:** Ignores AGENT_TYPE → Check detect-agent.js

---

## MCP Integration Tests (For Claude Code)

### Test 7: MCP Servers Configured

```bash
# Check MCP config exists
cat ~/.claude/settings.json | grep -A 10 "mcpServers"

# Expected: Should show resume-memory and resume-generator entries
```

**✅ Pass if:** Both servers listed with correct paths
**❌ Fail if:** Missing or wrong paths → Update settings.json

---

### Test 8: MCP Server Starts

```bash
# Test resume-memory server starts
timeout 3s node resume-memory-mcp/server.js 2>&1 | head -5

# Expected output:
# ✅ Database initialized
# ✅ Knowledge graph initialized
# Resume Memory MCP Server running on stdio
```

**✅ Pass if:** Server starts without errors
**❌ Fail if:** Errors → Check dependencies, database path

---

### Test 9: MCP Tools Available (In Claude Code)

**In Claude Code session, run:**

```
mcp__resume-memory__get_profile_summary()
```

**Expected response:**
```
Profile Summary (XXX chars, compression: XX%)

[Your profile summary]
```

**✅ Pass if:** Returns profile summary
**❌ Fail if:** Tool not found → Restart Claude Code, check MCP config

---

### Test 10: Profile Compression Works

**In Claude Code:**

```
mcp__resume-memory__save_profile({
  fullContext: "Test profile data with at least 500 words... [add more text to reach ~2000 tokens]"
})
```

**Expected response:**
```
✅ Profile saved and compressed successfully!

COMPRESSION STATISTICS:
- Original: ~2000 tokens
- Compressed: ~200 tokens
- Token savings: ~1800 tokens (90% reduction)
```

**✅ Pass if:** Compression ratio > 80%
**❌ Fail if:** No compression → Check profile-compressor.js

---

## File-Based Tests (For Gemini/Non-MCP Agents)

### Test 11: Standalone Generator Works

```bash
# Create test resume data
cat > /tmp/test-resume.json << 'EOF'
{
  "basics": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1-555-0000",
    "location": { "address": "Test City" }
  },
  "summary": "Test summary",
  "work": [],
  "skills": [],
  "projects": []
}
EOF

# Try to generate (will fail without full data, but should start)
node generate-resume-standalone.mjs --help

# Expected: Shows usage information
```

**✅ Pass if:** Shows help text
**❌ Fail if:** File not found → Check if standalone generator exists

---

### Test 12: Profile Summary File Readable

```bash
# Check profile summary exists
test -f job-prep/applications/_resources/profile-summary.md.example && echo "✅ Example exists"

# If you customized it:
test -f job-prep/applications/_resources/profile-summary.md && echo "✅ Customized profile exists"

# Read it
cat job-prep/applications/_resources/profile-summary.md 2>/dev/null || \
cat job-prep/applications/_resources/profile-summary.md.example
```

**✅ Pass if:** Profile readable, < 500 words
**❌ Fail if:** File missing → Create from example

---

### Test 13: Knowledge Graph Parseable

```bash
# Validate knowledge graph JSON
node -e "
const kg = JSON.parse(require('fs').readFileSync('resume-memory-mcp/data/knowledge-graph.json.example'));
console.log('✅ Valid JSON');
console.log('Projects:', kg.nodes.projects.length);
console.log('Companies:', kg.nodes.companies.length);
console.log('Skills:', kg.nodes.skills.length);
"
```

**Expected output:**
```
✅ Valid JSON
Projects: 3
Companies: 2
Skills: 6
```

**✅ Pass if:** Valid JSON, has data
**❌ Fail if:** Parse error → Fix JSON syntax

---

## End-to-End Workflow Test (10 minutes)

### Test 14: Complete Resume Generation (Fake Job)

**Use this fake job posting for testing:**

```
Company: TestCorp
Role: Senior AI Engineer

Requirements:
- 5+ years Python experience
- LangChain, RAG systems, multi-agent AI
- Production ML deployment
- AWS or GCP cloud platforms
- Strong communication skills

Preferred:
- MS in Computer Science
- Experience with embeddings, vector databases
- Open source contributions

Location: Remote
Salary: $150k-$200k
```

---

#### For Claude Code Users:

**In Claude Code, paste:**

```
Help me apply to this role:

[Paste fake job posting above]
```

**Expected workflow:**

1. **Step 0: Fit Analysis**
   - Shows fit score (0-100%)
   - Lists strengths and gaps
   - Asks "Proceed with application?"

2. **Step 1: Similarity Check**
   - Shows top 3 similar applications (if any exist)
   - Or shows "No similar applications found"

3. **Step 2: Reasoning** (if similarity ≥80%)
   - Analyzes overlap
   - Recommends option (Use/Tailor/Create)

4. **Step 3: Present Options**
   - Shows all 3 options with costs
   - Waits for your choice

5. **User interaction:** Type `3` (Create New)

6. **Step 4: Customization**
   - Shows JSON draft
   - Asks for approval

7. **User interaction:** Type `approve`

8. **Step 5: Validation**
   - Runs validation checks
   - Should pass (✅ All checks passed!)

9. **Step 6: Generate**
   - Creates PDF
   - Shows file path

10. **Step 7: Complete**
    - Displays summary
    - Shows token usage

**✅ Pass if:** Workflow completes without errors, PDF generated
**❌ Fail if:** Stuck at any step → Check error message, review workflow file

---

#### For Gemini/File-Based Users:

**Manually follow the workflow:**

1. **Create application folder:**
   ```bash
   mkdir -p job-prep/applications/testcorp-ai-engineer
   ```

2. **Create job posting file:**
   ```bash
   cat > job-prep/applications/testcorp-ai-engineer/job-posting.md << 'EOF'
   # TestCorp - Senior AI Engineer

   [Paste job requirements]
   EOF
   ```

3. **Load profile summary:**
   ```bash
   cat job-prep/applications/_resources/profile-summary.md
   ```

4. **Calculate fit mentally** (or use agent's help):
   - Count matching requirements
   - Calculate score

5. **Check for similar applications:**
   ```bash
   cat job-prep/applications/README.md
   # Manually scan for similar roles
   ```

6. **Load baseline resume:**
   ```bash
   cat job-prep/applications/_resources/baseline-resume-data.json
   ```

7. **Customize for role** (in your agent/editor):
   - Update summary
   - Reorder skills
   - Select projects
   - Save as `testcorp-ai-engineer/resume-data.json`

8. **Validate** (manual checks):
   - Locked bullets unchanged?
   - Job titles correct?
   - Bullet counts: 3-4-2-2?

9. **Generate PDF:**
   ```bash
   # If standalone generator exists
   node generate-resume-standalone.mjs \
     --input job-prep/applications/testcorp-ai-engineer/resume-data.json \
     --output job-prep/applications/testcorp-ai-engineer/resume.pdf
   ```

10. **Verify PDF created:**
    ```bash
    ls -lh job-prep/applications/testcorp-ai-engineer/resume.pdf
    ```

**✅ Pass if:** PDF generated, looks correct
**❌ Fail if:** Errors → Check standalone generator setup

---

## Validation Tests (3 minutes)

### Test 15: Locked Content Detection

**If using Claude Code MCP:**

```
mcp__resume-memory__validate_resume({
  work: [
    {
      company: "Freefly Systems",
      highlights: [
        "Custom bullet 1",
        "MODIFIED LOCKED BULLET 2",  // ❌ Should fail
        "Locked bullet 3",
        "Locked bullet 4"
      ]
    }
  ]
})
```

**Expected:**
```
❌ VALIDATION ERRORS:

1. Freefly bullet 2 modified (LOCKED)
   Expected: "Led release management for..."
   Got: "MODIFIED LOCKED BULLET 2"

⛔ RESUME GENERATION BLOCKED
```

**✅ Pass if:** Detects the modification
**❌ Fail if:** Validation passes → Validation not working

---

### Test 16: Bullet Count Validation

**Test with wrong bullet count:**

```json
{
  "work": [
    {
      "company": "Grid CoOperator",
      "highlights": [
        "Bullet 1",
        "Bullet 2",
        "Bullet 3",
        "Bullet 4",  // ❌ Should only have 3
        "Bullet 5"   // ❌ Should only have 3
      ]
    }
  ]
}
```

**Expected:**
```
❌ VALIDATION ERRORS:

1. Grid CoOperator bullet count wrong
   Expected: 3 bullets
   Got: 5 bullets
```

**✅ Pass if:** Detects wrong count
**❌ Fail if:** Validation passes → Check validation rules

---

## Cleanup After Testing

```bash
# Remove test files
rm -rf job-prep/applications/testcorp-ai-engineer/
rm -f /tmp/test-resume.json

# Keep the test experience for future reference (optional)
# Or move to archive:
# mv job-prep/applications/testcorp-ai-engineer/ job-prep/applications/_archive/test-run/
```

---

## Test Checklist Summary

### Basic Setup ✓
- [ ] All files exist (structure test)
- [ ] Dependencies installed
- [ ] Configuration files valid

### Agent Detection ✓
- [ ] Agent detected correctly
- [ ] Verbose detection shows details
- [ ] Manual override works

### MCP Integration (Claude Code Only) ✓
- [ ] MCP servers configured
- [ ] Servers start without errors
- [ ] Tools accessible in Claude Code
- [ ] Profile compression works

### File-Based (Gemini/Others) ✓
- [ ] Standalone generator available
- [ ] Profile summary readable
- [ ] Knowledge graph parseable

### End-to-End Workflow ✓
- [ ] Fit analysis works
- [ ] Similarity check works
- [ ] Options presented correctly
- [ ] Customization creates valid JSON
- [ ] Validation runs
- [ ] PDF generates successfully

### Validation ✓
- [ ] Locked content detection works
- [ ] Bullet count validation works

---

## For Others Testing Your System

**Share this quick test script:**

```bash
#!/bin/bash
# quick-test.sh - Verify resume system works

echo "🧪 Testing Resume Generation System..."
echo ""

# Test 1: Structure
echo "1️⃣  Checking file structure..."
test -f .agent-config/config.json && echo "  ✅ Config exists" || echo "  ❌ Config missing"
test -f detect-agent.js && echo "  ✅ Detection script exists" || echo "  ❌ Detection script missing"
test -f .env.example && echo "  ✅ .env.example exists" || echo "  ❌ .env.example missing"
echo ""

# Test 2: Dependencies
echo "2️⃣  Checking dependencies..."
node --version > /dev/null 2>&1 && echo "  ✅ Node.js installed" || echo "  ❌ Node.js missing"
npm list --depth=0 2>/dev/null | grep -q "modelcontextprotocol" && echo "  ✅ MCP SDK installed" || echo "  ⚠️  MCP SDK not installed (optional)"
echo ""

# Test 3: Agent Detection
echo "3️⃣  Detecting agent..."
AGENT=$(node detect-agent.js)
echo "  Detected: $AGENT"
echo ""

# Test 4: Example Data
echo "4️⃣  Checking example data..."
test -f data/profile.json.example && echo "  ✅ Profile example exists" || echo "  ❌ Profile example missing"
test -f resume-memory-mcp/data/knowledge-graph.json.example && echo "  ✅ Knowledge graph example exists" || echo "  ❌ Knowledge graph example missing"
echo ""

echo "✅ Basic tests complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Customize example files (see CUSTOMIZATION_GUIDE.md)"
echo "3. Run end-to-end test with fake job posting (see TESTING_GUIDE.md)"
echo ""
```

**Save this as `quick-test.sh` and make it executable:**

```bash
chmod +x quick-test.sh
./quick-test.sh
```

---

## Expected Test Results

### New User (First Time)

```
✅ Structure: All files present
✅ Dependencies: Node 18+ installed
✅ Agent Detection: Detects correctly (or "unknown")
⚠️  Example Data: Not customized yet (expected)
❌ Profile: Not loaded yet (expected)
❌ MCP: Not configured yet (expected for first time)

Next: Follow SETUP_FOR_DISTRIBUTION.md
```

### After Setup (Customized)

```
✅ Structure: All files present
✅ Dependencies: Node 18+ installed
✅ Agent Detection: Correct agent
✅ Example Data: Customized files exist
✅ Profile: Loaded and compressed
✅ MCP: Configured and working (if using Claude Code)
✅ End-to-End: Test resume generates successfully

Next: Start using for real applications!
```

---

## Troubleshooting Test Failures

### "Agent Detection Returns 'unknown'"

**Fix:**
```bash
# Option A: Set manually
echo "AGENT_TYPE=claude" >> .env

# Option B: Create agent config
mkdir -p .claude
echo "# Claude Code Config" > .claude/CLAUDE.md

# Test again
node detect-agent.js
```

### "MCP Tools Not Found"

**Fix (Claude Code):**
```bash
# Check MCP config
cat ~/.claude/settings.json | grep -A 5 resume-memory

# Restart Claude Code completely
# Test: mcp__resume-memory__get_profile_summary()
```

### "PDF Generation Fails"

**Fix:**
```bash
# Check standalone generator
ls -l generate-resume-standalone.mjs

# If missing, check in resumake-mcp/
ls -l resumake-mcp/

# Verify Node version
node --version  # Must be 18+
```

### "Validation Always Passes (Should Fail)"

**Fix:**
```bash
# Check baseline resume exists
cat job-prep/applications/_resources/baseline-resume-data.json | head -20

# Verify locked content defined in FORMAT-STANDARDS.md
cat job-prep/applications/_resources/FORMAT-STANDARDS.md
```

---

## Continuous Testing

### After Making Changes

**Always run:**
```bash
# 1. Structure check
ls -l .agent-config/*.md

# 2. JSON validation
node -e "console.log(JSON.parse(require('fs').readFileSync('.agent-config/config.json')))"

# 3. Agent detection
node detect-agent.js --verbose

# 4. Quick end-to-end
# (Use fake job posting, verify PDF generates)
```

### Before Sharing with Others

**Full test suite:**
```bash
# Run all tests
./quick-test.sh

# Test as new user:
# 1. Fresh clone to new directory
# 2. Follow SETUP_FOR_DISTRIBUTION.md
# 3. Verify all steps work
```

---

## Performance Benchmarks

**Expected timings:**

| Test | Time |
|------|------|
| Agent detection | < 1 second |
| MCP server start | < 2 seconds |
| Profile compression | < 1 second |
| Similarity check | < 3 seconds |
| Resume generation | < 5 seconds |
| End-to-end workflow | 2-5 minutes (with user input) |

**If slower:**
- Check system resources
- Verify Node.js version (18+ is faster)
- Check if semantic API running (optional, can be slow to start)

---

## Success Criteria

**System is working correctly if:**

✅ **All smoke tests pass** (5/5)
✅ **Agent detected correctly** (3/3 detection tests)
✅ **MCP or file-based mode works** (depending on agent)
✅ **End-to-end workflow completes** (all 10 steps)
✅ **Validation catches errors** (2/2 validation tests)
✅ **PDF generates** (can be opened and viewed)

**You're ready to use the system!** 🎉

---

## Next Steps After Testing

1. **If all tests pass:**
   - Start using for real applications
   - Track results to improve system
   - Share with others

2. **If some tests fail:**
   - Review troubleshooting section
   - Check SETUP_FOR_DISTRIBUTION.md
   - Open an issue (if public repo)

3. **For continuous improvement:**
   - Run tests before major changes
   - Test with different job postings
   - Verify cost savings match expectations

---

**Questions?** See SETUP_FOR_DISTRIBUTION.md or CUSTOMIZATION_GUIDE.md

**Found a bug?** Document the test case and report it

**System working?** Great! Start applying to jobs! 🚀
