# Resume Generation Safeguards - Implementation Summary

**Created:** 2025-11-03
**Problem:** Claude was modifying LOCKED sections (Lumenier, York, Freefly bullets 2-4) when generating resumes
**Solution:** Multi-layered safeguards to prevent future violations

---

## What Went Wrong

### iFIT Application - Rule Violations:
1. **Lumenier:** Used generic bullets instead of LOCKED specific bullets
   - Lost technical depth (LiDAR, optical flow, GPS, toss-to-launch)
   - Changed "open-source flight control software maintainers" to vague descriptions

2. **Freefly:** Customized ALL 4 bullets instead of only bullet 1
   - Modified LOCKED bullets 2-4 (flight control, release management, automation)
   - Lost authentic progression that matches LinkedIn
   - Should only customize bullet 1 (AI tool emphasis)

3. **York:** Would have been modified too (not in this case, but risk exists)

---

## Safeguards Implemented

### 1. Validation Rules Document ✅
**File:** `_resources/VALIDATION_RULES.md`

**Purpose:** Mandatory checklist that Claude MUST follow before generating any resume

**Contains:**
- Pre-flight checklist (bullet counts, locked content, dates)
- Copy-paste templates for LOCKED sections
- Validation protocol (3-step process)
- Error message format
- Common mistakes to avoid

**How it works:**
- Claude reads this before generating resume
- Checklist must be shown to user with ✅/❌
- If validation fails, stop and report errors

---

### 2. Template Inline Guards ✅
**Files Updated:**
- `_template-ai-engineer/resume-data.json`

**What was added:**
```json
{
  "company": "Lumenier",
  "_LOCKED": "THESE 2 BULLETS ARE LOCKED - NEVER MODIFY",
  "_rule": "Shows embedded/robotics credibility, matches LinkedIn exactly",
  "highlights": [...]
}

{
  "company": "Freefly Systems",
  "_CRITICAL": "ONLY BULLET 1 IS CUSTOMIZABLE - BULLETS 2-4 ARE LOCKED",
  "_rule": "Bullet 1 varies by role, bullets 2-4 match LinkedIn",
  "highlights": [
    "[CUSTOMIZABLE FOR AI ENGINEER] ...",
    "[LOCKED] ...",
    "[LOCKED] ...",
    "[LOCKED] ..."
  ]
}
```

**How it works:**
- Visual guards in JSON that Claude can't miss
- Explicit `[LOCKED]` prefixes on bullets that shouldn't change
- Comments explaining WHY sections are locked

---

### 3. Human-in-the-Loop Review Process ✅
**New Workflow:**

**Step 1: Fit Assessment**
- Claude analyzes job posting
- Presents fit assessment to user
- Waits for approval

**Step 2: Markdown Draft** (NEW - THIS IS KEY)
- Claude creates resume in **MARKDOWN format**
- Shows validation checklist with ✅
- User reviews and approves/requests changes
- Iterate until approved

**Step 3: PDF Generation** (Only after approval)
- Convert markdown to JSON
- Run validation checks again
- Generate PDF
- Extract text and verify

**Why this works:**
- User sees exact bullets before PDF generation
- Can catch mistakes early
- Markdown is human-readable
- Multiple checkpoints

---

### 4. Corrected Templates ✅

**Fixed:**
- `_template-ai-engineer/resume-data.json`
  - Lumenier: Now has correct LOCKED bullets
  - York: Now has correct LOCKED bullets
  - Freefly: Now has correct bullet 1 + 3 LOCKED bullets

**Still needs fixing:**
- `_resources/baseline-resume-data.json` (recommend updating)

---

## Implementation Status

| Safeguard | Status | File | Notes |
|-----------|--------|------|-------|
| Validation Rules | ✅ Created | VALIDATION_RULES.md | Mandatory checklist |
| Inline Guards | ✅ Added | _template-ai-engineer/resume-data.json | Visual warnings in JSON |
| Human Review Process | ✅ Defined | (Workflow change) | Markdown draft before PDF |
| AI Engineer Template | ✅ Fixed | _template-ai-engineer/resume-data.json | Correct LOCKED bullets |
| Baseline Template | ⚠️ Needs fix | baseline-resume-data.json | Still has wrong bullets |

---

## How to Use Safeguards

### For Claude:
1. **Before any resume generation:**
   - Read `VALIDATION_RULES.md`
   - Check template has inline guards
   - Follow 3-step workflow

2. **During customization:**
   - Copy LOCKED bullets verbatim
   - Only customize allowed sections
   - Show checklist to user

3. **Before PDF generation:**
   - Verify markdown draft passes all checks
   - Wait for user approval
   - Run final validation

### For User (You):
1. **Review markdown draft** - This is your checkpoint
2. **Check locked sections** - Verify Lumenier/York/Freefly bullets 2-4
3. **Approve or request changes**
4. **Only then** Claude generates PDF

---

## Testing the Safeguards

### Next Application Test:
When you apply to next AI Engineer role:

**Expected behavior:**
1. Claude reads VALIDATION_RULES.md
2. Uses `_template-ai-engineer/` (has inline guards)
3. Shows you markdown draft with checklist
4. You verify Lumenier/Freefly/York are correct
5. You approve
6. Claude generates PDF
7. Claude extracts PDF text and verifies again

**If Claude violates rules:**
- Validation should catch it
- Claude should stop and report error
- You manually review before PDF

---

## Additional Recommendations

### Optional (Not Yet Implemented):

**1. Validation Script**
- JavaScript script that checks JSON before generation
- Automated bullet count verification
- String matching for LOCKED content

**2. Post-PDF Extraction Checker**
- Automatically extract PDF text
- Compare against LOCKED templates
- Report any discrepancies

**3. Update Baseline Template**
- Fix `baseline-resume-data.json` with correct bullets
- Add inline guards there too

**4. Git Pre-commit Hook**
- Validate resume JSON before committing
- Prevent bad templates from being saved

Do you want any of these implemented?

---

## Key Takeaways

### Why Rules Exist:
1. **Lumenier/York:** Show authentic robotics background, match LinkedIn
2. **Freefly bullets 2-4:** Show progression, match LinkedIn timeline
3. **Dates:** Must be accurate (GridCOP is 03/2025, not 07/2025)
4. **Technical depth:** Specific details (LiDAR, optical flow, PX4) matter

### What Can Be Customized:
1. **Summary:** Change for every role
2. **Skills order:** Reorder categories to match job
3. **GridCOP:** All 3 bullets customizable
4. **Freefly bullet 1:** Emphasis changes (AI vs full-stack)
5. **Projects:** Select 2-3 most relevant

### What NEVER Changes:
1. **Lumenier:** 2 LOCKED bullets
2. **York:** 2 LOCKED bullets
3. **Freefly bullets 2-4:** LOCKED (only bullet 1 customizable)
4. **Education:** LOCKED
5. **Dates:** LOCKED (from timeline.json)

---

**This multi-layered approach should prevent future violations.**

If Claude still violates rules after this:
1. Check if it read VALIDATION_RULES.md
2. Check if it showed you markdown draft
3. Check if validation checklist was presented
4. Report as a process failure

---

**Last Updated:** 2025-11-03
**Next Review:** After next resume generation (test safeguards)
