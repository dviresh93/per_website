---
description: Generate a tailored resume for a job application
---

# Resume Generation Workflow

This workflow guides the agent through the process of analyzing a job, customizing the resume, reviewing it with the user, and generating the PDF using the standalone script.

## 1. Analysis & Setup

1.  **Analyze Job:** Read the job posting and identify key requirements, role type, and gaps.
2.  **Create Folder:**
    ```bash
    mkdir -p job-prep/applications/[company-role]
    cp job-prep/applications/_template/resume-data.json job-prep/applications/[company-role]/baseline-resume-data.json
    cp job-prep/applications/[company-role]/baseline-resume-data.json job-prep/applications/[company-role]/resume-data.json
    ```
3.  **Plan Customization:** Create `implementation_plan.md` detailing how to bridge gaps (e.g., "Role Pivoting", "Experience Bridging").

## 2. Customization (JSON)

1.  **Load Baseline:** Read `job-prep/applications/[company-role]/baseline-resume-data.json`.
2.  **Apply Edits:**
    *   **Summary:** Rewrite to match the role (e.g., "Senior AI Engineer" vs "AI Architect").
    *   **Skills:** Reorder keywords to match JD.
    *   **Work:** Customize *only* allowed bullets (Freefly #1). **NEVER** touch locked bullets.
    *   **Projects:** Select the 3 most relevant projects.
3.  **Save Draft:** Write to `job-prep/applications/[company-role]/resume-data.json`.

## 3. Content Review (Markdown)

**CRITICAL STEP:** Before generating the PDF, present the content in Markdown for user review.

1.  **Generate Markdown Artifact:** Create a file (e.g., `RESUME_CONTENT_REVIEW.md`) that displays the resume content in a readable format.
    *   Show Summary.
    *   Show Skills.
    *   Show Work Experience (highlighting the customized bullet).
    *   Show Projects.
2.  **Request Review:** Ask the user to review the Markdown.
3.  **Iterate:** If user requests changes, update JSON and regenerate Markdown until approved.

## 4. PDF Generation

1.  **Create Script:** Create `generate-resume-standalone.mjs` in the root if it doesn't exist (or update the path in the existing one).
    ```javascript
    import { compilePDF } from './resumake-mcp/lib/pdf-compiler.js';
    import { generateLatex } from './resumake-mcp/lib/latex-generator.js';
    import { expandTemplates } from './resumake-mcp/lib/template-expander.js';
    import fs from 'fs/promises';
    import path from 'path';

    async function main() {
      const resumePath = 'job-prep/applications/[company-role]/resume-data.json';
      const outputDir = 'job-prep/applications/[company-role]';
      const filename = 'viresh-duvvuri_[YYMMDD-HHMM]_[role].pdf';
      const outputPath = path.join(outputDir, filename);

      // ... rest of script ...
    }
    main();
    ```
2.  **Execute:**
    ```bash
    node generate-resume-standalone.mjs
    ```

## 5. Final Verification

1.  **Check Output:** Verify the PDF exists.
2.  **Notify User:** Provide the absolute path to the generated PDF.
