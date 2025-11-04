# Live Coding Interview Framework - Your Coaching Guide

**Based on industry best practices for practical business logic interviews**

---

## 🎯 What Makes This Different

**Traditional Algorithm Interviews:**
- Focus: Data structures & algorithms (LeetCode style)
- Goal: Optimal solution (time/space complexity)
- Communication: Less critical

**Practical Business Logic Interviews (Casium style):**
- Focus: Real-world problems (billing, eligibility, workflows)
- Goal: Working code that handles edge cases
- Communication: **CRITICAL** - they evaluate collaboration skills

**Key Insight:** In practical interviews, **how you think and communicate matters MORE than getting the perfect solution**

---

## 📋 The 7-Step Framework

### Phase 1: UNDERSTAND (5-7 minutes)

#### Step 1: Listen & Take Notes
**What to do:**
- Read/listen to the problem carefully
- Write down key requirements
- Note any examples given

**Example:**
```
Problem: Calculate visa filing fees

Notes:
- Different visa types (O-1, H-1B, EB-1A)
- Premium processing option
- Dependents affect cost
- Need to return breakdown
```

**What to say:**
> "Let me make sure I understand the requirements. We need to calculate visa fees based on type, premium processing, and dependents. Is that correct?"

---

#### Step 2: Ask Clarifying Questions
**DON'T assume - ASK!**

**Questions to ask:**
- Input format: "What format will the input data be in?"
- Edge cases: "What should happen if premium_processing is None?"
- Output format: "Should I return a dictionary or just the total?"
- Constraints: "Are there any limits on the number of dependents?"
- Business rules: "Do all visa types support premium processing?"

**Example dialogue:**
> **You:** "Just to clarify - should the function handle invalid visa types, or can I assume the input is always valid?"
>
> **Interviewer:** "Good question. You should validate and return an error for invalid types."
>
> **You:** "Got it. And for the fee calculation - are dependents charged the same base fee as the primary applicant?"

**Why this matters:** Shows you think about edge cases BEFORE coding, not after bugs appear.

---

#### Step 3: Confirm Examples
**What to do:**
- Walk through the given example
- Trace the expected output
- Ask if your understanding is correct

**Example:**
```
Input: {visa_type: "O-1", premium: True, dependents: 2}

My understanding:
- Base fee for O-1: $460
- Premium processing: +$2500
- Each dependent: +$460
- Total: $460 + $2500 + (2 × $460) = $3,880

Is this correct?
```

**What to say:**
> "Let me walk through this example to confirm I understand. For an O-1 visa with premium processing and 2 dependents, we'd calculate... Does that match your expectation?"

---

### Phase 2: PLAN (5-7 minutes)

#### Step 4: Explain Your Approach (Before Writing Code!)
**DON'T rush to code. Think out loud first.**

**Structure your explanation:**
1. High-level approach
2. Helper functions you'll need
3. Edge cases you'll handle
4. Why this approach makes sense

**Example:**
> "Here's my approach:
>
> 1. I'll create a fee lookup dictionary for base fees by visa type
> 2. Create a helper function `calculate_base_fee()` that validates visa type
> 3. Main function will:
>    - Get base fee for visa type
>    - Add premium processing if applicable
>    - Add dependent fees (dependents × base_fee)
>    - Return detailed breakdown
>
> 4. Edge cases I'll handle:
>    - Invalid visa type → return error
>    - None/negative dependents → default to 0
>    - Premium not applicable for certain visas
>
> Does this approach make sense to you?"

**Wait for approval before coding!**

---

#### Step 5: Write Pseudocode/Comments First
**Outline your solution in comments before writing real code.**

**Example:**
```python
def calculate_visa_fees(application):
    """
    Calculate total visa application fees.

    Args:
        application: dict with visa_type, premium_processing, dependents

    Returns:
        dict with breakdown of fees
    """

    # Step 1: Define base fees

    # Step 2: Validate visa type

    # Step 3: Calculate base fee

    # Step 4: Add premium processing if applicable

    # Step 5: Calculate dependent fees

    # Step 6: Return breakdown
```

