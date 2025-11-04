# Job Application Workflow

Complete step-by-step process for applying to jobs strategically.

---

## 🎯 The Complete System

```
See Job → Analyze → Build Missing Skills → Customize Resume → Apply → Follow Up
   ↓
Get Interview → Prepare → Ace It → Get Offer
```

---

## Phase 1: Job Discovery & Analysis (30 minutes)

### Step 1: Find Target Job
- LinkedIn job search
- Company careers pages
- Referrals from network
- Recruiter outreach

### Step 2: Save Job Details
Create company-specific scratchpad:
```
/job-hunting/applications/[company-name]-application.txt
```

Include:
- Job title
- Company name
- Job posting URL
- Date found
- Full job description (copy-paste)
- Application deadline (if any)

### Step 3: Analyze Requirements
Extract and categorize:

**Required Skills** (Must-haves):
- [ ] Skill 1
- [ ] Skill 2
- [ ] Skill 3

**Preferred Skills** (Nice-to-haves):
- [ ] Skill 1
- [ ] Skill 2

**Keywords/Buzzwords** (Use in resume):
- Keyword 1
- Keyword 2
- Keyword 3

**Company Values/Culture** (Mention in cover letter):
- Value 1
- Value 2

### Step 4: Gap Analysis
Mark what you have vs. what's missing:

```
✅ LangChain - HAVE (GridCOP project)
✅ Python - HAVE (5 years)
❌ CrewAI - MISSING (need to build)
❌ A2A - MISSING (need to build)
✅ AWS - HAVE (production deployments)
🟡 Azure - LEARNING (add to LinkedIn)
```

**Decision:**
- If 70%+ match → Apply now
- If 50-70% match → Build missing skills first (1-3 days)
- If <50% match → Probably not a good fit (move on)

---

## Phase 2: Skill Building (1-3 days, if needed)

Only do this if you're missing critical requirements.

### Day 1: Learn Basics
1. Read official documentation (2-3 hours)
2. Follow quickstart tutorial (1-2 hours)
3. Understand core concepts

### Day 2: Build Project
1. Design simple but functional demo (1 hour planning)
2. Implement (4-6 hours coding)
3. Deploy to GitHub with README

### Day 3: Polish & Document
1. Clean up code
2. Write comprehensive README
3. Add to LinkedIn (if not there)
4. Add to resume as project

**Project Ideas by Missing Skill:**
- **CrewAI** → Multi-agent research system
- **A2A** → Agent-to-agent communication demo
- **Azure** → Deploy existing project to Azure
- **Specific domain** → Small project in that domain
- **New framework** → Todo app / basic CRUD with that framework

---

## Phase 3: Resume Customization (2-4 hours)

### Step 1: Invoke Context
```
/profile
```

This loads:
- Your dates (source of truth)
- Your experience
- Customization strategies
- Templates

### Step 2: Choose Template
Based on job title:
- **AI Engineer** → AI Engineer template
- **Software Engineer** → Software Engineer template
- **Robotics Engineer** → Robotics template
- **Backend Engineer** → Backend template

### Step 3: Customize Resume

**Summary Section:**
- Use keywords from job description
- Match their language
- Lead with what they care about most

**Skills Section:**
- Reorder to put their requirements first
- Add frameworks you just built with
- Include their specific terminology

**Experience Section:**
- Emphasize relevant bullets
- Add/modify bullets to match their needs
- Use strategic language transformation (see guide)

**Projects Section:**
- Lead with most relevant project
- Add new projects you just built
- Frame projects in their domain/terminology

### Step 4: Quality Check

**Recruiter Hat 👔**
Read resume as if you're the recruiter:
- Does this person have what we need?
- Do they speak our language?
- Can they do the job?
- Should I interview them?

**Make adjustments until you'd call yourself.**

### Step 5: Save & Export
```
/job-hunting/applications/resumes/Viresh-Duvvuri-Resume-[CompanyName].md
```

Convert to PDF:
```
Viresh-Duvvuri-Resume-[CompanyName].pdf
```

---

## Phase 4: Application Materials (1-2 hours)

### Cover Letter (if required)
Use template from `networking-templates.md`:
- Paragraph 1: Why this company specifically
- Paragraph 2: Your relevant experience (3 bullet points)
- Paragraph 3: What you're excited to contribute
- Keep it under 300 words

