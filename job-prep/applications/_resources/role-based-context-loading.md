# Role-Based Context Loading Guide

**Phase 1.3: Job-Aware Context Loading**
**Token Savings:** ~600 tokens per resume generation

---

## How It Works

Instead of loading ALL rules and context for every job, we now:

1. **Classify the job posting** into a role type (AI Engineer, Robotics, etc.)
2. **Load only relevant context** for that role type
3. **Skip unnecessary sections** that don't apply

**Result:** ~600 tokens saved by not loading irrelevant context

---

## Role Types

| Role Type | When to Use | Context Loaded |
|-----------|-------------|----------------|
| **AI Engineer** | LangChain, RAG, LLM, GenAI, Multi-agent | AI/ML frameworks first, GridCOP project, ai_engineer variation |
| **Robotics Engineer** | PX4, ROS, Embedded, Drones, Firmware | Programming first, Flight Control project, software_product variation |
| **Full-Stack Engineer** | React, Node.js, API, Web Dev | Balanced skills, Production Tool project |
| **Forward Deployed** | Customer-facing, Implementation, Field | Cross-functional focus, Impact metrics |
| **ML Engineer** | PyTorch, Model Training, Feature Engineering | AI/ML frameworks, Model evaluation focus |

---

## Usage in Resume Generation Workflow

### Step 1: Classify Job Posting

```javascript
import { classifyRole } from './role-classifier.js';

const jobTitle = "Senior AI Engineer";
const jobDescription = `
We're looking for an AI Engineer with experience in:
- LangChain and multi-agent systems
- RAG architectures
- Production LLM deployment
- AWS infrastructure
`;

const classification = classifyRole(jobTitle, jobDescription);
console.log(classification);
// {
//   roleType: "ai_engineer",
//   roleName: "AI Engineer",
//   confidence: 6,
//   contextRules: [
//     "Emphasize AI/ML Frameworks section first",
//     "Use ai_engineer variation for Freefly bullet 1",
//     "Select projects: GridCOP, Production Tool, AI Travel Planner",
//     "Highlight: LangChain, RAG, Multi-agent systems"
//   ],
//   matchedKeywords: ["ai engineer", "langchain", "rag", "multi-agent", "llm", "genai"]
// }
```

### Step 2: Load Only Relevant Context

**For AI Engineer role:**
```markdown
LOAD:
- baseline-resume-rules.md (sections: AI customization, project selection)
- Skills order: AI/ML Frameworks → Programming → Cloud
- Freefly variation: ai_engineer
- Projects: GridCOP, Production Tool, AI Travel Planner

SKIP:
- Robotics-specific rules
- Embedded systems focus
- C++ emphasis
```

**Token savings:** ~600 tokens (skipped irrelevant context)

### Step 3: Generate Resume with Filtered Context

**Old workflow:**
```
Load ALL rules (2,000 tokens) → Generate resume
```

**New workflow:**
```
Classify role → Load relevant rules (1,400 tokens) → Generate resume
Savings: 600 tokens
```

---

## Implementation in Resume Agent

Update `.claude/agents/resume-agent.md` or `.claude/commands/apply.md`:

```markdown
## Step 0: Classify Job Posting (NEW!)

Before loading any context:

1. Extract job title and description from posting
2. Call role classifier:
   ```javascript
   const classification = classifyRole(jobTitle, jobDescription);
   ```
3. Note the role type: {classification.roleType}
4. Note context rules: {classification.contextRules}

## Step 1: Load Relevant Context Only

Based on role type `{classification.roleType}`:

- Load `baseline-resume-rules.md`
- Apply role-specific customization rules:
  - Skills order: {from contextRules}
  - Project selection: {from contextRules}
  - Freefly variation: {from contextRules}

IMPORTANT: Only load sections relevant to this role type.
Skip sections for other role types.

## Step 2: Generate Resume

Use filtered context to generate resume JSON.
```

---

## Context Loading Rules by Role

### AI Engineer

**Load:**
- AI/ML Frameworks skills section (full detail)
- GridCOP project details
- Production Tool project details
- AI Travel Planner project details
- Freefly ai_engineer variation

**Skip:**
- Detailed C++ embedded context
- Robotics-specific terminology guides
- Firmware development rules

**Token savings:** ~650 tokens

---

### Robotics Engineer

**Load:**
- Programming skills section (C++ emphasis)
- Flight Control project details
- Embedded systems rules
- Real-time systems context
- Freefly software_product variation

**Skip:**
- LangChain/RAG detailed guides
- GenAI terminology
- Web development context

**Token savings:** ~550 tokens

---

### Full-Stack Engineer

**Load:**
- Balanced skill sections
- Production Tool project (React + Flask)
- API design context
- Freefly software_product variation

**Skip:**
- Deep AI/ML theory
- Embedded systems details
- Robotics-specific rules

**Token savings:** ~600 tokens

---

## Example: AI Engineer Application

**Job Posting:**
```
Title: Senior AI Engineer
Description: Build production GenAI systems using LangChain, RAG, and multi-agent architectures on AWS.
```

**Workflow:**

1. **Classify:**
   ```javascript
   const classification = classifyRole(
     "Senior AI Engineer",
     "Build production GenAI systems using LangChain, RAG, and multi-agent architectures on AWS."
   );
   // Result: ai_engineer (confidence: 5)
   ```

2. **Load Context:**
   - `baseline-resume-rules.md` (filtered to AI sections only)
   - Skills order: AI/ML Frameworks first
   - Projects: GridCOP, Production Tool, AI Travel Planner
   - Freefly variation: ai_engineer

3. **Generate Resume:**
   - LLM receives only AI-relevant context (~1,400 tokens)
   - Skips robotics/embedded context (~600 tokens)
   - Total input: 1,400 tokens (vs 2,000 tokens before)

**Savings:** 600 tokens

---

## Testing

Test role classification with different job postings:

```javascript
// Test 1: AI Engineer
const test1 = classifyRole(
  "AI Engineer",
  "LangChain, RAG, multi-agent systems"
);
console.assert(test1.roleType === "ai_engineer");

// Test 2: Robotics Engineer
const test2 = classifyRole(
  "Robotics Software Engineer",
  "PX4, ROS2, embedded C++, drone control"
);
console.assert(test2.roleType === "robotics_engineer");

// Test 3: Full-Stack Engineer
const test3 = classifyRole(
  "Full-Stack Engineer",
  "React, Node.js, API development"
);
console.assert(test3.roleType === "full_stack");
```

---

## Benefits

1. **Token Savings:** ~600 tokens per resume
2. **Faster Generation:** Less context to process
3. **Better Focus:** Only relevant examples loaded
4. **Cleaner Output:** LLM doesn't get distracted by irrelevant content

---

## Integration Checklist

- [x] Create role-classifier.js
- [ ] Update resume agent to use classifier
- [ ] Test with 3 different role types
- [ ] Verify token savings (~600 tokens)
- [ ] Document which sections are loaded for each role

---

**Created:** 2025-11-04
**Phase:** 1.3 (Job-Aware Context Loading)
**Token Savings:** ~600 tokens per resume
**Status:** Ready to integrate into resume workflow
