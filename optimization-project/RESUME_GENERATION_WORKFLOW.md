# Resume Generation Workflow - MANDATORY PROCESS

**Version:** 2.0
**Date:** 2025-11-10
**Status:** ACTIVE - MUST FOLLOW

---

## Critical Rules

### 🚨 NEVER DO THESE:

1. ❌ Generate resume without showing JSON draft first
2. ❌ Skip validation before PDF generation
3. ❌ Modify locked content (Freefly bullets 2-4, Lumenier, York)
4. ❌ Proceed without user approval at each step
5. ❌ Start from scratch - ALWAYS start from baseline-resume-data.json
6. ❌ Bypass the similarity check
7. ❌ Skip reasoning and recommendations when match found

### ✅ ALWAYS DO THESE:

1. ✅ Check similarity first (top 3 matches with reasoning)
2. ✅ Present 3 options with costs and trade-offs
3. ✅ Load baseline-resume-data.json as starting point
4. ✅ Show JSON draft for user review
5. ✅ Call validate_resume before PDF generation
6. ✅ Wait for user approval at each checkpoint

---

## Complete Workflow

### Step 1: Similarity Check (0 tokens, 50ms)

```
User provides job posting

↓

check_resume_similarity(company, role, requirements)

↓

Result: Similar match found (≥80%) OR No match (<80%)
```

**If NO match found:**
→ Skip to Step 5 (Create New Resume)

**If SIMILAR match found (≥80%):**
→ Continue to Step 2

---

### Step 2: Generate Reasoning (500 tokens, ~$0.006)

```
System returns reasoning prompt

↓

Execute LLM analysis (Claude analyzes automatically)

↓

LLM Response: JSON with overlaps/gaps/confidence
```

