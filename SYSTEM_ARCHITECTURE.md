# System Architecture - Portfolio & Job Prep Hub

**Repository:** `per_wesite` (Dual-Purpose System)
**Created:** 2025-11-03
**Purpose:** Production portfolio website + Comprehensive job application system

---

## 🎯 System Overview

This repository serves two distinct but complementary purposes:

1. **🌐 Portfolio Website** - Live production website showcasing AI/robotics work
2. **🏭 Job Prep System** - Complete workflow for resumes, applications, interviews, and job search

```mermaid
graph TB
    subgraph "Repository Structure"
        ROOT[per_wesite Repository]

        ROOT --> WEBSITE[Portfolio Website<br/>Production Files]
        ROOT --> JOBPREP[Job Prep System<br/>Application Materials]
        ROOT --> INTERVIEW[Interview Prep<br/>Company-Specific]
        ROOT --> PRACTICE[Practice Problems<br/>General Coding]
        ROOT --> CONFIG[Configuration<br/>.claude, .netlify]

        WEBSITE --> WEB_HTML[index.html]
        WEBSITE --> WEB_CSS[css/]
        WEBSITE --> WEB_JS[js/]
        WEBSITE --> WEB_DATA[data/ JSON files]

        JOBPREP --> APPS[applications/]
        JOBPREP --> GUIDES[guides/]
        JOBPREP --> CONTEXT[context/]

        INTERVIEW --> COMPANIES[companies/]
        INTERVIEW --> MOCKS[mock-interviews/]

        CONFIG --> CLAUDE[.claude/]
        CONFIG --> NETLIFY[.netlify/]
    end

    style WEBSITE fill:#e1f5ff
    style JOBPREP fill:#fff4e1
    style INTERVIEW fill:#ffe1f5
    style PRACTICE fill:#e1ffe1
    style CONFIG fill:#f5f5f5
```

---

## 📊 Detailed System Architecture

### 1. Portfolio Website (Production)

**Purpose:** Live website showcasing journey from robotics to AI

```mermaid
graph LR
    subgraph "Portfolio Website Flow"
        USER[Visitor] --> HTML[index.html]
        HTML --> CSS[Styling<br/>css/main.css]
        HTML --> JS[Interactions<br/>js/main.js]
        JS --> DATA[Content<br/>data/*.json]

        DATA --> PROFILE[profile.json<br/>Personal Info]
        DATA --> SKILLS[skills.json<br/>Tech Stack]
        DATA --> TIMELINE[timeline.json<br/>Career Path]
        DATA --> PROJECTS[projects.json<br/>Project Details]

        CSS --> RESPONSIVE[Responsive Design<br/>Mobile-Friendly]
        JS --> DYNAMIC[Dynamic Loading<br/>Real-time Updates]
    end

    style HTML fill:#4CAF50
    style DATA fill:#2196F3
```

**Key Features:**
- Static HTML/CSS/JS (no build step needed)
- JSON-driven content (easy updates)
- Responsive design
- No external dependencies

**Content Management:**
```
data/
├── profile.json      → Personal information
├── skills.json       → Skills and technologies
├── timeline.json     → Career timeline
└── projects.json     → Project showcase
```

---

### 2. Job Prep System (Application Workflow)

**Purpose:** Fast, consistent job applications with 20-minute turnaround

```mermaid
graph TD
    START[New Job Opportunity] --> ANALYZE[Analyze Job Posting<br/>Extract requirements]
    ANALYZE --> FIT{Fit Assessment<br/>70%+ match?}

    FIT -->|Yes| COPY[Copy Template<br/>cp _template/ company-role/]
    FIT -->|No| BUILD[Build Missing Skills<br/>1-3 day projects]
    BUILD --> COPY

    COPY --> EDIT1[Edit job-posting.md<br/>5 min]
    EDIT1 --> EDIT2[Customize resume-data.json<br/>10 min]
    EDIT2 --> GENERATE[Generate PDF<br/>MCP resume tool<br/>3 min]
    GENERATE --> REVIEW[Review & Approve<br/>2 min]
    REVIEW --> APPLY[Apply + Network<br/>LinkedIn outreach]
    APPLY --> TRACK[Update Master Tracker<br/>applications/README.md]

    style START fill:#4CAF50
    style GENERATE fill:#FF9800
    style APPLY fill:#2196F3
    style TRACK fill:#9C27B0
```

