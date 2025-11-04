# Resources Folder - Resume Application System

## Critical Files

### baseline-resume-data.json ⭐ PRIMARY SOURCE
**This is the source of truth for all resume generation.**

Contains your actual work history with LOCKED bullets that:
- Match your LinkedIn profile exactly
- Show your career progression
- Must NEVER be modified

**Workflow:**
1. Start new application by copying `_template/` folder
2. **IMMEDIATELY open `baseline-resume-data.json`**
3. Copy work experience bullets from baseline to your new resume-data.json
4. Then customize only what's allowed (summary, Grid bullets, Freefly bullet 1, skills order)

### RESUME_VALIDATION_CHECKLIST.md
Reference this before generating every PDF to verify:
- Correct bullet count (3-4-2-2)
- LOCKED bullets unchanged
- No keyword stuffing in summary
- Correct job titles

## Work Experience Rules

### What You CAN Customize:
✅ **Grid CoOperator:** All 3 bullets (AI-focused, varies by role)
✅ **Freefly bullet 1:** Varies by role (AI Engineer vs Product Engineer, etc.)
✅ **Summary:** Rewrite for each role
✅ **Skills:** Reorder to match job requirements
✅ **Projects:** Choose best 3 for role, reorder as needed

### What You CANNOT Change:
❌ **Freefly bullets 2-4:** LOCKED (drone platforms, release management, automated systems)
❌ **Lumenier bullets 1-2:** LOCKED (C++/LiDAR/optical flow, open-source flight control)
❌ **York bullets 1-2:** LOCKED (ROS2/SLAM autonomous robots, Python/Kivy HMI)
❌ **Job titles:** Must match exactly (especially Lumenier = "Drone Software Developer")
❌ **Education:** Never changes

## Why These Rules Exist

**LinkedIn Consistency:**
If your resume says different things than your LinkedIn, it looks suspicious. The LOCKED bullets match LinkedIn exactly.

**Career Progression:**
The Freefly bullets 2-4 show how you progressed from building tools → managing projects → leading releases. Don't break this narrative.

**Credibility:**
Specific technical details (LiDAR, optical flow, ROS2, SLAM) are verifiable and impressive. Keep them.

## Common Mistakes

1. ❌ **Using template bullets instead of baseline bullets**
   - Template has generic placeholders like "Implemented custom software using C++ and data structures"
   - Baseline has specific details like "Wrote embedded code in C++ to integrate LiDAR and optical flow sensors"

2. ❌ **Changing LOCKED bullets**
   - Even minor wording changes break LinkedIn consistency

3. ❌ **Wrong bullet count**
   - Must be 3-4-2-2, not 3-3-3-2 or anything else

4. ❌ **Keyword stuffing in summary**
   - Don't write: "expertise in similarity search (FAISS, Pinecone)"
   - Write: "expertise in similarity search"
   - Technologies go in skills section, not summary parentheses

## Correct Workflow

```
1. User asks to apply to job
2. Copy _template/ to new folder
3. OPEN baseline-resume-data.json (this step was missed!)
4. Copy work experience from baseline to new resume-data.json
5. Customize allowed sections (summary, Grid bullets, Freefly bullet 1, skills)
6. Reference RESUME_VALIDATION_CHECKLIST.md
7. Generate PDF
```

## If You Violated LOCKED Content

**Stop and revert immediately.**

The system only works if LOCKED content stays locked. If you changed:
- Freefly bullets 2-4
- Any Lumenier bullets
- Any York bullets
- Job titles

Revert to baseline version before generating PDF.
