# Agent-Specific Differences

**Version:** 1.0.0
**Purpose:** Document key differences between agent implementations

---

## Overview

All agents follow the same **universal workflow** (`.agent-config/UNIVERSAL_WORKFLOW.md`), but implement it differently based on their capabilities.

---

## Feature Comparison

| Feature | Claude Code | Gemini CLI | GPT-4 | Universal Template |
|---------|------------|-----------|-------|-------------------|
| **MCP Support** | ✅ Native | ❌ No | ⚠️ Via function calling | Depends |
| **Context Loading** | ✅ Auto (`.claude/CLAUDE.md`) | 🔄 Explicit injection | 🔄 System prompt | Manual |
| **Slash Commands** | ✅ Yes | ❌ No | ❌ No | No |
| **Task/Subagent** | ✅ Yes (Task tool) | ❌ No | ❌ No | No |
| **File Access** | ✅ Read/Write/Glob | ✅ Read/Write/Glob | ✅ Read/Write | Required |
| **Similarity Check** | ✅ Semantic (txtai) | 🔄 Keyword-based | 🔄 Keyword or API | Optional |
| **PDF Generation** | ✅ MCP tool | 🔄 Subprocess | 🔄 Subprocess/API | Required |
| **Validation** | ✅ MCP tool | 🔄 Manual checks | 🔄 Manual/Function | Required |
| **Tracking** | ✅ Auto (database) | 🔄 Manual (file update) | 🔄 Manual/API | Optional |
| **Cost** | ~$0.09 (new) | ~$0.12 (new) | ~$0.10-0.15 | Varies |
| **Setup Complexity** | Medium | Low | Medium | Varies |

**Legend:**
- ✅ Full support
- ⚠️ Partial support
- 🔄 Alternative method
- ❌ Not available

---

## Implementation Differences

### Step 0: Fit Analysis

#### Claude Code
```markdown
1. Call: mcp__resume-memory__get_profile_summary()
   → Returns compressed profile (200 tokens)
2. Calculate fit score
3. Present assessment
4. Wait for confirmation
```

#### Gemini CLI
```markdown
1. Read: job-prep/applications/_resources/profile-summary.md
   → Loads full profile summary (~500 tokens)
2. Calculate fit score
3. Present assessment
4. Wait for confirmation (text input)
```

#### GPT-4
```markdown
1. Profile injected in system prompt
   → Pre-loaded at session start
2. Calculate fit score
3. Present assessment
4. Wait for confirmation (callback or text)
```

**Key Difference:** Profile loading method
- **Claude:** MCP tool (200 tokens)
- **Gemini:** File read (500 tokens)
- **GPT-4:** Pre-injected (0 additional tokens)

---

### Step 1: Similarity Check

#### Claude Code
```markdown
1. Call: mcp__resume-memory__check_resume_similarity()
   → Uses txtai semantic search (Python API)
   → Returns top 3 with similarity scores
2. Display matches (0 additional tokens)
```

#### Gemini CLI
```markdown
1. Read: job-prep/applications/README.md
   → Parse past applications manually
2. Calculate keyword similarity
   → Intersection / union of keywords
3. Sort and display top 3
```

#### GPT-4
```markdown
1. Option A: Call custom similarity API
2. Option B: Keyword-based (like Gemini)
3. Display top 3 matches
```

**Key Difference:** Similarity algorithm
- **Claude:** Semantic (txtai embeddings) - most accurate
- **Gemini:** Keyword overlap - fast, less accurate
- **GPT-4:** Configurable (API or keyword)

**Accuracy:**
- Semantic: ~95% (finds conceptually similar)
- Keyword: ~80% (finds lexically similar)

---

### Step 2: Generate Reasoning

#### Claude Code
```markdown
1. Analyze overlap (native LLM reasoning)
2. Call: mcp__resume-memory__process_similarity_reasoning()
   → Auto-generates recommendation
   → Returns formatted options
```

#### Gemini CLI
```markdown
1. Analyze overlap (native LLM reasoning)
2. Apply decision tree manually:
   IF confidence ≥90%: use_existing
   ELSE IF confidence ≥85%: tailor
   ELSE: create_new
3. Format options manually
```

#### GPT-4
```markdown
1. Analyze overlap (native LLM reasoning)
2. Option A: Call function for auto-recommend
3. Option B: Manual decision tree (like Gemini)
```