**Workflow Details:**

#### Phase 1: Job Analysis (2-3 min)
```bash
# Read job posting
# Extract: Required skills, preferred skills, keywords
# Assess: Fit percentage (40-95%)
# Decide: Apply now | Build skills | Skip
```

#### Phase 2: Setup Application Folder (30 sec)
```bash
cp -r job-prep/applications/_template/ \
      job-prep/applications/{company-role}/
```

#### Phase 3: Customize Content (15 min)
```
1. job-posting.md (5 min)
   - Job details
   - Fit assessment
   - Customization strategy

2. resume-data.json (10 min)
   - Summary (match their language)
   - Skills (reorder for relevance)
   - Work highlights (emphasize relevant projects)
   - Projects (select 3 most relevant)
```

#### Phase 4: Generate Resume (3 min)
```bash
# Using MCP resume generator tool
mcp__resume-generator__generate_resume(
    resumeData: {json data},
    filename: "viresh-duvvuri-{unique-id}",
    folderPath: "company-role"
)
```

#### Phase 5: Apply & Track (2 min)
```
1. Submit application
2. Update master tracker (applications/README.md)
3. Network on LinkedIn (within 24 hours)
4. Set follow-up reminders
```

---

### 3. Application Tracking System

```mermaid
graph TB
    subgraph "Application Lifecycle"
        NEW[New Application] --> RESEARCH[Status: Researching]
        RESEARCH --> APPLIED[Status: Applied]
        APPLIED --> SCREEN[Status: Screening]
        SCREEN --> INTERVIEW[Status: Interview]
        INTERVIEW --> OFFER[Status: Offer]
        INTERVIEW --> REJECT[Status: Rejected]
        SCREEN --> REJECT
        APPLIED --> REJECT
        REJECT --> ARCHIVE[Move to _archive/]
        OFFER --> ACCEPT[Accept Offer]
    end

    APPLIED --> NETWORK[LinkedIn Network<br/>Within 24h]
    APPLIED --> FOLLOWUP[Follow-up<br/>5-7 days]

    style NEW fill:#4CAF50
    style APPLIED fill:#2196F3
    style INTERVIEW fill:#FF9800
    style OFFER fill:#8BC34A
    style REJECT fill:#F44336
```

**Tracking Metadata:**
- Application date
- Fit score (40-95%)
- Status (researching → applied → screening → interview → offer/rejected)
- Networking contacts
- Follow-up dates
- Notes

---

### 4. Resume Generation System

```mermaid
graph LR
    subgraph "Resume Generation Pipeline"
        MASTER[Master Resume<br/>_resources/master-resume.md] --> BASELINE[Baseline JSON<br/>baseline-resume-data.json]

        JOB[Job Posting] --> ANALYZE[Job Analysis]
        ANALYZE --> CUSTOM[Customization Strategy]

        BASELINE --> CUSTOMIZE[Customize JSON<br/>Summary, Skills, Projects]
        CUSTOM --> CUSTOMIZE

        CUSTOMIZE --> JSON[resume-data.json]
        JSON --> MCP[MCP Resume Tool<br/>LaTeX → PDF]
        MCP --> PDF[resume.pdf]

        PDF --> REPO[Copy to Repo<br/>Git tracking]
        PDF --> GENERATED[Copy to Generated<br/>External folder]
    end

    style MASTER fill:#2196F3
    style MCP fill:#FF9800
    style PDF fill:#4CAF50
```

