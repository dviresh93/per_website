# Resume Generation Optimization - User Guide

**For:** Daily use of the optimized resume generation system
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [First-Time Setup](#first-time-setup)
2. [Daily Workflow](#daily-workflow)
3. [Common Scenarios](#common-scenarios)
4. [Tips & Best Practices](#tips--best-practices)
5. [FAQ](#faq)

---

## First-Time Setup

### Step 1: Verify Setup

The system is already installed and configured. Just verify:

```bash
# Restart Claude Code to load MCP servers
cd /home/virus/Documents/repo/per_wesite
claude
```

**Expected result:** You should see 6 resume-memory tools available in Claude Code

### Step 2: Initialize Your Profile

**Run once (first time only):**

```
Use save_profile tool with my full profile context from /profile
```

**What this does:**
- Loads your complete 8k-token profile
- Compresses it to 200 tokens
- Stores both versions in the database
- Enables fast resume generation (uses 200-token version)

**Verification:**
```
Use get_profile_summary tool
```

You should see a compressed 200-token version of your profile.

### Step 3: (Optional) Start Similarity API

If you want zero-token resume reuse for similar jobs:

```bash
# In a separate terminal:
cd /home/virus/Documents/repo/resume-memory-mcp/semantic-search-api
source venv/bin/activate
python similarity_checker.py
```

Leave this running. If not running, similarity checks will gracefully skip (no errors).

**That's it!** You're ready to generate optimized resumes.

---

## Daily Workflow

### For Each Job Application:

#### Step 1: Check if Similar Job Exists (Optional)

```
Use check_resume_similarity tool with:
  company: "Anthropic"
  role: "AI Engineer"
  requirements: "LangChain, RAG, multi-agent systems, Python, AWS"
```

**Possible outcomes:**
- **Similar found (>85%):** Returns path to existing resume → **Use that PDF (0 tokens!)**
- **Not similar:** Proceeds to generate new resume

#### Step 2: Get Your Profile Summary

```
Use get_profile_summary tool
```

**Returns:** 200-token compressed profile (vs 8,000 tokens for full profile)

**Token savings:** 7,800 tokens

#### Step 3: Find Relevant Projects

```
Use query_knowledge_graph tool with:
  query: "langchain rag multi-agent aws"
  role_type: "ai_engineer"
  limit: 3
```

**Returns:** Top 3 most relevant projects based on keyword matching

**Example output:**
```json
[
  {
    "name": "GridCOP: Smart Grid Analytics Agent",
    "technologies": ["LangChain", "MCP", "AWS", "RAG", "FAISS"],
    "score": 12
  },
  {
    "name": "Drone Log Analysis Tool",
    "technologies": ["RAG", "Ollama", "Python", "React"],
    "score": 8
  },
  {
    "name": "PX4 Flight Control Systems",
    "technologies": ["C++", "Python", "Real-time systems"],
    "score": 4
  }
]
```

**Token savings:** ~1,500 tokens (vs loading all 15+ projects)

#### Step 4: (Optional) Get Pattern-Based Recommendations

```
Use get_learned_patterns tool with:
  role_type: "ai_engineer"
```

**Returns:** Projects and skills you've used most often for this role type

**Example output:**
```json
{
  "roleType": "ai_engineer",
  "totalApplications": 5,
  "topProjects": [
    {"project": "gridcop", "count": 5, "percentage": "100%"},
    {"project": "drone-log-analyzer", "count": 4, "percentage": "80%"}
  ],
  "topSkills": [
    {"skill": "LangChain", "count": 5, "percentage": "100%"},
    {"skill": "RAG", "count": 5, "percentage": "100%"},
    {"skill": "Python", "count": 5, "percentage": "100%"}
  ]
}
```

**Note:** Only works after you've tracked 3+ applications.

#### Step 5: Generate Resume

Use the profile summary + selected projects to generate your resume with the resume-generator MCP tool.

**Context used:**
- Profile summary: 200 tokens
- Selected projects (3): ~1,500 tokens
- Job requirements: ~500 tokens
- Template & formatting: ~5,300 tokens
- **Total: ~7,500 tokens** (vs 30,000 tokens with old method)

#### Step 6: Track Application

```
Use track_application tool with:
  company: "Anthropic"
  role: "AI Engineer"
  role_type: "ai_engineer"
  projects_selected: ["gridcop", "drone-log-analyzer", "flight-control"]
  skills_highlighted: ["LangChain", "RAG", "Python", "AWS", "Multi-agent"]
  resume_path: "/path/to/generated-resumes/anthropic-ai-engineer/resume.pdf"
  tokens_used: 7500
  cost_usd: 0.09
```

**What this does:**
- Logs application to database
- Enables pattern learning for future recommendations
- Tracks token usage and costs
- Can query application history later

---

## Common Scenarios

### Scenario 1: Applying to 5 Similar AI Engineer Jobs

**Goal:** Apply to 5 AI Engineer jobs with similar requirements

**Workflow:**

```
# First job (new)
1. check_resume_similarity → Not found
2. get_profile_summary → 200 tokens
3. query_knowledge_graph("langchain rag", "ai_engineer") → 3 projects
4. Generate resume → 7,500 tokens
5. track_application → Logged

# Jobs 2-5 (similar)
1. check_resume_similarity → FOUND! (similarity: 92%)
2. Reuse existing resume → 0 tokens
3. track_application (with resume_reused: true) → Logged
```

**Token usage:**
- Job 1: 7,500 tokens
- Jobs 2-5: 0 tokens each
- **Total: 7,500 tokens** (vs 150,000 tokens old method)

**Savings:** 95% token reduction

### Scenario 2: Switching Role Types

**Goal:** Apply to a Robotics Engineer role after applying to AI Engineer roles

**Workflow:**

```
1. check_resume_similarity("Boston Dynamics", "Robotics Engineer", "ROS2, C++, embedded")
   → Not similar (different role type)

2. query_knowledge_graph("ros2 c++ embedded real-time", "robotics_engineer")
   → Returns: flight-control, welding-hmi, lumenier-lidar

3. Generate resume with robotics-focused projects
4. track_application(role_type: "robotics_engineer")
```

**Why this works:**
- Knowledge graph filters by `role_type`
- Returns projects relevant to robotics
- Pattern learning tracks separately by role type

### Scenario 3: Batch Application to 10 Jobs

**Goal:** Apply to 10 jobs in one session

**Workflow:**

```
# Efficient batch processing:

For each job:
  1. check_resume_similarity
     → If similar: Use existing resume (0 tokens)
     → If not similar:
        a. get_profile_summary (only once, cache result)
        b. query_knowledge_graph (varies by job)
        c. Generate resume
  2. track_application

# Expected distribution (based on past data):
# - 2 unique resumes (15k tokens)
# - 8 reused resumes (0 tokens)
# Total: 15k tokens vs 300k tokens old method
```

**Savings:** 95% token reduction + 90% time savings

### Scenario 4: Monthly Job Search

**Goal:** Apply to recommended jobs every week for a month

**Week 1:**
```
# Monday: Apply to 5 AI Engineer jobs
# Token usage: 7.5k (1 new) + 0 (4 reused) = 7.5k
track_application for all 5
```

**Week 2:**
```
# Monday: Apply to 5 more AI Engineer jobs
# get_learned_patterns shows: GridCOP used 80%, Drone Log 60%
# Use those 2 projects + 1 new relevant project
# Token usage: 0 (all 5 reused from week 1)
```

**Week 3-4:**
```
# Continue pattern: Most jobs similar to previous applications
# Reuse rate: 90%+
# Total month: ~15k tokens vs 600k tokens old method
```

**Savings:** 97.5% token reduction over the month

---

## Tips & Best Practices

### 1. Initialize Profile First
Always run `save_profile` before generating any resumes. This is a one-time setup that enables all optimizations.

### 2. Use Similarity Checking
Always check similarity first. It's free (local processing) and can save 100% of tokens if a similar resume exists.

### 3. Track Every Application
Always use `track_application` after generating a resume. This:
- Enables pattern learning
- Tracks costs and usage
- Helps you analyze application success rates later

### 4. Use Role Type Filtering
When querying the knowledge graph or getting patterns, always specify `role_type`:
- `"ai_engineer"` - AI/ML roles
- `"full_stack_engineer"` - Full-stack development
- `"robotics_engineer"` - Robotics/embedded systems
- `"ml_engineer"` - ML engineering
- `"systems_engineer"` - Systems/infrastructure

This ensures you get role-appropriate project recommendations.

### 5. Customize Keywords per Job
When using `query_knowledge_graph`, extract keywords from the job posting:
- Look for technologies mentioned (LangChain, RAG, AWS, etc.)
- Look for concepts (multi-agent, real-time, embedded, etc.)
- Pass as query string: `"langchain rag multi-agent aws"`

### 6. Start Similarity API When Batch Applying
If applying to multiple jobs in one session, start the txtai API first:
```bash
cd semantic-search-api && venv/bin/python similarity_checker.py
```

This enables zero-token reuse for similar jobs.

### 7. Review Pattern Recommendations
After 5+ applications, check `get_learned_patterns` to see what's working:
- Which projects you use most often
- Which skills you highlight most
- Helps you optimize future applications

### 8. Keep Database Backed Up
Your application history is valuable data. Periodically backup:
```bash
cp /home/virus/Documents/repo/resume-memory-mcp/data/resume-memory.db ~/backups/
```

---

## FAQ

### Q: Do I need to restart Claude Code every time?
**A:** No, only when:
- First time setting up
- After updating MCP server code
- If tools stop working

### Q: What if similarity API isn't running?
**A:** No problem! The `check_resume_similarity` tool will gracefully fall back to generating a new resume. You just won't get zero-token reuse.

### Q: How do I know if my profile is saved?
**A:** Run `get_profile_summary` - if it returns your compressed profile, you're good.

### Q: Can I update my profile later?
**A:** Yes! Just run `save_profile` again with updated profile context. It will overwrite the existing one.

### Q: What if I want to regenerate a resume for a similar job?
**A:** Just skip the `check_resume_similarity` step and proceed directly to `get_profile_summary`.

### Q: How do I add new projects to the knowledge graph?
**A:** Edit `/home/virus/Documents/repo/resume-memory-mcp/data/knowledge-graph.json` and add your new project with technologies and role_fit. Restart Claude Code to reload.

### Q: What if get_learned_patterns returns empty?
**A:** This means you haven't tracked enough applications yet. Need at least 1 application tracked. After 3-5 applications, you'll get meaningful recommendations.

### Q: Can I use this for cover letters too?
**A:** Absolutely! The same optimization principles apply:
- Use `get_profile_summary` for compressed profile
- Use `query_knowledge_graph` to find relevant projects
- Check similarity for previous cover letters

### Q: How do I track token usage over time?
**A:** Query the database:
```sql
SELECT
  SUM(tokens_used) as total_tokens,
  COUNT(*) as applications,
  SUM(cost_usd) as total_cost
FROM applications
WHERE application_date >= date('now', '-30 days');
```

Or ask Claude to query the application history for you.

### Q: What's the difference between `query_knowledge_graph` and `get_learned_patterns`?
**A:**
- `query_knowledge_graph`: Finds projects based on keyword matching (uses all projects)
- `get_learned_patterns`: Recommends projects based on your past application history (uses only what you've applied with)

Use knowledge graph for new job searches, patterns for repeat applications.

---

## Next Steps

- **Understand the System:** Read [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)
- **Tool Reference:** See [TOOLS_REFERENCE.md](TOOLS_REFERENCE.md) for detailed tool documentation
- **LinkedIn Integration:** Add automated job search with [LINKEDIN_INTEGRATION.md](LINKEDIN_INTEGRATION.md)
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

---

**Happy optimized resume generating!** 🚀

**Savings so far:** Track your savings and watch them grow!
