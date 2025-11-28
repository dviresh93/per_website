# AI Concepts Deep Dive - Interview Prep

**For:** Forward Networks Interview
**Focus:** LoRA, RLHF, Fine-tuning, and Production AI Concepts

**Interviewer's Background:**
- Master's thesis: RL for code generation
- Does instruction tuning with synthetic data
- Self-hosts LLMs at scale
- Custom model evaluation frameworks

---

## 1. LoRA (Low-Rank Adaptation)

### What is LoRA?

**Problem it solves:**
- Fine-tuning GPT-3.5 (7B params) requires updating all 7 billion parameters
- Needs massive GPU memory (100+ GB)
- Takes days/weeks to train
- Expensive (thousands of dollars)

**LoRA's solution:**
- Freeze the original model (all 7B parameters stay unchanged)
- Add small "adapter" matrices that are trained
- Only train ~0.1-1% of total parameters
- Results are nearly as good as full fine-tuning

### How LoRA Works (Conceptual)

**Traditional fine-tuning:**
```
Original weight matrix W (4096 x 4096) → Update all 16M parameters
```

**LoRA fine-tuning:**
```
Original W (4096 x 4096) → FROZEN
Add: A (4096 x 8) and B (8 x 4096) → Train only 65k parameters

Final output = W·x + (B·A)·x
              ↑      ↑
           frozen  trained (LoRA adapter)
```

**Key concept: Rank**
- The "8" in the middle is the rank (r)
- Lower rank = fewer parameters = faster/cheaper
- Higher rank = more capacity = better quality
- Typical: r = 8, 16, or 32

### LoRA Advantages

✅ **Efficiency:**
- Train 0.1% of parameters instead of 100%
- Single GPU instead of cluster
- Hours instead of days

✅ **Cost:**
- $50 instead of $5,000 for fine-tuning
- Less data needed (can work with 1k-10k examples)

✅ **Flexibility:**
- Keep base model frozen
- Train multiple adapters for different tasks
- Swap adapters on the fly (customer A vs customer B)

✅ **No catastrophic forgetting:**
- Base model capabilities preserved
- Adapter only adds new knowledge

### LoRA Disadvantages

❌ **Slightly lower quality:**
- 95-98% of full fine-tuning performance
- For some tasks, that 2-5% matters

❌ **Inference overhead:**
- Extra matrix multiplications (B·A)
- Can merge adapters into base model to avoid this

❌ **Limited for major behavior changes:**
- Good for: Adding domain knowledge, style adaptation
- Bad for: Completely changing model behavior

### When to Use LoRA

**Use LoRA when:**
- You have limited compute (single GPU)
- Budget is tight
- You need multiple task-specific adapters
- You want fast iteration (hours, not days)
- You're adding domain knowledge to existing capabilities

**Use full fine-tuning when:**
- You need maximum quality (and have budget)
- You're changing model behavior significantly
- You have access to large GPU clusters
- Training time doesn't matter

**Use RAG when:**
- Knowledge changes frequently
- You need interpretability (cite sources)
- You don't have training data
- You want instant updates (no retraining)

### Code Example (Conceptual)

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

# 1. Load base model (frozen)
base_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B")

# 2. Configure LoRA
lora_config = LoraConfig(
    r=16,  # Rank (how many parameters to add)
    lora_alpha=32,  # Scaling factor
    target_modules=["q_proj", "v_proj"],  # Which layers to adapt
    lora_dropout=0.1,
    bias="none",
    task_type="CAUSAL_LM"
)

# 3. Wrap model with LoRA adapters
model = get_peft_model(base_model, lora_config)

# 4. See parameter reduction
model.print_trainable_parameters()
# Output: trainable params: 4,194,304 || all params: 8,030,261,248 || trainable: 0.05%

# 5. Train normally (only adapters update)
trainer.train(model, train_dataset)

