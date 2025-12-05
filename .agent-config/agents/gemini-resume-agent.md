# Gemini CLI Resume Agent

**Version:** 1.0.0
**Purpose:** Gemini CLI-specific implementation of universal resume workflow
**Agent Type:** Google Gemini CLI
**Status:** ✅ Fully Supported (File-Based Mode)

---

## Overview

This is the **Gemini CLI implementation** of the universal resume generation workflow. Since Gemini doesn't have native MCP support or slash commands, this uses **explicit file operations** and **direct prompting**.

**For the universal workflow, see:** `.agent-config/UNIVERSAL_WORKFLOW.md`

---

## Gemini-Specific Approach

### 1. Explicit Context Injection

Unlike Claude Code (auto-loads context), Gemini requires **explicit context loading**:

```markdown
System Prompt:
You are a Resume Generation Agent.

CONTEXT (loaded once at start):
[Contents of .gemini/GEMINI.md]

USER PROFILE:
[Contents of job-prep/applications/_resources/profile-summary.md]

WORKFLOW INSTRUCTIONS:
[Contents of .agent-config/UNIVERSAL_WORKFLOW.md]

Now follow the workflow for user's job application request.
```

### 2. File-Based Operations

All operations use direct file Read/Write (no MCP tools):

```javascript
// No MCP available, use file operations
const profile = readFile("job-prep/applications/_resources/profile-summary.md");
const baseline = readFile("job-prep/applications/_resources/baseline-resume-data.json");
const tracker = readFile("job-prep/applications/README.md");
```

### 3. Subprocess for PDF Generation

Since no MCP `generate_resume` tool:

```bash
# Use standalone generator
node generate-resume-standalone.mjs \
  --input job-prep/applications/google-ai-engineer/resume-data.json \
  --output job-prep/applications/google-ai-engineer/resume.pdf
```

### 4. Keyword-Based Similarity

No semantic similarity API, use keyword matching:

```javascript
function calculateSimilarity(jobA, jobB) {
  const keywordsA = extractKeywords(jobA.requirements);
  const keywordsB = extractKeywords(jobB.requirements);
  const overlap = intersection(keywordsA, keywordsB);
  return (overlap.length / Math.max(keywordsA.length, keywordsB.length)) * 100;
}
```

---

## Workflow Implementation

### Step 0: Fit Analysis

**Gemini Implementation:**

```markdown
User: "Help me apply to Google AI Engineer"

Gemini:
1. Parse job details from user message

2. Read profile summary:
   FILE: job-prep/applications/_resources/profile-summary.md

3. Analyze fit (calculate score)

4. Present assessment:

   ## Fit Assessment: 87%

   **Role:** Google - AI Engineer

   **Strengths:**
   - ✅ Strong Python + LangChain (matches requirement)
   - ✅ Production RAG systems (Freefly project)
   - ✅ Multi-agent AI (GridCOP project)

   **Gaps:**
   - ⚠️ No GCP experience (MODERATE - can highlight AWS as transferable)

   **Recommendation:** Strong Fit

   **Proceed with application?**

5. Wait for user: "yes"
```

**Code pattern:**
```javascript
// Gemini pseudocode
const profile = readFile("job-prep/applications/_resources/profile-summary.md");
const fitScore = calculateFit(jobPosting, profile);
presentAssessment(fitScore);
const proceed = await getUserInput("Proceed? (yes/no)");
if (proceed !== "yes") return;
```

### Step 1: Similarity Check

**Gemini Implementation:**

```markdown
Gemini:
1. Read application tracker:
   FILE: job-prep/applications/README.md

2. Parse past applications (extract company, role, requirements)

3. Calculate keyword similarity for each:

   Applications found:
   - Anthropic AI Engineer: 88% keyword overlap
   - OpenAI Applied AI: 82% keyword overlap
   - Meta Research Scientist: 65% keyword overlap

4. Display top 3:

   📊 TOP 3 SIMILAR APPLICATIONS:

   🥇 Match #1 - 88% similar
      Company: Anthropic
      Role: AI Engineer
      Resume: job-prep/applications/anthropic-ai-engineer/resume.pdf

   🥈 Match #2 - 82% similar
      Company: OpenAI
      Role: Applied AI Engineer
      Resume: job-prep/applications/openai-applied-ai/resume.pdf

   🥉 Match #3 - 65% similar
      Company: Meta
      Role: Research Scientist
      Resume: job-prep/applications/meta-research-scientist/resume.pdf

5. IF best_match ≥80%: Proceed to Step 2
   ELSE: Skip to Step 3 with "Create New" recommendation
```

