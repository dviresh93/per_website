# Universal Resume Generation Workflow

**Version:** 1.0.0
**Purpose:** Agent-agnostic workflow for intelligent resume generation
**Applies to:** All coding agents (Claude Code, Gemini CLI, GPT-4, Custom)

---

## Workflow Overview

This document defines the **universal resume generation process** that works with any coding agent. Agent-specific implementations are in the `agents/` directory.

```
User provides job posting
         ↓
Step 0: Fit Analysis (MANDATORY)
         ↓
Step 1: Similarity Check
         ↓
Step 2: Generate Reasoning (if match ≥80%)
         ↓
Step 3: Present Options & Wait for User
         ↓
Step 4: Execute User's Choice
         ↓
Step 5: Track & Complete
```

---

## Core Principles

1. **File-Based:** All data stored in files (JSON, Markdown, PDF)
2. **Human-in-Loop:** Three approval checkpoints mandatory
3. **Graceful Degradation:** Works without optional features (MCP, similarity API)
4. **Validation Required:** Never generate PDF without validation
5. **Context Minimal:** Use compressed profile, not full context

---

## Step 0: Fit Analysis (MANDATORY FIRST STEP)

### Purpose
Determine if user should apply to this role before spending time on resume generation.

### Prerequisites
- **File Access:** Read capability
- **Context:** User's profile summary (compressed)
- **Optional:** Knowledge graph for skill matching

### Process

#### 0.1 Parse Job Requirements

Extract from job posting:
```
Required:
- Technical skills (e.g., Python, LangChain, RAG)
- Experience level (Junior: 0-2yr, Mid: 3-5yr, Senior: 5-10yr, Staff: 10+yr)
- Domain knowledge (Finance, Healthcare, SaaS, etc.)
- Role type (ai_engineer, ml_engineer, full_stack_engineer, etc.)

Preferred:
- Nice-to-have skills
- Certifications
- Education requirements
```

#### 0.2 Load User Profile

**If MCP available:**
```
Call: mcp__resume-memory__get_profile_summary()
Returns: 200-token compressed profile
```

**If MCP not available:**
```
Read: job-prep/applications/_resources/profile-summary.md
Fallback: Extract from baseline-resume-data.json
```

#### 0.3 Calculate Fit Score

**Scoring rubric:**
```
Core requirements met:     10 points each (max 60)
Preferred requirements:     5 points each (max 20)
Relevant experience:       10 points
Domain knowledge:          10 points
─────────────────────────
Total:                     0-100%
```

**Fit levels:**
- **Strong (85-100%):** Highly recommend applying
- **Moderate (70-84%):** Consider applying if interested
- **Weak (<70%):** Not recommended unless strategic

#### 0.4 Present Assessment

**Output format:**
```markdown
## Fit Assessment: [Score]%

**Role:** [Company] - [Title]

**Strengths:**
- ✅ Strength 1 (specific match to job requirement)
- ✅ Strength 2
- ✅ Strength 3

**Gaps:**
- ⚠️ Gap 1 (severity: MINOR/MODERATE/MAJOR)
- ⚠️ Gap 2

**Transferable Skills:**
- 🔄 Skill 1 from [previous domain]

**Recommendation:**
[Strong Fit / Moderate Fit / Weak Fit]

**Proceed with application?**
```

#### 0.5 Wait for User Confirmation

**CRITICAL:** Do NOT proceed to Step 1 without explicit confirmation:
- "Yes, proceed"
- "Let's apply"
- "Continue"

**If user says no:** Stop workflow, optionally discuss reasons.

---

## Step 1: Similarity Check

### Purpose
Find similar past applications to avoid duplicating work.

### Prerequisites
- **File Access:** Read capability
- **Optional:** MCP resume-memory tool
- **Optional:** Semantic search API (txtai)

### Process

#### 1.1 Check for Similar Applications

**If MCP available:**
```
Call: mcp__resume-memory__check_resume_similarity({
  company: "[Company Name]",
  role: "[Job Title]",
  requirements: "[Full job requirements text]",
  threshold: 0.80
})

Returns:
- top_3_matches: Array of similar applications
- best_match: Highest similarity application
- needs_reasoning: Boolean (true if best_match ≥80%)
```

**If MCP not available:**
```
Read: job-prep/applications/README.md (master tracker)
Parse: Extract all past applications
Compare: Keyword-based similarity
  - Count overlapping keywords
  - Calculate: (overlap / total) * 100
```

#### 1.2 Display Top 3 Matches

**Format:**
```
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

```
IF best_match ≥80%:
  → Proceed to Step 2 (Generate Reasoning)
