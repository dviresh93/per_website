#!/usr/bin/env node

/**
 * Populate Database Script
 *
 * Imports existing resumes from job-prep/applications/ into the database
 * For similarity checking and knowledge graph building
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, trackApplication } from '../lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPLICATIONS_DIR = '/home/virus/Documents/repo/per_wesite/job-prep/applications';

/**
 * Parse company and role from folder name
 * Example: "vercel-v0-ai-engineer" → { company: "Vercel V0", role: "AI Engineer" }
 */
function parseApplicationFolder(folderName) {
  // Skip template and archive folders
  if (folderName.startsWith('_') || folderName === 'node_modules') {
    return null;
  }

  const parts = folderName.split('-');

  // Find where role starts (usually after company name, contains "engineer", "scientist", etc.)
  let roleStartIndex = parts.findIndex(p =>
    p.toLowerCase().includes('engineer') ||
    p.toLowerCase().includes('scientist') ||
    p.toLowerCase().includes('developer') ||
    p.toLowerCase().includes('analyst')
  );

  if (roleStartIndex === -1) roleStartIndex = Math.floor(parts.length / 2);

  const company = parts.slice(0, roleStartIndex).map(capitalize).join(' ');
  const role = parts.slice(roleStartIndex).map(capitalize).join(' ');

  return { company, role };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Determine role type from role title
 */
function determineRoleType(role) {
  const roleLower = role.toLowerCase();

  if (roleLower.includes('ai') || roleLower.includes('agentic')) return 'ai_engineer';
  if (roleLower.includes('ml') || roleLower.includes('machine learning')) return 'ml_engineer';
  if (roleLower.includes('robotics')) return 'robotics_engineer';
  if (roleLower.includes('full stack') || roleLower.includes('fullstack')) return 'full_stack_engineer';
  if (roleLower.includes('backend')) return 'backend_engineer';
  if (roleLower.includes('frontend')) return 'frontend_engineer';
  if (roleLower.includes('product')) return 'product_engineer';

  return 'software_engineer';
}

/**
 * Extract projects from resume data
 */
function extractProjects(resumeData) {
  if (!resumeData.projects) return [];
  return resumeData.projects.map(p => p.name || 'Unknown Project');
}

/**
 * Extract skills from resume data
 */
function extractSkills(resumeData) {
  if (!resumeData.skills) return [];

  const skills = [];
  resumeData.skills.forEach(skillGroup => {
    if (skillGroup.keywords) {
      skills.push(...skillGroup.keywords);
    }
  });

  return skills;
}

/**
 * Load job posting if available
 */
function loadJobPosting(appPath) {
  const jobPostingPath = path.join(appPath, 'job-posting.md');

  if (fs.existsSync(jobPostingPath)) {
    try {
      return fs.readFileSync(jobPostingPath, 'utf-8');
    } catch (error) {
      console.warn(`Could not read job posting: ${jobPostingPath}`);
    }
  }

  return null;
}

/**
 * Main population function
 */
async function populateDatabase() {
  console.log('Starting database population...\n');

  const db = initDatabase();
  const folders = fs.readdirSync(APPLICATIONS_DIR);

  let imported = 0;
  let skipped = 0;

  for (const folder of folders) {
    const appPath = path.join(APPLICATIONS_DIR, folder);

    // Skip if not a directory
    if (!fs.statSync(appPath).isDirectory()) continue;

    // Parse company and role
    const parsed = parseApplicationFolder(folder);
    if (!parsed) {
      skipped++;
      continue;
    }

    const { company, role } = parsed;

    // Look for resume-data.json
    const resumeDataPath = path.join(appPath, 'resume-data.json');
    const resumePdfPath = path.join(appPath, 'resume.pdf');

    if (!fs.existsSync(resumeDataPath)) {
      console.log(`⏭  Skipping ${folder} - No resume-data.json found`);
      skipped++;
      continue;
    }

    try {
      // Load resume data
      const resumeData = JSON.parse(fs.readFileSync(resumeDataPath, 'utf-8'));

      // Load job posting if available
      const jobRequirements = loadJobPosting(appPath);

      // Extract metadata
      const roleType = determineRoleType(role);
      const projects = extractProjects(resumeData);
      const skills = extractSkills(resumeData);

      // Determine if resume PDF exists
      const resumePath = fs.existsSync(resumePdfPath) ? resumePdfPath : null;

      // Insert into database
      const appData = {
        id: `${company.toLowerCase().replace(/\s+/g, '-')}-${role.toLowerCase().replace(/\s+/g, '-')}`,
        company,
        role,
        role_type: roleType,
        job_requirements: jobRequirements,
        projects_selected: projects,
        skills_highlighted: skills,
        resume_json: JSON.stringify(resumeData),
        resume_path: resumePath,
        resume_reused: false,
        tokens_used: 7500,  // Assume full generation
        cost_usd: 0.09,
        status: 'applied'
      };

      trackApplication(db, appData);

      console.log(`✅ Imported: ${company} - ${role} (${roleType})`);
      console.log(`   Projects: ${projects.slice(0, 3).join(', ')}${projects.length > 3 ? '...' : ''}`);
      console.log(`   Skills: ${skills.slice(0, 5).join(', ')}${skills.length > 5 ? '...' : ''}`);
      console.log(`   Resume: ${resumePath ? 'PDF found' : 'No PDF'}\n`);

      imported++;

    } catch (error) {
      console.error(`❌ Error importing ${folder}:`, error.message);
      skipped++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Imported: ${imported} applications`);
  console.log(`⏭  Skipped: ${skipped} folders`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  db.close();
  console.log('Database population complete!');
}

// Run the script
populateDatabase().catch(console.error);