**Code pattern:**
```javascript
// Gemini pseudocode
const tracker = readFile("job-prep/applications/README.md");
const pastApps = parseApplications(tracker);

const similarities = pastApps.map(app => ({
  ...app,
  score: calculateKeywordSimilarity(app.requirements, newJobRequirements)
})).sort((a, b) => b.score - a.score);

const top3 = similarities.slice(0, 3);
displayMatches(top3);

if (top3[0].score >= 0.80) {
  // Proceed to Step 2
} else {
  recommendOption = "create_new";
}
```

### Step 2: Generate Reasoning

**Gemini Implementation:**

```markdown
Gemini:
1. Read previous job posting:
   FILE: job-prep/applications/anthropic-ai-engineer/job-posting.md

2. Compare requirements:

   PREVIOUS JOB (Anthropic):
   - Python, LangChain, RAG, AI agents, AWS

   NEW JOB (Google):
   - Python, LangChain, RAG, Multi-agent AI, GCP

   OVERLAP: Python, LangChain, RAG, Multi-agent AI (4/5 = 80%)

   GAPS:
   - GCP vs AWS (MODERATE - transferable skill)

   ALIGNED PROJECTS:
   - GridCOP (Multi-agent AI) → STRONG fit
   - Drone Log Analyzer (RAG) → STRONG fit
   - AI Travel Planner (LangChain) → MODERATE fit

3. Calculate confidence: 85%

4. Recommendation: "tailor"
   - Overlap is high (80%)
   - Gaps are minor and fixable
   - Projects align well
```

**Code pattern:**
```javascript
// Gemini pseudocode
const prevJob = readFile(`job-prep/applications/${bestMatch.folder}/job-posting.md`);
const prevReqs = extractRequirements(prevJob);
const newReqs = extractRequirements(newJobPosting);

const overlap = calculateOverlap(prevReqs, newReqs);
const gaps = findGaps(prevReqs, newReqs);
const projects = analyzeProjectFit(newReqs);

const confidence = calculateConfidence(overlap, gaps, projects);

if (confidence >= 90 && gaps.length <= 2) {
  recommendation = "use_existing";
} else if (confidence >= 85 && gaps.length <= 3) {
  recommendation = "tailor";
} else {
  recommendation = "create_new";
}
```

### Step 3: Present Options

**Gemini Implementation:**

```markdown
Gemini displays:

🎯 RECOMMENDATION: Tailor Resume ⭐
Confidence: 85%
Reasoning: High overlap (80%) with Anthropic role, only 1 moderate gap (GCP). Tailoring will address this efficiently.

📋 YOUR OPTIONS:

[1] Use Existing Resume
    Time: 0 minutes
    Cost: $0.00 (no LLM calls)
    ✅ Instant
    ❌ GCP gap not addressed

    Best for: 95%+ match

[2] Tailor Resume ⭐ (Recommended)
    Time: 2-3 minutes
    Cost: ~$0.03 (one customization pass)
    ✅ Address GCP gap
    ✅ Reorder skills
    ✅ Adjust summary

    Best for: 85-95% match with fixable gaps

[3] Create New Resume
    Time: 5-7 minutes
    Cost: ~$0.09 (full generation)
    ✅ Fully optimized
    ❌ More time and cost

    Best for: <85% match or major differences

**Enter your choice (1, 2, or 3):**
```

**User types:** `2`

### Step 4: Execute Choice (Tailor Resume)

**Gemini Implementation:**