ELSE:
  → Show top 3 for reference
  → Skip to Step 3 (Present Options with "Create New" recommendation)
```

---

## Step 2: Generate Reasoning (If Match ≥80%)

### Purpose
Analyze whether to reuse, tailor, or create new resume.

### Prerequisites
- **Capability:** LLM reasoning (agent's native capability)
- **Context:** Best match data from Step 1
- **Context:** New job requirements

### Process

#### 2.1 Analyze Overlap

**Prompt structure:**
```
You are analyzing job similarity.

PREVIOUS APPLICATION:
Company: [Company]
Role: [Role]
Requirements: [Previous job requirements]

NEW APPLICATION:
Company: [Company]
Role: [Role]
Requirements: [New job requirements]

Analyze:
1. Overlapping requirements (what matches)
2. Aligned projects (which projects fit new role)
3. Gap analysis (what's missing)
4. Confidence score (0-100%)

Return JSON format:
{
  "overlapping_requirements": ["req1", "req2", ...],
  "overlapping_count": 8,
  "total_requirements": 10,
  "aligned_projects": [
    {
      "name": "Project Name",
      "fit_level": "STRONG" | "MODERATE" | "WEAK",
      "reason": "Why it fits"
    }
  ],
  "gap_analysis": [
    {
      "requirement": "Missing skill",
      "severity": "MINOR" | "MODERATE" | "MAJOR",
      "impact": "How it affects application"
    }
  ],
  "confidence_score": 85,
  "recommendation_reasoning": "Brief explanation"
}
```

#### 2.2 Process Reasoning

**If MCP available:**
```
Call: mcp__resume-memory__process_similarity_reasoning({
  reasoningResponse: "[Your JSON analysis]",
  matchedApplication: "[Best match data]",
  similarityScore: 0.85
})

Returns:
- auto_recommendation: "use_existing" | "tailor" | "create_new"
- confidence: "HIGH" | "MEDIUM" | "LOW"
- options: All 3 options with costs and benefits
```

**If MCP not available:**
```
Apply decision tree locally:
  IF confidence ≥90% AND gaps ≤2 minor:
    → Recommend "use_existing"
  ELSE IF confidence ≥85% AND gaps ≤3 moderate:
    → Recommend "tailor"
  ELSE:
    → Recommend "create_new"
```

---

## Step 3: Present Options & Wait for User Choice

### Purpose
Give user control over resume strategy.

### Prerequisites
- **Capability:** User interaction (wait for input)
- **Context:** Reasoning from Step 2 (or default recommendations)

### Process

#### 3.1 Display All 3 Options

**Format:**
```markdown
🎯 AUTO-RECOMMENDATION: [Use Existing / Tailor / Create New]
Confidence: HIGH/MEDIUM/LOW
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

#### 3.2 Wait for User Input

**CRITICAL:** Do NOT proceed without explicit choice.

**Valid inputs:**
- `1` → Use Existing
- `2` → Tailor Resume
- `3` → Create New Resume
- `[Enter]` → Use recommended option

---

## Step 4: Execute User's Choice

### Option 1: Use Existing Resume

**Steps:**
1. Copy PDF from matched application path
   ```
   Read: [matched_resume_path]
   Write: job-prep/applications/[new-company-role]/resume.pdf
   ```

2. Track application (if MCP available)
   ```
   Call: mcp__resume-memory__track_application({
     company: "[Company]",
     role: "[Role]",
     resume_reused: true,
     reused_from: "[matched_application_id]",
     tokens_used: 500,
     cost_usd: 0.006
   })
   ```

3. **Done!** Total cost: $0.006 (reasoning only)

---

### Option 2 or 3: Tailor / Create New Resume

**Steps:**

#### 4.1 Load Baseline Resume

```
Read: job-prep/applications/_resources/baseline-resume-data.json
```

**This is the SOURCE OF TRUTH.** Never modify locked content:
- 🔒 Freefly bullets 2-4 (LinkedIn verified)
- 🔒 Lumenier bullets 1-2 (both locked)
- 🔒 York bullets 1-2 (both locked)
- 🔒 Job titles (Grid CoOperator: "AI Engineer", etc.)
- 🔒 Education, Contact info

#### 4.2 Customize for Role

**Allowed to modify:**
- ✅ Summary
- ✅ Skills order/grouping
- ✅ Freefly bullet 1 (ONLY the first bullet)
- ✅ Projects (selection and highlights)

**Tailor (Option 2):** Minor updates
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

#### 4.3 Show JSON Draft

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
    }
  ],
  "skills": [ ... ],
  "projects": [ ... ]
}
```

**Ask:** "Does this look correct? Any changes needed?"

**WAIT for user approval.**

#### 4.4 Validate Resume

**If MCP available:**
```
Call: mcp__resume-memory__validate_resume(resumeData)
```

**If MCP not available:**
```
Manually check:
- ✓ Freefly bullets 2-4 unchanged
- ✓ Lumenier bullets 1-2 unchanged
- ✓ York bullets 1-2 unchanged
- ✓ Job titles correct
- ✓ Bullet count pattern: 3-4-2-2
- ✓ Education unchanged
- ✓ Contact info correct
```

**If validation FAILS:**
```
❌ VALIDATION ERRORS:

