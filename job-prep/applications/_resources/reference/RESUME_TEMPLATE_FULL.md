# Resume Template System - Master Reference

**Purpose:** Generate consistent, customizable resumes for AI Engineer, Software Engineer, Forward Deployed Engineer roles

**Core Narrative:** Robotics/Embedded Systems Engineer → Production AI/Software Engineer

---

## TEMPLATE STRUCTURE

### Section Order (NEVER CHANGE)
1. Header (Name, Contact)
2. Summary (NO title/label - start directly with summary)
3. Skills
4. Work Experience
5. Education
6. Projects

---

## STATIC SECTIONS (Never Customize)

### Lumenier Experience (ALWAYS keep these bullets - LOCKED)
```markdown
### **Lumenier** (Sarasota, FL)
_Drone Software Developer, Jul 2020 - Oct 2021_

- Wrote embedded code in C++ to integrate LiDAR and optical flow sensors for obstacle avoidance and position holding with/without GPS under various lighting conditions
- Collaborated with open-source flight control software maintainers for integration, testing, and deployment of autonomous flight algorithms, prototyped innovative features like toss-to-launch for product roadmap development
```

**Why static:**
- Shows embedded/robotics background with real technical depth
- "Open-source flight control software maintainers" (not "PX4") - readable by non-robotics people
- Establishes autonomous systems credibility
- From timeline.json detailedResponsibilities

---

### York Exponential Experience (ALWAYS keep these bullets - LOCKED)
```markdown
### **York Exponential** (York, PA)
_Software Engineer - R&D, Aug 2018 - May 2020_

- Developed prototype software for in-house autonomous surveillance mobile robots using ROS2, SLAM, and computer vision technologies
- Built Human Machine Interface for Universal Robot welding applications using Python and Kivy framework, implemented multi-robot control systems with platform independence
```

**Why static:**
- Shows robotics → software transition beginning
- Autonomous robots + HMI = breadth of experience
- From timeline.json detailedResponsibilities
- Establishes ROS2/robotics foundation

---

### Education (ALWAYS keep as-is)
```markdown
## EDUCATION

### **Washington State University** (Pullman, WA)
_Master of Science in Computer Science, Jan 2015 - Jan 2017_

### **GITAM University** (Visakhapatnam, India)
_Bachelor of Technology in Information Technology, Jan 2011 - Jan 2015_
```

---

## CUSTOMIZABLE SECTIONS (Tailor Per Job)

### Summary (Customize emphasis based on role)

**IMPORTANT:** NO title/label field - professional summary starts immediately after contact info. This avoids mismatch between label and actual job titles.

**Template Structure:**
`[Title] specializing in [focus area], with 5+ years [relevant experience]. [Builder/Technical strength] with proven track record [key achievement]. [Technical depth or domain knowledge].`

**Example Variations:**

**AI Engineer Focus:**
```
AI Engineer specializing in designing, developing, and deploying production-ready AI agents, with 5+ years shipping GenAI solutions from rapid prototyping to production deployment. Builder-first mindset with proven track record delivering agent-based systems that improved business efficiency by 50-80% within 3 months, establishing evaluation frameworks, model governance, and scalable AI infrastructure on AWS/Azure.
```

**Software Engineer Focus:**
```
Software Engineer with 5+ years building production systems across AI agents, embedded systems, and full-stack applications. Strong track record shipping solutions that improved operational efficiency by 50-80%, with expertise in Python, C++, and cloud deployment (AWS). Proven ability to take projects from prototype to production with focus on scalability, reliability, and maintainability.
```

**Product Engineer Focus:**
```
Product Engineer with 5+ years building internal tools and AI-powered systems that drive operational efficiency. Specialized in multi-agent workflows, full-stack development, and turning AI prototypes into reliable production systems. Track record of 70-80% efficiency improvements through AI-first process redesign.
```

---

### Skills Section (Reorder based on job requirements)

**Skill Categories (pick 3-5 most relevant, reorder to match job):**

1. **Programming Languages**
   - Python, C++, JavaScript, TypeScript, SQL, React, NumPy, Pandas

