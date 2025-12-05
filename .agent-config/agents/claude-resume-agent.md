# Claude Code Resume Agent

**Version:** 1.0.0
**Purpose:** Claude Code-specific implementation of universal resume workflow
**Agent Type:** Claude Code CLI
**Status:** ✅ Fully Supported

---

## Overview

This is the **Claude Code implementation** of the universal resume generation workflow. It leverages Claude Code-specific features like slash commands, Task tool, and MCP integration.

**For the universal workflow, see:** `.agent-config/UNIVERSAL_WORKFLOW.md`

---

## Claude Code-Specific Features

### 1. Slash Command Routing

Claude Code uses slash commands to load context and route workflows:

```
/profile         → Loads user profile context
/apply [job]     → Starts resume application workflow
/interview       → Interview preparation workflow
/network         → LinkedIn networking workflow
```

**Implementation:**
- Commands defined in: `.claude/commands/`
- Context loaded via: `SlashCommand()` tool
- Routing handled by: `.claude/commands/resume.md`

### 2. Task Tool for Agent Isolation

Claude Code can spawn isolated agent contexts:

```
Task tool with subagent_type="general-purpose"
  → Creates isolated context window
  → Loads agent definition from .claude/agents/
  → Returns results to main chat
```

**Benefits:**
- Separate token budget per agent
- Clean context (no chat history pollution)
- Parallel execution possible

### 3. Native MCP Integration

Claude Code automatically loads MCP servers from `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "resume-memory": {
      "command": "node",
      "args": ["/home/virus/Documents/repo/per_wesite/resume-memory-mcp/server.js"]
    },
    "resume-generator": {
      "command": "node",
      "args": ["/home/virus/Documents/repo/resumake-mcp/server.js"]
    }
  }
}
```

**Tools Available:**
- `mcp__resume-memory__get_profile_summary`
- `mcp__resume-memory__check_resume_similarity`
- `mcp__resume-memory__validate_resume`
- `mcp__resume-memory__track_application`
- `mcp__resume-generator__generate_resume`

---

## Workflow Implementation

### Step 0: Fit Analysis

**Claude Code Implementation:**

```markdown
User: "Help me apply to [Company] [Role]"

Claude:
1. Parse job details from user message
2. Call: mcp__resume-memory__get_profile_summary()
   → Returns 200-token compressed profile
3. Analyze fit (calculate score 0-100%)
4. Present assessment:

   ## Fit Assessment: 87%

   **Role:** Google - AI Engineer

   **Strengths:**
   - ✅ Strong Python + LangChain experience
   - ✅ Production RAG systems (Freefly)
   - ✅ Multi-agent AI (GridCOP)

   **Gaps:**
   - ⚠️ No GCP experience (MODERATE)

   **Recommendation:** Strong Fit (85-100%)

   **Proceed with application?**

5. Wait for user: "Yes, proceed"
```

**Code pattern:**
```javascript
// Internal Claude Code processing
const profile = await mcp__resume-memory__get_profile_summary();
const fitScore = calculateFit(jobPosting, profile);
presentAssessment(fitScore);
await waitForUserConfirmation();
```

### Step 1: Similarity Check

**Claude Code Implementation:**

```markdown
Claude:
1. Call: mcp__resume-memory__check_resume_similarity({
     company: "Google",
     role: "AI Engineer",
     requirements: "[full job text]"
   })

2. Receive response with top 3 matches

3. Display:

   ✅ FOUND 3 SIMILAR APPLICATIONS

   📊 TOP 3 MATCHES:

   🥇 Match #1 - 88% similar
      Company: Anthropic
      Role: AI Engineer
      Resume: job-prep/applications/anthropic-ai-engineer/resume.pdf

   🥈 Match #2 - 82% similar
      Company: OpenAI
      Role: Applied AI Engineer
      Resume: job-prep/applications/openai-applied-ai/resume.pdf

4. IF best_match ≥80%: Proceed to Step 2
   ELSE: Skip to Step 3
```

### Step 2: Generate Reasoning (≥80% Match)

**Claude Code Implementation:**

```markdown
Claude:
1. MCP returns reasoning prompt automatically

2. Execute reasoning analysis:
   {
     "overlapping_requirements": ["Python", "LangChain", "RAG", ...],
     "overlapping_count": 8,
     "total_requirements": 10,
     "aligned_projects": [
       {
         "name": "GridCOP",
         "fit_level": "STRONG",
         "reason": "Multi-agent AI system matches their requirements"
       }
     ],
     "gap_analysis": [
       {
         "requirement": "GCP experience",
         "severity": "MODERATE",
         "impact": "Can highlight AWS as transferable"
       }
     ],
     "confidence_score": 85,
     "recommendation_reasoning": "High overlap, minor gaps, strong project fit"
   }

3. Call: mcp__resume-memory__process_similarity_reasoning({
     reasoningResponse: "[JSON above]",
     matchedApplication: {...},
     similarityScore: 0.88
   })

4. Receive auto-recommendation and options
```

### Step 3: Present Options

