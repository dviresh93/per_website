# Agent Debugging & Monitoring Tools - Quick Reference

**For:** Forward Networks Interview Prep
**Focus:** LangSmith and production LLM observability tools

---

## Why This Matters for Forward Networks

The interviewer has:
- Built **self-hosted LLM systems** at scale
- Developed **custom tooling for model evaluation**
- **Monitors models in production**
- Works on **multi-step LLM workflows** (code generation, conversational agents)

**They WILL ask:** "How do you debug and monitor LLM agents in production?"

---

## LANGSMITH - The Main Tool

### What is LangSmith?

**Official description:** LangChain's observability platform for debugging, testing, and monitoring LLM applications

**Think of it as:** "Chrome DevTools for LLM agents"

**Built by:** LangChain (same company behind LangChain framework)
**Pricing:** Free tier (limited traces), Paid plans for production

### Core Capabilities

#### 1. **TRACING** (Most Important Feature)

**What it does:** Records every step of your LLM application execution

**Example trace hierarchy:**
```
User Query: "Show me all routers with high CPU"
│
├─ Agent Execution
│  ├─ LLM Call #1: Planning
│  │  ├─ Input: System prompt + user query
│  │  ├─ Output: "I should use the search_routers tool"
│  │  ├─ Token usage: 150 input, 20 output
│  │  ├─ Latency: 1.2s
│  │  └─ Cost: $0.003
│  │
│  ├─ Tool Call: search_routers(cpu_threshold=80)
│  │  ├─ Input params: {"cpu_threshold": 80}
│  │  ├─ Output: [Router1, Router2, Router3]
│  │  └─ Latency: 0.3s
│  │
│  └─ LLM Call #2: Response formatting
│     ├─ Input: Tool results + formatting instructions
│     ├─ Output: "I found 3 routers with CPU > 80%..."
│     ├─ Token usage: 200 input, 50 output
│     └─ Latency: 0.8s
│
└─ Total: 2.3s, $0.005, 420 tokens
```

**Why this is powerful:**
- See EXACTLY what the LLM saw (full prompts)
- Identify bottlenecks (which LLM call is slow?)
- Debug failures (where did agent go wrong?)
- Track costs per query

#### 2. **DATASETS & EVALUATION**

**What it does:** Store test cases, run evals, compare model versions

**Workflow:**
```python
# 1. Create dataset
from langsmith import Client

client = Client()
dataset = client.create_dataset("NQE Query Generation Test Set")

# Add examples
client.create_examples(
    dataset_id=dataset.id,
    inputs=[
        {"user_query": "Show all routers"},
        {"user_query": "Find devices with high memory usage"},
    ],
    outputs=[
        {"expected_nqe": "devices where type == 'router'"},
        {"expected_nqe": "devices where memory > 80"},
    ]
)

# 2. Run evaluation
from langchain.smith import RunEvalConfig

eval_config = RunEvalConfig(
    evaluators=[
        "qa",  # Built-in: answer relevance
        "criteria",  # Custom: syntax correctness
    ]
)

# 3. Compare results across prompt versions
results = client.run_on_dataset(
    dataset_name="NQE Query Generation Test Set",
    llm_or_chain=your_chain,
    evaluation=eval_config
)
```

**Use cases:**
- Regression testing (does new prompt break old queries?)
- A/B testing (prompt v1 vs v2)
- Model comparison (GPT-4 vs Claude vs Llama)

#### 3. **PLAYGROUND** (Prompt Engineering)

**What it does:** Interactive prompt tester with version control

**Features:**
- Test prompts without writing code
- Side-by-side comparison of outputs
- Save prompt versions
- Share with team

**Example use:**
```
Prompt v1: "Generate an NQE query for: {user_input}"
Prompt v2: "You are an expert network engineer. Generate an NQE query that accomplishes: {user_input}. Use only valid NQE syntax."

Test on 10 examples → v2 wins → Deploy v2
```

#### 4. **MONITORING** (Production Dashboard)

**What it does:** Real-time monitoring of deployed agents

**Key metrics tracked:**
- Request volume (queries per hour)
- Latency distribution (p50, p95, p99)
- Error rates (% of failed traces)
- Token usage (cost per query)
- User feedback (thumbs up/down)

**Alerting:**
- Set alerts: "If error rate > 5%, notify team"
- Track regressions: "Latency increased 50% today"

#### 5. **FEEDBACK** (User Signals)