**Key Difference:** Auto-recommendation
- **Claude:** MCP tool handles it (0 additional tokens)
- **Gemini:** Manual logic in code (~100 tokens)
- **GPT-4:** Configurable (function call or manual)

---

### Step 4: Generate PDF

#### Claude Code
```markdown
1. Validate: mcp__resume-memory__validate_resume()
2. Generate: mcp__resume-generator__generate_resume()
   → Calls LaTeX compilation API
   → Returns PDF buffer
3. Save to file
```

#### Gemini CLI
```markdown
1. Validate: Manual checks in code
2. Generate: node generate-resume-standalone.mjs
   → Subprocess execution
   → Reads generated PDF file
3. Already saved by subprocess
```

#### GPT-4
```markdown
1. Validate: Manual checks or function call
2. Generate: Subprocess or API call
   → Depends on environment
3. Save to file
```

**Key Difference:** PDF generation method
- **Claude:** MCP server (integrated, fast)
- **Gemini:** Subprocess (separate process, slower)
- **GPT-4:** Configurable (subprocess or API)

**Performance:**
- MCP server: ~2 seconds
- Subprocess: ~5 seconds (includes Node.js startup)

---

### Step 5: Tracking

#### Claude Code
```markdown
1. Call: mcp__resume-memory__track_application()
   → Writes to SQLite database
   → Updates knowledge graph
   → Enables pattern learning
```

#### Gemini CLI
```markdown
1. Manually update: job-prep/applications/README.md
   → Append new row to tracker table
2. No automatic pattern learning
```

#### GPT-4
```markdown
1. Option A: Call API for tracking
2. Option B: Manual file update (like Gemini)
```

**Key Difference:** Tracking persistence
- **Claude:** Database (queryable, enables ML)
- **Gemini:** Markdown file (simple, no ML)
- **GPT-4:** Configurable

---

## Context Loading

### Claude Code

**Auto-loaded at session start:**
```
.claude/CLAUDE.md (project instructions)
```

**On-demand via slash commands:**
```
/profile    → .claude/commands/profile.md
/apply      → .claude/commands/apply.md
/interview  → .claude/commands/interview.md
```

**Dynamic loading during workflow:**
```
SlashCommand("/profile")  → Injects profile context mid-conversation
```

