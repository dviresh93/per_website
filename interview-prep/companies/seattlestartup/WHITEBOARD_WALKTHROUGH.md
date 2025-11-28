# RAG SYSTEM DESIGN - WHITEBOARD WALKTHROUGH
## How to Present This in 45 Minutes (Clean & Simple)

---

## 🎯 THE GOLDEN RULE

**Start with the simplest possible diagram, then add layers of complexity ONLY when asked.**

Don't vomit all the details upfront. Build it iteratively.

---

## STEP 1: CLARIFY (2 minutes)

**YOU SAY:**
> "Before I start designing, let me clarify a few things:
>
> 1. What scale are we targeting? (users, queries/day)
> 2. What types of documents? (text, images, tables)
> 3. Any specific requirements? (latency, compliance)
>
> I'll assume text documents, 100 users initially, scaling to 10K, with sub-second latency. Sound good?"

**WAIT FOR CONFIRMATION.** This shows you don't just jump into coding.

---

## STEP 2: DRAW THE CORE (5 minutes)

### **What You Draw:**

```
┌─────────┐
│  User   │  "How does X work?"
└────┬────┘
     │
     ▼
┌─────────────────────────────────────┐
│        RAG System                   │
│                                     │
│  1. Retrieve relevant docs          │
│  2. Send to LLM with context        │
│  3. Generate answer                 │
└─────────────────────────────────────┘
```

### **What You Say (30 seconds):**
> "At the highest level, a RAG system does 3 things:
> 1. Retrieve relevant documents based on the query
> 2. Pass those documents as context to an LLM
> 3. LLM generates an answer grounded in the retrieved docs
>
> This prevents hallucinations because the LLM only uses information from our knowledge base."

**PAUSE.** Make sure they're following.

---

## STEP 3: BREAK INTO TWO FLOWS (3 minutes)

### **What You Draw:**

```
OFFLINE (Ingestion)              ONLINE (Query)
═══════════════════              ══════════════

Documents                        User Query
    │                                 │
    ▼                                 ▼
Split into chunks                 Embed query
    │                                 │
    ▼                                 ▼
Embed chunks                      Search vectors
    │                                 │
    ▼                                 ▼
Store in Vector DB  ◄────────►   Retrieve top-k
                                      │
                                      ▼
                                   Send to LLM
                                      │
                                      ▼
                                   Response
```

### **What You Say (2 minutes):**
> "Let me separate this into two flows:
>
> **OFFLINE (Ingestion):**
> - We chunk documents into 500-1000 token pieces
> - Each chunk gets embedded into a vector (using OpenAI text-embedding-3)
> - Store embeddings in a vector database
>
> **ONLINE (Query):**
> - User query comes in
> - We embed it using the same model
> - Search vector DB for most similar chunks (top-5)
> - Send chunks + query to LLM (GPT-4o)
> - LLM generates an answer
>
> Latency is dominated by the LLM call, typically 1-2 seconds."

**STOP HERE.** Don't add more unless they ask.

---

## STEP 4: WAIT FOR QUESTIONS

At this point, the interviewer will ask ONE of these:

### **Question A: "How do you scale this?"**
→ Go to SCALING section below

### **Question B: "How do you prevent hallucinations?"**
→ Go to HALLUCINATION section below

### **Question C: "What about costs?"**
→ Go to COST section below

### **Question D: "Walk me through the components in detail"**
→ Go to COMPONENTS section below

---

# BRANCHING PATHS (Pick Based on Question)

---

## 🚀 SCALING SECTION

### **What You Add to the Diagram:**

```
         User Requests
              │
              ▼
      ┌──────────────┐
      │ Load Balancer│
      └──────────────┘
              │
      ┌───────┴────────┐
      ▼                ▼
  ┌─────┐          ┌─────┐
  │ Pod │          │ Pod │  ... (K8s Auto-scale)
  └─────┘          └─────┘
      │                │
      └───────┬────────┘
              ▼
      ┌──────────────┐
      │  Redis Cache │  ◄─── ADD THIS!
      └──────────────┘
              │
       Cache Miss?
              ▼
      ┌──────────────┐
      │  Vector DB   │
      │  (3 nodes)   │
      └──────────────┘
```