# 6. Save only the adapters (tiny file)
model.save_pretrained("./lora_adapters")  # Only 10 MB instead of 16 GB!
```

### For Forward Networks (NQE Code Generation)

**How you'd use LoRA:**
```
Base model: Llama-3-8B (general code knowledge)
↓
LoRA fine-tune on: 10k NQE query examples
↓
Result: Model that understands NQE syntax
```

**Advantages for NQE:**
- Fast iteration (try different ranks, hyperparameters)
- Multiple adapters: Basic queries (r=8), Advanced queries (r=16)
- Cost-effective for experimentation

---

## 2. RLHF (Reinforcement Learning from Human Feedback)

### What is RLHF?

**The problem:**
- You train an LLM on internet text
- It learns to predict next tokens
- But "predict next token" ≠ "be helpful and safe"
- Model might generate toxic, incorrect, or unhelpful outputs

**RLHF's solution:**
- Use human feedback to teach the model what "good" looks like
- Model learns to maximize human preferences
- This is how ChatGPT/Claude became helpful assistants

### How RLHF Works (3 Steps)

#### Step 1: Supervised Fine-Tuning (SFT)
```
Start: Base LLM (GPT-3)
↓
Human labelers write high-quality examples:
- Q: "Explain photosynthesis"
- A: [Detailed, accurate, well-structured answer]

Fine-tune model on these examples
↓
Result: Model that can follow instructions (but not perfectly)
```

#### Step 2: Train Reward Model
```
Human labelers rank outputs:
- Given prompt: "Explain photosynthesis"
- Model generates 4 answers
- Humans rank: A > C > B > D

Train reward model to predict human preferences:
- Input: (prompt, response)
- Output: Score (how good is this response?)

Result: Reward model that mimics human judgment
```

#### Step 3: RL Fine-Tuning (PPO)
```
Policy model (the LLM) generates responses
↓
Reward model scores them
↓
RL algorithm (PPO) updates policy to maximize reward
↓
Repeat for thousands of iterations
↓
Result: Model aligned with human preferences
```

### RLHF in Plain English

**Analogy:**
- You're training a dog
- Step 1 (SFT): Show the dog examples of good behavior
- Step 2 (Reward Model): Train yourself to recognize good vs bad behavior
- Step 3 (RL): Give treats when dog does well, corrections when it doesn't

### RLHF vs RLAIF

**RLAIF (RL from AI Feedback):**
- Replace human labelers with another AI (like GPT-4)
- Cheaper and faster
- Used by Anthropic for Constitutional AI

**Comparison:**
| Aspect | RLHF | RLAIF |
|--------|------|-------|
| Feedback source | Humans | AI model |
| Cost | High ($$$) | Low ($) |
| Scale | Limited by human time | Unlimited |
| Quality | Ground truth preferences | As good as AI judge |

### Interviewer's Experience: RL for Code Generation

**From his thesis:**
- Used RL to improve code translation quality
- Reward signal: Code compiles + passes tests
- Achieved 6.5% improvement in compilation rate

**Key insight:**
- Code has natural reward signals (compilation, tests)
- Don't need human labeling for everything
- Can use execution as feedback

### How This Applies to NQE

**RLHF for NQE generation:**

**Reward signals you could use:**

1. **Syntax correctness (automatic):**
   - Query parses → +1
   - Query doesn't parse → -1

2. **Execution correctness (automatic):**
   - Query runs without error → +0.5
   - Query crashes → -0.5

3. **Result correctness (requires ground truth):**
   - Returns expected devices → +1
   - Returns wrong results → -1

4. **Human feedback:**
   - User clicks "this was helpful" → +1
   - User clicks "this was wrong" → -1

**Implementation:**
```python
def reward_function(generated_query, expected_results, user_feedback):
    reward = 0

    # Syntax check
    if parses_correctly(generated_query):
        reward += 1
    else:
        return -2  # Major penalty

    # Execution check
    try:
        results = execute_nqe(generated_query, network_model)
        reward += 0.5
    except Exception:
        return -1  # Penalty for crashes

    # Result correctness
    if results == expected_results:
        reward += 1

    # Human feedback (if available)
    if user_feedback == "helpful":
        reward += 1
    elif user_feedback == "wrong":
        reward -= 1

    return reward

