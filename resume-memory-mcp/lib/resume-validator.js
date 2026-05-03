/**
 * Resume Validator Module
 *
 * Validates resume data against baseline to ensure locked content hasn't been modified.
 * Integrated into resume-memory MCP server.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to baseline resume data
const BASELINE_PATH = join(dirname(__dirname), '../job-prep/applications/_resources/baseline-resume-data.json');

/**
 * Load baseline resume data
 */
function loadBaseline() {
  try {
    const content = readFileSync(BASELINE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load baseline resume from ${BASELINE_PATH}: ${error.message}`);
  }
}

/**
 * Validate resume data against baseline
 * @param {Object} resumeData - Resume data to validate
 * @param {Object} baseline - Baseline resume data (optional)
 * @returns {Object} - {valid: boolean, errors: string[], warnings: string[]}
 */
export function validateResumeData(resumeData, baseline = null) {
  if (!baseline) {
    baseline = loadBaseline();
  }

  const errors = [];
  const warnings = [];

  // Validate work experience exists
  if (!resumeData.work || !Array.isArray(resumeData.work)) {
    errors.push('CRITICAL: work array missing or invalid');
    return { valid: false, errors, warnings };
  }

  // Check company count
  if (resumeData.work.length !== baseline.work.length) {
    errors.push(`CRITICAL: Wrong number of companies (expected ${baseline.work.length}, got ${resumeData.work.length})`);
  }

  // Validate each company
  for (const baselineJob of baseline.work) {
    const resumeJob = resumeData.work.find(j => j.company === baselineJob.company);

    if (!resumeJob) {
      errors.push(`CRITICAL: Missing company "${baselineJob.company}"`);
      continue;
    }

    // Check employment dates
    if (resumeJob.startDate !== baselineJob.startDate) {
      errors.push(`LOCKED: ${baselineJob.company} start date changed ("${baselineJob.startDate}" → "${resumeJob.startDate}")`);
    }
    if (resumeJob.endDate !== baselineJob.endDate) {
      errors.push(`LOCKED: ${baselineJob.company} end date changed ("${baselineJob.endDate}" → "${resumeJob.endDate}")`);
    }

    // Check job title
    if (resumeJob.position !== baselineJob.position) {
      errors.push(`LOCKED: ${baselineJob.company} job title changed ("${baselineJob.position}" → "${resumeJob.position}")`);
    }

    // Check location
    if (resumeJob.location !== baselineJob.location) {
      warnings.push(`${baselineJob.company} location changed ("${baselineJob.location}" → "${resumeJob.location}")`);
    }

    // Check bullet count
    const expectedCount = baselineJob.highlights.length;
    const actualCount = resumeJob.highlights ? resumeJob.highlights.length : 0;
    if (actualCount !== expectedCount) {
      errors.push(`BULLET COUNT: ${baselineJob.company} has ${actualCount} bullets, expected ${expectedCount}`);
    }

    // Check locked bullets by company
    if (!resumeJob.highlights) {
      errors.push(`CRITICAL: ${baselineJob.company} missing highlights array`);
      continue;
    }

    switch (baselineJob.company) {
      case 'Freefly Systems':
        // Bullets 2-4 (indices 1, 2, 3) are locked
        for (let i = 1; i <= 3; i++) {
          if (i >= resumeJob.highlights.length) {
            errors.push(`LOCKED: ${baselineJob.company} bullet ${i+1} missing`);
          } else {
            const baselineBullet = baselineJob.highlights[i].replace('[LOCKED] ', '');
            const resumeBullet = resumeJob.highlights[i].replace('[LOCKED] ', '');
            if (resumeBullet !== baselineBullet) {
              errors.push(`LOCKED: ${baselineJob.company} bullet ${i+1} modified`);
            }
          }
        }
        break;

      case 'Lumenier':
        // Both bullets locked
        for (let i = 0; i < baselineJob.highlights.length; i++) {
          if (i >= resumeJob.highlights.length) {
            errors.push(`LOCKED: ${baselineJob.company} bullet ${i+1} missing`);
          } else if (resumeJob.highlights[i] !== baselineJob.highlights[i]) {
            errors.push(`LOCKED: ${baselineJob.company} bullet ${i+1} modified`);
          }
        }
        break;

      case 'York Exponential':
        // Both bullets locked
        for (let i = 0; i < baselineJob.highlights.length; i++) {
          if (i >= resumeJob.highlights.length) {
            errors.push(`LOCKED: ${baselineJob.company} bullet ${i+1} missing`);
          } else if (resumeJob.highlights[i] !== baselineJob.highlights[i]) {
            errors.push(`LOCKED: ${baselineJob.company} bullet ${i+1} modified`);
          }
        }
        break;

      case 'Grid CoOperator':
        // All bullets customizable - just check count
        break;

      default:
        warnings.push(`Unknown company: ${baselineJob.company} - cannot validate locked bullets`);
    }
  }

  // Validate education
  if (!resumeData.education || !Array.isArray(resumeData.education)) {
    errors.push('CRITICAL: education array missing or invalid');
  } else {
    if (resumeData.education.length !== baseline.education.length) {
      errors.push(`EDUCATION: Wrong number of degrees (expected ${baseline.education.length}, got ${resumeData.education.length})`);
    }

    for (const baselineEdu of baseline.education) {
      const resumeEdu = resumeData.education.find(e => e.institution === baselineEdu.institution);
      if (!resumeEdu) {
        errors.push(`EDUCATION: Missing degree from "${baselineEdu.institution}"`);
      } else {
        if (resumeEdu.area !== baselineEdu.area) {
          errors.push(`EDUCATION: ${baselineEdu.institution} area changed`);
        }
        if (resumeEdu.studyType !== baselineEdu.studyType) {
          errors.push(`EDUCATION: ${baselineEdu.institution} degree type changed`);
        }
        if (resumeEdu.startDate !== baselineEdu.startDate || resumeEdu.endDate !== baselineEdu.endDate) {
          errors.push(`EDUCATION: ${baselineEdu.institution} dates changed`);
        }
      }
    }
  }

  // Validate basics
  if (resumeData.basics) {
    if (resumeData.basics.name !== baseline.basics.name) {
      errors.push(`BASICS: Name changed ("${baseline.basics.name}" → "${resumeData.basics.name}")`);
    }
    if (resumeData.basics.email !== baseline.basics.email) {
      warnings.push(`Email changed - verify this is intentional`);
    }
    if (resumeData.basics.phone !== baseline.basics.phone) {
      warnings.push(`Phone changed - verify this is intentional`);
    }
  } else {
    errors.push('CRITICAL: basics section missing');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Format validation results for display
 */
export function formatValidationResults(result) {
  let output = '';

  if (result.valid) {
    output += '✅ VALIDATION PASSED\n\n';
    output += 'All locked content verified. Resume is safe to generate.\n';
  } else {
    output += '❌ VALIDATION FAILED\n\n';
    output += `Found ${result.errors.length} error(s):\n\n`;
    result.errors.forEach((error, i) => {
      output += `${i + 1}. ${error}\n`;
    });
    output += '\n⛔ **RESUME GENERATION BLOCKED**\n';
    output += 'Fix the errors above before generating PDF.\n';
  }

  if (result.warnings.length > 0) {
    output += `\n⚠️  ${result.warnings.length} warning(s):\n\n`;
    result.warnings.forEach((warning, i) => {
      output += `${i + 1}. ${warning}\n`;
    });
  }

  return output;
}
