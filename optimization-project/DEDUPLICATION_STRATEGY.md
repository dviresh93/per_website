# Smart Resume Deduplication Strategy

**Last Updated:** 2025-11-04
**Status:** Added to Phase 3 of MASTER_PLAN

---

## Overview

Instead of generating a new resume for every job application, **check if a similar resume already exists** and reuse it. This can save 50-90% of costs when applying to multiple similar roles.

## The Problem

Current approach (even after optimization):
```
10 AI Engineer applications × $0.09 = $0.90
```

**Why this is wasteful:**
- If you apply to 10 "AI Engineer" roles with similar requirements
- You're generating 10 nearly-identical resumes
- Only minor differences in company name and customization
- Each generation costs 7,500 tokens ($0.09)

## The Solution: Zero-Token Similarity Checks

Before generating a resume, **check locally** if you've already created a similar one:

```
User applies to job posting
         ↓
txtai semantic search (LOCAL, 0 tokens, ~50ms)
         ↓
    Similar resume found?
         ↓
   ┌─────┴─────┐
  YES          NO
   │            │
   ↓            ↓
Copy PDF    Generate new
(0 tokens)  (7.5k tokens)
   │            │
   └─────┬──────┘
         ↓
   applications/{company-role}/resume.pdf
```

**Key insight:** Similarity check uses **txtai (local embeddings)**, not Claude. Zero tokens, zero cost!

---

## How It Works

### 1. Similarity Check (Zero Tokens!)

**Tool:** txtai (local Python library)
- Downloads 80MB sentence transformer model (one-time)
- Indexes all past applications (last 90 days)
- Compares job requirements semantically
- Returns similarity score (0.0 - 1.0)
- **Takes ~50-100ms, costs $0**

**Similarity factors:**
- Role type (40%): "AI Engineer" vs "ML Engineer"
- Required skills (30%): "Python, LangChain" vs "Python, LLMs"
- Experience level (15%): "3-5 years" vs "5-7 years"
- Industry (10%): "Energy" vs "Tech"
- Special requirements (5%): "Security clearance", etc.

**Threshold:** 85%+ similarity → reuse resume

### 2. When to Reuse

**Example 1: AI Engineer roles (HIGH similarity)**
```
Job 1: "AI Engineer at Google"
  - Python, LangChain, RAG systems
  - 3-5 years experience
  - Tech industry

Job 2: "AI Engineer at Meta" (1 week later)
  - Python, LangChain, vector databases
  - 3-5 years experience
  - Tech industry

Similarity: 92% → REUSE Google resume ✅
Savings: $0.09 (7,500 tokens)
```

**Example 2: Different roles (LOW similarity)**
```
Job 1: "AI Engineer at Google"
  - Python, LangChain, RAG

Job 2: "Robotics Engineer at Northrop Grumman"
  - C++, ROS2, embedded systems

Similarity: 25% → GENERATE NEW ❌
Cost: $0.09 (worth it for different role)
```

### 3. User Experience

When applying to a job, the workflow checks first:

```bash
$ claude apply Meta-AI-Engineer

Analyzing job posting...
Role type: AI Engineer
Checking for similar past applications...

✅ Found similar resume!
   - Previously applied to: Google (AI Engineer)
   - Similarity: 92%
   - Applied: 2024-10-28 (7 days ago)

Would you like to:
1. Reuse Google resume (saves $0.09, instant)
2. Generate new resume (customize for Meta)

Your choice: 1

✅ Resume copied to applications/Meta-AI-Engineer/resume.pdf
📊 Tokens saved: 7,500 ($0.09)
🎯 Ready to apply!
```

User can always **force new generation** if they want to customize.

---

## Implementation Details

### Architecture

**New component:** Similarity Check API (Python)

```
semantic-search-api/
├── main.py                    # FastAPI server
├── similarity_checker.py      # txtai logic
└── requirements.txt           # txtai, fastapi, uvicorn
```

Runs locally on `localhost:8002`, provides zero-token similarity checks.

### Database Schema

```sql
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  role_type TEXT,              -- "AI Engineer", "Robotics Engineer"
  job_requirements TEXT,       -- Full job posting requirements
  projects_selected TEXT,      -- JSON: ["gridcop", "drone-log"]
  skills_highlighted TEXT,     -- JSON: ["Python", "LangChain"]
  resume_path TEXT,            -- Path to generated PDF
  resume_reused BOOLEAN,       -- TRUE if copied from another
  reused_from TEXT,            -- Company name if reused
  tokens_used INTEGER,         -- 0 for reused, 7500 for generated
  cost_usd REAL,               -- 0 for reused, 0.09 for generated
  application_date TEXT,
  status TEXT,                 -- "applied", "screening", "rejected"
  similarity_score REAL        -- If reused, what was similarity?
);
```

### MCP Tool

New tool in `resume-memory-mcp`:

```javascript
{
  name: "check_resume_similarity",
  description: "Check if similar resume exists (zero-token, local)",
  inputSchema: {
    type: "object",
    properties: {
      job_requirements: { type: "string" },
      role_type: { type: "string" },
      company: { type: "string" }
    }
  }
}
```

Calls local similarity API (port 8002), returns:

```json
{
  "should_reuse": true,
  "existing_resume": "applications/Google-AI-Engineer/resume.pdf",
  "company": "Google",
  "role": "AI Engineer",
  "similarity_score": 0.92,
  "tokens_saved": 7500
}
```

