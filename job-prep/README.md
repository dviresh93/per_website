# Job Prep System 🏭
> Complete system for resumes, applications, interviews, and strategic job search

**⚠️ PRIVATE REPOSITORY - PERSONAL USE ONLY**
Contains real job applications, resume data, and personal job search materials.

---

**Status:** Active job search
**Focus:** AI Agent Engineer, Robotics Systems Engineer
**Target Companies:** AI startups, robotics companies, tech giants
**Strategy:** Dual-track (AI + Robotics), skills-first resume approach
**System:** Production-ready ✅

---

## 🎯 What This System Does

### 1. Resume Preparation ✅
**Template → Customize → Generate → Apply (20 minutes)**
- Copy `applications/_template/` for new job
- Customize `job-posting.md` (requirements, fit, strategy)
- Tailor `resume-data.json` (summary, highlights, projects)
- Generate with MCP tool → `resume.pdf`
- Apply and track

### 2. Message Drafting ✅
**Human-sounding LinkedIn & questionnaire templates**
- Guidelines in `applications/_resources/networking-templates.md`
- Connection requests (300 char limit)
- Follow-ups, thank-yous, application questions
- Adaptable examples, not copy-paste
- **Design:** Manual adaptation keeps messages human, not AI-generated

### 3. Interview Preparation ✅
**Company-specific folders with all materials**
- See `../interview-prep/companies/casium/` (27 files)
- DB schema practice, Python coding, exercises
- Company research, interview guides
- **Design:** Evolves naturally per company (no rigid template)

### 4. Opportunity Discovery ✅
**Strategic intelligence for job search**
- `guides/JOB_HUNTING_GUIDE_2025.md` - 8+ domains, job titles, salaries
- Manual web search (LinkedIn, Indeed, company sites)
- **Design:** Strategic guidance + manual search (no automation needed)

### 5. Learning & Growth ✅
**Git-based knowledge accumulation**
- All materials version-controlled
- `scratchpad.txt` for ideation → extract to organized files
- Context grows with each application/interview
- Historical learning in archives

---

## 📂 Directory Overview

### 📋 [`applications/`](applications/)
**Resume generation & application tracking**

One folder per job application with tailored resume and full tracking.

**Quick start:** Copy `_template/` → Customize → Generate → Apply (20 min)

See [applications/README.md](applications/README.md) for master tracker.

---

### 📚 [`guides/`](guides/)
**Strategic job hunting guides and market intelligence**

- Market research (domains, job titles, salary ranges)
- Company lists and targeting strategies
- Career positioning and messaging

**Key file:** `JOB_HUNTING_GUIDE_2025.md` - Comprehensive guide covering 8+ domains you're eligible for

---

### 📝 [`context/`](context/)
**Interview preparation Q&A banks and application context**

- Interview Q&A bank (behavioral, technical, leadership)
- Job search context and notes
- Company-specific application summaries
- Infrastructure inspection consultation materials

**Use case:** Preparation for interviews, reference for application essays

---

### 📦 [`archive/`](archive/)
**Completed and old materials**

- Old consulting responses
- Deprecated files no longer actively used
- Keep for historical reference

---

## ⚡ Quick Start: Apply to a New Job

### 1. Copy Template (30 seconds)
```bash
cp -r applications/_template/ applications/{company-role}/
# Example: applications/google-ai-engineer/
```

### 2. Fill Job Posting (5 minutes)
Edit `applications/{company-role}/job-posting.md`:
- Company, role, requirements, posting URL
- Your fit assessment (strengths, gaps, overall score)
- Resume customization strategy

### 3. Customize Resume (10 minutes)
Edit `applications/{company-role}/resume-data.json`:
- Update `basics.label` to match role title
- Customize summary emphasizing relevant experience
- Select 2-3 most relevant work highlights per position
- Reorder skills to match job requirements
- Choose 2-3 projects that demonstrate required skills

### 4. Generate Resume (3 minutes)
Use MCP resume generator tool

### 5. Apply & Track (2 minutes)
- Submit application
- Update `job-posting.md` with date_applied and status
- Update master tracker in `applications/README.md`
- Network with 2-3 employees on LinkedIn

**Total time:** 20 minutes per application

---

## 📖 Key Workflows

### Resume Customization Strategy

**Choose section order based on role:**