**Customization Strategy:**
- **Summary:** Match job title, emphasize relevant skills
- **Skills:** Reorder categories to match job priorities
- **Work Experience:** Highlight relevant projects (keep static bullets for older roles)
- **Projects:** Select 3 most relevant (Problem-Solution-Impact format)

**Resume Variations:**
```
applications/
├── latitude-ai-engineer/
│   └── resume.pdf          → Emphasizes: Agentic workflows, internal tools
├── microsoft-prompt-engineer/
│   └── resume.pdf          → Emphasizes: Prompt engineering, customer-facing
└── forward-networks/
    └── resume.pdf          → Emphasizes: Network systems, infrastructure
```

---

### 5. Interview Preparation System

```mermaid
graph TD
    subgraph "Company-Specific Interview Prep"
        COMPANY[Get Interview<br/>Company X] --> FOLDER[Create Folder<br/>interview-prep/companies/X/]

        FOLDER --> RESEARCH[Research Phase]
        RESEARCH --> TECH[Technical Topics]
        RESEARCH --> BEHAVIORAL[Behavioral Questions]
        RESEARCH --> COMPANY_INFO[Company Research]

        TECH --> CODING[Coding Exercises<br/>Python, SQL, etc.]
        TECH --> SYSTEM[System Design<br/>Architecture]
        TECH --> DOMAIN[Domain Knowledge<br/>DB Schema, etc.]

        BEHAVIORAL --> STAR[STAR Method Stories]
        BEHAVIORAL --> QA[Q&A Bank]

        COMPANY_INFO --> VALUES[Company Values]
        COMPANY_INFO --> PRODUCTS[Products/Services]
        COMPANY_INFO --> TEAM[Team Structure]
    end

    subgraph "Mock Interviews"
        MOCKS[mock-interviews/] --> CODE_REVIEW[code-review/]
        MOCKS --> ARCH_DEBUG[architecture-debugging/]
        MOCKS --> ASSESS[assessments/]
    end

    style COMPANY fill:#4CAF50
    style TECH fill:#2196F3
    style BEHAVIORAL fill:#FF9800
```

**Example: Casium Interview Prep**
```
interview-prep/companies/casium/
├── README.md                    → Complete prep guide
├── company-research/            → Mission, values, team
├── database-schema/             → 9 files (tutorials, exercises)
├── python-practice/             → 8 files (timed assessments)
├── mock-exercises/              → Company-specific scenarios
└── interview-guide.md           → Question bank, talking points
```

---

### 6. Claude Code Integration

```mermaid
graph TB
    subgraph "Claude Code Assistant Workflow"
        USER[User Request] --> CLAUDE[Claude Code]

        CLAUDE --> PROFILE[Load Profile<br/>/profile command]
        CLAUDE --> APPLY[Load Resume Workflow<br/>/apply command]
        CLAUDE --> CONTEXT[Load Context<br/>.claude/CLAUDE.md]

        PROFILE --> ANALYZE[Analyze Job]
        APPLY --> ANALYZE
        CONTEXT --> ANALYZE

        ANALYZE --> STRATEGY[Generate Strategy<br/>Fit assessment]
        STRATEGY --> CUSTOMIZE[Customize Resume<br/>Tailor content]
        CUSTOMIZE --> GENERATE_RESUME[Generate Resume<br/>MCP tool]
        GENERATE_RESUME --> OUTPUT[Deliver Files<br/>PDF + JSON + MD]

        OUTPUT --> NEXT[Suggest Next Steps<br/>LinkedIn, follow-up]
    end

    style CLAUDE fill:#8B5CF6
    style GENERATE_RESUME fill:#FF9800
    style OUTPUT fill:#4CAF50
```

**Claude Code Slash Commands:**
- `/profile` → Load user background, projects, tech stack
- `/apply` → Load resume generation workflow
- `/resume [job description]` → Full resume generation pipeline
- `/interview` → Interview prep guidance
- `/network` → LinkedIn networking templates