```markdown
Gemini:
1. Read baseline resume:
   FILE: job-prep/applications/_resources/baseline-resume-data.json

2. Customize for Google:

   CHANGES:
   - Summary: Add "AWS→GCP transferable cloud experience"
   - Skills: Reorder to prioritize "Multi-agent AI" and "LangChain"
   - Freefly bullet 1: Emphasize scale ("200+ daily users")
   - Projects: Keep GridCOP (multi-agent), Drone Log (RAG), AI Travel Planner

3. Generate JSON and save draft:
   FILE: job-prep/applications/google-ai-engineer/resume-data.json

4. Show JSON to user:

   **CUSTOMIZED RESUME JSON:**

   ```json
   {
     "summary": "AI Engineer with production multi-agent systems...",
     "skills": [
       {
         "category": "AI & Machine Learning",
         "items": ["Multi-agent AI", "LangChain", "RAG", ...]
       }
     ],
     "work": [
       {
         "company": "Freefly Systems",
         "highlights": [
           "Built GenAI diagnostic tool serving 200+ daily users (CUSTOMIZED)",
           "Led release management for 4 major versions (LOCKED)",
           "Architected full-stack platform... (LOCKED)",
           "Integrated LLMs into production... (LOCKED)"
         ]
       }
     ]
   }
   ```

   **Review this JSON. Type 'approve' to generate PDF, or describe changes:**

5. Wait for user: "approve"

6. Validate resume (manual checks):
   ✓ Freefly bullets 2-4 unchanged
   ✓ Lumenier bullets 1-2 unchanged
   ✓ York bullets 1-2 unchanged
   ✓ Job titles correct
   ✓ Bullet pattern: 3-4-2-2
   ✓ Education unchanged

   ✅ All checks passed!

7. Generate PDF:
   COMMAND: node generate-resume-standalone.mjs
   INPUT: google-ai-engineer/resume-data.json
   OUTPUT: google-ai-engineer/resume.pdf

   ✅ Resume generated successfully!

8. Update tracker manually:
   FILE: job-prep/applications/README.md
   APPEND: | Google | AI Engineer | Applied | 2025-12-03 | 87% | ...
```

**Code pattern:**
```javascript
// Gemini pseudocode
const baseline = readFile("baseline-resume-data.json");
const customized = customizeResume(baseline, jobPosting, "tailor");

writeFile("google-ai-engineer/resume-data.json", JSON.stringify(customized));
displayJSON(customized);

const approved = await getUserInput("Type 'approve' to generate PDF:");
if (approved !== "approve") return;

const valid = validateResume(customized);
if (!valid.passed) {
  showErrors(valid.errors);
  return;
}

execCommand("node generate-resume-standalone.mjs ...");
updateTracker("README.md", newEntry);
```

### Step 5: Complete

**Gemini Implementation:**

```markdown
Gemini displays:

✅ APPLICATION COMPLETE!

Files created:
- job-prep/applications/google-ai-engineer/job-posting.md
- job-prep/applications/google-ai-engineer/resume-data.json
- job-prep/applications/google-ai-engineer/resume.pdf

Tracker updated:
- job-prep/applications/README.md (added Google AI Engineer)

Estimated cost: $0.03
Time spent: 3 minutes

Next steps:
1. Open and review: google-ai-engineer/resume.pdf
2. Apply through Google careers portal
3. Network with Google AI team on LinkedIn

Would you like help drafting a networking message?
```

---

## File Operations Reference

### Files to Read

**Always:**
```
job-prep/applications/_resources/baseline-resume-data.json
  → Resume template

job-prep/applications/_resources/profile-summary.md
  → Compressed user profile

job-prep/applications/_resources/FORMAT-STANDARDS.md
  → Locked content rules
```

**For Similarity:**
```
job-prep/applications/README.md
  → Master tracker (parse for past applications)

job-prep/applications/[company-role]/job-posting.md
  → Previous job requirements (for each match)
```

### Files to Write

**Required:**
```
job-prep/applications/[company-role]/job-posting.md
job-prep/applications/[company-role]/resume-data.json
job-prep/applications/[company-role]/resume.pdf
```

**Update:**
```
job-prep/applications/README.md
  → Add new application entry
```

---

## Subprocess Commands

### Generate PDF

```bash
node generate-resume-standalone.mjs \
  --input job-prep/applications/google-ai-engineer/resume-data.json \
  --output job-prep/applications/google-ai-engineer/resume.pdf
```

### Verify PDF Created

```bash
ls -lh job-prep/applications/google-ai-engineer/resume.pdf
```

---

## Keyword-Based Similarity Algorithm

Since no semantic API:

```javascript
function extractKeywords(text) {
  // Remove stopwords
  const stopwords = ["the", "a", "an", "and", "or", "but", ...];
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !stopwords.includes(w));

  // Extract technical terms (capitalized, acronyms)
  const technical = text.match(/[A-Z]{2,}|[A-Z][a-z]+/g) || [];

  return [...new Set([...words, ...technical.map(t => t.toLowerCase())])];
}

function calculateSimilarity(reqsA, reqsB) {
  const keywordsA = extractKeywords(reqsA);
  const keywordsB = extractKeywords(reqsB);

  const intersection = keywordsA.filter(k => keywordsB.includes(k));
  const union = [...new Set([...keywordsA, ...keywordsB])];

  return (intersection.length / union.length) * 100;
}
```

---