---

## Cost Savings Analysis

### Scenario 1: 10 AI Engineer Applications

**Without deduplication:**
```
10 applications × 7,500 tokens = 75,000 tokens ($0.90)
```

**With deduplication:**
```
Application 1: Google AI Engineer
  - Check similarity: 0 tokens (no past apps)
  - Generate new: 7,500 tokens ($0.09)

Applications 2-10: Meta, Amazon, Microsoft, etc.
  - Check similarity: 0 tokens × 9 = 0 tokens
  - Reuse Google resume: 0 tokens × 9 = 0 tokens

Total: 7,500 tokens ($0.09)
Savings: $0.81 (90%!)
```

### Scenario 2: Mixed Role Types

**30 applications over 3 months:**
- 10 AI Engineer roles
- 10 ML Engineer roles
- 5 Robotics Engineer roles
- 5 unique roles

**Without deduplication:**
```
30 × 7,500 tokens = 225,000 tokens ($2.70)
```

**With deduplication:**
```
AI Engineer: 1 new + 9 reused = 7,500 tokens
ML Engineer: 1 new + 9 reused = 7,500 tokens
Robotics: 1 new + 4 reused = 7,500 tokens
Unique: 5 new = 37,500 tokens

Total: 60,000 tokens ($0.72)
Savings: $1.98 (73%!)
```

---

## When NOT to Reuse

The system won't reuse if:

1. **Similarity < 85%**: Different role type, skills, or requirements
2. **Special customization needed**: User explicitly requests "force new"
3. **Significant seniority difference**: "Mid-level" vs "Senior" (even if same role)
4. **Industry-specific requirements**: "Defense security clearance" vs "Tech startup"
5. **No past applications**: First time applying to this role type

**User always has control:** Can override similarity check and force new generation.

---

## Implementation Timeline

**Part of Phase 3, Task 3.3** (1 day)

**Steps:**
1. Install txtai and FastAPI
2. Create similarity checker module (Python)
3. Setup FastAPI server on port 8002
4. Add MCP tool `check_resume_similarity`
5. Update `.claude/commands/apply.md` workflow
6. Test with 3 applications (1 new, 2 similar)

**Dependencies:**
- Phase 3, Task 3.1 complete (application tracking in database)
- SQLite database schema updated

---

## Technical Details

### txtai: Local Semantic Search

**Why txtai?**
- All-in-one library (embeddings + search)
- Runs locally (no API calls)
- Lightweight model (80MB)
- Fast (50-100ms per search)
- Zero cost

**Model used:**
```python
from txtai.embeddings import Embeddings

embeddings = Embeddings({
    "path": "sentence-transformers/all-MiniLM-L6-v2",
    "content": True
})
```

**Indexing:**
```python
# Index past applications (runs once on startup)
documents = [
    ("google-ai-eng", "Python LangChain RAG AI Engineer 3-5 years", None),
    ("meta-ml-eng", "Python PyTorch ML Engineer 5-7 years", None),
    ...
]
embeddings.index(documents)
```

**Searching:**
```python
# Search for similar (runs on every job posting, ~50ms)
results = embeddings.search("Python LangChain AI Engineer 3-5 years", limit=5)
# Returns: [("google-ai-eng", 0.92), ("meta-ml-eng", 0.68), ...]
```

**No Claude calls, no tokens, no cost!**

---

## Deployment

### Development Setup

```bash
# 1. Install txtai (one-time)
pip install txtai fastapi uvicorn

# 2. Create similarity API
cd semantic-search-api/
uvicorn main:app --port 8002 --reload

# 3. Similarity API runs in background
# Provides zero-token similarity checks to MCP server
```

### Running Services

```
Local Machine:
├── Claude Code CLI (user interface)
├── Resume Memory MCP (Node.js, stdio)
├── Resume Generator MCP (Node.js, stdio)
├── Semantic Search API (Python, port 8001) [optional]
└── Similarity Check API (Python, port 8002) [Phase 3]
```

---

## Testing

```bash
# Test 1: First application (no past resumes)
claude apply Google-AI-Engineer
# Expected: Check similarity (0 results), generate new

# Test 2: Second similar application
claude apply Meta-AI-Engineer
# Expected: Check similarity (finds Google, 92%), offer reuse

# Test 3: Different role type
claude apply Northrop-Robotics-Engineer
# Expected: Check similarity (no match), generate new

# Verify database
sqlite3 resume-memory-mcp/data/memory.db
> SELECT company, role, tokens_used, resume_reused FROM applications;
```

---

## Benefits Summary

| Benefit | Impact |
|---------|--------|
| **Cost savings** | 50-90% for similar roles |
| **Speed** | Instant (5 sec) vs 5 min generation |
| **Consistency** | Same resume for same role = consistent branding |
| **Zero tokens** | Similarity check uses local txtai (no API) |
| **Smart tracking** | Database shows which resumes work for which roles |
| **User control** | Can always force new generation |

---

## References

- **MASTER_PLAN.md**: Full implementation guide (Phase 3, Task 3.3)
- **architecture.md**: System architecture with deduplication
- **tool-selection.md**: Why txtai for local semantic search

---

**Decision Date:** 2025-11-04
**Implementation:** Phase 3, Task 3.3 (1 day)
**Status:** Approved and documented
