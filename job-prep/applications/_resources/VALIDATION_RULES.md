# Resume Generation Validation Rules

**Purpose:** Prevent common mistakes when generating resumes. Claude MUST check these rules before creating ANY resume.

---

## FILE NAMING CONVENTION (MANDATORY)

**Resume PDF:**
```
vireshduvvuri_{job-title}_{company-name}_{YYYY-MM-DD}.pdf
```

**Resume Draft (Markdown):**
```
resume-draft_{job-title}_{company-name}_{YYYY-MM-DD}.md
```

**Rules:**
- Job title: lowercase, hyphens (e.g., `ai-engineer`, `senior-software-engineer`)
- Company name: lowercase, hyphens if needed (e.g., `ifit`, `google`, `jp-morgan`)
- Timestamp: Application date in `YYYY-MM-DD` format
- NO spaces, NO uppercase, NO generic names like `resume.pdf`

**Examples:**
- ✅ `vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf`
- ✅ `resume-draft_ai-engineer_ifit_2025-11-03.md`
- ❌ `resume.pdf`
- ❌ `Viresh-Resume-iFIT.pdf`

---

## MANDATORY PRE-FLIGHT CHECKLIST

Before generating resume draft or PDF, Claude MUST verify:

### Work Experience Bullet Counts
- [ ] **Lumenier:** EXACTLY 2 bullets (LOCKED - never modify)
- [ ] **York Exponential:** EXACTLY 2 bullets (LOCKED - never modify)
- [ ] **Freefly Systems:** EXACTLY 4 bullets (1 customizable + 3 LOCKED)
- [ ] **Grid CoOperator:** EXACTLY 3 bullets (all customizable)

### Locked Content Verification
- [ ] **Lumenier bullet 1:** Contains "LiDAR and optical flow sensors"
- [ ] **Lumenier bullet 2:** Contains "open-source flight control software maintainers" (NOT "PX4")
- [ ] **York bullet 1:** Contains "ROS2, SLAM, and computer vision"
- [ ] **York bullet 2:** Contains "Human Machine Interface" and "Python and Kivy"
- [ ] **Freefly bullets 2-4:** Match LOCKED template exactly (flight control, release management, automated systems)

### Date Verification
- [ ] **Grid CoOperator:** 03/2025 - Present (NOT 07/2025)
- [ ] **Freefly Systems:** 11/2021 - 10/2025
- [ ] **Lumenier:** 07/2020 - 10/2021
- [ ] **York Exponential:** 08/2018 - 05/2020

### Projects Format
- [ ] Each project has EXACTLY 3 bullets (Problem/Solution/Impact)
- [ ] Each bullet starts with "Problem:", "Solution:", or "Impact:"
- [ ] Using `highlights` array (NOT single `description` field)

### Education
- [ ] **WSU:** Master of Science in Computer Science, Jan 2015 - Jan 2017
- [ ] **GITAM:** Bachelor of Technology in Information Technology, Jan 2011 - Jan 2015

### Summary & Skills
- [ ] NO `label` field in JSON (to avoid title mismatch)
- [ ] Summary uses `basics.summary` field
- [ ] Skills reordered to match job requirements (not changed, just reordered)

### File Naming
- [ ] Resume draft: `resume-draft_{job-title}_{company-name}_{YYYY-MM-DD}.md`
- [ ] Resume PDF: `vireshduvvuri_{job-title}_{company-name}_{YYYY-MM-DD}.pdf`
- [ ] Lowercase only, hyphens for spaces, no generic names
- [ ] MCP folderPath: `per_wesite_job_prep/{company-role}/` (generates directly, no copying)

---

## LOCKED SECTIONS - COPY VERBATIM

### Lumenier (2 bullets - NEVER CHANGE)
```json
"highlights": [
  "Wrote embedded code in C++ to integrate LiDAR and optical flow sensors for obstacle avoidance and position holding with/without GPS under various lighting conditions",
  "Collaborated with open-source flight control software maintainers for integration, testing, and deployment of autonomous flight algorithms, prototyped innovative features like toss-to-launch for product roadmap development"
]
```

### York Exponential (2 bullets - NEVER CHANGE)
```json
"highlights": [
  "Developed prototype software for in-house autonomous surveillance mobile robots using ROS2, SLAM, and computer vision technologies",
  "Built Human Machine Interface for Universal Robot welding applications using Python and Kivy framework, implemented multi-robot control systems with platform independence"
]
```