2. **AI Agent Development** (Lead with this for AI roles)
   - Agentic AI, LangChain, LangGraph, Multi-Agent Systems, Agent-to-Agent (A2A), AI Orchestration, GenAI, RAG, Prompt Engineering, Model Evaluation, Model Selection, Model Context Protocol (MCP), Human-in-the-Loop

3. **AI/ML Frameworks**
   - PyTorch, TensorFlow, Scikit-learn, MLOps, Context Engineering, Model Deployment, Responsible AI, Feature Engineering

4. **Cloud & Infrastructure**
   - AWS, Azure, Docker, Kubernetes, CI/CD Pipelines, API Design, DevOps, Monitoring, Performance Tuning, Scalability, Observability

5. **Data & Databases**
   - Vector Databases (FAISS, Pinecone), SQL, PostgreSQL, Data Pipelines, Data Processing, Data Integration, Analytics

6. **Backend & Full-Stack**
   - FastAPI, Flask, REST APIs, Microservices, WebSocket, SQL, Docker

7. **Robotics/Embedded** (Use for robotics roles, or last if AI role)
   - PX4, ROS2, Embedded Systems, C++, Real-time Systems, Sensor Fusion, Computer Vision

**Example Order for AI Role:**
```
## SKILLS

* **Programming:** Python, C++, JavaScript, SQL, FastAPI, Flask, React
* **AI Agent Development:** LangChain, LangGraph, Multi-Agent Systems, RAG, Prompt Engineering, MCP
* **AI/ML Frameworks:** PyTorch, TensorFlow, MLOps, Model Deployment
* **Cloud & Infrastructure:** AWS, Azure, Docker, CI/CD, Monitoring, Observability
* **Data & Databases:** Vector Databases (FAISS), SQL, PostgreSQL, Data Pipelines
```

**Example Order for Software Role:**
```
## SKILLS

* **Programming:** Python, C++, JavaScript, TypeScript, SQL, React
* **Backend & Full-Stack:** FastAPI, Flask, REST APIs, Microservices, Docker
* **Cloud & Infrastructure:** AWS, Docker, CI/CD, Monitoring, Observability
* **AI/ML:** LangChain, RAG, Prompt Engineering, Model Deployment
* **Data & Databases:** SQL, PostgreSQL, Data Pipelines, Analytics
```

---

### Grid CoOperator Experience (CUSTOMIZE ALL 3 BULLETS)

**Template Structure:**
- **Bullet 1:** What you built + architecture + efficiency gain
- **Bullet 2:** Technical implementation + infrastructure/deployment
- **Bullet 3:** Iteration/governance/monitoring OR additional technical depth

**IMPORTANT:** Date is **03/2025 – Present** (not 07/2025)

**AI Engineer Version:**
```markdown
### **Grid CoOperator** (Seattle, WA)
_AI Engineer, 03/2025 - Present_

- Built and shipped production AI agent system from prototype to deployment, designing multi-agent architecture automating complex analyst workflows with 70% manual effort reduction within 2 months
- Designed and deployed AI orchestration infrastructure using LangChain on AWS with cost monitoring and observability, built comprehensive evaluation datasets measuring agent performance and cost efficiency across 50-100 daily queries
- Shipped iterative improvements optimizing agent performance and cost, built monitoring dashboards tracking business outcomes, established AI governance practices including bias detection and safety guardrails
```

**Software Engineer Version:**
```markdown
### **Grid CoOperator** (Seattle, WA)
_Software Engineer, 03/2025 - Present_

- Built full-stack AI application using LangChain framework with intelligent SQL database querying, dual validation system, and context-aware response generation for smart grid utility data analysis
- Reduced analyst research time by 70% by automating SQL query generation and online context gathering, eliminating manual database querying required to understand power grid visualizations
- Deployed production system on AWS with FastAPI backend, handling 50-100 daily queries with monitoring and error handling
```

**Product Engineer Version (Qurrent-style):**
```markdown
### **Grid CoOperator** (Seattle, WA)
_AI Engineer, 03/2025 - Present_

- Built full-stack AI agent using LangChain framework with intelligent SQL database querying, dual validation system, and context-aware response generation for smart grid utility data analysis
- Reduced analyst research time by 70% by automating SQL query generation and online context gathering, eliminating manual database querying required to understand power grid visualizations
- Designed multi-agent orchestration where LLM analyzes queries, queries SQL database for additional context, validates both SQL and fetched data, then generates complete responses
- Deployed production system on AWS with FastAPI backend, handling 50-100 daily queries with monitoring and error handling
```

