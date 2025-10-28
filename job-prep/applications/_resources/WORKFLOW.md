# Resume Generation Workflow - Complete Guide

**Purpose:** Generate tailored, professional resumes consistently using Claude Code + MCP resume generator
**Audience:** Anyone using this system (Viresh or others with similar setup)
**Time per application:** 20-30 minutes with review

---

## 🎯 System Overview

This system generates customized resumes using:
1. **Baseline resume** - Proven format to start from
2. **Scratchpad review** - Human-in-the-loop approval before PDF
3. **Format standards** - Consistent structure across all resumes
4. **MCP tool** - Professional LaTeX PDF generation

**Key Principle:** Start from what works (baseline), customize for job, review before finalizing, generate PDF only after approval.

---

## 📂 File Structure

```
job-prep/applications/
├── _resources/
│   ├── baseline-resume-data.json          ← Proven format (start here)
│   ├── FORMAT-STANDARDS.md                ← Rules to follow
│   ├── resume-scratchpad-template.md      ← Review template
│   ├── WORKFLOW.md                        ← This file
│   ├── Viresh-Duvvuri-Master-Resume.md    ← Full content bank
│   ├── resume-customization-guide.md      ← Strategy guide
│   └── networking-templates.md            ← LinkedIn messages
│
├── _template/
│   ├── job-posting.md                     ← Job details template
│   └── resume-data.json                   ← Resume template
│
├── {company-role}/                        ← Individual applications
│   ├── job-posting.md                     ← Job requirements & notes
│   ├── resume-scratchpad.md               ← Review draft (generated)
│   ├── resume-data.json                   ← Final JSON (generated)
│   └── resume.pdf                         ← Generated PDF
│
└── _archive/                              ← Completed applications
    └── {company-role}/
```

---

## 🚀 Quick Start (Using /apply Command)

### Prerequisites
1. Claude Code installed and running
2. Resume generator MCP tool configured
3. Baseline resume exists: `_resources/baseline-resume-data.json`

### Usage

```bash
# In Claude Code, run:
/apply

# Then paste the job description when prompted
```

That's it! The workflow handles everything else.

---

## 📋 Detailed Workflow Steps

### Step 1: Job Analysis (Automated)

When you run `/apply` and provide a job description, Claude:

1. **Analyzes requirements**
   - Extracts required vs. preferred skills
   - Identifies keywords and buzzwords
   - Assesses company culture signals

2. **Evaluates your fit**
   - ✅ Skills you have
   - ❌ Skills you're missing
   - 🟡 Skills you can emphasize
   - Honest fit percentage (60-95%)

3. **Makes recommendation**
   - Apply now (70%+ match)
   - Build skills first (50-70% match)
   - Skip (<50% match)

**Output:** Job analysis summary with fit assessment

---

### Step 2: Scratchpad Generation (Automated)

Claude generates a **readable markdown scratchpad** and **saves it to a file**:

**File location:** `job-prep/applications/{company-role}/resume-scratchpad.md`

**What's in the scratchpad:**
- Summary changes (before → after)
- Skills reordering (to match job priorities)
- Work experience modifications (which bullets to emphasize)
- Project selection (which 3 projects + rationale)
- All keyword additions

**Example scratchpad structure:**
```markdown
# Resume Customization Scratchpad
Company: Acme Corp | Role: Senior AI Engineer | Fit: 85%

## Summary Changes
CURRENT: AI Engineer specializing in...
PROPOSED: Senior AI Engineer specializing in... [Added "Senior", emphasized LangChain]

## Skills Reordering
Moving to top: LangChain, Multi-Agent Systems, Azure

## Work Experience
Grid CoOperator - Bullet 2: Adding "Azure" keyword
Freefly - Emphasizing "cross-functional collaboration"

## Projects Selected
1. GridCOP (matches multi-agent requirement)
2. Production System Tool (shows production AI)
3. AI Travel Planner (shows LLM breadth)

---
APPROVE to generate PDF? (yes/no/modify)
```

**Key improvement:** The scratchpad is a file you can edit directly in your editor!

---

### Step 3: Review & Approval (Human Decision) ⏸️

**You review the scratchpad file and decide:**

**Option A: Edit File Directly (Recommended)**
```
1. Open: job-prep/applications/{company-role}/resume-scratchpad.md
2. Make your changes in your editor
3. Save the file
4. Tell Claude: "approve"
→ Claude reads your edited file → Generates JSON → Calls MCP tool → PDF created
```

**Option B: Ask Claude to Modify**
```
You: "modify - add more emphasis on Azure in work bullets"
→ Claude updates scratchpad file → Notifies you → Wait for approval
```

