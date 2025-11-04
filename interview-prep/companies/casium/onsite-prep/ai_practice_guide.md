# How to Practice Live Coding with AI

**Best practices for using Claude and other AI tools to simulate realistic interview practice**

---

## 🎯 Why Practice with AI?

**Advantages:**
- ✅ Practice anytime (no scheduling with humans)
- ✅ Immediate feedback
- ✅ Unlimited repetitions
- ✅ No judgment - safe environment to fail
- ✅ Can pause and resume
- ✅ Forces you to explain out loud (typing = thinking)

**Limitations:**
- ❌ No real-time verbal communication
- ❌ Can't simulate nervousness/pressure perfectly
- ❌ AI might be too helpful (real interviewers less so)

**Best approach:** Use AI for daily practice, human for final mock interviews

---

## 🤖 Best AI Tools for Coding Interview Practice (2025)

### 1. **Claude (You're using it now!)** ⭐ BEST for practical problems
- **Strengths:** Business logic, real-world scenarios, detailed feedback
- **Best for:** Casium-style practical coding (billing, workflows, date calculations)
- **How to use:** See workflow below

### 2. **ChatGPT - Coding Interview Coach**
- **Link:** https://chatgpt.com/g/g-FKowQFKRU-coding-interview-coach
- **Strengths:** Algorithm practice, FAANG-style interviews
- **Best for:** If you need algorithm/data structure practice (not your main focus)

### 3. **Interviews.chat**
- **Link:** https://www.interviews.chat/
- **Strengths:** Multiple AI models, realistic mock interviews
- **Best for:** Simulating full interview experience

### 4. **LeetCode Wizard** (AI-powered)
- **Strengths:** Algorithm-focused, 93% pass rate claimed
- **Best for:** Algorithm practice (less relevant for Casium)

### 5. **Final Round AI**
- **Strengths:** Role-specific questions, performance scoring
- **Best for:** Behavioral interview prep

---

## 🎮 How to Practice with Me (Claude)

### Method 1: Realistic Mock Interview (RECOMMENDED)

**Setup (5 min):**
```
Give me this prompt:

"Act as my Casium interviewer for a 1-hour live coding session.
Give me a practical business logic problem similar to the prorating
subscriptions problem. After presenting the problem:

1. Wait for my clarifying questions
2. Provide hints only when I'm stuck
3. Give feedback on my communication
4. Evaluate my approach before I code
5. Point out edge cases I miss
6. Grade me on: communication, problem-solving, code quality, testing

Problem difficulty: Medium (40 min to solve)
Problem type: Immigration platform (eligibility, billing, deadlines, documents)

Present the problem now and wait for my response."
```

