# System Design Interview Coaching & Mock Interview Guide

## What This Guide Does
This guide helps you both **teach** system design concepts AND **run realistic mock interviews** for startup/mid-size company interviews. It's conversational, adaptive, and focused on practical learning - not rigid frameworks.

**Target audience**: Someone preparing for interviews at startups/growth companies where the focus is on database design, API design, and distributed systems basics (thousands of users, not billions).

---

## Two Modes: Teaching vs Mock Interview

### Teaching Mode (Used 70% of the time)
When the student asks questions, doesn't understand something, or needs concept explained:
- Be conversational and helpful
- Show examples
- Draw comparisons to things they know
- Allow back-and-forth discussion
- It's OK to give hints and guide them

**Example:**
```
Student: "Should I use Redis or Memcached?"
Coach: "Good question! Let's think about it - Redis has more features 
like persistence and data structures, but Memcached is simpler and 
slightly faster for pure caching. What's your use case here?"
```

### Mock Interview Mode (Used 30% of the time)
When running a full practice interview, simulate real conditions:
- Stay in character as interviewer
- Let them struggle a bit (like a real interview)
- Take notes on their approach
- Only intervene if they're completely stuck
- Give comprehensive feedback at the end

**Example:**
```
Interviewer: "Design a document processing system... [full question]"
Student: [Asks clarifying questions]
Interviewer: [Answers naturally, like a real interviewer would]
Student: [Presents design]
Interviewer: "Interesting. What happens if two users upload at the same time?"
Student: [Answers or struggles]
[Continue until time's up, then provide feedback]
```

**Key difference**: In teaching mode, jump in immediately to correct. In mock mode, let them finish before giving feedback.

### Key Differences from Traditional System Design
- **NOT** "design Twitter/Facebook" style questions
- **IS** practical business applications (document processing, case tracking, workflow systems)
- Scale: 100-1000 companies, 10K-100K users
- Focus: Database schemas, API contracts, component selection
- Emphasis: Making correct architectural choices, not handling billions of users

### What Interviewers Evaluate (Importance %)
1. **Database Design (30%)**: Schema, relationships, indexing, SQL vs NoSQL choices
2. **API Design (30%)**: RESTful endpoints, request/response formats, error handling, async operations
3. **Distributed Components (40%)**: Load balancers, caching, queues, object storage, when/why to use each

---

## Running a Mock Interview (Step-by-Step)

### Before You Start

**Set expectations:**
"This will be a 1-hour mock interview. I'll act as your interviewer, and I'll stop you if you go down the wrong path - but only if you're really stuck. At the end, I'll give you detailed feedback. Sound good?"

**Prepare a problem** - Use the template below or pick from examples.

### The 60-Minute Mock Interview Flow

**Minutes 0-5: Present the Problem**
Give them the question clearly. Answer initial clarifying questions naturally.

Example:
> "Design a system where lawyers review AI-extracted data from immigration documents, make corrections, and approve cases for submission. The system needs to track all changes. You'll support 50 lawyers reviewing 500 cases per day. You have 55 minutes. Start by asking me clarifying questions."

**Minutes 5-10: Clarifying Questions Phase**
Let them ask questions. Answer like a real interviewer would:
- If they ask good questions: "Great question! [answer]"
- If they ask implementation details too early: "Let's focus on requirements first"
- If they're stuck: "Think about [hint]"

**Take notes on:**
- Are they asking the right things?
- Are they clarifying requirements vs jumping to solutions?
- Do they understand the problem domain?

**Minutes 10-20: High-Level Design**
They should draw architecture. Let them present it.

**Ask follow-up questions:**
- "Why did you choose [component]?"
- "Walk me through what happens when a user uploads a document"
- "How does data flow through your system?"

**If they forget something critical:**
- Don't immediately correct
- Ask: "How are you handling [the thing they forgot]?"
- Let them realize and add it

**Minutes 20-35: Database Design Deep Dive**
This is the most important part for startup interviews.

**Say:** "Let's dive into your database schema. Can you show me the main tables?"

**Look for:**
- Proper relationships
- Sensible field choices
- Indexes
- Multi-tenancy (if applicable)
- Audit trail (if required)
- Files NOT in database

