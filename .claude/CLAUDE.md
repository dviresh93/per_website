# Repository Context for Claude

## Repository Purpose

This repository serves **two primary purposes**:

1. **Portfolio Website** (Production) - A live portfolio website showcasing Viresh's work
2. **Job Hunting & Interview Prep** (Personal) - Active materials for job applications and interview preparation

## Directory Structure

```
per_wesite/
├── [WEBSITE - Production Files - DO NOT MODIFY without explicit request]
│   ├── index.html, profile-photo.jpg, package.json, nginx.conf
│   ├── css/, js/, data/, media/
│   ├── certifications/, resume/, scripts/
│   ├── README.md, CONTENT_GUIDE.md, DEPLOYMENT.md
│   └── Docker configuration files
│
├── job-prep/                 [Active job hunting materials]
│   ├── README.md                [Overview and quick links]
│   ├── guides/                  [Job search guides and strategies]
│   ├── applications/            [One folder per application - STRUCTURED SYSTEM]
│   │   ├── README.md            [Master tracker with all applications]
│   │   ├── _template/           [Template for new applications]
│   │   │   ├── job-posting.md   [Job details template]
│   │   │   └── resume-data.json [Resume JSON template]
│   │   ├── _resources/          [Reference materials - guides, templates]
│   │   ├── _archive/            [Old/rejected applications]
│   │   └── {company-role}/      [Active application folders]
│   │       ├── job-posting.md   [Job details + metadata + customization notes]
│   │       ├── resume-data.json [Resume generation data]
│   │       └── resume.pdf       [Latest generated resume]
│   ├── context/                 [Interview Q&A banks and application context]
│   └── archive/                 [Old/completed materials - rarely modified]
│
├── interview-prep/              [Active interview preparation]
│   ├── companies/               [Company-specific prep - ALL materials per company]
│   │   ├── casium/              [Casium: 23 files - DB schema, Python, exercises + README]
│   │   └── woven/               [Woven: Architecture debugging prep]
│   └── mock-interviews/         [General practice interviews by type]
│       ├── code-review/         [Code review practice (3 mocks)]
│       ├── architecture-debugging/ [Architecture debugging (5 practices)]
│       └── assessments/         [Mock assessments (2 files)]
│
└── practice-problems/           [General coding practice - NOT company-specific]
    └── python/
        └── fundamentals/        [Basic Python warmups (3 files)]
```

## Important Files & Usage

### Scratchpad Usage
- **Location:** `scratchpad.txt` (root directory) - **ALWAYS use .txt format, never .md**
- **Purpose:** Active workspace for discussions about job hunting and interview prep
- **Workflow:** User shares ideas → Claude provides feedback → Extract relevant context into organized markdown files
- **Keep:** File exists but content should be cleared after extraction
- **Rule:** When creating or writing to scratchpad, ALWAYS use `scratchpad.txt` format

### Content Management
- **Website content:** Managed via JSON files in `data/` directory
- **Job hunting context:** Organized in `job-prep/` and `interview-prep/`
- **Resume files:** Stored in `resume/` (AI-focused and Robotics-focused versions)

## What NOT to Modify

**Production website files** should only be changed with explicit user request:
- `index.html`, `css/`, `js/`, `data/`
- `package.json`, `nginx.conf`, Docker files
- `profile-photo.jpg`, `media/`

## Where to Add New Materials

| Material Type | Location | Notes |
|---------------|----------|-------|
| **New job application** | `job-prep/applications/{company-role}/` | Copy `_template/` folder, customize, generate resume |
| Job hunting guides/strategies | `job-prep/guides/` | Strategic planning, market research |
| Interview Q&A banks | `job-prep/context/` | Behavioral, technical, leadership questions |
| Company-specific interview prep | `interview-prep/companies/{company-name}/` | DB schema, coding exercises, ALL prep materials |
| Mock interview practice | `interview-prep/mock-interviews/{type}/` | General practice by interview type |
| General Python practice | `practice-problems/python/fundamentals/` | Warmup exercises, NOT company-specific |

**IMPORTANT WORKFLOWS:**

**New Job Application (Fast Workflow):**
1. `cp -r job-prep/applications/_template/ job-prep/applications/{company-role}/`
2. Edit `job-posting.md` (requirements, fit assessment, customization strategy)
3. Edit `resume-data.json` (customize summary, highlights, projects for THIS role)
4. Generate resume with MCP tool → saves as `resume.pdf`
5. Apply and update master tracker

