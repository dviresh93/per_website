# Resume Application Workflow - MANDATORY PROCESS

**Version:** 2.0
**Last Updated:** 2025-11-10
**Status:** ACTIVE - MUST FOLLOW

---

## Overview

This is the **ONLY approved workflow** for job applications. It uses the optimized resume generation system with similarity checking, reasoning, and validation.

**Key Benefits:**
- 0 tokens for similarity check (vs 7,500)
- Top 3 similar resumes shown automatically
- Intelligent recommendations (Use/Tailor/Create)
- Validation enforcement (prevents locked content violations)
- 50-70% cost reduction on average

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
- ✅ **Strengths:** What matches perfectly (highlight these)
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
- **Strong Fit (85-100%):** Highly recommend applying - excellent match
- **Moderate Fit (70-84%):** Consider applying if role interests you
- **Weak Fit (<70%):** Not recommended unless strategic reason

**Proceed with application?**
```

#### 0.4 Wait for User Confirmation

**DO NOT proceed to Step 1 without user saying:**
- "Yes, proceed"
- "Let's apply"
- "Continue"
- Or similar confirmation

**If user says no:**
- Stop workflow
- Optionally discuss why or suggest better-fit roles

---

### Step 1: SIMILARITY CHECK (AFTER USER CONFIRMS)

**Only execute if user confirmed fit in Step 0.**

#### 1.1 Call Similarity Tool

```
check_resume_similarity({
  company: "[Company Name]",
  role: "[Job Title]",
  requirements: "[Full job requirements text]"
})
```

**This returns:**
- Top 3 most similar applications
- Similarity scores (0-1)
- Resume paths
- Job requirements from matched applications

#### 1.2 Display Top 3 Matches

**Format:**
```markdown
✅ FOUND 3 SIMILAR APPLICATIONS

📊 TOP 3 MATCHES:

🥇 Match #1 - [Score]% similar
   Company: [Company 1]
   Role: [Role 1]
   Resume: [Path]

🥈 Match #2 - [Score]% similar
   Company: [Company 2]
   Role: [Role 2]
   Resume: [Path]

🥉 Match #3 - [Score]% similar
   Company: [Company 3]
   Role: [Role 3]
   Resume: [Path]
```

#### 1.3 Determine Next Action

**If best match ≥80%:**
- Proceed to Step 2 (Generate Reasoning)

**If best match <80%:**
- Show top 3 for reference
- Recommend "Create New"
- Skip to Step 3 (Present Options)

---

### Step 2: GENERATE REASONING (IF MATCH ≥80%)

**Only execute if best match similarity ≥80%.**

#### 2.1 Generate Reasoning Prompt

The MCP tool automatically generates a prompt analyzing:
- Overlapping requirements (what matches)
- Aligned projects (which projects fit new role)
- Gap analysis (what's missing)
- Confidence score (0-100%)

**You (Claude) will see the prompt and execute it automatically.**

#### 2.2 Analyze with LLM

**Response format (JSON):**
```json
{
  "overlapping_requirements": ["req1", "req2", ...],
  "overlapping_count": 8,
  "total_requirements": 10,
  "aligned_projects": [
    {
      "name": "Project Name",
      "fit_level": "STRONG",
      "reason": "Why it fits"
    }
  ],
  "gap_analysis": [
    {
      "requirement": "Missing skill",
      "severity": "MINOR",
      "impact": "How it affects application"
    }
  ],
  "confidence_score": 85,
  "recommendation_reasoning": "Brief explanation"
}
```

#### 2.3 Process Reasoning

```
process_similarity_reasoning({
  reasoningResponse: "[Your JSON analysis]",
  matchedApplication: "[Best match data]",
  similarityScore: 0.85
})
```

**This automatically:**
- Parses your reasoning
- Runs auto-recommender decision tree
- Generates 3 options with costs

---

### Step 3: PRESENT OPTIONS & WAIT FOR USER CHOICE

**Display all 3 options with recommendation:**

```markdown
🎯 AUTO-RECOMMENDATION: [Use Existing / Tailor / Create New]
Confidence: HIGH/MEDIUM
Reasoning: [Why this option is recommended]

📋 YOUR OPTIONS:

[1] Use Existing Resume (0 min, $0.00)
    ✅ Instant - ready to apply now
    ✅ No cost
    ✅ Maintains consistency
    ❌ [X] gaps not addressed
    ❌ No customization for new role

    Best for: 95%+ match with minimal gaps