**Option C: Approve As-Is**
```
You: "approve"
→ Claude reads scratchpad file → Generates JSON → Calls MCP tool → PDF created
```

**Option D: Reject**
```
You: "reject"
→ Workflow stops, no PDF generated
```

**Key benefit:** You can edit the scratchpad file directly without going back-and-forth with Claude!

---

### Step 4: JSON Generation (Automated, After Approval)

Once approved, Claude:
1. Loads `baseline-resume-data.json`
2. Applies all customizations from scratchpad
3. Verifies format standards:
   - [ ] Work: 3-3-3-2 bullet pattern
   - [ ] Projects: 3 projects, 3 bullets each (Problem/Solution/Impact)
   - [ ] Skills: 4 categories
   - [ ] Education: Both degrees
4. Saves as `{company-role}/resume-data.json`

---

### Step 5: PDF Generation (Automated)

Claude calls MCP resume generator tool:
```json
{
  "resumeData": { ...approved JSON... },
  "filename": "viresh-duvvuri-acme-senior-ai-engineer",
  "folderPath": "applications/acme-senior-ai-engineer"
}
```

**Output:** Professional LaTeX PDF saved to:
`/home/virus/Documents/generated-resumes/applications/{company-role}/resume.pdf`

---

### Step 6: Confirmation (Automated)

Claude provides:
- ✅ Success message
- Fit summary (85% match, etc.)
- Key tailoring points (what was customized)
- File location (full path to PDF)
- Next steps (application strategy, networking)

---

## 🎨 Format Standards (Critical)

**All resumes MUST follow this format:**

### Work Experience
- **Grid CoOperator:** 3 bullets
- **Freefly Systems (Senior):** 3 bullets
- **Lumenier:** 3 bullets
- **York Exponential:** 2 bullets

**Total:** 11 bullets (3-3-3-2 pattern)

### Projects
- **Count:** 3 projects (can do 4 if highly relevant)
- **Structure:** Each project has exactly 3 bullets:
  1. "Problem: [description]"
  2. "Solution: [technologies and approach]"
  3. "Impact: [quantified results]"

### Skills
- **Categories:** 4 categories
  1. Programming
  2. AI/ML Frameworks
  3. Cloud & Infrastructure
  4. Data & Analytics (or role-specific)
- **Keywords:** Comprehensive lists (15-25 per AI/ML category)

### Summary
- **Format:** 3-sentence paragraph
- **Pattern:**
  1. Role + specialization + years + approach
  2. Leadership + impact metrics + technologies
  3. Additional depth/breadth

**See `FORMAT-STANDARDS.md` for complete details**

---

## ✅ What Gets Customized (Per Job)

### Always Customize:
1. **Summary** - Change role title, reorder technologies
2. **Skills order** - Prioritize their requirements
3. **Work bullets** - Emphasize relevant experience, add keywords
4. **Project selection** - Choose 3 most relevant

### Never Change:
1. ❌ Employment dates
2. ❌ Job titles at companies
3. ❌ Company names
4. ❌ Core metrics (70%, 80%, 200+ queries)
5. ❌ Bullet count structure

---

## 🎯 Customization Strategy

### For AI Engineer Roles:
- Lead with: "AI Engineer specializing in multi-agent systems..."
- Skills order: AI/ML first, then Programming
- Projects: GridCOP, Production System Tool, AI Travel Planner
- Emphasize: LangChain, multi-agent systems, production AI

### For Software Engineer Roles:
- Lead with: "Software Engineer with AI expertise..."
- Skills order: Programming first, then AI/ML
- Projects: Emphasize full-stack, backend architecture
- Emphasize: FastAPI, React, microservices, production systems

### For Robotics Roles:
- Lead with: "Robotics Software Engineer with AI integration..."
- Skills order: Embedded/Robotics first, then Programming
- Projects: Flight Control, HMI, then AI projects
- Emphasize: C++, PX4, ROS2, real-time systems

**See `resume-customization-guide.md` for detailed strategies**

---

## 📊 Success Metrics

**After implementation, you should see:**

- **Time per application:** 20-30 minutes (down from 1-2 hours)
- **Format consistency:** 100% (all follow baseline structure)
- **Review before PDF:** 100% (human approval required)
- **Starting point:** Baseline (not empty template)

**Quality indicators:**
- All resumes have 3-3-3-2 work bullet pattern
- All projects use Problem-Solution-Impact format
- No made-up content (everything verifiable)
- Keywords match job requirements

---

## 🔧 Troubleshooting

