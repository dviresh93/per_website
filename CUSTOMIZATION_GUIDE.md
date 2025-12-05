# Customization Guide

**Version:** 1.0.0
**Purpose:** Complete guide to customizing the resume generation system for your needs
**Estimated Time:** 20-60 minutes

---

## Overview

This guide shows you how to make the system **yours** by replacing example data with your real information.

**What to customize:**
1. Personal profile data
2. Knowledge graph (projects, skills, companies)
3. Resume baseline template
4. Workflow preferences

---

## Quick Customization Checklist

### Essential (20 minutes)

- [ ] `data/profile.json` - Your basic contact info
- [ ] `resume-memory-mcp/data/knowledge-graph.json` - Your projects and skills
- [ ] `job-prep/applications/_resources/profile-summary.md` - Compressed profile
- [ ] `job-prep/applications/_resources/baseline-resume-data.json` - Resume template

### Optional (40 minutes)

- [ ] `.env` - System configuration
- [ ] `.agent-config/config.json` - Agent preferences
- [ ] `data/skills.json` - Portfolio website skills (if using)
- [ ] `data/timeline.json` - Career timeline (if using)
- [ ] `data/projects.json` - Portfolio projects (if using)

---

## Part 1: Personal Profile Data

### File: `data/profile.json`

**Purpose:** Basic contact information and preferences.

**How to customize:**

1. Copy the example:
   ```bash
   cp data/profile.json.example data/profile.json
   ```

2. Edit with your info:
   ```json
   {
     "name": "Your Full Name",
     "email": "your.email@example.com",
     "phone": "+1-555-YOUR-PHONE",
     "location": {
       "city": "Your City",
       "state": "YS",
       "country": "USA"
     },
     "website": "https://yourportfolio.com",
     "linkedin": "https://linkedin.com/in/yourprofile",
     "github": "https://github.com/yourusername",
     "summary": "Your 2-3 sentence professional summary",
     "title": "Your Job Title",
     "yearsExperience": 5
   }
   ```

**What to change:**
- ✏️ **name** - Your full legal name
- ✏️ **email** - Professional email address
- ✏️ **phone** - Phone number with country code
- ✏️ **location** - Current city/state
- ✏️ **website** - Personal portfolio (or LinkedIn)
- ✏️ **summary** - Brief professional summary (2-3 sentences)
- ✏️ **title** - Current or target job title
- ✏️ **yearsExperience** - Total years in field

---

## Part 2: Knowledge Graph

### File: `resume-memory-mcp/data/knowledge-graph.json`

**Purpose:** Powers intelligent project selection and skill matching.

**This is the most important file to customize!**

### 2.1 Companies Section

**Add your work experience:**

```json
{
  "nodes": {
    "companies": [
      {
        "name": "Your Company Name",
        "role": "Your Job Title",
        "duration": "Jan 2020 - Present",
        "duration_months": 60,
        "location": "City, State",
        "domain": "SaaS" | "E-commerce" | "Finance" | "Healthcare" | "Other",
        "company_size": "10-50" | "50-200" | "200-1000" | "1000+",
        "technologies": ["Python", "React", "AWS", ...],
        "achievements": [
          "What you accomplished (quantified)",
          "Another achievement",
          "Third achievement"
        ]
      }
    ]
  }
}
```

**Tips:**
- Include 3-5 most recent companies
- Use **specific numbers** in achievements ("Increased X by 40%")
- List actual technologies you used (matched against job postings)
- Domain helps filter relevant experience

### 2.2 Projects Section

**Add your standout projects:**

```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "One-sentence description",
      "technologies": ["Tech1", "Tech2", "Tech3"],
      "github": "https://github.com/you/project",
      "demo": "https://demo-link.com",
      "impact": "Quantified impact (users, time saved, revenue, etc.)",
      "role_fit": ["ai_engineer", "full_stack_engineer", ...],
      "highlights": [
        "Key technical achievement 1",
        "Key technical achievement 2",
        "Key technical achievement 3"
      ],
      "metrics": {
        "users": 1000,
        "performance_improvement_percent": 50,
        "features_shipped": 10
      }
    }
  ]
}
```

**Important fields:**

