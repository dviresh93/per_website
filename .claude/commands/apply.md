# Apply Command - Multi-Step Resume Generation with Scratchpad Review

You are helping Viresh apply for a specific job using a **human-in-the-loop workflow** that generates a scratchpad for review BEFORE creating the PDF.

## Prerequisites

**ALWAYS load profile context first:**
- Run `/profile` command to load Viresh's complete background
- This provides employment history, skills, projects, and experience details

**Load baseline resume:**
- File: `job-prep/applications/_resources/baseline-resume-data.json`
- This is the proven format to start from (don't start from scratch)

**Follow format standards:**
- File: `job-prep/applications/_resources/FORMAT-STANDARDS.md`
- All resumes MUST follow: 3-3-3-2 work bullets, 3 projects with Problem/Solution/Impact format

---

## NEW Workflow (Multi-Step with Review)

### Step 1: Job Analysis

When user provides a job description (text, file, or URL), analyze:

1. **Job Title** - Extract exact title from posting
2. **Required Skills** - Must-have technical skills (mark ✅ HAVE or ❌ MISSING)
3. **Preferred Skills** - Nice-to-have skills
4. **Keywords** - Specific technologies, buzzwords, terminology
5. **Company Culture** - Collaboration, innovation, fast-paced, enterprise, etc.
6. **Fit Assessment** - Provide honest percentage (60-95%)

**Output:**
```
## Job Analysis Summary

**Company:** [Name]
**Role:** [Exact title from posting]
**Fit:** [X]%

**Required Skills:**
✅ Python - HAVE (5+ years)
✅ LangChain - HAVE (GridCOP project)
❌ CrewAI - MISSING
🟡 Azure - PARTIAL (can emphasize)

**Keywords:** keyword1, keyword2, keyword3
**Culture:** [collaboration-focused, fast-paced startup, enterprise]

**Recommendation:** [Apply now / Build skills first / Skip]
```

---

### Step 2: Generate Scratchpad (Markdown Format)

**CRITICAL:** Do NOT generate PDF yet. Generate a readable markdown scratchpad for review.

**Load baseline resume:**
```
Read: job-prep/applications/_resources/baseline-resume-data.json
```

**Generate scratchpad showing:**

1. **Job analysis** (from Step 1)
2. **Summary changes** (before → after with their keywords)
3. **Skills reordering** (prioritize their requirements)
4. **Work experience modifications** (which bullets to emphasize/modify)
5. **Project selection** (which 3 projects + why)
6. **Project bullet modifications** (any changes to Problem/Solution/Impact bullets)

**Use template:** `job-prep/applications/_resources/resume-scratchpad-template.md`

**IMPORTANT - Write to file:**
- Save scratchpad to: `job-prep/applications/{company-role}/resume-scratchpad.md`
- Tell user the file path so they can edit it directly
- User can make changes in their editor
- Read the file back when user says "approve" or "modify"

**Output format:** Readable markdown with clear before/after comparisons

**Example output:**
```markdown
# Resume Customization Scratchpad
Company: Acme Corp | Role: Senior AI Engineer | Fit: 85%

## Summary Changes
**CURRENT:**
AI Engineer specializing in multi-agent systems...

**PROPOSED:**
Senior AI Engineer specializing in multi-agent systems and LLM orchestration, with 5+ years...
[Added "Senior", emphasized "LLM orchestration" from job]

## Skills Reordering
Moving their requirements to top:
- LangChain (mentioned 3x in job)
- Multi-Agent Systems (key requirement)
- Azure (their cloud platform)

## Work Experience
Grid CoOperator - Bullet 2: Adding "Azure" keyword
Freefly - Emphasizing "cross-functional collaboration" (their culture value)

## Projects Selected
1. GridCOP (matches multi-agent requirement)
2. Production System Tool (shows production AI experience)
3. AI Travel Planner (shows LLM integration breadth)

---
**APPROVE to generate PDF?** (yes/no/modify)
```

---

### Step 3: Wait for User Approval ⏸️

**DO NOT proceed to PDF generation automatically.**

**Scratchpad is now a file** - User can:
- Edit the file directly in their editor
- Make changes without asking Claude
- Save and tell Claude "approve" when done

User will either:
- ✅ **APPROVE** → Read the scratchpad file and proceed to Step 4
- 🔄 **REQUEST CHANGES** → User can edit file directly OR ask Claude to modify
- ❌ **REJECT** → Stop process

**If user requests changes:**
- If user edited file: Read `resume-scratchpad.md` to see their changes
- If user asks Claude to modify: Update the file and notify user
- Always read the file before proceeding to ensure latest version

---

### Step 4: Generate Resume JSON (Only After Approval)

Once approved, convert scratchpad changes into `resume-data.json`:

**Start from baseline:**
```json
{
  "_comment": "Customized from baseline-resume-data.json for [Company] - [Role]",
  "selectedTemplate": 1,
  "basics": { ... },
  "work": [ ... ],
  "skills": [ ... ],
  "projects": [ ... ],
  "education": [ ... ]
}
```

**Apply all approved customizations:**
- Summary changes
- Skills reordering
- Work bullet modifications
- Project selection and modifications

**Verify format standards:**
- [ ] Work: 3-3-3-2 bullet pattern
- [ ] Projects: 3 projects, each with 3 bullets (Problem/Solution/Impact)
- [ ] Projects use `highlights` array (not `description`)
- [ ] Skills: 4 categories with comprehensive keywords
- [ ] Education: Both degrees included

---

### Step 5: Call MCP Tool to Generate PDF

**Tool:** `mcp__resume-generator__generate_resume`

**Parameters:**
- `resumeData`: Complete JSON object from Step 4
- `filename`: `viresh-duvvuri-[company-name]-[role]` (lowercase, hyphenated)
- `folderPath`: `applications/[company-name]-[role]`

**Example:**
```json
{
  "resumeData": { ...complete JSON from Step 4... },
  "filename": "viresh-duvvuri-acme-senior-ai-engineer",
  "folderPath": "applications/acme-senior-ai-engineer"
}
```

---

### Step 6: Confirmation

After successful PDF generation, provide:

1. **Success message** - "✅ Resume generated successfully!"
2. **Fit summary** - "[X]% match for [Job Title] at [Company]"
3. **Key tailoring** - List 3-5 main customizations made
4. **File location** - Full path to generated PDF
5. **Next steps** - Application strategy (networking, follow-up timeline)

**Example:**
```
✅ Resume generated successfully!

**Fit:** 85% match for Senior AI Engineer at Acme Corp

**Key Tailoring:**
1. Updated title to "Senior AI Engineer"
2. Emphasized LangChain (mentioned 3x in job)
3. Added Azure keywords to work bullets
4. Selected projects demonstrating multi-agent systems
5. Reordered skills to prioritize their tech stack

**File:** /home/virus/Documents/generated-resumes/applications/acme-senior-ai-engineer/viresh-duvvuri-acme-senior-ai-engineer-2025-10-27.pdf

**Next Steps:**
1. Apply through company portal
2. Network with 2-3 employees on LinkedIn within 24h
3. Follow up after 5-7 days if no response
```

---

## Important Guidelines

### Date Consistency (NEVER CHANGE)
- Grid CoOperator: Mar 2025 - Present
- Freefly Systems: Nov 2021 - Oct 2025
- Lumenier: Jul 2020 - Oct 2021
- York Exponential: Aug 2018 - May 2020

### Metrics Consistency (NEVER CHANGE)
- GridCOP: 70% workflow reduction, 40% accuracy improvement, 50-100 queries, 99% uptime
- Freefly AI tool: 200+ daily queries, 80% time reduction
- Lumenier: 45% efficiency improvement, 8 weeks delivery
- York: 50% complexity reduction

### What to Customize
✅ Summary (role title, technology order, emphasis)
✅ Skills keyword order (within categories)
✅ Work bullet emphasis (can add keywords naturally)
✅ Project selection (choose 3 most relevant)

### What NEVER Changes
❌ Employment dates
❌ Job titles
❌ Company names
❌ Core metrics
❌ Bullet count structure (3-3-3-2 work, 3 bullets per project)

### Projects Format (CRITICAL)
**Always use this structure:**
```json
{
  "name": "Project Name | Context",
  "highlights": [
    "Problem: [Clear problem description]",
    "Solution: [Technologies and approach with specifics]",
    "Impact: [Quantified results and learnings]"
  ],
  "keywords": ["Tech1", "Tech2", "Tech3"]
}
```

**Never use:**
- ❌ `description` field for main content
- ❌ Combined paragraph format
- ❌ Technical bullets without Problem/Solution/Impact structure

---

## Error Handling

**If job description incomplete:**
- Request: job title, required skills, company name

**If profile not loaded:**
- Automatically run `/profile` command first

**If baseline not found:**
- Alert user: "Cannot find baseline-resume-data.json"
- Suggest checking file exists in _resources/

**If MCP tool fails:**
- Provide complete JSON for manual generation
- Suggest checking MCP server status

---

## Example Full Workflow

```
User: /apply [job description for Senior AI Engineer at Acme Corp]

You (Step 1 - Analysis):
"Analyzing job for Senior AI Engineer at Acme Corp...

Required Skills:
✅ Python - HAVE
✅ LangChain - HAVE
❌ Azure - Can emphasize (have AWS)

Fit: 85% - Strong match!

Generating scratchpad for review..."

You (Step 2 - Scratchpad):
[Shows detailed scratchpad with proposed changes]

"Review the proposed customizations above. Reply:
- 'approve' to generate PDF
- 'modify [what to change]' to revise
- 'reject' to stop"

User: "approve"

You (Steps 3-6):
[Generates JSON, calls MCP tool, confirms success]

"✅ Resume generated! File saved to: [path]
Ready to apply!"
```

---

## Key Differences from Old Workflow

**OLD:** `/apply [job]` → Immediately generates PDF (no review)
**NEW:** `/apply [job]` → Scratchpad → User review → Approval → PDF

**Benefits:**
- ✅ Human review before final output
- ✅ Catch errors early
- ✅ Iterate on customizations
- ✅ Learn what works (review decisions)
- ✅ More control over final resume

---

**Remember:** Always start from baseline, generate scratchpad for review, wait for approval, then generate PDF. Never skip the review step!
