# Phase 1 Implementation State
**Started:** 2025-01-06
**Phase:** Reasoning & Recommendation
**Status:** IN PROGRESS

---

## Objective

Implement similarity-based reasoning and auto-recommendation system for resume generation optimization.

**Target:** When similarity ≥ 80%, generate reasoning (overlap/gap analysis) and auto-recommend best option (use/tailor/create).

---

## Implementation Checklist

### Database Updates
- [x] Add `similarity_analyses` table to schema
- [x] Update `applications` table with new fields (resume_json, matched_application_id)
- [x] Add indexes for performance
- [x] Add helper functions (saveSimilarityAnalysis, getApplicationById)

### Core Functionality
- [x] Create `lib/reasoning-generator.js` - LLM-based overlap/gap analysis (500 tokens)
- [x] Create `lib/auto-recommender.js` - Decision tree logic (0 tokens)
- [ ] Update `lib/similarity-checker.js` - Integrate reasoning
- [ ] Update `server.js` - New response format with 3 options

### Data Population
- [ ] Import existing resumes from `job-prep/applications/` into database
- [ ] Update knowledge graph with all projects
- [ ] Index all existing applications in txtai

### Configuration
- [ ] Change similarity threshold: 0.85 → 0.80

### Testing
- [ ] Test with 3-5 real job postings
- [ ] Verify reasoning quality
- [ ] Validate recommendation accuracy

---

## Files Created/Modified

### New Files
- `lib/reasoning-generator.js` - NOT STARTED
- `lib/auto-recommender.js` - NOT STARTED

### Modified Files
- `lib/database.js` - NOT STARTED
- `lib/similarity-checker.js` - NOT STARTED
- `server.js` - NOT STARTED

---

## Session Recovery Instructions

If session is interrupted, resume with:

1. Read this file to see progress
2. Check `[x]` items to see what's completed
3. Continue from first `[ ]` unchecked item
4. Review modified files to understand changes

**Last checkpoint:** Session started, todos created

---

## Technical Details

### Reasoning Generator Architecture

```javascript
// lib/reasoning-generator.js
export async function generateReasoning(jobRequirements, matchedResume) {
  // Input: Job requirements + matched resume data
  // LLM Call: 500 tokens
  // Output: { overlap, gaps, confidence, recommendation }
}
```

### Auto-Recommender Decision Tree

```javascript
// lib/auto-recommender.js
export function autoRecommend(similarity, gaps, confidence) {
  if (similarity >= 0.95 && gaps.length === 0) return "USE_EXISTING";
  if (similarity >= 0.85 && gaps.length <= 5) return "TAILOR";
  return "CREATE_NEW";
}
```

### Updated Response Format

```json
{
  "similar": true,
  "similarity_score": 0.92,
  "matched_application": {
    "company": "Google",
    "role": "AI Engineer",
    "resume_json": {...},
    "resume_pdf_path": "..."
  },
  "reasoning": {
    "overlapping_requirements": ["Python", "LangChain", ...],
    "aligned_projects": [...],
    "gaps": [...],
    "confidence": 85
  },
  "recommendation": {
    "option": "TAILOR",
    "reasoning": "Strong match with minor gaps...",
    "options": [
      { "type": "USE_EXISTING", "cost": 0, "tokens": 0 },
      { "type": "TAILOR", "cost": 0.03, "tokens": 2500 },
      { "type": "CREATE_NEW", "cost": 0.09, "tokens": 7500 }
    ]
  }
}
```

---

## Database Schema Updates

### similarity_analyses Table

```sql
CREATE TABLE similarity_analyses (
  id TEXT PRIMARY KEY,
  new_application_id TEXT,
  matched_application_id TEXT,
  similarity_score REAL NOT NULL,

  -- Reasoning components
  overlapping_requirements TEXT,  -- JSON array
  aligned_projects TEXT,          -- JSON array
  gap_analysis TEXT,              -- JSON array
  confidence_score REAL,          -- 0-100

  -- Recommendation
  recommended_option TEXT,        -- USE_EXISTING, TAILOR, CREATE_NEW
  recommendation_reasoning TEXT,

  -- User interaction
  user_choice TEXT,               -- What user chose
  user_override BOOLEAN,          -- Did user override recommendation?

  created_at TEXT,

  FOREIGN KEY (new_application_id) REFERENCES applications(id),
  FOREIGN KEY (matched_application_id) REFERENCES applications(id)
);
```

---

## Next Steps

1. ✅ Create this session state document
2. ⏳ Update database schema
3. ⏳ Create reasoning-generator.js
4. ⏳ Create auto-recommender.js
5. ⏳ Update similarity-checker.js
6. ⏳ Update server.js
7. ⏳ Populate database
8. ⏳ Test implementation

---

**Current Status:** Session started, planning complete, ready to implement
**Next Action:** Update database schema in lib/database.js