### **What You Say (2 minutes):**
> "Three main strategies:
>
> **1. Horizontal Scaling (Kubernetes)**
> - Deploy on K8s with auto-scaling
> - Start with 2 pods, scale to 20 based on CPU
> - Each pod can handle 100 req/sec
>
> **2. Caching (BIGGEST WIN)**
> - Add Redis for semantic caching
> - Hash the query embedding, cache the response
> - 40-60% cache hit rate = 10x cost reduction
> - Example: 'How do I reset password?' cached for 24 hours
>
> **3. Database Clustering**
> - Qdrant: 3-node cluster with replication
> - Handles 10M+ vectors, <50ms search latency
>
> This takes us from 100 users to 10K+ users."

**Draw the numbers on the side:**
```
Before: $150/mo, 2s latency
After:  $3K/mo, 200ms latency
Scale:  100x more queries for 20x cost
```

---

## 🛡️ HALLUCINATION SECTION

### **What You Add:**

```
Query → Retrieval → [FILTERS] → LLM → [CHECKS] → Response
                        │                  │
                        ▼                  ▼
                   Threshold         Citations
                   Hybrid Search     Confidence
```

### **What You Say (2 minutes):**
> "Hallucinations are critical. I'd implement 4 layers:
>
> **Layer 1: Better Retrieval**
> - Hybrid search: vector (semantic) + BM25 (keyword)
> - Catches exact matches like 'Q3 2024 revenue'
> - Re-rank top 20 → top 5 with Cohere
>
> **Layer 2: Similarity Threshold**
> - If best match score < 0.7 → return 'No info found'
> - Better to say 'I don't know' than hallucinate
>
> **Layer 3: Citation Enforcement**
> - Prompt: 'Cite every claim with [source_id]'
> - Post-process: verify citations exist
>
> **Layer 4: Confidence Scoring**
> - Ask LLM: 'Rate confidence 1-10'
> - If < 7, add disclaimer: 'Low confidence'
>
> Example: Query 'Our Mars plan' → No relevant docs → 'I don't have information on this topic' ✅"

---

## 💰 COST SECTION

### **What You Add:**

```
Query Flow:

Query → Classifier → ┌→ GPT-4o-mini (60%) $0.15/1M  ◄── CHEAP
                     │
                     ├→ GPT-4o (30%)      $2.50/1M
                     │
                     └→ GPT-4o (10%)      $2.50/1M  ◄── COMPLEX

Cache Check (Redis):
    ├→ HIT (50%)  → Return $0
    └→ MISS (50%) → LLM call
```

### **What You Say (2 minutes):**
> "Cost optimization is critical at scale. Three strategies:
>
> **1. Semantic Caching (40-60% savings)**
> - Cache common queries in Redis
> - 'How do I reset password?' → cache for 1 day
> - 50% hit rate = half the LLM calls gone
>
> **2. LLM Routing (70% savings)**
> - Simple queries → GPT-4o-mini (10x cheaper)
> - Complex → GPT-4o
> - Classifier: word count, keywords, or fine-tuned model
>
> **3. Prompt Caching**
> - OpenAI caches system prompts
> - 50% discount on repeated context
>
> **Concrete Example:**
> - Before: 100K queries × $0.01 = $1,000/mo
> - After caching: 50K × $0.01 = $500
> - After routing: 50K × $0.002 = $100
> - Total: $100/mo (90% reduction!)"

---

## 🔧 COMPONENTS SECTION

### **What You Draw (Clean Boxes):**

```
┌─────────────────────────────────────────┐
│  INGESTION PIPELINE                     │
└─────────────────────────────────────────┘

PDF/Docs → Chunk → Embed → Store
            │        │       │
            ▼        ▼       ▼
         1000 tok  OpenAI  Qdrant
                   (1536d)  (HNSW)

┌─────────────────────────────────────────┐
│  QUERY PIPELINE                         │
└─────────────────────────────────────────┘

Query → Embed → Search → Prompt → LLM → Response
         │        │        │        │
         ▼        ▼        ▼        ▼
      OpenAI   top-k=5  "Context:  GPT-4o
                         {chunks}
                         Q: {query}"
```

### **What You Say (Component by Component - 30 sec each):**

**Chunking:**
> "I'd use 1000-token chunks with 200-token overlap. Overlap ensures we don't split mid-sentence."

**Embedding:**
> "OpenAI text-embedding-3: 1536 dimensions, $0.02/1M tokens. Industry standard."

