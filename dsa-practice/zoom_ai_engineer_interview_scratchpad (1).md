# ZOOM AI ENGINEER - INTERVIEW SCRATCHPAD
## 60 Min Technical Interview | Tomorrow
---

# INTERVIEW STRUCTURE
- First 30 min → Project Deep Dive with David + Agentic AI Technical Questions
- Last 30 min  → LeetCode Medium Coding Questions
- Format       → Live coding, shared editor or screen share
- Language     → Python (preferred for AI roles)

### What the recruiter told us David will focus on:
  → Frameworks (LangChain, LangGraph, MCP)
  → Memory (short-term, long-term, how you implemented it)
  → Context management (state, context windows, tool results)
  → Multi-agent systems (orchestration, communication, task decomposition)
  → How it works in production (deployment, debugging, monitoring)

---
---

# PART 1A: PROJECT DEEP DIVE — GridCOP (★★★ HIGHEST PRIORITY ★★★)
## David WILL ask you to walk through this. Prepare to go deep.
## Every question below → answer with YOUR actual implementation details.

---

## YOUR STACK (know this cold before you walk in)

```
GridCOP Architecture:
─────────────────────────────────────────────────────
  User Query
      │
      ▼
  LangGraph Orchestrator          ← stateful graph, nodes + edges
      │
      ├── SQL Query Agent          ← generates & validates SQL against PostgreSQL
      ├── Web Context Agent        ← gathers real-time context / web research
      ├── Data Validator           ← checks query results for correctness
      ├── Insight Generator        ← synthesizes findings into analysis
      └── Report Writer            ← produces final stakeholder reports
              │
              ▼
  MCP Server (custom, Python)     ← Model Context Protocol
      │
      ├── Tool: test_connection    ← validates DB connectivity
      ├── Tool: get_historic_data  ← pulls outage records by date range
      └── Tool: get_data_summary   ← aggregates stats from outage tables
              │
              ▼
  PostgreSQL Database             ← historical outages + predictions tables
─────────────────────────────────────────────────────
```

---

## QUESTION CLUSTER 1: ARCHITECTURE & TOOL CHOICES
### "Walk me through your architecture. Why did you choose X over Y?"

**Q: Walk me through GridCOP. How is it structured and why?**
→ START with the PROBLEM, not the tools:
   "Analysts were spending hours manually querying a database and cross-referencing
   web sources to understand outage patterns. I needed a system that could do
   multi-step research autonomously — query data, validate it, pull context,
   synthesize, and generate reports."
