# Viresh Duvvuri - Portfolio & Job Prep Hub

**⚠️ PRIVATE REPOSITORY - PERSONAL USE**

This repository serves two purposes:

---

## 📂 Quick Navigation

**Click to jump to a section:**

### 🏗️ [System Architecture](SYSTEM_ARCHITECTURE.md)
Complete system diagram with workflows, data flows, and integration points

### 🌐 [Portfolio Website](#-portfolio-website)
Production website showcasing journey from robotics to AI

### 🏭 [Job Prep System](#-job-prep-system)
Complete system for resumes, applications, interviews, and job search

---

## 🌐 Portfolio Website

Modern, responsive portfolio website showcasing your journey from robotics to AI agent development. Built with vanilla HTML, CSS, and JavaScript for maximum performance and easy maintenance.

### 🚀 Quick Start

1. **Open the website**: Simply open `index.html` in your browser
2. **Local server** (recommended): Use a local server for best experience
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

### 📁 Project Structure

```
per_wesite/
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Core styles and layout
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Mobile and responsive styles
├── js/
│   ├── main.js           # Main application logic
│   ├── projects.js       # Project management functionality
│   └── timeline.js       # Timeline interactions
├── data/
│   ├── profile.json      # Personal information
│   ├── skills.json       # Skills and technologies
│   ├── timeline.json     # Career timeline
│   └── projects.json     # Project details
└── README.md             # This file
```

### ✏️ Easy Content Management

#### 1. Update Personal Information
Edit `data/profile.json`:
```json
{
  "name": "Your Name",
  "tagline": "Your Professional Tagline",
  "subtitle": "Your Role | Specialty | Focus",
  "description": "Brief description of your transition journey",
  "email": "your@email.com"
}
```

#### 2. Update Skills
Edit `data/skills.json` - categorized by domain (AI/ML, Programming, etc.)

#### 3. Update Career Timeline
Edit `data/timeline.json` - your career progression

#### 4. Add/Update Projects
Edit `data/projects.json` - project details with features, impact, tech stack

### 🎨 Customization

Edit CSS variables in `css/main.css` to change colors, fonts, and theme.

### 🐛 Troubleshooting

**Content not loading:**
- Check JSON file syntax (use JSON validator)
- Ensure file paths are correct
- Check browser console for errors

**Browser Support:**
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

---

## 🏭 Job Prep System

**Complete system for fast job applications, interview prep, and career development.**

### 🎯 What This System Does

1. **Resume Preparation** - Template → Customize → Generate → Apply (20 min)
2. **Message Drafting** - LinkedIn/questionnaire templates (human-sounding, 300 char limit)
3. **Interview Prep** - Company-specific folders with all materials
4. **Opportunity Discovery** - Strategic guidance (8+ domains, job titles, salaries)
5. **Learning & Growth** - Git-based, accumulates context over time

### 📂 Directory Structure

```
job-prep/
├── README.md              # System overview
│
├── applications/          # Resume generation & tracking
│   ├── README.md          # Master tracker (all applications)
│   ├── _template/         # Copy this for new jobs
│   │   ├── job-posting.md
│   │   └── resume-data.json
│   ├── _resources/        # Guides, templates, master resume
│   ├── _archive/          # Old applications
│   └── {company-role}/    # One folder per application
│       ├── job-posting.md      # Job details, fit assessment
│       ├── resume-data.json    # Resume content for MCP tool
│       └── resume.pdf          # Generated resume
│
├── guides/                # Strategic job search intelligence
│   └── JOB_HUNTING_GUIDE_2025.md
│
├── context/               # Interview Q&A banks, research
│
└── archive/               # Old materials
```

### ⚡ Quick Start: Apply to a New Job

```bash
# 1. Copy template (30 seconds)
cp -r job-prep/applications/_template/ \
      job-prep/applications/{company-role}/

# 2. Edit job-posting.md (5 min)
#    - Requirements, fit score, customization strategy

# 3. Edit resume-data.json (10 min)
#    - Customize summary, highlights, projects for THIS role

# 4. Generate resume (3 min)
#    - Use MCP generate_resume() tool

# 5. Apply & track (2 min)
#    - Submit, update tracker, network on LinkedIn
```

**Total time:** 20 minutes per application

### 🎯 Key Features

| Feature | How It Works |
|---------|--------------|
| **Fast applications** | Copy template → customize → generate → track |
| **Zero duplicates** | Single `resume.pdf` per job (git tracks history) |
| **Full tracking** | Status, fit scores, timelines, networking |
| **Message templates** | LinkedIn, questionnaires (300 char limit, human-sounding) |
| **Interview prep** | Company-specific folders (see Casium example) |
| **Strategic intel** | 8+ domains, job titles, salary ranges |
| **Learning system** | Git-based, grows with each application |

### 📖 Detailed Documentation

**See [`job-prep/README.md`](job-prep/README.md) for complete documentation:**
- Full workflow
- Resume customization strategies
- Message drafting guidelines
- Interview preparation approach
- Opportunity discovery process

---

## 🛠️ Resume Creation Tool - How It Works

The resume system is a multi-layer pipeline that combines Claude Code orchestration, MCP servers, and a LaTeX PDF generator.

### Architecture Overview

```
Job posting
    ↓
/apply command → Claude enforces workflow rules (CLAUDE.md)
    ↓
Fit analysis → Load baseline-resume-data.json (source of truth)
    ↓
Customize: summary, skills order, project selection
    ↓ [user approves JSON]
PDF generation via MCP tool or standalone script
    ↓
Saved as viresh-duvvuri_YYMMDD-HHMM_role-title.pdf
```

