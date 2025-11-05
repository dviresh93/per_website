# LinkedIn MCP Server Integration Guide

**Date:** 2025-11-05
**LinkedIn MCP:** https://github.com/dviresh93/linkedin-mcp-server

---

## Overview

The LinkedIn MCP server is a **perfect companion** to your resume optimization system. It automates the job research phase and feeds directly into your resume generation workflow.

### What It Does
- **Scrapes LinkedIn profiles** (candidates, connections)
- **Analyzes companies** (size, industry, culture)
- **Searches jobs** (keywords, location, filters)
- **Fetches job details** (requirements, responsibilities, metadata)
- **Gets recommended jobs** (personalized to your profile)

### How It Integrates
Instead of manually copying job postings, the LinkedIn MCP server can:
1. **Search for jobs** matching your criteria
2. **Extract full job details** automatically
3. **Feed into your resume generation workflow**
4. **Track applications** with complete job metadata

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Claude Code (Job Application Workflow)                     │
└────┬──────────────────────────────────────┬─────────────────┘
     │                                      │
     │ (1) Search & Extract                 │ (2) Generate & Track
     ▼                                      ▼
┌─────────────────────┐          ┌──────────────────────────┐
│  LinkedIn MCP       │          │  Resume Memory MCP       │
│                     │          │                          │
│  - search_jobs      │          │  - check_similarity      │
│  - get_job_details  │          │  - get_profile_summary   │
│  - get_company_info │          │  - query_knowledge_graph │
│                     │          │  - track_application     │
└─────────────────────┘          └──────────────────────────┘
```

**Workflow:**
1. **LinkedIn MCP** searches and extracts job posting details
2. **Resume Memory MCP** checks similarity, generates optimized resume
3. **Both MCPs together** = Fully automated job application workflow

---

## Installation

### Option 1: Docker (Recommended)

**Quick start:**
```bash
docker run -e LINKEDIN_COOKIE="your_li_at_cookie" \
  ghcr.io/dviresh93/linkedin-mcp-server:latest
```

**Get LinkedIn cookie automatically:**
```bash
docker run --rm -it \
  ghcr.io/dviresh93/linkedin-mcp-server:latest \
  --get-cookie
```

### Option 2: uvx (Python Universal Virtual Environment)

```bash
uvx linkedin-mcp-server
```

### Option 3: Add to Claude Code Config

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "linkedin": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "LINKEDIN_COOKIE=your_li_at_cookie_here",
        "ghcr.io/dviresh93/linkedin-mcp-server:latest"
      ]
    },
    "resume-memory": {
      "type": "stdio",
      "command": "node",
      "args": ["/home/virus/Documents/repo/resume-memory-mcp/server.js"],
      "env": {}
    }
  }
}
```

**Or using uvx:**
```json
{
  "mcpServers": {
    "linkedin": {
      "command": "uvx",
      "args": ["linkedin-mcp-server"],
      "env": {
        "LINKEDIN_COOKIE": "your_li_at_cookie_here"
      }
    }
  }
}
```

---

## LinkedIn Cookie Setup

### Step 1: Get Your Cookie

**Option A: Automatic (Docker)**
```bash
docker run --rm -it ghcr.io/dviresh93/linkedin-mcp-server:latest --get-cookie
```

**Option B: Manual (Chrome DevTools)**
1. Go to linkedin.com (logged in)
2. Open DevTools (F12)
3. Go to Application → Cookies → linkedin.com
4. Copy the value of `li_at` cookie

### Step 2: Store Cookie Securely

**Option A: Environment Variable**
```bash
export LINKEDIN_COOKIE="your_li_at_cookie_here"
```

**Option B: Add to Claude Config** (see above)

**Security Note:** Keep your cookie private! It's equivalent to your LinkedIn password.

**Cookie Expiration:** Cookies expire in ~30 days. You'll need to refresh periodically.

---

## Available Tools

### 1. `search_jobs`
**Purpose:** Find jobs matching your criteria

**Input:**
```json
{
  "keywords": "AI Engineer",
  "location": "Remote",
  "filters": {
    "experience_level": ["Entry level", "Associate", "Mid-Senior level"],
    "job_type": ["Full-time"],
    "remote": true
  }
}
```

