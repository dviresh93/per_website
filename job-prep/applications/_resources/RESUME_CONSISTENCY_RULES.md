# Resume Consistency Rules

**Version:** 2.0
**Last Updated:** 2025-02-04
**Purpose:** Ensure all resumes follow consistent structure and never include inaccurate information

---

## 🚨 CRITICAL RULES - NEVER VIOLATE

### 1. Summary Structure (MANDATORY)

**Template (70-85 words):**
```
AI Software Engineer with 5+ years building [DOMAIN] production systems. Currently developing [CURRENT WORK] using [TECH STACK] that improve operational efficiency by 50-80%. Recent work includes [PROJECTS]. Experience spans developing applications for drones and embedded systems, [OTHER DOMAINS].
```

**Rules:**
- ✅ Always use "AI Software Engineer" (NEVER copy job posting title)
- ✅ Always mention "developing applications for drones and embedded systems" (shows breadth subtly)
- ✅ Word count: 70-85 words strict
- ✅ No explicit "transition" language (never say "transitioning from")
- ✅ Only verified metrics: "50-80% operational efficiency"
- ❌ NEVER include location signals ("Open to SF Bay Area", "willing to relocate", etc.)
- ❌ NEVER mention specific user counts ("200+ users", "serving X daily users")
- ❌ NEVER copy job title from posting

---

### 2. Work Experience Order (MANDATORY)

**Always chronological (most recent first):**
1. Bizgenie (Oct 2025 - Present)
2. Grid CoOperator (Mar 2025 - Present)
3. Freefly Systems (Nov 2021 - Oct 2025)
4. Lumenier (Jul 2020 - Oct 2021)
5. York Exponential (Aug 2018 - May 2020)

**Never change this order.**

---

### 3. Skills Categories (MANDATORY)

**5 Categories (in order):**

#### 1. Programming
**Languages & web frameworks:**
```
Python, C++, C#, JavaScript, TypeScript, SQL, React, Node.js, FastAPI, Flask, NumPy, Pandas, OOP
```
*Reorder by role:* Full-stack → TypeScript/JavaScript/React first; AI → Python first

#### 2. AI/ML Frameworks & Tools
**Actual frameworks/tools (not concepts):**
```
LangChain, LangGraph, MCP, RAG, FAISS, Pinecone, PyTorch, TensorFlow, Scikit-learn, Ollama, Llama, Claude
```
*Add role-specific:* Vercel AI SDK, Mastra (for specific roles)

#### 3. AI Engineering & Patterns
**Concepts, patterns, techniques:**
```
Agentic AI, Multi-Agent Systems, Tool Calling, Streaming, Vector Search, Context Engineering, Prompt Engineering, Model Evaluation, Fine-tuning, LoRA, PEFT, Human-in-the-Loop (HIL), GenAI
```

#### 4. MLOps & Infrastructure
**Deployment, ops, cloud:**
```
Model Deployment, LangSmith, deepeval, MLOps, Monitoring, Observability, AWS, Azure, GCP, Docker, Kubernetes, CI/CD, DevOps, API Design, Scalability, Performance Tuning
```
*Add role-specific:* Vercel, Cloudflare Workers, Terraform, GitHub Actions

#### 5. Data & Domain Expertise
**Data engineering, practices:**
```
Data Processing, Data Pipelines, ETL, Data Integration, Data Annotation, Feature Engineering, Knowledge Graph, Enterprise Systems, Workflow Automation, Operational Efficiency, Responsible AI
```

**NEVER put these in wrong categories:**
- ❌ "Agentic AI" in Frameworks → ✅ Must be in "AI Engineering & Patterns"
- ❌ "Model Deployment" in Frameworks → ✅ Must be in "MLOps & Infrastructure"
- ❌ "Vector Search" in Frameworks → ✅ Must be in "AI Engineering & Patterns"
- ❌ "Tool Calling" in Frameworks → ✅ Must be in "AI Engineering & Patterns"
- ❌ "Streaming" in Frameworks → ✅ Must be in "AI Engineering & Patterns"
- ❌ "Responsible AI" in Frameworks → ✅ Must be in "Data & Domain Expertise"

---

