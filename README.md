# Viresh Duvvuri - Portfolio & Job Prep Hub

**⚠️ PRIVATE REPOSITORY - PERSONAL USE**

This repository serves two purposes:

---

## 📂 Quick Navigation

**Click to jump to a section:**

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

- **SYSTEM_AUDIT.md** - Complete validation of all capabilities
- **.claude/CLAUDE.md** - Instructions for Claude Code assistant
- **interview-prep/** - Company-specific interview preparation
- **practice-problems/** - General coding practice

---

**Built with ❤️ for easy maintenance and professional presentation**