- **role_fit** - Which roles this project is relevant for
  - Options: `ai_engineer`, `ml_engineer`, `full_stack_engineer`, `backend_engineer`, `frontend_engineer`, `mobile_engineer`, `data_engineer`, `robotics_engineer`
- **metrics** - Quantified results (system uses these for impact statements)
- **technologies** - Exact names (matched against job requirements)

**Pro tips:**
- Include 5-10 projects (system selects best 3 per application)
- Focus on **impact** not just features built
- Use **numbers** heavily (users, latency, revenue, time saved)
- Update `role_fit` to match your target roles

### 2.3 Skills Section

**Organize by category:**

```json
{
  "skills": [
    {
      "category": "Programming Languages",
      "items": ["Python", "JavaScript", "TypeScript"],
      "proficiency": ["Expert", "Expert", "Advanced"],
      "years_experience": [7, 6, 4]
    },
    {
      "category": "AI & Machine Learning",
      "items": ["LangChain", "OpenAI API", "RAG Systems"],
      "proficiency": ["Advanced", "Advanced", "Expert"],
      "years_experience": [2, 2, 3]
    }
  ]
}
```

**Categories to include:**
- Programming Languages
- AI & Machine Learning (if applicable)
- Web Frameworks / Backend / Frontend
- Databases
- Cloud & DevOps
- Tools & Platforms

**Proficiency levels:**
- **Expert** (5+ years, can mentor others)
- **Advanced** (3-5 years, production experience)
- **Intermediate** (1-3 years, comfortable working independently)
- **Beginner** (<1 year, learning) - *don't include these*

### 2.4 Education Section

```json
{
  "education": [
    {
      "institution": "University Name",
      "degree": "Master of Science" | "Bachelor of Science" | ...,
      "field": "Computer Science",
      "location": "City, State",
      "graduation_year": 2020,
      "gpa": "3.8/4.0",
      "relevant_coursework": [
        "Machine Learning",
        "Distributed Systems"
      ]
    }
  ]
}
```

---

## Part 3: Profile Summary (Compressed)

### File: `job-prep/applications/_resources/profile-summary.md`

**Purpose:** 200-token compressed version for fast loading (MCP alternative).

**Template:**

```markdown
# Profile Summary (Compressed)

**Your Name** | Current Title → Target Title

X years software engineering, Y years in specialty. MS Computer Science (University).

## CURRENT:
- Current Company: Current project/role description (key technologies). Impact metric.
- Role: Current title, transitioning to target

## RECENT EXPERIENCE:
- Company 1 (Xy): Key achievement with numbers
- Company 2 (Xy): Key achievement with numbers

## CORE EXPERTISE:
- Category 1: Skill, Skill, Skill
- Category 2: Skill, Skill, Skill
- Category 3: Skill, Skill, Skill

## STANDOUT PROJECTS:
1. Project Name - Brief description (metric)
2. Project Name - Brief description (metric)
3. Project Name - Brief description (metric)

## EDUCATION:
- MS Degree - University (Year)
- BS Degree - University (Year)

**Target Roles:** Role 1, Role 2, Role 3
**Location:** Remote / City / Flexible
```

**Keep it under 300 words!** This is loaded frequently.

---

## Part 4: Resume Baseline Template

### File: `job-prep/applications/_resources/baseline-resume-data.json`

**Purpose:** The source of truth for all resume generation.

**Critical sections to customize:**

### 4.1 Basics

```json
{
  "basics": {
    "name": "Your Full Name",
    "email": "your.email@example.com",
    "phone": "+1-555-YOUR-PHONE",
    "website": "linkedin.com/in/yourprofile",
    "location": {
      "address": "City, State"
    }
  }
}
```

### 4.2 Summary

```json
{
  "summary": "Your positioning statement. Focus on: Current role, key skills, unique value proposition. 2-3 sentences maximum."
}
```

**Formula:**
```
[Title] building [type of systems] that [business outcome].
[Recent achievement with numbers].
Experience spans [breadth].
[Years] developing [domain] across [contexts].
```

