# Resume Generation Optimization - Master Implementation Plan

**Version:** 1.0
**Last Updated:** 2025-11-04
**For:** Junior developers with LLM assistance

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Choices](#technology-choices)
3. [Phase 1: Quick Wins](#phase-1-quick-wins-week-1)
4. [Phase 2: Memory & Knowledge Graph](#phase-2-memory--knowledge-graph-week-2-3)
5. [Phase 3: Learning System](#phase-3-learning-system-week-4)
6. [Testing Strategy](#testing-strategy)
7. [Deployment & Rollback](#deployment--rollback)

---

## Overview

### The Problem

Current system loads **16,500 cached tokens** for every resume generation:
- Profile context: 8,000 tokens (loaded EVERY time)
- Baseline resume: 2,500 tokens (includes metadata + locked content)
- Format rules: 2,000 tokens
- Agent instructions: 4,000 tokens

**Total cost per resume:** $0.20-0.30 (25k-35k tokens)

### The Solution

Three-phase optimization:

| Phase | What We're Doing | Token Savings | Time | Cost After |
|-------|------------------|---------------|------|------------|
| **Phase 1** | Split files, use templates, smart loading | 2,000 tokens | 2-3 days | $0.16 |
| **Phase 2** | Persistent memory + knowledge graph | 8,000 tokens | 5-7 days | $0.06 |
| **Phase 3** | Learn from past resumes | 2,000 tokens | 2-3 days | $0.05 |

**Final result:** 70% cost reduction + 50% faster generation

### Success Metrics

- [ ] Token usage: 25k → 7.5k (70% reduction)
- [ ] Generation time: 10 min → 5 min
- [ ] Quality maintained (same interview callback rate)
- [ ] No regressions (human review still works)

---

## Technology Choices

### Why We Picked These Tools

| Need | Tool | Why This One? | What We Rejected |
|------|------|---------------|------------------|
| **MCP Server** | Node.js + `@modelcontextprotocol/sdk` | Official SDK, well-documented | Python (slower for I/O) |
| **Database** | SQLite (`better-sqlite3`) | Zero-config, file-based, SQL queries | JSON files (no queries), Postgres (overkill) |
| **Vector Search** | txtai (Python) | 2 lines to start, combines vector + graph | Chroma (heavier), pgvector (needs Postgres) |
| **Templates** | Micromustache | 3x faster, 400 LOC, zero deps | Handlebars (overkill), lodash (extra dep) |
| **Knowledge Graph** | Custom JSON + txtai | Simple, portable, semantic search | Neo4j (too heavy), NetworkX (no persistence) |

### What You'll Install

**For Node.js MCP servers:**
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "better-sqlite3": "^11.0.0",
    "micromustache": "^8.0.4"
  }
}
```

**For Python semantic search (Phase 2 only):**
```
txtai>=7.0.0
fastapi>=0.115.0
uvicorn>=0.32.0
```

---

## Phase 1: Quick Wins (Week 1)

**Timeline:** 2-3 days
**Savings:** 2,000 tokens (20% reduction)
**Difficulty:** ⭐ Easy

### What We're Building

```
BEFORE:
- baseline-resume-data.json (2,500 tokens)
  ├── Metadata/comments (800 tokens)
  ├── Format rules (400 tokens)
  └── Resume data with full locked content (1,300 tokens)

AFTER:
- baseline-resume-rules.md (1,000 tokens, CACHED)
- baseline-resume-data-minimal.json (600 tokens)
- content-references.json (locked content, NOT sent to LLM)
```

### Task 1.1: Split Baseline into Rules + Data (2 hours)

**Goal:** Separate cacheable rules from resume data

**Step-by-step:**

1. **Create new files:**
```bash
cd job-prep/applications/_resources/
touch baseline-resume-rules.md
touch baseline-resume-data-minimal.json
touch content-references.json
```

2. **Extract rules to markdown:**
```bash
# Open baseline-resume-data.json
# Copy all lines starting with "_comment", "_meta", "_LOCKED"
# Paste into baseline-resume-rules.md
# Format as readable markdown (use headings, lists)
```

Example output (`baseline-resume-rules.md`):
```markdown
# Resume Format Rules

## Locked Content (NEVER Modify)
- Lumenier bullets 1-2: Match LinkedIn exactly
- York bullets 1-2: Match LinkedIn exactly
- Freefly bullets 2-4: Show career progression

## Work Experience Bullets
- Pattern: 3-4-2-2 (Grid: 3, Freefly: 4, Lumenier: 2, York: 2)
- Total: 11 bullets

## Projects
- Count: 3 projects
- Format: Problem / Solution / Impact (3 bullets each)

## Dates
- Format: MM/YYYY (not "Mar 2025")
- NEVER change employment dates
```

3. **Extract locked content to references:**
```json
// content-references.json
{
  "lumenier": [
    "Wrote embedded code in C++ to integrate LiDAR and optical flow sensors for obstacle avoidance and position holding with/without GPS under various lighting conditions",
    "Collaborated with open-source flight control software maintainers for integration, testing, and deployment of autonomous flight algorithms, prototyped innovative features like toss-to-launch for product roadmap development"
  ],
  "york": [
    "Developed prototype software for in-house autonomous surveillance mobile robots using ROS2, SLAM, and computer vision technologies",
    "Built Human Machine Interface for Universal Robot welding applications using Python and Kivy framework, implemented multi-robot control systems with platform independence"
  ],
  "freefly_locked": [
    "Contributed to drone platform codebases implementing new features and optimizations for flight control systems and payload integration across multiple product lines, managed software integration projects from planning through release",
    "Led release management for drone platforms overseeing testing phases from alpha through production deployment, coordinating firmware updates and executing comprehensive testing protocols with cross-functional teams",
    "Built automated systems to process complex technical data and identify system failures, developing knowledge base enhancements and support tools that streamlined operations"
  ]
}
```

4. **Create minimal baseline:**
```json
// baseline-resume-data-minimal.json
{
  "selectedTemplate": 1,
  "basics": {
    "name": "Viresh Duvvuri",
    "summary": "AI Engineer specializing in...",
    "email": "vireshduvvuri@gmail.com",
    "phone": "+1-509-964-5469",
    "website": "linkedin.com/in/viresh-duvvuri",
    "location": { "address": "Seattle, WA" }
  },
  "work": [
    {
      "company": "Grid CoOperator",
      "position": "AI Engineer",
      "location": "Seattle, WA",
      "startDate": "Mar 2025",
      "endDate": "Present",
      "highlights": [
        "Led design and deployment of domain-specific agentic AI agents...",
        "Architected AI orchestration system...",
        "Deployed production AI system..."
      ]
    },
    {
      "company": "Freefly Systems",
      "position": "Senior Software Engineer",
      "location": "Woodinville, WA",
      "startDate": "Nov 2021",
      "endDate": "Oct 2025",
      "highlights": [
        "[CUSTOMIZABLE - AI tool bullet]",
        "{{freefly_locked.0}}",
        "{{freefly_locked.1}}",
        "{{freefly_locked.2}}"
      ]
    },
    {
      "company": "Lumenier",
      "highlights_ref": "lumenier"
    },
    {
      "company": "York Exponential",
      "highlights_ref": "york"
    }
  ],
  "skills": [ ... ],
  "projects": [ ... ],
  "education": [ ... ]
}
```

**Token savings:** 900 tokens

---

### Task 1.2: Template-Based Locked Content (4 hours)

**Goal:** Replace full locked bullet text with `{{template-id}}`, expand at PDF generation

**Step-by-step:**

1. **Install template engine:**
```bash
cd /home/virus/Documents/repo/resumake-mcp/
npm install micromustache
```

2. **Create template registry:**
```javascript
// lib/locked-templates.js
export const LOCKED_TEMPLATES = {
  "lumenier.0": "Wrote embedded code in C++ to integrate LiDAR...",
  "lumenier.1": "Collaborated with open-source flight control...",
  "york.0": "Developed prototype software for in-house autonomous...",
  "york.1": "Built Human Machine Interface for Universal Robot...",
  "freefly_locked.0": "Contributed to drone platform codebases...",
  "freefly_locked.1": "Led release management for drone platforms...",
  "freefly_locked.2": "Built automated systems to process complex technical data..."
};
```

3. **Create expander function:**
```javascript
// lib/template-expander.js
import render from 'micromustache';
import { LOCKED_TEMPLATES } from './locked-templates.js';

export function expandTemplates(resumeData) {
  const data = JSON.parse(JSON.stringify(resumeData));

  if (data.work) {
    for (const job of data.work) {
      // Handle highlights_ref shorthand
      if (job.highlights_ref) {
        const refKey = job.highlights_ref;
        job.highlights = [
          `{{${refKey}.0}}`,
          `{{${refKey}.1}}`
        ];
        delete job.highlights_ref;
      }

      // Expand template placeholders
      if (job.highlights) {
        job.highlights = job.highlights.map(bullet => {
          if (typeof bullet === 'string' && bullet.includes('{{')) {
            // Extract template key from {{key}}
            const match = bullet.match(/\{\{(.+?)\}\}/);
            if (match) {
              const key = match[1];
              return LOCKED_TEMPLATES[key] || bullet;
            }
          }
          return bullet;
        });
      }
    }
  }

  return data;
}
```

4. **Integrate into PDF pipeline:**
```javascript
// server.js (in generateResume function)
import { expandTemplates } from './lib/template-expander.js';

async generateResume({ resumeData, filename, folderPath }) {
  // NEW: Expand templates before generating LaTeX
  const expandedData = expandTemplates(resumeData);

  const latexCode = generateLatex(expandedData);
  const pdfBuffer = await compilePDF(latexCode);

  // ... save PDF
}
```

5. **Test:**
```javascript
// tests/template-expander.test.js
import { test } from 'vitest';
import { expandTemplates } from '../lib/template-expander.js';

test('expands template references', () => {
  const input = {
    work: [{
      company: "Lumenier",
      highlights_ref: "lumenier"
    }]
  };

  const output = expandTemplates(input);

  expect(output.work[0].highlights[0]).toContain("Wrote embedded code");
  expect(output.work[0].highlights[1]).toContain("Collaborated with");
});
```

**Token savings:** 425 tokens

---

### Task 1.3: Job-Aware Context Loading (1 day)

**Goal:** Load only relevant content based on job type

**Step-by-step:**

1. **Create role classifier:**
```javascript
// job-prep/applications/_resources/role-classifier.js

export const ROLE_PATTERNS = {
  "AI Engineer": {
    keywords: ["langchain", "rag", "llm", "multi-agent", "genai", "mlops"],
    projects: ["GridCOP", "Production System Tool", "AI Travel Planner"],
    companies: ["Grid CoOperator", "Freefly Systems"],
    skip_companies: ["Lumenier", "York Exponential"]
  },
  "Robotics Engineer": {
    keywords: ["ros", "px4", "slam", "embedded", "c++", "lidar", "drone"],
    projects: ["Flight Control", "Production System Tool"],
    companies: ["Freefly Systems", "Lumenier", "York Exponential"],
    skip_companies: []
  },
  "Full-Stack Engineer": {
    keywords: ["react", "api", "backend", "frontend", "database"],
    projects: ["Production System Tool", "GridCOP"],
    companies: ["Grid CoOperator", "Freefly Systems"],
    skip_companies: ["Lumenier", "York Exponential"]
  }
};

export function classifyRole(jobDescription) {
  const text = jobDescription.toLowerCase();
  const scores = {};

  for (const [roleType, config] of Object.entries(ROLE_PATTERNS)) {
    scores[roleType] = config.keywords.filter(kw => text.includes(kw)).length;
  }

  return Object.entries(scores)
    .reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
}

export function filterContent(roleType, baselineData) {
  const pattern = ROLE_PATTERNS[roleType];

  return {
    ...baselineData,
    work: baselineData.work.filter(job =>
      !pattern.skip_companies.includes(job.company)
    ),
    projects: baselineData.projects.filter(proj =>
      pattern.projects.some(name => proj.name.includes(name))
    )
  };
}
```

2. **Update workflow:**
```markdown
<!-- .claude/agents/resume-agent.md -->

## Step 0.5: Classify Job Type (NEW)

Before loading baseline:

1. Read job description
2. Count keyword matches:
   - "langchain", "rag", "llm" → AI Engineer
   - "ros", "px4", "embedded" → Robotics Engineer
   - "react", "api", "backend" → Full-Stack Engineer
3. Filter baseline content by role type

Example:
Job: "Senior AI Engineer - LangChain, RAG, multi-agent"
→ Classification: "AI Engineer"
→ Skip: Lumenier, York companies
→ Include: GridCOP, Production Tool, AI Travel Planner
```

**Token savings:** 770 tokens

---

### Phase 1 Summary

**Total savings:** ~2,000 tokens (20% reduction)
**New cost:** $0.20 → $0.16 per resume
**Files created:**
- `baseline-resume-rules.md`
- `baseline-resume-data-minimal.json`
- `content-references.json`
- `role-classifier.js`
- `template-expander.js`

**Testing checklist:**
- [ ] Baseline validation passes
- [ ] Templates expand correctly
- [ ] Role classifier works for all 3 types
- [ ] PDF generation still works
- [ ] Generated resume looks identical to before

---

## Phase 2: Memory & Knowledge Graph (Week 2-3)

**Timeline:** 5-7 days
**Savings:** 8,000 tokens (70% total reduction)
**Difficulty:** ⭐⭐⭐ Moderate

### What We're Building

A new MCP server that stores profile data once and returns compressed summaries:

```
┌─────────────────────────────┐
│  Resume Memory MCP Server   │
│                             │
│  Tools:                     │
│  - get_profile_summary()    │  Returns 200 tokens (vs 8,000)
│  - query_knowledge_graph()  │  Returns only relevant content
│  - expand_references()      │  Expands template IDs
│                             │
│  Storage:                   │
│  - SQLite (profile, apps)   │
│  - JSON (knowledge graph)   │
│  - txtai (semantic search)  │
└─────────────────────────────┘
```

### Task 2.1: Setup Memory MCP Server (1 day)

**Step-by-step:**

1. **Create project:**
```bash
mkdir -p /home/virus/Documents/repo/resume-memory-mcp/{lib,data,tests}
cd /home/virus/Documents/repo/resume-memory-mcp/
npm init -y
npm install @modelcontextprotocol/sdk better-sqlite3
```

2. **Create base server:**
```javascript
// server.js
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ProfileStore } from "./lib/profile-store.js";

class ResumeMemoryServer {
  constructor() {
    this.server = new Server({
      name: "resume-memory",
      version: "1.0.0",
    }, {
      capabilities: { tools: {} },
    });

    this.profileStore = new ProfileStore("./data/memory.db");
    this.setupToolHandlers();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_profile_summary",
          description: "Get compressed profile summary (200 tokens)",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "store_profile",
          description: "Store full profile (one-time setup)",
          inputSchema: {
            type: "object",
            properties: {
              fullContext: { type: "string" },
            },
            required: ["fullContext"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "get_profile_summary":
          return await this.getProfileSummary();
        case "store_profile":
          return await this.storeProfile(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async getProfileSummary() {
    const summary = await this.profileStore.getCompressedSummary();
    return {
      content: [{ type: "text", text: summary }],
    };
  }

  async storeProfile({ fullContext }) {
    const result = await this.profileStore.setProfile(fullContext);
    return {
      content: [{
        type: "text",
        text: `Profile stored. Compressed summary (${result.summary.length} chars):\n\n${result.summary}`,
      }],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Resume Memory MCP server running on stdio");
  }
}

const server = new ResumeMemoryServer();
server.run().catch(console.error);
```

3. **Create profile store:**
```javascript
// lib/profile-store.js
import Database from "better-sqlite3";

export class ProfileStore {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  initDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY,
        full_context TEXT NOT NULL,
        compressed_summary TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async setProfile(fullContext) {
    // Generate compressed summary (hardcoded for now, LLM in production)
    const compressed = this.compressProfile(fullContext);

    this.db.prepare(`
      INSERT OR REPLACE INTO profile (id, full_context, compressed_summary)
      VALUES (1, ?, ?)
    `).run(fullContext, compressed);

    return { summary: compressed };
  }

  async getCompressedSummary() {
    const row = this.db.prepare("SELECT compressed_summary FROM profile WHERE id = 1").get();

    if (!row) {
      throw new Error("Profile not initialized. Run store_profile first.");
    }

    return row.compressed_summary;
  }

  compressProfile(fullContext) {
    // Hardcoded compression (replace with LLM call in production)
    return "Viresh Duvvuri: 5y SWE, 2y AI/ML. MS CS WSU. Grid CoOperator (current): multi-agent AI for smart grid (LangChain, MCP, AWS, 70% efficiency gain). Freefly (4y): GenAI log analysis (Ollama, 200+ daily users). Lumenier: embedded C++/LiDAR. York: ROS2 autonomous robots. Expertise: Agentic AI, RAG, production deployment.";
  }
}
```

4. **Register with Claude Code:**
```bash
# Edit .claude.json
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

5. **Test:**
```bash
# Start server
node server.js
# Should output: "Resume Memory MCP server running on stdio"

# Test in Claude Code
# User: "Use resume-memory server to store my profile"
# User: "Get profile summary from memory server"
```

**Token savings:** 7,700 tokens (profile: 8,000 → 300)

---

### Task 2.2: Build Knowledge Graph (2 days)

**Goal:** Query-able resume structure with semantic search

**Step-by-step:**

1. **Create knowledge graph structure:**
```json
// data/knowledge-graph.json
{
  "nodes": {
    "companies": [
      {
        "id": "grid-cooperator",
        "name": "Grid CoOperator",
        "role": "AI Engineer",
        "duration": "Mar 2025 - Present",
        "keywords": ["langchain", "multi-agent", "aws", "rag"]
      },
      {
        "id": "freefly",
        "name": "Freefly Systems",
        "role": "Senior Software Engineer",
        "duration": "Nov 2021 - Oct 2025",
        "keywords": ["genai", "ollama", "python", "drone"]
      }
    ],
    "projects": [
      {
        "id": "gridcop",
        "name": "GridCOP: Smart Grid Analytics Agent",
        "technologies": ["LangChain", "MCP", "AWS", "RAG", "FAISS"],
        "impact": "70% workflow reduction",
        "role_fit": ["AI Engineer", "Full-Stack Engineer"]
      },
      {
        "id": "production-tool",
        "name": "Production System Optimization Tool",
        "technologies": ["React", "Python", "Flask", "Ollama", "Llama"],
        "impact": "200+ daily queries",
        "role_fit": ["AI Engineer", "Full-Stack Engineer"]
      },
      {
        "id": "flight-control",
        "name": "PX4 Flight Control Systems",
        "technologies": ["C++", "PX4", "Embedded", "Real-time"],
        "impact": "Real-time control systems",
        "role_fit": ["Robotics Engineer"]
      }
    ],
    "skills": [
      {
        "id": "langchain",
        "name": "LangChain",
        "category": "AI/ML Frameworks",
        "proficiency": "expert",
        "projects": ["gridcop"]
      }
    ]
  },
  "edges": [
    { "from": "gridcop", "to": "langchain", "type": "uses" },
    { "from": "grid-cooperator", "to": "gridcop", "type": "contains" }
  ]
}
```

2. **Create knowledge graph module:**
```javascript
// lib/knowledge-graph.js
import fs from 'fs/promises';

export class KnowledgeGraph {
  constructor(graphPath) {
    this.graphPath = graphPath;
    this.graph = null;
  }

  async load() {
    const data = await fs.readFile(this.graphPath, 'utf-8');
    this.graph = JSON.parse(data);
  }

  async query(query, roleType, limit = 5) {
    if (!this.graph) await this.load();

    // Simple keyword matching (upgrade to txtai in production)
    const keywords = query.toLowerCase().split(' ');

    // Score projects by keyword matches
    const projects = this.graph.nodes.projects
      .filter(p => !roleType || p.role_fit.includes(roleType))
      .map(p => ({
        ...p,
        score: keywords.filter(kw =>
          p.technologies.some(t => t.toLowerCase().includes(kw)) ||
          p.name.toLowerCase().includes(kw)
        ).length
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return projects;
  }
}
```

3. **Add to MCP server:**
```javascript
// server.js (add to constructor)
this.knowledgeGraph = new KnowledgeGraph("./data/knowledge-graph.json");

// Add tool
{
  name: "query_knowledge_graph",
  description: "Query resume knowledge graph for relevant content",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      role_type: { type: "string" },
      limit: { type: "number", default: 3 }
    },
    required: ["query"]
  }
}

// Add handler
async queryKnowledgeGraph({ query, role_type, limit = 3 }) {
  const results = await this.knowledgeGraph.query(query, role_type, limit);
  return {
    content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
  };
}
```

**Token savings:** 1,500 tokens (load only relevant projects)

---

### Task 2.3: Setup Semantic Search (1 day - Optional)

**Goal:** Upgrade keyword matching to semantic search using txtai

**Step-by-step:**

1. **Install txtai:**
```bash
pip install txtai fastapi uvicorn
```

2. **Create semantic search API:**
```python
# semantic-search-api/main.py
from fastapi import FastAPI
from txtai.embeddings import Embeddings
import json

app = FastAPI()
embeddings = Embeddings()

# Load resume data
with open("../data/knowledge-graph.json") as f:
    data = json.load(f)

# Index projects
projects = data["nodes"]["projects"]
documents = [
    {
        "id": p["id"],
        "text": f"{p['name']} {' '.join(p['technologies'])} {p['impact']}"
    }
    for p in projects
]

embeddings.index([(doc["id"], doc["text"], None) for doc in documents])

@app.post("/search")
def search(query: str, limit: int = 3):
    results = embeddings.search(query, limit)
    return [{"id": r[0], "score": r[1]} for r in results]

# Run: uvicorn main:app --port 8001
```

3. **Integrate with knowledge graph:**
```javascript
// lib/knowledge-graph.js (upgrade query method)
async query(query, roleType, limit = 5) {
  // Use semantic search API if available
  try {
    const response = await fetch('http://localhost:8001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit })
    });

    const results = await response.json();
    return results.map(r => this.graph.nodes.projects.find(p => p.id === r.id));
  } catch (e) {
    // Fallback to keyword matching
    return this.keywordQuery(query, roleType, limit);
  }
}
```

**Token savings:** Additional 500 tokens (better relevance)

---

### Phase 2 Summary

**Total savings:** ~8,000 tokens (70% total reduction)
**New cost:** $0.20 → $0.06 per resume
**New servers:**
- `resume-memory-mcp` (Node.js)
- `semantic-search-api` (Python, optional)

**Testing checklist:**
- [ ] Memory server starts correctly
- [ ] Profile compression works
- [ ] Knowledge graph queries return relevant results
- [ ] Semantic search API works (if enabled)
- [ ] Integration with resume workflow

---

## Phase 3: Learning System (Week 4)

**Timeline:** 2-3 days
**Savings:** 2,000 tokens (75% total reduction)
**Difficulty:** ⭐⭐ Moderate

### What We're Building

System that learns from past applications and pre-populates common patterns.

### Task 3.1: Application History Tracking (1 day)

**Step-by-step:**

1. **Add to database schema:**
```javascript
// lib/database.js (add to initDatabase)
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company TEXT,
    role_type TEXT,
    job_keywords TEXT,
    summary_used TEXT,
    projects_selected TEXT,
    skills_order TEXT,
    fit_score INTEGER,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
```

2. **Add tracking tool:**
```javascript
// Add to MCP server
{
  name: "track_application",
  description: "Record application for learning",
  inputSchema: {
    type: "object",
    properties: {
      company: { type: "string" },
      role_type: { type: "string" },
      projects: { type: "array", items: { type: "string" } },
      fit_score: { type: "number" }
    },
    required: ["company", "role_type"]
  }
}
```

3. **Track on every resume generation:**
```markdown
<!-- Update .claude/agents/resume-agent.md -->

## Step 6: Track Application (NEW)

After PDF generation:

1. Call `track_application` with:
   - Company name
   - Role type (AI Engineer / Robotics / Full-Stack)
   - Projects selected
   - Fit score

This builds learning database for future optimization.
```

**Token savings:** 500 tokens (from learning patterns)

---

### Task 3.2: Pattern Learning (1 day)

**Step-by-step:**

1. **Create pattern analyzer:**
```javascript
// lib/pattern-learner.js
export class PatternLearner {
  constructor(db) {
    this.db = db;
  }

  async getPatterns(roleType) {
    const apps = this.db.prepare(`
      SELECT * FROM applications
      WHERE role_type = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).all(roleType);

    if (apps.length < 3) return null; // Not enough data

    // Analyze common projects
    const projectFreq = {};
    for (const app of apps) {
      const projects = JSON.parse(app.projects_selected);
      for (const proj of projects) {
        projectFreq[proj] = (projectFreq[proj] || 0) + 1;
      }
    }

    return {
      role_type: roleType,
      common_projects: Object.entries(projectFreq)
        .sort((a, b) => b[1] - a[1])
        .map(([name, freq]) => ({ name, frequency: freq / apps.length })),
      sample_count: apps.length
    };
  }
}
```

2. **Add to MCP server:**
```javascript
{
  name: "get_learned_patterns",
  description: "Get learned patterns for a role type",
  inputSchema: {
    type: "object",
    properties: {
      role_type: { type: "string" }
    },
    required: ["role_type"]
  }
}
```

3. **Use patterns in workflow:**
```markdown
<!-- Update resume-agent.md -->

## Step 1.5: Check Learned Patterns (NEW)

After classifying role type:

1. Query `get_learned_patterns(role_type)`
2. If patterns exist:
   - Pre-select common projects (>80% frequency)
   - Use common skills order
   - Use common summary template
3. Only customize DEVIATIONS from pattern

This reduces LLM thinking time and token usage.
```

**Token savings:** 1,500 tokens (pre-populate from patterns)

---

### Task 3.3: Smart Resume Deduplication (1 day)

**Goal:** Reuse existing resumes for similar roles without calling Claude

**Why this matters:** If you apply to 10 similar "AI Engineer" roles, you shouldn't generate 10 resumes. This saves 50-70% additional tokens by reusing when appropriate.

**Step-by-step:**

1. **Update database schema to track applications:**
```javascript
// lib/database.js (add to initDatabase)
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    role_type TEXT,
    job_requirements TEXT,
    projects_selected TEXT,
    skills_highlighted TEXT,
    resume_path TEXT,
    resume_reused BOOLEAN DEFAULT 0,
    reused_from TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost_usd REAL,
    application_date TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT,
    similarity_score REAL
  );

  CREATE INDEX IF NOT EXISTS idx_role_type_date
    ON applications(role_type, application_date);
`);
```

2. **Setup txtai for local semantic similarity (zero-token checks):**
```bash
# Install txtai (one-time setup)
pip install txtai

# Create semantic-search-api directory
mkdir -p semantic-search-api
cd semantic-search-api
```

3. **Create local similarity checker:**
```python
# semantic-search-api/similarity_checker.py
from txtai.embeddings import Embeddings
import json

class SimilarityChecker:
    def __init__(self):
        # Use lightweight sentence transformer (80MB)
        self.embeddings = Embeddings({
            "path": "sentence-transformers/all-MiniLM-L6-v2",
            "content": True
        })
        self.indexed_applications = []

    def index_applications(self, applications):
        """Index past applications for similarity search"""
        documents = []
        for app in applications:
            doc_text = f"{app['role']} {app['role_type']} {app['job_requirements']}"
            documents.append((app['id'], doc_text, None))

        self.embeddings.index(documents)
        self.indexed_applications = applications

    def find_similar(self, job_posting, role_type, threshold=0.85):
        """Find similar past applications (local, 0 tokens!)"""
        # Create search query
        query = f"{role_type} {job_posting['requirements']}"

        # Search (runs locally, ~50ms)
        results = self.embeddings.search(query, limit=5)

        # Filter by threshold
        for app_id, score in results:
            if score >= threshold:
                app = next(a for a in self.indexed_applications if a['id'] == app_id)
                return {
                    "should_reuse": True,
                    "existing_resume": app['resume_path'],
                    "company": app['company'],
                    "role": app['role'],
                    "similarity_score": score,
                    "tokens_saved": 7500
                }

        return {
            "should_reuse": False,
            "reason": f"No similar role found (threshold: {threshold})"
        }
```

4. **Create FastAPI server for similarity checks:**
```python
# semantic-search-api/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from similarity_checker import SimilarityChecker
import sqlite3
import json

app = FastAPI()
checker = SimilarityChecker()

class JobPosting(BaseModel):
    requirements: str
    role_type: str
    company: str

@app.on_event("startup")
def load_applications():
    """Load past applications from database"""
    db = sqlite3.connect("../resume-memory-mcp/data/memory.db")
    cursor = db.execute("""
        SELECT id, company, role, role_type, job_requirements, resume_path
        FROM applications
        WHERE application_date > date('now', '-90 days')
        ORDER BY application_date DESC
    """)

    applications = [
        {
            "id": row[0],
            "company": row[1],
            "role": row[2],
            "role_type": row[3],
            "job_requirements": row[4],
            "resume_path": row[5]
        }
        for row in cursor.fetchall()
    ]

    checker.index_applications(applications)
    print(f"Indexed {len(applications)} past applications")

@app.post("/check_similarity")
def check_similarity(job_posting: JobPosting):
    """Check if similar resume exists (0 tokens used!)"""
    result = checker.find_similar(
        {"requirements": job_posting.requirements},
        job_posting.role_type,
        threshold=0.85
    )
    return result

# Run: uvicorn main:app --port 8002 --reload
```

5. **Add MCP tool for similarity check:**
```javascript
// resume-memory-mcp/server.js (add tool)
{
  name: "check_resume_similarity",
  description: "Check if similar resume exists (zero-token, local search)",
  inputSchema: {
    type: "object",
    properties: {
      job_requirements: { type: "string" },
      role_type: { type: "string" },
      company: { type: "string" }
    },
    required: ["job_requirements", "role_type", "company"]
  }
}

// Add handler
async checkResumeSimilarity({ job_requirements, role_type, company }) {
  try {
    // Call local similarity API (zero tokens!)
    const response = await fetch('http://localhost:8002/check_similarity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requirements: job_requirements,
        role_type,
        company
      })
    });

    const result = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  } catch (e) {
    // If similarity API not running, always generate new
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          should_reuse: false,
          reason: "Similarity API not available"
        })
      }]
    };
  }
}
```

6. **Update resume generation workflow:**
```markdown
<!-- Update .claude/commands/apply.md -->

## Step 0: Check for Similar Resumes (NEW - ZERO TOKENS!)

Before generating a new resume:

1. Extract job requirements from posting
2. Classify role type (AI Engineer, Robotics, etc.)
3. Call `check_resume_similarity`:
   - Input: job requirements, role type, company
   - Output: { should_reuse: true/false, existing_resume: path, similarity_score }
   - **Cost: 0 tokens** (runs locally via txtai)

4. If `should_reuse: true`:
   ```bash
   # Copy existing resume
   cp {existing_resume} applications/{company-role}/resume.pdf

   # Track reuse
   track_application({
     company: ...,
     role_type: ...,
     resume_reused: true,
     reused_from: {similar_company},
     tokens_used: 0,
     cost_usd: 0
   })

   # DONE! Skip resume generation
   ```

5. If `should_reuse: false`:
   - Proceed with normal resume generation (Steps 1-6)
   - Cost: 7,500 tokens ($0.09)

## User Experience

When similar resume found:
```
✅ Found similar resume!
   - Previously applied to: Google (AI Engineer)
   - Similarity: 88%
   - Applied: 2024-10-28 (7 days ago)

Would you like to:
1. Reuse Google resume (saves $0.09, instant)
2. Generate new resume (customize for PepsiCo)

Your choice: _
```
```

7. **Start similarity API (add to deployment):**
```bash
# In semantic-search-api/
uvicorn main:app --port 8002 --reload

# Runs in background, provides zero-token similarity checks
```

8. **Test the deduplication:**
```bash
# Test 1: Apply to first AI Engineer role
claude apply Google-AI-Engineer
# Expected: Generates new resume (7,500 tokens)

# Test 2: Apply to second similar AI Engineer role
claude apply Meta-AI-Engineer
# Expected: Detects similarity, offers reuse (0 tokens!)

# Test 3: Apply to different role type
claude apply Northrop-Robotics-Engineer
# Expected: Generates new resume (7,500 tokens)

# Verify token savings
grep "tokens_used" resume-memory-mcp/data/memory.db
```

**How it works:**
1. txtai runs **locally** (no API calls, no tokens)
2. Similarity check takes ~50-100ms
3. If 85%+ similar to past application → reuse resume
4. If not similar → generate new resume
5. Track everything in database for analytics

**Token savings:** 7,500 tokens per reused resume (50-70% reduction for multiple similar roles)

**Cost:**
- Similarity check: **$0** (local txtai)
- Resume reuse: **$0** (just copy file)
- Resume generation: **$0.09** (only when needed)

**Example savings:**
- 10 AI Engineer applications:
  - Without deduplication: 10 × $0.09 = **$0.90**
  - With deduplication: 1 × $0.09 + 9 × $0 = **$0.09** (90% savings!)

---

### Phase 3 Summary

**Total savings:** ~2,000 tokens (75% total reduction)
**With deduplication:** Up to 90% savings for similar roles
**Final cost:**
- New resume: $0.05
- Reused resume: $0.00 (zero tokens!)

**New features:**
- Application tracking
- Pattern learning
- Smart pre-population
- **Smart resume deduplication (zero-token similarity checks)**

**Testing checklist:**
- [ ] Applications tracked correctly
- [ ] Patterns learned after 3+ applications
- [ ] Pre-population works
- [ ] Similarity API running (txtai)
- [ ] Deduplication works (test with 2 similar roles)
- [ ] Quality maintained

---

## Testing Strategy

### Unit Tests

```bash
# Phase 1
npm test -- tests/template-expander.test.js
npm test -- tests/role-classifier.test.js

# Phase 2
npm test -- tests/profile-store.test.js
npm test -- tests/knowledge-graph.test.js

# Phase 3
npm test -- tests/pattern-learner.test.js
```

### Integration Tests

```bash
# End-to-end resume generation
# BEFORE optimization
time claude-code "/apply [job-description]"
# Record: token usage, generation time

# AFTER optimization
time claude-code "/apply [job-description]"
# Verify: 70% token reduction, same quality
```

### Quality Validation

**Checklist for every optimization:**
- [ ] Generated PDF looks identical to before
- [ ] All locked bullets present and correct
- [ ] Work experience bullets: 3-4-2-2 pattern
- [ ] Projects: 3 projects × 3 bullets each
- [ ] No formatting errors
- [ ] Human review checkpoint still works

---

## Deployment & Rollback

### Deployment Steps

1. **Phase 1:**
```bash
# Backup current files
cp job-prep/applications/_resources/baseline-resume-data.json baseline-resume-data.json.backup

# Deploy phase 1 changes
git add phase-1/
git commit -m "Phase 1: Quick wins optimization"
git push
```

2. **Phase 2:**
```bash
# Start memory server
cd resume-memory-mcp
npm start

# Update .claude.json
# Test with one resume
# Deploy if successful
```

3. **Phase 3:**
```bash
# Enable tracking
# Generate 3-5 resumes
# Verify patterns learned
# Enable pattern-based optimization
```

### Rollback Plan

If optimization causes issues:

1. **Phase 1 rollback:**
```bash
git revert <commit-hash>
mv baseline-resume-data.json.backup baseline-resume-data.json
```

2. **Phase 2 rollback:**
```bash
# Remove resume-memory from .claude.json
# Restart Claude Code
# Use old workflow
```

3. **Phase 3 rollback:**
```bash
# Disable pattern learning in resume-agent.md
# Continue using memory server without patterns
```

### Success Criteria

- [ ] 70% token reduction achieved
- [ ] Generation time reduced by 50%
- [ ] No quality regression
- [ ] All tests passing
- [ ] Documentation updated

---

## Next Steps

1. **Review this plan thoroughly**
2. **Read `docs/tool-selection.md`** (understand why each tool)
3. **Start Phase 1:** `cd phase-1 && cat README.md`
4. **Ask questions before implementing** (use LLM to clarify)

---

**Last Updated:** 2025-11-04
**Version:** 1.0
**Status:** Ready for implementation