**What to say:**
> "I'm going to write out the structure first with comments, then fill in the implementation. This helps me stay organized."

---

### Phase 3: CODE (25-35 minutes)

#### Step 6: Code + Narrate
**Think out loud as you code.**

**What to narrate:**
- What you're doing: "I'm creating a lookup dictionary for base fees"
- Why: "This makes it easy to add new visa types later"
- Edge cases: "I'm checking for None here because dependents might be optional"
- Trade-offs: "I could cache this, but for simplicity I'll calculate each time"

**Example narration:**
```python
# Creating fee lookup - this could come from database in real system
BASE_FEES = {
    "O-1": 460,
    "H-1B": 460,
    "EB-1A": 700
}

# "I'm using a dictionary for O(1) lookup time. In production,
#  this would probably come from a database."

def calculate_visa_fees(application):
    visa_type = application.get("visa_type")

    # "I'm using .get() instead of bracket notation to avoid KeyError.
    #  This is safer for optional fields."

    if visa_type not in BASE_FEES:
        # "Handling invalid visa type edge case"
        return {"error": f"Invalid visa type: {visa_type}"}
```

**Communication tips:**
- ✅ Explain complex logic
- ✅ Call out edge cases as you handle them
- ✅ Mention alternatives you considered
- ❌ Don't narrate obvious code (`x = 5` doesn't need explanation)
- ❌ Don't go silent for long periods

---

#### Step 6b: Handle Edge Cases Proactively
**Don't wait for bugs - address edge cases as you code.**

**Common edge cases for business logic:**
- None/null values
- Empty collections
- Invalid inputs
- Boundary conditions (dates, numbers)
- Missing required fields
- Type mismatches

**Example:**
```python
# Handle None dependents
dependents = application.get("dependents", 0)
if dependents is None or dependents < 0:
    dependents = 0

# "I'm defaulting to 0 for None or negative dependents.
#  Should we raise an error instead, or is 0 acceptable?"
```

**Ask for guidance when unsure:**
> "I'm not sure if we should raise an error for negative dependents or just default to 0. What would be better for the business logic?"

---

#### Step 6c: Write Clean Code
**Code quality matters in practical interviews.**

**Best practices:**
- ✅ Descriptive variable names (`total_fee` not `tf`)
- ✅ Extract helper functions (DRY principle)
- ✅ Add docstrings/comments for complex logic
- ✅ Consistent formatting
- ✅ Type hints (if time permits)

**Example:**
```python
def get_base_fee(visa_type: str) -> tuple[float, str]:
    """
    Get base fee for visa type with validation.

    Returns:
        (fee, error_message) - error_message is None if valid
    """
    if visa_type not in BASE_FEES:
        return 0, f"Invalid visa type: {visa_type}"
    return BASE_FEES[visa_type], None
```

---

### Phase 4: TEST (10-15 minutes)

#### Step 7: Test Your Code Out Loud
**Walk through your code like a debugger.**

**Testing strategy:**
1. **Happy path** - Normal case
2. **Edge cases** - None, empty, boundaries
3. **Error cases** - Invalid inputs

**Example walkthrough:**
> "Let me test this with the original example:
>
> Input: {visa_type: 'O-1', premium_processing: True, dependents: 2}
>
> Step by step:
> - Line 5: visa_type = 'O-1'
> - Line 8: 'O-1' is in BASE_FEES, so base_fee = 460
> - Line 12: premium_processing is True, so add 2500
> - Line 15: dependents = 2, so add 2 × 460 = 920
> - Line 18: total = 460 + 2500 + 920 = 3880 ✓
>
> Now let me test an edge case - invalid visa type:
> - Input: {visa_type: 'INVALID', premium_processing: False, dependents: 0}
> - Line 8: 'INVALID' not in BASE_FEES
> - Line 9: Return error dictionary ✓
>
> And one more - None dependents:
> - Input: {visa_type: 'H-1B', premium_processing: False, dependents: None}
> - Line 15: dependents is None, so we default to 0
> - Total: 460 + 0 + 0 = 460 ✓"