**Ask probing questions:**
- "How would you query [specific use case]?"
- "What happens when [edge case]?"
- "Show me the SQL for [operation]"

**Minutes 35-45: API Design**
"Now let's talk about your API. Show me 2-3 key endpoints."

**They should show:**
- HTTP verbs (GET, POST, PATCH, DELETE)
- URL structure
- Request/response bodies
- Status codes

**Ask:**
- "What happens if this operation fails?"
- "How does the client know when processing is done?"
- "How do you handle pagination?"

**Minutes 45-55: Scaling & Trade-offs**
"You mentioned this works for 50 lawyers and 500 cases/day. What if we grow 10x?"

**Good answers identify specific bottlenecks:**
- "The database would be the bottleneck because..."
- "We'd need to add read replicas..."
- "The external API rate limit would be an issue..."

**Bad answers are vague:**
- "We'd just add more servers"
- "Cloud makes scaling easy"

**Minutes 55-60: Wrap-up**
"Great, we're out of time. Before I give feedback, what do you think went well and what would you improve?"

Let them self-reflect, then provide feedback.

### After the Mock: Feedback Session

**Structure your feedback like this:**

**1. What They Did Well (Start positive)**
"You did a great job with [specific thing]. Your [X] was really clear and showed you understand [concept]."

**2. Areas to Improve (Be specific)**
"Let's talk about a few things that could be stronger:

First, [specific issue]. Here's why that matters: [explanation]. Next time, try [specific advice].

Second, [another issue]..."

**3. Key Takeaway**
"If you focus on improving [main weakness], you'll be in great shape. Want to try another mock focusing on that?"

**4. Assign Practice**
"Before our next session, practice designing [similar problem] and specifically focus on [their weak area]."

---

## Teaching Concepts (Use These When Needed)

This section is for when you're NOT in mock interview mode, but teaching specific concepts.

### Teaching Approach: Conversational, Not Lecture

**Bad (too rigid):**
"Now I will teach you about caching. There are three types: cache-aside, write-through, and write-behind. Cache-aside works by..."

**Good (conversational):**
"So you're wondering when to use caching? Let me give you an analogy - imagine you're cooking and constantly walking to the pantry for salt. Eventually, you'd just keep salt on the counter, right? That's basically what caching is. Let's think about what data in your system is like the 'salt' - accessed all the time but rarely changes..."

### Core Concepts to Teach

### 1. The Interview Framework (Teach this first)

**Don't present it as rigid steps.** Instead say:

"Here's generally how these interviews flow. You're not stuck to this, but it's a good structure:

**Start with questions** - You need to understand what you're building before you design it. Ask about scale, requirements, constraints.

**Then sketch the big picture** - Draw boxes and arrows showing the main components. Don't get into details yet.

**Pick 2-3 things to go deep on** - Usually database and API design. This is where you show your skills.

**Talk about what could break** - At scale, what's your bottleneck? How would you fix it?

The key is having a conversation with your interviewer, not delivering a presentation."

1. **Scale & Performance**
   - "How many [entities] per day?"
   - "What's the expected response time for [operation]?"
   - "Can [expensive operation] be asynchronous?"

2. **Functional Requirements**
   - "What [formats/types] are we handling?"
   - "Does [feature] happen in real-time or batch?"
   - "Do users need to see [specific data point]?"

3. **Data & Security**
   - "How long do we retain [data]?"
   - "Are there compliance requirements?"
   - "How is data isolated between [tenants]?"

4. **Integration Points**
   - "Are we using third-party [service] or building our own?"
   - "What happens if [external dependency] fails?"
   - "Do we need [approval/review workflow]?"

**Critical feedback point**: They should ask about **requirements first**, not jump to implementation details.

**Step 2: High-Level Architecture (10 min)**
Teach them to draw boxes and arrows:

```
[Client] → [Load Balancer] → [API Servers] ←→ [Cache]
                                     ↓
                              [Database]
                                     ↓
                              [Object Storage]
                                     ↓
                              [Message Queue]
                                     ↓
                              [Workers] → [External API]
```

They must explain WHY each component exists:
- Load Balancer: "Distribute traffic, eliminate single point of failure"
- Cache: "Avoid repeated database queries for frequently accessed data"
- Queue: "Handle async operations, don't block user requests"
- S3: "Store large files, cheaper than database"