- **Skills-First** (Career Switcher): Summary → Skills → Work → Projects → Education
- **Standard** (Traditional): Summary → Work → Projects → Skills → Education
- **Projects-First** (Entrepreneur): Summary → Projects → Skills → Work → Education

### Message Drafting Workflow

1. Choose scenario from `applications/_resources/networking-templates.md`
2. Adapt with your specific context (portfolio, resume, job details)
3. Keep simple, clean, intuitive (under 300 chars for connection requests)
4. Ensure it sounds human, not AI-generated
5. Send

### Interview Preparation Workflow

1. Create company folder in `../interview-prep/companies/{company-name}/`
2. Add materials as you prep (research, technical exercises, guides)
3. Organize naturally - evolves per company
4. Optional: Add README explaining prep structure

**Example:** See `../interview-prep/companies/casium/` (27 files, comprehensive)

---

## 🔄 Workflow Integration

**Tools:**
- Resume generation: MCP `generate_resume()` tool
- Job tracking: `applications/README.md` master tracker
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

## 📊 Current Focus (2025-10-24)

**Active Applications:** 1 (Azumo - AI Software Engineer, 80% fit)

**Next Steps:**
1. Network with Azumo employees on LinkedIn
2. Continue applying to high-fit roles (70%+ match)
3. Focus on companies with LangChain/RAG/multi-agent requirements

**Target Application Rate:** 3-5 highly tailored applications per day

---

## 🎯 Key Skills to Emphasize

**AI/ML (Career Focus):**
- Agentic AI, Multi-Agent Systems
- LangChain, LangGraph, RAG
- Vector databases (FAISS, Pinecone)
- MLOps, Model Evaluation
- Production GenAI (GridCOP, AI Log Analyzer)

**Robotics/Embedded (Background):**
- PX4, ROS2, Flight Control
- Real-time systems, Embedded C++
- Sensor fusion, Computer vision

**Full-Stack/DevOps:**
- Python, React, TypeScript
- AWS, Docker, Kubernetes
- CI/CD, Monitoring, Scalability

---

## 🚀 Resume Strategy

**Two-Track Approach:**

1. **AI Agent Engineer** → Skills-first layout
   - Lead with AI/ML frameworks
   - Emphasize GridCOP + AI Log Analyzer
   - Highlight rapid prototyping and production scale

2. **Robotics Systems Engineer** → Experience-first layout
   - Lead with Freefly/Lumenier experience
   - Emphasize PX4, ROS2, embedded systems
   - Highlight autonomous systems and real-time control

**Customization per application:**
- Reorder sections based on role requirements
- Select 2-3 most relevant projects
- Match keywords from job posting
- Quantify impact with metrics

---

## 📚 Quick Links

**Starting a new application?**
→ [applications/_template/](applications/_template/)

**Need resume content?**
→ [applications/_resources/master-resume.md](applications/_resources/master-resume.md)

**Need networking help?**
→ [applications/_resources/networking-templates.md](applications/_resources/networking-templates.md)

**Need interview prep?**
→ [context/interview_qa_bank.md](context/interview_qa_bank.md)

**Strategic planning?**
→ [guides/JOB_HUNTING_GUIDE_2025.md](guides/JOB_HUNTING_GUIDE_2025.md)

---

## 🔍 System Design Philosophy

**Manual where it matters:**
- Message drafting (keeps it human, not AI-sounding)
- Job search (web search is flexible and effective)

**Automated where it helps:**
- Resume generation (MCP tool saves time)
- Tracking (structured markdown files)

**Organized for clarity:**
- One folder per application/company
- Git-based for history and version control
- Easy to find things after time away

---

## 🎓 Future: Public Template Release

This system could be valuable for other job seekers. To make it public-friendly:

**What needs to change:**
- [ ] Sanitize all personal data (name, email, phone, work history)
- [ ] Create example applications with fake companies
- [ ] Add LICENSE (MIT), CONTRIBUTING.md
- [ ] Add screenshots/demo of workflow
- [ ] Create `_examples/` with sanitized applications
- [ ] Write "Getting Started" for strangers

**Potential repo name:** `job-application-factory` or `resume-sprint-system`

**For now:** This stays private for my active job search.

---

**Last Updated:** 2025-10-24
**System Status:** Production-ready ✅
**Next Application:** Ready to apply in 20 minutes