# Use this in RL training loop
```

### When to Use RLHF

**Use RLHF when:**
- You have clear reward signals (execution, tests, human feedback)
- Supervised fine-tuning isn't good enough
- You need to optimize for specific outcomes (safety, helpfulness)
- You have budget for human labeling OR automatic rewards

**Don't use RLHF when:**
- You don't have reward signals
- Supervised fine-tuning works well enough
- You don't have RL expertise (it's complex)

---

## 3. Fine-Tuning Techniques Spectrum

### Quick Comparison

| Technique | Parameters Trained | Cost | Time | Use Case |
|-----------|-------------------|------|------|----------|
| **Prompting** | 0 | $ | Instant | Quick prototyping |
| **RAG** | 0 | $ | Instant | Knowledge updates |
| **Few-shot** | 0 | $ | Instant | Simple tasks |
| **LoRA** | 0.1-1% | $$ | Hours | Domain adaptation |
| **Full Fine-tuning** | 100% | $$$$ | Days | Major behavior change |
| **RLHF** | 100% | $$$$$ | Weeks | Alignment, preferences |

### Decision Tree

```
Do you need the model to learn new behavior?
├─ NO → Use prompting / RAG
└─ YES
    ├─ Is the change minor? (e.g., domain terminology, style)
    │   └─ YES → LoRA fine-tuning
    └─ Is the change major? (e.g., new task, new language)
        ├─ Do you have 100k+ examples?
        │   └─ YES → Full fine-tuning
        └─ Do you have reward signals?
            └─ YES → RLHF
```

---

## 4. Instruction Tuning

### What is Instruction Tuning?

**Problem:**
- Base LLMs are trained to complete text
- Prompt: "Translate to French: Hello" → Model might continue: "Translate to German: Hallo..."
- They don't naturally follow instructions

**Solution: Instruction tuning**
- Fine-tune on (instruction, input, output) triplets
- Model learns to follow instructions instead of just completing text

### Format

```json
{
  "instruction": "Generate an NQE query for the following request",
  "input": "Show me all routers with CPU usage above 80%",
  "output": "devices where type == 'router' and cpu > 80"
}
```

### Interviewer's Experience

They mentioned: **"Instruction tuning with handcrafted and synthetically generated data"**

**Handcrafted data:**
- Experts write (instruction, input, output) triplets
- High quality, but expensive and slow
- Example: 100 expert-written NQE examples

**Synthetic data:**
- Use LLM to generate training examples
- Fast and cheap, but quality varies
- Example: Use GPT-4 to generate 10,000 NQE examples

### Synthetic Data Generation Strategies

#### Strategy 1: Template-Based

```python
# Template
template = "Show me all {device_type} with {metric} {operator} {value}"

# Fill with variations
device_types = ["routers", "switches", "firewalls"]
metrics = ["cpu", "memory", "uptime"]
operators = ["above", "below", "equal to"]
values = [50, 70, 80, 90, 95]

# Generate
for dt in device_types:
    for metric in metrics:
        for op, val in zip(operators, values):
            input = template.format(device_type=dt, metric=metric, operator=op, value=val)
            output = generate_nqe(dt, metric, op, val)
            examples.append({"instruction": "...", "input": input, "output": output})

# Result: 1000s of synthetic examples
```

#### Strategy 2: LLM-Based Generation

```python
# Use GPT-4 to generate examples
prompt = """
Generate 10 examples of natural language requests for network queries and their corresponding NQE syntax.

Format:
Input: [Natural language request]
Output: [NQE query]

Examples:
Input: Show me all routers
Output: devices where type == 'router'

Input: Find switches with high memory usage
Output: devices where type == 'switch' and memory > 80

Now generate 10 more diverse examples:
"""