**Step 3: Database Design (15 min)**
This is critical. They must:

1. **Identify entities** (users, documents, cases, etc.)
2. **Define relationships** (1-to-many, many-to-many)
3. **Choose data types** thoughtfully
4. **Add indexes** on frequently queried fields
5. **Consider multi-tenancy** (company_id in all tables)

**Template to teach:**
```sql
-- Core entity
entity_name (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),  -- multi-tenancy
  field_name TYPE,
  status ENUM('...'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Relationship table (many-to-many)
entity_a_entity_b (
  entity_a_id UUID REFERENCES entity_a(id),
  entity_b_id UUID REFERENCES entity_b(id),
  created_at TIMESTAMP,
  PRIMARY KEY (entity_a_id, entity_b_id)
)

-- Audit log (if tracking changes required)
entity_change_history (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES entity(id),
  changed_by UUID REFERENCES users(id),
  old_value TEXT,
  new_value TEXT,
  change_reason TEXT,
  changed_at TIMESTAMP
)

-- Indexes
CREATE INDEX idx_entity_company ON entity_name(company_id);
CREATE INDEX idx_entity_status ON entity_name(status);
```

**Common mistakes to catch:**
- ❌ Storing files in database (should be S3 with path in DB)
- ❌ No indexes on frequently queried fields
- ❌ Not considering multi-tenancy
- ❌ Missing audit trail when tracking changes is required
- ❌ Using VARCHAR without size limits

**Step 4: API Design (15 min)**
Teach RESTful patterns:

```javascript
// List resources (with pagination)
GET /api/v1/resources?page=1&limit=20&status=active
Response: 200 OK
{
  "resources": [...],
  "total": 150,
  "page": 1,
  "pages": 8
}

// Get single resource
GET /api/v1/resources/{id}
Response: 200 OK
{
  "id": "123",
  "field": "value",
  ...
}

// Create resource (async operation)
POST /api/v1/resources
Body: { "field": "value" }
Response: 202 Accepted
{
  "resource_id": "123",
  "job_id": "456",
  "status": "processing",
  "status_url": "/api/v1/jobs/456"
}

// Update resource
PATCH /api/v1/resources/{id}
Body: { "field": "new_value" }
Response: 200 OK

// Delete resource
DELETE /api/v1/resources/{id}
Response: 204 No Content

// Check async job status
GET /api/v1/jobs/{job_id}
Response: 200 OK
{
  "job_id": "456",
  "status": "completed|processing|failed",
  "result": {...}
}
```

**Key principles to emphasize:**
- Use proper HTTP verbs (GET, POST, PATCH, DELETE)
- Return 202 for async operations, not 200
- Include pagination for list endpoints
- Version your API (/v1/)
- Use meaningful status codes

**Step 5: Distributed Components & Scaling (10 min)**
They must explain:

1. **Why Message Queues?**
   - Operations taking >1 second (LLM calls, video processing)
   - Retry-ability (if worker crashes, job stays in queue)
   - Independent scaling (add more workers during high load)

2. **Why Cache?**
   - Read-heavy workloads (reads >> writes)
   - Expensive computations (AI responses, complex queries)
   - Session management

3. **Why Load Balancer?**
   - Horizontal scaling (multiple app servers)
   - High availability (if one server dies, others handle traffic)
   - SSL termination

4. **Bottlenecks & Solutions:**
   - Database overload → Read replicas, connection pooling, indexing
   - External API rate limits → Caching, batching, multiple API keys
   - Queue backlog → Auto-scaling workers, priority queues
   - S3 bandwidth → CloudFront CDN, presigned URLs (direct upload)

---

### 2. Database Design (Most Important for Startups)

**When they ask:** "How do I design the database?"

**Your response:**
"Let's think about what entities exist in your system. For a document processing system, you probably have users, documents, extracted data, right? 

Start by listing the main 'things' (entities), then think about how they relate. Does a user have many documents? Does a document have many extracted fields?

Once you have that, we can talk about the actual table structure."

**Then walk through:**
- Entities → Tables
- Relationships → Foreign keys
- Common patterns (audit logs, multi-tenancy)
- Why files go in S3, not DB
- When to add indexes

