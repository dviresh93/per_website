/**
 * Pattern Learning Module
 *
 * Learn from application history to suggest:
 * - Which projects work best for each role type
 * - Which skills to highlight
 * - Common customizations
 *
 * Phase 3.2: Basic pattern learning
 */

/**
 * Analyze application history and learn patterns
 *
 * @param {Database} db - Database instance
 * @param {string} roleType - Role type to analyze
 * @returns {Object} Learned patterns
 */
export function analyzePatterns(db, roleType = null) {
  let query = `
    SELECT role_type, projects_selected, skills_highlighted, tokens_used
    FROM applications
    WHERE role_type IS NOT NULL
  `;

  const params = [];
  if (roleType) {
    query += ` AND role_type = ?`;
    params.push(roleType);
  }

  query += ` ORDER BY application_date DESC LIMIT 50`;

  const stmt = db.prepare(query);
  const applications = stmt.all(...params);

  if (applications.length === 0) {
    return {
      roleType,
      totalApplications: 0,
      patterns: null,
    };
  }

  // Parse JSON fields
  const parsed = applications.map(app => ({
    ...app,
    projects_selected: JSON.parse(app.projects_selected || '[]'),
    skills_highlighted: JSON.parse(app.skills_highlighted || '[]'),
  }));

  // Count project frequency
  const projectFrequency = {};
  const skillFrequency = {};

  for (const app of parsed) {
    for (const project of app.projects_selected) {
      projectFrequency[project] = (projectFrequency[project] || 0) + 1;
    }
    for (const skill of app.skills_highlighted) {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    }
  }

  // Sort by frequency
  const topProjects = Object.entries(projectFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([project, count]) => ({
      project,
      frequency: count,
      percentage: ((count / applications.length) * 100).toFixed(0),
    }));

  const topSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({
      skill,
      frequency: count,
      percentage: ((count / applications.length) * 100).toFixed(0),
    }));

  // Calculate average tokens
  const avgTokens = Math.round(
    applications.reduce((sum, app) => sum + (app.tokens_used || 0), 0) / applications.length
  );

  return {
    roleType: roleType || 'all',
    totalApplications: applications.length,
    avgTokensUsed: avgTokens,
    topProjects,
    topSkills,
  };
}

/**
 * Get project recommendations based on role type
 *
 * @param {Database} db - Database instance
 * @param {string} roleType - Role type
 * @param {number} limit - Max recommendations
 * @returns {Array} Recommended projects
 */
export function getProjectRecommendations(db, roleType, limit = 3) {
  const patterns = analyzePatterns(db, roleType);

  if (!patterns.topProjects || patterns.topProjects.length === 0) {
    return [];
  }

  return patterns.topProjects.slice(0, limit).map(p => p.project);
}