**Example:**
```
AI Engineer building production multi-agent systems that improve operational efficiency by 50-80%.
Recent work includes LangChain-based analytics agents and RAG diagnostic tools in production use.
Experience spans full-stack development, embedded systems, and distributed applications.
5+ years developing production systems across robotics, AI applications, and cloud platforms.
```

### 4.3 Work Experience

**Structure:**

```json
{
  "work": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "startDate": "MM/YYYY",
      "endDate": "Present" | "MM/YYYY",
      "highlights": [
        "Bullet 1: Achievement with quantified impact",
        "Bullet 2: Technical accomplishment",
        "Bullet 3: Leadership or process improvement"
      ]
    }
  ]
}
```

**Bullet formula:**
```
[Action Verb] + [What you did] + [Technologies] + [Quantified result]
```

**Examples:**
- "Built GenAI diagnostic tool using Ollama and RAG serving 200+ daily users, reducing debug time by 70%"
- "Led release management for 4 major product versions across embedded systems and cloud platforms"
- "Architected full-stack platform handling 10K+ requests/day with <100ms latency using React and Python"

**Use strong action verbs:**
- Built, Architected, Designed, Implemented, Led, Reduced, Increased, Optimized, Scaled, Shipped

### 4.4 Projects

**Include 5-10 projects (system selects best 3):**

```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "One-line description",
      "url": "https://github.com/you/project",
      "highlights": [
        "Key technical achievement (Problem → Solution → Impact)",
        "Another achievement",
        "Third achievement"
      ],
      "keywords": ["Tech1", "Tech2", "Tech3"]
    }
  ]
}
```

**Problem → Solution → Impact format:**
- "Integrated semantic search using FAISS and txtai, enabling 0-token similarity checks and reducing resume generation cost by 70%"

### 4.5 Skills

**Order matters!** Most relevant first.

```json
{
  "skills": [
    {
      "category": "AI & Machine Learning",
      "items": ["LangChain", "RAG Systems", "Multi-agent AI", ...]
    },
    {
      "category": "Programming",
      "items": ["Python", "JavaScript", "C++", ...]
    }
  ]
}
```

**Categories to include:**
- Your specialty first (AI/ML, Backend, Frontend, etc.)
- Programming languages second
- Frameworks third
- Tools/platforms last

---

## Part 5: Locked Content Rules

### What You CANNOT Modify

The system enforces **locked content** to maintain consistency with LinkedIn:

**Locked bullets (never modify):**
- Company X, bullets 2-4
- Company Y, bullets 1-2
- Company Z, bullets 1-2

**Locked fields:**
- Job titles (must match LinkedIn exactly)
- Education degrees and institutions
- Contact information (email, phone)

**Allowed modifications:**
- ✅ Summary (customize for each role)
- ✅ Skills order (reorder for job match)
- ✅ First bullet of specific companies (if allowed)
- ✅ Project selection (choose 3 of 5-10)
- ✅ Project highlights (customize for role)

**To configure locked content:**

Edit `job-prep/applications/_resources/FORMAT-STANDARDS.md`:

```markdown
## Locked Content

**NEVER modify these bullets:**
- Company X, bullets 2-4 (verified on LinkedIn)
- Company Y, bullets 1-2 (verified on LinkedIn)

**Allowed to customize:**
- Company X, bullet 1 (can adapt for role emphasis)
```

---

## Part 6: System Configuration

### File: `.env`

**Common customizations:**

```bash
# Set your agent type (if auto-detection fails)
AGENT_TYPE=claude  # or gemini, openai

# Enable semantic search (if Python API running)
SEMANTIC_API_ENABLED=true

# Similarity thresholds (0.0-1.0)
SIMILARITY_THRESHOLD_USE_EXISTING=0.95  # Lower to reuse more
SIMILARITY_THRESHOLD_TAILOR=0.80        # Lower to tailor more

# Show costs and token usage
SHOW_TOKEN_USAGE=true

# Auto-track applications
AUTO_TRACK_APPLICATIONS=true
```

**Tuning similarity thresholds:**

- **Use Existing threshold (default 0.95):**
  - Higher (0.98): Only reuse for nearly identical roles
  - Lower (0.90): Reuse more often (saves costs)

- **Tailor threshold (default 0.80):**
  - Higher (0.85): Recommend tailoring more often
  - Lower (0.75): Create new more often

