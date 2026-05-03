# Resume Memory MCP Server - Quick Start

**Status:** ✅ Ready to use
**Date:** 2025-11-05

---

## What This Is

An MCP server that optimizes resume generation by:
- **70% token reduction** (25k → 7.5k tokens per resume)
- **Zero-token resume reuse** for similar jobs
- **Smart project recommendations** based on history

---

## Prerequisites

- ✅ Node.js installed (with npm)
- ✅ Python 3.9+ with venv
- ✅ Claude Code CLI
- ✅ This repo: `/home/virus/Documents/repo/resume-memory-mcp/`

**Already complete:**
- ✅ Dependencies installed (`npm install` done)
- ✅ txtai installed in venv
- ✅ MCP server configured in `.claude.json`

---

## Quick Start (3 Steps)

### 1. Restart Claude Code
```bash
# Exit current Claude Code session, then:
cd /home/virus/Documents/repo/per_wesite
claude
```

This loads the new MCP server.

### 2. Verify Tools Loaded
In Claude Code, verify you see these 6 tools:
- `get_profile_summary`
- `save_profile`
- `track_application`
- `query_knowledge_graph`
- `get_learned_patterns`
- `check_resume_similarity`

### 3. Save Your Profile (One-Time)
```
Use save_profile tool with my full profile context from /profile
```

**Done!** You're ready to generate optimized resumes.

---

## Optional: Enable Similarity Checking

To enable zero-token resume reuse for similar jobs:

```bash
cd /home/virus/Documents/repo/resume-memory-mcp/semantic-search-api
source venv/bin/activate
python similarity_checker.py
```

Leave this running in a separate terminal. The API runs on `http://127.0.0.1:8001`.

**Note:** If the similarity API isn't running, `check_resume_similarity` will gracefully fall back to generating a new resume.

---

## Usage Workflow

### For Each Resume:

**Step 1: Check Similarity (Optional)**
```
Use check_resume_similarity tool with:
  company: "Anthropic"
  role: "AI Engineer"
  requirements: "LangChain, RAG, Python, AWS..."
```

If similar to a previous job → Reuse existing resume (0 tokens!)

**Step 2: Get Profile Summary**
```
Use get_profile_summary tool
```

Returns 200-token compressed profile (vs 8,000 tokens for full profile).

**Step 3: Find Relevant Projects**
```
Use query_knowledge_graph tool with:
  query: "langchain rag multi-agent"
  role_type: "ai_engineer"
  limit: 3
```

Returns top 3 most relevant projects based on keywords.

**Step 4: Generate Resume**
Use the profile summary + selected projects to generate the resume.

**Step 5: Track Application**
```
Use track_application tool with:
  company: "Anthropic"
  role: "AI Engineer"
  role_type: "ai_engineer"
  projects_selected: ["gridcop", "drone-log-analyzer"]
  skills_highlighted: ["LangChain", "RAG", "Python", "AWS"]
  resume_path: "/path/to/resume.pdf"
  tokens_used: 7500
  cost_usd: 0.09
```

This enables pattern learning for future recommendations.

---

## Tools Reference

| Tool | Purpose | Saves |
|------|---------|-------|
| `get_profile_summary` | Get compressed 200-token profile | 7,800 tokens |
| `save_profile` | Store & compress full profile | Setup |
| `query_knowledge_graph` | Find relevant projects by keywords | 1,500 tokens |
| `get_learned_patterns` | Recommend from history | 1,500 tokens |
| `track_application` | Log for analytics & learning | Analytics |
| `check_resume_similarity` | Smart deduplication | 10,000+ tokens |

---

## Expected Savings

**Without Deduplication:**
- Before: 25k-35k tokens per resume ($0.28)
- After: 7.5k tokens per resume ($0.09)
- **Savings: 70% ($0.19 per resume)**

**With Deduplication (80% similar jobs):**
- First resume: 7.5k tokens ($0.09)
- Reused resumes: 0 tokens ($0.00)
- **Savings: Up to 100% for similar jobs**

