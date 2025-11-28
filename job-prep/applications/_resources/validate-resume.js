/**
 * Resume Validation Tool
 *
 * Validates that customized resume-data.json follows all locked content rules.
 * Used before PDF generation to prevent accidental modifications.
 *
 * Rules enforced:
 * 1. Locked bullets must match baseline exactly
 * 2. Employment dates must not change
 * 3. Job titles must not change
 * 4. Company names must not change
 * 5. Bullet count pattern must match baseline
 * 6. Education must not change
 */

const fs = require('fs');
const path = require('path');

// Load baseline resume
const BASELINE_PATH = path.join(__dirname, 'baseline-resume-data.json');

/**
 * Load baseline resume data
 */
function loadBaseline() {
  try {
    const content = fs.readFileSync(BASELINE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load baseline resume: ${error.message}`);
  }
}

/**
 * Validate resume data against baseline
 * @param {Object} resumeData - Resume data to validate
 * @param {Object} baseline - Baseline resume data (optional, loads if not provided)
 * @returns {Object} - {valid: boolean, errors: string[], warnings: string[]}
 */
function validateResume(resumeData, baseline = null) {
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
      errors.push(`LOCKED CONTENT: ${baselineJob.company} start date changed (baseline: "${baselineJob.startDate}", got: "${resumeJob.startDate}")`);
    }
    if (resumeJob.endDate !== baselineJob.endDate) {
      errors.push(`LOCKED CONTENT: ${baselineJob.company} end date changed (baseline: "${baselineJob.endDate}", got: "${resumeJob.endDate}")`);
    }

    // Check job title
    if (resumeJob.position !== baselineJob.position) {
      errors.push(`LOCKED CONTENT: ${baselineJob.company} job title changed (baseline: "${baselineJob.position}", got: "${resumeJob.position}")`);
    }

    // Check location
    if (resumeJob.location !== baselineJob.location) {
      errors.push(`LOCKED CONTENT: ${baselineJob.company} location changed (baseline: "${baselineJob.location}", got: "${resumeJob.location}")`);
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
          if (!resumeJob.highlights[i]) {
            errors.push(`LOCKED CONTENT: ${baselineJob.company} bullet ${i+1} missing`);
          } else if (!resumeJob.highlights[i].includes('[LOCKED]')) {
            // Check if bullet matches baseline (allow for marker)
            const baselineBullet = baselineJob.highlights[i].replace('[LOCKED] ', '');
            const resumeBullet = resumeJob.highlights[i].replace('[LOCKED] ', '');
            if (resumeBullet !== baselineBullet) {
              errors.push(`LOCKED CONTENT: ${baselineJob.company} bullet ${i+1} modified\n  Expected: "${baselineBullet}"\n  Got: "${resumeBullet}"`);
            }
          }
        }
        break;

      case 'Lumenier':
        // Both bullets locked
        for (let i = 0; i < baselineJob.highlights.length; i++) {
          if (!resumeJob.highlights[i]) {
            errors.push(`LOCKED CONTENT: ${baselineJob.company} bullet ${i+1} missing`);
          } else if (resumeJob.highlights[i] !== baselineJob.highlights[i]) {
            errors.push(`LOCKED CONTENT: ${baselineJob.company} bullet ${i+1} modified\n  Expected: "${baselineJob.highlights[i]}"\n  Got: "${resumeJob.highlights[i]}"`);
          }
        }
        break;

      case 'York Exponential':
        // Both bullets locked
        for (let i = 0; i < baselineJob.highlights.length; i++) {
          if (!resumeJob.highlights[i]) {
            errors.push(`LOCKED CONTENT: ${baselineJob.company} bullet ${i+1} missing`);
          } else if (resumeJob.highlights[i] !== baselineJob.highlights[i]) {
            errors.push(`LOCKED CONTENT: ${baselineJob.company} bullet ${i+1} modified\n  Expected: "${baselineJob.highlights[i]}"\n  Got: "${resumeJob.highlights[i]}"`);
          }
        }
        break;

      case 'Grid CoOperator':
        // All bullets customizable - just check count
        // Already checked above
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
        // Check degree details
        if (resumeEdu.area !== baselineEdu.area) {
          errors.push(`EDUCATION: ${baselineEdu.institution} area changed (expected "${baselineEdu.area}", got "${resumeEdu.area}")`);
        }
        if (resumeEdu.studyType !== baselineEdu.studyType) {
          errors.push(`EDUCATION: ${baselineEdu.institution} degree type changed (expected "${baselineEdu.studyType}", got "${resumeEdu.studyType}")`);
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
      errors.push(`BASICS: Name changed (expected "${baseline.basics.name}", got "${resumeData.basics.name}")`);
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
function formatValidationResults(result) {
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
  }

  if (result.warnings.length > 0) {
    output += `\n⚠️  ${result.warnings.length} warning(s):\n\n`;
    result.warnings.forEach((warning, i) => {
      output += `${i + 1}. ${warning}\n`;
    });
  }

  return output;
}

/**
 * Validate a resume file
 * @param {string} resumePath - Path to resume-data.json file
 */
function validateResumeFile(resumePath) {
  try {
    const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
    const baseline = loadBaseline();
    const result = validateResume(resumeData, baseline);
    return result;
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to validate resume: ${error.message}`],
      warnings: []
    };
  }
}

// Export functions
module.exports = {
  validateResume,
  validateResumeFile,
  formatValidationResults,
  loadBaseline
};

// CLI usage
if (require.main === module) {
  const resumePath = process.argv[2];
  if (!resumePath) {
    console.error('Usage: node validate-resume.js <path-to-resume-data.json>');
    process.exit(1);
  }

  const result = validateResumeFile(resumePath);
  console.log(formatValidationResults(result));
  process.exit(result.valid ? 0 : 1);
}
