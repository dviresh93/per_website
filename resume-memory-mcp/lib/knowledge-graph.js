/**
 * Knowledge Graph Module
 *
 * Query-able resume structure for semantic project/skill matching
 * Phase 2.3: Basic keyword-based querying
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class KnowledgeGraph {
  constructor(graphPath = null) {
    this.graphPath = graphPath || path.join(__dirname, '../data/knowledge-graph.json');
    this.graph = null;
  }

  async load() {
    const data = await fs.readFile(this.graphPath, 'utf-8');
    this.graph = JSON.parse(data);
  }

  /**
   * Query knowledge graph for relevant projects
   *
   * @param {string} query - Search query (keywords from job description)
   * @param {string} roleType - Role type filter (ai_engineer, robotics_engineer, etc.)
   * @param {number} limit - Max results to return
   * @returns {Array} Relevant projects with scores
   */
  async queryProjects(query, roleType = null, limit = 3) {
    if (!this.graph) await this.load();

    const keywords = query.toLowerCase().split(/\s+/);

    // Score projects by keyword matches
    const projects = this.graph.nodes.projects
      .filter(p => !roleType || p.role_fit.includes(roleType))
      .map(p => {
        let score = 0;

        // Match in technologies
        for (const tech of p.technologies) {
          for (const kw of keywords) {
            if (tech.toLowerCase().includes(kw)) score += 2;
          }
        }

        // Match in project name
        for (const kw of keywords) {
          if (p.name.toLowerCase().includes(kw)) score += 3;
        }

        // Match in description
        for (const kw of keywords) {
          if (p.description.toLowerCase().includes(kw)) score += 1;
        }

        return { ...p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return projects;
  }

  /**
   * Get all companies
   */
  async getCompanies() {
    if (!this.graph) await this.load();
    return this.graph.nodes.companies;
  }

  /**
   * Get skills by category
   */
  async getSkillsByCategory(category = null) {
    if (!this.graph) await this.load();

    if (!category) return this.graph.nodes.skills;

    return this.graph.nodes.skills.filter(s =>
      s.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Get project details by ID
   */
  async getProject(projectId) {
    if (!this.graph) await this.load();
    return this.graph.nodes.projects.find(p => p.id === projectId);
  }
}