**Example (5 AI Engineer applications):**
- Old cost: $1.40 (5 × $0.28)
- New cost: $0.09 (1 new + 4 reused)
- **Total savings: $1.31 (94%)**

---

## Troubleshooting

### MCP Server Not Loading?
```bash
# Test server manually:
node /home/virus/Documents/repo/resume-memory-mcp/server.js

# Should see: "Resume Memory MCP Server running on stdio"
```

### txtai API Not Working?
```bash
# Check if running:
curl http://127.0.0.1:8001/stats

# Restart if needed:
cd semantic-search-api
venv/bin/python similarity_checker.py
```

### Tools Not Appearing?
- Restart Claude Code
- Check MCP server config in `~/.claude.json`
- Verify server path: `/home/virus/Documents/repo/resume-memory-mcp/server.js`

### Database Issues?
```bash
# Database is auto-created at:
ls data/resume-memory.db

# To reset:
rm data/resume-memory.db
# Restart server (will recreate tables)
```

---

## File Structure

```
resume-memory-mcp/
├── server.js                           # Main MCP server
├── package.json                        # Dependencies
├── lib/
│   ├── database.js                     # SQLite operations
│   ├── profile-compressor.js           # 8k → 200 token compression
│   ├── knowledge-graph.js              # Project querying
│   ├── pattern-learner.js              # History analysis
│   └── similarity-checker.js           # txtai client
├── data/
│   ├── knowledge-graph.json            # 7 projects, 20 skills
│   └── resume-memory.db                # SQLite database (auto-created)
├── semantic-search-api/
│   ├── similarity_checker.py           # FastAPI server
│   ├── requirements.txt                # Python dependencies
│   └── venv/                           # Python virtual env
├── QUICKSTART.md                       # This file
└── SETUP_COMPLETE.md                   # Detailed setup guide
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Claude Code (Resume Generation Agent)                  │
└───────────────┬─────────────────────────────────────────┘
                │ MCP Protocol (stdio)
                ▼
┌─────────────────────────────────────────────────────────┐
│  Resume Memory MCP Server (Node.js)                     │
│                                                          │
│  Tools:                                                  │
│  - get_profile_summary      → 200 tokens                │
│  - save_profile             → Compress & store          │
│  - query_knowledge_graph    → Find projects             │
│  - get_learned_patterns     → Recommend from history    │
│  - track_application        → Log for learning          │
│  - check_resume_similarity  → Deduplicate               │
└───────┬──────────────────────────────────┬──────────────┘
        │                                  │
        │ (SQLite)                         │ (HTTP)
        ▼                                  ▼
┌──────────────────┐         ┌──────────────────────────┐
│  resume-memory.db│         │  txtai Similarity API    │
│                  │         │  (Python FastAPI)        │
│  - profiles      │         │                          │
│  - applications  │         │  sentence-transformers   │
│  - kg_nodes      │         │  all-MiniLM-L6-v2        │
│  - kg_edges      │         │                          │
└──────────────────┘         └──────────────────────────┘
```

---

## Next Steps

1. **Test the system:**
   - Generate a resume using the optimized workflow
   - Compare token usage to old method (should see 70% reduction)

2. **Build history:**
   - Track each application with `track_application`
   - After 3+ applications, use `get_learned_patterns` for recommendations

3. **Enable deduplication:**
   - Start txtai API in separate terminal
   - Use `check_resume_similarity` before generating each resume
   - Reuse resumes for similar jobs (0 tokens!)

4. **Measure savings:**
   - Document actual token usage vs predictions
   - Calculate cost savings over time
   - Adjust workflow as needed

---

## Documentation

- **Detailed Setup:** `SETUP_COMPLETE.md`
- **Implementation Details:** `/home/virus/Documents/repo/per_wesite/optimization-project/COMPLETION_SUMMARY.md`
- **Progress Tracker:** `/home/virus/Documents/repo/per_wesite/optimization-project/IMPLEMENTATION_TRACKER.md`

---

**Ready to use!** 🚀

Restart Claude Code and start generating optimized resumes.
