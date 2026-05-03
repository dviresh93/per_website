#!/usr/bin/env node

/**
 * Resume Memory MCP Server
 *
 * Provides tools for:
 * - Profile compression (8k → 200 tokens)
 * - Knowledge graph queries
 * - Pattern learning from history
 * - Resume validation (locked content enforcement)
 * - Application tracking
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { initDatabase, getProfile, saveProfile, trackApplication } from "./lib/database.js";
import { compressProfile, getCompressionStats, validateCompression } from "./lib/profile-compressor.js";
import { KnowledgeGraph } from "./lib/knowledge-graph.js";
import { analyzePatterns, getProjectRecommendations } from "./lib/pattern-learner.js";
import { validateResumeData, formatValidationResults } from "./lib/resume-validator.js";

class ResumeMemoryServer {
  constructor() {
    this.server = new Server(
      {
        name: "resume-memory",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize database
    this.db = initDatabase();
    console.log("✅ Database initialized");

    // Initialize knowledge graph
    this.knowledgeGraph = new KnowledgeGraph();
    console.log("✅ Knowledge graph initialized");

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      this.db.close();
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_profile_summary",
          description: "Get compressed profile summary (200 tokens instead of 8k)",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "save_profile",
          description: "Save full profile context and auto-generate compressed summary",
          inputSchema: {
            type: "object",
            properties: {
              fullContext: {
                type: "string",
                description: "Full profile context (~8k tokens)",
              },
            },
            required: ["fullContext"],
          },
        },
        {
          name: "track_application",
          description: "Track job application for pattern learning",
          inputSchema: {
            type: "object",
            properties: {
              company: { type: "string" },
              role: { type: "string" },
              role_type: { type: "string" },
              projects_selected: { type: "array", items: { type: "string" } },
              tokens_used: { type: "number" },
            },
            required: ["company", "role"],
          },
        },
        {
          name: "query_knowledge_graph",
          description: "Query resume knowledge graph for relevant projects and skills",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query (keywords from job description)",
              },
              role_type: {
                type: "string",
                description: "Role type filter (ai_engineer, robotics_engineer, full_stack_engineer, ml_engineer)",
              },
              limit: {
                type: "number",
                description: "Max number of results (default: 3)",
                default: 3,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "get_learned_patterns",
          description: "Get learned patterns from application history for project/skill recommendations",
          inputSchema: {
            type: "object",
            properties: {
              role_type: {
                type: "string",
                description: "Role type to analyze (ai_engineer, robotics_engineer, etc.)",
              },
            },
          },
        },
        {
          name: "validate_resume",
          description: "Validate resume data before PDF generation - ensures locked content hasn't been modified",
          inputSchema: {
            type: "object",
            properties: {
              resumeData: {
                type: "object",
                description: "Resume data object to validate (from resume-data.json)",
              },
            },
            required: ["resumeData"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "get_profile_summary":
          return await this.getProfileSummary();
        case "save_profile":
          return await this.saveProfileHandler(request.params.arguments);
        case "track_application":
          return await this.trackApplicationHandler(request.params.arguments);
        case "query_knowledge_graph":
          return await this.queryKnowledgeGraph(request.params.arguments);
        case "get_learned_patterns":
          return await this.getLearnedPatterns(request.params.arguments);
        case "validate_resume":
          return await this.validateResume(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async getProfileSummary() {
    const profile = getProfile(this.db);

    if (!profile) {
      return {
        content: [{
          type: "text",
          text: "No profile found. Use save_profile to create one.",
        }],
      };
    }

    return {
      content: [{
        type: "text",
        text: `Profile Summary (${profile.compressed_summary.length} chars, compression: ${(profile.compression_ratio * 100).toFixed(1)}%):\n\n${profile.compressed_summary}`,
      }],
    };
  }

  async saveProfileHandler(args) {
    const { fullContext } = args;

    // PHASE 2.2: Auto-compress the profile
    console.log("Compressing profile...");
    const compressedSummary = compressProfile(fullContext);

    // Validate compression quality
    const validation = validateCompression(compressedSummary);
    if (!validation.isValid) {
      console.warn("Compression validation warnings:", validation.warnings);
    }

    // Get compression statistics
    const stats = getCompressionStats(fullContext, compressedSummary);

    // Save to database
    saveProfile(this.db, fullContext, compressedSummary);

    return {
      content: [{
        type: "text",
        text: `✅ Profile saved and compressed successfully!

COMPRESSION STATISTICS:
- Original: ${stats.originalTokens} tokens (${stats.originalLength} chars)
- Compressed: ${stats.compressedTokens} tokens (${stats.compressedLength} chars)
- Token savings: ${stats.tokenSavings} tokens (${stats.percentReduction}% reduction)
- Compression ratio: ${(stats.compressionRatio * 100).toFixed(1)}%

COMPRESSED SUMMARY:
${compressedSummary}

${validation.warnings.length > 0 ? `\n⚠️  WARNINGS:\n${validation.warnings.map(w => `- ${w}`).join('\n')}` : ''}`,
      }],
    };
  }

  async trackApplicationHandler(args) {
    trackApplication(this.db, args);

    return {
      content: [{
        type: "text",
        text: `✅ Application tracked: ${args.company} - ${args.role}`,
      }],
    };
  }

  async queryKnowledgeGraph(args) {
    const { query, role_type, limit = 3 } = args;

    const projects = await this.knowledgeGraph.queryProjects(query, role_type, limit);

    if (projects.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No projects found matching: "${query}"${role_type ? ` for role type: ${role_type}` : ''}`,
        }],
      };
    }

    const results = projects.map(p =>
      `**${p.name}** (Score: ${p.score})
Technologies: ${p.technologies.join(', ')}
Impact: ${p.impact}
${p.description}`
    ).join('\n\n---\n\n');

    return {
      content: [{
        type: "text",
        text: `Found ${projects.length} relevant project(s):\n\n${results}`,
      }],
    };
  }

  async getLearnedPatterns(args = {}) {
    const { role_type } = args;

    const patterns = analyzePatterns(this.db, role_type);

    if (patterns.totalApplications === 0) {
      return {
        content: [{
          type: "text",
          text: `No application history found${role_type ? ` for role type: ${role_type}` : ''}. Track applications using track_application tool to learn patterns.`,
        }],
      };
    }

    const projectList = patterns.topProjects
      .map(p => `- ${p.project} (${p.percentage}% of applications)`)
      .join('\n');

    const skillList = patterns.topSkills
      .map(s => `- ${s.skill} (${s.percentage}% of applications)`)
      .join('\n');

    return {
      content: [{
        type: "text",
        text: `Learned Patterns${role_type ? ` for ${role_type}` : ''}:

**Applications Analyzed:** ${patterns.totalApplications}
**Average Tokens:** ${patterns.avgTokensUsed}

**Most Used Projects:**
${projectList}

**Most Highlighted Skills:**
${skillList}

**Recommendation:** Use these projects/skills for similar roles.`,
      }],
    };
  }

  async validateResume(args) {
    const { resumeData } = args;

    const result = validateResumeData(resumeData);
    const formattedOutput = formatValidationResults(result);

    return {
      content: [{
        type: "text",
        text: formattedOutput,
      }],
      isError: !result.valid, // Mark as error if validation failed
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Resume Memory MCP Server running on stdio");
  }
}

const server = new ResumeMemoryServer();
server.run().catch(console.error);
