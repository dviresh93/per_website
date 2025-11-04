# Agent-Based Architecture Specification

**Version:** 1.1
**Date:** 2025-10-28
**Status:** APPROVED - Ready for Implementation

---

## 🎯 Core Philosophy

### Commands = Reusable General Tools
- `/profile`, `/apply`, `/context` are general tools that both humans AND agents can invoke
- These commands apply to ALL scenarios (not company-specific)
- Agents load context by calling these commands (no duplication)
- Single source of truth for all information
- Update a command once → all agents benefit

### Company Context = Self-Contained in Folders
- Company-specific interview prep lives IN company folders (not as commands)
- Each company folder contains its own context files (CLAUDE.md, README.md, etc.)
- Interview Coach Agent discovers companies via Glob and reads context directly from files
- No need for `.claude/commands/{company}.md` files - context is self-contained

### Agents = Specialized Workers
- Each agent has specific domain expertise (resume, networking, interview, portfolio)
- Agents autonomously use available tools to complete tasks
- Clean separation: routing commands launch agents with full definitions
- Agents work in isolated context (main chat stays clean)

### Context Persistence
- All context stored in files (survives restarts)
- Company-specific interview prep organized by folder structure
- Agents discover existing context or create new folders as needed
- No reliance on session memory

---

## 📁 Directory Structure

```
.claude/
├── AGENT_ARCHITECTURE_SPEC.md        ← THIS FILE (reference document)
│
├── commands/                          [General Tools - used by humans AND agents]
│   ├── profile.md                    ← EXISTING: Load user background (GENERAL TOOL)
│   ├── apply.md                      ← EXISTING: Resume workflow instructions (GENERAL TOOL)
│   ├── context.md                    ← EXISTING: Load repo context (GENERAL TOOL)
│   │
│   ├── resume.md                     ← NEW: Route → resume-agent
│   ├── network.md                    ← NEW: Route → network-agent
│   ├── interview.md                  ← NEW: Route → interview-coach-agent
│   └── portfolio.md                  ← NEW: Route → portfolio-agent
│
│   [NOTE: No company-specific commands here - those are self-contained in company folders]
│
└── agents/                            [Agent Definitions - NEW DIRECTORY]
    ├── README.md                     ← Overview of agent system
    ├── resume-agent.md               ← Resume generation specialist
    ├── network-agent.md              ← Networking/communication specialist
    ├── interview-coach-agent.md      ← Interview preparation specialist
    └── portfolio-agent.md            ← Portfolio maintenance specialist

interview-prep/
└── companies/                         [Company-specific interview prep - SELF-CONTAINED]
    ├── casium/                       ← EXISTING: 23 files + comprehensive context
    │   ├── README.md                 ← Overview of all Casium prep materials
    │   ├── onsite-prep/
    │   │   ├── CLAUDE.md             ← INTERVIEW CONTEXT (replaces .claude/commands/casium.md)
    │   │   ├── system_design_coaching.md
    │   │   ├── live_coding_framework.md
    │   │   └── ... (practice problems, guides)
    │   ├── python-practice/
    │   ├── database-schema/
    │   └── notes/                    ← Practice session notes saved here
    │
    ├── amazon/                       ← EXAMPLE: Future company (auto-created by agent)
    │   ├── README.md                 ← Agent creates: overview of prep materials
    │   ├── CLAUDE.md                 ← Agent creates: interview context & coaching rules
    │   ├── interview-guide.md        ← Agent creates: interview format, focus areas
    │   ├── practice/                 ← Agent creates: practice problems folder
    │   └── notes/                    ← Agent creates: session notes folder
    │
    └── {company-name}/               ← PATTERN: Any new company follows this structure
        ├── README.md                 ← Overview and quick reference
        ├── CLAUDE.md                 ← Interview context and coaching rules (REQUIRED)
        ├── interview-guide.md        ← Company-specific interview notes
        ├── practice/                 ← Practice problems and exercises
        ├── system-design/            ← System design prep (if applicable)
        └── notes/                    ← Practice session notes and progress

    [NOTE: Each company folder is SELF-CONTAINED - no separate .claude/commands/ file needed]
```

---

## 🤖 Agent Specifications

### 1. Resume Generation Agent

**Purpose:** Handle complete job application workflow from analysis to PDF generation

**Trigger Command:** `/resume [job description]`

**Tools Available:**
- `SlashCommand("/profile")` - Load user background, employment history, projects
- `SlashCommand("/apply")` - Load resume generation workflow instructions
- `Read` - Access baseline resume, format standards, templates
- `Write` - Create scratchpad files for user review
- `MCP tool (mcp__resume-generator__generate_resume)` - Generate professional PDF

**Files Agent Needs:**
- `job-prep/applications/_resources/baseline-resume-data.json` (proven format)
- `job-prep/applications/_resources/FORMAT-STANDARDS.md` (3-3-3-2 pattern, etc.)
- `job-prep/applications/_resources/WORKFLOW.md` (complete process guide)
- `job-prep/applications/_resources/resume-scratchpad-template.md` (review template)

**Workflow Steps:**
1. **Load Context**
   - Call `SlashCommand("/profile")` to load user's background
   - Call `SlashCommand("/apply")` to load workflow instructions
   - Read `baseline-resume-data.json` (starting point)
   - Read `FORMAT-STANDARDS.md` (format rules)

