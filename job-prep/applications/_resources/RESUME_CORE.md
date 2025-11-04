# Resume Core Template

**Purpose:** Static sections and essential rules for resume generation

---

## Section Order
1. Header (Name, Contact)
2. Summary (NO title/label)
3. Skills
4. Work Experience
5. Education
6. Projects

---

## STATIC SECTIONS (Copy Verbatim - NEVER Customize)

### Lumenier (2 bullets - LOCKED)
```
### **Lumenier** (Sarasota, FL)
_Drone Software Developer, Jul 2020 - Oct 2021_

- Wrote embedded code in C++ to integrate LiDAR and optical flow sensors for obstacle avoidance and position holding with/without GPS under various lighting conditions
- Collaborated with open-source flight control software maintainers for integration, testing, and deployment of autonomous flight algorithms, prototyped innovative features like toss-to-launch for product roadmap development
```

### York Exponential (2 bullets - LOCKED)
```
### **York Exponential** (York, PA)
_Software Engineer - R&D, Aug 2018 - May 2020_

- Developed prototype software for in-house autonomous surveillance mobile robots using ROS2, SLAM, and computer vision technologies
- Built Human Machine Interface for Universal Robot welding applications using Python and Kivy framework, implemented multi-robot control systems with platform independence
```

### Education (LOCKED)
```
## EDUCATION

### **Washington State University** (Pullman, WA)
_Master of Science in Computer Science, Jan 2015 - Jan 2017_

### **GITAM University** (Visakhapatnam, India)
_Bachelor of Technology in Information Technology, Jan 2011 - Jan 2015_
```

---

## FREEFLY (4 bullets: 1 customizable + 3 static)

### Bullet 1 (CUSTOMIZABLE - AI diagnostic tool)
Adjust emphasis based on role:
- AI Engineer: Emphasize AI/ML frameworks, model integration
- Software Engineer: Emphasize full-stack, production deployment
- Product Engineer: Emphasize user impact, efficiency gains

### Bullets 2-4 (STATIC - LOCKED)
```
- Developed autopilot systems for commercial drones integrating PX4 flight control, camera payloads, and RF systems using C++, Python, and ROS2 for real-time sensor data processing
- Managed release cycles for embedded flight control software from development through testing to production deployment, coordinating with cross-functional hardware and firmware teams
- Built automated video generation system using FFmpeg and Python for post-flight media processing, created internal knowledge base documentation for drone operations and troubleshooting
```

---

## GRID COOPERATOR (3 bullets - ALL CUSTOMIZABLE)

### Structure
- Bullet 1: What you built + architecture + efficiency gain
- Bullet 2: Technical implementation + infrastructure/deployment
- Bullet 3: Iteration/monitoring OR additional technical depth

**Date:** 03/2025 - Present (NOT 07/2025)

### Role-Specific Variations

**AI Engineer:**
- Emphasize: multi-agent architecture, LangChain, model evaluation, AI orchestration
- Keywords: agent-based systems, MLOps, model governance, bias detection

**Software Engineer:**
- Emphasize: full-stack, FastAPI, production systems, SQL optimization
- Keywords: REST APIs, monitoring, error handling, scalability

**Product Engineer:**
- Emphasize: user impact, efficiency gains, internal tools, process automation
- Keywords: workflow automation, business outcomes, cross-functional

---

## SKILLS CATEGORIES (Reorder to Match Job)

### Available Categories
1. **Programming:** Python, C++, JavaScript, TypeScript, SQL, FastAPI, Flask, React
2. **AI Agent Development:** LangChain, LangGraph, Multi-Agent Systems, RAG, MCP, Prompt Engineering
3. **AI/ML Frameworks:** PyTorch, TensorFlow, MLOps, Model Deployment, Feature Engineering
4. **Cloud & Infrastructure:** AWS, Azure, Docker, Kubernetes, CI/CD, Monitoring
5. **Data & Databases:** Vector Databases (FAISS, Pinecone), SQL, PostgreSQL, Data Pipelines
6. **Backend & Full-Stack:** FastAPI, Flask, REST APIs, Microservices, Docker
7. **Robotics/Embedded:** PX4, ROS2, Embedded Systems, C++, Real-time Systems

### Ordering Rules
- **AI roles:** Lead with AI Agent Development → Programming → Cloud
- **Software roles:** Lead with Programming → Backend → Cloud → AI/ML
- **Robotics roles:** Lead with Robotics/Embedded → Programming → AI/ML

---

## PROJECTS (Select 3 Most Relevant)

### Format (Problem/Solution/Impact)
```json
{
  "name": "Project Name",
  "highlights": [
    "Problem: [Clear problem description]",
    "Solution: [Technologies and approach]",
    "Impact: [Quantified results and learnings]"
  ]
}
```

### Available Projects
1. **GridCOP:** Multi-agent AI system (LangChain, MCP, AWS) - best for AI roles
2. **Production Tool:** Full-stack log analysis (React, Flask, Ollama) - best for software/product roles
3. **AI Travel Planner:** AI agent for itineraries (Claude, LangChain) - shows AI breadth
4. **Flight Control:** PX4 embedded systems (C++, real-time) - best for robotics roles

---

## SUMMARY TEMPLATES

### Structure
`[Title] specializing in [focus], with 5+ years [experience]. [Strength] with proven track record [achievement]. [Technical depth].`

### AI Engineer
```
AI Engineer specializing in designing, developing, and deploying production-ready AI agents, with 5+ years shipping GenAI solutions from rapid prototyping to production deployment. Builder-first mindset with proven track record delivering agent-based systems that improved business efficiency by 50-80% within 3 months, establishing evaluation frameworks, model governance, and scalable AI infrastructure on AWS/Azure.
```

### Software Engineer
```
Software Engineer with 5+ years building production systems across AI agents, embedded systems, and full-stack applications. Strong track record shipping solutions that improved operational efficiency by 50-80%, with expertise in Python, C++, and cloud deployment (AWS). Proven ability to take projects from prototype to production with focus on scalability, reliability, and maintainability.
```

### Product Engineer
```
Product Engineer with 5+ years building internal tools and AI-powered systems that drive operational efficiency. Specialized in multi-agent workflows, full-stack development, and turning AI prototypes into reliable production systems. Track record of 70-80% efficiency improvements through AI-first process redesign.
```

---

## FORMAT RULES

- Work bullets: 3-3-3-2 pattern (Grid CoOp: 3, Freefly: 4, Lumenier: 2, York: 2)
- Projects: 3 projects, 3 bullets each (Problem/Solution/Impact)
- Skills: 3-5 categories, reordered to match job
- Date format: MM/YYYY in JSON, "Month YYYY" in markdown
- NO "label" field in JSON basics section
- Projects use `highlights` array (NOT `description`)

---

## CRITICAL RULES

### NEVER Change
- Employment dates
- Job titles at companies
- Company names
- Core metrics (70%, 80%, 200+ queries, 45%, 50%)
- Bullet count structure

### ALWAYS Customize
- Summary (role title, technology order)
- Skills order (within categories)
- Project selection (3 most relevant)
- Work bullet emphasis (add keywords naturally)
- Grid CoOperator bullets (all 3)
- Freefly bullet 1 (emphasis only)