**Claude Code Implementation:**

```markdown
Claude displays:

🎯 AUTO-RECOMMENDATION: Tailor Resume ⭐
Confidence: HIGH
Reasoning: 88% similarity with 2 moderate gaps. Tailoring will address GCP gap and emphasize multi-agent experience.

📋 YOUR OPTIONS:

[1] Use Existing Resume (0 min, $0.00)
    ✅ Instant - ready to apply now
    ❌ GCP gap not addressed
    ❌ No customization for Google specifically

[2] Tailor Resume ⭐ (2 min, $0.03)
    ✅ Addresses GCP gap
    ✅ Emphasizes multi-agent AI
    ✅ Reorders skills for Google stack
    ✅ Shows JSON draft for review

[3] Create New Resume (5 min, $0.09)
    ✅ Fully optimized for Google
    ❌ Higher cost and time

Your choice (1/2/3)? [Press Enter for recommended]

---

User types: 2
```

### Step 4: Execute Choice (Tailor Resume)

**Claude Code Implementation:**

```markdown
Claude:
1. Read: job-prep/applications/_resources/baseline-resume-data.json

2. Customize for Google:
   - Summary: Add "experience with cloud platforms (AWS → GCP transferable)"
   - Skills: Move "Multi-agent AI" and "LangChain" to top
   - Freefly bullet 1: Rewrite to emphasize scalability
   - Projects: Keep GridCOP, Drone Log Analyzer, AI Travel Planner

3. Generate JSON draft and show to user:

   Here's the customized resume JSON:

   ```json
   {
     "summary": "AI Engineer building production multi-agent systems...",
     "skills": [
       {
         "category": "AI & Machine Learning",
         "items": ["Multi-agent AI (LangChain)", "RAG Systems", ...]
       },
       {
         "category": "Cloud Platforms",
         "items": ["AWS (production)", "GCP (learning)", ...]
       }
     ],
     "work": [
       {
         "company": "Freefly Systems",
         "highlights": [
           "Built GenAI diagnostic tool serving 200+ users...",  ← CUSTOMIZED
           "Led release management...",                          ← LOCKED
           "Architected full-stack platform...",                ← LOCKED
           "Integrated LLMs into production..."                 ← LOCKED
         ]
       }
     ]
   }
   ```

   **Does this look correct? Any changes needed?**

4. Wait for user approval: "Looks good, generate it"

5. Call: mcp__resume-memory__validate_resume(resumeData)

   ✅ All checks passed! Resume is safe to generate.

6. Call: mcp__resume-generator__generate_resume({
     resumeData: {...},
     folderPath: "google-ai-engineer",
     filename: "resume"
   })

   ✅ Resume generated: job-prep/applications/google-ai-engineer/resume.pdf

7. Call: mcp__resume-memory__track_application({
     company: "Google",
     role: "AI Engineer",
     role_type: "ai_engineer",
     projects_selected: ["GridCOP", "Drone Log Analyzer", "AI Travel Planner"],
     tokens_used: 2500,
     cost_usd: 0.03
   })
```

### Step 5: Complete

**Claude Code Implementation:**

```markdown
Claude displays:

✅ APPLICATION COMPLETE!

Resume generated: job-prep/applications/google-ai-engineer/resume.pdf
Tracked in database: ✅
Tokens used: 2,500
Cost: $0.03

Next steps:
1. Review the PDF (open in viewer)
2. Apply through Google careers portal
3. Network with Google AI team on LinkedIn

Would you like help with networking messages?
```

---

## Tool Usage Patterns

### Read Files
```javascript
Read({
  file_path: "/home/virus/Documents/repo/per_wesite/job-prep/applications/_resources/baseline-resume-data.json"
})
```

### Write Files
```javascript
Write({
  file_path: "/home/virus/Documents/repo/per_wesite/job-prep/applications/google-ai-engineer/resume.pdf",
  content: pdfBuffer
})
```

### Call MCP Tools
```javascript
mcp__resume-memory__check_resume_similarity({
  company: "Google",
  role: "AI Engineer",
  requirements: "...",
  threshold: 0.80
})
```

### Spawn Isolated Agent
```javascript
Task({
  subagent_type: "general-purpose",
  prompt: "Review this resume JSON for errors...",
  description: "Resume validation check"
})
```

---

## Context Loading

### Auto-Loaded Context

Claude Code automatically loads `.claude/CLAUDE.md` at session start. This includes:
- Repository overview
- Workflow instructions
- File locations
- Important rules

### Slash Command Context

```
/profile → Loads: .claude/commands/profile.md
          → Injects: User's profile summary

/apply   → Loads: .claude/commands/apply.md
          → Starts: Resume workflow

/interview → Loads: .claude/commands/interview.md
            → Starts: Interview prep workflow
```

### Dynamic Context Loading

```javascript
// During workflow, dynamically load context
SlashCommand("/profile")
  → Loads profile context into current conversation
```

---

## Error Handling

### MCP Server Down