→ That problem has specific requirements:
   • Multiple steps that depend on each other (can't just fire one query)
   • Error recovery (what if a query returns bad data? Don't crash — adapt)
   • State that persists across steps (later steps need what earlier ones found)
   • Conditional flow (which step runs next depends on what the previous one returned)
→ A linear pipeline (step 1 → 2 → 3) breaks if step 2 fails.
   What I needed was a GRAPH — nodes for each capability, edges that route
   based on outcomes. I used LangGraph because it gives me stateful graph
   execution with built-in checkpointing out of the box.

**Q: Why did you build a custom tool layer instead of letting the LLM query the DB directly?**
→ START with the principle:
   "If you give an LLM raw access to a database, it has to know the exact schema,
   write correct SQL every time, and handle edge cases itself. That's fragile —
   LLMs hallucinate column names, get syntax wrong, miss NULLs."
→ The pattern: ABSTRACT data access behind well-defined tools with clear
   input/output contracts. The LLM calls a tool by name ("get_historic_data"),
   passes simple parameters ("date range"), gets back clean structured data.
   The SQL complexity is hidden inside the tool.
→ I used MCP (Model Context Protocol) as the standard — it's the protocol for
   agent-to-tool communication. Built 3 custom tools, each validates inputs,
   handles errors internally, returns structured JSON.

**Q: How do the tools actually connect to the database?**
→ Async connection pooling (asyncpg) so multiple agents can hit PostgreSQL
   concurrently without blocking each other.
→ Tools return structured JSON — not raw rows. Pre-aggregated where possible.
   This keeps the LLM context small and the responses predictable.

---

## QUESTION CLUSTER 2: MEMORY
### "How does your system remember things? Walk me through memory architecture."

**Q: How did you handle memory in GridCOP?**
→ START with the concept:
   "Memory in an agent system is really two separate problems:
   short-term = what's happening RIGHT NOW in this request.
   long-term = what the system knows from BEFORE this request."
→ Short-term: I track the current execution state — which steps have run,
   what data they returned, what's still pending. This lives in memory for
   the duration of one request. It's how agents hand off to each other
   without losing context. (Implemented as the graph's state object.)
→ Long-term: The PostgreSQL database IS the long-term memory. Historical
   outage records, past predictions — agents query this when they need
   knowledge that predates the current session.
→ TRADEOFF I made consciously: no vector database. The outage data is
   structured and well-indexed — SQL with proper filters is faster and
   more precise than semantic search for this data. But if the data were
   unstructured (incident free-text reports, for example), I'd add a vector
   store and do hybrid retrieval — keyword + semantic.

**Q: How do you prevent agents from re-doing work or going in loops?**
→ The concept: any multi-step system needs a way to say "this has already
   been done, don't do it again." That's essentially a call log or execution cache.
→ In GridCOP: the shared state tracks which tools have been called and what
   they returned. Before an agent acts, it checks: "has this data already been
   fetched?" If yes, use the cached result. If no, call the tool.
→ This does two things: prevents redundant API/DB calls (latency), and
   prevents infinite loops where agents keep requesting the same data.

---

## QUESTION CLUSTER 3: CONTEXT MANAGEMENT
### "How do you manage context across a multi-step workflow?"

**Q: How do you prevent context window overflow with multiple agents?**
→ START with the problem:
   "Context window is a finite resource. Every token you put in there is a
   design decision. If you dump everything — full conversation history, raw DB
   results, all agent outputs — you burn through the window fast, slow down
   inference, and bury the signal in noise."
→ The solution is SCOPING. Each agent only sees what it actually needs:
   • The SQL agent sees the user query + the DB schema. Nothing else.
   • The insight generator sees the validated query results. Not the raw SQL.
   • The report writer sees the synthesized insights. Not the raw data.
→ This is the same principle as access control in software — least privilege,
   but for context. Each component gets the minimum context to do its job.
→ In GridCOP, I also kept tool responses compact by design. The MCP tools
   return pre-aggregated structured JSON, not raw table dumps. Small footprint
   in context = more room for reasoning.

**Q: What is context engineering and why does it matter more than prompt engineering for agents?**
→ Prompt engineering = crafting the instruction text to get good outputs.
   Context engineering = deciding WHAT information the LLM sees, in WHAT ORDER,
   and HOW MUCH of it. For a single chatbot, prompt engineering is enough.
   For an agent that's making multi-step decisions and calling tools?
   Context engineering is everything — it determines whether the agent
   even has the right information to reason correctly.
→ Ordering matters: attention models weight earlier tokens more heavily.
   Put the most relevant, actionable info first. Put background last.
→ In GridCOP: tool results are injected as clean structured data right before
   the decision point. Prompt templates are tight — no filler text.

---

## QUESTION CLUSTER 4: MULTI-AGENT SYSTEMS
### "How do your agents communicate? How do you handle failures?"

**Q: How is orchestration done? Who decides which agent runs next?**
→ START with the pattern, not the tool:
   "There are a few ways to orchestrate agents. Centralized: one router
   decides everything — clean, easy to reason about, but single point of
   failure. Decentralized: agents route directly to each other — more
   resilient, but harder to debug. Hub-and-spoke: a central orchestrator
   coordinates, but agents don't talk to each other directly."
→ GridCOP uses hub-and-spoke. One orchestrator evaluates the current state
   after each step and decides what runs next. If the data query succeeded,
   it routes to validation. If validation fails, it routes back to retry.
   Agents are specialists — they don't need to know about each other.
→ The routing logic is conditional: it's not a fixed sequence. The orchestrator
   looks at outcomes and chooses the next step. That's what makes it adaptive
   rather than just a pipeline.

**Q: How do agents share information?**
→ Concept first: there are three main patterns for agent communication.
   • Shared memory (blackboard pattern): all agents read/write to a common state.
     Simple, but can get messy if agents clobber each other's data.
   • Direct messaging: agents send messages to each other. More explicit,
     but creates tight coupling.
   • Orchestrator-mediated: agents only talk to the router. Router passes
     relevant info along. Clean separation of concerns.
→ GridCOP uses the orchestrator-mediated approach. Agents write their outputs
   to shared state, but the orchestrator decides what each agent actually sees.
   This means agents are loosely coupled — you can swap one out without
   breaking the others.

**Q: How do you handle a failing agent? What if the SQL query is bad?**
→ Concept: fault tolerance in agent systems is the same problem as in any
   distributed system — you need retry logic, fallbacks, and graceful degradation.
   But agents add a layer: the LLM itself can REASON about the failure and
   suggest a fix, which you can't do with a regular microservice.
→ In GridCOP: if the SQL agent produces a bad query, the validator catches it.
   Instead of crashing, the orchestrator routes to a retry — the validator's
   feedback goes back as context so the SQL agent can self-correct.
→ Retry has a cap (max 3 attempts, exponential backoff). If it still fails,
   graceful degradation: return what you have with a note that full analysis
   couldn't complete. Never silently fail.
→ Everything is logged with a full trace — every decision, every tool call,
   every error. You need that for debugging.

---

## QUESTION CLUSTER 5: PRODUCTION & DEBUGGING
### "How did you deploy this? How do you debug when things go wrong?"

**Q: How is GridCOP deployed?**
→ Python Flask backend serves the API. MCP server runs as a persistent
   service alongside it. PostgreSQL for the database layer with async
   connection pooling (asyncpg) for concurrency.
→ State persistence: if a request gets interrupted mid-pipeline, the
   execution state is checkpointed so it can resume instead of restarting
   from scratch. Same concept as transaction logs in a database.

**Q: How do you debug an agent system? What's different from debugging normal software?**
→ START with the general problem:
   "Normal software debugging: you look at logs, stack traces, error messages.
   Agent systems add a layer: you need to see the LLM's REASONING — what it
   was thinking when it made a bad tool call, or why it hallucinated."
→ The answer is TRACING. Every step in the pipeline gets logged:
   • What was the input to each agent?
   • What tool did it call, with what parameters?
   • What did the tool return?
   • What did the LLM output based on that?
   • How long did each step take?
→ This is the same concept as distributed tracing (OpenTelemetry) — a
   single request ID that flows through every component. Tools like
   LangSmith do this specifically for LLM pipelines.
→ In GridCOP: I validated the MCP server independently first (each tool
   with known inputs, known expected outputs). Then tested each agent node
   in isolation. Then integration-tested the full pipeline end-to-end.
   Layered testing, same as any production system.

**Q: What would you change if you were scaling this to 10,000 users?**
→ Think like a systems engineer, not just an AI engineer:
   • DB: connection pool limits + request queuing. PostgreSQL doesn't scale
     to unlimited concurrent connections.
   • Caching: get_data_summary doesn't change every second — cache it with
     a TTL. Don't hit the DB for every request.
   • LLM calls: rate limiting. API-based LLMs have quotas. Queue requests
     and shed load gracefully under pressure.
   • Monitoring: latency and error rate PER AGENT NODE. If the SQL agent
     starts timing out, you want to know before users do.
   • Deployment: move to a serverless or container-based backend so you
     can scale horizontally without managing servers.

---
---

# PART 1B: PROJECT DEEP DIVE — Drone Log Analysis Tool
## Secondary project. David may ask you to compare approaches.

---

## YOUR STACK

```
Drone Log Tool:
─────────────────────────────────────────────────
  Flight .ulog files
      │
      ▼
  uLog Parser (Python)            ← extracts sensor data, timestamps, errors
      │
      ▼
  Llama 3.2 via Ollama            ← LOCAL LLM (no API cost, privacy)
      │
      ▼
  Python Flask Backend            ← API layer
      │
      ▼
  React Frontend                  ← interactive chat UI for pilots
      │
      ├── Real-time log analysis
      ├── 11+ health category checks (ESC, GPS, position, yaw, etc.)
      └── Automated crash diagnosis reports
─────────────────────────────────────────────────
```

## KEY TALKING POINTS (contrast with GridCOP)

- **Single agent vs multi-agent**: Drone tool = single LLM doing analysis.
  GridCOP = multi-agent orchestration. Show you understand WHEN to use each.
  "Drone logs have a fixed schema and well-defined checks — one agent is enough.
   Smart grid analysis requires cross-referencing multiple data sources and
   iterative reasoning — that's when you go multi-agent."

- **Local LLM vs API LLM**: Ollama/Llama 3.2 runs locally — zero latency on
  network calls, no cost per token, full data privacy (flight logs stay on-prem).
  GridCOP uses API-based LLMs for stronger reasoning on ambiguous queries.

- **Structured output**: Built a JSON schema so the LLM produces consistently
  parseable reports instead of free-form text. This is a general principle in
  production agent systems — if downstream code needs to consume the output,
  you enforce a schema. Predictability over flexibility.

---
---

# PART 1C: AGENTIC AI TECHNICAL QUESTIONS
## Questions David may ask BEYOND your project — general depth check

---

## Frameworks & Tools (know the CONCEPTS, mention tools as examples)

- What are the different patterns for agent orchestration?
  (centralized router, decentralized peer-to-peer, hub-and-spoke, hierarchical)
- What is the difference between a pipeline and a graph in agent architecture?
  When does each break down?
- What is a tool / function call in the context of LLMs? How does the LLM
  "decide" to call a tool? (function calling under the hood)
- What is MCP? What problem does it solve that raw function calling doesn't?
- What is the ReAct pattern? (Reason → Act → Observe loop)
- Name agent frameworks you know. What tradeoffs do they make?
  (LangGraph = stateful graphs. CrewAI = role-based agents. AutoGen = multi-agent conversation.)

## Memory Architecture (the concepts, not the implementations)

- What are the different types of memory an agent can have?
  (session/short-term, episodic, semantic, long-term/persistent)
- When do you use a vector DB vs a relational DB for agent memory?
  (structured + exact lookup → relational. Unstructured + semantic search → vector.)
- How do you prevent an agent from losing context mid-task?
- What is the tradeoff between storing everything in memory vs keeping it lean?

## Context Management (the hard problem)

- Why is context engineering more important than prompt engineering for agents?
- How do you handle context window limits in a multi-step workflow?
  (scoping, summarization gates, structured tool responses, pruning)
- What is structured output? Why does it matter when agents are calling tools?
- How do you decide WHAT goes into an agent's context and what stays out?

## Multi-Agent Systems (patterns, not framework features)

- What are the main orchestration patterns? Tradeoffs of each?
- What is task decomposition? When is it useful? When is it overkill?
- How do agents communicate — shared state, direct messages, or via an orchestrator?
  What are the tradeoffs?
- How do you prevent agents from hallucinating tool calls or going in loops?
- What is the difference between a single powerful agent vs multiple specialized agents?

## Production & Reliability (systems thinking)

- How do you observe what's happening inside an agent pipeline?
  (tracing, logging, request IDs that flow through every step)
- How do you evaluate an agent's performance? What metrics matter?
  (task completion rate, latency, tool call accuracy, hallucination rate, user satisfaction)
- What are guardrails? How do you prevent an agent from taking harmful actions?
- What is HITL (Human-in-the-Loop)? When is it necessary vs when can you automate?
- How do you handle LLM hallucinations when the agent is taking REAL actions
  (not just generating text)?

---
---

# PART 1D: LLM & RAG FUNDAMENTALS (backup — if David pivots here)

---

- Transformer architecture: encoder vs decoder. Self-attention (Q, K, V).
- GPT (decoder-only) vs BERT (encoder-only) vs T5 (both).
- Tokenization, BPE, positional encoding.
- Temperature, top-k, top-p decoding strategies.
- Hallucination: causes + mitigations (RAG, CoT, fact-checking).
- RAG pipeline: chunking → embedding → vector search → re-ranking → generation.
- Vector DBs: FAISS, Pinecone, Weaviate, ChromaDB.
- Hybrid search: BM25 (keyword) + vector (semantic) combined.
- Fine-tuning vs RAG vs prompt engineering — when to use which.
- LoRA, RLHF, zero-shot vs few-shot vs in-context learning.

---
---

# PART 1E: CONNECT YOUR WORK TO ZOOM (do this in the interview!)

- Zoom AI Companion = real-time meeting summaries, transcription, live Q&A
  → Your GridCOP agents do real-time data analysis and report generation.
     Same pattern: ingest data → reason → produce structured output.
- Zoom cares about latency → you used async patterns, connection pooling,
  scoped context to keep things fast.
- Zoom GenAI team = production AI, not research → you shipped GridCOP,
  not just prototyped it. You debugged it. You validated MCP with tests.

---
---

# PART 2: CODING QUESTIONS (Last 30 Min)
## LeetCode Medium Style — What Zoom has asked before + high probability
## (This section is unchanged — same priority list as before)

---

## 2A. HIGHEST PRIORITY (Asked at Zoom — confirmed from Glassdoor/guides)

1.  Two Sum
2.  Valid Parentheses
3.  Merge Intervals
4.  Maximum Subarray (Kadane's)
5.  Search in Rotated Sorted Array
6.  Find First and Last Position (Search Range)
7.  LRU Cache
8.  Word Break
9.  Copy List with Random Pointer
10. Longest Substring Without Repeating Characters

---

## 2B. ARRAYS & STRINGS (Core pattern — always tested)

11. Best Time to Buy and Sell Stock
12. Container With Most Water
13. 3Sum
14. Product of Array Except Self
15. Group Anagrams
16. Move Zeros
17. Rotate Array
18. Find the Duplicate Number
19. Subarray Sum Equals K
20. Longest Palindromic Substring

---

## 2C. TREES & GRAPHS (Zoom asks tree questions heavily)

21. Invert Binary Tree
22. Binary Tree Right Side View
23. Binary Tree Level Order Traversal
24. Maximum Depth of Binary Tree
25. Lowest Common Ancestor of BST
26. Validate Binary Search Tree
27. Number of Islands
28. Course Schedule (Topological Sort)
29. Clone Graph
30. Word Ladder

---

## 2D. LINKED LISTS

31. Reverse Linked List
32. Merge Two Sorted Lists
33. Detect Cycle in Linked List
34. Remove Nth Node From End of List
35. Add Two Numbers

---

## 2E. DYNAMIC PROGRAMMING

36. Climbing Stairs
37. House Robber
38. Coin Change
39. Longest Increasing Subsequence
40. Word Break (DP version)
41. Unique Paths
42. Decode Ways

---

## 2F. STACKS & QUEUES

43. Min Stack
44. Evaluate Reverse Polish Notation
45. Daily Temperatures
46. Sliding Window Maximum

---

## 2G. BINARY SEARCH (Zoom tests this pattern)

47. Binary Search (basic)
48. Search Insert Position
49. Find Minimum in Rotated Sorted Array
50. Koko Eating Bananas
51. Capacity to Ship Packages Within D Days

---

## 2H. HASH MAPS & SETS

52. Contains Duplicate
53. Intersection of Two Arrays
54. Top K Frequent Elements
55. Anagram Groups

---

## 2I. AI/ML SPECIFIC CODING (May come up for AI role)
### (Common in ML engineer interviews at tech companies)

56. Implement cosine similarity from scratch
57. Implement KNN classifier from scratch
58. Implement basic tokenizer (split text into tokens)
59. Implement a simple Trie (useful for autocomplete — relates to AI search)
60. Design a simple caching system (TTL-based)

---
---

# PART 3: QUICK CHEAT SHEET FOR TOMORROW

---

## Patterns to Recognize Instantly

| See This Keyword         | Think This Pattern          |
|--------------------------|-----------------------------|
| "subarray" / "substring" | Sliding window / Kadane's   |
| "sorted array"           | Binary search               |
| "pairs that sum to X"    | Two pointers / HashMap      |
| "first/last occurrence"  | Modified binary search      |
| "parentheses/brackets"   | Stack                       |
| "shortest path"          | BFS                         |
| "all paths / connected"  | DFS                         |
| "top K"                  | Heap / sorting              |
| "repeated/duplicate"     | HashMap / Set               |
| "design a cache"         | HashMap + Doubly Linked List|

---

## Time Complexity Quick Reference

```
O(1)       → HashMap get/set, array index
O(log n)   → Binary search, heap push/pop
O(n)       → Single pass, BFS/DFS on linear structure
O(n log n) → Sorting, heap-based operations
O(n²)      → Nested loops, brute force (avoid in interview)
```

---

## Interview Execution (30 sec reminder)

1. READ the problem fully. Repeat it back.
2. ASK clarifying questions (edge cases, constraints).
3. THINK out loud — brute force first, then optimize.
4. CODE cleanly with meaningful variable names.
5. TEST with 2-3 examples (include edge cases).
6. STATE time and space complexity.

---

## If You Get Stuck

- Say: "Let me think about the brute force approach first..."
- Say: "I think a HashMap could work here because..."
- Say: "Can I get a hint on the expected approach?"
- DO NOT go silent for more than 2 minutes.

---
---

# REFERENCES

[1] Glassdoor - Zoom ML Engineer Interview Questions
    https://www.glassdoor.com/Interview/Zoom-Video-Communications-Machine-Learning-Engineer-Interview-Questions-EI_IE924644.0,25_KO26,51.htm

[2] Glassdoor - Zoom Software Engineer Interview Questions
    https://www.glassdoor.com/Interview/Zoom-Communications-Software-Engineer-Interview-Questions-EI_IE924644.0,19_KO20,37.htm

[3] Interview Query - Zoom ML Engineer Interview Guide
    https://www.interviewquery.com/interview-guides/zoom-machine-learning-engineer

[4] Interview Kickstart - Zoom Interview Questions
    https://interviewkickstart.com/blogs/interview-questions/zoom-interview-questions

[5] CodingInterview.com - Zoom Coding Interview Questions (2025)
    https://www.codinginterview.com/guide/zoom-interview-questions/

[6] AlgoMonster - Zoom Interview Guide
    https://algo.monster/interview-guides/zoom

[7] GitHub - LLM Interview Questions (Google, Nvidia, Meta, Microsoft)
    https://github.com/llmgenai/LLMInterviewQuestions

[8] DataCamp - Top 36 LLM Interview Questions (2026)
    https://www.datacamp.com/blog/llm-interview-questions

[9] DataCamp - Top 30 RAG Interview Questions (2026)
    https://www.datacamp.com/blog/rag-interview-questions

[10] GitHub - Devinterview LLM Interview Questions
     https://github.com/Devinterview-io/llms-interview-questions

[11] AlgoDaily - Zoom Interview Questions
     https://algodaily.com/companies/zoom

[12] LeetCode Discuss - Zoom SDE-2 Interview Experience
     https://leetcode.com/discuss/interview-experience/3518828/Zoom-Meeting-or-SDE-2-or-Remote

[13] ProjectPro - 50 Agentic AI Interview Questions
     https://www.projectpro.io/article/agentic-ai-interview-questions-and-answers/1127

[14] GeeksforGeeks - Top Agentic AI Interview Questions
     https://www.geeksforgeeks.org/artificial-intelligence/top-agentic-ai-interview-questions-and-answers/

[15] Analytics Vidhya - Top 30 AI Agent Interview Questions
     https://www.analyticsvidhya.com/blog/2025/05/ai-agent-interview-questions/

[16] Elasticsearch Labs - Context Engineering for Agentic AI
     https://www.elastic.co/search-labs/blog/context-engineering-llm-evolution-agentic-ai

[17] Edureka - Top 50+ Agentic AI Interview Questions
     https://www.edureka.co/blog/agentic-ai-interview-questions/

[18] Medium - Design Patterns in Agentic AI Interview Q&A
     https://skphd.medium.com/design-patterns-in-agentic-ai-interview-questions-and-answers-6e77e4ca72e2