**What it does:** Collect user feedback on LLM outputs

**Implementation:**
```python
from langsmith import Client

client = Client()

# User clicks thumbs up
client.create_feedback(
    run_id=trace_id,
    key="user_rating",
    score=1.0,  # 1.0 = thumbs up, 0.0 = thumbs down
    comment="Query worked perfectly"
)

# Later: Filter traces by feedback
good_traces = client.list_runs(filter='feedback_key="user_rating" AND feedback_score=1.0')
```

**Use cases:**
- Identify high-quality outputs (use as training data)
- Find failure patterns (analyze thumbs-down traces)
- Measure user satisfaction over time

---

## HOW TO USE LANGSMITH WITH LANGCHAIN

### Basic Setup

```python
import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, Tool
from langchain.callbacks import LangChainTracer

# 1. Set LangSmith env vars
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-api-key"
os.environ["LANGCHAIN_PROJECT"] = "Forward-NQE-Generation"  # Project name

# 2. Build your agent (traces automatically)
llm = ChatOpenAI(model="gpt-4")

tools = [
    Tool(
        name="GenerateNQE",
        func=generate_nqe_query,
        description="Generates NQE query from natural language"
    )
]

agent = initialize_agent(tools, llm, agent="openai-functions")

# 3. Run agent (automatically traced!)
result = agent.run("Show me all routers with high CPU")

# 4. Check LangSmith UI - trace appears automatically
```

**That's it!** No complex instrumentation needed if you use LangChain.

### Advanced: Custom Tracing

```python
from langsmith import traceable

@traceable(name="NQE Generation", project_name="Forward-NQE")
def generate_nqe(user_input: str) -> dict:
    """Custom function with tracing"""

    # Step 1: Parse user intent (traced)
    intent = parse_intent(user_input)

    # Step 2: Retrieve examples (traced)
    examples = retrieve_similar_queries(user_input)

    # Step 3: Generate query (traced)
    nqe_query = llm.generate(intent, examples)

    # Step 4: Validate (traced)
    is_valid = validate_nqe_syntax(nqe_query)

    return {
        "query": nqe_query,
        "valid": is_valid,
        "confidence": 0.95
    }
```

**Result:** LangSmith shows all 4 steps as nested spans

---

## ALTERNATIVE TOOLS

### 1. **Weights & Biases (W&B)** - ML Experiment Tracking

**What it's good for:**
- Fine-tuning experiments (track loss, learning rate, etc.)
- Model comparison (10 runs with different hyperparameters)
- Dataset versioning

**Not ideal for:**
- Real-time agent tracing (not built for LLM agents)
- Production monitoring

**When to use:** If you're fine-tuning models, W&B is better than LangSmith

### 2. **Phoenix (Arize AI)** - Open Source Alternative

**What it is:** Open-source LLM observability (like LangSmith but free)

**Features:**
- Tracing (similar to LangSmith)
- Embeddings visualization
- Retrieval quality analysis (for RAG)

**Pros:**
- Free and open source
- Self-hosted (data privacy)
- Great for RAG debugging

**Cons:**
- Less mature than LangSmith
- Smaller community

**When to use:** If you need free/self-hosted observability

### 3. **LangFuse** - Open Source LLM Tracking

**What it is:** Another open-source alternative to LangSmith

**Features:**
- Tracing, metrics, user feedback
- Cost tracking
- Prompt management

**Pros:**
- Open source, self-hostable
- LangChain integration
- Good UI

**When to use:** Alternative to Phoenix for self-hosted

### 4. **Helicone** - Lightweight LLM Monitoring

**What it is:** API proxy for OpenAI/Anthropic with built-in logging

**How it works:**
```python
# Instead of:
# base_url = "https://api.openai.com/v1"

# Use:
base_url = "https://oai.hconeai.com/v1"
headers = {"Helicone-Auth": "Bearer YOUR_KEY"}
```

**Pros:**
- One-line integration
- Automatic cost tracking
- No SDK changes needed

**Cons:**
- Only for API-based LLMs (not self-hosted)
- Less detailed than LangSmith

### 5. **Custom Logging** (DIY Approach)