```markdown
Claude:
❌ resume-memory server not responding

Falling back to standalone mode:
- Using file-based similarity (keyword matching)
- Loading profile from profile-summary.md
- Validation checks in code
- Using standalone PDF generator

Continue? (yes/no)
```

### Validation Failed

```markdown
Claude:
❌ VALIDATION ERRORS:

1. Freefly bullet 2 modified (LOCKED)
   Expected: "Led release management for 4 major product versions..."
   Got: "Led release management and improved processes..."

2. Bullet count wrong for York
   Expected: 2 bullets
   Got: 3 bullets

⛔ RESUME GENERATION BLOCKED

I'll reload the baseline and fix these errors.

[Reloads baseline, fixes errors, re-validates]

✅ All checks passed! Resume is safe to generate.
```

---

## Performance Optimization

### Token Savings (Claude Code vs Manual)

| Approach | Tokens | Cost |
|----------|--------|------|
| **Manual (no MCP)** | 30,000 | $0.28 |
| **With MCP (new)** | 7,500 | $0.09 |
| **With MCP (reuse)** | 500 | $0.006 |

**Savings:** 70-94% reduction

### Speed Improvements

- **Similarity check:** 0 tokens (MCP handles it)
- **Profile loading:** 200 tokens (vs 8,000 full profile)
- **Validation:** Automated (vs manual checks)
- **PDF generation:** MCP server (vs inline processing)

---

## Best Practices

### 1. Always Use MCP Tools

```javascript
// ✅ Good - Uses MCP
const profile = await mcp__resume-memory__get_profile_summary();

// ❌ Bad - Manual file reading
const profile = await Read("profile.md");
```

### 2. Validate Before Generating

```javascript
// ✅ Good - Validate first
const valid = await mcp__resume-memory__validate_resume(data);
if (valid.passed) {
  await mcp__resume-generator__generate_resume(data);
}

// ❌ Bad - Generate without validation
await mcp__resume-generator__generate_resume(data);
```

### 3. Track All Applications

```javascript
// ✅ Good - Track for pattern learning
await mcp__resume-memory__track_application({...});

// ❌ Bad - Skip tracking (loses learning opportunity)
```

### 4. Use Slash Commands for Routing

```javascript
// ✅ Good - Clean routing
User: /apply Google AI Engineer
Claude: [Starts workflow automatically]

// ❌ Bad - Manual context loading
Claude: [Manually reads context files, more tokens]
```

---

## Configuration

### MCP Server Setup

**File:** `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "resume-memory": {
      "command": "node",
      "args": ["/home/virus/Documents/repo/per_wesite/resume-memory-mcp/server.js"]
    },
    "resume-generator": {
      "command": "node",
      "args": ["/home/virus/Documents/repo/resumake-mcp/server.js"]
    }
  }
}
```

### Verify MCP Connection

```bash
# Check if servers are running
ps aux | grep "resume-memory"
ps aux | grep "resume-generator"

# Test MCP tool
# In Claude Code:
mcp__resume-memory__get_profile_summary()
# Should return compressed profile
```

---

## Troubleshooting

### Issue: Slash commands not working

**Symptoms:** `/profile` shows error or does nothing

**Fix:**
1. Check `.claude/commands/profile.md` exists
2. Restart Claude Code session
3. Verify `.claude/CLAUDE.md` is present

### Issue: MCP tools not available

**Symptoms:** `mcp__resume-memory__*` tools not found

**Fix:**
1. Check `~/.claude/settings.json` has correct paths
2. Verify servers can start: `node resume-memory-mcp/server.js`
3. Restart Claude Code
4. Check logs in `~/.claude/mcp-logs/`

### Issue: Task tool fails

**Symptoms:** Subagent doesn't return results

**Fix:**
1. Check agent definition exists in `.claude/agents/`
2. Reduce prompt size if hitting token limits
3. Use main conversation instead of Task tool

---

## Examples

### Full Workflow Example

```markdown
User: Help me apply to Google AI Engineer role

Claude: I'll help you apply. Let me first analyze the fit...

[Step 0: Fit Analysis]
## Fit Assessment: 92%
...
Proceed? → User: yes

[Step 1: Similarity Check]
✅ Found 88% match with Anthropic AI Engineer
...

[Step 2: Reasoning]
Analyzing overlap... 8/10 requirements match
...

[Step 3: Options]
🎯 Recommend: Tailor Resume
...
Your choice? → User: 2

[Step 4: Execute]
Customizing resume...
Shows JSON draft...
Approve? → User: yes
Validating...
Generating PDF...

[Step 5: Complete]
✅ APPLICATION COMPLETE!
Resume: google-ai-engineer/resume.pdf
```

---

## Next Steps

1. **Ensure MCP servers configured** in `~/.claude/settings.json`
2. **Test workflow** with example job posting
3. **Review generated resume** for quality
4. **Track results** to improve pattern learning

---

**For universal workflow, see:** `.agent-config/UNIVERSAL_WORKFLOW.md`
**For other agents, see:** `.agent-config/agents/gemini-resume-agent.md`, etc.
**For configuration, see:** `.agent-config/config.json`
