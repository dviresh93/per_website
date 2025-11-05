# System Architecture

**Last Updated:** 2025-11-04

This document describes the system architecture before and after optimization.

---

## Current Architecture (Pre-Optimization)

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code CLI                         │
│                                                             │
│  Every resume generation loads:                            │
│  - Profile context: 8,000 tokens                           │
│  - Baseline resume: 2,500 tokens                           │
│  - Format rules: 2,000 tokens                              │
│  - Agent instructions: 4,000 tokens                        │
│                                                             │
│  TOTAL INPUT: ~16,500 cached tokens + 8,500 new tokens     │
│  COST: $0.20-0.30 per resume                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Multi-step workflow
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Resume Generation Workflow                      │
│                                                             │
│  Step 1: Job Analysis (500 tokens in, 500 out)            │
│  Step 2: Draft Generation (15k tokens in, 2k out)         │
│  Step 3: Human Review (manual editing)                     │
│  Step 4: JSON Conversion (3k tokens in, 2k out)           │
│                                                             │
│  TOTAL: 3 LLM calls, ~18.5k input, ~4.5k output           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ resume-data.json with full text
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              MCP Resume Generator Server                     │
│                                                             │
│  - Receives: Full resume JSON (2,500 tokens worth)        │
│  - Converts: JSON → LaTeX (deterministic)                  │
│  - Calls: External API (latexresu.me)                     │
│  - Returns: PDF buffer                                     │
│                                                             │
│  NO LLM CALLS - Pure template processing                   │
└─────────────────────────────────────────────────────────────┘
```

### Problems

1. **Redundant Context:** Profile loaded 15+ times (120k tokens wasted)
2. **Full Baseline:** All metadata sent every time (800 tokens wasted)
3. **No Learning:** Each resume starts from scratch
4. **Locked Content:** Full text sent instead of references (460 tokens wasted)

---

## Target Architecture (Post-Optimization)

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code CLI                         │
│                                                             │
│  Loads only:                                               │
│  - Job description: 1,500 tokens (user input)             │
│  - Cached rules: 1,000 tokens (baseline-resume-rules.md)  │
│                                                             │
│  TOTAL INPUT: ~2,500 tokens (90% reduction!)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ First: Check similarity (0 tokens!)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│        Similarity Check API (txtai - LOCAL, 0 tokens)       │
│                                                             │
│  - Runs locally (no Claude calls!)                         │
│  - Checks past 90 days of applications                     │
│  - Semantic similarity: 85%+ threshold                     │
│  - Takes ~50-100ms                                         │
│                                                             │
│  IF similar resume found → Reuse (0 tokens, $0)           │
│  IF no match → Generate new (7.5k tokens, $0.09)          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ If new resume needed, queries memory
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Resume Memory MCP Server (NEW)                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Profile Store (SQLite)                            │   │
│  │  - Compressed summary: 200 tokens                  │   │
│  │  - Full context: 8,000 tokens (stored, not sent)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Knowledge Graph (JSON + txtai)                    │   │
│  │  - Nodes: companies, projects, skills             │   │
│  │  - Edges: relationships                            │   │
│  │  - Semantic search: Returns only relevant content  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pattern Learning (SQLite)                         │   │
│  │  - Application history                             │   │
│  │  - Common patterns per role type                   │   │
│  │  - Pre-population suggestions                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Tools Exposed:                                             │
│  - get_profile_summary() → 200 tokens                      │
│  - query_knowledge_graph(query, role) → relevant content   │
│  - get_learned_patterns(role) → common selections         │
│  - expand_references([ids]) → full text                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Compressed context
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Resume Generation Workflow                      │
│                                                             │
│  Step 0: Classify Role Type (500 tokens)                   │
│  Step 1: Query Memory Server (returns 800 tokens)         │
│  Step 2: Generate Draft (2k tokens in, 1.5k out)          │
│  Step 3: Human Review (manual editing)                     │
│  Step 4: JSON Conversion (1.5k tokens in, 1.5k out)       │
│                                                             │
│  TOTAL: 4 LLM calls, ~4k input, ~3k output (70% less!)    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ resume-data.json with {{template-id}}
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              MCP Resume Generator Server                     │
│                                                             │
│  - Receives: Minimal resume JSON with template refs        │
│  - Expands: {{template-id}} → full locked content         │
│  - Converts: JSON → LaTeX (deterministic)                  │
│  - Calls: External API (latexresu.me)                     │
│  - Returns: PDF buffer                                     │
│                                                             │
│  NO LLM CALLS - Pure template processing                   │
└─────────────────────────────────────────────────────────────┘
```

### Benefits

1. **Compressed Context:** Profile 8k → 200 tokens (97.5% reduction)
2. **Minimal Baseline:** Only data, no metadata (1,000 tokens saved)
3. **Smart Loading:** Only relevant content (770 tokens saved)
4. **Template Refs:** IDs instead of full text (425 tokens saved)
5. **Pattern Learning:** Pre-populate from history (1,500 tokens saved)

