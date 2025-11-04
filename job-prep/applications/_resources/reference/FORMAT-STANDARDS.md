# Resume Format Standards

**Source:** `Viresh-Duvvuri-Resume-AI-Engineer.pdf` (baseline)
**Purpose:** Ensure consistency across all resume generations
**Rule:** ALL resumes must follow this format exactly

---

## 📋 Format Rules

### Work Experience Section

**Bullet Count Per Role:**
- **Grid CoOperator (Current):** 3 bullets
- **Freefly Systems (Senior):** 3 bullets
- **Lumenier:** 3 bullets
- **York Exponential:** 2 bullets

**Total:** 11 bullets across all work experience

**Bullet Structure:**
- Start with action verb (Led, Architected, Built, Implemented, etc.)
- Include specific technologies used
- Include quantified impact (percentage, timeframe, scale)
- Keep bullets to 2-3 lines maximum

**Example:**
```
Led design and deployment of domain-specific agentic AI agents for smart grid analytics,
collaborating cross-functionally with business stakeholders to translate operational
requirements into multi-agent systems using LangChain orchestration and prompt engineering
strategies that reduced analyst workflows by 70% within 2 months through rapid iteration
```

---

### Projects Section

**Requirements:**
- **Minimum:** 3 projects
- **Maximum:** 4 projects (only if highly relevant)
- **Each project:** 3 bullets exactly (Problem → Solution → Impact)

**Project Structure:**
```json
{
  "name": "Project Name | Company/Context",
  "highlights": [
    "Problem: [Clear description of the problem being solved]",
    "Solution: [Technologies and approach used, specific implementation details]",
    "Impact: [Quantified results, metrics, what was learned or achieved]"
  ],
  "keywords": ["Tech1", "Tech2", "Tech3", "Tech4"]
}
```

**Bullet Format Rules:**
- **Bullet 1 (Problem):** Start with "Problem:", describe the pain point clearly
- **Bullet 2 (Solution):** Start with "Solution:", list technologies and approach
- **Bullet 3 (Impact):** Start with "Impact:", provide quantified results or learnings

**Example:**
```
GridCOP: Smart Grid Analytics Agent | Grid CoOperator

• Problem: Power grid analysts needed automated database querying and intelligent
  insights to understand complex data patterns beyond basic visualizations

• Solution: Developed A2A multi-agent system using LangChain orchestration and MCP
  where specialized agents coordinate tasks through prompt engineering strategies,
  implemented RAG and vector search (FAISS) for intelligent querying, implemented
  model evaluation frameworks to monitor quality and cost metrics, deployed on AWS
  with observability and logging

• Impact: Enhanced analyst productivity by 70% through AI co-pilot that augments
  domain experts with automated workflows, implemented human-in-the-loop (HIL)
  evaluation and testing pipelines for production-ready AI systems with robust
  error handling through rapid iteration
```

---

### Skills Section

**Required Categories (in order):**
1. **Programming** - Languages and core frameworks
2. **AI/ML Frameworks** - AI-specific tools and techniques
3. **Cloud & Infrastructure** - Cloud platforms and DevOps tools
4. **Data & Analytics** - Data processing and domain-specific skills

**Customization:**
- Category names can change based on role (e.g., "Robotics & Embedded" for robotics roles)
- Keywords within categories should be reordered based on job requirements
- Add role-specific keywords from job posting

**Keyword Guidelines:**
- Use comprehensive lists (15-25 keywords per AI/ML category)
- Include specific tool names (FAISS, Pinecone, etc.)
- Include methodologies (Prompt Engineering, Model Evaluation, etc.)
- Include deployment terms (MLOps, Model Deployment, etc.)

**Example:**
```json
{
  "name": "AI/ML Frameworks",
  "keywords": [
    "Agentic AI",
    "LangChain",
    "LangGraph",
    "Multi-Agent Systems",
    "MCP (Model Context Protocol)",
    "RAG",
    "Context Engineering",
    "Prompt Engineering",
    "Model Evaluation",
    "MLOps",
    "GenAI",
    "FAISS",
    "Pinecone",
    "PyTorch",
    "TensorFlow",
    "Scikit-learn",
    "Feature Engineering",
    "Human-in-the-Loop (HIL)",
    "Model Deployment",
    "Responsible AI",
    "Vector Search"
  ]
}
```

---

### Summary Section

**Format:** 3-sentence paragraph

**Structure:**
1. **Sentence 1:** Role title + specialization + years of experience + key approach
2. **Sentence 2:** Leadership/collaboration + specific impact metrics + technologies
3. **Sentence 3:** Additional technical depth or domain breadth