---

### Freefly Experience (CUSTOMIZE FIRST BULLET ONLY - Last 3 are STATIC)

**CRITICAL:** Freefly bullets now match LinkedIn progression (Software Engineer 2021-2023 → Senior 2023-2025)

**Structure:**
- **Bullet 1 (Customizable):** AI diagnostic tools - adjust emphasis for role type
- **Bullet 2 (STATIC):** Flight control, payload integration (robotics background)
- **Bullet 3 (STATIC):** Release management (software engineering practices)
- **Bullet 4 (STATIC):** Automated systems, knowledge base (shows initiative)

**Bullets 2-4 (ALWAYS USE THESE - LOCKED):**
```markdown
- Contributed to drone platform codebases implementing new features and optimizations for flight control systems and payload integration across multiple product lines, managed software integration projects from planning through release
- Led release management for drone platforms overseeing testing phases from alpha through production deployment, coordinating firmware updates and executing comprehensive testing protocols with cross-functional teams
- Built automated systems to process complex technical data and identify system failures, developing knowledge base enhancements and support tools that streamlined operations
```

**Bullet 1 Variations (Customize based on role):**

**AI Engineer Focus:**
```markdown
- Built and deployed GenAI-powered agent for automated log analysis from concept to production, integrating foundation model APIs (Ollama, Llama 3.2) with evaluation frameworks and model governance practices, serving 200+ daily queries
```

**Software Engineer / Product Engineer Focus (DEFAULT):**
```markdown
- Developed comprehensive diagnostic and analysis tools for engineering teams, independently designed and built AI-powered diagnostic tool using Python and modern LLM frameworks from requirements to production, improving customer self-service capabilities and team response times by 40%
```

**Notes:**
- Bullet 1 can emphasize: AI/LLM details OR full-stack implementation OR efficiency metrics
- Bullets 2-4 are LOCKED - they show your real progression at Freefly and match LinkedIn exactly
- This structure shows: AI tool builder → Flight control engineer → Release manager → Process improver

---

### Projects Section (Select 2-3 most relevant)

**Format:** Problem-Solution-Impact (shows business thinking + technical execution)

**Available Projects:**

**1. GridCOP (ALWAYS include for AI roles)**
```markdown
### GridCOP: Smart Grid Analytics Agent | **Grid CoOperator**

- **Problem:** Power grid analysts needed automated database querying and intelligent insights to understand complex data patterns beyond basic visualizations

- **Solution:** Developed A2A multi-agent system using LangChain orchestration and MCP where specialized agents coordinate tasks through prompt engineering strategies, implemented RAG and vector search (FAISS) for intelligent querying, implemented model evaluation frameworks to monitor quality and cost metrics, deployed on AWS with observability and logging

- **Impact:** Enhanced analyst productivity by 70% through AI co-pilot that augments domain experts with automated workflows, implemented human-in-the-loop (HIL) evaluation and testing pipelines for production-ready AI systems with robust error handling through rapid iteration
```

**2. Production System Optimization Tool (Include for AI or full-stack roles)**
```markdown
### Production System Optimization Tool | **Freefly Systems**

- **Problem:** Manual system analysis taking hours of expert time, creating bottlenecks in product development and customer support resolution

- **Solution:** Built full-stack application with React frontend, Python Flask backend, integrated foundation model APIs (Ollama and Llama 3.2) for real-time log processing and interactive analysis using prompt engineering and model evaluation

- **Impact:** Transformed expert analysis from hours to minutes, deployed to production serving 200+ daily queries with significant performance improvements through rapid iteration and continuous optimization
```

**3. AI Travel Planner (Include for prototyping/demo roles)**
```markdown
### AI Travel Planner Agent | **Personal**

- **Problem:** Manual travel planning requiring hours of research across multiple sources with inconsistent and outdated information

- **Solution:** Built AI agent using Claude 3.5 Sonnet, LangChain, Streamlit, and DuckDuckGo Search API for personalized itinerary generation using prompt engineering techniques

- **Impact:** Demonstrated end-to-end AI application development, learned conversational AI patterns and real-time data integration techniques through iterative development
```