**Agent System:**
```
.claude/agents/
└── resume-agent.md          → Autonomous resume generation
```

---

### 7. MCP Tools Integration

```mermaid
graph LR
    subgraph "MCP Tools Ecosystem"
        CLAUDE[Claude Code] --> MCP_RESUME[Resume Generator<br/>LaTeX PDF]
        CLAUDE --> MCP_NETLIFY[Netlify<br/>Deploy website]
        CLAUDE --> MCP_CONTEXT7[Context7<br/>Library docs]
        CLAUDE --> MCP_IDE[IDE Tools<br/>Diagnostics, code exec]

        MCP_RESUME --> PDF[Professional PDF<br/>10 templates]
        MCP_NETLIFY --> DEPLOY[Deploy to Production<br/>viresh-duvvuri.netlify.app]
        MCP_CONTEXT7 --> DOCS[Library Documentation<br/>Real-time lookup]
        MCP_IDE --> JUPYTER[Jupyter Execution<br/>Python code]
    end

    style MCP_RESUME fill:#FF9800
    style MCP_NETLIFY fill:#00C7B7
    style CLAUDE fill:#8B5CF6
```

**Key MCP Tools Used:**
1. **`mcp__resume-generator__generate_resume`** → LaTeX PDF generation
2. **`mcp__netlify__netlify-deploy-services-updater`** → Website deployment
3. **`mcp__context7__get-library-docs`** → Library documentation lookup
4. **`mcp__ide__executeCode`** → Python code execution

---

### 8. Git Workflow

```mermaid
graph TD
    subgraph "Version Control Workflow"
        WORK[Make Changes] --> STAGE[git add<br/>Stage files]
        STAGE --> COMMIT[git commit<br/>Descriptive message]
        COMMIT --> PUSH[git push<br/>Remote backup]

        COMMIT --> BRANCH{Feature Branch?}
        BRANCH -->|Yes| PR[Create PR<br/>Review changes]
        BRANCH -->|No| PUSH
        PR --> MERGE[Merge to main]
        MERGE --> PUSH
    end

    subgraph "What Gets Tracked"
        TRACK[Git Tracks] --> RESUME_FILES[Resume PDFs<br/>History preserved]
        TRACK --> JOB_FILES[Job Postings<br/>All applications]
        TRACK --> INTERVIEW_FILES[Interview Prep<br/>Company-specific]
        TRACK --> CONFIG_FILES[Config Files<br/>.claude, .netlify]
    end

    style COMMIT fill:#4CAF50
    style PUSH fill:#2196F3
```

**Commit Conventions:**
```bash
# Resume generation
git commit -m "Apply: Microsoft - AI Engineer II"

# Website updates
git commit -m "Update: Portfolio projects section"

# Interview prep
git commit -m "Prep: Casium - Database schema exercises"

# System improvements
git commit -m "Feat: Add resume generation agent"
```

---

### 9. File Organization Strategy

```mermaid
graph TB
    subgraph "Folder Hierarchy"
        ROOT[per_wesite/]

        ROOT --> WEB[Website Files<br/>Production ONLY]
        ROOT --> JOB[job-prep/<br/>Active job search]
        ROOT --> INT[interview-prep/<br/>Active interviews]
        ROOT --> PRAC[practice-problems/<br/>General practice]
        ROOT --> CONF[Configuration<br/>.claude, .netlify]

        JOB --> APPS[applications/<br/>One folder per job]
        APPS --> TEMPLATE[_template/<br/>Copy for new apps]
        APPS --> RESOURCES[_resources/<br/>Guides, master resume]
        APPS --> ARCHIVE[_archive/<br/>Old applications]
        APPS --> COMPANY[{company-role}/<br/>Active application]

        COMPANY --> POSTING[job-posting.md]
        COMPANY --> RESUME_JSON[resume-data.json]
        COMPANY --> RESUME_PDF[resume.pdf]

        INT --> COMP[companies/<br/>Company-specific prep]
        INT --> MOCK[mock-interviews/<br/>Practice by type]
    end

    style ROOT fill:#8B5CF6
    style JOB fill:#FF9800
    style INT fill:#4CAF50
    style WEB fill:#2196F3
```

