/**
 * Template Expander
 *
 * Expands template references (e.g., {{freefly.1}}) to full locked content.
 * This happens AFTER LLM generation, so LLM never sees the full text.
 *
 * Flow:
 * 1. LLM generates resume with template IDs: ["{{freefly.1}}", "{{lumenier.0}}"]
 * 2. This expander replaces IDs with full text from LOCKED_TEMPLATES
 * 3. Full resume JSON sent to LaTeX generator
 */

import { LOCKED_TEMPLATES } from './locked-templates.js';

/**
 * Expand template references in resume data
 *
 * @param {Object} resumeData - Resume JSON with possible template refs
 * @returns {Object} Resume JSON with expanded templates
 */
export function expandTemplates(resumeData) {
  // Deep clone to avoid mutating original
  const data = JSON.parse(JSON.stringify(resumeData));

  // Expand work experience highlights
  if (data.work && Array.isArray(data.work)) {
    for (const job of data.work) {
      // Handle highlights_ref shorthand (e.g., "highlights_ref": "freefly")
      if (job.highlights_ref) {
        const refKey = job.highlights_ref;
        // This would be expanded by LLM or pre-processing
        // For now, we expect full highlights array
        delete job.highlights_ref;
      }

      // Expand template placeholders in highlights
      if (job.highlights && Array.isArray(job.highlights)) {
        job.highlights = job.highlights.map(bullet => {
          if (typeof bullet !== 'string') {
            return bullet;
          }

          // Check if bullet contains template reference
          // Patterns: {{key}}, {{company.index}}, etc.
          const templateMatch = bullet.match(/^\{\{(.+?)\}\}$/);

          if (templateMatch) {
            const templateKey = templateMatch[1];

            // Look up in LOCKED_TEMPLATES
            if (LOCKED_TEMPLATES[templateKey]) {
              return LOCKED_TEMPLATES[templateKey];
            }

            // Template key not found - log warning and return as-is
            console.warn(`Template key not found: ${templateKey}`);
            return bullet;
          }

          // No template reference - return as-is
          return bullet;
        });
      }
    }
  }

  return data;
}

/**
 * Check if resume data contains any unexpanded template references
 *
 * @param {Object} resumeData - Resume JSON to check
 * @returns {Array<string>} Array of unexpanded template keys (empty if all expanded)
 */
export function findUnexpandedTemplates(resumeData) {
  const unexpanded = [];

  if (resumeData.work && Array.isArray(resumeData.work)) {
    for (const job of resumeData.work) {
      if (job.highlights && Array.isArray(job.highlights)) {
        for (const bullet of job.highlights) {
          if (typeof bullet === 'string') {
            const match = bullet.match(/^\{\{(.+?)\}\}$/);
            if (match && !LOCKED_TEMPLATES[match[1]]) {
              unexpanded.push(match[1]);
            }
          }
        }
      }
    }
  }

  return unexpanded;
}

/**
 * Get list of all available template keys
 *
 * @returns {Array<string>} Available template keys
 */
export function getAvailableTemplates() {
  return Object.keys(LOCKED_TEMPLATES);
}