### Freefly Systems - Bullets 2-4 (LOCKED - NEVER CHANGE)
```json
"highlights": [
  "[CUSTOMIZABLE - See variations in RESUME_TEMPLATE_FULL.md]",
  "Contributed to drone platform codebases implementing new features and optimizations for flight control systems and payload integration across multiple product lines, managed software integration projects from planning through release",
  "Led release management for drone platforms overseeing testing phases from alpha through production deployment, coordinating firmware updates and executing comprehensive testing protocols with cross-functional teams",
  "Built automated systems to process complex technical data and identify system failures, developing knowledge base enhancements and support tools that streamlined operations"
]
```

**Only Freefly bullet 1 is customizable** - choose variation based on role:
- **AI Engineer:** "Built and deployed GenAI-powered agent for automated log analysis from concept to production, integrating foundation model APIs (Ollama, Llama 3.2) with evaluation frameworks and model governance practices, serving 200+ daily queries"
- **Software/Product Engineer:** "Developed comprehensive diagnostic and analysis tools for engineering teams, independently designed and built AI-powered diagnostic tool using Python and modern LLM frameworks from requirements to production, improving customer self-service capabilities and team response times by 40%"

---

## VALIDATION PROTOCOL

### Step 1: Before Creating Resume Draft
1. Read job posting
2. Assess fit
3. Get user approval on fit assessment
4. Plan customizations (summary, skills order, GridCOP bullets, Freefly bullet 1)

### Step 2: Create Markdown Draft
1. Generate resume in **MARKDOWN format** first
2. Show checklist above with checkmarks
3. Present markdown to user for review
4. Wait for user approval

### Step 3: Generate PDF (Only After Approval)
1. Convert approved markdown to JSON format
2. Run validation checks again
3. Generate PDF with MCP tool
4. Extract text from PDF and verify against checklist
5. Report any discrepancies

---

## COMMON MISTAKES TO AVOID

❌ **Don't:**
- Customize Lumenier/York bullets
- Customize Freefly bullets 2-4 (only bullet 1)
- Add more than 3 bullets to GridCOP
- Use GridCOP date as 07/2025 (should be 03/2025)
- Add `label` field to JSON
- Use single `description` field for projects
- Change education details
- Change employment dates

✅ **Do:**
- Customize summary for role type
- Reorder skills sections (not individual skills)
- Customize all 3 GridCOP bullets
- Customize Freefly bullet 1 only
- Select 2-3 most relevant projects
- Use Problem/Solution/Impact format for projects

---

## VALIDATION CHECKLIST OUTPUT FORMAT

When presenting resume draft, Claude MUST include:

```markdown
## PRE-GENERATION VALIDATION ✓

**Work Experience:**
✅ Lumenier: 2 bullets (LOCKED - verified)
✅ York: 2 bullets (LOCKED - verified)
✅ Freefly: 4 bullets (bullet 1 customized, bullets 2-4 LOCKED - verified)
✅ GridCOP: 3 bullets (all customized for AI Engineer role)

**Dates:**
✅ GridCOP: 03/2025 - Present
✅ Freefly: 11/2021 - 10/2025
✅ Lumenier: 07/2020 - 10/2021
✅ York: 08/2018 - 05/2020

**Projects:**
✅ GridCOP: 3 bullets (Problem/Solution/Impact)
✅ Production Tool: 3 bullets (Problem/Solution/Impact)
✅ AI Travel Planner: 3 bullets (Problem/Solution/Impact)

**Other:**
✅ No `label` field
✅ Summary customized for AI Engineer
✅ Skills reordered (AI/ML first)
✅ Education unchanged

**Ready for review.**
```

---

## ERROR MESSAGES

If validation fails, Claude MUST:

1. **Stop immediately** - Do not generate PDF
2. **Report specific errors** with line numbers
3. **Show what should be** vs what was found
4. **Ask user** if they want to fix or override

Example:
```
❌ VALIDATION FAILED

Error 1: Lumenier has 3 bullets (expected 2 LOCKED bullets)
  Found: 3 bullets
  Expected: 2 bullets matching LOCKED template

Error 2: Freefly bullet 2 was modified
  Found: "Custom bullet text..."
  Expected: "Contributed to drone platform codebases..."

Do you want me to:
1. Fix automatically (use LOCKED templates)
2. Show me what needs to change
3. Override validation (not recommended)
```

---

## INTEGRATION WITH WORKFLOW

This validation happens at these points:

1. **Before markdown draft:** Check customization plan
2. **After markdown draft:** Verify structure
3. **Before PDF generation:** Final validation
4. **After PDF generation:** Extract and verify actual PDF content

---

**Last Updated:** 2025-11-03
**Source of Truth:** RESUME_TEMPLATE_FULL.md, RESUME_CORE.md