**Selection Guide:**
- AI Engineer: All 3 (shows AI breadth)
- Software Engineer: GridCOP + Production Tool (shows full-stack + production)
- Product Engineer (internal tools): GridCOP + Production Tool (shows efficiency focus)
- Startup/Demo roles: All 3 (shows rapid prototyping)

**Format Benefits:**
- Problem: Shows you understand business context
- Solution: Shows technical implementation details
- Impact: Shows quantifiable results (recruiters love this)

---

## CUSTOMIZATION WORKFLOW

### Step 1: Analyze Job Posting
Identify:
- Primary role type (AI Engineer, Software Engineer, Product Engineer)
- Key technologies mentioned
- Emphasis (AI agents, full-stack, internal tools, etc.)

### Step 2: Customize Summary
Pick template that matches emphasis, adjust specific keywords

### Step 3: Reorder Skills
Put their required skills first (usually 3-5 categories)

### Step 4: Customize Grid CoOperator (3 bullets)
- AI role: Use AI Engineer version (architecture, orchestration, governance)
- Software role: Use Software Engineer version (full-stack, technical implementation)
- Product role: Use Product Engineer version (efficiency, multi-agent, production)

### Step 5: Customize Freefly (First bullet only)
- AI role: Emphasize agent design, evaluation, governance
- Software/Product role: Show AI tool + embedded work (breadth)
- Keep last 2 bullets static (cross-functional + systems integration)

### Step 6: Select Projects (2-3)
- AI roles: GridCOP + Drone Tool + Travel Planner
- Software/Product roles: GridCOP + Drone Tool

---

## KEYWORD OPTIMIZATION ZONES

**These are the ONLY sections where you inject job-specific keywords:**

1. **Summary** - Add 1-2 specific keywords from job posting
2. **Skills** - Reorder to match their priorities
3. **Grid CoOperator bullets** - Use their language (e.g., "multi-agent" vs "agentic AI")
4. **Freefly first 2 bullets** - Adjust emphasis (AI vs full-stack vs process)

**DO NOT keyword-stuff in:**
- Static Lumenier/York bullets
- Education
- Static Freefly bullets (last 2)

---

## ANTI-PATTERNS (Things to NEVER do)

❌ Change Lumenier/York experience
❌ Change dates
❌ Change last 2 Freefly bullets (cross-functional + systems integration)
❌ Add fake projects
❌ Claim technologies you haven't used
❌ Change education details
❌ Create more than 3 bullets for Grid CoOperator
❌ Use "Highlights:" labels (just use bullets directly)

---

## QUALITY CHECKLIST

Before generating PDF:
- [ ] NO title/label field (avoid mismatch)
- [ ] Summary emphasizes right area (AI/software/product)
- [ ] Skills ordered with job requirements first
- [ ] Grid CoOperator bullets use appropriate version
- [ ] Freefly first 2 bullets customized, last 2 static
- [ ] 2-3 projects selected based on role
- [ ] No "Highlights:" labels
- [ ] Lumenier/York unchanged
- [ ] Education unchanged
- [ ] No fake claims or unsupported keywords

---

## EXAMPLE: Applying Template to Qurrent Role

**Job:** Product Engineer (internal AI tools, multi-agent, efficiency)

**Customizations:**
1. Summary: Product Engineer version (efficiency focus)
2. Skills: Lead with AI Agent Development, then Full-Stack, then Cloud
3. Grid CoOperator: Use Product Engineer version (4 bullets, shows multi-agent orchestration)
4. Freefly: Show both AI tool + embedded work (demonstrates breadth)
5. Projects: GridCOP + Drone Tool (both internal efficiency tools)

**Result:** Resume emphasizes internal tools, efficiency gains, multi-agent systems, full-stack capability, while still showing robotics background.

---

**This template maintains your core narrative while allowing strategic customization for different role types.**

---

## 📊 CUSTOMIZATION PRIORITY (Based on 2025 ATS Best Practices)

### High Priority (Change Every Job - 5-10 min)

**1. Summary (CRITICAL)**
- Why: "Prime real estate" - ATS and recruiters read this first
- How: Swap template based on role type (AI/Software/Product Engineer)
- Impact: Very High - determines if resume gets read further