**Total Savings:** ~10,000 tokens per resume (70% reduction)

---

## Data Flow Diagrams

### Before Optimization

```
User provides job description
         ↓
Load full profile (8k tokens)
         +
Load full baseline (2.5k tokens)
         +
Load format rules (2k tokens)
         +
Load agent instructions (4k tokens)
         ↓
Send 16.5k tokens to LLM
         ↓
LLM generates draft (2k tokens)
         ↓
User reviews/edits
         ↓
Send another 3k tokens to LLM
         ↓
LLM generates JSON (2k tokens)
         ↓
Send full JSON to MCP server
         ↓
PDF generated
```

**Total LLM tokens:** ~25k

### After Optimization

```
User provides job description
         ↓
Classify role type (500 tokens)
         ↓
Query memory server:
  - get_profile_summary() → 200 tokens
  - query_knowledge_graph() → 600 tokens
  - get_learned_patterns() → 300 tokens
         ↓
Send 2k tokens to LLM (compressed!)
         ↓
LLM generates draft (1.5k tokens)
         ↓
User reviews/edits
         ↓
Send 1.5k tokens to LLM
         ↓
LLM generates JSON with template refs (1.5k tokens)
         ↓
MCP server expands templates
         ↓
PDF generated
```

**Total LLM tokens:** ~7.5k (70% reduction!)

---

## Component Interactions

### Memory Server Tools

```
┌─────────────────────────────────────────────────┐
│  Memory MCP Server Tools                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  check_resume_similarity(job_req, role, co)  NEW!│
│  ├─ Input: Job requirements, role type, company│
│  ├─ Output: { should_reuse, existing_resume }  │
│  ├─ Cost: 0 tokens (local txtai)               │
│  └─ Use: FIRST, before generating resume       │
│                                                 │
│  get_profile_summary()                          │
│  ├─ Input: None                                 │
│  ├─ Output: 200-token compressed summary        │
│  └─ Use: Every resume generation (Step 1)       │
│                                                 │
│  query_knowledge_graph(query, role, limit)      │
│  ├─ Input: "Find projects using LangChain"     │
│  ├─ Output: [GridCOP, AI Travel Planner, ...]  │
│  └─ Use: Project/company selection              │
│                                                 │
│  get_learned_patterns(role_type)                │
│  ├─ Input: "AI Engineer"                        │
│  ├─ Output: Common projects, skills order      │
│  └─ Use: Pre-population (after 3+ apps)        │
│                                                 │
│  expand_references([ids])                       │
│  ├─ Input: ["lumenier-1", "york-2"]            │
│  ├─ Output: Full bullet text                   │
│  └─ Use: PDF generation only                    │
│                                                 │
│  track_application(company, role, projects)     │
│  ├─ Input: Application metadata                 │
│  ├─ Output: Success confirmation                │
│  └─ Use: Build learning database                │
└─────────────────────────────────────────────────┘
```

### Resume Generator Tools

```
┌─────────────────────────────────────────────────┐
│  Resume Generator MCP Server Tools              │
├─────────────────────────────────────────────────┤
│                                                 │
│  generate_resume(resumeData, filename, folder)  │
│  ├─ Input: Resume JSON (may have {{refs}})     │
│  ├─ Step 1: Expand templates                   │
│  ├─ Step 2: Generate LaTeX                     │
│  ├─ Step 3: Call external API                  │
│  └─ Output: PDF buffer + file path             │
│                                                 │
│  create_folder(folderPath)                      │
│  list_folders(path)                             │
│  create_resume_template(templateNumber)         │
└─────────────────────────────────────────────────┘
```

---

## File Structure

### Before

```
job-prep/applications/_resources/
├── baseline-resume-data.json          # 2,500 tokens (metadata + data)
└── RESUME_CORE.md                     # 2,000 tokens (format standards)
```

### After

```
job-prep/applications/_resources/
├── baseline-resume-rules.md           # 1,000 tokens (CACHED)
├── baseline-resume-data-minimal.json  # 600 tokens (data only)
├── content-references.json            # Locked content (not sent to LLM)
└── role-classifier.js                 # Role type logic

resume-memory-mcp/
├── server.js                          # MCP server entry point
├── lib/
│   ├── profile-store.js              # Profile compression/retrieval
│   ├── knowledge-graph.js            # Graph queries
│   ├── pattern-learner.js            # Learning from history
│   └── database.js                   # SQLite schema
├── data/
│   ├── memory.db                     # SQLite database
│   └── knowledge-graph.json          # Graph structure
└── tests/

resumake-mcp/
├── server.js                          # Existing PDF generator
├── lib/
│   ├── template-expander.js          # NEW: Expand {{refs}}
│   ├── locked-templates.js           # NEW: Template registry
│   ├── latex-generator.js            # Existing
│   └── pdf-compiler.js               # Existing
└── tests/
```

---

## Deployment Architecture

### Development

