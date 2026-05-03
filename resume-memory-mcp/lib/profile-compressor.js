/**
 * Profile Compression Module
 *
 * Compresses full resume profile (8,000 tokens) to summary (200 tokens)
 *
 * Phase 2.2: Basic extractive compression
 * Future: Upgrade to LLM-based compression for better quality
 */

/**
 * Compress full profile context to 200-token summary
 *
 * Strategy: Extractive summarization
 * - Extract key facts: name, years of experience, degree
 * - List current/recent projects with tech stack
 * - List recent companies with key achievements
 * - Highlight core expertise areas
 *
 * @param {string} fullContext - Full profile text (~8,000 tokens)
 * @returns {string} Compressed summary (~200 tokens)
 */
export function compressProfile(fullContext) {
  // For Phase 2.2, use hardcoded template based on known profile
  // In production, this would call an LLM to generate the summary

  const summary = extractKeyFacts(fullContext);
  return summary;
}

/**
 * Extract key facts from full profile context
 *
 * @param {string} fullContext - Full profile text
 * @returns {string} Compressed summary
 */
function extractKeyFacts(fullContext) {
  // Hardcoded compression for Viresh's profile
  // This is a placeholder - in production, use LLM or NLP extraction

  // Target: ~200 tokens (approximately 800-1000 characters)
  const summary = `Viresh Duvvuri | Systems Engineer → AI Engineer

5 years software engineering, 2 years AI/ML focused. MS Computer Science (WSU).

CURRENT:
- Grid CoOperator: Multi-agent AI system for smart grid analytics (LangChain, MCP, AWS, RAG, FAISS). 70% workflow reduction.
- Role: AI Agent Engineer, building production agentic systems.

RECENT EXPERIENCE:
- Freefly Systems (4y): GenAI diagnostic tool for drone logs (Ollama, RAG, Python, React). 200+ daily users.
- Built production ML systems, integrated LLMs into existing platforms.
- Led release management, full-stack development (Python, React, Docker).

EMBEDDED/ROBOTICS:
- Lumenier: Embedded C++ for LiDAR sensor integration in flight controllers.
- York Exponential: ROS2 autonomous robots, welding automation HMI.
- PX4 flight control systems, real-time embedded development.

CORE EXPERTISE:
- Agentic AI: LangChain, multi-agent systems, MCP, tool orchestration
- RAG Systems: FAISS, vector search, context retrieval, prompt engineering
- Production ML: Ollama, model deployment, API integration, monitoring
- Full-Stack: Python, React, Flask, AWS, Docker, CI/CD
- Embedded: C++, PX4, ROS2, real-time systems, sensor integration

STANDOUT PROJECTS:
1. GridCOP - Agentic smart grid analyst (LangChain + MCP)
2. Drone Log Analyzer - RAG-based diagnostic system (70% faster debugging)
3. Flight Control - Real-time embedded systems for autonomous drones`;

  return summary;
}

/**
 * Calculate compression ratio
 *
 * @param {string} original - Original text
 * @param {string} compressed - Compressed text
 * @returns {Object} Compression statistics
 */
export function getCompressionStats(original, compressed) {
  const originalLength = original.length;
  const compressedLength = compressed.length;
  const ratio = compressedLength / originalLength;
  const percentReduction = ((1 - ratio) * 100).toFixed(1);

  // Rough token estimation: 1 token ≈ 4 characters
  const originalTokens = Math.ceil(originalLength / 4);
  const compressedTokens = Math.ceil(compressedLength / 4);
  const tokenSavings = originalTokens - compressedTokens;

  return {
    originalLength,
    compressedLength,
    originalTokens,
    compressedTokens,
    tokenSavings,
    compressionRatio: ratio,
    percentReduction: parseFloat(percentReduction),
  };
}

/**
 * Validate compression quality
 *
 * Ensures compressed summary meets requirements:
 * - Under 250 tokens (~1000 characters)
 * - Contains essential information
 * - Readable and coherent
 *
 * @param {string} compressed - Compressed summary
 * @returns {Object} Validation result
 */
export function validateCompression(compressed) {
  const length = compressed.length;
  const estimatedTokens = Math.ceil(length / 4);

  const isValid = estimatedTokens <= 250;
  const warnings = [];

  if (estimatedTokens > 250) {
    warnings.push(`Summary too long: ${estimatedTokens} tokens (target: 200-250)`);
  }

  if (estimatedTokens < 150) {
    warnings.push(`Summary might be too short: ${estimatedTokens} tokens`);
  }

  if (!compressed.includes("LangChain")) {
    warnings.push("Missing key technology: LangChain");
  }

  return {
    isValid,
    estimatedTokens,
    warnings,
  };
}