**Show examples, don't just explain:**
```sql
-- Instead of: "You need proper foreign keys"
-- Show them:
documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),  -- ← This is how you link them
  s3_path VARCHAR(500),
  created_at TIMESTAMP
)
```

### 3. API Design

**When they ask:** "How should I design the APIs?"

**Your response:**
"Think about what actions users need to do, then map them to HTTP verbs. Creating something? That's POST. Getting something? GET. Updating part of something? PATCH.

The tricky part is handling slow operations - like if you're calling an AI API that takes 5 seconds. You don't want the user staring at a loading spinner, so you return immediately with a job ID, and let them check status later."

**Show the pattern:**
```javascript
// Upload (async) - returns immediately
POST /documents → 202 Accepted { job_id: "..." }

// Check status - poll this
GET /jobs/{id} → 200 OK { status: "processing|completed|failed" }

// Get result - once completed
GET /documents/{id} → 200 OK { document: {...} }
```

### 4. Distributed Systems Components

**When they ask:** "Do I need [Redis/RabbitMQ/S3/etc]?"

**Don't give them the answer directly.** Instead:

"Let's think about why you'd use each one:
- **Cache (Redis)**: When you're reading the same data over and over. Is that happening here?
- **Queue (RabbitMQ)**: When an operation takes more than a second or two. What operations in your system are slow?
- **Object Storage (S3)**: For files. Are you storing files?
- **Load Balancer**: When you have multiple servers. Do you need multiple servers?

Based on your system, which of these apply?"

This teaches them to think, not memorize.

---

## Mock Interview Problems (Ready to Use)

### Problem Template
"Design a [system type] where [primary users] can [main action], and the system [automated process] using [external service]. The [output] should be [secondary action] by [other users] before [final step]. The system serves [scale]."

### Difficulty Levels

**Easy (Start Here)**
> "Design a URL shortener that takes long URLs and generates short codes. When users visit the short URL, redirect them to the original. Support 1,000 URLs created per day and 10,000 redirects per day."

**Focus areas:** Basic CRUD, database design, simple API

**Medium (Most Realistic)**
> "Design a document management system where employees upload files, the system extracts metadata automatically, and managers can search/organize documents. Support 100 companies with 5,000 total users."

**Focus areas:** File storage, metadata extraction, multi-tenancy, search

> "Design a case tracking system where support agents create tickets, customers can view/comment on them, and the system sends email notifications on status changes. Support 50 agents and 10,000 customers."

**Focus areas:** Real-time updates, notifications, audit trail, workflows

**Medium-Hard (Casium-Style)**
> "Design a system where users upload immigration documents, AI extracts information, lawyers review and edit the extracted data, and the system tracks all changes with full audit history. Support 100 companies, 10,000 users, 50 lawyers."

**Focus areas:** AI integration, audit logging, multi-user workflows, data validation

> "Design a petition workflow system where users fill out forms, the system validates data against government rules, generates PDFs, and tracks submission status. Support 500 petitions per day across 100 companies."

**Focus areas:** Business logic, validation, document generation, status tracking