```
Local Machine
├── Claude Code CLI
│   └── Loads: .claude.json (MCP server config)
│
├── Resume Memory MCP Server (Node.js)
│   ├── Port: stdio (via Claude Code)
│   └── Data: ./data/memory.db
│
├── Resume Generator MCP Server (Node.js)
│   ├── Port: stdio (via Claude Code)
│   └── Calls: https://latexresu.me/api/generate/resume
│
├── Semantic Search API (Python, optional)
│   ├── Port: localhost:8001
│   └── Data: Knowledge graph embeddings
│
└── Similarity Check API (Python, Phase 3)
    ├── Port: localhost:8002
    ├── Data: Application history embeddings (txtai)
    └── Purpose: Zero-token similarity checks for deduplication
```

### Configuration (.claude.json)

```json
{
  "mcpServers": {
    "resume-memory": {
      "type": "stdio",
      "command": "node",
      "args": ["/home/virus/Documents/repo/resume-memory-mcp/server.js"],
      "env": {}
    },
    "resume-generator": {
      "type": "stdio",
      "command": "node",
      "args": ["/home/virus/Documents/repo/resumake-mcp/server.js"],
      "env": {}
    }
  }
}
```

---

## Token Flow Analysis

### Scenario: Generate AI Engineer Resume for PepsiCo

**BEFORE (Current System):**
```
Step 1: Job Analysis
  Input:  Job description (1.5k) + Profile (8k) + Baseline (2.5k) = 12k
  Output: Job analysis (0.5k)

Step 2: Draft Generation
  Input:  Job analysis (0.5k) + Profile (8k) + Baseline (2.5k) + Rules (2k) = 13k
  Output: Resume draft markdown (2k)

Step 3: JSON Conversion
  Input:  Draft (2k) + Baseline (2.5k) = 4.5k
  Output: Resume JSON (2k)

TOTAL INPUT:  29.5k tokens
TOTAL OUTPUT: 4.5k tokens
TOTAL: 34k tokens → ~$0.28
```

**AFTER (Optimized System):**
```
Step 0: Role Classification
  Input:  Job description (1.5k)
  Output: "AI Engineer" (0.1k)

Step 1: Get Compressed Context
  Input:  Role type (0.1k)
  Output: Profile summary (0.2k) + Relevant projects (0.6k) + Patterns (0.3k) = 1.1k

Step 2: Draft Generation
  Input:  Job description (1.5k) + Compressed context (1.1k) + Rules (1k, cached) = 2.6k
  Output: Resume draft (1.5k)

Step 3: JSON Conversion
  Input:  Draft (1.5k)
  Output: Resume JSON with refs (1.5k)

TOTAL INPUT:  7.7k tokens
TOTAL OUTPUT: 3.1k tokens
TOTAL: 10.8k tokens → ~$0.09 (68% reduction!)
```

---

## Performance Characteristics

| Metric | Before | After (New) | After (Reused) | Improvement |
|--------|--------|-------------|----------------|-------------|
| Input Tokens | 29.5k | 7.7k | 0 | **74% (new) / 100% (reused)** |
| Output Tokens | 4.5k | 3.1k | 0 | 31% (new) / 100% (reused) |
| Total Tokens | 34k | 10.8k | 0 | **68% (new) / 100% (reused)** |
| Cost per Resume | $0.28 | $0.09 | $0.00 | **68% (new) / 100% (reused)** |
| Generation Time | ~10 min | ~5 min | ~5 sec | **50% (new) / 98% (reused)** |
| Cache Hit Rate | 65% | 90% | 100% | Better caching |
| Similarity Check | N/A | 0 tokens | 0 tokens | **Local txtai (50-100ms)** |

---

## Scalability

### Current Limits

- **Resumes per hour:** ~6 (with human review)
- **Token budget (200k/day):** ~6 resumes before hitting limit
- **Database size:** SQLite handles millions of rows
- **Knowledge graph:** JSON handles 100-1000 nodes easily

### Future Scaling

If you generate 1000+ resumes:
- **Database:** Migrate to PostgreSQL
- **Knowledge Graph:** Migrate to Neo4j
- **Vector Search:** Add dedicated Chroma instance
- **Caching:** Add Redis for distributed caching

**For now:** Current architecture handles 100-500 resumes easily.

---

## Security & Privacy

### Data Storage

- **Profile:** Stored locally in SQLite (`./data/memory.db`)
- **Applications:** Stored locally, never sent to cloud
- **Knowledge Graph:** JSON file, version-controlled

### External Calls

- **LaTeX API:** Only sends resume data (no personal profile)
- **MCP Servers:** Run locally, no network access

### Sensitive Data

- **Email/Phone:** Stored in SQLite, never cached in LLM
- **Work History:** Compressed summary sanitizes sensitive details
- **Locked Bullets:** Never sent to LLM (template expansion happens locally)

---

**Last Updated:** 2025-11-04
**Version:** 1.0
**Status:** Architecture approved for implementation
