# System Diagrams & Flowcharts

**Last Updated:** 2025-11-04

This document contains visual diagrams explaining the system architecture, workflows, and technology decisions.

---

## Table of Contents

1. [Current vs Target Architecture](#current-vs-target-architecture)
2. [Workflow Comparison](#workflow-comparison)
3. [Technology Decision Tree](#technology-decision-tree)
4. [Phase Implementation Flow](#phase-implementation-flow)
5. [Token Flow Analysis](#token-flow-analysis)
6. [Data Flow Diagrams](#data-flow-diagrams)

---

## Current vs Target Architecture

### Current System (Before Optimization)

```mermaid
graph TD
    A[User: Job Description] --> B[Claude Code CLI]
    B --> C{Load Full Context}
    C --> D[Profile: 8k tokens]
    C --> E[Baseline: 2.5k tokens]
    C --> F[Format Rules: 2k tokens]
    C --> G[Agent Instructions: 4k tokens]

    D --> H[Total: 16.5k cached tokens]
    E --> H
    F --> H
    G --> H

    H --> I[LLM: Job Analysis]
    I --> J[500 tokens output]

    J --> K[LLM: Draft Generation]
    H --> K
    K --> L[2k tokens output]

    L --> M[Human Review]
    M --> N[LLM: JSON Conversion]
    H --> N
    N --> O[2k tokens output]

    O --> P[MCP: Resume Generator]
    P --> Q[LaTeX Generation]
    Q --> R[External API]
    R --> S[PDF Output]

    style H fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px
    style S fill:#51cf66,stroke:#2f9e44,stroke-width:2px

    T[Total Cost: $0.20-0.30] --> H
```

### Target System (After Optimization)

```mermaid
graph TD
    A[User: Job Description] --> B[Claude Code CLI]
    B --> C[MCP: Memory Server]

    C --> D{Smart Context Loading}
    D --> E[Profile Summary: 200 tokens]
    D --> F[Knowledge Graph Query]
    D --> G[Learned Patterns]

    F --> H[Relevant Projects: 600 tokens]
    G --> I[Common Selections: 300 tokens]

    E --> J[Total: 1.1k tokens]
    H --> J
    I --> J

    J --> K[LLM: Draft Generation]
    B --> L[Cached Rules: 1k tokens]
    L --> K
    K --> M[1.5k tokens output]

    M --> N[Human Review]
    N --> O[LLM: JSON Conversion]
    O --> P[1.5k tokens output with refs]

    P --> Q[MCP: Resume Generator]
    Q --> R[Template Expansion]
    R --> S[LaTeX Generation]
    S --> T[External API]
    T --> U[PDF Output]

    style J fill:#51cf66,stroke:#2f9e44,stroke-width:3px
    style U fill:#51cf66,stroke:#2f9e44,stroke-width:2px

    V[Total Cost: $0.06] --> J
```

---

## Workflow Comparison

### Before: Multi-Step Resume Generation

```mermaid
sequenceDiagram
    participant User
    participant CLI as Claude Code CLI
    participant LLM as Claude Sonnet 4.5
    participant MCP as Resume Generator MCP
    participant API as LaTeX API

    User->>CLI: Provide job description

    Note over CLI: Load FULL context<br/>16.5k cached tokens
    CLI->>CLI: Load profile (8k)
    CLI->>CLI: Load baseline (2.5k)
    CLI->>CLI: Load rules (2k)
    CLI->>CLI: Load agent (4k)

    CLI->>LLM: Job Analysis (12k tokens in)
    LLM-->>CLI: Analysis (500 tokens out)

    CLI->>LLM: Draft Generation (13k tokens in)
    LLM-->>CLI: Markdown Draft (2k tokens out)

    CLI->>User: Review draft
    User-->>CLI: Approve

    CLI->>LLM: JSON Conversion (4.5k tokens in)
    LLM-->>CLI: Resume JSON (2k tokens out)

    CLI->>MCP: Generate PDF (full JSON)
    MCP->>API: LaTeX code
    API-->>MCP: PDF buffer
    MCP-->>CLI: PDF path
    CLI-->>User: Resume ready

    Note over User: Total: 29.5k input<br/>4.5k output<br/>$0.28
```

### After: Optimized Resume Generation

```mermaid
sequenceDiagram
    participant User
    participant CLI as Claude Code CLI
    participant Mem as Memory MCP Server
    participant LLM as Claude Sonnet 4.5
    participant Gen as Resume Generator MCP
    participant API as LaTeX API

    User->>CLI: Provide job description

    CLI->>LLM: Classify role type (1.5k tokens)
    LLM-->>CLI: "AI Engineer"

    CLI->>Mem: get_profile_summary()
    Mem-->>CLI: 200 tokens

    CLI->>Mem: query_knowledge_graph("AI Engineer")
    Mem-->>CLI: Relevant projects (600 tokens)

    CLI->>Mem: get_learned_patterns("AI Engineer")
    Mem-->>CLI: Common selections (300 tokens)

    Note over CLI: Total context: 2.6k tokens<br/>vs 16.5k before!

    CLI->>LLM: Draft Generation (2.6k tokens in)
    LLM-->>CLI: Markdown Draft (1.5k tokens out)

    CLI->>User: Review draft
    User-->>CLI: Approve

    CLI->>LLM: JSON Conversion (1.5k tokens in)
    LLM-->>CLI: JSON with template refs (1.5k out)

    CLI->>Gen: Generate PDF (JSON with {{refs}})
    Gen->>Gen: Expand templates locally
    Gen->>API: LaTeX code
    API-->>Gen: PDF buffer
    Gen-->>CLI: PDF path
    CLI-->>User: Resume ready

    Note over User: Total: 7.7k input<br/>3.1k output<br/>$0.09 (68% savings!)
```

---

## Technology Decision Tree

### Why We Chose Each Tool

```mermaid
graph TD
    A[Need: MCP Server Runtime] --> B{Language Choice?}
    B -->|Node.js| C[✅ Official SDK<br/>Well-documented<br/>Existing stack]
    B -->|Python| D[❌ Slower I/O<br/>Less mature MCP]
    B -->|Rust| E[❌ Overkill<br/>Harder to debug]

    C --> F[Decision: Node.js]

    G[Need: Database] --> H{Storage Type?}
    H -->|SQLite| I[✅ Zero config<br/>SQL queries<br/>Perfect for local]
    H -->|PostgreSQL| J[❌ Separate server<br/>Overkill]
    H -->|JSON files| K[❌ No queries<br/>Hard to filter]

    I --> L[Decision: SQLite]

    M[Need: Vector Search] --> N{Python OK?}
    N -->|Yes| O[txtai Options]
    N -->|No| P[JavaScript Options]

    O --> Q{Features Needed?}
    Q -->|All-in-one| R[✅ txtai<br/>Vector + Graph<br/>2 lines to start]
    Q -->|Heavy features| S[❌ Chroma<br/>Too heavy]

    R --> T[Decision: txtai]

    U[Need: Templates] --> V{Performance?}
    V -->|Fast| W[Micromustache Options]
    V -->|Features| X[Handlebars/Mustache]

    W --> Y{Size Matters?}
    Y -->|Tiny| Z[✅ Micromustache<br/>3x faster<br/>400 LOC<br/>Zero deps]
    Y -->|Full-featured| AA[❌ Handlebars<br/>Overkill]

    Z --> AB[Decision: Micromustache]

    style F fill:#51cf66,stroke:#2f9e44,stroke-width:3px
    style L fill:#51cf66,stroke:#2f9e44,stroke-width:3px
    style T fill:#51cf66,stroke:#2f9e44,stroke-width:3px
    style AB fill:#51cf66,stroke:#2f9e44,stroke-width:3px
```

### Technology Selection Matrix

```mermaid
graph LR
    A[Technology Selection] --> B[MCP Runtime]
    A --> C[Database]
    A --> D[Vector Search]
    A --> E[Templates]
    A --> F[Knowledge Graph]

    B --> B1[Node.js ✅]
    B --> B2[Python ❌]
    B --> B3[Rust ❌]

    C --> C1[SQLite ✅]
    C --> C2[PostgreSQL ❌]
    C --> C3[JSON ❌]

    D --> D1[txtai ✅]
    D --> D2[Chroma ❌]
    D --> D3[pgvector ❌]

    E --> E1[Micromustache ✅]
    E --> E2[Handlebars ❌]
    E --> E3[Mustache ❌]

    F --> F1[JSON + txtai ✅]
    F --> F2[Neo4j ❌]
    F --> F3[ArangoDB ❌]

    style B1 fill:#51cf66
    style C1 fill:#51cf66
    style D1 fill:#51cf66
    style E1 fill:#51cf66
    style F1 fill:#51cf66

    style B2 fill:#ff6b6b
    style B3 fill:#ff6b6b
    style C2 fill:#ff6b6b
    style C3 fill:#ff6b6b
    style D2 fill:#ff6b6b
    style D3 fill:#ff6b6b
    style E2 fill:#ff6b6b
    style E3 fill:#ff6b6b
    style F2 fill:#ff6b6b
    style F3 fill:#ff6b6b
```

---

## Phase Implementation Flow

### 3-Phase Implementation Strategy

```mermaid
graph TD
    A[Start: Current System<br/>$0.20/resume] --> B[Phase 1: Quick Wins<br/>2-3 days]

    B --> C[Task 1.1:<br/>Split Baseline Files<br/>900 tokens saved]
    B --> D[Task 1.2:<br/>Template System<br/>425 tokens saved]
    B --> E[Task 1.3:<br/>Role Classification<br/>770 tokens saved]

    C --> F[Phase 1 Complete<br/>$0.16/resume<br/>20% savings]
    D --> F
    E --> F

    F --> G[Phase 2: Memory & KG<br/>5-7 days]

    G --> H[Task 2.1:<br/>Memory MCP Server<br/>7,700 tokens saved]
    G --> I[Task 2.2:<br/>Knowledge Graph<br/>1,500 tokens saved]
    G --> J[Task 2.3:<br/>Semantic Search<br/>500 tokens saved]

    H --> K[Phase 2 Complete<br/>$0.06/resume<br/>70% savings]
    I --> K
    J --> K

    K --> L[Phase 3: Learning<br/>2-3 days]

    L --> M[Task 3.1:<br/>Application Tracking<br/>500 tokens saved]
    L --> N[Task 3.2:<br/>Pattern Learning<br/>1,500 tokens saved]

    M --> O[Phase 3 Complete<br/>$0.05/resume<br/>75% savings]
    N --> O

    O --> P[Final: Optimized System<br/>68% cost reduction<br/>50% faster]

    style A fill:#ff6b6b,stroke:#c92a2a
    style F fill:#ffd43b,stroke:#fab005
    style K fill:#74c0fc,stroke:#1c7ed6
    style O fill:#51cf66,stroke:#2f9e44
    style P fill:#51cf66,stroke:#2f9e44,stroke-width:4px
```

### Implementation Timeline

```mermaid
gantt
    title Resume Optimization Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Split Baseline Files       :p1t1, 2025-11-04, 2h
    Template System           :p1t2, after p1t1, 4h
    Role Classification       :p1t3, after p1t2, 1d
    Testing & Validation      :p1t4, after p1t3, 4h

    section Phase 2
    Memory MCP Server         :p2t1, after p1t4, 1d
    Profile Compression       :p2t2, after p2t1, 1d
    Knowledge Graph           :p2t3, after p2t2, 2d
    Semantic Search (opt)     :p2t4, after p2t3, 1d
    Integration Testing       :p2t5, after p2t4, 1d

    section Phase 3
    Application Tracking      :p3t1, after p2t5, 1d
    Pattern Learning          :p3t2, after p3t1, 1d
    Final Testing             :p3t3, after p3t2, 1d
    Documentation             :p3t4, after p3t3, 4h
```

---

## Token Flow Analysis

### Token Reduction by Phase

```mermaid
graph LR
    A[Current: 25k tokens<br/>$0.20] --> B[Phase 1: -2k tokens<br/>23k total<br/>$0.16]
    B --> C[Phase 2: -8k tokens<br/>15k total<br/>$0.06]
    C --> D[Phase 3: -2k tokens<br/>7.5k total<br/>$0.05]

    style A fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px
    style D fill:#51cf66,stroke:#2f9e44,stroke-width:3px
```

### Token Breakdown (Before vs After)

```mermaid
pie title Current System (25k tokens)
    "Profile Context" : 8000
    "Baseline Resume" : 2500
    "Format Rules" : 2000
    "Agent Instructions" : 4000
    "Job Description" : 1500
    "Conversation" : 3000
    "LLM Output" : 4000
```

```mermaid
pie title Optimized System (7.5k tokens)
    "Profile Summary" : 200
    "Knowledge Graph Query" : 600
    "Learned Patterns" : 300
    "Cached Rules" : 1000
    "Job Description" : 1500
    "Minimal Conversation" : 1000
    "LLM Output" : 3000
```

---

## Data Flow Diagrams

### Memory Server Architecture

```mermaid
graph TD
    A[Memory MCP Server] --> B[Profile Store]
    A --> C[Knowledge Graph]
    A --> D[Pattern Learner]

    B --> B1[(SQLite DB)]
    B1 --> B2[Profile Table<br/>- full_context<br/>- compressed_summary<br/>- updated_at]
    B1 --> B3[Content Refs Table<br/>- id<br/>- content_type<br/>- content]
    B1 --> B4[Applications Table<br/>- company<br/>- role_type<br/>- projects_selected<br/>- fit_score]

    C --> C1[JSON File]
    C1 --> C2[Nodes<br/>- companies<br/>- projects<br/>- skills]
    C1 --> C3[Edges<br/>- relationships<br/>- types]

    D --> D1[Pattern Analysis]
    D1 --> D2[Role Type Patterns<br/>- common_projects<br/>- skills_order<br/>- frequency]

    E[Tools Exposed] --> F[get_profile_summary]
    E --> G[query_knowledge_graph]
    E --> H[get_learned_patterns]
    E --> I[expand_references]
    E --> J[track_application]

    style A fill:#4c6ef5,stroke:#364fc7,color:#fff
    style B1 fill:#ffd43b,stroke:#fab005
    style C1 fill:#51cf66,stroke:#2f9e44
```

### Knowledge Graph Structure

```mermaid
graph TD
    A[Person: Viresh] --> B[Company: Grid CoOperator]
    A --> C[Company: Freefly]
    A --> D[Company: Lumenier]
    A --> E[Company: York]

    A --> F[Skill: LangChain]
    A --> G[Skill: RAG]
    A --> H[Skill: Python]

    A --> I[Project: GridCOP]
    A --> J[Project: Production Tool]
    A --> K[Project: AI Travel Planner]
    A --> L[Project: Flight Control]

    I -->|uses| F
    I -->|uses| G
    I -->|demonstrates| M[Multi-Agent Systems]

    J -->|uses| H
    J -->|uses| N[React]

    L -->|uses| O[C++]
    L -->|uses| P[Embedded]

    B -->|contains| I
    C -->|contains| J
    D -->|contains| L

    Q{Query: AI Engineer Role} --> R[Filter by role_fit]
    R --> I
    R --> J
    R --> K
    R -.excludes.-> L

    style A fill:#4c6ef5,stroke:#364fc7,color:#fff
    style Q fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style R fill:#51cf66,stroke:#2f9e44
```

### Template Expansion Flow

```mermaid
graph LR
    A[LLM generates JSON<br/>with template refs] --> B{Contains {{refs}}?}

    B -->|Yes| C[MCP Server:<br/>Template Expander]
    B -->|No| D[Pass through]

    C --> E[Parse template IDs]
    E --> F{Template Registry}

    F --> G[{{lumenier-1}}]
    F --> H[{{york-2}}]
    F --> I[{{freefly_locked-3}}]

    G --> J[Expand to full text:<br/>'Wrote embedded code...']
    H --> K[Expand to full text:<br/>'Built Human Machine...']
    I --> L[Expand to full text:<br/>'Led release management...']

    J --> M[Final JSON with<br/>expanded content]
    K --> M
    L --> M
    D --> M

    M --> N[LaTeX Generator]
    N --> O[PDF Output]

    style C fill:#4c6ef5,stroke:#364fc7,color:#fff
    style F fill:#ffd43b,stroke:#fab005
    style O fill:#51cf66,stroke:#2f9e44
```

---

## Architecture Comparison Chart

### Component Comparison

```mermaid
graph TB
    subgraph "Current System"
        A1[Claude Code CLI<br/>16.5k tokens loaded]
        A2[Baseline Resume<br/>2.5k tokens<br/>All metadata included]
        A3[Profile Context<br/>8k tokens<br/>Loaded every time]
        A4[MCP Resume Generator<br/>Receives full JSON]

        A1 --> A2
        A1 --> A3
        A1 --> A4
    end

    subgraph "Optimized System"
        B1[Claude Code CLI<br/>2.5k tokens loaded]
        B2[Memory MCP Server<br/>Stores once<br/>Returns 200 tokens]
        B3[Knowledge Graph<br/>Query returns<br/>relevant only]
        B4[Pattern Learning<br/>Pre-populate<br/>common selections]
        B5[MCP Resume Generator<br/>Template expansion]

        B1 --> B2
        B1 --> B3
        B1 --> B4
        B1 --> B5
    end

    style A1 fill:#ff6b6b,stroke:#c92a2a
    style A2 fill:#ff6b6b,stroke:#c92a2a
    style A3 fill:#ff6b6b,stroke:#c92a2a

    style B1 fill:#51cf66,stroke:#2f9e44
    style B2 fill:#51cf66,stroke:#2f9e44
    style B3 fill:#51cf66,stroke:#2f9e44
    style B4 fill:#51cf66,stroke:#2f9e44
    style B5 fill:#51cf66,stroke:#2f9e44
```

---

## Cost Analysis Visualization

### Cost Breakdown by Phase

```mermaid
graph LR
    A[Current: $0.20] -->|Phase 1<br/>-$0.04| B[After P1: $0.16]
    B -->|Phase 2<br/>-$0.10| C[After P2: $0.06]
    C -->|Phase 3<br/>-$0.01| D[Final: $0.05]

    style A fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px
    style B fill:#ffd43b,stroke:#fab005,stroke-width:3px
    style C fill:#74c0fc,stroke:#1c7ed6,stroke-width:3px
    style D fill:#51cf66,stroke:#2f9e44,stroke-width:3px
```

### ROI Timeline

```mermaid
graph TD
    A[Development Cost:<br/>12-15 days @ $100/hr<br/>= $9,600-12,000] --> B{Generate how many resumes?}

    B -->|20 resumes| C[Savings: $3<br/>ROI: Negative]
    B -->|100 resumes| D[Savings: $15<br/>ROI: Negative]
    B -->|500 resumes| E[Savings: $75<br/>ROI: Negative]
    B -->|1000 resumes| F[Savings: $150<br/>ROI: Negative<br/>BUT: Time saved = $415]

    G[Alternative View:<br/>Time Savings] --> H[Current: 10 min/resume]
    G --> I[Optimized: 5 min/resume]

    H --> J[100 resumes = 16.7 hours]
    I --> J

    J --> K[Time saved: 8.3 hours<br/>Value @ $50/hr: $415<br/>PLUS cost savings: $79<br/>TOTAL: $494]

    style K fill:#51cf66,stroke:#2f9e44,stroke-width:3px
```

---

## Decision Matrix

### Why Each Technology Choice

```mermaid
graph TD
    A[Technology Decision Framework] --> B[Ease of Use]
    A --> C[Performance]
    A --> D[Maturity]
    A --> E[Integration]
    A --> F[Overhead]

    B --> B1{Can junior dev<br/>use with LLM?}
    C --> C1{Meets 70%<br/>token reduction?}
    D --> D1{Active maintenance<br/>in 2025?}
    E --> E1{Works with<br/>existing stack?}
    F --> F1{Adds unnecessary<br/>complexity?}

    B1 -->|Yes| G[✅ Pass]
    B1 -->|No| H[❌ Reject]

    C1 -->|Yes| G
    C1 -->|No| H

    D1 -->|Yes| G
    D1 -->|No| H

    E1 -->|Yes| G
    E1 -->|No| H

    F1 -->|Yes| H
    F1 -->|No| G

    G --> I[Technology Approved]
    H --> J[Find Alternative]

    style I fill:#51cf66,stroke:#2f9e44
    style J fill:#ff6b6b,stroke:#c92a2a
```

---

## How to View These Diagrams

### In VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file and press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
3. Diagrams will render inline

### Online
1. Copy any diagram code block
2. Paste into [Mermaid Live Editor](https://mermaid.live)
3. View and export as PNG/SVG

### In Documentation
These diagrams are written in Mermaid syntax and can be:
- Rendered in GitHub/GitLab README files
- Embedded in documentation sites (Docusaurus, VitePress, etc.)
- Exported as images for presentations

---

**Last Updated:** 2025-11-04
**Version:** 1.0
**Format:** Mermaid.js diagrams