### Application Questions
Common questions and where to find answers:
- "Why do you want to work here?" → See networking templates
- "Tell me about yourself" → See networking templates
- "Salary expectations" → Research on levels.fyi first
- "Describe a challenging project" → Use STAR format

**Save responses:**
```
/job-hunting/applications/[company-name]-application.txt
```
(Add your answers below job description)

---

## Phase 5: Submit Application (30 minutes)

### Checklist Before Submitting:
- [ ] Resume reviewed and proofread
- [ ] Resume file name: `Viresh-Duvvuri-Resume-[Company].pdf`
- [ ] Cover letter customized (if required)
- [ ] All application questions answered
- [ ] LinkedIn profile matches resume (dates, titles)
- [ ] New skills added to LinkedIn (if you built projects)
- [ ] Applied through correct channel (company site vs. LinkedIn)

### After Submitting:
1. **Save confirmation** (screenshot or confirmation email)
2. **Update application tracker:**
   ```
   Company: [Name]
   Role: [Title]
   Date Applied: [Date]
   Status: Applied
   ```
3. **Set follow-up reminder** (5-7 days out)

---

## Phase 6: Networking & Follow-Up (Ongoing)

### Within 24 Hours of Applying:

**Find employees on LinkedIn:**
1. Search: `[Company Name] [AI Engineer / Software Engineer]`
2. Look for:
   - Hiring manager for this role
   - Team members in similar roles
   - Recruiters at the company
   - Alumni from your university

**Send connection request** (see networking templates):
```
Hi [Name],

I recently applied for the [Role] position at [Company] and was impressed by
[specific thing]. Would love to learn more about your experience on the team.

Best,
Viresh
```

### After 5-7 Days (No Response):

**Follow-up email to recruiter:**
```
Hi [Recruiter Name],

I submitted my application for the [Role] position last week. I'm particularly
interested in this role because [specific reason].

Happy to provide any additional information. Thanks for considering my application!

Best,
Viresh
```

### After Interview:

**Within 24 hours, send thank you:**
```
Hi [Interviewer],

Thanks for taking the time to chat today! I really enjoyed learning about [specific
thing discussed] and how [Company] approaches [relevant topic].

Looking forward to next steps!

Best,
Viresh
```

---

## Phase 7: Interview Preparation (Once you get the call)

### Initial Prep (Before first interview):
1. **Review job description again** (refresh memory)
2. **Review your resume for this company** (know what you sent them)
3. **Prepare your "Tell me about yourself"** (30-60 seconds)
4. **Research the company:**
   - Recent news
   - Product updates
   - Team structure
   - Competitors
5. **Prepare questions to ask them** (5-10 questions)

### Technical Prep (For technical interviews):
1. **Review projects on your resume**
   - Be ready to explain in detail
   - Know the trade-offs you made
   - Be ready for deep technical questions
2. **Practice with relevant problems:**
   - Coding challenges (if mentioned)
   - System design (for senior roles)
   - Behavioral questions (use STAR format)
3. **Study their tech stack:**
   - Frameworks they use
   - Common patterns in their domain
   - Best practices for their technologies

### Company-Specific Prep:
Create file:
```
/interview-prep/companies/[company-name]/prep-notes.md
```

Include:
- Company background
- Products/services
- Tech stack
- Team structure
- Interview format (if known)
- Questions to ask
- Your relevant projects
- Stories to tell (STAR format)

---

## Claude's Role in This Workflow

When you invoke `/profile` and give me a job posting, I will:

### 🔍 **Role: Job Analyzer**
- Extract required vs. preferred skills
- Identify key buzzwords and terminology
- Determine company culture/values
- Assess your fit percentage

### 🎓 **Role: Skills Coach**
- Identify which skills you're missing
- Suggest quick projects to build those skills
- Provide learning resources
- Estimate time needed to build proficiency

### ✍️ **Role: Resume Writer**
- Customize your resume for this specific job
- Reframe experience using their language
- Reorder sections for maximum impact
- Add relevant projects (including new ones)

### 👔 **Role: Recruiter (Quality Check)**
- Review customized resume as a recruiter would
- Point out gaps or concerns
- Suggest improvements
- Tell you honestly if you'd get a callback