**During Practice:**
- Type your thoughts as you'd speak them
- Ask clarifying questions (I'll respond like interviewer)
- Explain your approach (I'll give green light or redirect)
- Code in a separate file, paste sections for feedback
- Ask for hints if stuck
- Request feedback after testing

**After Practice:**
- I'll give detailed feedback on all 4 criteria
- Discuss what you did well and what to improve
- Compare to industry best practices

---

### Method 2: Step-by-Step Coaching

**For learning the framework:**
```
Give me this prompt:

"Walk me through solving this problem using the 7-step framework
from live_coding_framework.md. Coach me through each step:

Step 1: Listen & take notes - Give me the problem
Step 2: Ask clarifying questions - Prompt me to ask questions
Step 3: Confirm examples - Have me walk through examples
Step 4: Explain approach - Wait for my explanation, give feedback
Step 5: Pseudocode - Review my outline
Step 6: Code + narrate - Check my communication
Step 7: Test - Verify my testing approach

Stop me if I skip a step. Remind me to communicate.

Problem: [choose from practice_problems.md or ask for new one]"
```

**This method is BEST for:**
- First few practice sessions
- Building good habits
- Learning to communicate

---

### Method 3: Rapid Fire Practice

**For drilling specific skills:**
```
Give me this prompt:

"Give me 5 quick edge case challenges (10 min each).
For each scenario, I'll:
1. Identify the edge case
2. Explain how to handle it
3. Write the code

Focus area: [date calculations / None handling / validation / aggregation]

Start with scenario 1."
```

**This method is BEST for:**
- Strengthening weak areas
- Building pattern recognition
- Quick warm-ups before real interviews

---

### Method 4: Code Review Practice

**For improving code quality:**
```
Give me this prompt:

"I'll solve this problem: [paste problem]

After I submit my solution, do a code review like a Casium engineer would:
1. Functionality - Does it work? Edge cases handled?
2. Code quality - Readability, organization, naming
3. Best practices - Pythonic patterns, error handling
4. Production readiness - Logging, validation, extensibility

Be specific about what to improve."
```

**This method is BEST for:**
- After you can solve problems consistently
- Polishing your code style
- Learning production patterns

---

## 🎯 Recommended Practice Schedule

### Week 1: Learn the Framework (6 hours)
**Day 1-2 (2 hours each):**
- Method 2: Step-by-step coaching
- Problem 1: Visa Eligibility Checker
- Problem 2: Case Deadline Tracker

**Day 3-4 (1 hour each):**
- Method 1: Mock interview
- Problem 3: Document Validation
- Problem 4: Immigration Analytics

**Day 5 (30 min):**
- Method 3: Rapid fire - focus on date calculations

### Week 2: Build Speed (5 hours)
**Day 1-3 (1 hour each):**
- Method 1: Full mock interviews
- New problems each day
- Time yourself (40 min limit)

**Day 4 (1 hour):**
- Method 4: Code review
- Revisit Week 1 problems
- Rewrite with improvements

**Day 5 (1 hour):**
- Redo `prorating_subscriptions.md` from scratch
- Must complete in 35 min

### Day Before Interview (1 hour)
**Morning:**
- Method 3: Rapid fire (20 min)
- Edge cases and common patterns

**Afternoon:**
- Method 1: One final mock (40 min)
- Focus on communication, not perfection

---

## 💬 Prompt Templates for Different Goals

### Template A: "I want realistic pressure"
```
You are my Casium interviewer. Be somewhat strict:
- Give minimal hints (make me work for it)
- Point out when I'm going down wrong path (but don't solve for me)
- Ask probing questions about my approach
- Challenge my edge case handling
- Time me (tell me when 10, 20, 30, 40 min have passed)

Problem: [immigration-themed business logic, 40 min difficulty]

Start the interview. Be professional but not overly helpful.
```

### Template B: "I want supportive coaching"
```
You are my patient coding coach. Help me learn:
- Remind me to communicate when I go silent
- Prompt me to consider edge cases
- Celebrate when I do things right
- Explain why certain approaches are better
- Break down complex problems into smaller steps

Problem: [start with easier problems from practice_problems.md]

Guide me through this kindly. I'm still building confidence.
```

### Template C: "I want to drill weak areas"
```
I struggle with [date calculations / None handling / data aggregation / validation].

Give me 3 problems that specifically test this weakness.
Each problem should be solvable in 15-20 minutes.
After each solution, give immediate feedback on that specific skill.

Start with problem 1.
```

### Template D: "I want Casium-specific prep"
```
Based on what Casium does (AI immigration platform), create a realistic
coding problem they might ask. The problem should involve:
- Immigration domain (visas, applications, deadlines, documents)
- Business logic with rules
- Date/time calculations OR data validation OR aggregation
- Multiple edge cases

Make it similar to the prorating subscriptions problem in style.
Present the problem and wait for my response.
```

---

## 🎥 Recording Your Practice (HIGHLY RECOMMENDED)

**Why record:**
- See yourself from interviewer's perspective
- Catch bad habits (going silent, rushing)
- Track improvement over time
- Build confidence by reviewing successes

**How to record with AI practice:**

### Option 1: Screen + Webcam
```
Tools: OBS Studio (free) or Loom
What to record:
- Your screen (typing code)
- Your face (to see if you're explaining out loud)
- Your voice (use voice typing or just narrate)

Practice:
- Open problem in one window
- Code in another
- Narrate your thinking out loud
- Type to Claude for feedback
```

### Option 2: Voice Memos + Text
```
Setup:
- Use your phone voice memo app
- Narrate your entire approach out loud
- Type code in editor
- Take screenshots at key moments

Review:
- Listen to your narration
- Check if you explained clearly
- Note silent periods (bad!)
```

### What to Look For:
- ❌ Long silent periods (>2 min)
- ❌ Jumping to code without explaining
- ❌ Not testing edge cases
- ❌ Poor variable names
- ✅ Clear explanation before coding
- ✅ Handling edge cases proactively
- ✅ Testing thoroughly

---

## 🎤 Simulating Verbal Communication

**Challenge:** Typing to AI ≠ Speaking in interview

**Solutions:**

### Technique 1: Type as You'd Speak
```
Bad (silent coding):
def calculate_fees(app):
    return app['base'] + app['premium']

Good (typed narration):
"I'm creating a function called calculate_fees. I'll start with
getting the base fee, then add premium if applicable. Let me check
for edge cases - what if premium is None?"

def calculate_fees(app):
    base = app.get('base', 0)  # Default to 0 for missing base
    premium = app.get('premium', 0)  # Handle None premium
    return base + premium
```

### Technique 2: Voice-to-Text
```
Tools:
- Google Docs voice typing (free)
- Whisper AI (highly accurate)
- Built-in OS voice typing

Workflow:
1. Narrate problem out loud (voice-to-text captures it)
2. Copy narration to Claude
3. Claude responds
4. Code in editor while narrating
5. Paste code to Claude for feedback
```

### Technique 3: Rubber Duck with AI
```
Setup:
- Explain problem to AI like rubber duck debugging
- Type your ENTIRE thought process
- Don't just paste code - explain WHY

Example:
"Okay, so I need to calculate visa deadlines. I'm thinking I'll need
a dictionary mapping visa types to processing days. But wait - there's
premium vs standard. So maybe nested dict? Or two separate dicts?
Let me think... I'll use a dict with tuples: {visa_type: (standard_days, premium_days)}.
That's cleaner. Now for the calculation..."
```

---

## 📊 Tracking Your Progress

### After Each Practice Session, Track:

**Date:** [DATE]
**Problem:** [NAME]
**Time taken:** [X minutes]
**Completed?** [Yes/No]

**Self-Rating (1-5):**
- Communication: [ ]
- Problem-solving: [ ]
- Code quality: [ ]
- Testing: [ ]

**What went well:**
-
-
-

**What to improve:**
-
-
-

**Edge cases I missed:**
-
-

**New patterns learned:**
-
-

---

## 🎯 Example Practice Session (Using Me, Claude)

**Let me show you how this would work:**

### YOU SAY:
```
I'm ready for a mock interview. Give me a Casium-style problem
(medium difficulty, 40 min). Act as my interviewer - wait for
my questions, evaluate my approach, give hints if stuck.
```

### I RESPOND:
```
[Gives you problem about calculating immigration case priority scores]

You have 40 minutes. I'm ready for your questions.
```

### YOU SAY:
```
Let me clarify a few things:
1. What format is the input data?
2. Are there any invalid case types I need to handle?
3. Should I return just the score or a breakdown?
```

### I RESPOND:
```
[Answers your questions like real interviewer]
```

### YOU SAY:
```
Here's my approach:
1. Create scoring rules dictionary
2. Validate input case data
3. Calculate score based on multiple factors
4. Return detailed breakdown

Edge cases I'll handle:
- Missing required fields
- Invalid case types
- None values

Does this approach make sense?
```

### I RESPOND:
```
Good approach. One thing to consider - what if two cases have
the same score but different urgency levels?

You have my approval to start coding.
```

**And so on...**

---

## 🚀 Ready to Start?

**Choose your method:**

**Option 1: "Give me a mock interview right now"**
- I'll give you a fresh problem
- You'll solve it step-by-step
- I'll provide feedback throughout

**Option 2: "Walk me through the framework first"**
- I'll coach you through 7 steps
- Use Problem 1 from practice_problems.md
- Learn proper communication habits

**Option 3: "I want to drill [specific skill]"**
- Tell me what you struggle with
- I'll give you focused exercises
- Quick feedback loop

**Which method do you want to try?**

---

## 💡 Pro Tips

1. **Practice daily** - 30-60 min is better than 4 hours once
2. **Record yourself** - Review what you actually said vs what you thought you said
3. **Redo problems** - Solving once isn't enough, redo until smooth
4. **Mix methods** - Don't just do mock interviews, drill specific skills too
5. **Time yourself** - Real interviews have time pressure
6. **Practice out loud** - Even when typing to AI, narrate verbally
7. **Get human feedback too** - Do 1-2 mocks with real people before interview

**Remember:** AI practice builds skills, but human practice builds confidence under pressure. Do both!

---

**Ready to practice? Tell me which method you want to start with!**