**Output:**
```json
[
  {
    "job_id": "3785692341",
    "title": "AI Engineer",
    "company": "Anthropic",
    "location": "Remote",
    "posted_date": "2 days ago",
    "job_url": "https://www.linkedin.com/jobs/view/3785692341"
  }
]
```

### 2. `get_job_details`
**Purpose:** Extract full job posting details

**Input:**
```json
{
  "job_id": "3785692341"
}
```

**Output:**
```json
{
  "title": "AI Engineer",
  "company": "Anthropic",
  "location": "Remote",
  "description": "We're looking for an AI Engineer to build...",
  "requirements": [
    "3+ years Python experience",
    "LangChain, RAG, multi-agent systems",
    "AWS, Docker, CI/CD"
  ],
  "responsibilities": [...],
  "benefits": [...],
  "posted_date": "2025-11-03",
  "application_url": "https://..."
}
```

### 3. `get_company_profile`
**Purpose:** Research company before applying

**Input:**
```json
{
  "company_url": "https://www.linkedin.com/company/anthropic"
}
```

**Output:**
```json
{
  "name": "Anthropic",
  "industry": "AI Research",
  "size": "201-500 employees",
  "headquarters": "San Francisco, CA",
  "description": "...",
  "website": "https://anthropic.com"
}
```

### 4. `get_recommended_jobs`
**Purpose:** Get personalized job recommendations

**Input:**
```json
{
  "limit": 10
}
```

**Output:** List of recommended jobs based on your LinkedIn profile

### 5. `get_person_profile`
**Purpose:** Research hiring managers or connections

**Input:**
```json
{
  "profile_url": "https://www.linkedin.com/in/someone"
}
```

**Output:** Full profile data (work history, education, skills)

### 6. `close_session`
**Purpose:** Clean up browser resources

**Input:** None
**Output:** Session closed confirmation

---

## Integrated Workflow

### Fully Automated Job Application Process

**Step 1: Search for Jobs**
```
Use LinkedIn MCP search_jobs with:
  keywords: "AI Engineer"
  location: "Remote"
  filters: { job_type: ["Full-time"], remote: true }
```

**Step 2: Extract Job Details**
```
For each job from search results:
  Use LinkedIn MCP get_job_details with job_id

  Returns:
  - Full job description
  - Requirements list
  - Company info
  - Application URL
```

**Step 3: Check Resume Similarity**
```
Use Resume Memory MCP check_resume_similarity with:
  company: "Anthropic"
  role: "AI Engineer"
  requirements: [extracted from job details]

  If similar (>85%) → Reuse existing resume (0 tokens!)
  If not similar → Continue to Step 4
```

**Step 4: Generate Optimized Resume**
```
a. Use Resume Memory MCP get_profile_summary
   → Returns 200-token compressed profile

b. Use Resume Memory MCP query_knowledge_graph with:
   query: [keywords from job requirements]
   role_type: "ai_engineer"
   → Returns top 3 relevant projects

c. Generate resume with optimized context (7.5k tokens vs 30k)
```

**Step 5: Track Application**
```
Use Resume Memory MCP track_application with:
  company: "Anthropic"
  role: "AI Engineer"
  role_type: "ai_engineer"
  projects_selected: ["gridcop", "drone-log-analyzer"]
  skills_highlighted: ["LangChain", "RAG", "Python"]
  resume_path: "/path/to/resume.pdf"
  tokens_used: 7500
  cost_usd: 0.09

  Enables pattern learning for future applications
```

**Step 6: Apply**
```
Use application_url from job details to apply manually
(or integrate with application automation in future)
```

---

## Use Cases

### Use Case 1: Mass Job Search & Application
**Scenario:** Apply to 10 AI Engineer jobs in one session

**Workflow:**
1. Search for "AI Engineer" jobs (LinkedIn MCP)
2. Extract details for all 10 jobs (LinkedIn MCP)
3. Check similarity for each (Resume Memory MCP)
   - 3 similar → Reuse resumes (0 tokens!)
   - 7 new → Generate optimized resumes (7.5k tokens each)
4. Track all applications (Resume Memory MCP)

**Token savings:**
- Old method: 10 × 30k = 300k tokens ($3.00)
- New method: 7 × 7.5k = 52.5k tokens ($0.52)
- **Savings: 82% ($2.48)**

### Use Case 2: Research Before Applying
**Scenario:** Research company culture and hiring manager