1. Freefly bullet 2 modified (LOCKED)
2. York bullet count wrong (expected 2, got 3)

⛔ RESUME GENERATION BLOCKED

Fix these errors using baseline-resume-data.json, then re-validate.
```

**DO NOT proceed if validation fails.**

**If validation PASSES:**
```
✅ All checks passed! Resume is safe to generate.
```

#### 4.5 Generate PDF

**If MCP available:**
```
Call: mcp__resume-generator__generate_resume({
  resumeData: [validated JSON],
  folderPath: "[company-role]",
  filename: "resume"
})
```

**If MCP not available:**
```
Use standalone generator:
  node generate-resume-standalone.mjs
```

#### 4.6 Track Application

**If MCP available:**
```
Call: mcp__resume-memory__track_application({
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

**If MCP not available:**
```
Write: job-prep/applications/README.md (manual tracker update)
Add line to master tracker with status
```

---

## Step 5: Completion

### Process

#### 5.1 Inform User

```markdown
✅ APPLICATION COMPLETE!

Resume generated: [path]
Tracked in database: ✅ (if MCP) or Manual (if not)
Tokens used: [amount]
Cost: $[amount]

Next steps:
1. Review the PDF
2. Apply through company portal
3. Network on LinkedIn
```

#### 5.2 Save Session Notes (Optional)

```
Write: job-prep/applications/[company-role]/session-notes.md

Content:
- Date applied
- Fit score
- Strategy used (reuse/tailor/new)
- Key customizations made
- Next actions
```

---

## Agent-Specific Adaptations

Different agents implement this workflow differently. See:

- **Claude Code:** `.agent-config/agents/claude-resume-agent.md`
- **Gemini CLI:** `.agent-config/agents/gemini-resume-agent.md`
- **GPT-4:** `.agent-config/agents/openai-resume-agent.md`
- **Custom:** `.agent-config/agents/universal-resume-agent.md` (template)

---

## File Access Patterns

### Required Files (Must Read)

```
job-prep/applications/_resources/baseline-resume-data.json
  → Source of truth for resume content

job-prep/applications/_resources/FORMAT-STANDARDS.md
  → Formatting rules and locked content definitions
```

### Optional Files (MCP Alternative)

```
job-prep/applications/_resources/profile-summary.md
  → Compressed profile (if MCP unavailable)

resume-memory-mcp/data/knowledge-graph.json
  → Project/skill data (if MCP unavailable)
```

### Output Files (Must Write)

```
job-prep/applications/[company-role]/job-posting.md
  → Job details and fit analysis

job-prep/applications/[company-role]/resume-data.json
  → Customized resume JSON (draft)

job-prep/applications/[company-role]/resume.pdf
  → Final generated resume
```

---

## Error Handling

### Common Issues

**Issue:** MCP tools not available
- **Action:** Use standalone mode, read files directly

**Issue:** Validation fails
- **Action:** Show errors, reload baseline, re-validate

**Issue:** User rejects JSON draft
- **Action:** Ask what needs to change, apply edits, re-present

**Issue:** Similarity API down
- **Action:** Fall back to keyword-based similarity

**Issue:** PDF generation fails
- **Action:** Check standalone generator, verify LaTeX installation

---

## Success Metrics

- **Time:** 1 minute (reuse) to 5 minutes (new)
- **Cost:** $0.006 (reuse) to $0.09 (new)
- **Quality:** Passes validation 100%
- **Approval:** User reviews at 3 checkpoints
- **Tracking:** Logged for pattern learning

---

## Next Steps

1. **Choose your agent:** See `.agent-config/agents/`
2. **Follow agent-specific workflow:** Implements this universal workflow
3. **Test with example job:** Verify all steps work
4. **Review generated resume:** Ensure quality

---

**For agent-specific details, see:** `.agent-config/agents/[your-agent]-resume-agent.md`
**For configuration, see:** `.agent-config/config.json`
**For differences between agents, see:** `.agent-config/DIFFERENCES.md`