synthetic_examples = gpt4.generate(prompt)
```

#### Strategy 3: Backtranslation

```
1. Start with NQE query: devices where type == 'router'
2. Ask LLM: "Describe this query in natural language"
3. LLM generates: "Show me all routers"
4. Use as training pair: (input: "Show me all routers", output: "devices where type == 'router'")
```

#### Strategy 4: Augmentation

```python
# Start with real user query
original = "Show me all routers with high CPU"

# Generate variations
variations = [
    "Find routers where CPU is high",
    "Which routers have high CPU usage?",
    "List routers with CPU above threshold",
    "Show routers with elevated CPU"
]

# All map to same NQE output
output = "devices where type == 'router' and cpu > 80"

# 5 training examples from 1 original
```

### Quality Control for Synthetic Data

**Problem:** LLM-generated data can be wrong

**Solutions:**
1. **Validation:** Execute generated queries, check if they work
2. **Human review:** Sample 10% for quality check
3. **Filtering:** Remove low-confidence generations
4. **Diverse prompts:** Use multiple generation strategies
5. **Mix with real data:** 70% synthetic, 30% human-labeled

---

## 5. Model Evaluation

### Code Generation Evaluation (Critical for NQE)

#### Level 1: Syntax Correctness
```python
def eval_syntax(generated_queries):
    correct = 0
    for query in generated_queries:
        try:
            parse_nqe(query)  # Does it parse?
            correct += 1
        except SyntaxError:
            pass
    return correct / len(generated_queries)

# Target: > 95% parse successfully
```

#### Level 2: Execution Correctness
```python
def eval_execution(generated_queries, test_networks):
    success = 0
    for query, network in zip(generated_queries, test_networks):
        try:
            results = execute_nqe(query, network)
            success += 1
        except Exception:
            pass  # Query ran but errored
    return success / len(generated_queries)

# Target: > 90% execute without error
```

#### Level 3: Result Correctness
```python
def eval_results(generated_queries, expected_results):
    correct = 0
    for query, expected in zip(generated_queries, expected_results):
        actual = execute_nqe(query, test_network)
        if actual == expected:
            correct += 1
    return correct / len(generated_queries)

# Target: > 85% return correct results
```

#### Level 4: Human Evaluation
```python
# Show 100 queries to experts
for query in sample(generated_queries, 100):
    rating = expert.rate(query)  # Perfect / Good / Needs Edit / Wrong

# Calculate acceptance rate
acceptance = (perfect + good) / total
# Target: > 80% acceptable
```

### Interviewer's Custom Eval Framework

He mentioned: **"Developed custom tooling for unbiased model evaluation"**

**What "unbiased" means:**
- Don't just measure "does it match reference answer?"
- Multiple correct answers exist
- Measure functional equivalence

**Example:**
```python
# These are functionally equivalent:
query1 = "devices where type == 'router' and cpu > 80"
query2 = "devices where cpu > 80 and type == 'router'"  # Same result, different order
query3 = "routers where cpu > 80"  # Shorthand syntax

# Traditional eval: Only query1 gets credit
# Better eval: All 3 get credit (functional equivalence)
```

**How to measure functional equivalence:**
```python
def functional_equivalence(query1, query2, test_networks):
    # Run both queries on same test networks
    for network in test_networks:
        result1 = execute_nqe(query1, network)
        result2 = execute_nqe(query2, network)
        if result1 != result2:
            return False  # Different results = not equivalent
    return True  # Same results on all test cases
