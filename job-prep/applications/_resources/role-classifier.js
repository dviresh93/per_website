/**
 * Role Classifier
 *
 * Classifies job postings into role types to load only relevant context.
 * This reduces token usage by loading only what's needed for each role.
 *
 * Phase 1.3: Job-Aware Context Loading
 */

/**
 * Role type definitions with keywords and context requirements
 */
export const ROLE_TYPES = {
  AI_ENGINEER: {
    id: "ai_engineer",
    name: "AI Engineer",
    keywords: [
      "ai engineer",
      "machine learning",
      "ml engineer",
      "langchain",
      "llm",
      "large language model",
      "generative ai",
      "genai",
      "prompt engineering",
      "rag",
      "retrieval augmented",
      "multi-agent",
      "agentic",
      "mlops",
      "model deployment",
    ],
    contextRules: [
      "Emphasize AI/ML Frameworks section first",
      "Use ai_engineer variation for Freefly bullet 1",
      "Select projects: GridCOP, Production Tool, AI Travel Planner",
      "Highlight: LangChain, RAG, Multi-agent systems",
    ],
  },
  ROBOTICS_ENGINEER: {
    id: "robotics_engineer",
    name: "Robotics Engineer",
    keywords: [
      "robotics",
      "embedded",
      "px4",
      "ros",
      "ros2",
      "drone",
      "uav",
      "autonomous",
      "flight control",
      "real-time",
      "firmware",
      "c++",
      "sensor fusion",
      "slam",
      "computer vision",
    ],
    contextRules: [
      "Emphasize Programming and Embedded sections",
      "Use software_product variation for Freefly bullet 1",
      "Select projects: Flight Control, GridCOP, Production Tool",
      "Highlight: C++, PX4, ROS2, Real-time systems",
    ],
  },
  FULL_STACK_ENGINEER: {
    id: "full_stack",
    name: "Full-Stack Engineer",
    keywords: [
      "full stack",
      "full-stack",
      "fullstack",
      "frontend",
      "backend",
      "react",
      "javascript",
      "typescript",
      "node.js",
      "api",
      "web development",
      "software engineer",
      "product engineer",
    ],
    contextRules: [
      "Balance all skill sections",
      "Use software_product variation for Freefly bullet 1",
      "Select projects: Production Tool, GridCOP, AI Travel Planner",
      "Highlight: React, Python, Flask, FastAPI",
    ],
  },
  FORWARD_DEPLOYED_ENGINEER: {
    id: "forward_deployed",
    name: "Forward Deployed Engineer",
    keywords: [
      "forward deployed",
      "field engineer",
      "customer facing",
      "implementation",
      "integration",
      "consulting",
      "solutions engineer",
    ],
    contextRules: [
      "Emphasize cross-functional collaboration",
      "Highlight customer interaction and deployment",
      "Select projects with impact metrics",
      "Focus on end-to-end delivery",
    ],
  },
  ML_ENGINEER: {
    id: "ml_engineer",
    name: "ML Engineer",
    keywords: [
      "machine learning engineer",
      "ml engineer",
      "data scientist",
      "pytorch",
      "tensorflow",
      "model training",
      "feature engineering",
      "mlops",
      "model evaluation",
    ],
    contextRules: [
      "Emphasize AI/ML Frameworks",
      "Use ai_engineer variation for Freefly bullet 1",
      "Select projects: GridCOP, Production Tool",
      "Highlight: Model evaluation, MLOps, Production deployment",
    ],
  },
};

/**
 * Classify a job posting into a role type
 *
 * @param {string} jobTitle - Job title from posting
 * @param {string} jobDescription - Full job description
 * @returns {Object} Role type object with classification
 */
export function classifyRole(jobTitle, jobDescription = "") {
  // Combine title and description for analysis
  const searchText = `${jobTitle} ${jobDescription}`.toLowerCase();

  // Score each role type based on keyword matches
  const scores = {};
  for (const [key, roleType] of Object.entries(ROLE_TYPES)) {
    let score = 0;

    for (const keyword of roleType.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    scores[key] = score;
  }

  // Find role type with highest score
  let bestMatch = "FULL_STACK_ENGINEER"; // Default fallback
  let maxScore = 0;

  for (const [key, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestMatch = key;
    }
  }

  const roleType = ROLE_TYPES[bestMatch];

  return {
    roleType: roleType.id,
    roleName: roleType.name,
    confidence: maxScore,
    contextRules: roleType.contextRules,
    matchedKeywords: roleType.keywords.filter((kw) =>
      searchText.includes(kw.toLowerCase())
    ),
  };
}

/**
 * Get context loading instructions based on role type
 *
 * @param {string} roleTypeId - Role type ID (e.g., "ai_engineer")
 * @returns {Object} Context loading instructions
 */
export function getContextForRole(roleTypeId) {
  const roleType = Object.values(ROLE_TYPES).find((r) => r.id === roleTypeId);

  if (!roleType) {
    // Fallback to full-stack
    return ROLE_TYPES.FULL_STACK_ENGINEER.contextRules;
  }

  return {
    roleType: roleType.id,
    roleName: roleType.name,
    rules: roleType.contextRules,
  };
}

/**
 * Example usage:
 *
 * const jobTitle = "Senior AI Engineer";
 * const jobDescription = "We're looking for an AI Engineer with experience in LangChain, RAG, and multi-agent systems...";
 *
 * const classification = classifyRole(jobTitle, jobDescription);
 * console.log(classification);
 * // {
 * //   roleType: "ai_engineer",
 * //   roleName: "AI Engineer",
 * //   confidence: 6,
 * //   contextRules: [...],
 * //   matchedKeywords: ["ai engineer", "langchain", "rag", "multi-agent"]
 * // }
 *
 * // Use context rules to load only relevant sections
 * const context = getContextForRole(classification.roleType);
 */
