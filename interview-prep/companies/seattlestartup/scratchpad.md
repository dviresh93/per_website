# SCALABLE RAG SYSTEM - VISUAL ARCHITECTURE GUIDE
## Interview Prep - Seattle Startup

---

## ORIGINAL QUESTION

**Build a scalable RAG system that:**
- Starts with 100 users, scales to 10K+
- Handles organizational growth (multi-department, multi-tenant)
- Prevents hallucinations and context exhaustion
- Optimizes for cost

---

## SCALING OVERVIEW

```mermaid
graph LR
    P1[Phase 1: MVP<br/>100 users<br/>$150/mo<br/>2s latency]
    P2[Phase 2: Growth<br/>10K users<br/>$3K/mo<br/>200ms latency]
    P3[Phase 3: Enterprise<br/>100K+ users<br/>$20K/mo<br/>100ms latency]

    P1 -->|Add Caching<br/>Add LLM Routing<br/>Kubernetes| P2
    P2 -->|Multi-tenancy<br/>Compliance<br/>Advanced Safety| P3
```

---

## PHASE 1: MVP ARCHITECTURE

### Complete System Flow

```mermaid
graph TB
    subgraph INGESTION["INGESTION PIPELINE (Offline)"]
        DOCS[Documents<br/>PDF, DOCX, MD]
        CHUNK[Chunking Service<br/>1000 tokens<br/>200 overlap]
        EMBED[Embedding Service<br/>OpenAI text-embed-3<br/>1536 dimensions]
        VDB[(Vector Database<br/>Pinecone Serverless<br/>100K vectors)]

        DOCS --> CHUNK
        CHUNK --> EMBED
        EMBED --> VDB
    end

    subgraph QUERY["QUERY PIPELINE (Online)"]
        USER[User Query]
        API[FastAPI Backend]
        QEMBED[Embed Query<br/>Same model]
        SEARCH[Vector Search<br/>Top k=5]
        LLM[GPT-4o<br/>128K context]
        RESP[Response]

        USER --> API
        API --> QEMBED
        QEMBED --> SEARCH
        SEARCH --> LLM
        LLM --> RESP
    end

    VDB -.stored vectors.-> SEARCH

    style DOCS fill:#e3f2fd,stroke:#1976d2,color:#000
    style CHUNK fill:#fff3e0,stroke:#f57c00,color:#000
    style EMBED fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style VDB fill:#ffebee,stroke:#c62828,color:#000
    style USER fill:#e8f5e9,stroke:#388e3c,color:#000
    style LLM fill:#ffe0b2,stroke:#e64a19,color:#000
```

### Key Components

```mermaid
graph LR
    subgraph Components["Tech Stack - Phase 1"]
        C1[Vector DB:<br/>Pinecone]
        C2[Embedding:<br/>OpenAI text-embed-3]
        C3[LLM:<br/>GPT-4o]
        C4[Backend:<br/>FastAPI]
        C5[Deploy:<br/>Railway/Render]
    end

    style C1 fill:#e3f2fd,stroke:#1976d2,color:#000
    style C2 fill:#fff3e0,stroke:#f57c00,color:#000
    style C3 fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style C4 fill:#e8f5e9,stroke:#388e3c,color:#000
    style C5 fill:#fce4ec,stroke:#c2185b,color:#000
```

---

## PHASE 2: GROWTH ARCHITECTURE

### System Architecture with Optimizations