### 💬 **Role: Communication Coach**
- Draft connection requests
- Write cover letters
- Answer application questions
- Prepare interview responses

### 🎯 **Role: Strategy Advisor**
- Decide if you should apply now or build skills first
- Prioritize which jobs to focus on
- Suggest networking strategies
- Plan interview preparation

---

## Example: Complete Workflow for PepsiCo AI Engineer Role

### Monday: Discover Job
```
You: /profile
You: [Paste PepsiCo job description]

Me: *Analyzes job*
     Required: LangChain ✅, CrewAI ❌, MCP ✅, A2A ❌, AWS ✅
     Fit: 60% - Need to build CrewAI and A2A
     Recommendation: Build projects first, then apply
```

### Tuesday-Wednesday: Build Skills
```
You: Help me design a CrewAI project

Me: *Suggests multi-agent research system*
    *Provides code structure and implementation guidance*

You: *Builds project, deploys to GitHub*
```

### Thursday: Customize Resume
```
You: Ready to apply. Help me customize my resume.

Me: *Provides customized resume*
    - Summary mentions CrewAI and A2A
    - Adds your new projects
    - Reframes GridCOP with enterprise language
    - Skills ordered to match their priorities
```

### Thursday Evening: Apply
```
You: *Reviews resume*
You: *Applies through company website*
You: *Saves confirmation*
```

### Friday: Network
```
You: Help me write a message to [Hiring Manager]

Me: *Drafts personalized LinkedIn message*

You: *Sends connection request*
```

### Next Week: Follow-up
```
*5 days later, no response*

You: Help me write a follow-up

Me: *Drafts professional follow-up email*
```

### Week 3: Interview!
```
You: Got the interview! Help me prepare.

Me: *Reviews job description*
    *Suggests preparation topics*
    *Helps practice responses*
```

---

## Success Metrics

Track these for each application:

- **Application Date:** When you applied
- **Skill Gaps Filled:** What you learned/built for this role
- **Networking Attempts:** How many people you reached out to
- **Response Time:** How long until you heard back
- **Interview Stage:** Phone screen → Technical → Onsite → Offer
- **Outcome:** Rejected, No Response, Offer, Accepted

**Goal:**
- Apply to 10-20 quality jobs per week
- Get 2-3 interviews per 10 applications (20-30% callback rate)
- Convert 1 in 3 interviews to offers (33% conversion rate)

---

## Quick Reference: Time Estimates

| Phase | Time Required |
|-------|---------------|
| Job Discovery & Analysis | 30 minutes |
| Skill Building (if needed) | 1-3 days |
| Resume Customization | 2-4 hours |
| Application Materials | 1-2 hours |
| Submit Application | 30 minutes |
| Networking | 30 minutes |
| **Total (if no skill building):** | **4-7 hours** |
| **Total (with skill building):** | **3-4 days** |

---

## Common Questions

**Q: Should I apply if I'm missing 30% of requirements?**
A: Yes! If you can build those skills in 1-3 days, do it. Otherwise, apply anyway if you meet the core requirements.

**Q: How many jobs should I apply to per week?**
A: Focus on quality over quantity. 10-20 well-customized applications > 50 generic ones.

**Q: Should I always customize my resume?**
A: For roles you really want: YES. For less competitive roles or if you're 90%+ match: You can use a base template.

**Q: When should I follow up?**
A: 5-7 days after applying (email). Then again after another 5-7 days. After that, move on.

**Q: Should I apply through LinkedIn or company website?**
A: Company website is usually better (goes directly to their ATS). But if they only have LinkedIn Easy Apply, use that.

---

## Files & Organization

```
job-hunting/
├── applications/
│   ├── Viresh-Duvvuri-Master-Resume.md
│   ├── resume-customization-guide.md
│   ├── networking-templates.md
│   ├── application-workflow.md (this file)
│   ├── resumes/
│   │   ├── Viresh-Duvvuri-Resume-PepsiCo.pdf
│   │   ├── Viresh-Duvvuri-Resume-Anthropic.pdf
│   │   └── ...
│   └── company-applications/
│       ├── pepsico-application.txt
│       ├── anthropic-application.txt
│       └── ...
├── context/
│   └── (extracted Q&A banks, reusable content)
└── archive/
    └── (old materials)
```

---

Ready to start? Just invoke `/profile` and paste a job description!