**What to say:**
> "I'm going to trace through the code with a few test cases to make sure it handles edge cases correctly."

---

#### Step 7b: Suggest Improvements
**If time permits, discuss optimizations or enhancements.**

**What to discuss:**
- Time/space complexity: "This is O(1) time since we're just doing lookups"
- Scalability: "In production, we'd fetch fees from database instead of hardcoding"
- Error handling: "We could add logging here to track invalid visa types"
- Extensibility: "This design makes it easy to add new fee types or rules"

**Example:**
> "If I had more time, I'd add:
> 1. Input validation using a schema (like Pydantic)
> 2. Unit tests for each edge case
> 3. Logging for audit trail
> 4. Configuration for fee values instead of hardcoding
>
> But for the core logic, this should work correctly."

---

## 🗣️ Communication Best Practices

### DO's ✅

1. **Think out loud**
   - "I'm considering two approaches here..."
   - "The edge case I'm worried about is..."
   - "Let me validate this logic makes sense..."

2. **Ask for feedback**
   - "Does this approach make sense?"
   - "Should I optimize this or is clarity more important?"
   - "Am I on the right track?"

3. **Acknowledge mistakes quickly**
   - "Oh, I see a bug here - let me fix that"
   - "Good catch, I missed that edge case"
   - "You're right, this logic is flawed"

4. **Explain trade-offs**
   - "I could use a set for O(1) lookup, but a list is simpler here"
   - "This approach prioritizes readability over performance"

5. **Stay collaborative**
   - "What do you think about this approach?"
   - "I'm open to suggestions if there's a better way"
   - "Let me know if I'm going too fast"

### DON'Ts ❌

1. **Don't code in silence**
   - Silence = interviewer doesn't know if you're stuck or thinking
   - They can't help if they don't know your thought process

2. **Don't rush to code**
   - Planning saves time (no rewriting entire solutions)
   - Shows maturity and systematic thinking

3. **Don't ignore hints**
   - Interviewer hints = they want you to succeed
   - "That's an interesting approach..." = probably wrong path

4. **Don't over-explain obvious code**
   - `x = 5` doesn't need narration
   - Focus on complex logic and edge cases

5. **Don't panic when stuck**
   - "I'm stuck on this part, let me think for a moment"
   - "Can we discuss this edge case together?"

---

## 📊 What Interviewers Evaluate

**4 Main Criteria:**

### 1. Communication (30%)
- Clear explanation of approach
- Thinking out loud
- Asking good questions
- Collaborative attitude

### 2. Problem Solving (30%)
- Breaking down the problem
- Handling edge cases
- Systematic approach
- Debugging skills

### 3. Technical Competency (25%)
- Code quality (readability, organization)
- Correct implementation
- Understanding of language features
- Best practices

### 4. Testing & Validation (15%)
- Testing methodology
- Edge case coverage
- Debugging approach
- Code verification

**Key Insight:** Even if your code doesn't fully work, strong communication and problem-solving can still pass you!

---

## 🎭 Handling Common Scenarios

### Scenario 1: You're Stuck
**DON'T:** Code in silence hoping it'll come to you
**DO:**
> "I'm stuck on how to handle the cross-year boundary case. Can we discuss the requirements for that scenario together?"

### Scenario 2: You Made a Mistake
**DON'T:** Try to hide it or defend it
**DO:**
> "Oh, I see the bug - I'm not handling None values here. Let me add a check for that."