**2. Skills Section Order (CRITICAL)**
- Why: ATS scans for keyword matches, average job has 43 keywords
- How: Reorder categories to put job requirements first (keep same skills)
- Impact: Very High - affects ATS scoring
- Effort: 30 seconds

**3. Grid CoOperator Bullets (HIGH)**
- Why: Most recent role = most scrutiny, shows current capabilities
- How: Use appropriate version (AI Engineer / Software Engineer / Product Engineer)
- Impact: High - shows what you can do NOW
- Effort: 2 minutes (copy-paste from template)

---

### Medium Priority (Change Some Jobs - 2-5 min)

**4. Freefly Bullet 1 (OPTIONAL)**
- Why: Can adjust AI tool emphasis for role
- How: Emphasize LLM details vs full-stack vs efficiency metrics
- Impact: Medium - adds nuance but not critical
- Effort: 1-2 minutes
- Note: Bullets 2-4 are LOCKED (flight control, release mgmt, automation)

**5. Projects Selection (OPTIONAL)**
- Why: Shows breadth, can highlight different aspects
- How: Pick 2-3 from GridCOP, Drone Tool, Travel Planner
- Impact: Medium - demonstrates range
- Effort: 30 seconds

---

### Locked Sections (NEVER Change)

**Static Elements:**
- ✅ Freefly bullets 2-4 (flight control, release management, automation)
- ✅ Lumenier (embedded systems, open-source collaboration)
- ✅ York (autonomous robots, HMI, ROS2)
- ✅ Education
- ✅ Contact information
- ✅ Dates (employment timeline)

**Why locked:**
- Shows authentic technical depth
- Matches LinkedIn exactly
- Establishes robotics → AI transition narrative
- From timeline.json (source of truth)

---

## ⚡ 10-Minute Customization Workflow

```
1. Read job posting (2 min)
   → Identify 5-7 key requirements
   → Note their exact language (e.g., "multi-agent" vs "agentic AI")

2. Update Summary (1 min)
   → Copy appropriate template (AI/Software/Product)
   → Replace 1-2 keywords with their language

3. Reorder Skills (30 sec)
   → Move their priority categories to top
   → Keep all skills, just change order

4. Grid CoOperator (2 min)
   → Use AI Engineer version OR Software/Product version
   → Paste 3-4 bullets

5. Optional: Freefly Bullet 1 (1 min)
   → Adjust if emphasis needs shift
   → Skip if default works

6. Optional: Projects (30 sec)
   → Keep GridCOP + Drone Tool (most jobs)
   → Add Travel Planner if prototyping role

7. Verify (2 min)
   → Static sections unchanged
   → No typos
   → Keywords present

8. Generate PDF (1 min)
   → Done!
```

---

## 🎯 Source of Truth

All static sections derived from:
- **`/data/timeline.json`** - detailedResponsibilities (actual work done)
- **LinkedIn profile** - Freefly progression matches exactly
- **Best practices 2025** - ATS optimization strategy

When in doubt, refer to timeline.json for authentic experience details.

---

## 🔧 MCP Resume Generator Format

**CRITICAL:** The MCP resume generator uses `basics.summary` field for professional summary:

```json
{
  "selectedTemplate": 1,
  "basics": {
    "name": "Viresh Duvvuri",
    "summary": "Your professional summary text here...",
    "email": "vireshduvvuri@gmail.com",
    "phone": "+1-509-964-5469",
    "website": "https://www.linkedin.com/in/viresh-duvvuri/",
    "location": {"address": "Seattle, WA"}
  },
  "skills": [...],
  "work": [...],
  "education": [...],
  "projects": [
    {
      "name": "Project Name",
      "keywords": ["Tech1", "Tech2", "Tech3"],
      "highlights": [
        "Problem: Description of the problem being solved",
        "Solution: Technical implementation details",
        "Impact: Quantifiable results and business impact"
      ]
    }
  ]
}
```

**Key Points:**
- Use `"basics.summary"` field for professional summary (NOT `"awards"`)
- NO `"label"` field (avoid title/label mismatch with actual job titles)
- Use LinkedIn URL instead of portfolio website: `https://www.linkedin.com/in/viresh-duvvuri/`
- Location: `"Seattle, WA"` (no "Open to relocation" text)
- **Projects MUST use `highlights` array** with Problem-Solution-Impact bullets (NOT single `description` field)
- Template #1 is recommended
- All dates in format: "03/2025" not "07/2025"