**Pattern:**
```
[Role] specializing in [specialization], with [X years] [approach/methodology].
[Leadership aspect] in [what you did] that [impact metrics], [establishing/building]
[systems/frameworks] for [outcome] on [platforms]. [Additional skills/breadth].
```

**Example:**
```
AI Engineer specializing in multi-agent systems and AI orchestration, with 5+ years
developing production GenAI solutions through rapid prototyping, iteration, and context
engineering. Led cross-functional teams in deploying AI agents that improved efficiency
by 50-80% within 3 months, establishing MLOps pipelines and evaluation frameworks for
scalable AI solutions on AWS/Azure.
```

**Customization Rules:**
- Always change role title to match job posting
- Update specialization to match job focus
- Reorder technologies mentioned to prioritize job requirements
- Keep metrics consistent (50-80%, 70%, 200+ queries, 99% uptime)

---

### Education Section

**Format:** Standard, always at the bottom

**Structure:**
```json
{
  "institution": "University Name",
  "area": "Major",
  "studyType": "Degree Type",
  "startDate": "Mon YYYY",
  "endDate": "Mon YYYY",
  "location": "City, State/Country"
}
```

**Rules:**
- Always include both degrees (Master's and Bachelor's)
- Keep dates consistent (Jan 2015, Jan 2017, etc.)
- No GPA or coursework details

---

## 🎯 Customization Points (What Changes Per Application)

### Must Customize:
1. **Summary** - Change role title, reorder technologies, emphasize relevant skills
2. **Skills Order** - Reorder keywords within categories to match job priorities
3. **Work Bullets** - Emphasize relevant bullets, add job-specific keywords
4. **Project Selection** - Choose 3 most relevant projects for the role

### Never Change:
1. ❌ Employment dates
2. ❌ Job titles
3. ❌ Company names
4. ❌ Core metrics (70%, 80%, 200+ queries, etc.)
5. ❌ Bullet count structure (3-3-3-2 for work, 3 per project)

---

## ✅ Quality Checklist

Before generating PDF, verify:

**Structure:**
- [ ] Work experience: 3-3-3-2 bullet pattern
- [ ] Projects: 3 projects with 3 bullets each (Problem/Solution/Impact format)
- [ ] Skills: 4 categories with comprehensive keywords
- [ ] Summary: 3-sentence paragraph with role title and metrics

**Content:**
- [ ] Summary mentions job title from posting
- [ ] Skills ordered by job priority
- [ ] Work bullets emphasize relevant experience
- [ ] Projects selected for maximum relevance
- [ ] All dates consistent with LinkedIn

**Format:**
- [ ] Uses `highlights` array for project bullets (not `description`)
- [ ] Each project bullet starts with "Problem:", "Solution:", or "Impact:"
- [ ] Keywords array included for each project
- [ ] selectedTemplate: 1

---

## 🔄 Using the Baseline

**Workflow:**
1. Copy `baseline-resume-data.json` to `{company-role}/resume-data.json`
2. Customize summary (change role title, reorder tech)
3. Reorder skills keywords (match job priorities)
4. Emphasize relevant work bullets (can modify wording to add keywords)
5. Select 3 most relevant projects
6. Verify format standards checklist
7. Generate PDF

**Don't Start From Scratch:**
- ❌ Don't use `_template/resume-data.json` with placeholders
- ✅ Always start from `baseline-resume-data.json`
- ✅ Modify only what needs customization
- ✅ Keep the proven structure intact

---

## 📊 Format Consistency Examples

### Good Example (Follows Standards):
```json
"highlights": [
  "Problem: Power grid analysts needed automated database querying...",
  "Solution: Developed A2A multi-agent system using LangChain...",
  "Impact: Enhanced analyst productivity by 70% through AI co-pilot..."
]
```

### Bad Example (Wrong Format):
```json
"description": "Built multi-agent system that reduced workflows by 70%",
"highlights": [
  "Architected system with LangChain",
  "Deployed on AWS with monitoring",
  "Improved productivity metrics"
]
```
❌ Wrong: Uses `description` field, doesn't follow Problem/Solution/Impact structure

---

## 📝 Notes

- **Why 3 bullets per project?** Tells complete story: Problem → Solution → Impact
- **Why comprehensive skill lists?** ATS keyword matching + shows breadth
- **Why consistent structure?** Professional polish + easy to maintain
- **Why start from baseline?** Proven format that works + saves time

**This format has been validated through successful applications. Don't deviate without good reason.**