## Validation (Manual Implementation)

```javascript
function validateResume(resumeData) {
  const errors = [];

  // Check Freefly bullets 2-4 unchanged
  const freefly = resumeData.work.find(w => w.company === "Freefly Systems");
  const expectedBullet2 = "Led release management for 4 major product versions...";
  if (freefly.highlights[1] !== expectedBullet2) {
    errors.push("Freefly bullet 2 modified (LOCKED)");
  }

  // Check bullet counts
  const grid = resumeData.work.find(w => w.company === "Grid CoOperator");
  if (grid.highlights.length !== 3) {
    errors.push(`Grid bullet count wrong (expected 3, got ${grid.highlights.length})`);
  }

  // ... more checks

  return {
    passed: errors.length === 0,
    errors: errors
  };
}
```

---

## Performance Comparison

| Feature | Gemini CLI | Claude Code (MCP) |
|---------|-----------|-------------------|
| **Similarity Check** | Keyword-based | Semantic (txtai) |
| **Profile Loading** | Full file read | Compressed (200 tokens) |
| **Validation** | Manual checks | MCP tool |
| **PDF Generation** | Subprocess | MCP tool |
| **Tracking** | Manual file update | MCP tool (auto) |
| **Total Tokens** | ~10,000 | ~7,500 |
| **Total Cost** | ~$0.12 | ~$0.09 |

**Gemini is ~30% more expensive** but still much better than manual (~$0.28).

---

## Setup Instructions

### 1. Create Gemini Configuration

```bash
mkdir -p .gemini
```

**File:** `.gemini/GEMINI.md`

```markdown
# Gemini Resume Agent Configuration

You are a Resume Generation Agent for Gemini CLI.

IMPORTANT: Load these files at session start:
- .agent-config/UNIVERSAL_WORKFLOW.md (workflow steps)
- job-prep/applications/_resources/profile-summary.md (user profile)
- job-prep/applications/_resources/FORMAT-STANDARDS.md (rules)

Follow the universal workflow exactly.
Use file operations (no MCP available).
Generate PDF using: node generate-resume-standalone.mjs

Context is loaded, you're ready to help with job applications.
```

### 2. Create Profile Summary

If not exists, create:

**File:** `job-prep/applications/_resources/profile-summary.md`

```markdown
# User Profile Summary

[Your 200-token compressed profile here]
```

### 3. Verify Standalone Generator

```bash
# Test standalone generator
node generate-resume-standalone.mjs --help
```

---

## Best Practices

### 1. Load Context Once

```javascript
// ✅ Good - Load at session start
const context = {
  workflow: readFile(".agent-config/UNIVERSAL_WORKFLOW.md"),
  profile: readFile("job-prep/applications/_resources/profile-summary.md"),
  standards: readFile("job-prep/applications/_resources/FORMAT-STANDARDS.md")
};

// ❌ Bad - Reload every time (wastes tokens)
```

### 2. Show File Paths Explicitly

```javascript
// ✅ Good - User knows what was read
Reading: job-prep/applications/_resources/baseline-resume-data.json
✓ Loaded baseline resume

// ❌ Bad - Silent file operations
[Just loads file without telling user]
```

### 3. Always Validate

```javascript
// ✅ Good - Check before generating
const valid = validateResume(data);
if (valid.passed) {
  generatePDF(data);
} else {
  showErrors(valid.errors);
}

// ❌ Bad - Skip validation
generatePDF(data); // Might have locked content modified
```

---

## Troubleshooting

### Issue: Standalone generator not found

**Fix:**
```bash
# Verify file exists
ls -l generate-resume-standalone.mjs

# If missing, check resumake-mcp/
ls -l resumake-mcp/lib/
```

### Issue: Keyword similarity too low

**Tune extraction:**
```javascript
// Add domain-specific keywords
const techTerms = ["AI", "ML", "LLM", "RAG", "LangChain", ...];
```

### Issue: Validation too strict

**Adjust rules:**
```javascript
// Allow minor variations
if (similarity(actual, expected) > 0.95) {
  // Consider it unchanged
}
```

---

## Next Steps

1. **Create `.gemini/GEMINI.md`** configuration file
2. **Test workflow** with example job posting
3. **Review keyword similarity** performance
4. **Adjust validation rules** as needed

---

**For universal workflow, see:** `.agent-config/UNIVERSAL_WORKFLOW.md`
**For Claude Code version, see:** `.agent-config/agents/claude-resume-agent.md`
**For configuration, see:** `.agent-config/config.json`
