# File Naming Convention

**Purpose:** Consistent, descriptive file names for all job applications

---

## Format

### Resume PDF
```
vireshduvvuri_{job-title}_{company-name}_{timestamp}.pdf
```

### Resume Draft (Markdown)
```
resume-draft_{job-title}_{company-name}_{timestamp}.md
```

### Timestamp Format
```
YYYY-MM-DD
```

---

## Examples

### iFIT AI Engineer Application
- **Resume PDF:** `vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf`
- **Resume Draft:** `resume-draft_ai-engineer_ifit_2025-11-03.md`

### Google Senior Software Engineer Application
- **Resume PDF:** `vireshduvvuri_senior-software-engineer_google_2025-11-05.pdf`
- **Resume Draft:** `resume-draft_senior-software-engineer_google_2025-11-05.md`

### Microsoft Product Engineer Application
- **Resume PDF:** `vireshduvvuri_product-engineer_microsoft_2025-11-10.pdf`
- **Resume Draft:** `resume-draft_product-engineer_microsoft_2025-11-10.md`

---

## Naming Rules

### Job Title Format
- **Use hyphens** to separate words: `ai-engineer`, `senior-software-engineer`, `product-engineer`
- **Lowercase only**
- **No spaces**
- **Match the exact job posting title** (simplified)

### Company Name Format
- **Lowercase only**
- **No spaces** (use hyphens if needed): `ifit`, `google`, `microsoft`, `jp-morgan`
- **Short form preferred**: `microsoft` not `microsoft-corporation`

### Timestamp
- **Always use application date** (when you create the resume)
- **Format:** `YYYY-MM-DD`
- **Example:** `2025-11-03`

---

## Benefits

1. **Searchable:** Easy to find by company or job title
2. **Chronological:** Timestamp shows when you applied
3. **Clear:** Immediately obvious what the file is
4. **Professional:** Consistent naming shows organization
5. **Version Control:** Git tracks changes, timestamp shows latest

---

## Application Workflow with Naming

### Step 1: Create Application Folder
```bash
cp -r _template-ai-engineer/ ifit-ai-engineer/
cd ifit-ai-engineer/
```

### Step 2: Fill Out job-posting.md
(No naming changes needed - stays `job-posting.md`)

### Step 3: Create Resume Draft
Claude creates: `resume-draft_ai-engineer_ifit_2025-11-03.md`
- User reviews markdown
- User approves

### Step 4: Generate PDF
Claude generates: `vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf`
- Uses same job title, company name, timestamp as draft
- No more generic `resume.pdf`

### Step 5: Files in Application Folder
```
ifit-ai-engineer/
├── job-posting.md
├── resume-data.json
├── resume-draft_ai-engineer_ifit_2025-11-03.md
└── vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf
```

---

## MCP Resume Generator Integration

**IMPORTANT:** Generate PDF directly to application folder (NO copying needed):

### Setup (One-time)
A symlink exists at `/home/virus/Documents/generated-resumes/per_wesite_job_prep` → `job-prep/applications/`

### Usage
```javascript
mcp__resume-generator__generate_resume({
  resumeData: {...},
  filename: "vireshduvvuri_ai-engineer_ifit_2025-11-03",  // Without .pdf extension
  folderPath: "per_wesite_job_prep/ifit-ai-engineer"  // Via symlink - direct to app folder
})
```

**This generates the PDF directly to:**
```
/home/virus/Documents/repo/per_wesite/job-prep/applications/ifit-ai-engineer/vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf
```

**One-step process - no copying needed!**

### Examples

**iFIT AI Engineer:**
```javascript
folderPath: "per_wesite_job_prep/ifit-ai-engineer"
filename: "vireshduvvuri_ai-engineer_ifit_2025-11-03"
```

**Google Senior Software Engineer:**
```javascript
folderPath: "per_wesite_job_prep/google-senior-software-engineer"
filename: "vireshduvvuri_senior-software-engineer_google_2025-11-05"
```

**Microsoft Product Engineer:**
```javascript
folderPath: "per_wesite_job_prep/microsoft-product-engineer"
filename: "vireshduvvuri_product-engineer_microsoft_2025-11-10"
```

### DO NOT:
- ❌ Generate to root and then copy
- ❌ Use generic filename and then rename
- ❌ Create temporary files
- ❌ Forget the symlink path (`per_wesite_job_prep/`)

### DO:
- ✅ Generate directly to application folder with correct name
- ✅ Use symlink path: `per_wesite_job_prep/{company-role}/`
- ✅ One-step process, no copying needed

---

## Important Notes

### DO NOT Use
- ❌ Generic names: `resume.pdf`, `viresh-resume.pdf`
- ❌ Spaces: `viresh duvvuri ai engineer.pdf`
- ❌ Uppercase: `VireshDuvvuri_AI-Engineer_iFIT.pdf`
- ❌ Multiple timestamps: `resume_v1_v2_final.pdf`

### DO Use
- ✅ Descriptive: `vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf`
- ✅ Hyphens: `vireshduvvuri_senior-software-engineer_google_2025-11-03.pdf`
- ✅ Lowercase: `vireshduvvuri_product-engineer_microsoft_2025-11-03.pdf`
- ✅ One file per application: Git handles versioning

---

## FAQ

**Q: What if I apply to the same company twice (different roles)?**
A: Job title and timestamp will differentiate:
- `vireshduvvuri_ai-engineer_microsoft_2025-11-03.pdf`
- `vireshduvvuri_product-engineer_microsoft_2025-11-15.pdf`

**Q: What if I update the resume for the same application?**
A: Update timestamp:
- First version: `vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf`
- Updated version: `vireshduvvuri_ai-engineer_ifit_2025-11-05.pdf`
- Git tracks both, but latest timestamp is current

**Q: What about cover letters?**
A: Use same convention:
- Cover letter: `vireshduvvuri_cover-letter_ifit_2025-11-03.pdf`
- Resume: `vireshduvvuri_ai-engineer_ifit_2025-11-03.pdf`

**Q: What about the generated-resumes folder?**
A: MCP tool generates with timestamp automatically. We copy to application folder with our naming convention.

---

**Last Updated:** 2025-11-03
**Status:** Active naming convention for all applications
