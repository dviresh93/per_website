# Job Hunting Command Center

**Status:** Active job search
**Focus:** AI Agent Engineer, Robotics Systems Engineer
**Target Companies:** AI startups, robotics companies, tech giants
**Strategy:** Dual-track (AI + Robotics), skills-first resume approach

---

## Directory Overview

### 📋 [`applications/`](applications/)
**Active job applications and tracking system**

One folder per application with job details, customized resume data, and generated PDF. Fast workflow for consistent, high-quality applications.

**Quick start:** Copy `_template/` → Customize → Generate → Apply (20 min)

See [applications/README.md](applications/README.md) for full workflow.

---

### 📚 [`guides/`](guides/)
**Strategic job hunting guides and resources**

- Market research (domains, job titles, salary ranges)
- Company lists and targeting strategies
- Career positioning and messaging

**Key file:** `JOB_HUNTING_GUIDE_2025.md` - Comprehensive guide covering 8+ domains you're eligible for

---

### 📝 [`context/`](context/)
**Interview preparation Q&A banks and application context**

- Interview Q&A bank (behavioral, technical, leadership)
- Job search context and notes
- Company-specific application summaries (Auger, Experian, etc.)
- Infrastructure inspection consultation materials

**Use case:** Preparation for interviews, reference for application essays

---

### 📦 [`archive/`](archive/)
**Completed and old materials**

- Old consulting responses
- Deprecated files no longer actively used
- Keep for historical reference

---

## Quick Links

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

## Current Focus (2025-10-24)

**Active Applications:**
- Azumo - AI Software Engineer (Applied 2025-10-24, 80% fit)

**Next Steps:**
1. Network with Azumo employees on LinkedIn
2. Continue applying to high-fit roles (70%+ match)
3. Focus on companies with LangChain/RAG/multi-agent requirements

**Target Application Rate:**
3-5 highly tailored applications per day

---

## Key Skills to Emphasize

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
- Hardware-software integration

**Full-Stack/DevOps:**
- Python, React, TypeScript
- AWS, Docker, Kubernetes
- CI/CD, Monitoring, Scalability

---

## Resume Strategy

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

## Workflow Integration

**Tools:**
- Resume generation: MCP `generate_resume()` tool
- Job tracking: applications/README.md master tracker
- Collaboration: `/home/virus/Documents/repo/per_wesite/scratchpad.txt`

**Git workflow:**
- Track all applications in version control
- Commit after each application: `git commit -m "Apply: {Company} - {Role}"`
- Archive old applications to `_archive/`

---

**Last Updated:** 2025-10-24