**What you'd build:**
```python
import time
import json
from datetime import datetime

class LLMTracer:
    def __init__(self, trace_id):
        self.trace_id = trace_id
        self.spans = []

    def start_span(self, name):
        return {
            "name": name,
            "start_time": time.time(),
            "trace_id": self.trace_id
        }

    def end_span(self, span, result, metadata=None):
        span["end_time"] = time.time()
        span["duration"] = span["end_time"] - span["start_time"]
        span["result"] = result
        span["metadata"] = metadata
        self.spans.append(span)

    def save(self):
        # Write to DB or file
        with open(f"traces/{self.trace_id}.json", "w") as f:
            json.dump(self.spans, f)

# Usage
tracer = LLMTracer(trace_id="abc123")

span = tracer.start_span("LLM Call")
result = llm.generate(prompt)
tracer.end_span(span, result, metadata={"tokens": 150, "cost": 0.003})

tracer.save()
```

**When to use:** When you need full control or can't use third-party tools

---

## COMPARISON TABLE

| Tool | Best For | Cost | Self-Hosted? | RAG Support | Agent Tracing |
|------|----------|------|--------------|-------------|---------------|
| **LangSmith** | LangChain users, production monitoring | $$ (free tier) | No | ✓✓ | ✓✓✓ |
| **Phoenix** | RAG debugging, embedding analysis | Free | Yes | ✓✓✓ | ✓ |
| **LangFuse** | Self-hosted LangSmith alternative | Free | Yes | ✓✓ | ✓✓ |
| **W&B** | Fine-tuning experiments, ML research | $$ (free tier) | No | ✗ | ✗ |
| **Helicone** | Quick API monitoring | $ | No | ✓ | ✓ |
| **Custom** | Full control, compliance requirements | Free (dev time) | Yes | Custom | Custom |

---

## INTERVIEW STRATEGY

### If You've Used LangSmith:
✅ **Talk specifics:**
- "In GridCOP, I used LangSmith to trace agent decisions. The trace view showed me that 60% of latency was in the retrieval step, not LLM inference - that's how I knew to optimize the vector search first."
- Show you understand: Tracing → Identify bottleneck → Optimize

### If You Haven't Used LangSmith (But Used Something Else):
✅ **Show transferable skills:**
- "I haven't used LangSmith specifically, but I've done similar observability work. At Freefly, I built custom logging to track: prompt → retrieval → LLM → validation. I logged token usage, latency per step, and user feedback. LangSmith would've made this easier with built-in tracing."

### If You Haven't Used Any Tool:
✅ **Show you understand the concepts:**
- "I haven't used LangSmith yet, but I understand the value. In production, you need visibility into: What prompt did the LLM see? What did it return? How long did each step take? Where did it fail?"
- "For Forward's NQE generation, I'd use LangSmith to: (1) Trace each generation attempt, (2) Build a dataset of good queries for regression testing, (3) Monitor production latency and costs"

---

## KEY QUESTIONS YOU MIGHT FACE

### Q1: "How do you debug a failing LLM agent?"

**Answer with LangSmith:**
"I'd start with LangSmith tracing to see the full execution path:
1. Check the trace: Which step failed? Tool call? LLM inference?
2. Inspect the prompt: Did the LLM see the right context?
3. Look at outputs: Was it a parsing error, or wrong reasoning?
4. Check similar failures: Use LangSmith's filter to find patterns

Example from GridCOP: Agent kept failing to retrieve grid data. LangSmith trace showed the tool was being called with wrong parameters - the LLM was hallucinating parameter names. Fixed by improving tool descriptions in the prompt."

### Q2: "How do you monitor LLM agents in production?"

**Answer:**
"Multi-layered approach:

**Real-time metrics (LangSmith dashboard):**
- Request volume (detect traffic spikes)
- Latency (p50, p95, p99 - catch slow queries)
- Error rates (% of traces that failed)
- Token usage (cost tracking)

**User feedback:**
- Thumbs up/down on outputs
- Track satisfaction trends over time
- Analyze thumbs-down cases for patterns

**Quality metrics:**
- For NQE: Syntax correctness rate (% of queries that parse)
- Execution success rate (% that run without error)
- Edit distance (how much users modify outputs)

**Alerting:**
- If error rate > 5%: Immediate Slack alert
- If latency p95 increases 50%: Investigate bottleneck
- If cost per query doubles: Check for prompt bloat

At Freefly, we tracked: Usage (200+ daily users), retrieval quality (similarity scores), and user feedback (thumbs up/down). If we'd used LangSmith, we'd have gotten all this out-of-the-box plus better trace visibility."

### Q3: "How do you do A/B testing on prompts?"

**Answer:**
"LangSmith makes this straightforward:

