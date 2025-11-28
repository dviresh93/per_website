# Quick Test Guide - Resume Optimization System

## Prerequisites:
1. txtai API running on port 8001
2. Resume-memory MCP server configured in Claude Code

---

## Test 1: Top 3 Matches (Direct API)

```bash
curl -X POST http://127.0.0.1:8001/check_similarity \
  -H "Content-Type: application/json" \
  -d '{
    "requirements": "LangChain RAG AI Engineer Python",
    "role_type": "ai_engineer",
    "company": "Test"
  }'
```

**Expected:** JSON with 3 matches and scores

---

## Test 2: Full Workflow (Claude Code)

**In Claude Code terminal:**

```
Help me apply to this role:

Company: Test AI Corp
Role: Senior AI Engineer
Requirements: LangChain, RAG, multi-agent systems, Python, AWS, MLOps, production deployment
```

**Expected flow:**
1. Similarity check → Top 3 shown
2. If match ≥80% → Reasoning generated
3. Auto-recommendation → 3 options shown
4. You choose → Resume process starts
5. JSON draft shown → You approve
6. Validation runs → PDF generated

---

## Test 3: Validation (Catch Locked Content Violations)

**Bad JSON test:**

```
Validate this resume data:

{
  "work": [{
    "company": "Freefly Systems",
    "highlights": [
      "Modified bullet",  ← VIOLATION
      "Original bullet 2",
      "Original bullet 3"
    ]
  }]
}
```

**Expected:** Validation fails, blocks PDF generation

---

## Test 4: Similarity with Exact Match

**First, track an application:**
```
Track this test application:
- Company: Acme AI
- Role: AI Engineer
- Requirements: LangChain, RAG, Python
```

**Then check similarity:**
```
Check similarity for:
Company: Acme AI
Role: AI Engineer
Requirements: LangChain, RAG, Python
```

**Expected:** 90-100% match, reasoning generated, option 1 (Use Existing) recommended

---

## Verify System State:

```bash
# Check database
sqlite3 resume-memory-mcp/data/memory.db "SELECT COUNT(*) FROM applications;"

# Check txtai running
ps aux | grep uvicorn | grep -v grep

# Check MCP tools loaded
# In Claude Code: "What resume-memory tools are available?"
```

**Expected:**
- Database: 16+ applications
- txtai: Running on port 8001
- MCP: 7-8 tools available

---

## Common Issues:

| Issue | Fix |
|-------|-----|
| "No matches" | Restart txtai API to reindex |
| "API not running" | Start txtai: `cd semantic-search-api && uvicorn main:app --port 8001` |
| "Validation fails" | Check baseline-resume-data.json, fix violations |

---

## Full E2E Example:

```
User: "Help me apply to Meta AI Researcher role - LangChain, RAG, PyTorch"

System: ✅ Top 3 matches shown (Fieldguide 57%, Paradigm 54%, ...)
        ℹ️  All below 80% threshold
        → Recommends: Create New

User: "Let's create a new resume"

System: Loads baseline-resume-data.json
        Customizes for Meta role
        Shows JSON draft

User: "Looks good"

System: Validates → ✅ Pass
        Generates PDF
        Tracks application

Done! Cost: $0.09
```

---

**Test completion:** Run all 4 tests above to verify system works end-to-end.