```mermaid
graph TB
    subgraph CLIENT["Client Layer"]
        USERS[Users<br/>100-10K]
    end

    subgraph GATEWAY["API Gateway"]
        LB[Load Balancer<br/>NGINX/AWS ALB<br/>Rate Limiting]
    end

    subgraph CACHE["Caching Layer - NEW"]
        REDIS[Redis Cache<br/>Semantic Caching<br/>40-60% hit rate]
    end

    subgraph APP["Application Layer - Kubernetes"]
        POD1[FastAPI Pod 1]
        POD2[FastAPI Pod 2]
        POD3[FastAPI Pod N]
    end

    subgraph RETRIEVAL["Hybrid Retrieval - NEW"]
        QDRANT[(Qdrant Cluster<br/>3 nodes<br/>Vector Search)]
        ELASTIC[(Elasticsearch<br/>2 nodes<br/>BM25 Keyword)]
        RERANK[Cohere Rerank v3<br/>Top 20 to Top 5]

        QDRANT --> RERANK
        ELASTIC --> RERANK
    end

    subgraph LLMROUTE["LLM Routing - NEW"]
        ROUTER{Query Classifier}
        MINI[GPT-4o-mini<br/>60% queries<br/>$0.15/1M tokens]
        GPT4O[GPT-4o<br/>30% queries<br/>$2.50/1M tokens]
        CLAUDE[Claude 3.5<br/>10% queries<br/>Code/Complex]

        ROUTER --> MINI
        ROUTER --> GPT4O
        ROUTER --> CLAUDE
    end

    USERS --> LB
    LB --> REDIS
    REDIS -->|Cache HIT| USERS
    REDIS -->|Cache MISS| POD1
    REDIS -->|Cache MISS| POD2
    REDIS -->|Cache MISS| POD3
    POD1 --> QDRANT
    POD1 --> ELASTIC
    POD2 --> QDRANT
    POD2 --> ELASTIC
    POD3 --> QDRANT
    POD3 --> ELASTIC
    RERANK --> ROUTER
    MINI --> USERS
    GPT4O --> USERS
    CLAUDE --> USERS

    style USERS fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style REDIS fill:#ffccbc,stroke:#d84315,stroke-width:2px,color:#000
    style QDRANT fill:#bbdefb,stroke:#1976d2,stroke-width:2px,color:#000
    style ELASTIC fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    style ROUTER fill:#c8e6c9,stroke:#388e3c,stroke-width:2px,color:#000
    style MINI fill:#b2dfdb,stroke:#00796b,stroke-width:2px,color:#000
```

### Query Flow with Caching

```mermaid
sequenceDiagram
    participant User
    participant LB as Load Balancer
    participant Cache as Redis Cache
    participant API as FastAPI
    participant Q as Qdrant
    participant E as Elasticsearch
    participant R as Reranker
    participant LLM as LLM Router

    User->>LB: Query request
    LB->>Cache: Check cache

    alt Cache HIT (50% of queries)
        Cache-->>User: Return cached response<br/>Cost: $0
    else Cache MISS
        Cache->>API: Forward to app
        API->>API: Embed query

        par Hybrid Search
            API->>Q: Vector search (top 20)
            API->>E: BM25 keyword (top 20)
        end

        Q-->>R: Vector results
        E-->>R: Keyword results
        R->>R: Re-rank combined
        R-->>API: Top 5 chunks

        API->>LLM: Route by complexity

        alt Simple Query (60%)
            LLM->>LLM: GPT-4o-mini
        else Complex Query (40%)
            LLM->>LLM: GPT-4o
        end

        LLM-->>API: Response
        API->>Cache: Cache response (TTL: 24h)
        API-->>User: Return response
    end
```

### Cost Optimization Impact

```mermaid
graph LR
    subgraph Before["Before Optimization"]
        B1[LLM: $3000<br/>All GPT-4o<br/>No caching]
        B2[Vector DB: $500<br/>Pinecone managed]
        B3[Compute: $1500<br/>Overprovisioned]
        BT[Total: $5000/mo]

        B1 --> BT
        B2 --> BT
        B3 --> BT
    end

    subgraph After["After Optimization"]
        A1[LLM: $450<br/>70% cached<br/>Routing enabled]
        A2[Vector DB: $200<br/>Qdrant self-hosted]
        A3[Compute: $400<br/>Auto-scaling]
        A4[Cache: $100<br/>Redis]
        AT[Total: $1150/mo<br/>77% savings!]

        A1 --> AT
        A2 --> AT
        A3 --> AT
        A4 --> AT
    end

    Before -.Optimization.-> After

    style Before fill:#ffcdd2,stroke:#c62828,color:#000
    style After fill:#c8e6c9,stroke:#388e3c,color:#000
    style BT fill:#ef5350,stroke:#c62828,stroke-width:3px,color:#fff
    style AT fill:#66bb6a,stroke:#388e3c,stroke-width:3px,color:#fff
```

---

## PHASE 3: ENTERPRISE MULTI-TENANT

### Multi-Tenant Architecture

