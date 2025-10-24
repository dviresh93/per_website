# Job Applications Tracker

**Last Updated:** 2025-10-24
**Active Applications:** 1
**Total Applied:** 5

---

## Active Applications

| Company | Role | Status | Applied | Fit | Next Action |
|---------|------|--------|---------|-----|-------------|
| Azumo | AI Software Engineer | Applied | 2025-10-24 | 80% | Network follow-up (within 24h) |

---

## Application Status Workflow

Applications progress through these stages:

1. **researching** - Evaluating fit, assessing requirements
2. **applied** - Resume submitted, waiting for response
3. **screening** - Recruiter call scheduled/completed
4. **interview** - Technical/onsite interviews in progress
5. **offer** - Offer received, negotiating
6. **rejected** - Application declined or ghosted
7. **archived** - Moved to `_archive/` folder

---

## Quick Apply Workflow

Follow these steps for fast, consistent applications:

### 1. Create Application Folder
```bash
cd job-hunting/applications/
cp -r _template/ {company-name}-{role}/
```

### 2. Fill Out Job Posting
Edit `{company-name}-{role}/job-posting.md`:
- Update YAML frontmatter (company, role, fit score, etc.)
- Paste job requirements
- Assess your fit (strengths/gaps)
- Plan resume customization strategy

### 3. Customize Resume Data
Edit `{company-name}-{role}/resume-data.json`:
- Update role label in `basics.label`
- Customize summary for this role
- Select most relevant work highlights (2-3 per job)
- Reorder skills based on job requirements
- Choose 2-3 most relevant projects
- Add keywords from job posting

### 4. Generate Resume
```javascript
// Use MCP resume generator tool
generate_resume(
  resumeData: <contents of resume-data.json>,
  filename: "resume",
  folderPath: "../../job-hunting/applications/{company-name}-{role}"
)
```

### 5. Apply & Track
- Submit application
- Update `job-posting.md` with date_applied and status
- Update this master tracker README
- Network with employees on LinkedIn
- Schedule follow-up reminder (1 week)

---

## Directory Structure

```
applications/
├── README.md                          # This file - master tracker
│
├── _template/                         # Copy this for new applications
│   ├── job-posting.md                # Job details template
│   └── resume-data.json              # Resume generation template
│
├── _resources/                        # Reference materials
│   ├── master-resume.md              # Complete resume content bank
│   ├── resume-customization-guide.md # How to tailor resumes
│   ├── networking-templates.md       # LinkedIn outreach templates
│   └── application-workflow.md       # Detailed workflow guide
│
├── _archive/                          # Old/completed applications
│   ├── crowdstrike-ai-engineer/
│   ├── point72-software-engineer/
│   └── ...
│
└── {company-role}/                    # Active application folders
    ├── job-posting.md                # Job details + customization notes
    ├── resume-data.json              # Resume generation data
    └── resume.pdf                    # Latest generated resume
```

---

## Resume Customization Strategy

### Section Order Options

Choose based on what you want to emphasize:

**Skills-First** (Career Switcher)
- Best for: Transitioning to AI/ML roles from embedded systems
- Order: Summary → **Skills** → Work → Projects → Education
- Use when: You want to lead with AI/ML skills

**Projects-First** (Entrepreneur/Builder)
- Best for: Startup roles, showing end-to-end ownership
- Order: Summary → **Projects** → Skills → Work → Education
- Use when: Personal projects are your strongest assets

**Standard** (Traditional)
- Best for: Roles aligned with current job title
- Order: Summary → Work → Projects → Skills → Education
- Use when: Work experience speaks for itself

### Content Customization Checklist

For each application:
- [ ] Update role label to match job title
- [ ] Rewrite summary emphasizing relevant experience
- [ ] Select 2-3 most relevant work highlights per position
- [ ] Reorder skills to match job posting keywords
- [ ] Choose 2-3 projects that demonstrate required skills
- [ ] Include quantified metrics from job domain
- [ ] Match company's tech stack in skills section

---

## Resume Generation Tips

**MCP Tool Location:**
- Resume generator saves to: `/home/virus/Documents/generated-resumes/`
- Copy to application folder: `cp ... applications/{company-role}/resume.pdf`
- Or use `folderPath` parameter to save directly

**Template Selection:**
- Template 1: Clean, ATS-friendly, skills-first compatible
- Current styling: Lato font, black & dark grey, professional

**File Naming:**
- In application folder: Always `resume.pdf` (overwrites old version)
- Git tracks changes, no need for manual versioning

---

## Networking Strategy

After applying:

1. **Find 2-3 employees on LinkedIn** in similar roles
2. **Send personalized connection requests** (see `_resources/networking-templates.md`)
3. **Engage with their content** (like/comment on posts)
4. **Follow up after connection** with brief message about mutual interests

---

## Archive Process

When application is completed (hired/rejected):

```bash
# Move to archive
mv applications/{company-role}/ applications/_archive/

# Update status in job-posting.md
status: archived
archive_reason: [hired/rejected/withdrew/ghosted]
archive_date: YYYY-MM-DD
```

---

## Metrics to Track

For each application, track in `job-posting.md`:
- **Fit score** - Your assessment (0-100%)
- **Days to response** - Time from application to first contact
- **Interview stages** - Recruiter → Technical → Onsite → Offer
- **Outcome** - Hired/Rejected/Withdrew/Ghosted
- **Learnings** - What worked, what didn't

---

## Archive Summary

**Completed Applications:**
- CrowdStrike - AI Engineer (Status: Unknown)
- Point72 - Software Engineer (Status: Unknown)
- Hiya - AI Engineer (Status: Unknown)
- Forward Financing - Software Engineer (Status: Unknown)
- Generic AI Engineer - (Multiple variations)

*See `_archive/` for details*

---

## Tips for Fast Applications

**20-Minute Application Process:**
1. (5 min) Copy template, paste job requirements, assess fit
2. (10 min) Customize resume-data.json (summary, highlights, projects)
3. (3 min) Generate resume with MCP tool
4. (2 min) Apply through company portal

**Quality vs. Quantity:**
- Target: 3-5 highly tailored applications per day
- Focus on 70%+ fit scores
- Spend time on customization, not mass applying

---

**Need Help?**
- Resume customization: See `_resources/resume-customization-guide.md`
- Networking templates: See `_resources/networking-templates.md`
- Workflow details: See `_resources/application-workflow.md`
- Master resume content: See `_resources/master-resume.md`