**Setup:**
1. Create dataset with 50-100 test queries
2. Define success criteria (syntax correctness, user rating, latency)
3. Run prompt v1 and v2 against same dataset
4. Compare metrics side-by-side

**Example for NQE:**
```
Prompt A: Simple instruction
Prompt B: Few-shot with examples
Prompt C: Chain-of-thought reasoning

Test on dataset:
- Prompt A: 85% syntax correctness, 2.1s latency
- Prompt B: 92% syntax correctness, 2.5s latency ← Winner
- Prompt C: 89% syntax correctness, 3.8s latency (too slow)
```

**Gradual rollout:**
- Deploy Prompt B to 10% of users
- Monitor for regressions
- If no issues after 1 week → 100% rollout

Without LangSmith, I'd do this manually: Log outputs, run evaluation script, compare results in spreadsheet. LangSmith automates the tedious parts."

### Q4: "What's your experience with LLM observability tools?"

**If limited experience:**
"I haven't used LangSmith extensively in production yet, but I've built similar observability for my projects:

**At Freefly:**
- Custom logging: Every query logged with timestamp, prompt, retrieval results, LLM output
- Metrics: Tracked latency per component (embed, search, LLM, post-process)
- User feedback: Thumbs up/down stored in database
- Analysis: Weekly review of failures to improve prompts

**What I'd do with LangSmith:**
- Replace custom logging with automatic tracing
- Use dataset evaluation for regression testing
- Leverage built-in cost tracking
- Set up real-time alerts

I'm eager to learn LangSmith properly - I've seen demos and read the docs, but haven't had a production use case yet. At Forward, with self-hosted LLM systems at scale, proper observability would be critical."

---

## QUICK WINS TO MENTION

**Show you think about production:**

✅ **"Observability is not optional for production LLMs"**
- You can't debug what you can't see
- Cost can spiral without tracking

✅ **"I'd set up tracing from day one"**
- Even in development, traces help iterate faster
- Don't wait until production to add observability

✅ **"User feedback is the ground truth"**
- Metrics matter, but user satisfaction matters more
- Build feedback loops early

✅ **"Regression testing prevents quality drops"**
- When you change prompts, test against known-good examples
- Catch regressions before users do

---

## RESOURCES TO SKIM BEFORE INTERVIEW

**LangSmith:**
- Docs: https://docs.smith.langchain.com/
- Quickstart (5 min read): https://docs.smith.langchain.com/tracing
- YouTube: Search "LangSmith tutorial" (10 min video)

**Phoenix (if you have 15 min):**
- Demo: https://phoenix.arize.com/
- GitHub: https://github.com/Arize-ai/phoenix

**Key concept to understand:**
- What is a "trace"? (Nested execution tree)
- What is a "span"? (Single step in trace, like LLM call)
- What is "observability"? (Visibility into system behavior)

---

## CONNECTING TO YOUR PROJECTS

### GridCOP:
"For GridCOP's multi-agent system, LangSmith would've been invaluable:
- Trace agent coordination: See supervisor decisions
- Debug tool calls: Inspect parameters passed to grid data tools
- Optimize latency: Identify which agent was the bottleneck
- Track costs: Multi-agent systems can get expensive fast"

### Freefly:
"At Freefly, we built custom logging, but LangSmith would've saved time:
- Automatic RAG tracing: See which log chunks were retrieved
- User feedback: Built-in thumbs up/down instead of custom DB
- Cost tracking: Track Ollama inference costs (self-hosted)
- Dataset eval: Test prompt changes against historical queries"

---

## FINAL TALKING POINTS

**Your message:**

"I understand that production LLM systems need observability. At Freefly, I built custom logging to track query → retrieval → generation pipeline. If I were to rebuild it today, I'd use LangSmith for automatic tracing, or Phoenix for self-hosted observability.

For Forward's AI Assist, proper monitoring is critical:
- **Tracing:** Debug NQE generation failures
- **Evaluation:** Regression test prompt changes
- **Monitoring:** Track latency, cost, success rates
- **Feedback:** Collect user signals to improve

I'm comfortable with observability concepts - I just haven't used LangSmith specifically at scale yet. But I'm a fast learner, and I'd prioritize getting LangSmith (or similar) set up early at Forward."

---

**KEY TAKEAWAY:** Even if you haven't used these tools extensively, show you understand WHY they matter (debugging, monitoring, cost control) and HOW you'd use them (tracing, evaluation, feedback loops). That's what the interviewer cares about.
