/**
 * Locked Resume Content Templates
 *
 * These are LOCKED bullet points that should never be modified by LLM.
 * Instead of sending full text to LLM, we send template IDs like {{freefly.1}}
 * The template expander replaces IDs with full text before PDF generation.
 *
 * Source: baseline-resume-data.json (locked content)
 * DO NOT MODIFY - These match LinkedIn and official records exactly
 */

export const LOCKED_TEMPLATES = {
  // Freefly Systems - Bullets 2, 3, 4 (LOCKED)
  // Bullet 1 is customizable, not in this registry
  "freefly.1": "Contributed to drone platform codebases implementing new features and optimizations for flight control systems and payload integration across multiple product lines, managed software integration projects from planning through release",

  "freefly.2": "Led release management for drone platforms overseeing testing phases from alpha through production deployment, coordinating firmware updates and executing comprehensive testing protocols with cross-functional teams",

  "freefly.3": "Built automated systems to process complex technical data and identify system failures, developing knowledge base enhancements and support tools that streamlined operations",

  // Lumenier - Both bullets (LOCKED)
  "lumenier.0": "Wrote embedded code in C++ to integrate LiDAR and optical flow sensors for obstacle avoidance and position holding with/without GPS under various lighting conditions",

  "lumenier.1": "Collaborated with open-source flight control software maintainers for integration, testing, and deployment of autonomous flight algorithms, prototyped innovative features like toss-to-launch for product roadmap development",

  // York Exponential - Both bullets (LOCKED)
  "york.0": "Developed prototype software for in-house autonomous surveillance mobile robots using ROS2, SLAM, and computer vision technologies",

  "york.1": "Built Human Machine Interface for Universal Robot welding applications using Python and Kivy framework, implemented multi-robot control systems with platform independence",

  // Freefly Bullet 1 variations (customizable, but can be locked for specific roles)
  "freefly.ai_engineer": "Built and deployed GenAI-powered agent for automated log analysis from concept to production, integrating foundation model APIs (Ollama, Llama 3.2) with evaluation frameworks and model governance practices, serving 200+ daily queries",

  "freefly.software_product": "Developed comprehensive diagnostic and analysis tools for engineering teams, independently designed and built AI-powered diagnostic tool using Python and modern LLM frameworks from requirements to production, improving customer self-service capabilities and team response times by 40%",
};

/**
 * Template ID patterns:
 * - {{freefly.0}} - Freefly bullet 1 (customizable)
 * - {{freefly.1}} - Freefly bullet 2 (locked)
 * - {{freefly.2}} - Freefly bullet 3 (locked)
 * - {{freefly.3}} - Freefly bullet 4 (locked)
 * - {{lumenier.0}} - Lumenier bullet 1 (locked)
 * - {{lumenier.1}} - Lumenier bullet 2 (locked)
 * - {{york.0}} - York bullet 1 (locked)
 * - {{york.1}} - York bullet 2 (locked)
 */