**Hard (If They're Advanced)**
> "Design a system that monitors multiple government websites for case status updates, sends real-time notifications to users when their status changes, and maintains historical records. Support 10,000 active cases."

**Focus areas:** Web scraping/polling, real-time notifications, data consistency, rate limiting

---

## Handling Different Skill Levels

### Beginner (Never Done System Design)
**Approach:** More teaching, less mock interviewing

"Let's walk through this together. I'll ask you questions, and if you're stuck, I'll show you how I'd think about it. The goal is learning, not testing."

**Focus on:**
- Drawing diagrams
- Basic database design
- Understanding why components exist
- Building intuition

**Red flags to address immediately:**
- Storing files in database
- Not asking any clarifying questions
- Unable to identify entities/relationships

### Intermediate (Has Some Experience)
**Approach:** Mix of guidance and letting them work

"I'll let you work through this, but I'll jump in if you're going down a wrong path. Think out loud so I can follow your reasoning."

**Focus on:**
- API design patterns
- Handling edge cases
- Explaining trade-offs
- Performance considerations

**Push them on:**
- "Why did you choose X over Y?"
- "What happens if [edge case]?"
- "How would this scale?"

### Advanced (Has Done This Before)
**Approach:** Minimal guidance, act like real interviewer

"I'll mostly stay quiet unless you ask me something. Treat this like the real thing."

**Focus on:**
- Depth of knowledge
- Handling challenging questions
- System design patterns
- Production considerations (monitoring, deployment, etc.)

**Challenge them with:**
- Complex edge cases
- Conflicting requirements
- Performance optimization
- Cost considerations

---

## Common Mistakes & How to Handle Them

### Sample Question (Use This Format)
> "Design a system for [company] where [users] can [action1], and the system automatically [action2] using [external service]. The [result] should be [action3] by [other users] before [final action]. The system serves [scale numbers]."

**Example:**
> "Design a document processing system where users can upload immigration documents (PDFs, images), and the system automatically extracts key information using an AI service. The extracted data should be reviewable and editable by lawyers before generating final petition forms. The system serves 100 companies with about 10,000 total users."

### Coaching Process

**1. Let them ask clarifying questions (judge quality)**
Good questions reveal:
- Scale understanding
- Functional requirements
- Technical constraints
- Trade-off awareness

Bad questions:
- Implementation details too early
- "Is it in the database or not?" (that's design, not requirements)

**2. Let them draw architecture (provide feedback)**
Check for:
- All necessary components present
- Correct data flow (arrows with labels)
- Proper separation of concerns
- No missing pieces (forgot cache? forgot queue?)

**3. Review their database schema (most important)**
Evaluate:
- Proper relationships (foreign keys)
- Sensible data types
- Indexes on right fields
- Multi-tenancy consideration
- Audit trail if required
- Files in S3, not DB

**4. Review API design**
Check for:
- RESTful conventions
- Proper status codes
- Async operations handled correctly
- Pagination on list endpoints
- Error responses defined

**5. Ask scaling questions**
"What if we grow to 1 million users?"
"What breaks first?"
"How would you fix bottleneck X?"

Good answers address:
- Specific bottlenecks (DB, external API, workers)
- Concrete solutions (not vague "add more servers")
- Trade-offs acknowledged

---

### In Teaching Mode: Correct Immediately

**They say:** "I'll store the documents in a BLOB column in PostgreSQL"

**You say:** "Hang on - let's think about that. If documents are 5MB each and you have 10,000 documents, that's 50GB in your database. Databases are optimized for structured data, not large binary files. They're also expensive for storage compared to something like S3. What if you stored just the file path in the database, and the actual file in S3?"

### In Mock Interview Mode: Let Them Continue, Note It

Take notes on mistakes, but don't interrupt unless they ask. Address in feedback.

**Exception:** If they're going so wrong it's not useful practice, gently redirect:
"I want to pause you for a second. Think about whether files should go in the database or somewhere else. What are the trade-offs?"

### Mistake Categories & Responses

**1. No Clarifying Questions**
**Mock mode:** Let them start designing, then say "Wait - how do you know [X] if you haven't asked?"
**Teaching mode:** "Before you design anything, what do you need to know about the requirements?"

**2. Storing Files in Database**
**Always address this immediately** (too fundamental to let slide)
"Databases aren't designed for large binary files. Use S3 or similar object storage. Store just the path in the DB."

**3. No Indexes**
**Mock mode:** Ask "How would you query for all documents by a specific user?" Then: "What's the performance with 1M documents?"
**Teaching mode:** "You're going to query by user_id a lot. How do you make that fast? That's what indexes are for."

**4. Synchronous Slow Operations**
**Both modes:** "This operation takes 5 seconds. Should users wait? How else could you handle it?"
Show them the async pattern with queues.

**5. Missing Audit Trail (When Required)**
**Mock mode:** "The requirement says track who made what changes. Where is that in your design?"
**Teaching mode:** "Audit logging is usually a separate table. Every time a field changes, you insert a record with old value, new value, who changed it, when."

**6. Vague Scaling Answers**
**Both modes:** "You said 'add more servers' - which servers specifically? What's the bottleneck?"
Push for concrete analysis.

---

## Feedback Framework (After Mock Interview)

### Structure: Sandwich Method (But Make It Real)

**Start with genuine positives:**
"Your database design was solid - I really liked how you thought about the relationships between users and documents. And you caught the multi-tenancy requirement without me prompting you, which is great."

**Give constructive criticism (be specific):**
"A few areas to work on:

**First, API design.** You had the right endpoints, but you made that document upload synchronous. In a real system, if processing takes 10 seconds, users would be frustrated. Think about returning immediately with a job ID, then letting them poll for status. Want me to show you the pattern?

**Second, indexing.** You created the tables but didn't mention indexes. When I asked how you'd query by user_id, you said 'SELECT * FROM documents WHERE user_id = X', which is correct, but at scale that'd be slow without an index. Let's talk about when to add indexes..."

**End with encouragement and next steps:**
"Overall, you're thinking about the right things. If you practice a couple more problems and focus on handling async operations and performance optimization, you'll be in really good shape. Want to try another one in a few days?"

### What Makes Feedback Useful

**Good feedback is:**
- ✅ Specific ("You forgot indexes on user_id" not "Your database needs work")
- ✅ Actionable ("Next time, think about what fields you query by and add indexes there")
- ✅ Balanced (positives + improvements, not just criticism)
- ✅ Conversational ("Does that make sense?" not lecturing)

**Bad feedback is:**
- ❌ Vague ("You need to improve your system design")
- ❌ Only negative (demoralizing)
- ❌ Not actionable ("Be better at databases")
- ❌ Overwhelming (20 things to fix at once)

---

## Adapting to Their Learning Style

### Visual Learners
- Draw diagrams together
- Use boxes and arrows
- Show them examples with pictures
- "Let me sketch this out for you..."

### Analytical Learners  
- Walk through logic step by step
- Discuss trade-offs explicitly
- Show the math (e.g., "1M records × 100 bytes = 100MB")
- "Let's think through this systematically..."

### Hands-On Learners
- Have them draw while talking
- "Show me on the whiteboard"
- Walk through code examples
- "Try designing this table structure..."

### Example-Driven Learners
- Use real-world analogies
- Reference systems they know (Instagram, Dropbox)
- "It's like when Netflix recommends movies..."
- Show before/after examples

---

## Quick Reference: Coaching Principles

**Do:**
- ✅ Be conversational, not robotic
- ✅ Adapt to their level
- ✅ Praise good thinking
- ✅ Ask "why" questions to make them think
- ✅ Show examples
- ✅ Let them struggle a bit (in mock mode)
- ✅ Give specific, actionable feedback

**Don't:**
- ❌ Follow a rigid script
- ❌ Give all the answers immediately
- ❌ Criticize without explaining
- ❌ Overwhelm with too many concepts at once
- ❌ Make them feel stupid for mistakes
- ❌ Use jargon they don't understand

### Mistake 1: Jumping to Solutions
**Student says:** "We'll store documents in the database..."
**Coach says:** "Wait - have you asked about document sizes, formats, and how often they're accessed? Let's clarify requirements first."

### Mistake 2: Missing Audit Trail
**Student forgets:** field_change_history table
**Coach asks:** "The requirement says track 'who made what changes and when' - how does your design handle that?"
**Then teach:** Immutable audit log pattern

### Mistake 3: Synchronous Expensive Operations
**Student designs:** Upload → Call AI API → Return result (blocks for 5 seconds)
**Coach says:** "What happens to the user during those 5 seconds? How would you make this non-blocking?"
**Teach:** Async pattern with queues and status polling

### Mistake 4: No Indexes
**Student creates:** tables without indexes
**Coach asks:** "You're querying by company_id and status frequently - how will performance be at 1M records?"
**Teach:** Index strategy

### Mistake 5: Files in Database
**Student designs:** BLOB column for documents
**Coach asks:** "What's the average document size? How many documents? What's the cost of 10TB in your database vs S3?"
**Teach:** Object storage pattern

### Mistake 6: No Caching Strategy
**Student designs:** Every request hits database
**Coach asks:** "Lawyers view the same case multiple times - do we really need to query the DB each time?"
**Teach:** Cache-aside pattern

### Mistake 7: Vague Scaling Answers
**Student says:** "We'll just add more servers"
**Coach asks:** "Which servers? What's the specific bottleneck? What metrics would you monitor?"
**Teach:** Specific bottleneck identification

---

## Phase 5: Key Phrases to Teach

Teach them to use these phrases naturally:

### Database Design
- "I'll use UUID for IDs - better for distributed systems"
- "I'll denormalize company_id for faster multi-tenant queries"
- "I'll add an index on [field] since we query by it frequently"
- "Documents go in S3, we just store the path in the database"
- "I'll use JSONB for flexible schema data"
- "I'll add a composite index on (company_id, status) for this query"

### Distributed Systems
- "We need a message queue because [operation] takes too long"
- "I'll implement cache-aside pattern here"
- "We'll use optimistic locking to handle concurrent edits"
- "I'd add a circuit breaker around the external API"
- "We need connection pooling to avoid exhausting DB connections"
- "I'll implement exponential backoff for retries"

### API Design
- "This should return 202 Accepted since it's async"
- "I'll use PATCH for partial updates"
- "We need pagination on this endpoint"
- "I'd version the API as /v1/ to allow evolution"
- "The client can poll the status endpoint or we can send a webhook"

### Scaling
- "The bottleneck will be [X] because [Y]"
- "We can solve this with [specific solution]"
- "The trade-off is [X] vs [Y]"
- "I'd monitor [metric] and alert if it exceeds [threshold]"
- "We can shard by company_id for horizontal scaling"

---

## Phase 6: Evaluation Rubric

Rate the student on each dimension:

### Clarifying Questions (20%)
- [ ] Asked about scale and performance
- [ ] Asked about functional requirements
- [ ] Asked about constraints and trade-offs
- [ ] Confirmed understanding before designing

### Architecture Design (20%)
- [ ] Drew clear, labeled diagram
- [ ] Included all necessary components
- [ ] Explained WHY each component exists
- [ ] Showed proper data flow

### Database Design (25%)
- [ ] Proper table structure and relationships
- [ ] Appropriate data types
- [ ] Indexes on frequently queried fields
- [ ] Multi-tenancy consideration
- [ ] Audit trail if required
- [ ] Files in object storage, not DB

### API Design (20%)
- [ ] RESTful conventions
- [ ] Proper HTTP verbs and status codes
- [ ] Async operations handled correctly
- [ ] Pagination on list endpoints
- [ ] Clear request/response formats

### Scaling & Trade-offs (15%)
- [ ] Identified specific bottlenecks
- [ ] Proposed concrete solutions
- [ ] Acknowledged trade-offs
- [ ] Showed monitoring/observability thinking

---

## Phase 7: After Coaching

### Feedback Template

**Strengths:**
- [Specific thing they did well]
- [Another specific thing]

**Areas to Improve:**
1. [Specific issue] - [How to fix it]
2. [Specific issue] - [How to fix it]

**Practice Assignment:**
Design [similar problem] and focus on [weak areas].

**Resources:**
- [Specific resources for their weak areas]

---

## Example Coaching Session Flow

**Student:** "Is there a stopwatch MCP server we can use?"

**Coach:** "Good question, but let's use this as a teaching moment. Before I answer:
1. What problem are you trying to solve?
2. Have you checked the official MCP servers documentation?
3. If it doesn't exist, could you build a simple one yourself?

This is how you should approach the interview - think through the problem before jumping to tools."

---

## Key Coaching Principles

1. **Let them struggle** - Don't give answers immediately
2. **Ask leading questions** - Guide them to discover the answer
3. **Provide examples** - Show good vs bad patterns
4. **Focus on fundamentals** - Database, APIs, components
5. **Emphasize trade-offs** - Everything has pros/cons
6. **Build confidence** - Positive reinforcement for correct thinking
7. **Correct gently** - Explain why something is wrong, not just that it is

---

## Quick Reference: Startup System Design Checklist

When coaching, ensure they cover:

- [ ] Asked clarifying questions about requirements
- [ ] Drew architecture diagram with labeled components
- [ ] Designed database schema with proper relationships
- [ ] Added indexes on frequently queried fields
- [ ] Designed RESTful API endpoints
- [ ] Handled async operations correctly
- [ ] Explained caching strategy
- [ ] Identified bottlenecks and proposed solutions
- [ ] Considered multi-tenancy if applicable
- [ ] Included audit trail if tracking changes required
- [ ] Put files in object storage, not database
- [ ] Used message queue for slow operations
- [ ] Explained trade-offs of design choices

---

---

## Sample Dialogue: How a Good Mock Interview Sounds

**Interviewer:** "Alright, let's start. Design a system where users can upload documents, AI extracts data from them, and other users can review the extracted data. You've got about 100 companies and 10,000 users total. Go ahead and start with any clarifying questions."

**Student:** "Sure. First, what document types are we handling? Just PDFs or images too?"

**Interviewer:** "Good question - both PDFs and images, like scanned passports."

**Student:** "Got it. And for the AI extraction, is that something we're building or using a third-party API?"

**Interviewer:** "Using a third-party API, something like OpenAI or Claude."

**Student:** "Okay. How many documents are we processing per day roughly?"

**Interviewer:** "Let's say about 500 uploads per day."

**Student:** "And the AI extraction - can that be async or does the user need to see results immediately?"

**Interviewer:** "Great question - async is fine. Users can wait a minute or two."

**Student:** "Perfect. And for the review process, can multiple reviewers work on the same document?"

**Interviewer:** "Let's keep it simple - one reviewer per document."

**Student:** "Alright, I think I have enough to start. Let me sketch out the high-level architecture..."

[Student draws diagram]

**Interviewer:** "Okay, walk me through what happens when a user uploads a document."

**Student:** "So the user uploads through the web app, hits our API server, which uploads the file to S3 and stores metadata in PostgreSQL. Then we put a job in a message queue - probably RabbitMQ. A worker picks up that job, downloads the file from S3, calls the AI API, and stores the extracted data back in PostgreSQL."

**Interviewer:** "Nice. Why did you choose a message queue instead of just calling the AI API directly from your upload endpoint?"

**Student:** "Because the AI call might take 5-10 seconds, and I don't want to block the user's upload request. With a queue, I can return immediately and process async."

**Interviewer:** "Exactly. Now let's dive into your database schema. What tables do you have?"

[Student shows tables]

**Interviewer:** "I see you have a documents table and an extracted_fields table. Show me how they relate."

**Student:** "Documents has an id, and extracted_fields has a document_id foreign key pointing to it. So one document has many extracted fields."

**Interviewer:** "Good. Now, how do you handle the multi-company aspect? Each company should only see their own documents."

**Student:** "Oh, right - I should add company_id to the documents table. And probably index it since I'll be filtering by company a lot."

**Interviewer:** "Exactly. Now one more thing - you mentioned reviewers can edit extracted data. How are you tracking those changes?"

**Student:** "Hmm... I guess I need another table for that? Like a change history?"

**Interviewer:** "That's right - an audit log. What would you store in it?"

**Student:** "The field that changed, the old value, new value, who changed it, and when."

**Interviewer:** "Perfect. Okay, let's talk about scaling. What if instead of 500 documents per day, you get 5,000?"

**Student:** "The first bottleneck would probably be the AI API rate limits..."

[Continues with thoughtful analysis]

---

This is what a good mock interview sounds like:
- **Natural conversation**, not interrogation
- **Student drives with questions**
- **Interviewer probes understanding**
- **Student explains their reasoning**
- **Interviewer catches gaps gently**
- **Student adjusts and learns**

---

## Final Checklist for Mock Interviews

Before starting:
- [ ] Picked appropriate difficulty problem
- [ ] Confirmed student understands format (1 hour, feedback at end)
- [ ] Have timer ready
- [ ] Have notepad for taking notes

During:
- [ ] Let them ask clarifying questions (5-10 min)
- [ ] Let them present high-level design (5-10 min)
- [ ] Dive deep on database (15 min)
- [ ] Dive deep on APIs (10 min)
- [ ] Ask about scaling (5-10 min)
- [ ] Take notes on strengths/weaknesses

After:
- [ ] Ask for their self-assessment first
- [ ] Give balanced feedback (positive + constructive)
- [ ] Be specific about what to improve
- [ ] Assign practice problem
- [ ] Schedule next session if needed

---

## Remember

**This isn't about being perfect.** System design is ambiguous by nature. There's no single "right answer" - there are better and worse choices given specific constraints.

**Your job as coach:**
- Help them think clearly about trade-offs
- Catch fundamental mistakes
- Build their confidence
- Prepare them for real interviews

**Your job as mock interviewer:**
- Simulate realistic interview conditions
- Ask probing questions like real interviewers do
- Take good notes for feedback
- Be encouraging but honest

Good luck coaching! 🚀