**Workflow:**
1. Get company profile (LinkedIn MCP)
   - Company size, industry, culture
2. Get hiring manager profile (LinkedIn MCP)
   - Background, interests, projects
3. Customize resume based on research
4. Generate targeted resume (Resume Memory MCP)

**Benefits:**
- Better targeting (mention company values, manager's interests)
- Higher response rate
- More personalized applications

### Use Case 3: Track Recommended Jobs
**Scenario:** Monitor LinkedIn recommendations daily

**Workflow:**
1. Get recommended jobs (LinkedIn MCP)
2. Filter by criteria (role type, location, company)
3. Check similarity to past applications (Resume Memory MCP)
4. Apply only to truly new opportunities

**Benefits:**
- No duplicate applications
- Automated monitoring
- Smart filtering

---

## Enhanced Application Tracker

With LinkedIn integration, you can track more data:

### Enhanced Database Schema

Add to `resume-memory-mcp/lib/database.js`:

```sql
-- Enhanced applications table
ALTER TABLE applications ADD COLUMN linkedin_job_id TEXT;
ALTER TABLE applications ADD COLUMN job_url TEXT;
ALTER TABLE applications ADD COLUMN company_size TEXT;
ALTER TABLE applications ADD COLUMN company_industry TEXT;
ALTER TABLE applications ADD COLUMN posted_date TEXT;
ALTER TABLE applications ADD COLUMN application_deadline TEXT;
ALTER TABLE applications ADD COLUMN hiring_manager_url TEXT;
```

### Enhanced `track_application` Tool

Update tool to accept LinkedIn data:

```javascript
{
  company: "Anthropic",
  role: "AI Engineer",
  linkedin_job_id: "3785692341",
  job_url: "https://www.linkedin.com/jobs/view/3785692341",
  company_size: "201-500 employees",
  company_industry: "AI Research",
  posted_date: "2025-11-03",
  // ... existing fields
}
```

---

## Configuration Examples

### Config for Both MCP Servers (Docker)

```json
{
  "projects": {
    "/home/virus/Documents/repo/per_wesite": {
      "mcpServers": {
        "linkedin": {
          "command": "docker",
          "args": [
            "run",
            "-i",
            "--rm",
            "-e",
            "LINKEDIN_COOKIE=YOUR_COOKIE_HERE",
            "ghcr.io/dviresh93/linkedin-mcp-server:latest"
          ]
        },
        "resume-memory": {
          "type": "stdio",
          "command": "node",
          "args": [
            "/home/virus/Documents/repo/resume-memory-mcp/server.js"
          ],
          "env": {}
        },
        "resume-generator": {
          "type": "stdio",
          "command": "node",
          "args": [
            "/home/virus/Documents/repo/resumake-mcp/server.js"
          ],
          "env": {}
        }
      }
    }
  }
}
```

### Config for Both MCP Servers (uvx)

```json
{
  "projects": {
    "/home/virus/Documents/repo/per_wesite": {
      "mcpServers": {
        "linkedin": {
          "command": "uvx",
          "args": ["linkedin-mcp-server"],
          "env": {
            "LINKEDIN_COOKIE": "YOUR_COOKIE_HERE"
          }
        },
        "resume-memory": {
          "type": "stdio",
          "command": "node",
          "args": [
            "/home/virus/Documents/repo/resume-memory-mcp/server.js"
          ],
          "env": {}
        }
      }
    }
  }
}
```

---

## Benefits of Integration

### 1. **Automation**
- No more manual job posting copy/paste
- Automated job search and extraction
- Batch processing of multiple jobs

### 2. **Data Quality**
- Structured job data (requirements, responsibilities, benefits)
- Complete company information
- LinkedIn job IDs for tracking

### 3. **Smart Filtering**
- Search by keywords, location, experience level
- Filter by job type (full-time, contract, etc.)
- Remote work filtering

### 4. **Better Tracking**
- Track LinkedIn job IDs
- Monitor application status
- Analyze which jobs you applied to

### 5. **Research Integration**
- Company research before applying
- Hiring manager research
- Industry and company size data

---

## Implementation Steps

### Phase 1: Setup LinkedIn MCP (30 minutes)

1. **Get LinkedIn cookie:**
   ```bash
   docker run --rm -it ghcr.io/dviresh93/linkedin-mcp-server:latest --get-cookie
   ```

2. **Test LinkedIn MCP:**
   ```bash
   docker run -e LINKEDIN_COOKIE="your_cookie" \
     ghcr.io/dviresh93/linkedin-mcp-server:latest
   ```

3. **Add to `.claude.json`** (see config examples above)

4. **Restart Claude Code**

5. **Verify tools loaded:**
   - search_jobs
   - get_job_details
   - get_company_profile
   - get_recommended_jobs
   - get_person_profile
   - close_session

### Phase 2: Test Integration (30 minutes)

1. **Test job search:**
   ```
   Use search_jobs to find "AI Engineer" jobs in "Remote"
   ```

2. **Test job extraction:**
   ```
   Use get_job_details with a job_id from search results
   ```

3. **Test resume generation:**
   ```
   a. Use check_resume_similarity with job details
   b. Use get_profile_summary
   c. Use query_knowledge_graph with job requirements
   d. Generate resume
   e. Use track_application with LinkedIn job data
   ```

### Phase 3: Enhance Database (1 hour)

1. **Update database schema** (add LinkedIn fields)
2. **Update `track_application` tool** (accept LinkedIn data)
3. **Test enhanced tracking**

### Phase 4: Create Workflow Automation (2 hours)

1. **Create slash command:** `/apply-to-jobs`
2. **Workflow:**
   - Search jobs
   - Filter by criteria
   - Check similarity for each
   - Generate/reuse resumes
   - Track applications
   - Export application list

---

## Troubleshooting

### LinkedIn Cookie Expired
**Symptom:** "Authentication failed" errors

**Solution:**
```bash
# Get new cookie
docker run --rm -it ghcr.io/dviresh93/linkedin-mcp-server:latest --get-cookie

# Update in .claude.json
# Restart Claude Code
```

### Docker Not Running
**Symptom:** "Cannot connect to Docker daemon"

**Solution:**
```bash
# Start Docker
sudo systemctl start docker

# Or use uvx method instead
uvx linkedin-mcp-server
```

### Rate Limiting
**Symptom:** "Too many requests" errors

**Solution:**
- Add delays between requests
- Use `--lazy-init` flag to reduce startup requests
- Rotate cookies if needed

### Session Not Closing
**Symptom:** Browser processes accumulating

**Solution:**
```
Use close_session tool after each workflow
```

---

## Future Enhancements

### 1. Auto-Apply Integration
- Integrate with LinkedIn Easy Apply
- Auto-fill application forms
- Submit applications programmatically

### 2. Application Status Tracking
- Monitor application status on LinkedIn
- Track when recruiters view profile
- Alert on interview invitations

### 3. Network Analysis
- Track connections at target companies
- Identify referral opportunities
- Suggest networking outreach

### 4. Smart Job Matching
- Score jobs by fit (skills, experience, interests)
- Rank by priority
- Recommend which jobs to apply to first

---

## Cost Impact

### With LinkedIn Integration:

**Scenario: Apply to 20 jobs in one week**

**Without LinkedIn MCP:**
- Manual job search: 2 hours
- Manual data entry: 1 hour
- Resume generation: 20 × 30k = 600k tokens ($6.00)
- **Total cost: $6.00 + 3 hours of time**

**With LinkedIn + Resume Memory MCP:**
- Automated job search: 5 minutes
- Automated data extraction: 5 minutes
- Resume generation: 5 × 7.5k = 37.5k tokens ($0.37)
- Resume reuse: 15 × 0 tokens ($0.00)
- **Total cost: $0.37 + 10 minutes of time**

**Savings:**
- Token cost: $5.63 (94% reduction)
- Time saved: 2h 50min (94% reduction)

---

## Summary

The LinkedIn MCP server is a **perfect complement** to your resume optimization system:

**LinkedIn MCP:** Automates job search and data extraction
**Resume Memory MCP:** Optimizes resume generation and tracks applications
**Together:** Fully automated, token-efficient job application workflow

**Next Steps:**
1. Get LinkedIn cookie
2. Add to `.claude.json`
3. Restart Claude Code
4. Test integrated workflow
5. Start applying to jobs with 94% less cost and time!

---

**Ready to integrate!** 🚀

See the configuration examples above to add LinkedIn MCP to your setup.