**Benefits:**
- Clean separation of concerns
- Reusable context modules
- Token-efficient (load only what's needed)

### Gemini CLI

**Explicit loading at session start:**
```
System Prompt:
You are a Resume Agent.

CONTEXT:
[Contents of .gemini/GEMINI.md]

PROFILE:
[Contents of profile-summary.md]

WORKFLOW:
[Contents of UNIVERSAL_WORKFLOW.md]
```

**No dynamic loading:**
- All context pre-loaded
- Higher initial token cost
- No slash command routing

**Benefits:**
- Simpler setup (no slash command system)
- Everything in one place
- No additional tools needed

### GPT-4

**System prompt injection:**
```
System: You are a Resume Agent with this profile:
[Profile data]

Follow this workflow:
[Workflow summary]
```

**Or function calling:**
```
get_profile() → Returns profile data
get_workflow() → Returns next step
```

**Benefits:**
- Flexible (system prompt OR functions)
- Standard API patterns
- Easy to integrate

---

## Approval Checkpoints

### Claude Code

**Interactive (native):**
```
Claude: Proceed with application?
User: yes
```

**Immediate response:** Agent continues in same conversation.

### Gemini CLI

**Text-based:**
```
Gemini: Proceed with application? (yes/no)
User: yes
```

**Immediate response:** Agent continues in same session.

### GPT-4

**Option A: Callback-based:**
```
GPT-4: [Calls approval_checkpoint() function]
System: Waiting for user...
User approves via UI
System: [Resumes with approval]
```

**Option B: Text-based (like Gemini)**

---

## Error Handling

### Claude Code

**MCP tools handle gracefully:**
```markdown
If resume-memory server down:
  ✅ Shows clear error
  ✅ Suggests fallback mode
  ✅ Can continue with file-based ops

If validation fails:
  ✅ Auto-loads baseline
  ✅ Re-validates
  ✅ Blocks PDF generation
```

### Gemini CLI

**Manual error handling:**
```markdown
If file not found:
  ❌ Must handle in code
  ✅ Show file path to user
  ✅ Ask to create or retry

If validation fails:
  ✅ Show errors
  ✅ Manually reload baseline
  ✅ Re-validate
```

### GPT-4

**Depends on implementation:**
- Function calling: Automatic retry logic
- Manual: Similar to Gemini

---

## Cost Comparison

### Example: Generate Resume for Similar Role (85% match)

| Step | Claude Code | Gemini CLI | GPT-4 (est.) |
|------|------------|-----------|--------------|
| **Fit Analysis** | 500 tokens | 700 tokens | 600 tokens |
| **Similarity Check** | 0 tokens (MCP) | 300 tokens | 200 tokens |
| **Reasoning** | 800 tokens | 1,000 tokens | 900 tokens |
| **Generate Draft** | 1,200 tokens | 1,500 tokens | 1,300 tokens |
| **Validation** | 0 tokens (MCP) | 200 tokens | 150 tokens |
| **Total** | **2,500 tokens** | **3,700 tokens** | **3,150 tokens** |
| **Cost** | **$0.03** | **$0.05** | **$0.04** |

**Winner:** Claude Code (lowest cost due to MCP optimization)

### Example: Create New Resume (<80% match)

| Agent | Tokens | Cost |
|-------|--------|------|
| **Claude Code** | 7,500 | $0.09 |
| **Gemini CLI** | 10,000 | $0.12 |
| **GPT-4** | 8,500 | $0.10 |

**Winner:** Claude Code (MCP tools save ~2,500 tokens)

---

## Setup Complexity

### Claude Code

**Setup steps:**
1. Install Node.js + npm
2. Install Claude Code CLI
3. Configure `~/.claude/settings.json` (MCP servers)
4. (Optional) Setup Python txtai API
5. Test MCP connection

**Time:** ~30 minutes
**Difficulty:** Medium (MCP configuration)

### Gemini CLI

**Setup steps:**
1. Install Node.js + npm
2. Install Gemini CLI
3. Create `.gemini/GEMINI.md` config
4. Test standalone generator
5. Ready to use

**Time:** ~10 minutes
**Difficulty:** Low (no MCP needed)

### GPT-4

**Setup steps:**
1. Install Node.js + npm
2. Setup OpenAI API key
3. Configure function calling (optional)
4. Test API connection
5. Ready to use

**Time:** ~15 minutes
**Difficulty:** Low-Medium

---

## Recommendations

### Choose Claude Code if:
- ✅ You want lowest cost (~30% cheaper)
- ✅ You want semantic similarity (better matching)
- ✅ You want automatic tracking and pattern learning
- ✅ You're okay with MCP setup (one-time effort)

### Choose Gemini CLI if:
- ✅ You want fastest setup (no MCP needed)
- ✅ You prefer simple file-based operations
- ✅ You don't need advanced features (semantic search, auto-tracking)
- ✅ You're okay with slightly higher cost

### Choose GPT-4 if:
- ✅ You already use OpenAI API
- ✅ You want flexibility (function calling or manual)
- ✅ You want balance of features and cost

---

## Migration Path

### From Gemini to Claude

**Steps:**
1. Setup MCP servers (Claude Code)
2. Migrate profile to compressed version
3. Test MCP tools
4. Enjoy cost savings (~40%)

**Time:** ~30 minutes

### From Claude to Gemini

**Steps:**
1. Export profile summary to file
2. Create `.gemini/GEMINI.md` config
3. Test standalone generator
4. Ready to use

**Time:** ~10 minutes

---

## Future Enhancements

### Planned Features

**All Agents:**
- [ ] Web-based UI for easier approval checkpoints
- [ ] Docker compose for full system setup
- [ ] CI/CD for testing across agents

**Agent-Specific:**
- [ ] Claude: Voice input for job posting
- [ ] Gemini: Local semantic search (no API needed)
- [ ] GPT-4: Vision API for screenshot-based job posting

---

**For implementation details, see agent-specific files:**
- Claude Code: `.agent-config/agents/claude-resume-agent.md`
- Gemini CLI: `.agent-config/agents/gemini-resume-agent.md`
- Universal: `.agent-config/agents/universal-resume-agent.md`