**Company-Specific Interview Prep:**
- ALL materials for ONE company go in `interview-prep/companies/{company-name}/`
- Include: DB schema prep, Python exercises, coding challenges, company research
- NOT scattered in general `practice-problems/`

## User Context

**User:** Viresh Duvvuri
**Background:** Systems engineer transitioning from robotics/embedded systems to AI agent development
**Current Focus:** Actively interviewing for AI Agent Engineer and Robotics Systems Engineer roles
**Tech Stack:** Python, LangChain, RAG systems, PX4, ROS2, embedded systems, LLM integration

### Key Projects
- **GridCOP** (Grid CoOperator) - Agentic AI system for smart grid analytics
- **Drone Log Analysis Tool** (Freefly) - RAG-based diagnostic system for drone crashes
- **PX4 Flight Control** - Real-time embedded systems for autonomous drones

## Repository Workflow

1. **Active Discussions:** Use `scratchpad.txt` for brainstorming and working through ideas
2. **Context Preservation:** Extract valuable content from scratchpad into organized markdown files
3. **Organization:** Keep materials categorized by purpose (job-prep vs interview-prep vs practice)
4. **Portfolio Updates:** Only modify website files when explicitly requested by user
5. **Git Tracking:** Everything is version-controlled; no need for manual .backup files

## Job Application System

**Structured workflow for fast, consistent applications:**

### Quick Apply Process (20 minutes)
1. **Copy template:** `cp -r applications/_template/ applications/{company-role}/`
2. **Fill job-posting.md:** Requirements, fit assessment, customization strategy
3. **Customize resume-data.json:** Summary, highlights, projects tailored for THIS role
4. **Generate resume:** MCP tool → `resume.pdf` in application folder
5. **Apply & track:** Update master tracker, network on LinkedIn

### File Organization
- **One folder per application:** `applications/{company-role}/`
- **Three core files:**
  - `job-posting.md` - Job details, metadata, customization notes
  - `resume-data.json` - Resume generation data (for MCP tool)
  - `resume.pdf` - Latest generated resume
- **No duplicates:** Always overwrite `resume.pdf` (git tracks history)
- **Archive completed apps:** Move to `_archive/` when done

### Resume Customization Strategy
- **Skills-first:** For AI/ML roles (career switcher from embedded)
- **Standard:** For roles aligned with current experience
- **Reorder skills:** Match job posting keywords
- **Select 2-3 projects:** Most relevant to role requirements
- **Quantify impact:** Include metrics from similar domain

### Master Tracker
- **Location:** `applications/README.md`
- **Tracks:** All active applications with status, fit score, next actions
- **Update after:** Every application submission
- **Status workflow:** researching → applied → screening → interview → offer/rejected/archived

### Resources
- **Master resume:** `applications/_resources/master-resume.md` (all content)
- **Customization guide:** `applications/_resources/resume-customization-guide.md`
- **Networking templates:** `applications/_resources/networking-templates.md`
- **Workflow details:** `applications/_resources/application-workflow.md`

## Company-Specific Organization

### Casium (Primary Focus)
**Location:** `interview-prep/companies/casium/`
**Contains:** 23 files + comprehensive README
- Company-specific prep (immigration exercise, satellite exercise, interview guide)
- Database schema materials (9 files: tutorials, practice, exercises)
- Python coding practice (8 files: timed assessments, realistic problems, billing logic)
- Reference solutions (2 files)
- **README.md** - Complete guide explaining every file, learning paths, interview checklist

**Key:** ALL Casium prep materials are in this one folder - DB schema, Python practice, exercises, everything

### Woven
**Location:** `interview-prep/companies/woven/`
**Contains:** Architecture debugging preparation

### Adding New Companies
Create folder at `interview-prep/companies/{company-name}/` and include:
- Company-specific prep docs
- All related practice materials (DB, Python, etc.)
- README.md explaining the materials

## Notes

- User is actively interviewing - materials in `job-prep/` and `interview-prep/` are current
- Archive folder contains completed work but is kept for reference
- Resume has two versions: AI-focused and Robotics-focused (dual-track strategy)
- Scratchpad is the primary collaboration space for job hunting discussions
- **Organization principle:** Company-specific materials stay WITH that company (not scattered in general folders)

## Company-Specific Context Files

For detailed interview preparation context for specific companies, see:
- **Casium:** `interview-prep/companies/casium/onsite-prep/claude.md` (detailed interview prep guide)

**Note:** These are NOT auto-loaded. Use `/casium` slash command to load Casium-specific context.