```

---

## 6. Quantization & Optimization

### What is Quantization?

**Problem:**
- LLama-3 8B model = 16 GB (FP16 precision)
- Expensive GPU needed
- Slow inference

**Quantization:**
- Reduce precision: 16-bit → 8-bit → 4-bit
- Smaller memory, faster inference
- Trade-off: Slight quality loss

### Quantization Levels

| Precision | Size (8B model) | Quality | Speed | Use Case |
|-----------|-----------------|---------|-------|----------|
| **FP16** (original) | 16 GB | 100% | 1x | Maximum quality |
| **INT8** | 8 GB | 98% | 1.5x | Good balance |
| **INT4** | 4 GB | 95% | 2x | Resource-constrained |
| **INT2** | 2 GB | 85% | 3x | Experimental |

### When Quantization Matters

**For Forward Networks:**
- Self-hosting LLMs at scale
- Want to serve more queries per GPU
- Cost optimization

**Example:**
```
Without quantization:
- A100 GPU (40GB) → Run 2x Llama-3 8B models (FP16)
- Cost: $1,000/month per GPU
- Throughput: 100 queries/sec

With 8-bit quantization:
- Same GPU → Run 4x Llama-3 8B models
- Cost: $1,000/month per GPU
- Throughput: 200 queries/sec
- Quality loss: 2%

ROI: 2x throughput for 2% quality loss
```

### Optimization Techniques

#### 1. Flash Attention
- Faster attention computation
- 2-3x speedup
- No quality loss

#### 2. vLLM (PagedAttention)
- Efficient KV cache management
- Better GPU memory utilization
- 2-4x higher throughput

#### 3. Batch Processing
- Process multiple queries together
- Better GPU utilization
- Trade-off: Higher latency per query

#### 4. Speculative Decoding
- Use small model to draft, large model to verify
- 2x faster for similar quality

---

## 7. Self-Hosted vs API Models

### Why Self-Host? (Forward Does This)

**Reasons:**
1. **Cost at scale:** At 100k+ queries/day, self-hosting is cheaper
2. **Data privacy:** Network configs can't leave datacenter
3. **Customization:** Can fine-tune, quantize, optimize
4. **No rate limits:** Scale to hardware capacity
5. **Latency:** Local inference faster than API calls

### Self-Hosting Stack

**Model serving:**
- **vLLM:** High-throughput inference (recommended)
- **TGI (HuggingFace):** Good for HF models
- **Ollama:** Easiest to use, but lower throughput
- **Ray Serve:** For distributed serving

**Infrastructure:**
- **GPU:** A100 (40GB), H100 (80GB), or A10G (24GB)
- **Deployment:** Kubernetes, Docker, or bare metal
- **Load balancing:** NGINX, HAProxy
- **Monitoring:** Prometheus, Grafana

### Cost Analysis

**API-based (GPT-4):**
```
100k queries/day
× 500 tokens avg
× $0.03 per 1k tokens
= $1,500/day = $45,000/month
```

**Self-hosted (Llama-3 8B):**
```
2x A100 GPUs (for redundancy)
× $1,000/month per GPU
= $2,000/month

