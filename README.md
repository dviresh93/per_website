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

Everything in git travels automatically. The parts that don't are listed below.

### Minimum Viable Deploy Checklist

```text
✅ git clone <repo>
✅ npm install in resume-memory-mcp/
✅ Install LaTeX (texlive)
✅ Re-register MCP servers in Claude Code config
✅ (Optional) Copy SQLite DB to preserve application history
✅ (Optional) Set up semantic-search-api Python env
```

### Step-by-Step

#### 1. Clone the repo

```bash
git clone <repo-url> && cd per_wesite
```

#### 2. Install Node dependencies

```bash
cd resume-memory-mcp && npm install
# Packages: @modelcontextprotocol/sdk, better-sqlite3
```

#### 3. Install LaTeX (required for PDF generation)

```bash
sudo apt install texlive-xetex texlive-latex-extra   # Ubuntu/Debian
brew install mactex                                    # macOS
```

#### 4. Re-register MCP servers in Claude Code (most critical step)

MCP server registrations live in `~/.claude.json` — they do NOT travel with the git repo. On the new machine:

```bash
claude mcp add resume-memory-mcp node /absolute/path/to/resume-memory-mcp/server.js
```

To see what's registered on your current machine:

```bash
cat ~/.claude.json
```

#### 5. (Optional) Preserve application history

The similarity checker and pattern learner use a local SQLite database. Copy it to the new machine:

```bash
# From old machine
scp resume-memory-mcp/*.db user@newmachine:/path/to/resume-memory-mcp/
```

#### 6. (Optional) Set up semantic search

```bash
cd semantic-search-api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py   # runs on localhost
```

Without this, the similarity check step is skipped — everything else still works.

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