[2] Tailor Resume ⭐ (2 min, $0.03)
    ✅ Addresses specific gaps
    ✅ 60% faster than creating new
    ✅ Builds on proven structure
    ✅ Shows JSON draft for review
    ❌ Requires ~2 minutes
    ❌ Small cost (~$0.03)

    Best for: 85-95% similar with fixable gaps
    Typical updates: Summary, skills order, Freefly bullet 1, projects

[3] Create New Resume (5 min, $0.09)
    ✅ Fully optimized for new role
    ✅ Fresh project selection
    ✅ Rethink structure and emphasis
    ✅ Shows JSON draft for review
    ❌ Takes ~5 minutes
    ❌ Higher cost (~$0.09)

    Best for: <85% similarity, major gaps, or significantly different role

Your choice (1/2/3)? [Press Enter for recommended]
```

**WAIT for user to choose 1, 2, or 3.**

**DO NOT proceed without explicit choice.**

---

### Step 4: EXECUTE USER'S CHOICE

#### Option 1: Use Existing Resume

**Steps:**
1. Copy PDF from matched application path:
   ```bash
   cp [matched_resume_path] job-prep/applications/[new-company-role]/resume.pdf
   ```

2. Track application:
   ```
   track_application({
     company: "[Company]",
     role: "[Role]",
     resume_reused: true,
     reused_from: "[matched_application_id]",
     tokens_used: 500,
     cost_usd: 0.006
   })
   ```

3. Done! Total cost: $0.006 (reasoning only)

---

#### Option 2 or 3: Tailor / Create New Resume

**Steps:**

##### 4.1 Load Baseline Resume

```
Read: job-prep/applications/_resources/baseline-resume-data.json
```

**This is the SOURCE OF TRUTH. Never modify locked content.**

##### 4.2 Identify Customization Sections

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

##### 4.3 Customize for Role

**Tailor (Option 2):** Minor updates based on gap analysis
- Update summary (add missing keywords)
- Reorder skills (priority for role)
- Adjust Freefly bullet 1
- Tweak 1-2 project bullets if needed

**Create New (Option 3):** Full customization
- Rewrite summary for role positioning
- Reorganize all skills
- Rewrite Freefly bullet 1
- Select 3 most relevant projects
- Rewrite project highlights

##### 4.4 Show JSON Draft

**Present complete JSON to user:**
```json
{
  "basics": { ... },
  "summary": "[Show changes highlighted]",
  "work": [
    {
      "company": "Grid CoOperator",
      "highlights": ["...", "...", "..."]
    },
    {
      "company": "Freefly Systems",
      "highlights": [
        "[CUSTOMIZED - Bullet 1]",  ← Changed
        "[LOCKED - Bullet 2]",      ← Unchanged
        "[LOCKED - Bullet 3]",      ← Unchanged
        "[LOCKED - Bullet 4]"       ← Unchanged
      ]
    },
    ...
  ],
  "skills": [ ... ],
  "projects": [ ... ]
}
```

**Ask:** "Does this look correct? Any changes needed?"

**WAIT for user approval.**

##### 4.4.1 Content Review (Markdown) - MANDATORY

**Before generating PDF, convert JSON to Markdown for easier review:**

1. Generate `RESUME_CONTENT_REVIEW.md` showing:
   - Summary
   - Skills (ordered)
   - Work Highlights (especially customized ones)
   - Selected Projects

2. **Ask:** "Please review the content in markdown format. Is the tone and emphasis correct?"

3. **Iterate** until user gives the green light.


##### 4.5 Validate Resume

```
validate_resume(resumeData)
```

**Validation checks:**
- ✓ Locked bullets unchanged
- ✓ Job titles correct
- ✓ Bullet count pattern: 3-4-2-2
- ✓ Education unchanged
- ✓ Contact info correct

**If validation FAILS:**
```
❌ VALIDATION ERRORS:

1. Freefly bullet 2 modified (LOCKED)
2. York bullet count wrong (expected 2, got 3)
...

⛔ RESUME GENERATION BLOCKED

Fix these errors using baseline-resume-data.json, then re-validate.
```

**DO NOT proceed to PDF generation if validation fails.**

**If validation PASSES:**
```
✅ All checks passed! Resume is safe to generate.
```

##### 4.6 Generate PDF

```
```
mcp__resume-generator__generate_resume(
  resumeData,
  folderPath: "[company-role]",
  filename: "resume"
)
```