Savings: $43,000/month
Break-even: ~1 day
```

**Trade-off:** Llama-3 8B < GPT-4 in quality (but gap closing)

---

## INTERVIEW QUESTIONS & ANSWERS

### Q1: "What's LoRA and when would you use it?"

**Strong answer:**
"LoRA is parameter-efficient fine-tuning. Instead of updating all model parameters, you freeze the base model and only train small adapter matrices - typically 0.1-1% of total parameters. This makes fine-tuning 10-100x cheaper and faster.

For Forward's NQE generation, I'd use LoRA to adapt Llama-3 to understand NQE syntax. The base model already knows code structure, so we're just teaching it a new language - perfect use case for LoRA.

Advantages: Fast iteration, can train multiple adapters (basic vs advanced queries), cost-effective for experimentation.

I'd start with rank=16, train on 10k NQE examples, and evaluate syntax correctness. If quality isn't sufficient, I'd try full fine-tuning, but I'd start with LoRA because of speed and cost."

**If you haven't done it:**
"I haven't implemented LoRA in production yet, but I understand the concept. At Freefly, if we'd needed to fine-tune for drone-specific terminology, LoRA would've been the right choice over full fine-tuning - same quality at 1/10th the cost."

---

### Q2: "How would you use RLHF for NQE generation?"

**Strong answer:**
"RLHF is powerful when you have clear reward signals. For NQE, we have natural rewards:

**Automatic rewards:**
- Syntax correctness: Query parses → +1
- Execution success: Query runs → +0.5
- Result correctness: Returns expected devices → +1

**Human feedback:**
- User clicks 'helpful' → +1
- User clicks 'wrong' → -1

I'd implement this in stages:
1. Start with supervised fine-tuning on NQE examples
2. Deploy to users, collect feedback
3. Train reward model on: (query, network context, user feedback) → score
4. Use PPO to optimize policy model for higher rewards

This is similar to your thesis work where you used compilation signals as rewards for code translation. The key advantage is the model learns from execution feedback, not just matching reference queries.

Challenge: RLHF is complex and can be unstable. I'd only pursue it if supervised fine-tuning + LoRA plateau and we have clear evidence that RL would help."

**If you haven't done it:**
"I haven't implemented RLHF, but I understand the framework from reading papers and your thesis work. The key insight is using execution as reward - code that compiles and passes tests is objectively better. For NQE, we have similar signals."

---

### Q3: "How do you generate synthetic training data?"

**Strong answer:**
"I'd use multiple strategies:

**Template-based:**
- Define templates: 'Show me all {device} with {metric} {operator} {value}'
- Fill with variations: 1000s of examples quickly
- Validate: Run queries, remove broken ones

**LLM-based:**
- Use GPT-4: 'Generate diverse NQE query examples'
- Backtranslation: NQE query → Natural language description
- Self-instruct: Model generates its own training data

**Augmentation:**
- Take real user queries
- Generate paraphrases: 'Show routers' → 'List routers', 'Find routers', 'Which routers'
- All map to same NQE output

**Quality control:**
- Execute generated queries (syntax check)
- Human review 10% sample
- Mix 70% synthetic, 30% real data

At Freefly, I did similar augmentation for drone log queries - took 200 real queries, generated variations, ended up with 2000 training examples."

---

### Q4: "How do you evaluate code generation models?"

**Strong answer:**
"Multi-level evaluation, because 'correctness' isn't binary:

**Level 1 - Syntax:** Does it parse? (Target: >95%)
**Level 2 - Execution:** Does it run without errors? (Target: >90%)
**Level 3 - Functional correctness:** Does it return expected results? (Target: >85%)
**Level 4 - Human eval:** Is it actually useful? (Target: >80% acceptable)

The tricky part is functional equivalence - multiple correct answers exist. I'd test on diverse networks, not just exact match.

For monitoring in production:
- Track acceptance rate (thumbs up/down)
- Edit distance (how much do users modify outputs?)
- Execution success rate
- User retention

Your thesis work on evaluation frameworks for code translation is exactly this - you measured compilation rate, not just BLEU scores. That's the right mindset."

---

### Q5: "Self-hosted vs API models - when do you choose?"

**Strong answer:**
"Decision factors:

**Self-host when:**
- High volume (>100k queries/day makes it cheaper)
- Data privacy (network configs can't leave datacenter)
- Latency critical (<100ms requirements)
- Need customization (fine-tuning, quantization)

**API when:**
- Low volume (<10k queries/day)
- Need latest models (GPT-4, Claude immediately)
- Limited ML Ops capacity
- Development/prototyping

For Forward, you're self-hosting because:
1. Scale: Potentially millions of queries
2. Privacy: Enterprise network data
3. Customization: Fine-tuned for NQE

Cost example: At 100k queries/day, self-hosted Llama-3 costs $2k/month vs GPT-4 API at $45k/month - 20x cheaper.

Trade-off: Open source models are 90-95% of GPT-4 quality. For NQE, that's likely sufficient after fine-tuning."

---

### Q6: "What's quantization and when do you use it?"

**Strong answer:**
"Quantization reduces numerical precision - 16-bit → 8-bit → 4-bit. This cuts memory usage in half (or more), speeds up inference, but sacrifices some quality.

**Trade-off:**
- 8-bit: 2x smaller, 1.5x faster, ~2% quality loss
- 4-bit: 4x smaller, 2x faster, ~5% quality loss

For self-hosted systems at scale, quantization is critical:
- Same GPU can serve 2-4x more models
- Lower cost per query
- Faster inference

For NQE generation: I'd benchmark 8-bit quantization. If syntax correctness drops from 95% → 93%, that's probably acceptable given the cost savings. If it drops to 85%, I'd stick with FP16.

The key is measuring impact on YOUR metric (syntax correctness), not general benchmarks."

**If you haven't done it:**
"I haven't implemented quantization myself, but I understand the trade-offs. At Freefly, we used Ollama which handles quantization automatically - we ran 4-bit models on consumer GPUs."

---

## QUICK REFERENCE SHEET

### LoRA
- **What:** Parameter-efficient fine-tuning
- **When:** Domain adaptation, limited compute
- **How:** Train small adapters (0.1% params)

### RLHF
- **What:** Fine-tuning with reward signals
- **When:** Have execution feedback, need alignment
- **How:** SFT → Reward model → PPO

### Instruction Tuning
- **What:** Teaching models to follow instructions
- **When:** Base model doesn't follow commands well
- **Format:** (instruction, input, output) triplets

### Synthetic Data
- **What:** LLM-generated training data
- **When:** Limited human-labeled data
- **How:** Templates, LLM generation, backtranslation

### Quantization
- **What:** Reduce model precision
- **When:** Self-hosting, cost optimization
- **Trade-off:** Memory/speed vs quality

---

## CONNECTING TO YOUR EXPERIENCE

**GridCOP:**
"For GridCOP, I used RAG instead of fine-tuning because grid data changes frequently. But if I were to rebuild it today with static domain knowledge, I'd consider LoRA fine-tuning for grid terminology."

**Freefly:**
"At Freefly, we used base Ollama models. If I'd had more time, I would've explored LoRA fine-tuning on drone crash patterns - teach the model to recognize specific failure modes."

---

## FINAL TALKING POINTS

**Your message:**

"I haven't done extensive fine-tuning work yet - my experience is primarily with RAG and prompt engineering. But I understand the concepts:

- **LoRA for efficiency:** When you need domain adaptation without full fine-tuning cost
- **RLHF for alignment:** When you have reward signals like execution success
- **Synthetic data for scale:** When human-labeled data is expensive
- **Quantization for cost:** When self-hosting at scale

For Forward's NQE generation, I'd approach it systematically:
1. Start with RAG + few-shot prompting (fastest to validate)
2. If quality plateaus, try LoRA fine-tuning (cost-effective)
3. If still not sufficient, full fine-tuning
4. If we have execution feedback, explore RLHF

I'm eager to gain hands-on experience with fine-tuning - it's the natural next step in my AI journey, and Forward's self-hosted LLM systems would be the perfect environment to learn."

---

## RESOURCES TO SKIM (15 min total)

**LoRA:**
- Paper: "LoRA: Low-Rank Adaptation of Large Language Models" (skim abstract + intro)
- HuggingFace PEFT docs: https://huggingface.co/docs/peft/index

**RLHF:**
- Blog: "Illustrating Reinforcement Learning from Human Feedback" (HuggingFace)
- Your interviewer's thesis work: XLCoST paper for code generation context

**Quantization:**
- HuggingFace: "Quantization" guide (5 min read)

**Key concept:** Understand the WHY and WHEN, not just the HOW

---

**You're ready. Show curiosity, connect concepts to Forward's use case, and be honest about what you haven't done yet. The interviewer values learning mindset over checkboxes.**