### 4. Forbidden Content (NEVER INCLUDE)

**❌ Location signals in summary:**
- "Open to SF Bay Area opportunities"
- "Willing to relocate to [location]"
- "Available for [location] roles"
- ANY location mention in summary

**❌ Specific user/query counts:**
- "200+ daily users"
- "serving 200+ queries"
- "X daily active users"
- Use instead: "deployed to production", "production users", "production scale"

**❌ Job title copying:**
- If job says "Full-stack Engineer", DON'T use "Full-stack Engineer" in summary
- Always use "AI Software Engineer" regardless of job title

---

### 5. Summary Customization by Role Type

#### **AI Engineer Roles**
```
AI Software Engineer with 5+ years building production systems. Currently developing AI agents and automation tools using LangChain, MCP, and Python that improve operational efficiency by 50-80%. Recent work includes multi-agent systems for analytics and RAG-based diagnostic tools in production. Experience spans developing applications for drones and embedded systems, full-stack development, and distributed AI platforms.
```
**70 words ✅**

#### **Full-Stack Roles**
```
AI Software Engineer with 5+ years building full-stack production systems. Currently developing [THEIR DOMAIN: workflow automation, web applications] using TypeScript, React, Python, and [AI FRAMEWORK] that improve operational efficiency by 50-80%. Recent work includes multi-agent systems and full-stack tools in production. Experience spans developing applications for drones and embedded systems, full-stack web development, and distributed AI agent platforms.
```
**77 words ✅**

#### **Robotics Roles**
```
AI Software Engineer with 5+ years building production systems. Currently developing AI-enabled robotics applications using C++, Python, ROS2, and PX4 that improve system reliability and performance. Recent work includes flight control systems and AI-powered diagnostic tools. Experience spans developing applications for drones and embedded systems, real-time control software, and distributed AI platforms.
```
**65 words ✅**

---

## 📋 Validation Checklist (Before Generating PDF)

### Summary Validation
- [ ] Uses "AI Software Engineer" (not job posting title)
- [ ] Word count: 70-85 words
- [ ] Mentions "developing applications for drones and embedded systems"
- [ ] No location signals
- [ ] No specific user counts (no "200+")
- [ ] Only verified metrics (50-80% efficiency)

### Work Experience Validation
- [ ] Order: Bizgenie → Grid → Freefly → Lumenier → York
- [ ] All dates correct (Stealth: Oct 2025, Grid: Mar 2025, etc.)
- [ ] Bullet counts: 4-3-4-2-2
- [ ] Locked content unchanged (Freefly 2-4, Lumenier 1-2, York 1-2)

### Skills Validation
- [ ] 5 categories in correct order
- [ ] "Agentic AI" in "AI Engineering & Patterns" (not Frameworks)
- [ ] "Model Deployment" in "MLOps & Infrastructure" (not Frameworks)
- [ ] "Vector Search" in "AI Engineering & Patterns" (not Frameworks)
- [ ] "Tool Calling" in "AI Engineering & Patterns" (not Frameworks)
- [ ] "Streaming" in "AI Engineering & Patterns" (not Frameworks)
- [ ] "Responsible AI" in "Data & Domain Expertise" (not Frameworks)

### Projects Validation
- [ ] 3 projects selected
- [ ] Each has Problem/Solution/Impact bullets
- [ ] Using `highlights` array (not `description`)

### File Naming Validation
- [ ] Filename format: `vireshduvvuri_[role].pdf`
- [ ] No company name in filename
- [ ] No date/timestamp in filename
- [ ] Role name is lowercase with hyphens

---

## 🔧 Customization Rules

### What Can Be Customized

**Summary:**
- ✅ Tech stack order (TypeScript first for full-stack, Python first for AI)
- ✅ Domain focus ("enterprise workflow automation", "AI systems", etc.)
- ✅ Current work description (match their domain)

**Skills:**
- ✅ Keyword order within categories (prioritize their tech)
- ✅ Add role-specific keywords (Vercel AI SDK, Mastra, etc.)
- ❌ Never change category structure (always 5 categories)

**Freefly Bullet 1:**
- ✅ Fully customizable (choose variation from baseline)