```mermaid
graph TB
    subgraph CLIENTS["Multi-Org Clients"]
        ORG_A[Org A<br/>Engineering, Sales, HR]
        ORG_B[Org B<br/>Product, Legal]
        ORG_C[Org C<br/>Other Depts]
    end

    subgraph AUTH["Authentication Gateway"]
        KONG[Kong API Gateway<br/>JWT Auth<br/>RBAC<br/>Rate Limiting]
    end

    subgraph MIDDLEWARE["Tenant Context"]
        MW[Extract from JWT:<br/>org_id, dept_id, role<br/>Enforce Access Policies]
    end

    subgraph DATA["Multi-Tenant Data"]
        QDRANT_MT[(Qdrant with Filters<br/>org_id + dept_id<br/>10-node cluster)]
        POSTGRES[(PostgreSQL<br/>Org hierarchy<br/>Access policies<br/>Audit logs)]
    end

    subgraph SAFETY["Safety Layers"]
        CITE[Citation<br/>Enforcement]
        CONF[Confidence<br/>Scoring]
        GROUND[NLI Grounding<br/>Check]
        THRESHOLD[Similarity<br/>Threshold 0.7]
    end

    ORG_A --> KONG
    ORG_B --> KONG
    ORG_C --> KONG
    KONG --> MW
    MW --> QDRANT_MT
    MW --> POSTGRES
    QDRANT_MT --> CITE
    CITE --> CONF
    CONF --> GROUND
    GROUND --> THRESHOLD
    THRESHOLD --> ORG_A
    THRESHOLD --> ORG_B
    THRESHOLD --> ORG_C

    style ORG_A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style ORG_B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style ORG_C fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style KONG fill:#ffcdd2,stroke:#c62828,stroke-width:2px,color:#000
    style QDRANT_MT fill:#bbdefb,stroke:#1976d2,stroke-width:2px,color:#000
    style POSTGRES fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
```

### Multi-Tenant Query Flow with Security

```mermaid
sequenceDiagram
    participant U as User (Org A, Eng Dept)
    participant API as API Gateway
    participant AUTH as Auth Service
    participant MW as Tenant Middleware
    participant Q as Qdrant
    participant PG as PostgreSQL
    participant LLM as LLM + Safety

    U->>API: Query + JWT Token
    API->>AUTH: Validate JWT
    AUTH-->>API: Valid<br/>org_id=A<br/>dept_id=eng<br/>role=member

    API->>MW: Extract tenant context
    MW->>PG: Check access policies
    PG-->>MW: Allowed: org_A_docs, shared<br/>Forbidden: org_B_docs, hr_confidential

    MW->>Q: Vector search with filter:<br/>org_id=A AND dept_id IN [eng, shared]
    Q-->>MW: Filtered results (only accessible docs)

    MW->>LLM: Prompt + Context

    rect rgb(255, 250, 240)
        Note over LLM: Safety Checks
        LLM->>LLM: 1. Citation check
        LLM->>LLM: 2. Confidence scoring
        LLM->>LLM: 3. NLI grounding
        LLM->>LLM: 4. PII masking
    end

    LLM-->>MW: Response with citations
    MW->>PG: Log audit trail<br/>(user, query, docs, timestamp)
    MW-->>U: Response
```

---

## HALLUCINATION PREVENTION

### 4-Layer Defense System

```mermaid
graph TD
    QUERY[User Query] --> RETRIEVE[Retrieve Chunks<br/>Hybrid Search]

    RETRIEVE --> THRESHOLD{Similarity<br/>Score >= 0.7?}

    THRESHOLD -->|No| NO_ANSWER[Return:<br/>No relevant docs found<br/>Suggest web search or rephrase]

    THRESHOLD -->|Yes| DIVERSITY[MMR Diversity Filter<br/>Avoid redundant chunks]

    DIVERSITY --> PROMPT[Build Prompt<br/>+ Citation Instructions]

    PROMPT --> LLM[LLM Generation]

    LLM --> CITE_CHECK{All claims<br/>cited?}

    CITE_CHECK -->|No| FLAG_UNCITED[Flag uncited claims<br/>Highlight in response]

    CITE_CHECK -->|Yes| CONF_CHECK{Confidence<br/>Score >= 7/10?}

    FLAG_UNCITED --> CONF_CHECK

    CONF_CHECK -->|No| LOW_CONF[Add disclaimer:<br/>Low confidence answer]

    CONF_CHECK -->|Yes| NLI_CHECK{NLI Grounding<br/>Score >= 0.8?}

    LOW_CONF --> NLI_CHECK

    NLI_CHECK -->|No| HALLUCINATION[Likely hallucination<br/>Reject or flag for review]

    NLI_CHECK -->|Yes| SAFE[Safe Response<br/>High confidence + grounded]

    SAFE --> FEEDBACK[Collect User Feedback<br/>thumbs up/down]

    FEEDBACK --> RETRAIN[Retrain retrieval/reranking<br/>from flagged examples]

    style NO_ANSWER fill:#ffcdd2,stroke:#c62828,color:#000
    style FLAG_UNCITED fill:#fff9c4,stroke:#f57f17,color:#000
    style LOW_CONF fill:#fff9c4,stroke:#f57f17,color:#000
    style HALLUCINATION fill:#ffcdd2,stroke:#c62828,color:#000
    style SAFE fill:#c8e6c9,stroke:#388e3c,color:#000
```

