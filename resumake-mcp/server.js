#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { generateLatex } from "./lib/latex-generator.js";
import { compilePDF } from "./lib/pdf-compiler.js";
import { expandTemplates } from "./lib/template-expander.js";

// Configuration
const RESUME_ENDPOINT = "https://latexresu.me/api/generate/resume";
const OUTPUT_DIR = process.env.RESUME_OUTPUT_DIR || path.join(path.dirname(new URL(import.meta.url).pathname), "..", "job-prep", "applications");

class ResumeGeneratorServer {
  constructor() {
    this.server = new Server(
      {
        name: "resume-generator",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "generate_resume",
          description:
            "Generate a resume PDF using the LaTeX Resume API. Provide resume data and get a professionally formatted PDF. Can save to custom folders within the generated-resumes directory.",
          inputSchema: {
            type: "object",
            properties: {
              resumeData: {
                type: "object",
                description: "Complete resume data object",
                properties: {
                  selectedTemplate: {
                    type: "integer",
                    description: "Template number (1-10)",
                    default: 1,
                  },
                  headings: {
                    type: "object",
                    properties: {
                      awards: { type: "string", default: "Introduction" },
                      work: { type: "string", default: "Work Experience" },
                      education: { type: "string", default: "Education" },
                      skills: { type: "string", default: "Skills" },
                      projects: { type: "string", default: "Projects" },
                    },
                  },
                  basics: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Full name" },
                      label: { type: "string", description: "Professional title (e.g., 'AI Engineer', 'Software Engineer')" },
                      summary: { type: "string", description: "Professional summary/objective statement" },
                      email: { type: "string", description: "Email address" },
                      phone: { type: "string", description: "Phone number" },
                      website: {
                        type: "string",
                        description: "Personal website or portfolio",
                      },
                      location: {
                        type: "object",
                        properties: {
                          address: {
                            type: "string",
                            description: "Address or city",
                          },
                        },
                      },
                    },
                    required: ["name"],
                  },
                  work: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        location: { type: "string" },
                        position: { type: "string" },
                        website: { type: "string" },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        highlights: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Skill category" },
                        level: {
                          type: "string",
                          description: "Proficiency level",
                        },
                        keywords: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                  projects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        url: { type: "string" },
                        keywords: {
                          type: "array",
                          items: { type: "string" },
                        },
                        highlights: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        institution: { type: "string" },
                        location: { type: "string" },
                        area: { type: "string", description: "Field of study" },
                        studyType: {
                          type: "string",
                          description: "Degree type (e.g., Bachelor, Master)",
                        },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        gpa: { type: "string" },
                      },
                    },
                  },
                  awards: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string" },
                        awarder: { type: "string" },
                        summary: { type: "string" },
                      },
                    },
                  },
                },
              },
              filename: {
                type: "string",
                description:
                  "Optional filename for the saved PDF (without extension)",
                default: "resume",
              },
              folderPath: {
                type: "string",
                description:
                  "Optional folder path within the generated-resumes directory. If not specified, saves to the root directory. If the folder doesn't exist, it will be created. Example: 'job-applications/google' or 'drafts'",
              },
            },
            required: ["resumeData"],
          },
        },
        {
          name: "create_folder",
          description:
            "Create a new folder within the generated-resumes directory for organizing resumes",
          inputSchema: {
            type: "object",
            properties: {
              folderPath: {
                type: "string",
                description:
                  "Folder path to create within the generated-resumes directory. Can include nested folders. Example: 'job-applications/google' or 'personal-projects'",
              },
            },
            required: ["folderPath"],
          },
        },
        {
          name: "list_folders",
          description:
            "List all folders and files in the generated-resumes directory to help with organization",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "Optional path within generated-resumes to list. If not specified, lists the root directory",
                default: "",
              },
            },
          },
        },
        {
          name: "create_resume_template",
          description:
            "Create a template resume structure with placeholder data that can be filled in",
          inputSchema: {
            type: "object",
            properties: {
              templateNumber: {
                type: "integer",
                description: "Template number (1-10)",
                default: 1,
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "generate_resume":
          return await this.generateResume(request.params.arguments);
        case "create_folder":
          return await this.createFolder(request.params.arguments);
        case "list_folders":
          return await this.listFolders(request.params.arguments);
        case "create_resume_template":
          return await this.createResumeTemplate(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async createFolder(args) {
    try {
      const { folderPath } = args;

      if (!folderPath || folderPath.trim() === "") {
        throw new Error("Folder path cannot be empty");
      }

      // Sanitize the folder path to prevent directory traversal
      const sanitizedPath = this.sanitizePath(folderPath);
      const fullPath = path.join(OUTPUT_DIR, sanitizedPath);

      // Create the folder
      await fs.mkdir(fullPath, { recursive: true });

      const relativePath = path.relative(OUTPUT_DIR, fullPath);

      return {
        content: [
          {
            type: "text",
            text:
              `✅ **Folder created successfully!**\n\n` +
              `📁 **Folder path:** ${relativePath}\n` +
              `📍 **Full path:** ${path.resolve(fullPath)}\n\n` +
              `You can now save resumes to this folder by specifying the folderPath parameter.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text:
              `❌ **Error creating folder:** ${error.message}\n\n` +
              `Please check that the folder path is valid and you have write permissions.`,
          },
        ],
        isError: true,
      };
    }
  }

  async listFolders(args) {
    try {
      const { path: subPath = "" } = args;

      // Sanitize the path
      const sanitizedPath = this.sanitizePath(subPath);
      const fullPath = path.join(OUTPUT_DIR, sanitizedPath);

      // Ensure the directory exists
      await fs.mkdir(fullPath, { recursive: true });

      // Read directory contents
      const items = await fs.readdir(fullPath, { withFileTypes: true });

      let folderList = "";
      let fileList = "";

      for (const item of items) {
        const itemPath = path.join(sanitizedPath, item.name);
        if (item.isDirectory()) {
          folderList += `📁 ${itemPath}/\n`;
        } else if (item.name.endsWith(".pdf")) {
          const stats = await fs.stat(path.join(fullPath, item.name));
          const size = (stats.size / 1024).toFixed(2);
          const date = stats.mtime.toLocaleDateString();
          fileList += `📄 ${itemPath} (${size} KB, ${date})\n`;
        }
      }

      const currentPath = sanitizedPath || "root";
      let result = `📂 **Contents of ${currentPath}:**\n\n`;

      if (folderList) {
        result += `**Folders:**\n${folderList}\n`;
      }

      if (fileList) {
        result += `**Resume PDFs:**\n${fileList}\n`;
      }

      if (!folderList && !fileList) {
        result += `The directory is empty.\n`;
      }

      result += `\n💡 **Tip:** Use the folderPath parameter in generate_resume to save PDFs to specific folders.`;

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text:
              `❌ **Error listing directory:** ${error.message}\n\n` +
              `Please check that the path exists and you have read permissions.`,
          },
        ],
        isError: true,
      };
    }
  }

  sanitizePath(inputPath) {
    if (!inputPath) return "";

    // Remove any potential directory traversal attempts
    const normalizedPath = path.normalize(inputPath);

    // Remove leading slashes and dots
    let sanitized = normalizedPath.replace(/^[\/\\\.]+/, "");

    // Replace any remaining .. sequences
    sanitized = sanitized.replace(/\.\./g, "");

    // Replace invalid characters with underscores
    sanitized = sanitized.replace(/[<>:"|?*]/g, "_");

    return sanitized;
  }

  async createResumeTemplate(args) {
    const { templateNumber = 1 } = args;

    const template = {
      selectedTemplate: templateNumber,
      headings: {
        awards: "Introduction",
        work: "Work Experience",
        skills: "Skills",
        education: "Education",
        projects: "Projects",
      },
      basics: {
        name: "[Your Full Name]",
        email: "[your.email@example.com]",
        phone: "[Your Phone Number]",
        website: "[Your Website/LinkedIn]",
        location: {
          address: "[Your City, State]",
        },
      },
      work: [
        {
          company: "[Company Name]",
          location: "[City, State]",
          position: "[Job Title]",
          website: "[Company Website]",
          startDate: "[Start Date]",
          endDate: "[End Date]",
          highlights: [
            "[Key achievement or responsibility]",
            "[Another achievement with metrics if possible]",
            "[Third achievement or skill demonstrated]",
          ],
        },
      ],

      skills: [
        {
          name: "[Skill Category]",
          level: "[Proficiency Level]",
          keywords: [
            "[Specific Skill 1]",
            "[Specific Skill 2]",
            "[Specific Skill 3]",
          ],
        },
      ],
      projects: [
        {
          name: "[Project Name]",
          description: "[Brief project description and your role]",
          url: "[Project URL if available]",
          keywords: ["[Technology Used]", "[Skill Demonstrated]"],
        },
      ],
      education: [
        {
          institution: "[University Name]",
          location: "[City, State]",
          area: "[Your Major]",
          studyType: "[Degree Type]",
          startDate: "[Start Date]",
          endDate: "[End Date]",
          gpa: "[GPA if relevant]",
        },
      ],
      awards: [
        {
          summary: "[Personal introduction or objective statement]",
        },
      ],
      sections: [
        "templates",
        "profile",
        "awards",
        "work",
        "skills",
        "education",
        "projects",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text:
            `📝 Resume Template (Template #${templateNumber})\n\n` +
            `Here's a template structure you can fill in:\n\n` +
            `\`\`\`json\n${JSON.stringify(template, null, 2)}\n\`\`\`\n\n` +
            `Replace all placeholder text in brackets with your actual information, then use the generate_resume tool to create your PDF.`,
        },
      ],
    };
  }

  async generateResume(args) {
    try {
      const { resumeData, filename = "resume", folderPath } = args;

      // Ensure the resume data has the required structure
      const completeResumeData = {
        selectedTemplate: 1,
        headings: {
          awards: "Introduction",
          work: "Work Experience",
          education: "Education",
          skills: "Skills",
          projects: "Projects",
        },
        basics: {
          email: "",
          phone: "",
          website: "",
          location: { address: "" },
          name: "",
        },
        work: [],
        skills: [],
        projects: [],
        education: [],
        awards: [],
        sections: [
          "templates",
          "profile",
          "awards",
          "work",
          "skills",
          "education",
          "projects",
        ],
        ...resumeData,
      };

      // Determine the output directory
      let outputDir = OUTPUT_DIR;
      if (folderPath && folderPath.trim() !== "") {
        const sanitizedFolderPath = this.sanitizePath(folderPath);
        outputDir = path.join(OUTPUT_DIR, sanitizedFolderPath);
      }

      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      // PHASE 1.2: Expand template references before LaTeX generation
      // This replaces {{template-id}} with full locked content
      console.log("Expanding template references...");
      const expandedResumeData = expandTemplates(completeResumeData);

      // Generate LaTeX code from expanded resume data
      console.log("Generating LaTeX code...");
      const latexCode = generateLatex(expandedResumeData);

      // Compile LaTeX to PDF
      console.log("Compiling PDF...");
      const buffer = await compilePDF(latexCode);

      // Save PDF to file
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .split("T")[0];
      const pdfFilename = `${filename}-${timestamp}.pdf`;
      const filePath = path.join(outputDir, pdfFilename);

      await fs.writeFile(filePath, buffer);

      const fullPath = path.resolve(filePath);
      const relativePath = path.relative(OUTPUT_DIR, filePath);

      return {
        content: [
          {
            type: "text",
            text:
              `✅ Resume generated successfully!\n\n` +
              `📄 **File saved to:** ${relativePath}\n` +
              `📍 **Full path:** ${fullPath}\n` +
              `📏 **File size:** ${(buffer.length / 1024).toFixed(2)} KB\n` +
              `🎨 **Template used:** #${completeResumeData.selectedTemplate}\n` +
              `👤 **Resume for:** ${
                completeResumeData.basics.name || "Unknown"
              }\n` +
              `📁 **Saved in folder:** ${folderPath || "root directory"}\n\n` +
              `The resume PDF is ready to use!`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text:
              `❌ **Error generating resume:** ${error.message}\n\n` +
              `Please check:\n` +
              `• That pdflatex is installed (run: which pdflatex)\n` +
              `• That all required fields are filled\n` +
              `• The resume data structure is correct\n` +
              `• The specified folder path is valid`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Resume Generator MCP server running on stdio");
  }
}

const server = new ResumeGeneratorServer();
server.run().catch(console.error);