### Key Components

| Component | Location | Purpose |
| --- | --- | --- |
| **Source of truth** | `job-prep/applications/_resources/baseline-resume-data.json` | All resume content, locked/unlocked sections |
| **Apply command** | `.claude/commands/apply.md` | Enforces workflow, gates, validation |
| **Workflow doc** | `job-prep/RESUME_APPLICATION_WORKFLOW.md` | Step-by-step mandatory process |
| **PDF generator** | `generate-resume-standalone.mjs` | Node script → LaTeX pipeline → PDF |
| **MCP server** | `resume-memory-mcp/` | Similarity check, validation, tracking tools |
| **Semantic search** | `semantic-search-api/` | Python API for finding similar past resumes |

### Locked vs Customizable Content

**Locked (never modify):** Freefly bullets 2-4, Lumenier bullets 1-2, York bullets 1-2, all job titles, dates, education

**Customizable per role:** Summary, skills order/grouping, Freefly bullet 1, project selection (3 of 4 available)

### MCP Tools (resume-memory-mcp server)

| Tool | Purpose |
| --- | --- |
| `get_profile_summary` | Returns compressed profile (200 tokens) for fit analysis |
| `check_resume_similarity` | Semantic search against past applications, returns top 3 matches |
| `validate_resume` | Checks locked content hasn't been modified |
| `process_similarity_reasoning` | Analyzes best match, generates 3 options with cost estimates |
| `track_application` | Logs application to SQLite DB for pattern learning |

### Workflow Gates (mandatory user approval)

1. **Fit Assessment** - Confirm the role is worth applying to
2. **JSON Draft Review** - Approve customized resume content before PDF generation

---

## 💻 Deploying to a New Computer

The resume tool is fully Dockerized — single dependency, works on Mac, Linux, and Windows.

### Prerequisites

- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  - Windows: enable "Use WSL 2 based engine" in Docker Desktop settings
- **Git**

That's it. No Node, no LaTeX, no Python needed on the host machine.

---

### Mac / Linux Setup

#### Step 1. Clone and build

```bash
git clone <repo-url>
cd per_wesite
./setup.sh
```

First build takes ~5-10 minutes (LaTeX packages are large). Subsequent builds use cached layers.

#### Step 2. Open in Claude Code

```bash
claude .
```

MCP servers register automatically via `.mcp.json` — no manual configuration needed.

---

### Windows Setup

#### Step 1. Clone and build (Windows)

```powershell
git clone <repo-url>
cd per_wesite
powershell -ExecutionPolicy Bypass -File setup.ps1
```

#### Step 2. Configure Claude Desktop (Windows)

Open `%APPDATA%\Claude\claude_desktop_config.json` and add (update the path to match where you cloned the repo):

```json
{
  "mcpServers": {
    "resume-memory": {
      "command": "powershell",
      "args": ["-ExecutionPolicy", "Bypass", "-File", "C:\\path\\to\\per_wesite\\docker-mcp.ps1", "resume-memory-mcp"]
    },
    "resume-generator": {
      "command": "powershell",
      "args": ["-ExecutionPolicy", "Bypass", "-File", "C:\\path\\to\\per_wesite\\docker-mcp.ps1", "resumake-mcp"]
    }
  }
}
```

Restart Claude Desktop after saving.

---

### (Optional) Preserve Application History

The memory server uses a local SQLite database that tracks past applications and learned patterns. Copy it over if you want to preserve history:

```bash
# From old machine
scp resume-memory-mcp/data/memory.db user@newmachine:/path/to/per_wesite/resume-memory-mcp/data/
```

---

### How the Docker Setup Works

| File | Purpose |
|---|---|
| `Dockerfile.mcp` | Node 20 + pdflatex + LaTeX fonts baked into one image |
| `docker-mcp.sh` | Wrapper script (Mac/Linux) — mounts only the two dirs that need persistence |
| `docker-mcp.ps1` | Wrapper script (Windows) — same as above for PowerShell |
| `.mcp.json` | Points Claude Code to `docker-mcp.sh` — auto-registers on project open |
| `setup.sh` / `setup.ps1` | One-command build: checks Docker exists, runs `docker build` |

**Volume mounts at runtime:**
- `job-prep/applications/` → PDF output lands here on your host machine
- `resume-memory-mcp/data/` → SQLite DB persists between container runs

---

## 🔄 Workflow Integration

**Tools:**
- Resume generation: MCP `generate_resume()` tool
- Job tracking: `job-prep/applications/README.md` master tracker
- Collaboration: `scratchpad.txt` for ideation
- Version control: Git for all materials

**Git workflow:**
```bash
# After each application
git add job-prep/applications/{company-role}/
git commit -m "Apply: {Company} - {Role}"
git push
```

---

## 📊 Current Status

**Active job search:** AI Agent Engineer, Robotics Systems Engineer
**Applications:** 1 active (Azumo - 80% fit)
**Target:** 3-5 tailored applications per day
**System:** Production-ready ✅

---

## 📚 Additional Resources

- **[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)** - Complete system diagram, workflows, and data flows
- **SYSTEM_AUDIT.md** - Complete validation of all capabilities
- **.claude/CLAUDE.md** - Instructions for Claude Code assistant
- **interview-prep/** - Company-specific interview preparation
- **practice-problems/** - General coding practice

---

**Built with ❤️ for easy maintenance and professional presentation**