---

## KUBERNETES ROLE

### Auto-Scaling in Action

```mermaid
graph TB
    subgraph TRAFFIC["Traffic Pattern"]
        T1[Morning 9am<br/>100 queries/sec]
        T2[Afternoon 2pm<br/>5000 queries/sec]
        T3[Night 2am<br/>10 queries/sec]
    end

    subgraph K8S["Kubernetes Auto-Scaling"]
        HPA[Horizontal Pod<br/>Autoscaler<br/>Target: 70% CPU]
    end

    subgraph PODS1["9am - Low Traffic"]
        P1A[Pod 1]
        P1B[Pod 2]
        COST1[Cost: $50/day]
    end

    subgraph PODS2["2pm - High Traffic"]
        P2A[Pod 1]
        P2B[Pod 2]
        P2C[Pod 3]
        P2D[...]
        P2E[Pod 15]
        COST2[Cost: $150/day<br/>Only during spike!]
    end

    subgraph PODS3["2am - Night"]
        P3A[Pod 1]
        P3B[Pod 2]
        COST3[Cost: $50/day]
    end

    T1 --> HPA
    T2 --> HPA
    T3 --> HPA

    HPA --> PODS1
    HPA --> PODS2
    HPA --> PODS3

    style T1 fill:#e8f5e9,stroke:#388e3c,color:#000
    style T2 fill:#ffcdd2,stroke:#c62828,color:#000
    style T3 fill:#e1f5fe,stroke:#0277bd,color:#000
    style COST1 fill:#c8e6c9,stroke:#388e3c,color:#000
    style COST2 fill:#fff9c4,stroke:#f57f17,color:#000
    style COST3 fill:#c8e6c9,stroke:#388e3c,color:#000
```

### Kubernetes Benefits

```mermaid
graph LR
    subgraph Benefits["Why Kubernetes?"]
        B1[Auto-Scaling<br/>2-20 pods based on load]
        B2[Self-Healing<br/>Auto-restart crashed pods]
        B3[Load Balancing<br/>Distribute traffic evenly]
        B4[Zero-Downtime<br/>Rolling updates]
        B5[Resource Management<br/>Efficient bin packing]
    end

    RESULT[Result: 100 users to 10K users<br/>Same infrastructure<br/>40% cost savings]

    B1 --> RESULT
    B2 --> RESULT
    B3 --> RESULT
    B4 --> RESULT
    B5 --> RESULT

    style B1 fill:#e3f2fd,stroke:#1976d2,color:#000
    style B2 fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style B3 fill:#fff3e0,stroke:#f57c00,color:#000
    style B4 fill:#e8f5e9,stroke:#388e3c,color:#000
    style B5 fill:#fce4ec,stroke:#c2185b,color:#000
    style RESULT fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
```

---

## MULTIMODAL RAG

### Multimodal Architecture