### Problem: Baseline resume not found
**Solution:** Check file exists at: `job-prep/applications/_resources/baseline-resume-data.json`

### Problem: MCP tool not generating PDF
**Solution:**
1. Check MCP server is running
2. Claude will provide JSON for manual generation
3. Copy JSON and use alternative PDF generation method

### Problem: Scratchpad skipped, went straight to PDF
**Solution:** This shouldn't happen with new workflow. If it does:
1. Check `/apply` command updated correctly
2. Remind Claude: "Generate scratchpad for review first, don't generate PDF yet"

### Problem: Format inconsistencies (wrong bullet counts)
**Solution:**
1. Check baseline hasn't been corrupted
2. Review `FORMAT-STANDARDS.md`
3. Remind Claude to follow 3-3-3-2 pattern

---

## 🎓 Tips & Best Practices

### 1. Always Review the Scratchpad
- Don't blindly approve
- Check keyword additions make sense
- Verify project selection is optimal
- Request changes if needed

### 2. Maintain the Baseline
- Update baseline when you improve wording
- Keep metrics accurate (70%, 80%, etc.)
- Don't let it drift from reality

### 3. Track What Works
- Note which customizations led to interviews
- Update strategy guides with learnings
- Refine baseline based on success patterns

### 4. Use the Archive
- Move completed applications to `_archive/`
- Keep as reference for similar roles
- Learn from successful applications

### 5. Network After Applying
- Within 24 hours: Connect with 2-3 employees on LinkedIn
- Use templates from `networking-templates.md`
- Follow up after 5-7 days if no response

---

## 📝 Example Session

```
You: /apply

Claude: "Please provide the job description"

You: [Pastes job description for "Senior AI Engineer at Acme Corp"]

Claude:
"Analyzing job for Senior AI Engineer at Acme Corp...

Required Skills:
✅ Python - HAVE (5+ years)
✅ LangChain - HAVE (GridCOP project)
✅ Multi-Agent Systems - HAVE (GridCOP)
🟡 Azure - Can emphasize (have AWS experience)
❌ Kubernetes - Not emphasized, can add

Fit: 85% - Strong match!

Generating scratchpad for review..."

[Shows detailed scratchpad with proposed changes]

"Review the proposed customizations. Reply 'approve' to generate PDF"

You: "approve"

Claude:
"✅ Resume generated successfully!

**Fit:** 85% match for Senior AI Engineer at Acme Corp

**Key Tailoring:**
1. Updated title to 'Senior AI Engineer'
2. Emphasized LangChain and Multi-Agent Systems
3. Added Azure keywords to work bullets
4. Selected projects demonstrating relevant skills

**File:** /home/virus/Documents/generated-resumes/applications/acme-senior-ai-engineer/viresh-duvvuri-acme-senior-ai-engineer-2025-10-27.pdf

Ready to apply!"
```

---

## 🌟 Benefits of This System

**Consistency:**
- ✅ Same proven format every time
- ✅ No format drift or errors
- ✅ Professional polish maintained

**Quality:**
- ✅ Human review before finalizing
- ✅ Catch errors early
- ✅ Iterate until satisfied

**Speed:**
- ✅ Start from baseline (not scratch)
- ✅ Automated customization
- ✅ 20-minute applications

**Learning:**
- ✅ Track what works
- ✅ Improve over time
- ✅ Build expertise

---

## 🔄 Iterative Improvement

This system is designed to evolve:

**Weekly:**
- Review successful applications
- Update baseline with better wording
- Refine customization strategies

**Monthly:**
- Analyze callback rates
- Update skills based on market
- Add new projects to portfolio

**Quarterly:**
- Major baseline refresh
- Update format standards if needed
- Review and archive old applications

---

## 📚 Additional Resources

**In this directory:**
- `FORMAT-STANDARDS.md` - Detailed format rules
- `resume-customization-guide.md` - Role-specific strategies
- `networking-templates.md` - LinkedIn outreach
- `application-workflow.md` - Complete application process

**Commands:**
- `/apply` - Generate resume (this workflow)
- `/profile` - Load background context

---

## ✨ Final Notes

**This system prioritizes:**
1. **Quality** - Human review prevents errors
2. **Consistency** - Same format, professional results
3. **Speed** - Fast customization from baseline
4. **Learning** - Improve with each application

**Remember:**
- Always start from baseline
- Always review scratchpad before approving
- Always follow format standards
- Never skip the review step

**The goal:** Get interview calls through tailored, professional resumes generated consistently and quickly.

---

**Questions or issues?** Check troubleshooting section or review example session above.
