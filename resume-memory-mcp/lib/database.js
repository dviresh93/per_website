/**
 * Database Module for Resume Memory MCP Server
 *
 * Handles SQLite database initialization and operations for:
 * - Profile storage (compressed summaries)
 * - Application history tracking
 * - Pattern learning
 *
 * Phase 2.1: Basic database setup
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize SQLite database with schema
 *
 * @param {string} dbPath - Path to database file
 * @returns {Database} Database instance
 */
export function initDatabase(dbPath = null) {
  // Default to data/memory.db
  if (!dbPath) {
    dbPath = path.join(__dirname, "../data/memory.db");
  }

  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  // Create tables
  createTables(db);

  return db;
}

/**
 * Create database tables
 *
 * @param {Database} db - Database instance
 */
function createTables(db) {
  // Profile table - stores compressed profile summary
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      full_context TEXT NOT NULL,
      compressed_summary TEXT NOT NULL,
      compression_ratio REAL,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Applications table - tracks all job applications
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      role_type TEXT,
      job_requirements TEXT,
      projects_selected TEXT,
      skills_highlighted TEXT,
      resume_json TEXT,
      resume_path TEXT,
      resume_reused BOOLEAN DEFAULT 0,
      reused_from TEXT,
      tokens_used INTEGER DEFAULT 0,
      cost_usd REAL,
      application_date TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT,
      similarity_score REAL
    )
  `);

  // Create index for role type queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_role_type_date
      ON applications(role_type, application_date)
  `);

  // Knowledge graph nodes table (companies, projects, skills)
  db.exec(`
    CREATE TABLE IF NOT EXISTS kg_nodes (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Knowledge graph edges table (relationships)
  db.exec(`
    CREATE TABLE IF NOT EXISTS kg_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_id TEXT NOT NULL,
      to_id TEXT NOT NULL,
      edge_type TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_id) REFERENCES kg_nodes(id),
      FOREIGN KEY (to_id) REFERENCES kg_nodes(id)
    )
  `);

  console.log("✅ Database tables created successfully");
}

/**
 * Get or create profile
 *
 * @param {Database} db - Database instance
 * @returns {Object|null} Profile data or null if not exists
 */
export function getProfile(db) {
  const stmt = db.prepare("SELECT * FROM profile WHERE id = 1");
  return stmt.get();
}

/**
 * Save profile
 *
 * @param {Database} db - Database instance
 * @param {string} fullContext - Full profile context (8k tokens)
 * @param {string} compressedSummary - Compressed summary (200 tokens)
 * @returns {void}
 */
export function saveProfile(db, fullContext, compressedSummary) {
  const compressionRatio =
    compressedSummary.length / fullContext.length;

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO profile (id, full_context, compressed_summary, compression_ratio, last_updated)
    VALUES (1, ?, ?, ?, datetime('now'))
  `);

  stmt.run(fullContext, compressedSummary, compressionRatio);
}

/**
 * Track application
 *
 * @param {Database} db - Database instance
 * @param {Object} appData - Application data
 * @returns {void}
 */
export function trackApplication(db, appData) {
  const stmt = db.prepare(`
    INSERT INTO applications (
      id, company, role, role_type, job_requirements,
      projects_selected, skills_highlighted, resume_path,
      resume_reused, reused_from, tokens_used, cost_usd, status, similarity_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    appData.id || `${appData.company}-${appData.role}-${Date.now()}`,
    appData.company,
    appData.role,
    appData.role_type,
    appData.job_requirements,
    JSON.stringify(appData.projects_selected || []),
    JSON.stringify(appData.skills_highlighted || []),
    appData.resume_path,
    appData.resume_reused ? 1 : 0,
    appData.reused_from || null,
    appData.tokens_used || 0,
    appData.cost_usd || 0,
    appData.status || "applied",
    appData.similarity_score || null
  );
}

/**
 * Get applications by role type
 *
 * @param {Database} db - Database instance
 * @param {string} roleType - Role type filter
 * @param {number} limit - Max results
 * @returns {Array} Applications
 */
export function getApplicationsByRole(db, roleType, limit = 10) {
  const stmt = db.prepare(`
    SELECT * FROM applications
    WHERE role_type = ?
    ORDER BY application_date DESC
    LIMIT ?
  `);

  return stmt.all(roleType, limit);
}

/**
 * Get all applications (for similarity check)
 *
 * @param {Database} db - Database instance
 * @param {number} days - Last N days
 * @returns {Array} Applications
 */
export function getAllApplications(db, days = 90) {
  const stmt = db.prepare(`
    SELECT * FROM applications
    WHERE application_date > date('now', '-' || ? || ' days')
    ORDER BY application_date DESC
  `);

  return stmt.all(days);
}

/**
 * Get application by ID
 *
 * @param {Database} db - Database instance
 * @param {string} id - Application ID
 * @returns {Object|null} Application data with resume_json parsed
 */
export function getApplicationById(db, id) {
  const stmt = db.prepare(`
    SELECT * FROM applications
    WHERE id = ?
  `);

  const app = stmt.get(id);

  if (!app) return null;

  // Parse JSON fields
  if (app.projects_selected && typeof app.projects_selected === 'string') {
    try {
      app.projects_selected = JSON.parse(app.projects_selected);
    } catch (e) {
      app.projects_selected = [];
    }
  }

  if (app.skills_highlighted && typeof app.skills_highlighted === 'string') {
    try {
      app.skills_highlighted = JSON.parse(app.skills_highlighted);
    } catch (e) {
      app.skills_highlighted = [];
    }
  }

  return app;
}