**Cost impact:**
- Lower thresholds = More reuse = Lower cost
- Higher thresholds = More new resumes = Higher quality

---

## Part 7: Agent-Specific Customization

### For Claude Code

**File:** `.claude/CLAUDE.md` (already configured, usually no changes needed)

**Optional:** Add custom slash commands in `.claude/commands/`

### For Gemini CLI

**File:** `.gemini/GEMINI.md`

**Customize initial prompt:**

```markdown
# Gemini Resume Agent

You are assisting [Your Name] with job applications.

PROFILE SUMMARY:
[Paste your compressed profile here for faster loading]

CONTEXT FILES:
- Workflow: .agent-config/UNIVERSAL_WORKFLOW.md
- Rules: job-prep/applications/_resources/FORMAT-STANDARDS.md

Ready to assist with applications!
```

---

## Part 8: Portfolio Website (Optional)

If using the portfolio website, customize:

### `data/skills.json`

```json
{
  "categories": [
    {
      "name": "Your Specialty",
      "skills": [
        {
          "name": "Skill Name",
          "level": "Expert" | "Advanced" | "Intermediate",
          "years": 5
        }
      ]
    }
  ]
}
```

### `data/timeline.json`

```json
{
  "events": [
    {
      "date": "2020-01",
      "company": "Company Name",
      "role": "Job Title",
      "description": "What you did",
      "type": "work" | "education" | "project"
    }
  ]
}
```

### `data/projects.json`

```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "Description",
      "image": "media/project-screenshot.jpg",
      "technologies": ["Tech1", "Tech2"],
      "github": "https://github.com/...",
      "demo": "https://demo.com"
    }
  ]
}
```

---

## Testing Your Customization

### Validate Your Data

**1. Check JSON syntax:**

```bash
# Validate knowledge graph
node -e "console.log(JSON.parse(require('fs').readFileSync('resume-memory-mcp/data/knowledge-graph.json')))"

# Validate baseline resume
node -e "console.log(JSON.parse(require('fs').readFileSync('job-prep/applications/_resources/baseline-resume-data.json')))"
```

**2. Test profile loading:**

```bash
# If using MCP (Claude Code):
mcp__resume-memory__get_profile_summary()

# If using files (Gemini):
cat job-prep/applications/_resources/profile-summary.md
# Should show your compressed profile
```

**3. Generate test resume:**

Use a fake job posting to test the full workflow without applying to a real job.

---

## Common Mistakes

### ❌ Too Much Detail in Knowledge Graph

**Problem:** Knowledge graph becomes 50KB+

**Fix:** Keep projects to 5-10, companies to 5, skills to 30. Quality over quantity.

### ❌ No Quantified Metrics

**Problem:** Bullets like "Built a web app"

**Fix:** Add numbers! "Built web app serving 1,000+ users with <100ms latency"

### ❌ Outdated Technologies

**Problem:** Listing technologies you used 5 years ago and forgot

**Fix:** Only list what you can discuss in an interview

### ❌ Inconsistent Naming

**Problem:** "JavaScript" vs "Javascript" vs "JS"

**Fix:** Use canonical names consistently (check job postings for standard names)

### ❌ No Role Fit Tags

**Problem:** Projects don't have `role_fit` array

**Fix:** Add role_fit to every project so system knows when to use it

---

## Next Steps

After customizing:

1. **Validate:** Check JSON syntax
2. **Test:** Generate a test resume
3. **Refine:** Update based on results
4. **Use:** Start applying to real jobs!

**For ongoing updates:**
- Add new projects as you build them
- Update skills as you learn
- Keep companies section current
- Refine locked content rules as needed

---

## Summary

**Essential customization (20 min):**
1. Contact info (`data/profile.json`)
2. Knowledge graph (`knowledge-graph.json`)
3. Profile summary (`profile-summary.md`)
4. Baseline resume (`baseline-resume-data.json`)

**Result:** Personalized resume generation system ready to use!

---

**Questions?** See `SETUP_FOR_DISTRIBUTION.md` for troubleshooting.
**Ready to use?** See `.agent-config/UNIVERSAL_WORKFLOW.md` for how to generate resumes.