**Projects:**
- ✅ Select 2-3 most relevant
- ✅ Adjust language to match role domain

### What NEVER Changes

**Summary:**
- ❌ Title must be "AI Software Engineer"
- ❌ Must mention "drones and embedded systems"
- ❌ Must be 70-85 words
- ❌ No location signals

**Work Experience:**
- ❌ Order (Bizgenie → Grid → Freefly → Lumenier → York)
- ❌ Dates
- ❌ Job titles
- ❌ Freefly bullets 2-4 (LOCKED)
- ❌ Lumenier bullets 1-2 (LOCKED)
- ❌ York bullets 1-2 (LOCKED)

**Skills:**
- ❌ Category names
- ❌ Category order
- ❌ Keyword categorization (concepts vs frameworks vs tools)

---

## 🎯 Role-Specific Keywords to Add

### Full-Stack Roles
**Skills to add:**
- AI/ML Frameworks & Tools: Vercel AI SDK, Mastra
- MLOps & Infrastructure: Vercel, Cloudflare Workers, Terraform, GitHub Actions, Infrastructure as Code
- Programming: TypeScript, JavaScript, React, Node.js (move to top)

**Summary adjustments:**
- Add "full-stack" (2x)
- Lead with TypeScript, React, Python
- Mention "enterprise workflow automation" or "web applications"

### AI Engineer Roles
**Skills to add:**
- Keep standard AI/ML Frameworks & Tools
- Emphasize: LangChain, LangGraph, MCP, RAG

**Summary adjustments:**
- Lead with Python, LangChain, MCP
- Mention "AI agents", "multi-agent systems"

### Robotics Roles
**Skills to add:**
- Programming: C++, Python (move to top)
- Add: ROS2, PX4 (in appropriate category)

**Summary adjustments:**
- Lead with C++, Python, ROS2
- Emphasize "real-time systems", "embedded control"

---

## 💾 File Naming Convention

**Resume PDF:**
```
vireshduvvuri_[role].pdf
```

**Rules:**
- ✅ Use descriptive role name (lowercase, hyphenated)
- ✅ Keep it simple and professional
- ❌ NEVER include company name in filename
- ❌ NEVER include date/timestamp in filename

**Examples:**
- ✅ `vireshduvvuri_fullstack-engineer.pdf`
- ✅ `vireshduvvuri_ai-engineer.pdf`
- ✅ `vireshduvvuri_robotics-engineer.pdf`
- ❌ `vireshduvvuri_fullstack-engineer_jinba_2025-02-04.pdf` (has company & date)
- ❌ `resume.pdf` (too generic)
- ❌ `Viresh-Resume.pdf` (wrong format)

**Note:** Company and date are tracked in `job-posting.md`, not in filename

---

## 📊 Metrics Reference (Always Accurate)

**Verified metrics to use:**
- ✅ 50-80% operational efficiency improvements (GridCOP, general)
- ✅ 70% workflow reduction (GridCOP specific)
- ✅ 60% stakeholder deliverable acceleration (GridCOP specific)
- ✅ 50-100 daily queries (GridCOP scale)
- ✅ 40% time reduction (Freefly tool)
- ✅ "Hours to minutes" (general impact)
- ✅ "Deployed to production" (Freefly tool scale)

**NEVER use:**
- ❌ "200+ daily users" (not verified)
- ❌ "200+ daily queries" (not verified)
- ❌ Specific user counts unless verified

---

## 🔍 Quality Control Questions

Before finalizing any resume, ask:

1. **Summary:**
   - Is it "AI Software Engineer" (not copied from job)?
   - Is it 70-85 words?
   - Does it mention "drones and embedded systems"?
   - No location signals?

2. **Work Order:**
   - Is Bizgenie first?
   - Is Grid CoOperator second?

3. **Skills:**
   - Are there 5 categories?
   - Is "Agentic AI" in the right category (Patterns, not Frameworks)?
   - Is "Model Deployment" in the right category (MLOps, not Frameworks)?

4. **Content:**
   - No "200+ users" anywhere?
   - All locked content unchanged?

---

**This is the source of truth for resume generation. Never deviate from these rules.**

**Last Updated:** 2025-02-04
**Version:** 2.0