**Naming Conventions:**
```
Applications:
{company-name}-{role}/
├── {timestamp}-{role}-job-posting.md
├── {timestamp}-{role}-resume-data.json
├── {timestamp}-{role}-resume-draft.md
└── viresh-duvvuri-{timestamp}-{role}.pdf

Example:
microsoft-prompt-engineer/
├── 20251103-1305-job-posting.md
├── 20251103-1305-resume-data.json
├── 20251103-1305-resume-draft.md
└── viresh-duvvuri-20251103-1305-prompt-engineer.pdf
```

---

### 10. Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Claude
    participant Profile
    participant Template
    participant MCP
    participant Git

    User->>Claude: Paste job description
    Claude->>Profile: Load user context (/profile)
    Profile-->>Claude: Background, projects, skills

    Claude->>Claude: Analyze job requirements
    Claude->>Claude: Assess fit (70-95%)
    Claude->>User: Fit assessment + strategy

    User->>Claude: Approve, generate resume
    Claude->>Template: Load baseline resume
    Template-->>Claude: Master resume structure

    Claude->>Claude: Customize for job<br/>(summary, skills, projects)
    Claude->>MCP: Generate PDF<br/>(resume-data.json)
    MCP-->>Claude: Professional PDF

    Claude->>Git: Save files<br/>(MD, JSON, PDF)
    Git-->>Claude: Committed, versioned

    Claude->>User: Resume ready + next steps<br/>(LinkedIn, follow-up)
```

---

## 🔧 System Components

### Core Technologies

**Portfolio Website:**
- HTML5, CSS3, JavaScript (ES6+)
- JSON for content management
- Responsive design (mobile-first)
- No build tools (vanilla)

**Job Prep System:**
- Markdown for documentation
- JSON for structured data
- LaTeX (via MCP) for PDF generation
- Git for version control

**Development Tools:**
- Claude Code (AI assistant)
- MCP tools (resume generation, deployment)
- VS Code (editor)
- Netlify (hosting)

---

## 📈 System Metrics

### Job Application Performance
- **Time per application:** 20 minutes (from job posting to submitted)
- **Resume variations:** Unlimited (each job gets custom resume)
- **Success rate:** 70%+ match → high callback rate
- **Applications tracked:** 15+ active companies
- **Resume versions:** 3+ per company (iterations)

### Interview Preparation
- **Companies prepared:** 2+ (Casium: 23 files, Woven: 5 files)
- **Mock interviews:** 10+ practice sessions
- **Coding practice:** 15+ Python problems

### Website Performance
- **Load time:** <1s (static site)
- **Mobile responsive:** 100%
- **Content updates:** JSON-driven (no rebuild)
- **Deployment:** Automated via Netlify

---

## 🚀 System Workflows

### Workflow 1: New Job Application
```
1. User pastes job description
2. Claude analyzes → Fit assessment
3. User approves
4. Claude generates:
   - job-posting.md (analysis)
   - resume-draft.md (human-readable)
   - resume-data.json (structured)
   - resume.pdf (final output)
5. User reviews → Approves
6. Apply + Network on LinkedIn
7. Update master tracker
8. Git commit + push
```

### Workflow 2: Interview Preparation
```
1. Get interview confirmation
2. Create company folder: interview-prep/companies/{name}/
3. Research company (mission, values, products)
4. Identify interview type (coding, system design, behavioral)
5. Create prep materials:
   - Technical exercises
   - Behavioral Q&A bank
   - Company research notes
