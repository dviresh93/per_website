# Tool Selection Rationale

**Last Updated:** 2025-11-04

This document explains **why** we chose each open-source tool and library for the optimization project.

---

## Decision Framework

For each technology choice, we evaluated:

1. **Ease of Use:** Can a junior developer use it with LLM assistance?
2. **Performance:** Will it meet our 70% token reduction goal?
3. **Maturity:** Is it actively maintained (2025 updates)?
4. **Integration:** Does it work well with existing stack?
5. **Overhead:** Does it add unnecessary complexity?

---

## Core Technologies

### 1. MCP Server Runtime: **Node.js**

**Chosen:** Node.js + `@modelcontextprotocol/sdk`

**Why:**
- **Official SDK:** MCP is designed for Node.js (primary language)
- **Well-documented:** Extensive examples at modelcontextprotocol.io
- **Active community:** OpenAI adopted MCP in March 2025
- **Existing codebase:** Your resume-generator MCP is already Node.js
- **Performance:** Fast I/O for file operations and JSON handling

**Alternatives Considered:**
- **Python:** Slower for I/O operations, less mature MCP support
- **Rust:** Overkill for this use case, harder to debug

**Decision:** Node.js. Don't switch languages mid-project.

**Source:** [MCP Official Docs](https://modelcontextprotocol.io/examples)

---

### 2. Database: **SQLite**

**Chosen:** SQLite via `better-sqlite3`

**Why:**
- **Zero configuration:** Single file database (`memory.db`)
- **SQL queries:** Powerful for filtering/joining data
- **Built-in to Node:** `better-sqlite3` is the fastest Node.js SQLite library
- **Perfect for local dev:** No separate server to run
- **Portable:** Database is just a file, easy to backup/share

**Alternatives Considered:**
- **PostgreSQL:** Requires separate server, overkill for single-user
- **JSON files:** No SQL queries, harder to filter data
- **MongoDB:** Overkill, we don't need document flexibility

**Decision:** SQLite. Simple, fast, sufficient.

**Benchmark:** `better-sqlite3` is [3-10x faster](https://github.com/WiseLibs/better-sqlite3/wiki/Performance) than other Node.js SQLite libraries.

---

### 3. Vector Search: **txtai** (Python)

**Chosen:** txtai

**Why:**
- **All-in-one:** Vector search + graph + relational in one library
- **Low footprint:** "Get started in 2 lines of code"
- **Semantic search built-in:** Embeddings + similarity search
- **LLM-focused:** Designed specifically for knowledge bases
- **Active development:** 2025 updates, 9k+ GitHub stars

**Alternatives Considered:**
- **Chroma:** Heavier, requires separate server
- **pgvector:** Requires PostgreSQL (we're using SQLite)
- **FAISS:** Lower-level, more complex to use
- **Pinecone:** Paid service, cloud-only

**Decision:** txtai. Expose via simple REST API (FastAPI).

**Trade-off:** Adds Python dependency, but minimal (3 packages).

**Source:** [txtai GitHub](https://github.com/neuml/txtai)

---

### 4. Template Engine: **Micromustache**

**Chosen:** Micromustache

**Why:**
- **Fast:** 2-3x faster than Mustache, benchmarked
- **Tiny:** <400 lines of code, easy to audit
- **Zero dependencies:** No transitive vulnerabilities
- **Simple:** Perfect for `{{template-id}}` replacement
- **CSP-friendly:** Works in strict Content Security Policy environments

**Alternatives Considered:**
- **Handlebars:** Overkill (we don't need helpers, partials, etc.)
- **Mustache:** Slower, heavier
- **lodash.template:** Requires lodash as dependency
- **String.replace():** Manual, error-prone

**Decision:** Micromustache. Fast, simple, secure.

**Benchmark:** [2-3x faster than Mustache](https://github.com/alexewerlof/micromustache#performance)

**Source:** [Micromustache GitHub](https://github.com/alexewerlof/micromustache)

---

### 5. Knowledge Graph: **Custom JSON + txtai**

**Chosen:** Custom JSON structure + txtai for search

**Why:**
- **Simple:** JSON is human-readable, easy to edit
- **Portable:** Works everywhere, no vendor lock-in
- **Version control:** Git tracks changes to graph structure
- **Semantic search:** txtai adds embeddings for similarity queries
- **Flexible:** Easy to add new node/edge types

**Alternatives Considered:**
- **Neo4j:** Too heavy (separate server, JVM, complex queries)
- **NetworkX (Python):** No persistence, requires pickling
- **ArangoDB:** Multi-model, but overkill for our use case
- **Dgraph:** Separate server, complex setup

**Decision:** JSON + txtai. Start simple, upgrade later if needed.

**File Structure:**
```json
{
  "nodes": {
    "companies": [...],
    "projects": [...],
    "skills": [...]
  },
  "edges": [
    { "from": "project-id", "to": "skill-id", "type": "uses" }
  ]
}
```

**Source:** [WhyHow Knowledge Graph Studio](https://medium.com/enterprise-rag/open-sourcing-the-whyhow-knowledge-graph-studio-powered-by-nosql-edce283fb341) (inspiration)

---

### 6. Memory System: **Fork of MCP Memory Server**

**Chosen:** Official `@modelcontextprotocol/server-memory` as base

**Why:**
- **Reference implementation:** Official example from MCP team
- **Proven architecture:** Entities + Relations + Observations
- **Active voice relations:** Perfect for resume bullets
- **NPM package:** Easy to install and extend
- **Community support:** Used by thousands of developers

**How We're Extending It:**
- Add profile compression
- Add knowledge graph integration
- Add pattern learning
- Add content template expansion

**Alternatives Considered:**
- **Build from scratch:** Reinventing the wheel
- **LangChain memory:** Deprecated in v0.3.x, moved to LangGraph
- **LangGraph persistence:** Overkill, requires whole framework

**Decision:** Fork and extend official memory server.

**Source:** [MCP Memory Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)

---

## Supporting Technologies

### 7. LangChain/LangGraph: **NOT USED**

**Decision:** Don't use LangChain/LangGraph

**Why:**
- **Overkill:** We're not building a complex agent system
- **Heavy:** Large dependency tree
- **Not needed:** MCP handles orchestration
- **Memory deprecated:** LangChain v0.3.x deprecated individual memory classes

**What we use instead:**
- **MCP SDK:** Lightweight orchestration
- **Custom logic:** Simple JavaScript functions
- **SQLite:** Persistent storage

**Source:** [LangChain Memory Migration Guide](https://python.langchain.com/docs/versions/migrating_memory/)

---

### 8. Testing: **Vitest** (not Jest)

**Chosen:** Vitest

**Why:**
- **Fast:** Faster than Jest for modern codebases
- **ESM-first:** Works with ES modules (our MCP servers use `import`)
- **Compatible:** Same API as Jest (easy migration)
- **2025 standard:** Most new projects use Vitest

**Alternatives Considered:**
- **Jest:** Slower, requires extra config for ESM
- **Mocha:** Requires more boilerplate
- **AVA:** Less popular, smaller ecosystem

**Decision:** Vitest. Fast, modern, compatible.

---

## Technology Matrix

| Component | Tool | Pros | Cons | Why Chosen |
|-----------|------|------|------|------------|
| **MCP Runtime** | Node.js | Official SDK, existing stack | - | No-brainer |
| **Database** | SQLite | Zero-config, SQL queries | Not distributed | Perfect for local dev |
| **Vector Search** | txtai | All-in-one, LLM-focused | Python dependency | Best semantic search |
| **Templates** | Micromustache | 3x faster, tiny, zero deps | Less features | Speed + simplicity |
| **Knowledge Graph** | JSON + txtai | Simple, portable, searchable | Manual structure | Start simple |
| **Memory** | MCP Memory (fork) | Official, proven | Need to extend | Build on solid foundation |
| **Testing** | Vitest | Fast, ESM-native | - | Modern standard |

---

## Dependency Footprint

### Node.js (resume-memory-mcp)
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",  // ~500KB
    "better-sqlite3": "^11.0.0",            // ~2MB (includes native binary)
    "micromustache": "^8.0.4"               // ~10KB
  },
  "devDependencies": {
    "vitest": "^2.0.0"                      // ~15MB (dev only)
  }
}
// Total runtime: ~2.5MB
```

### Python (semantic-search-api, optional)
```
txtai>=7.0.0        # ~50MB (includes transformers)
fastapi>=0.115.0    # ~5MB
uvicorn>=0.32.0     # ~2MB
# Total: ~57MB
```

**Trade-off:** Python adds 57MB for semantic search. Worth it for better relevance.

---

## Performance Characteristics

| Operation | Library | Speed | Notes |
|-----------|---------|-------|-------|
| Template expansion | Micromustache | **3x faster** than Mustache | Benchmarked |
| Database queries | better-sqlite3 | **10x faster** than node-sqlite3 | [Source](https://github.com/WiseLibs/better-sqlite3/wiki/Performance) |
| Vector search | txtai | **2-3 lines** to start | Optimized for LLMs |
| JSON parsing | Native JSON | **Instant** | Built-in |

---

## Future Upgrades

If the project grows, consider:

1. **PostgreSQL + pgvector:** If you need distributed database
2. **Neo4j:** If knowledge graph becomes very complex (>10k nodes)
3. **Chroma:** If you need advanced vector search features
4. **LangGraph:** If you add complex multi-agent workflows

**For now:** Stick with the choices above. They'll handle 100-1000 resumes easily.

---

## References

- [MCP Official Servers](https://github.com/modelcontextprotocol/servers)
- [txtai Documentation](https://neuml.github.io/txtai/)
- [Micromustache GitHub](https://github.com/alexewerlof/micromustache)
- [better-sqlite3 Performance](https://github.com/WiseLibs/better-sqlite3/wiki/Performance)
- [LangChain Memory Migration](https://python.langchain.com/docs/versions/migrating_memory/)

---

**Decision Date:** 2025-11-04
**Reviewers:** AI Engineer (expert analysis)
**Status:** Approved for implementation