2. **Analyze Job**
   - Extract required vs. preferred skills from job description
   - Identify keywords, buzzwords, company values
   - Assess fit percentage (be honest: 40-95%)
   - Recommend action: Apply now / Build skills first / Skip

3. **Generate Scratchpad for Review**
   - Use template: `resume-scratchpad-template.md`
   - Show proposed changes:
     - Summary modifications (before → after)
     - Skills reordering (prioritize job requirements)
     - Work experience bullet modifications
     - Project selection (which 3 projects and why)
   - Write to file: `job-prep/applications/{company-role}/resume-scratchpad.md`
   - Tell user file path so they can edit directly in their editor

4. **Wait for User Approval** ⏸️
   - User will review scratchpad file and either:
     - **Option A:** Edit file directly → save → say "approve"
     - **Option B:** Ask agent to modify → agent updates file → wait again
     - **Option C:** Say "reject" → stop process
   - Agent must explicitly wait for approval (NO automatic PDF generation)

5. **Generate Resume JSON** (Only after approval)
   - Read approved scratchpad from file (may include user's direct edits)
   - Start from `baseline-resume-data.json`
   - Apply all approved customizations from scratchpad
   - Verify format standards:
     - [ ] Work experience: 3-3-3-2 bullet pattern (11 total bullets)
     - [ ] Projects: 3 projects, each with 3 bullets (Problem/Solution/Impact)
     - [ ] Projects use `highlights` array (not `description` field)
     - [ ] Skills: 4 categories with comprehensive keywords
     - [ ] Education: Both degrees included
   - Save as: `job-prep/applications/{company-role}/resume-data.json`

6. **Generate PDF**
   - Call MCP tool: `mcp__resume-generator__generate_resume`
   - Parameters:
     - `resumeData`: Complete JSON object from step 5
     - `filename`: `viresh-duvvuri-{company-name}-{role}` (lowercase, hyphenated)
     - `folderPath`: `applications/{company-name}-{role}`
   - PDF saves to: `/home/virus/Documents/generated-resumes/applications/{company-role}/`

7. **Confirm Success**
   - Provide success message with:
     - Fit summary (X% match for [Job Title] at [Company])
     - Key tailoring points (3-5 main customizations made)
     - Full file path to generated PDF
     - Next steps (application strategy, networking timeline)

**Critical Rules - What NEVER Changes:**
- ❌ Employment dates (sacred - source of truth in profile.md)
- ❌ Job titles at companies
- ❌ Company names
- ❌ Core metrics (70%, 80%, 200+ queries, 45%, 50%, etc.)
- ❌ Bullet count structure (3-3-3-2 for work, 3 per project)

**Critical Rules - What Always Customizes:**
- ✅ Summary (role title, technology order, emphasis)
- ✅ Skills keywords order (match job requirements, within categories)
- ✅ Project selection (choose 3 most relevant for this role)
- ✅ Work bullet emphasis (can add keywords naturally, don't force)

**Quality Standards:**
- Be honest about fit (don't oversell weak matches)
- No false metrics (everything must be defensible in interview)
- Natural language (not keyword-stuffed or AI-generated sounding)
- Human-readable (recruiter AND ATS friendly)
- Act as recruiter for final check: "Would I call this candidate?"

---

### 2. Networking & Communication Agent

**Purpose:** Draft human-sounding messages for LinkedIn, email, and application responses

**Trigger Command:** `/network <type> [details]`

**Examples:**
- `/network connection "Hiring manager at Amazon for SDE role"`
- `/network follow-up "After submitting application 5 days ago to PepsiCo"`
- `/network thank-you "After phone screen with Sarah from GridScale"`

**Tools Available:**
- `SlashCommand("/profile")` - Load user background and experience
- `Read` - Access networking templates and examples

**Files Agent Needs:**
- `job-prep/applications/_resources/networking-templates.md` (message patterns)
- `scratchpad.txt` (LinkedIn profile text for reference)

**Workflow Steps:**
1. **Load Context**
   - Call `SlashCommand("/profile")` to understand user's background
   - Read `networking-templates.md` for human-sounding patterns

2. **Understand Request**
   - Who is the recipient? (recruiter, hiring manager, peer, past colleague)
   - What's the purpose? (connection request, follow-up, thank you, informational)
   - What's the context? (job application, networking, referral, cold outreach)
   - Any specific details to mention? (company project, mutual connection, etc.)

3. **Draft Messages**
   - Create 2-3 variations:
     - **Casual version** (for peers, startup culture)
     - **Professional version** (for corporate, hiring managers)
     - **Brief version** (when short is better)
   - Keep messages short: 3-5 sentences maximum
   - Be specific (mention something about them/company/role)
   - Include clear next step (if appropriate)

4. **Iterate Based on Feedback**
   - User may request changes: tone, length, emphasis
   - Adjust and provide revised versions
   - Explain reasoning for word choices (if asked)

**Critical Principles - Be Human:**
- ❌ "I am writing to express my enthusiastic interest..."
- ✅ "I'm interested in the [Role] because..."
- ❌ "I would welcome the opportunity to discuss..."
- ✅ "Would you be open to a brief chat?"

**Critical Principles - Be Specific:**
- ❌ "I love your company's mission and values"
- ✅ "I saw you're using multi-agent systems for supply chain optimization"
- ❌ "I'm passionate about the work you do"
- ✅ "Your GridCOP-like approach to [domain] caught my attention"

**Critical Principles - Be Brief:**
- LinkedIn connection request: 2-3 sentences
- Follow-up email: 3-4 sentences
- Thank you note: 2-3 sentences
- No long paragraphs or walls of text

**Critical Principles - Sound Like Viresh:**
- Conversational, not overly formal
- Technical but accessible (no jargon dumping)
- Genuine interest, not desperation
- Specific examples, not generic praise
- No AI-generated corporate speak

---

### 3. Interview Coach Agent (Company-Aware)

**Purpose:** Provide interview preparation through teaching and mock interview practice, with company-specific context management

**Trigger Command:** `/interview <company-name> [practice-type]`

**Examples:**
- `/interview casium live-coding`
- `/interview amazon system-design`
- `/interview google behavioral`
- `/interview woven architecture-debugging`

**Tools Available:**
- `SlashCommand("/profile")` - Load user background and technical experience
- `Read` - Access company context files, practice problems, coaching guides
- `Write` - Create practice notes, save progress, create new company folders
- `Glob` - Discover existing company folders and materials

**Files Agent May Need (Company-Specific):**
- `interview-prep/companies/{company}/README.md` - Overview of materials
- `interview-prep/companies/{company}/CLAUDE.md` - Interview context & coaching rules (REQUIRED)
- `interview-prep/companies/{company}/interview-guide.md` - Interview format, focus areas
- `interview-prep/companies/{company}/practice/` - Practice problems
- `interview-prep/companies/{company}/notes/` - Session notes and progress

---

#### Company Context Discovery Logic (CRITICAL FEATURE)

**Scenario 1: Existing Company (e.g., Casium)**

User runs: `/interview casium live-coding`

```
Agent workflow:
1. Call SlashCommand("/profile") → load user background
2. Use Glob to check: Does `interview-prep/companies/casium/` exist?
   → YES, folder exists with 23 files

3. Read company context files directly:
   - Read: casium/README.md → understand available materials
   - Read: casium/onsite-prep/CLAUDE.md → load interview context & coaching rules
   - Read: casium/onsite-prep/system_design_coaching.md → system design methodology

   [NO SlashCommand("/casium") needed - context is in files!]

4. Parse available materials from README:
   - Company-specific prep (immigration exercise, satellite exercise)
   - Database schema materials (9 files)
   - Python coding practice (8 files)
   - Reference solutions (2 files)

5. Present menu to user:
   "Welcome to Casium interview prep! Available materials:
   - Live coding: 8 Python practice problems
   - System design: 3 exercises with database focus
   - Company prep: Immigration & satellite exercises

   What would you like to focus on?"

6. Conduct practice session based on user choice
7. Save session notes to: casium/notes/session-YYYY-MM-DD.md
```

**Scenario 2: New Company (e.g., Amazon)**

User runs: `/interview amazon system-design`

```
Agent workflow:
1. Call SlashCommand("/profile") → load user background
2. Use Glob to check: Does `interview-prep/companies/amazon/` exist?
   → NO, folder does not exist (returns empty)

3. Agent initiates new company setup:
   "I don't see existing prep materials for Amazon. Let me set up a folder structure.

   First, let me gather some context:
   - Do you have the job description?
   - What's the interview format? (number of rounds, types of interviews)
   - What are the focus areas? (system design, coding, behavioral, etc.)
   - Any other materials? (recruiter emails, interview guides, etc.)"

4. Create folder structure:
   interview-prep/companies/amazon/
   ├── README.md              (describes prep materials and structure)
   ├── CLAUDE.md              (interview context & coaching rules - REQUIRED)
   ├── interview-guide.md     (stores interview format, timeline, focus areas)
   ├── practice/              (for practice problems - initially empty)
   ├── system-design/         (for system design prep)
   ├── coding/                (for coding practice)
   └── notes/                 (for session notes)

5. Store user-provided context:
   - Write job description to interview-guide.md
   - Write interview format details to CLAUDE.md
   - Create README.md explaining the structure
   - Set up CLAUDE.md with coaching rules template

6. Begin prep with available information:
   "Great! I've set up Amazon prep materials. Based on your job description,
   I see they emphasize [X, Y, Z]. Let's start with system design practice..."

7. Save session notes to: amazon/notes/session-YYYY-MM-DD.md

8. [FUTURE SESSIONS]
   User runs: /interview amazon coding
   → Agent finds amazon/ folder, loads context, continues where left off
```

**Company Context is Self-Contained (No Command Files Needed):**

After creating amazon/ folder, agent stores all context in the folder:
- `amazon/CLAUDE.md` contains interview context and coaching rules
- `amazon/README.md` contains overview of materials
- `amazon/interview-guide.md` contains job description and interview format

Future sessions:
- User runs: `/interview amazon coding`
- Agent finds amazon/ folder via Glob
- Agent reads amazon/CLAUDE.md directly for context
- No need for `.claude/commands/amazon.md` - context is self-contained!

This keeps `.claude/commands/` clean with only GENERAL tools.

---

#### Two Operating Modes

**Teaching Mode (Default - 70% of time):**
- Answer questions conversationally
- Show examples and comparisons
- Guide with hints ("What would happen if X?")
- Correct mistakes immediately with explanation
- Build understanding step-by-step
- Encourage thinking aloud and communication

**Mock Interview Mode (On User Request - 30% of time):**
- Simulate realistic interview pressure and timing
- Stay in character as interviewer (no breaking character)
- Let user struggle appropriately (no hints unless completely stuck >5 minutes)
- Only intervene if totally off-track
- Provide comprehensive feedback at end:
  - What went well (strengths demonstrated)
  - What to improve (specific areas)
  - Specific techniques to practice
  - Overall assessment (would pass/needs more practice)

**Switching Modes:**
- User can request: "Let's do a mock interview" or "Teach me this concept first"
- Agent can suggest: "You seem comfortable with this. Want to try a mock interview?"

---

#### Practice Focus Areas

**Live Coding (Python Business Logic):**
- Date calculations and time-based logic
- Eligibility rules and conditional workflows
- Document processing and validation
- Edge case handling (nulls, invalid inputs, boundary conditions)
- Communication while coding (thinking aloud)
- Testing approach (how would you test this?)

**System Design:**
- Database schema design (30% of focus)
- API design and REST principles (30% of focus)
- Distributed system components (40% of focus)
- Startup/mid-size scale (thousands of users, not billions)
- Trade-offs and decision rationale
- Domain-specific context (immigration platform, e-commerce, etc.)

**Behavioral:**
- STAR format responses (Situation, Task, Action, Result)
- Technical leadership examples
- Cross-functional collaboration stories
- Problem-solving and debugging approaches
- Handling ambiguity and prioritization

---

#### Session Persistence

**After Each Practice Session:**
- Save notes to: `{company}/notes/session-YYYY-MM-DD.md`
- Include:
  - Problems practiced
  - Key learnings
  - Areas to improve
  - Next session focus
- Track progress over time (can reference previous sessions)

**Context Across Restarts:**
- All company context in files (survives session restarts)
- Agent can load previous session notes
- User can pick up exactly where they left off
- Example: "Last time we practiced database schema design. Want to continue with API design?"

---

### 4. Portfolio Maintenance Agent

**Purpose:** Safely update portfolio website content with approval checkpoints

**Trigger Command:** `/portfolio <action> [details]`

**Examples:**
- `/portfolio add-project "GridCOP - now in production serving 100 queries/day"`
- `/portfolio update-skills "Add CrewAI, MCP, and A2A to AI/ML skills"`
- `/portfolio review "Check if portfolio is consistent with latest resume"`
- `/portfolio sync-resume "Update portfolio to match baseline resume"`

**Tools Available:**
- `SlashCommand("/profile")` - Load user background
- `Read` - Access current portfolio data and baseline resume
- `Write` - Update portfolio JSON files (ONLY with explicit approval)

**Files Agent Works With:**
- `data/projects.json` - Portfolio projects
- `data/experience.json` - Work experience
- `data/skills.json` - Technical skills
- `data/education.json` - Education details
- `job-prep/applications/_resources/baseline-resume-data.json` - For consistency check

**Workflow Steps:**
1. **Load Context**
   - Call `SlashCommand("/profile")` to understand user's current background
   - Read current portfolio data files: `data/*.json`
   - Read baseline resume for consistency: `baseline-resume-data.json`

2. **Analyze Request**
   - What needs updating? (new project, skill, experience update)
   - Which file(s) affected? (projects.json, skills.json, etc.)
   - Is it consistent with resume? (check dates, titles, metrics)

3. **Propose Changes** ⏸️
   - Show current state (relevant section from JSON)
   - Show proposed changes (diff format with + and - lines)
   - Explain rationale (why these changes, what's being added/modified)
   - **Wait for explicit approval** (do NOT write automatically)

4. **Apply Changes** (Only after user approves)
   - Write updated JSON file(s)
   - Verify JSON structure is valid
   - Confirm success with what was changed

5. **Verify Consistency**
   - Check portfolio matches resume (dates, titles, companies)
   - Flag any discrepancies for user to resolve

**Critical Safety Rules:**

**READ-ONLY by Default:**
- Always propose changes BEFORE writing
- Show diff format so user can review exact changes
- Explicit approval required for ANY file modification
- If uncertain, ASK rather than assume

**NEVER Touch (Production Safety):**
- ❌ `index.html` (production HTML)
- ❌ Any CSS files (`css/styles.css`, etc.)
- ❌ Any JavaScript files (`js/main.js`, etc.)
- ❌ Docker configuration files
- ❌ `nginx.conf`
- ❌ `profile-photo.jpg` or any media files

**ONLY Modify (With Approval):**
- ✅ JSON files in `data/` directory
- ✅ After showing diff and getting approval
- ✅ With valid JSON structure verification

**Consistency Checks:**
- Portfolio projects should align with resume projects
- Work experience dates must match exactly (resume is source of truth)
- Skills should be superset of resume skills (portfolio can have more)
- Metrics must be consistent (70%, 200+ queries, etc.)

**Example Diff Format:**
```diff
File: data/projects.json

 {
   "projects": [
     {
       "name": "GridCOP",
-      "status": "In Development",
+      "status": "Production",
-      "description": "Multi-agent AI system for smart grid analytics",
+      "description": "Production multi-agent AI system serving 100+ daily queries for smart grid analytics",
       "technologies": ["LangChain", "MCP", "Python", "FastAPI", "AWS"]
     }
   ]
 }

Approve these changes? (yes/no)
```

---

## 🔧 Implementation Files to Create

### Phase 1: Agent System Directory Structure

**Create:**
1. `.claude/agents/` directory
2. `.claude/agents/README.md` - Overview of agent system and how to use

---

### Phase 2: Routing Commands (4 Files)

These are simple commands that launch the appropriate agent with Task tool.

**File 1:** `.claude/commands/resume.md`
```markdown
# Resume Generation Command

Launch the Resume Generation Agent to handle complete job application workflow.

**Usage:** `/resume [paste job description]`

**What the agent does:**
- Analyzes job requirements and assesses your fit
- Generates customized resume scratchpad for review
- Waits for your approval (human-in-the-loop checkpoint)
- Generates professional PDF after approval
- Provides application strategy and next steps

**Implementation:**
Use Task tool with subagent_type="general-purpose" and load the complete agent definition from `.claude/agents/resume-agent.md`.

Pass the user's job description to the agent.
```

**File 2:** `.claude/commands/network.md`
```markdown
# Networking & Communication Command

Launch the Networking Agent to draft human-sounding messages.

**Usage:** `/network <type> [details]`

**Examples:**
- `/network connection "Hiring manager at Amazon"`
- `/network follow-up "After applying 5 days ago"`
- `/network thank-you "After phone screen with Sarah"`

**What the agent does:**
- Drafts 2-3 message variations (casual, professional, brief)
- Uses networking templates and your background
- Keeps messages short and human-sounding
- Iterates based on your feedback

**Implementation:**
Use Task tool with subagent_type="general-purpose" and load the complete agent definition from `.claude/agents/network-agent.md`.

Pass the networking request context (type and details) to the agent.
```

**File 3:** `.claude/commands/interview.md`
```markdown
# Interview Coaching Command

Launch the Interview Coach Agent for company-specific interview preparation.

**Usage:** `/interview <company-name> [practice-type]`

**Examples:**
- `/interview casium live-coding`
- `/interview amazon system-design`
- `/interview google behavioral`

**What the agent does:**
- Discovers existing company prep materials OR creates new structure
- Loads company-specific context automatically
- Provides teaching mode (default) or mock interview mode
- Saves practice session notes for future reference
- Maintains progress across multiple sessions

**Company Context:**
- If company folder exists → loads context and continues
- If new company → creates folder structure, gathers context, stores for future

**Implementation:**
Use Task tool with subagent_type="general-purpose" and load the complete agent definition from `.claude/agents/interview-coach-agent.md`.

Pass company name and practice type to the agent.

Agent will discover existing context or create new company folder as needed.
```

**File 4:** `.claude/commands/portfolio.md`
```markdown
# Portfolio Maintenance Command

Launch the Portfolio Agent to safely update portfolio website content.

**Usage:** `/portfolio <action> [details]`

**Examples:**
- `/portfolio add-project "GridCOP in production"`
- `/portfolio update-skills "Add CrewAI and MCP"`
- `/portfolio review "Check consistency with resume"`

**What the agent does:**
- Proposes changes (shows diff before writing)
- Waits for your approval (safety checkpoint)
- Updates JSON files only (never touches HTML/CSS/JS)
- Verifies consistency with resume
- Confirms success after changes applied

**Safety:**
- READ-ONLY by default (proposes before writing)
- Explicit approval required for modifications
- Never touches production HTML/CSS/JS files
- Only modifies JSON files in `data/` directory

**Implementation:**
Use Task tool with subagent_type="general-purpose" and load the complete agent definition from `.claude/agents/portfolio-agent.md`.

Pass the portfolio action request to the agent.
```

---

### Phase 3: Agent Definition Files (4 Files)

These are the comprehensive agent instructions that define behavior, workflow, and rules.

**File 1:** `.claude/agents/resume-agent.md`
- Full implementation of "Resume Generation Agent" specification above
- Include all workflow steps, tools, critical rules, quality standards
- Reference format standards and baseline resume
- Implement scratchpad-to-file review process

**File 2:** `.claude/agents/network-agent.md`
- Full implementation of "Networking & Communication Agent" specification above
- Include message drafting workflow, principles for human-sounding content
- Use networking templates as reference
- Provide multiple variations (casual, professional, brief)

**File 3:** `.claude/agents/interview-coach-agent.md`
- Full implementation of "Interview Coach Agent" specification above
- **CRITICAL:** Include company context discovery logic (Glob check, folder creation)
- Implement two modes: Teaching and Mock Interview
- Define practice focus areas and session persistence
- Include instructions for creating new company folders

**File 4:** `.claude/agents/portfolio-agent.md`
- Full implementation of "Portfolio Maintenance Agent" specification above
- Emphasize safety rules (READ-ONLY by default, never touch production files)
- Include diff format examples
- Implement consistency checks with resume

**File 5:** `.claude/agents/README.md`
- Overview of agent system
- List of available agents and when to use each
- Explanation of how agents use commands as tools
- Quick reference for user commands
- Troubleshooting common issues

---

## 🎯 Key Design Decisions & Rationale

### 1. Commands as Reusable Tools (Not Duplicated Instructions)

**Decision:** Keep all existing commands (`/profile`, `/apply`, `/casium`) unchanged. Agents invoke them via `SlashCommand()` tool.

**Rationale:**
- ✅ Single source of truth (update command once, all agents benefit)
- ✅ No duplication of instructions
- ✅ Humans and agents use the same tools
- ✅ Easy to maintain and extend

**Example:**
```
Human workflow:
/profile → Loads background in main chat

Agent workflow:
Agent calls SlashCommand("/profile") → Background loads into agent's context

Result: Same tool, different consumer, consistent output
```

---

### 2. Company-Specific Context Discovery Pattern

**Decision:** Interview Coach Agent uses dynamic discovery - checks if company folder exists, loads context if found, creates structure if new.

**Rationale:**
- ✅ Scalable (works for 1 company or 100 companies)
- ✅ No manual setup required for new companies
- ✅ Context persists across sessions (files, not memory)
- ✅ Clean organization (each company has its own folder)

**Implementation:**
```
Agent uses Glob: interview-prep/companies/{company-name}/**

IF found:
  - Load context from README.md, interview-guide.md
  - Present available practice materials
  - Continue where user left off

IF not found:
  - Create folder structure (README, interview-guide, practice/, notes/)
  - Gather context from user (job description, interview format, etc.)
  - Store context in files
  - Future sessions load this context automatically
```

**Benefits:**
- Casium: 23 files ready to use
- Amazon: Agent creates structure on first use
- Google: Agent creates structure when needed
- All organized consistently

---

### 3. Human-in-the-Loop Approval Checkpoints

**Decision:** Resume Agent and Portfolio Agent both require explicit user approval before finalizing changes.

**Rationale:**
- ✅ Quality control (catch errors before they're final)
- ✅ Learning opportunity (user reviews what AI proposed)
- ✅ Safety (especially for portfolio production website)
- ✅ Trust building (user sees reasoning, can adjust)

**Implementation:**
- Resume Agent: Writes scratchpad to file → user reviews/edits → approves → PDF generated
- Portfolio Agent: Shows diff → user reviews → approves → JSON updated

**Why This Matters:**
- Resume errors caught in Session 1: false metrics, title inflation, keyword stuffing
- All caught BEFORE PDF generation due to scratchpad review
- Same pattern applies to portfolio (show diff, get approval, then write)

---

### 4. Stateful Agents via File Persistence

**Decision:** All agent state stored in files, not session memory.

**Rationale:**
- ✅ Survives session restarts
- ✅ Can reference previous work ("Last time we practiced X...")
- ✅ Progress tracking over time
- ✅ Shareable (can export files, others can use same structure)

**What Gets Persisted:**
- Resume: scratchpad files, resume-data.json, generated PDFs
- Networking: (optional) drafted messages saved to files
- Interview: company folders with README, guides, practice notes by date
- Portfolio: data/*.json files (production content)

**Example:**
```
Session 1: /interview casium live-coding
  → Practice problem A, save notes to casium/notes/session-2025-10-28.md

[Session restart]

Session 2: /interview casium system-design
  → Agent loads previous session notes
  → "Last time we practiced live coding. Ready for system design?"
```

---

### 5. Isolated Agent Context (Clean Main Chat)

**Decision:** Agents work in their own context via Task tool, return results to main chat.

**Rationale:**
- ✅ Main chat stays clean (high-level status updates only)
- ✅ Agent's context budget separate from user's
- ✅ Can run multiple agents in parallel (each isolated)
- ✅ Easier to manage long-running tasks (interview prep sessions)

**User Experience:**
```
Main chat:
User: /resume [job description]
Claude: "Launching Resume Generation Agent..."
Agent: "Scratchpad ready at: job-prep/applications/{company-role}/resume-scratchpad.md"
User: "approve"
Agent: "✅ PDF generated at: [path]"

[Clean, concise updates. All detailed work happens in agent's context]

vs.

Current workflow (without agents):
User: /apply [job description]
Claude: [100 lines of analysis]
Claude: [Full scratchpad displayed]
Claude: [50 lines of JSON generation]
Claude: [MCP tool output]
Claude: "Done!"

[Main chat filled with detailed implementation steps]
```

---

## ✅ Success Criteria

After implementation, the system should demonstrate:

### 1. Resume Generation
- User runs `/resume [job description]` → agent handles end-to-end workflow
- Scratchpad written to file (user can edit directly)
- Agent waits for approval (no automatic PDF generation)
- PDF generated with consistent format (3-3-3-2 bullets, Problem-Solution-Impact projects)
- Quality matches baseline resume standards
- **Works after session restart** (can resume if interrupted)

### 2. Networking
- User runs `/network connection [details]` → agent drafts human-sounding messages
- 2-3 variations provided (casual, professional, brief)
- Messages are short (3-5 sentences max)
- Sound like Viresh (not AI-generated corporate speak)
- Uses templates from `networking-templates.md`

### 3. Interview Prep (Existing Company)
- User runs `/interview casium live-coding` → agent loads 23 files of context
- Teaching mode or mock interview mode available
- Practice problems presented with coaching
- Session notes saved to `casium/notes/session-YYYY-MM-DD.md`
- **Next session picks up where left off** (references previous notes)

### 4. Interview Prep (New Company)
- User runs `/interview amazon system-design` → agent creates `amazon/` folder structure
- Agent gathers context from user (job description, interview format)
- Context stored in `amazon/README.md` and `amazon/interview-guide.md`
- Practice begins with available information
- **Future sessions load this context automatically**
- (Optional) Agent offers to create `/amazon` command for quick loading

### 5. Portfolio Updates
- User runs `/portfolio add-project [details]` → agent proposes changes (diff format)
- User approves → JSON updated, production site safe (HTML/CSS/JS untouched)
- Consistency check confirms portfolio matches resume (dates, titles, metrics)
- **No accidental production site breakage**

### 6. System Robustness
- All agents use existing commands as tools (no duplication)
- Context persists across restarts (everything in files)
- Company-specific materials organized and discoverable
- Can run multiple agents in parallel (e.g., 3 resume generations simultaneously)
- Main chat stays clean (high-level updates only)

---

## 🚀 Implementation Order & Phases

### Phase 1: Foundation Setup (Essential Infrastructure)
**Goal:** Create directory structure and agent definition files

**Tasks:**
1. **Delete outdated company command:**
   - Delete `.claude/commands/casium.md` (company context now self-contained in folder)

2. **Create agent system directory:**
   - Create `.claude/agents/` directory
   - Create `.claude/agents/README.md` (overview of agent system)

3. **Create routing commands:**
   - `.claude/commands/resume.md` (route to resume-agent)
   - `.claude/commands/network.md` (route to network-agent)
   - `.claude/commands/interview.md` (route to interview-coach-agent)
   - `.claude/commands/portfolio.md` (route to portfolio-agent)

4. **Create agent definitions:**
   - `.claude/agents/resume-agent.md` (full workflow specification)
   - `.claude/agents/network-agent.md` (message drafting specification)
   - `.claude/agents/interview-coach-agent.md` (company-aware coaching specification)
   - `.claude/agents/portfolio-agent.md` (safe update specification)

**Acceptance Criteria:**
- [ ] `.claude/commands/casium.md` deleted (no longer needed)
- [ ] All new files created with complete specifications
- [ ] Directory structure matches spec
- [ ] Agent definitions use Glob + Read (not SlashCommand) for company context
- [ ] Routing commands correctly invoke Task tool

**Time Estimate:** 1 session (create all files)

---

### Phase 2: Testing & Validation (Verify Architecture)
**Goal:** Test each agent with real scenarios, validate design decisions

**Test 1: Resume Generation Agent**
- Run `/resume [real job description from current search]`
- Verify agent calls `/profile` and `/apply` correctly
- Verify scratchpad written to file
- Edit scratchpad file directly, say "approve"
- Verify agent reads edited file and generates PDF
- Check PDF matches format standards

**Test 2: Interview Coach Agent (Existing Company)**
- Run `/interview casium live-coding`
- Verify agent loads context from 23 files
- Practice one problem in teaching mode
- Request mock interview mode
- Verify session notes saved to `casium/notes/`

**Test 3: Interview Coach Agent (New Company)**
- Run `/interview amazon system-design` (fake company for testing)
- Verify agent detects no existing folder
- Verify agent creates folder structure
- Provide fake context (job description, interview format)
- Verify context stored in files
- Exit and restart session
- Run `/interview amazon coding` again
- Verify agent loads previously stored context

**Test 4: Networking Agent**
- Run `/network connection "Hiring manager at PepsiCo"`
- Verify 2-3 variations generated
- Check messages are short and human-sounding
- Request modification, verify agent adjusts

**Test 5: Portfolio Agent**
- Run `/portfolio add-project "Test project for validation"`
- Verify agent shows diff
- Verify agent waits for approval (doesn't write automatically)
- Reject changes → verify no files written
- Run again, approve → verify JSON updated

**Acceptance Criteria:**
- [ ] All 5 tests pass
- [ ] Agents use commands as tools correctly
- [ ] Context persistence works (survives restarts)
- [ ] Company discovery works (existing vs. new)
- [ ] Approval checkpoints function properly
- [ ] Main chat stays clean (no clutter)

**Time Estimate:** 1-2 sessions (test all scenarios)

---

### Phase 3: Refinement & Documentation (Based on Usage)
**Goal:** Improve agent prompts based on test results, document learnings

**Tasks:**
1. Refine agent definitions based on test failures or suboptimal behavior
2. Add error handling patterns to agents
3. Document edge cases and how to handle them
4. Update `.claude/agents/README.md` with usage tips and troubleshooting
5. (Optional) Create company-specific commands as needed (e.g., `/amazon`)

**Acceptance Criteria:**
- [ ] All known issues from Phase 2 resolved
- [ ] Agent definitions improved for clarity and robustness
- [ ] Documentation complete (README explains system clearly)
- [ ] Edge cases handled (what if scratchpad file deleted? what if JSON malformed?)

**Time Estimate:** 1 session (iterate and document)

---

### Phase 4: Production Use (Real Applications)
**Goal:** Use agents for actual job applications and interview prep

**Activities:**
1. Use Resume Agent for next 3-5 job applications
2. Use Networking Agent for recruiter outreach
3. Use Interview Coach Agent for upcoming interviews
4. Track what works well and what needs improvement
5. Iterate on agent definitions based on real usage

**Continuous Improvement:**
- Update baseline resume as you improve wording
- Add new networking message patterns to templates
- Expand company-specific interview materials
- Refine agent instructions based on learnings

---

## 📝 Notes & Considerations

### Token Budget Management
- **Agents have their own context budget** (separate from main session)
- Company-specific context (e.g., 23 files for Casium) loads into agent's context, not yours
- Main chat stays clean with just high-level status updates
- If agent runs out of context: it will summarize and return results, can launch new agent to continue

### Parallel Agent Execution
- **Can launch multiple agents simultaneously** (e.g., 3 resume agents for 3 different jobs)
- Each agent has isolated context (no interference)
- Results come back independently (async execution)
- Example: `/resume [Job 1]` + `/resume [Job 2]` + `/resume [Job 3]` in parallel
- All 3 scratchpads generated simultaneously → review all → approve all → 3 PDFs generated

### Error Handling Patterns
**If scratchpad file deleted:**
- Agent checks if file exists before reading
- If missing: regenerate from baseline or ask user what happened

**If JSON malformed:**
- Agent validates JSON structure before writing
- If invalid: show error, ask user to review, regenerate

**If MCP tool fails:**
- Agent catches error, provides JSON to user for manual generation
- Suggests checking MCP server status

**If company folder creation fails:**
- Agent reports error, continues with in-memory context
- Warns user that context won't persist

### Company Command Creation (Optional)
After creating a new company folder (e.g., `amazon/`), agent can optionally offer:
"Would you like me to create an `/amazon` command for quick context loading?"

If user agrees, agent creates `.claude/commands/amazon.md`:
```markdown
You are my Amazon interview coach. Read these files for context:

1. `interview-prep/companies/amazon/README.md` - Overview
2. `interview-prep/companies/amazon/interview-guide.md` - Interview specifics

Load all practice materials from amazon/ folder.

Ask: What do you want to practice? [Coding | System design | Behavioral]
```

This makes future context loading faster (like `/casium` does for Casium).

### Maintenance & Updates
**When to update agent definitions:**
- New workflow patterns discovered (e.g., better way to structure scratchpad)
- User feedback on agent behavior ("agent should ask X before Y")
- Format standards change (e.g., new project bullet format)
- New tools become available (e.g., new MCP tools)

**How to update:**
1. Edit agent definition file (e.g., `.claude/agents/resume-agent.md`)
2. Test with `/resume [job]` to verify change works
3. Document change in git commit message
4. All future agent invocations use updated definition (no code deployment needed)

---

## 🎯 Final Architecture Summary

**User Interface (What You Type):**
- `/resume [job description]` → Complete job application workflow
- `/network [type] [details]` → Draft messages
- `/interview [company] [type]` → Company-aware interview prep
- `/portfolio [action]` → Safe portfolio updates

**General Tool Commands (What Agents Call):**
- `/profile` → Load user background, employment history, projects
- `/apply` → Load resume generation workflow instructions
- `/context` → Load repository structure and rules

**Company Context (Discovered by Agents via Glob, No Commands Needed):**
- Agent finds: `interview-prep/companies/{company-name}/`
- Agent reads: `{company-name}/README.md` for materials overview
- Agent reads: `{company-name}/CLAUDE.md` for interview context & coaching rules
- All context is self-contained in company folder (not in `.claude/commands/`)

**Agents (Autonomous Workers):**
- **Resume Agent** → End-to-end job application (analysis → scratchpad → approval → PDF)
- **Network Agent** → Human-sounding message drafting (variations, iterations)
- **Interview Coach Agent** → Company-aware prep (discover context, teach/mock modes, save progress)
- **Portfolio Agent** → Safe website updates (propose → approve → write, consistency checks)

**Design Principles:**
1. **Commands = Reusable Tools** (single source of truth, no duplication)
2. **Agents = Specialized Workers** (domain expertise, autonomous execution)
3. **Context Persistence** (everything in files, survives restarts)
4. **Company Discovery** (existing context loaded, new companies scaffolded)
5. **Human-in-the-Loop** (approval checkpoints for quality and safety)
6. **Isolated Execution** (agents work in own context, main chat stays clean)

**Result:**
- ✅ Clean separation of concerns
- ✅ No duplication (commands used by humans AND agents)
- ✅ Context persists across restarts
- ✅ Company-specific prep organized and discoverable
- ✅ Scalable (add new agents/companies without changing existing tools)
- ✅ Consistent output (single source of truth for formats/standards)
- ✅ Safe and robust (approval checkpoints, error handling)

---

## 📋 Approval Checklist

Before implementation, confirm:
- [ ] Directory structure makes sense
- [ ] Agent responsibilities are clear and non-overlapping
- [ ] Company discovery logic works for your use case
- [ ] Human-in-the-loop checkpoints are in the right places
- [ ] File persistence strategy covers all scenarios
- [ ] Implementation phases are realistic and achievable
- [ ] You understand how to use each agent (`/resume`, `/network`, `/interview`, `/portfolio`)
- [ ] You're comfortable with agents calling existing commands as tools
- [ ] The system will work after session restarts (everything in files)

**Status:** ⏸️ AWAITING APPROVAL

Once approved, we begin Phase 1: Foundation Setup (create all files).

---

**Questions or concerns? Let's discuss before implementing.**