**Vector DB:**
> "Qdrant over Pinecone. Why? Self-hosted (cheaper at scale), payload filtering (for multi-tenancy), HNSW index (fast search)."

**LLM:**
> "GPT-4o for quality. 128K context window, structured outputs, best accuracy."

**Prompt Template:**
```
Context: {retrieved_chunks}

Question: {user_query}

Answer based ONLY on the context above. If you don't know, say so.
Cite sources using [1], [2].
```

---

## 🎯 CLOSING (Last 5 Minutes)

### **What You Say:**
> "Let me summarize what we've designed:
>
> **Core Architecture:**
> - RAG pattern: Retrieve + Generate
> - Vector DB (Qdrant) + LLM (GPT-4o)
> - Scales 100 → 10K users
>
> **Key Optimizations:**
> - Caching: 40-60% cost savings
> - LLM routing: 70% savings
> - Hybrid search: Better accuracy
>
> **Metrics:**
> - Latency: 200ms p95
> - Cost: $0.002/query
> - Accuracy: 90%+
>
> **If I had more time, I'd add:**
> - Multimodal support (images, tables)
> - Fine-tuned model for simple queries
> - A/B testing framework
>
> Does this address the requirements?"

---

# 🎨 VISUAL CHEAT SHEET (1-PAGE)

**Draw this progression on the whiteboard:**

## **PHASE 1: MVP (Draw First)**
```
User → API → [Embed → Vector DB → LLM] → Response
```

## **PHASE 2: Add Caching (Draw Second)**
```
User → API → Cache? → [Embed → Vector DB → LLM] → Response
                 ↓ HIT
              Response
```

## **PHASE 3: Add Routing (Draw Third)**
```
User → API → Cache? → Classifier → GPT-4o-mini (simple)
                 ↓ HIT              ↓
              Response            GPT-4o (complex)
```

## **PHASE 4: Add HA (Draw Last)**
```
         Load Balancer
         /     |     \
      Pod1  Pod2  Pod3  (K8s)
         \     |     /
         Vector DB Cluster
```

---

# 💡 KEY PRINCIPLES

1. **Start simple, add complexity only when asked**
   - Don't show Phase 4 if they only asked about MVP

2. **Draw as you talk**
   - Visual + verbal = better retention

3. **Use concrete numbers**
   - Not "it scales well" → "200ms latency at 10K users"

4. **Mention trade-offs**
   - Every decision has a trade-off. Show you thought about it.

5. **Pause for questions**
   - Don't monologue for 10 minutes straight

---

# 🚨 COMMON MISTAKES TO AVOID

❌ **Starting with the full system architecture**
→ Start simple, build up

❌ **Saying "I'd use Qdrant" without explaining why**
→ Always justify: "Qdrant because of payload filtering for multi-tenancy"

❌ **Forgetting about costs**
→ Mention costs at every phase

❌ **Drawing a messy diagram**
→ Practice drawing clean boxes beforehand

❌ **Overusing buzzwords**
→ "HNSW index" is fine, but explain what it does

---

# ⏱️ TIME MANAGEMENT

- **0-2 min:** Clarify requirements
- **2-7 min:** Draw core architecture
- **7-15 min:** Deep dive 1 (based on their question)
- **15-25 min:** Deep dive 2 (based on their question)
- **25-35 min:** Handle edge cases / follow-ups
- **35-40 min:** Trade-offs & alternatives
- **40-45 min:** Summary + questions

**If running out of time:** Skip to summary at 35 min mark.

---

# 🎤 SAMPLE DIALOGUE

**Interviewer:** "Design a RAG system."

**You:** *(Draw simple box)* "At the highest level..." *(30 sec explanation)*

**Interviewer:** "How do you scale?"

**You:** *(Add K8s pods + cache to diagram)* "Three strategies..." *(2 min)*

**Interviewer:** "What about hallucinations?"

**You:** *(Add filters + checks)* "Four layers..." *(2 min)*

**Interviewer:** "Costs?"

**You:** *(Add routing diagram)* "Concrete example..." *(Show math: $1K → $100)*

**Interviewer:** "Looks good. Any questions?"

**You:** "Yes - what's the most common query type? That would help me optimize further."

---

**THAT'S IT. Clean, structured, builds iteratively. Practice this flow 3-4 times and you'll nail it.**