**OR (For Agents/Standalone):**

Use the standalone script `generate-resume-standalone.mjs` if MCP tool is inaccessible:
```bash
node generate-resume-standalone.mjs
```

##### 4.7 Track Application

```
track_application({
  company: "[Company]",
  role: "[Role]",
  role_type: "ai_engineer",
  projects_selected: ["Project 1", "Project 2", "Project 3"],
  resume_path: "[generated PDF path]",
  resume_reused: false,
  tokens_used: 2500 or 7500,
  cost_usd: 0.03 or 0.09
})
```

---

### Step 5: COMPLETION

**Inform user:**
```markdown
✅ APPLICATION COMPLETE!

Resume generated: [path]
Tracked in database: ✅
Tokens used: [amount]
Cost: $[amount]

Next steps:
1. Review the PDF
2. Apply through company portal
3. Network on LinkedIn
```

---

## Examples

### Example 1: Strong Match (Use Existing)

**User:** "Help me apply to Meta AI Engineer"

**Step 0:** Fit analysis → 92% fit → User confirms

**Step 1:** Similarity check → Google AI Engineer (95% match)

**Step 2:** Reasoning generated → 90% overlap, 2 minor gaps, confidence 88%

**Step 3:** Auto-recommends "Use Existing"

**User chooses:** 1 (Use Existing)

**Step 4:** Copy PDF from Google application

**Result:** Done in 1 minute, $0.006 cost

---

### Example 2: Moderate Match (Tailor)

**User:** "Apply to Stripe AI Engineer"

**Step 0:** Fit 87% → User confirms

**Step 1:** Similarity → Anthropic AI Engineer (88% match)

**Step 2:** Reasoning → 75% overlap, 3 moderate gaps (payments domain, fintech)

**Step 3:** Auto-recommends "Tailor"

**User chooses:** 2 (Tailor)

**Step 4:**
- Load baseline
- Add "fintech" to summary
- Reorder skills (put payments-related higher)
- Adjust Freefly bullet 1
- Show JSON → User approves
- Validate → Pass
- Generate PDF

**Result:** 2 minutes, $0.03

---

### Example 3: Weak Match (Create New)

**User:** "Apply to Finance Data Scientist"

**Step 0:** Fit 76% → User confirms

**Step 1:** Similarity → AI Engineer roles (top match 65%)

**Step 2:** Skipped (below 80%)

**Step 3:** Recommends "Create New"

**User chooses:** 3 (Create New)

**Step 4:**
- Load baseline
- Rewrite summary (Data Scientist positioning)
- Reorganize skills (ML/DS first)
- Select DS-relevant projects
- Show JSON → User approves
- Validate → Pass
- Generate PDF

**Result:** 5 minutes, $0.09

---

## Troubleshooting

### Similarity API Not Running

**Error:** "API not running"

**Fix:**
```bash
/home/virus/Documents/repo/per_wesite/resume-memory-mcp/start-system.sh
```

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

## Cost Summary

| Scenario | Similarity | Reasoning | Generation | Total |
|----------|-----------|-----------|------------|-------|
| Use Existing (95%+) | $0 | $0.006 | $0 | $0.006 |
| Tailor (85-95%) | $0 | $0.006 | $0.024 | $0.03 |
| Create New (<85%) | $0 | $0 | $0.09 | $0.09 |

**Average savings:** 50-70% vs always creating new

---

## Checkpoints Summary

| Checkpoint | User Approval Required? | Can Skip? |
|------------|-------------------------|-----------|
| 0. Fit analysis result | ✋ YES | ❌ NO |
| 1. Similarity check | No (informational) | ❌ NO |
| 2. Reasoning analysis | No (automated) | ✅ If <80% |
| 3. Choose option | ✋ YES | ❌ NO |
| 4. JSON draft review | ✋ YES | ❌ NO |
| 5. Validation | No (automated) | ❌ NO |

**3 user approval points:**
1. Confirm fit (proceed with application?)
2. Choose option (1/2/3)
3. Approve JSON draft

---

## Important Notes

- This workflow is **mandatory** - do not use old manual process
- Always start with fit analysis
- Always check similarity before creating anything
- Always validate before PDF generation
- Never modify locked content
- User approval required at 3 checkpoints

---

**For technical implementation details, see:** `optimization-project/RESUME_GENERATION_WORKFLOW.md`
