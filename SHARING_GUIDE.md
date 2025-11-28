# Sharing Guide - Portfolio & Resume System

**Purpose:** Guide for sharing this repository with others to fork and use for their own portfolio website and resume generation system.

**Last Updated:** 2025-11-28

---

## Table of Contents

1. [Current State Overview](#current-state-overview)
2. [What's Personal vs. Reusable](#whats-personal-vs-reusable)
3. [System Architecture](#system-architecture)
4. [Setup Instructions for Others](#setup-instructions-for-others)
5. [Customization Guide](#customization-guide)
6. [Known Issues & Limitations](#known-issues--limitations)

---

## Current State Overview

This repository contains **two major systems** that work independently:

### 1. Portfolio Website (Production-Ready ✅)
- **Status:** Fully functional, deployed, ready to customize
- **Tech:** Vanilla HTML/CSS/JS (no build step required)
- **Data-driven:** All content in JSON files
- **Deployment:** Docker-ready with nginx
- **Reusability:** 🟢 **HIGH** - Easy to customize for anyone

### 2. Resume Generation System (Advanced, Requires Setup ⚠️)
- **Status:** Fully functional, but requires MCP server setup
- **Tech:** Node.js MCP server + Python similarity API
- **Features:** AI-optimized resume generation with 70-94% cost savings
- **Reusability:** 🟡 **MEDIUM** - Requires technical setup

### 3. Job Prep Materials (Personal ❌)
- **Status:** Highly personal to Viresh
- **Content:** Job applications, interview prep, company-specific materials
- **Reusability:** 🔴 **LOW** - Should NOT be shared (contains personal data)

---

## What's Personal vs. Reusable

### ✅ REUSABLE (Share These)

```
per_wesite/
├── index.html                    # Portfolio website
├── css/                          # Styles
├── js/                           # JavaScript
├── data/                         # JSON content (CUSTOMIZE)
│   ├── profile.json             # 🔧 Replace with user's info
│   ├── skills.json              # 🔧 Replace with user's skills
│   ├── timeline.json            # 🔧 Replace with user's timeline
│   └── projects.json            # 🔧 Replace with user's projects
├── media/                        # Images, assets
├── package.json                  # Scripts
├── Dockerfile, nginx.conf        # Deployment
├── README.md                     # Main documentation
├── DEPLOYMENT.md                 # Deployment guide
├── CONTENT_GUIDE.md              # Content management
├── optimization-project/         # Resume system docs
│   ├── README.md
│   ├── USER_GUIDE.md
│   └── ...
├── resume-memory-mcp/            # 🔧 MCP server (advanced)
│   ├── server.js
│   ├── lib/
│   ├── package.json
│   └── ...
└── .claude/
    └── CLAUDE.md                 # 🔧 Customize instructions
```

### ❌ DO NOT SHARE (Personal Content)

```
per_wesite/
├── job-prep/                     # ❌ Viresh's job applications
│   ├── applications/             # ❌ Personal resumes, job postings
│   ├── context/                  # ❌ Personal interview answers
│   └── guides/                   # ❌ Personal strategies
├── interview-prep/               # ❌ Company-specific prep
│   ├── companies/                # ❌ Casium, Woven, etc.
│   └── mock-interviews/          # ❌ Personal practice
├── practice-problems/            # ❌ Personal coding practice
├── scratchpad.txt                # ❌ Personal notes
└── data/                         # ⚠️ Replace with user's info
    ├── profile.json              # ❌ Contains Viresh's contact info
    ├── skills.json               # ❌ Viresh's skills
    ├── timeline.json             # ❌ Viresh's career history
    └── projects.json             # ❌ Viresh's projects
```

---

## System Architecture

### Component 1: Portfolio Website

**How it works:**
1. Static HTML/CSS/JS website
2. Content loaded from JSON files in `data/`
3. No build step - just open `index.html` or serve with local server
4. Docker container available for production deployment

**Dependencies:**
- None! (Pure vanilla HTML/CSS/JS)
- Optional: Docker for deployment

**Customization:**
- Edit JSON files in `data/` folder
- Modify CSS variables in `css/main.css` for theme
- Replace `profile-photo.jpg` with user's photo

---

### Component 2: Resume Generation System

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                      Claude Code CLI                         │
│  (User interacts with Claude to generate resumes)            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─ Calls MCP Tools ─────────────────────────┐
                  │                                            │
┌─────────────────▼──────────────────┐  ┌────────────────────▼──────┐
│   Resume Memory MCP Server         │  │  Resume Generator MCP      │
│   (Node.js - resume-memory-mcp/)   │  │  (LaTeX PDF generation)    │
│                                     │  │                            │
│  Tools:                             │  │  Tools:                    │
│  - get_profile_summary              │  │  - generate_resume         │
│  - save_profile                     │  │                            │
│  - query_knowledge_graph            │  │  Outputs:                  │
│  - track_application                │  │  - PDF resume              │
│  - check_resume_similarity          │  │                            │
│  - get_learned_patterns             │  │                            │
│                                     │  └────────────────────────────┘
│  Database: SQLite                   │
│  - Compressed profile (200 tokens)  │
│  - Knowledge graph (projects/skills)│
│  - Application history              │
│                                     │
└──────────────┬──────────────────────┘
               │
               │ (Optional) Calls Python API for similarity
               │
┌──────────────▼──────────────────────────────────────────────┐
│   Python Similarity API (txtai)                              │
│   (semantic-search-api/)                                     │
│                                                               │
│   - Semantic search for resume deduplication                 │
│   - Returns top 3 similar applications                       │
│   - Runs on http://127.0.0.1:8001                           │
└───────────────────────────────────────────────────────────────┘
```

**Dependencies:**
1. **Claude Code CLI** - AI assistant (free/paid)
2. **Node.js 18+** - For MCP servers
3. **Python 3.9+** - For similarity API (optional)
4. **MCP SDK** - For server communication
5. **SQLite** - Database (bundled)
6. **txtai** - Semantic search (optional)

**Key Features:**
- **Profile compression:** 8k tokens → 200 tokens
- **Smart project selection:** Knowledge graph recommends top 3 relevant projects
- **Resume deduplication:** Reuses similar resumes for 0 tokens
- **Pattern learning:** Learns from history for better recommendations
- **Cost savings:** 70-94% reduction in API costs

---

## Setup Instructions for Others

### Option A: Portfolio Website Only (Simple)

**For users who just want a portfolio website:**

1. **Fork the repo:**
   ```bash
   git clone https://github.com/dviresh93/per_wesite.git my-portfolio
   cd my-portfolio
   ```

2. **Clean up personal content:**
   ```bash
   # Remove personal job prep materials
   rm -rf job-prep/ interview-prep/ practice-problems/
   rm -f scratchpad.txt

   # Remove personal optimization docs (optional - keep if using resume system)
   rm -rf optimization-project/
   ```

3. **Customize data files:**
   ```bash
   # Edit these files with your information:
   nano data/profile.json      # Your name, contact, tagline
   nano data/skills.json       # Your skills
   nano data/timeline.json     # Your career timeline
   nano data/projects.json     # Your projects
   ```

4. **Replace photo:**
   ```bash
   # Replace with your photo
   cp /path/to/your/photo.jpg profile-photo.jpg
   ```

5. **Test locally:**
   ```bash
   python3 -m http.server 8000
   # Open http://localhost:8000
   ```

6. **Deploy (optional):**
   ```bash
   # Using Docker:
   docker build -t my-portfolio .
   docker run -p 8080:8080 my-portfolio

   # Or deploy to any static hosting (Netlify, Vercel, GitHub Pages)
   ```

**Done! ✅** You now have a fully functional portfolio website.

---

### Option B: Portfolio + Resume System (Advanced)

**For users who want the AI-powered resume generation system:**

#### Prerequisites

- Claude Code CLI installed
- Node.js 18+ and npm
- Python 3.9+ (if using similarity checking)
- Git

#### Step 1: Clone and Setup Repository

```bash
# 1. Fork/clone the main repo
git clone https://github.com/dviresh93/per_wesite.git my-portfolio
cd my-portfolio

# 2. Clean up personal content
rm -rf job-prep/applications/*  # Keep folder structure, remove personal apps
rm -rf interview-prep/companies/*
rm -rf practice-problems/*
rm -f scratchpad.txt

# 3. Keep these folders (empty) for your own use:
mkdir -p job-prep/applications/_template
mkdir -p job-prep/applications/_resources
mkdir -p interview-prep/companies
```

#### Step 2: Clone Resume Memory MCP Server

The resume memory MCP server is a **separate repository** that needs to be cloned:

```bash
# Clone into the parent directory (alongside your portfolio)
cd ..
git clone https://github.com/dviresh93/resume-memory-mcp.git
cd resume-memory-mcp

# Install dependencies
npm install

# Optional: Setup Python similarity API
cd semantic-search-api
python3 -m venv venv
source venv/bin/activate
pip install txtai flask
```

#### Step 3: Configure Claude Code

Edit `~/.claude.json` to add the MCP servers:

```json
{
  "mcpServers": {
    "resume-memory": {
      "command": "node",
      "args": ["/absolute/path/to/resume-memory-mcp/server.js"]
    },
    "resume-generator": {
      "command": "npx",
      "args": ["-y", "@vireshduvvuri/resume-generator-mcp"]
    }
  }
}
```

**⚠️ Replace `/absolute/path/to/` with the actual path!**

#### Step 4: Customize for Your Profile

**A. Update baseline resume data:**

```bash
cd my-portfolio/job-prep/applications/_resources/
nano baseline-resume-data.json
```

Replace with your:
- Contact info
- Work experience
- Education
- Skills
- Projects

**B. Update CLAUDE.md instructions:**

```bash
nano .claude/CLAUDE.md
```

Replace "Viresh Duvvuri" with your name and update relevant sections.

#### Step 5: Initialize the System

1. **Start Claude Code:**
   ```bash
   cd my-portfolio
   claude
   ```

2. **Verify MCP tools loaded:**
   - Type `/tools` to see available tools
   - You should see: `get_profile_summary`, `save_profile`, `query_knowledge_graph`, etc.

3. **Save your profile:**
   ```
   User: "Initialize my profile with my full resume context"
   Claude: [Calls save_profile tool]
   ```

4. **(Optional) Start similarity API:**
   ```bash
   # In a separate terminal:
   cd resume-memory-mcp/semantic-search-api
   source venv/bin/activate
   python similarity_checker.py
   ```

#### Step 6: Generate Your First Resume

Follow the workflow in `job-prep/RESUME_APPLICATION_WORKFLOW.md`:

```
User: "Help me apply to [Company] for [Role]"

Claude will:
1. Analyze fit (show strengths/gaps, recommend proceed/skip)
2. Check similarity to past applications
3. Recommend: Use existing / Tailor / Create new
4. Generate optimized resume with validation
5. Track application for future pattern learning
```

**Done! ✅** You now have the full system running.

---

## Customization Guide

### Portfolio Website Customization

#### 1. Personal Information

Edit `data/profile.json`:
```json
{
  "name": "Your Name",
  "tagline": "Your Professional Tagline",
  "subtitle": "Role | Specialty | Focus",
  "description": "Brief bio",
  "contact": {
    "linkedin": "https://linkedin.com/in/yourname/",
    "github": "https://github.com/yourname",
    "email": "you@email.com",
    "phone": "+1-xxx-xxx-xxxx",
    "location": "City, State"
  }
}
```

#### 2. Skills

Edit `data/skills.json`:
```json
{
  "categories": [
    {
      "name": "AI & Machine Learning",
      "skills": ["Python", "TensorFlow", "PyTorch", ...]
    },
    {
      "name": "Programming Languages",
      "skills": ["JavaScript", "Python", "Go", ...]
    }
  ]
}
```

#### 3. Career Timeline

Edit `data/timeline.json`:
```json
{
  "timeline": [
    {
      "date": "2024",
      "title": "Senior AI Engineer",
      "company": "Your Company",
      "description": "What you did",
      "type": "work"
    }
  ]
}
```

#### 4. Projects

Edit `data/projects.json`:
```json
{
  "projects": [
    {
      "id": "project1",
      "name": "Project Name",
      "tagline": "One-line description",
      "description": "Full description",
      "features": ["Feature 1", "Feature 2"],
      "impact": "Measurable results",
      "technologies": ["Tech1", "Tech2"],
      "links": {
        "github": "https://github.com/...",
        "demo": "https://..."
      }
    }
  ]
}
```

#### 5. Theme Customization

Edit `css/main.css` to change colors:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  /* ... */
}
```

---

### Resume System Customization

#### 1. Baseline Resume Data

Edit `job-prep/applications/_resources/baseline-resume-data.json` with:
- Your work experience
- Your education
- Your skills
- Your projects
- Locked vs. customizable sections

**Mark locked content** (content verified on LinkedIn that shouldn't change):
```json
{
  "work": [
    {
      "company": "Current Company",
      "highlights": [
        "LOCKED: Verified bullet point 1",
        "LOCKED: Verified bullet point 2",
        "CUSTOMIZABLE: Can change for each role"
      ]
    }
  ]
}
```

#### 2. Knowledge Graph

The system auto-builds a knowledge graph from your baseline data. To manually seed:

```javascript
// In Claude Code:
"Add projects to knowledge graph: GridCOP (AI, LangChain, RAG),
DroneLog (Python, Analytics), ..."
```

#### 3. CLAUDE.md Instructions

Edit `.claude/CLAUDE.md` to customize:
- Your name, background, focus areas
- Your tech stack
- Your key projects
- Your job search targets

---

### Memory System Initialization (Critical!)

**The resume-memory-mcp stores data in a SQLite database. Here's how your friend updates it with their data:**

#### Understanding the Database

The memory system stores:
- **Profile** (compressed summary) at `resume-memory-mcp/data/memory.db`
- **Application history** (all job applications tracked)
- **Knowledge graph** (projects, skills, relationships)

#### Two Options for Your Friend

**Option 1: Clean Slate (Recommended)**
```bash
# Delete the database and start fresh
rm resume-memory-mcp/data/memory.db
rm -rf resume-memory-mcp/semantic-search-api/index/  # Optional: clear similarity index

# Database will auto-recreate on first use (empty tables)
```

**Option 2: Just Overwrite (Also Works)**
```bash
# Keep the database file, just overwrite the profile
# The system uses INSERT OR REPLACE with id=1
# So calling save_profile() will automatically replace your data
```

#### Complete Initialization Flow

After your friend updates all JSON files with their data:

```bash
# 1. (Optional) Clean the database for fresh start
rm resume-memory-mcp/data/memory.db

# 2. Start Claude Code
cd my-portfolio
claude

# 3. Initialize their profile
```

In Claude Code:
```
User: "Initialize my profile with my resume data from baseline-resume-data.json"

Claude will automatically:
✅ Call save_profile() with their data
✅ Compress 8k tokens → 200 tokens
✅ Build knowledge graph from their projects
✅ Store in database (id=1, replacing any existing profile)
✅ Database now contains THEIR data, not yours
```

#### What Happens Automatically

The system is designed for easy updates:

1. **Profile Storage**
   - Uses `INSERT OR REPLACE` with fixed ID (id=1)
   - Only one profile can exist
   - Calling `save_profile()` again just overwrites

2. **Knowledge Graph**
   - Auto-built from baseline-resume-data.json
   - Extracts projects and skills automatically
   - No manual seeding required

3. **Application History**
   - Starts empty (or inherits yours if they don't delete DB)
   - Gets populated as they use the system
   - Each application tracked with: company, role, projects selected, cost, etc.

4. **Similarity Index**
   - Python txtai index rebuilt automatically
   - Stores embeddings for resume deduplication
   - Location: `resume-memory-mcp/semantic-search-api/index/`

#### Key Point: No Manual Database Management Needed

Your friend doesn't need to manually edit SQL or manage the knowledge graph. Just:
1. Update JSON files with their data
2. Call `save_profile()` via Claude Code
3. Done! System uses their data

The `INSERT OR REPLACE` design ensures no conflicts - their data automatically overwrites yours.

---

## Known Issues & Limitations

### Portfolio Website
- ✅ **No known issues** - Pure HTML/CSS/JS, works everywhere
- ⚠️ Requires JSON validation (invalid JSON breaks site)
- 💡 Use JSON validator before committing changes

### Resume Generation System
- ⚠️ **Requires Claude Code CLI** - Not free (paid Claude account needed)
- ⚠️ **MCP server setup** - Requires technical knowledge
- ⚠️ **Python API optional** - Similarity checking requires Python 3.9+
- ⚠️ **Large repo** - `resume-memory-mcp/node_modules/` is 7.1GB
- 💡 Consider using `.gitignore` for `node_modules/`

### Personal Content
- 💡 **Job prep materials are personal** - Your friend can see `job-prep/applications/` (trusted)
- 💡 **Interview prep is personal** - Your friend can see `interview-prep/companies/` (trusted)
- ℹ️ **Git history contains personal info** - Fork creates new repo, but they'll have access to history
- ✅ **Memory gets overwritten** - When they initialize with their data, the database will contain their info, not yours

---

## Packaging Options

### Option 1: GitHub Template Repository (Recommended)

**Best for:** Making it easy for anyone to use

**Steps:**
1. Create a new repo: `portfolio-resume-template`
2. Copy only reusable files
3. Add placeholder data in JSON files
4. Mark as "Template Repository" in GitHub settings
5. Users click "Use this template" to create their own

**Pros:**
- Clean separation from personal content
- Easy for others to use
- No personal data in template

**Cons:**
- Requires creating a new repo
- Separate from your working repo

---

### Option 2: Cleanup Script (Quick)

**Best for:** Sharing with a specific friend

**Steps:**
1. Create `cleanup-personal-content.sh` script
2. Friend forks your repo
3. Friend runs cleanup script
4. Friend customizes data files

**Cleanup script:**
```bash
#!/bin/bash
# cleanup-personal-content.sh

echo "Cleaning up personal content..."

# Remove personal job prep
rm -rf job-prep/applications/*
rm -rf interview-prep/companies/*
rm -rf practice-problems/*
rm -f scratchpad.txt

# Keep folder structure
mkdir -p job-prep/applications/_template
mkdir -p job-prep/applications/_resources
mkdir -p interview-prep/companies

# Clear personal data (replace with placeholders)
cat > data/profile.json << 'EOF'
{
  "name": "Your Name",
  "tagline": "Your Professional Tagline",
  "subtitle": "Your Role | Specialty | Focus",
  "description": "Brief description",
  "contact": {
    "linkedin": "https://linkedin.com/in/yourname/",
    "github": "https://github.com/yourname",
    "email": "you@email.com",
    "phone": "+1-xxx-xxx-xxxx",
    "location": "City, State"
  }
}
EOF

echo "Done! Now customize data/ files with your information."
```

**Pros:**
- Quick to create
- Friend gets your repo structure
- Easy to run

**Cons:**
- Git history still contains personal info
- Requires friend to run script

---

### Option 3: Separate Repos (Most Flexible)

**Best for:** Long-term maintainability

**Structure:**
```
github.com/yourname/
├── portfolio-template/          # Public template (website only)
├── resume-memory-mcp/           # Public MCP server
└── my-personal-job-prep/        # Private (your job materials)
```

**Pros:**
- Clean separation
- Public templates for others
- Private repo for personal content
- Easy to maintain

**Cons:**
- More complex setup
- 3 repos to manage

---

## Recommendations

### For Your Friend

**If they just want a portfolio website:**
→ Use **Option 2 (Cleanup Script)** - Fast and simple

**If they want the full resume system:**
→ Use **Option 1 (Template Repository)** - Clean and professional

### For Long-Term Sharing

**If you plan to help many people:**
→ Use **Option 3 (Separate Repos)**
- Create `portfolio-template` (public)
- Create `resume-system-template` (public, with docs)
- Keep your personal repo private

This allows you to:
- Maintain templates independently
- Update without exposing personal data
- Help others without confusion

---

## Next Steps

1. **Choose packaging option** (Option 1, 2, or 3 above)
2. **Create cleanup/template as needed**
3. **Test with a fresh clone** (verify setup works)
4. **Document any custom steps** (add to this guide)
5. **Share with your friend!**

---

## Additional Resources

**Documentation to include when sharing:**
- `README.md` - Main overview
- `DEPLOYMENT.md` - Deployment instructions
- `CONTENT_GUIDE.md` - Content management
- `optimization-project/USER_GUIDE.md` - Resume system usage
- `job-prep/RESUME_APPLICATION_WORKFLOW.md` - Resume workflow

**Exclude (personal):**
- `scratchpad.txt`
- `job-prep/applications/` (except templates)
- `interview-prep/companies/`
- `practice-problems/`

---

**Questions?** Add to this guide as you discover more!

**Last Updated:** 2025-11-28