```mermaid
graph TB
    subgraph INPUT["Document Types"]
        TEXT[Text<br/>PDF, DOCX]
        IMAGE[Images<br/>PNG, JPG]
        TABLE[Tables<br/>Excel, CSV]
        VIDEO[Videos<br/>MP4]
    end

    subgraph PROCESS["Processing"]
        TEXT_PROC[Text Chunking<br/>1000 tokens]
        IMG_PROC[CLIP Embedding<br/>+ OCR]
        TABLE_PROC[Table Extraction<br/>Camelot/Tabula]
        VIDEO_PROC[Whisper ASR<br/>+ Frame extraction]
    end

    subgraph EMBED["Embedding"]
        TEXT_EMB[OpenAI<br/>text-embed-3]
        IMG_EMB[CLIP<br/>ViT-L/14]
        TABLE_EMB[Text embedding<br/>+ Structure]
        VIDEO_EMB[CLIP + Whisper<br/>embeddings]
    end

    subgraph STORAGE["Vector Storage"]
        TEXT_VDB[(Text Vectors)]
        IMG_VDB[(Image Vectors)]
        TABLE_VDB[(Table Vectors)]
        VIDEO_VDB[(Video Vectors)]
    end

    subgraph QUERY["Query Processing"]
        USER_Q[User Query]
        FUSION[Reciprocal Rank<br/>Fusion]
        MULTI_LLM[Multimodal LLM<br/>GPT-4V/Claude 3.5]
    end

    TEXT --> TEXT_PROC --> TEXT_EMB --> TEXT_VDB
    IMAGE --> IMG_PROC --> IMG_EMB --> IMG_VDB
    TABLE --> TABLE_PROC --> TABLE_EMB --> TABLE_VDB
    VIDEO --> VIDEO_PROC --> VIDEO_EMB --> VIDEO_VDB

    USER_Q --> TEXT_VDB
    USER_Q --> IMG_VDB
    USER_Q --> TABLE_VDB
    USER_Q --> VIDEO_VDB

    TEXT_VDB --> FUSION
    IMG_VDB --> FUSION
    TABLE_VDB --> FUSION
    VIDEO_VDB --> FUSION

    FUSION --> MULTI_LLM

    style TEXT fill:#e3f2fd,stroke:#1976d2,color:#000
    style IMAGE fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style TABLE fill:#e8f5e9,stroke:#388e3c,color:#000
    style VIDEO fill:#fff3e0,stroke:#f57c00,color:#000
    style MULTI_LLM fill:#ffcdd2,stroke:#c62828,color:#000
```

### Multimodal Cost Comparison

```mermaid
graph LR
    subgraph TextOnly["Text-Only RAG"]
        T1[Embedding: $0.02/1M]
        T2[LLM: GPT-4o $2.50/1M]
        T3[Storage: $200/mo]
        TT[Total: $2000/mo]

        T1 --> TT
        T2 --> TT
        T3 --> TT
    end

    subgraph Multimodal["Multimodal RAG"]
        M1[Text Embedding: $0.02/1M]
        M2[CLIP self-hosted: $100/mo]
        M3[Whisper GPU: $200/mo]
        M4[GPT-4V: $10/1M 4x cost]
        M5[Storage: $500/mo]
        MT[Total: $5000/mo<br/>BUT 15-50% better<br/>accuracy on visual docs]

        M1 --> MT
        M2 --> MT
        M3 --> MT
        M4 --> MT
        M5 --> MT
    end

    TextOnly -.Add multimodal.-> Multimodal

    style TextOnly fill:#c8e6c9,stroke:#388e3c,color:#000
    style Multimodal fill:#fff9c4,stroke:#f57f17,color:#000
    style TT fill:#66bb6a,stroke:#388e3c,stroke-width:2px,color:#fff
    style MT fill:#ffb74d,stroke:#f57c00,stroke-width:2px,color:#fff
```

---

## VECTOR DATABASE DECISION TREE

```mermaid
graph TD
    START{Choose Vector DB}

    START -->|MVP?<br/>100 users<br/>Ship in 1-2 weeks?| MVP_Q{Need DevOps?}

    MVP_Q -->|No DevOps| PINECONE[PINECONE<br/>Managed, fast setup<br/>Free tier: 100K vectors<br/>Cost: $0-50/mo]

    MVP_Q -->|Have DevOps| QDRANT_EARLY[QDRANT self-hosted<br/>Lower cost<br/>More control<br/>Cost: $50-100/mo]

    START -->|Growth?<br/>10K users<br/>1M+ vectors?| GROWTH_Q{Need multi-tenancy?}

    GROWTH_Q -->|Yes<br/>Multiple orgs/depts| QDRANT_MT[QDRANT<br/>Payload filtering<br/>3-node cluster<br/>Cost: $200-500/mo]

    GROWTH_Q -->|No<br/>Single tenant| WEAVIATE[WEAVIATE<br/>Good hybrid search<br/>Self-hosted<br/>Cost: $300/mo]

    START -->|Enterprise?<br/>100K users<br/>10M+ vectors?| ENTERPRISE_Q{Budget priority?}

    ENTERPRISE_Q -->|Cost-sensitive| QDRANT_SCALE[QDRANT<br/>Self-hosted cluster<br/>10-node setup<br/>Cost: $2000/mo]

    ENTERPRISE_Q -->|Max performance<br/>Massive scale| MILVUS[MILVUS<br/>100M+ vectors<br/>High throughput<br/>Cost: $2500/mo]

    START -->|Small dataset?<br/>Less than 100K vectors?| SMALL_Q{Have existing<br/>Postgres?}

    SMALL_Q -->|Yes| PGVECTOR[pgvector<br/>Postgres extension<br/>No extra infra<br/>Cost: $50/mo]

    SMALL_Q -->|No| PINECONE

    style PINECONE fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style QDRANT_MT fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style QDRANT_SCALE fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style PGVECTOR fill:#bbdefb,stroke:#1976d2,stroke-width:2px,color:#000
    style WEAVIATE fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    style MILVUS fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
```