**MCP Server Styling (Modified):**
- Contact info line (location | phone | email | LinkedIn) is now `\footnotesize\textit{}` (smaller, italic)
- Creates visual hierarchy: Name (huge, bold) → Summary (small, regular) → Contact (footnotesize, italic)
- Modified in `/home/virus/Documents/repo/resumake-mcp/lib/latex-generator.js` lines 85-86

---

## 🔍 POST-GENERATION REVIEW CHECKLIST

**After generating PDF, LLM MUST extract text and verify ALL of the following:**

### Header Section
- [ ] **Name**: "Viresh Duvvuri" appears at top, large and bold
- [ ] **Contact line**: `Seattle, WA | +1-509-964-5469 | vireshduvvuri@gmail.com | https://www.linkedin.com/in/viresh-duvvuri/`
  - [ ] NO "(Open to relocation)" text
  - [ ] LinkedIn URL is correct with `www.`
  - [ ] Contact line should appear smaller/italicized compared to summary (visual check)
- [ ] **NO title/label** between name and summary (e.g., no "Product Engineer" label line)

### Professional Summary
- [ ] **Summary present**: Professional summary appears immediately after contact line
- [ ] **Summary text**: Starts with appropriate role focus (Product Engineer/AI Engineer/Software Engineer)
- [ ] **Visual hierarchy**: Summary is normal body text size (NOT smaller than work experience bullets)

### Skills Section
- [ ] **Order matches job**: First skill category matches highest job priority
- [ ] **All categories present**: AI & LLMs, Full-Stack Development, Cloud & Infrastructure, Additional

### Work Experience
- [ ] **Grid CoOperator date**: "03/2025 - Present" (NOT 07/2025)
- [ ] **Freefly dates**: "11/2021 - 10/2025"
- [ ] **Lumenier experience**: Both bullets present and unchanged from template
  - [ ] Embedded code, LiDAR, optical flow sensors
  - [ ] "open-source flight control software maintainers" (NOT "PX4")
- [ ] **York experience**: Both bullets present and unchanged from template
  - [ ] ROS2, SLAM, computer vision
  - [ ] HMI for Universal Robot

### Projects Section (CRITICAL)
- [ ] **GridCOP has 3 bullets**:
  - [ ] First bullet starts with "Problem:"
  - [ ] Second bullet starts with "Solution:"
  - [ ] Third bullet starts with "Impact:"
- [ ] **Production System Optimization Tool has 3 bullets**:
  - [ ] "Problem:", "Solution:", "Impact:" format
- [ ] **AI Travel Planner has 3 bullets**:
  - [ ] "Problem:", "Solution:", "Impact:" format
- [ ] **NOT one long paragraph per project** - must be separate bullets

### Education
- [ ] **Washington State University**: Master of Science, Computer Science, 2015-2017
- [ ] **GITAM University**: Bachelor of Technology, Information Technology, 2011-2015

### General Quality Checks
- [ ] **No typos** in contact information
- [ ] **No placeholder text** (e.g., "[Your text here]", "TODO")
- [ ] **Consistent formatting** across all sections
- [ ] **Page length**: ~2 pages (not excessive whitespace or overflow)

---

## 🤖 LLM Review Protocol

**After generating PDF:**

1. **Extract text**: Use `pdftotext <pdf_path> -` to get full text
2. **Run through checklist**: Verify EVERY item above
3. **Report findings**:
   - ✅ All checks passed
   - ⚠️ Issues found: [list specific problems]
4. **If issues found**: Regenerate with corrections

**Example review output:**

```
## PDF Review Results

✅ Header: Name, contact line correct, no title label
✅ Summary: Present, appropriate for role
✅ Skills: Ordered correctly for AI role
✅ Work Experience: All dates correct, Lumenier/York unchanged
⚠️ Projects: GridCOP is one paragraph instead of 3 bullets
❌ FAILED: Must regenerate with projects.highlights array

Regenerating...
```

---

**This template maintains your core narrative while allowing strategic customization for different role types.**