### Scenario 3: Interviewer Gives a Hint
**DON'T:** Ignore it or argue
**DO:**
> "That's a good point - let me reconsider my approach. If I use a dictionary instead..."

### Scenario 4: Running Out of Time
**DON'T:** Panic or give up
**DO:**
> "I won't have time to implement the full solution, but here's how I'd complete it: [explain approach]. The edge cases I'd test are..."

### Scenario 5: You Finish Early
**DON'T:** Sit in silence
**DO:**
> "I've completed the basic implementation. Would you like me to add error handling, write tests, or optimize anything?"

---

## 🏋️ Practice Routine

### Solo Practice (60 min sessions)

**Round 1: Record yourself**
1. Pick a problem from `practice_problems.md`
2. Record yourself solving it out loud (phone camera)
3. Watch the recording - note:
   - Silent periods (bad!)
   - Unclear explanations
   - Missed edge cases
   - Rushed coding

**Round 2: Deliberate practice**
1. Same problem, apply the 7-step framework
2. Force yourself to explain before coding
3. Narrate every decision
4. Test thoroughly out loud

**Round 3: Time pressure**
1. New problem, 40-minute timer
2. Follow framework under time pressure
3. Focus on communication even when rushed

### With a Practice Partner (90 min sessions)

**Setup:**
- Partner reads problem to you (like real interview)
- Partner gives hints when you're stuck
- Partner asks questions to test understanding

**Debrief after:**
- Communication clarity
- Approach quality
- Edge cases handled
- Code quality

---

## 📝 Casium-Specific Tips

### Their Focus Areas

1. **Immigration domain complexity**
   - Show you understand business rules matter
   - Reference real-world implications: "Immigration has zero tolerance for errors, so validation is critical"

2. **Practical engineering**
   - Code that works > fancy algorithms
   - Edge case handling > optimal complexity

3. **Collaboration**
   - They're early-stage startup - culture fit matters
   - Show you can work with attorneys, PMs, other engineers

### Talk About Your Experience

**When relevant, reference your projects:**

> "In GridCOP, we had similar challenges with business rules. SQL syntax could be valid but semantically wrong for grid data. Same thing here - the visa type might be valid Python, but not valid for the business logic."

> "At Freefly, our drone analysis tool had to handle missing sensor data. Similar edge case here with None values - we need to decide: fail loudly or handle gracefully?"

---

## 🎯 Day-of-Interview Checklist

### 30 Minutes Before
- [ ] Review this framework (7 steps)
- [ ] Practice explaining one solution out loud
- [ ] Review common Python gotchas (None handling, type conversions)
- [ ] Prepare opening questions ("What development environment will we use?")

### During Interview
- [ ] Listen carefully and take notes
- [ ] Ask clarifying questions (don't assume!)
- [ ] Explain approach before coding
- [ ] Think out loud while coding
- [ ] Test your code thoroughly
- [ ] Discuss improvements if time permits

### Remember
- **Communication > Perfect code**
- **Process > Final answer**
- **Collaboration > Solo genius**

---

## 🚀 Your Advantage

You've already passed their Woven assessment, so you know what they value:
- ✅ Business logic understanding (prorating subscriptions)
- ✅ Date/time handling (cross-year boundaries)
- ✅ Edge case thinking (None values, leap years)
- ✅ Clean code organization (helper functions)

**Apply the same approach in person, but with MORE communication.**

You've got this! 💪

---

## Quick Reference Card

**7 Steps:**
1. ⏸️ Listen & take notes
2. ❓ Ask clarifying questions
3. ✅ Confirm examples
4. 🗺️ Explain approach (wait for approval!)
5. 📝 Write pseudocode/comments
6. 💻 Code + narrate
7. 🧪 Test out loud

**Communication mantra:**
"Think out loud, ask for feedback, stay collaborative."

**When stuck:**
"Let me think through this out loud..." (then narrate your thinking)

**Your goal:**
Show them you're a great colleague to work with, not just a code writer.