**Reasoning Output:**
- Overlapping requirements (what matches)
- Aligned projects (which projects fit)
- Gap analysis (what's missing)
- Confidence score (0-100%)

**Action:** Proceed to Step 3

---

### Step 3: Process Reasoning & Auto-Recommend (0 tokens)

```
process_similarity_reasoning(reasoningResponse, matchedApplication, similarityScore)

↓

System parses reasoning + runs decision tree

↓

Presents 3 options with auto-recommendation
```

**3 Options Presented:**

| Option | Time | Cost | When to Use |
|--------|------|------|-------------|
| 1. Use Existing | 0 min | $0.00 | 95%+ match, 0-3 minor gaps |
| 2. Tailor Resume ⭐ | 2 min | $0.03 | 85-95% match, fixable gaps |
| 3. Create New | 5 min | $0.09 | <85% match, major gaps |

**Action:** User selects option (1, 2, or 3)

---

### Step 4: Execute User Choice

#### Option 1: Use Existing Resume

```
1. Copy PDF from matched application path
2. Track application with resume_reused=true
3. Done! (Total cost: $0.006 for reasoning)
```

**No resume generation needed!**

---

#### Option 2: Tailor Resume

```
1. Load baseline-resume-data.json
2. Identify sections to update based on gap analysis:
   - Summary (add missing keywords)
   - Skills (reorder for role)
   - Freefly bullet 1 (ONLY customizable bullet)
   - Projects (adjust highlights if needed)
3. Show JSON draft with changes highlighted
4. User reviews and approves
5. Validate against baseline
6. Generate PDF only after validation passes
```

**Sections that CAN be modified:**
- ✅ Summary
- ✅ Skills order/groupings
- ✅ Freefly bullet 1 (first bullet only)
- ✅ Projects (can reorder, adjust bullets)

**Sections that are LOCKED:**
- 🔒 Freefly bullets 2-4 (match LinkedIn exactly)
- 🔒 Lumenier bullets 1-2 (both locked)
- 🔒 York bullets 1-2 (both locked)
- 🔒 Job titles (Grid CoOperator, Freefly, Lumenier, York)
- 🔒 Education (GITAM University, WSU)
- 🔒 Contact info (email, phone, website)

**Validation Checklist:**
```
✓ Locked bullets unchanged
✓ Job titles correct
✓ Bullet count pattern: 3-4-2-2 (Grid: 3, Freefly: 4, Lumenier: 2, York: 2)
✓ Education unchanged
✓ Contact info correct
```

---

#### Option 3: Create New Resume

```
1. Load baseline-resume-data.json
2. Fully customize for role:
   - Summary (role-specific positioning)
   - Skills (reorder for job priorities)
   - Freefly bullet 1 (emphasize relevant work)
   - Projects (select 3 most relevant)
3. Show JSON draft for review
4. User reviews and approves
5. Validate against baseline
6. Generate PDF only after validation passes
```

**Same validation rules apply!**

---

### Step 5: JSON Draft Review (MANDATORY)

```
Present JSON to user:

{
  "basics": {...},
  "summary": "...",  // Show what changed
  "work": [...],     // Highlight customizations
  "skills": [...],   // Show reordering
  "projects": [...]  // Show selection
}

↓

User reviews:
- Approve → Continue to Step 6
- Request changes → Modify and re-present
- Reject → Return to Step 3
```

**Display format:**
- Show full JSON
- Highlight sections that were customized
- Indicate locked sections (grayed out or marked 🔒)
- Ask explicitly: "Does this look correct? Any changes needed?"

---

### Step 6: Validation (MANDATORY)

```
validate_resume(resumeData)

↓

Validation checks:
✓ Locked bullets unchanged
✓ Job titles correct
✓ Bullet count pattern (3-4-2-2)
✓ Education unchanged
✓ Contact info correct

↓

Result: PASS or FAIL
```

**If VALIDATION FAILS:**
```
❌ Errors found:
1. Freefly bullet 2 modified (LOCKED)
2. York bullet count wrong (expected 2, got 3)
...

⛔ RESUME GENERATION BLOCKED

Action: Fix errors using baseline-resume-data.json, then re-validate
```

**DO NOT proceed to PDF generation if validation fails!**

**If VALIDATION PASSES:**
```
✅ All checks passed! Resume is safe to generate.

→ Proceed to Step 7
```

---

### Step 7: PDF Generation

```
mcp__resume-generator__generate_resume(resumeData, folderPath, filename)

↓

PDF generated and saved

↓

Show user the path and file size
```

---

### Step 8: Track Application

```
track_application({
  company,
  role,
  role_type,
  projects_selected,
  resume_path,
  resume_reused: false/true,
  reused_from: null/application_id,
  tokens_used,
  cost_usd,
  similarity_score
})

↓

Application logged in database

↓

Done! User can apply to job
```

---

## Error Handling

### Error: Similarity API not running

```
❌ Similarity API not responding

Action: Skip similarity check, proceed directly to Create New Resume (Step 5)
Cost: $0.09 (no savings from similarity)
```

### Error: Validation failed

```
❌ Validation errors found (see list above)

Action:
1. Load baseline-resume-data.json
2. Reapply ONLY allowed customizations
3. Re-validate
4. DO NOT generate PDF until validation passes
```

### Error: User rejects JSON draft

```
❌ User found issues in JSON draft

Action:
1. Ask user what needs to change
2. Apply changes
3. Re-present JSON draft
4. Repeat until user approves
```

---

## Time & Cost Estimates

| Scenario | Time | Tokens | Cost | Savings vs Old |
|----------|------|--------|------|----------------|
| **Use Existing (95%+ match)** | 30 sec | 500 | $0.006 | 93% |
| **Tailor (85-95% match)** | 2 min | 3,000 | $0.036 | 60% |
| **Create New (<85% match)** | 5 min | 7,500 | $0.090 | 0% (baseline) |
| **No similarity check** | 5 min | 7,500 | $0.090 | N/A |

---

## Checkpoints Summary

| Checkpoint | User Approval Required? | Can Skip? |
|------------|-------------------------|-----------|
| 1. Similarity check result | No (informational) | No |
| 2. Reasoning analysis | No (automated) | No |
| 3. Choose option (1/2/3) | **YES** ✋ | No |
| 4. JSON draft review | **YES** ✋ | No |
| 5. Validation result | No (automated) | No |
| 6. PDF generation | Proceed if validated | No |
| 7. Track application | No (automated) | No |

**2 explicit approval points:**
1. **User chooses option** (Use/Tailor/Create)
2. **User approves JSON draft** (before PDF generation)

---

## Example: Applying to Finance Smart Assistant Role

```
Step 1: check_resume_similarity
  → No match found (<80%)

Step 5: Create New Resume
  → Load baseline-resume-data.json
  → Customize summary: "Data Scientist specializing in GenAI..."
  → Customize Freefly bullet 1: "Built GenAI-powered tool..."
  → Select projects: GridCOP, Drone Log, Flight Control
  → Reorder skills: GenAI first, then ML, then Cloud

Step 5a: Present JSON draft
  → Show user the customized JSON
  → User: "Looks good!"

Step 6: Validate
  → ✅ All checks passed

Step 7: Generate PDF
  → mcp__resume-generator__generate_resume(...)
  → PDF saved to: finance-smart-assistant-senior-ds/resume.pdf

Step 8: Track application
  → Logged in database with role_type="ai_engineer"

Done!
Cost: $0.09
Time: 5 minutes
```

---

## Key Takeaways

1. **Similarity check is FIRST** - Never skip, it's free and fast
2. **When match found (≥80%)** - Generate reasoning and present 3 options
3. **Baseline is SOURCE OF TRUTH** - Always start from baseline-resume-data.json
4. **2 approval points** - User chooses option + user approves JSON
5. **Validation is MANDATORY** - Block PDF if validation fails
6. **Locked content is SACRED** - LinkedIn-verified bullets must never change

---

## What Changed from Old System

| Old System | New System |
|------------|------------|
| No similarity check | ✅ Similarity check first (0 tokens) |
| No reasoning/options | ✅ Reasoning + 3 options with costs |
| Generated from scratch | ✅ Start from baseline always |
| No JSON review | ✅ Mandatory JSON draft review |
| No validation | ✅ Mandatory validation before PDF |
| 1 approval point | ✅ 2 approval points |
| No reuse detection | ✅ Smart reuse with reasoning |

---

**END OF WORKFLOW**

**Remember:** This workflow is MANDATORY. Do not deviate. Do not skip steps. Do not bypass validation. Do not modify locked content.

The user's LinkedIn profile depends on consistency of locked bullets. Breaking this rule breaks their professional brand.
