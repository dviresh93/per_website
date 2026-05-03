# Resume Application Workflow - MANDATORY PROCESS

**Version:** 3.0
**Last Updated:** 2026-05-02
**Status:** ACTIVE - MUST FOLLOW

---

## Overview

This is the **ONLY approved workflow** for job applications. It goes directly from fit analysis to resume generation — no similarity check step.

**Workflow:**
```
Step 0: FIT ANALYSIS → user confirms
Step 1: CUSTOMIZE RESUME (from baseline) → user approves JSON
Step 2: VALIDATE → GENERATE PDF → TRACK
```

---

## Complete Workflow

### Step 0: FIT ANALYSIS (MANDATORY FIRST STEP)

**When user provides a job posting, ALWAYS start here.**

#### 0.1 Parse Job Requirements

Extract from job posting:
- **Technical skills:** LangChain, RAG, Python, AWS, etc.
- **Experience level:** Junior, Mid, Senior, Staff
- **Domain knowledge:** Finance, Healthcare, SaaS, etc.
- **Role type:** AI Engineer, Data Scientist, Full-Stack, etc.
- **Required vs Preferred:** Distinguish must-haves from nice-to-haves

#### 0.2 Compare to User's Profile

**Use compressed profile summary:**
```
Call: get_profile_summary
```

**Analyze:**
- ✅ **Strengths:** What matches perfectly
- ⚠️ **Gaps:** What's missing or weak
- 🔄 **Transferable:** Skills from different domains that apply
- 📊 **Fit Score:** Calculate 0-100%

**Fit Score Calculation:**
```
Core requirements met: 10 points each (max 60)
Preferred requirements met: 5 points each (max 20)
Relevant experience: 10 points
Domain knowledge: 10 points
Total: 0-100%
```

#### 0.3 Provide Assessment

**Format:**
```markdown
## Fit Assessment: [Score]%

**Role:** [Company] - [Title]

**Strengths:**
- ✅ Strength 1 (why it's a match)
- ✅ Strength 2
- ✅ Strength 3

**Gaps:**
- ⚠️ Gap 1 (severity: MINOR/MODERATE/MAJOR)
- ⚠️ Gap 2

**Transferable Skills:**
- 🔄 Skill 1 from [previous domain]

**Recommendation:**
- **Strong Fit (85-100%):** Highly recommend applying
- **Moderate Fit (70-84%):** Consider applying if role interests you
- **Weak Fit (<70%):** Not recommended unless strategic reason

**Proceed with application?**
```

#### 0.4 Wait for User Confirmation

**DO NOT proceed to Step 1 without user saying "yes", "proceed", "continue", or similar.**

---

### Step 1: CUSTOMIZE RESUME (AFTER USER CONFIRMS)

#### 1.1 Load Baseline Resume

```
Read: job-prep/applications/_resources/baseline-resume-data.json
```

**This is the SOURCE OF TRUTH. Never modify locked content.**

#### 1.2 Identify Customization Sections

**Allowed to modify:**
- ✅ Summary
- ✅ Skills order/grouping
- ✅ Freefly bullet 1 (ONLY the first bullet)
- ✅ Projects (selection and highlights)

**LOCKED - NEVER MODIFY:**
- 🔒 Freefly bullets 2-4 (LinkedIn verified)
- 🔒 Lumenier bullets 1-2 (both locked)
- 🔒 York bullets 1-2 (both locked)
- 🔒 Grid CoOperator title: "AI Engineer"
- 🔒 Freefly title: "Senior Software Engineer"
- 🔒 Lumenier title: "Drone Software Developer"
- 🔒 York title: "Software Engineer - R&D"
- 🔒 Education (GITAM University, WSU)
- 🔒 Contact info (email, phone, website)

#### 1.3 Customize for Role

- Rewrite summary for role positioning
- Reorder skills (match job posting priority)
- Update Freefly bullet 1 for role focus
- Select 3 most relevant projects
- Write project highlights targeting this role's keywords

#### 1.4 Show JSON Draft

**Present complete JSON to user:**
```json
{
  "basics": { "..." },
  "work": [
    {
      "company": "Freefly Systems",
      "highlights": [
        "[CUSTOMIZED - Bullet 1]",
        "[LOCKED - Bullet 2]",
        "[LOCKED - Bullet 3]",
        "[LOCKED - Bullet 4]"
      ]
    }
  ],
  "skills": [ "..." ],
  "projects": [ "..." ]
}
```

**Ask:** "Does this look correct? Any changes needed?"

**WAIT for user approval. Iterate until approved.**

---

### Step 2: VALIDATE → GENERATE PDF → TRACK

#### 2.1 Validate Resume

```
validate_resume(resumeData)
```

**Validation checks:**
- ✓ Locked bullets unchanged
- ✓ Job titles correct
- ✓ Bullet count pattern: 3-4-2-2
- ✓ Education unchanged
- ✓ Contact info correct

**If validation FAILS — DO NOT generate PDF. Fix errors first.**

#### 2.2 Generate PDF

```
mcp__resume-generator__generate_resume(
  resumeData,
  folderPath: "[company-role]",
  filename: "viresh-duvvuri_YYMMDD-HHMM_role-title"
)
```

**Fallback (if MCP unavailable):**
```bash
node generate-resume-standalone.mjs
```

#### 2.3 Track Application

```
track_application({
  company: "[Company]",
  role: "[Role]",
  role_type: "ai_engineer",
  projects_selected: ["Project 1", "Project 2", "Project 3"],
  tokens_used: 2500
})
```

---

### Step 3: COMPLETION

```markdown
✅ APPLICATION COMPLETE!

Resume: [path]
Next steps:
1. Review the PDF
2. Apply through company portal
3. Network on LinkedIn
```

---

## Troubleshooting

### Validation Fails

**Error:** Locked content modified

**Fix:**
1. Load baseline-resume-data.json
2. Copy locked sections exactly
3. Re-validate
4. DO NOT generate PDF until validation passes

### User Rejects JSON Draft

**Action:**
1. Ask what needs to change
2. Apply changes
3. Re-present JSON
4. Repeat until approved

---

## Checkpoints Summary

| Checkpoint | User Approval Required? | Can Skip? |
| --- | --- | --- |
| 0. Fit analysis result | YES | NO |
| 1. JSON draft review | YES | NO |
| 2. Validation | No (automated) | NO |