---

## KEY METRICS SUMMARY

```mermaid
graph TB
    subgraph PHASE1["Phase 1: MVP"]
        P1_USERS[Users: 100]
        P1_COST[Cost: $150/mo]
        P1_LATENCY[Latency: 2s p95]
        P1_ACCURACY[Accuracy: 70-80%]
    end

    subgraph PHASE2["Phase 2: Growth"]
        P2_USERS[Users: 10K]
        P2_COST[Cost: $3K/mo<br/>$0.002/query]
        P2_LATENCY[Latency: 200ms p95]
        P2_ACCURACY[Accuracy: 85-90%]
    end

    subgraph PHASE3["Phase 3: Enterprise"]
        P3_USERS[Users: 100K+]
        P3_COST[Cost: $20K/mo<br/>$0.0013/query]
        P3_LATENCY[Latency: 100ms p95]
        P3_ACCURACY[Accuracy: 90-95%]
    end

    PHASE1 -->|+ Caching<br/>+ LLM Routing<br/>+ K8s| PHASE2
    PHASE2 -->|+ Multi-tenancy<br/>+ Safety layers<br/>+ Compliance| PHASE3

    style PHASE1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style PHASE2 fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style PHASE3 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
```

---

## OPTIMIZATION STRATEGIES

```mermaid
graph TB
    subgraph OPT["Cost Optimization Techniques"]
        OPT1[Semantic Caching<br/>40-60% savings<br/>Redis]
        OPT2[LLM Routing<br/>70% savings<br/>GPT-4o-mini for simple]
        OPT3[Prompt Caching<br/>50% input savings<br/>OpenAI feature]
        OPT4[Vector Quantization<br/>4x storage reduction<br/>Minimal accuracy loss]
        OPT5[Auto-scaling<br/>40% compute savings<br/>Kubernetes HPA]
    end

    BEFORE[Before: $5000/mo]
    AFTER[After: $1000/mo<br/>80% reduction!]

    BEFORE --> OPT1
    BEFORE --> OPT2
    BEFORE --> OPT3
    BEFORE --> OPT4
    BEFORE --> OPT5

    OPT1 --> AFTER
    OPT2 --> AFTER
    OPT3 --> AFTER
    OPT4 --> AFTER
    OPT5 --> AFTER

    style BEFORE fill:#ffcdd2,stroke:#c62828,stroke-width:3px,color:#000
    style AFTER fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style OPT1 fill:#e3f2fd,stroke:#1976d2,color:#000
    style OPT2 fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style OPT3 fill:#fff3e0,stroke:#f57c00,color:#000
    style OPT4 fill:#e8f5e9,stroke:#388e3c,color:#000
    style OPT5 fill:#fce4ec,stroke:#c2185b,color:#000
```

---

## INTERVIEW CHEAT SHEET

### Key Numbers to Remember

| Metric | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|
| Users | 100 | 10K | 100K+ |
| Cost/month | $150 | $3K | $20K |
| Cost/query | $0.005 | $0.002 | $0.0013 |
| Latency p95 | 2s | 200ms | 100ms |
| Accuracy | 70-80% | 85-90% | 90-95% |

### Technology Choices

| Component | Choice | Why? |
|-----------|--------|------|
| Vector DB | Qdrant | Payload filtering for multi-tenancy, open-source, 3x cheaper than Pinecone |
| Embedding | OpenAI text-embed-3 | Industry standard, 1536 dims, $0.02/1M tokens |
| LLM | GPT-4o / GPT-4o-mini | Route by complexity: 60% cheap, 40% quality |
| Cache | Redis | Semantic caching, 40-60% hit rate |
| Compute | Kubernetes | Auto-scaling, self-healing, zero-downtime deploys |

### Optimization Wins

1. **Caching** → 40-60% cost savings
2. **LLM Routing** → 70% savings on LLM calls
3. **Hybrid Search** → 15% accuracy improvement
4. **Vector Quantization** → 4x storage reduction
5. **Auto-scaling** → 40% compute savings

---

**END OF VISUAL GUIDE**