6. Practice with mock interviews
7. Review before interview
```

### Workflow 3: Website Update
```
1. Edit JSON file (data/projects.json)
2. Test locally (python -m http.server)
3. Commit changes
4. Push to Git
5. Netlify auto-deploys
6. Verify live site
```

---

## 🎯 System Benefits

### Job Prep System
✅ **Fast applications** (20 min vs. 2-3 hours)
✅ **Consistent quality** (template-based)
✅ **Version controlled** (git tracks all changes)
✅ **Tailored resumes** (each job gets custom resume)
✅ **No duplicates** (single PDF per job, history in git)
✅ **Easy tracking** (master tracker, status updates)
✅ **Learning system** (context accumulates over time)

### Portfolio Website
✅ **Easy maintenance** (JSON-driven content)
✅ **Fast loading** (static site, no build)
✅ **Professional presentation** (responsive design)
✅ **SEO friendly** (semantic HTML)
✅ **No dependencies** (vanilla JS, no frameworks)

### Overall System
✅ **Dual-purpose** (portfolio + job prep in one repo)
✅ **AI-assisted** (Claude Code integration)
✅ **Automated** (MCP tools, git workflows)
✅ **Scalable** (handles unlimited applications)
✅ **Portable** (all materials in one repo)

---

## 📚 Key Files Reference

### Configuration
- `.claude/CLAUDE.md` → Instructions for Claude Code
- `.claude/agents/resume-agent.md` → Autonomous resume generation agent
- `.netlify/` → Deployment configuration

### Job Prep
- `job-prep/applications/README.md` → Master application tracker
- `job-prep/applications/_template/` → Template for new applications
- `job-prep/applications/_resources/WORKFLOW.md` → Complete workflow guide
- `job-prep/applications/_resources/baseline-resume-data.json` → Resume format standard

### Interview Prep
- `interview-prep/companies/casium/README.md` → Complete Casium prep guide (23 files)
- `interview-prep/mock-interviews/` → General practice interviews

### Website
- `index.html` → Main entry point
- `data/*.json` → All website content
- `css/main.css` → Styling
- `js/main.js` → Interactivity

---

## 🔄 System Maintenance

### Daily
- Update application statuses
- Follow up on pending applications
- Network on LinkedIn (new connections)

### Weekly
- Review active applications
- Archive rejected applications
- Update skills/projects on portfolio
- Practice coding problems

### Monthly
- Review master resume (add new projects)
- Update portfolio website content
- Analyze application success rate
- Adjust strategy based on results

---

## 🎓 Learning from the System

The system itself teaches:
- **Resume writing:** See successful resume variations
- **Job analysis:** Learn to assess fit accurately
- **Interview prep:** Build company-specific knowledge
- **Networking:** Track effective LinkedIn strategies
- **Time management:** 20-minute application workflow
- **Git workflows:** Version control best practices

---

## 📝 Future Enhancements

**Planned Features:**
- [ ] Application analytics dashboard
- [ ] Automated LinkedIn networking scripts
- [ ] Interview question database (searchable)
- [ ] Salary negotiation guides
- [ ] Cover letter generator (MCP tool)
- [ ] Job search API integration (LinkedIn, Indeed)

---

## 🤝 System Philosophy

**Core Principles:**
1. **Fast but Quality:** 20 minutes per application, but each is tailored
2. **Version Controlled:** Git tracks everything (no lost work)
3. **AI-Assisted:** Claude Code helps, but human reviews
4. **Learning System:** Context accumulates, gets smarter over time
5. **Dual-Purpose:** Portfolio showcases work, job prep gets work

**Success Formula:**
```
Good Resume + Fast Application + LinkedIn Networking + Follow-up = Interview
```

---

**System Documentation Version:** 1.0
**Last Updated:** 2025-11-03
**Maintained by:** Viresh Duvvuri with Claude Code assistance
