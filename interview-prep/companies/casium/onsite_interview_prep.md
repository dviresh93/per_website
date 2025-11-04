# Casium On-Site Interview Preparation Plan

**Interview Date:** TBD (scheduled via Calendly)
**Location:** Seattle Office - Pier 70 (in-person)
**Duration:** 2 hours total
**Format:** Live Coding (1 hour) + System Design (1 hour)

---

## Interview Format Breakdown

### Round 1: Live Coding (1 hour)
- **Environment:** Shared text editor + projector
- **Style:** Similar to Woven assessment (practical questions)
- **Focus:** Working code, edge cases, clear communication

### Round 2: System Design (1 hour)
- **Environment:** Whiteboard OR shared drawing tool + projector
- **Focus:** Database & API design, distributed system components
- **Scale:** Moderate number of users (not massive scale)

---

## Preparation Strategy

### Live Coding Round Prep

**What They're Looking For:**
- Practical problem solving (not just algorithms)
- Clean, working code that handles edge cases
- Ability to explain your thinking as you code
- Similar complexity to Woven assessment you already completed

**How to Prepare:**

1. **Review your existing practice materials:**
   - `real_interview_question.py` - realistic complexity level
   - `subscription_billing.py` - business logic focus
   - `prorating_subscriptions.md` - edge cases and date handling
   - `emergency_prep.py` - core patterns quick review

2. **Focus areas based on Woven style:**
   - Data transformations and aggregations
   - Date/time calculations and edge cases
   - List/dict manipulations
   - API request/response handling
   - Error handling and validation

3. **Practice talking through your code:**
   - Explain what you're doing BEFORE you write it
   - Mention edge cases as you handle them
   - Discuss trade-offs when choosing an approach

**Day-Before Checklist:**
- [ ] Run through `emergency_prep.py` patterns
- [ ] Practice 1-2 problems from existing materials OUT LOUD
- [ ] Review common gotchas (off-by-one, None handling, type conversions)

---

### System Design Round Prep

**What They're Looking For:**
- Database schema design (entities, relationships, constraints)
- API endpoint design (REST patterns, request/response)
- Understanding of distributed system components
- Scalability thinking for moderate traffic

**Core Topics to Master:**

#### 1. Database Design
- Use your existing schema materials:
  - `prep_guide.md` - systematic approach
  - `quick_approach.md` - fast entity identification
  - `template_walkthrough.md` - common patterns

**Schema Design Process (5-7 min reading, 15-20 min design):**
1. Identify entities (nouns in requirements)
2. Define relationships (one-to-many, many-to-many)
3. Determine constraints and indexes
4. Handle edge cases (soft deletes, timestamps, etc.)

#### 2. API Design
**Common patterns to know:**
- RESTful endpoint naming (`/users`, `/users/{id}`, `/users/{id}/orders`)
- HTTP methods (GET, POST, PUT/PATCH, DELETE)
- Request/response structure (JSON bodies, status codes)
- Pagination and filtering (`?page=1&limit=20`, `?status=active`)
- Authentication/authorization headers

**Example structure to practice:**
```
POST /api/users
GET /api/users/{id}
PUT /api/users/{id}
DELETE /api/users/{id}

# Nested resources
GET /api/users/{id}/orders
POST /api/users/{id}/orders
```

#### 3. Distributed System Components
**Key concepts for moderate scale:**
- **Load Balancer:** Distribute traffic across servers
- **Application Servers:** Multiple instances for redundancy
- **Database:** Primary/replica setup for reads
- **Cache Layer:** Redis/Memcached for frequently accessed data
- **Message Queue:** Async processing (Celery, RabbitMQ)
- **Object Storage:** S3 for files/media
- **CDN:** Static asset delivery

**Don't overcomplicate:** For "moderate users", focus on:
- 2-3 app servers behind load balancer
- Database with read replicas
- Cache for hot data
- Simple queue for async jobs

---

## Common System Design Questions (Practice These)

### 1. Design a URL Shortener
**Database:**
- `urls` table (id, long_url, short_code, created_at, clicks)
- Index on short_code for fast lookups

**API:**
- `POST /shorten` - create short URL
- `GET /{short_code}` - redirect to long URL

**Components:**
- App servers (generate short codes, handle redirects)
- Database (store mappings)
- Cache (frequently accessed URLs)

### 2. Design a Task/Todo Application
**Database:**
- `users` (id, email, password_hash)
- `tasks` (id, user_id, title, description, status, due_date)
- `tags` (id, name)
- `task_tags` (task_id, tag_id) - many-to-many

**API:**
- `GET /tasks` - list tasks (with filtering)
- `POST /tasks` - create task
- `PUT /tasks/{id}` - update task
- `DELETE /tasks/{id}` - delete task

**Components:**
- App servers
- Database with indexes on user_id, status, due_date
- Cache for user's active task list

### 3. Design a Notification System
**Database:**
- `users` (id, email, phone, notification_preferences)
- `notifications` (id, user_id, type, message, status, created_at)
- `notification_logs` (id, notification_id, channel, sent_at, status)

**API:**
- `POST /notifications` - create notification
- `GET /notifications/{user_id}` - get user notifications
- `PUT /notifications/{id}/read` - mark as read

**Components:**
- App servers (API layer)
- Message queue (decouple sending from creation)
- Worker processes (send emails/SMS/push)
- Database (store history)
- External services (SendGrid, Twilio, FCM)

---

## Interview Day Strategy

### For Live Coding:

**First 5 minutes:**
1. Read problem carefully
2. Ask clarifying questions (input format, edge cases, constraints)
3. Think out loud about approach

**Next 40 minutes:**
4. Explain your approach before coding
5. Write code with clear variable names
6. Handle edge cases as you go
7. Add comments for complex logic

**Last 15 minutes:**
8. Test with example inputs
9. Walk through edge cases
10. Discuss improvements/optimizations

### For System Design:

**First 10 minutes:**
1. Clarify requirements (users, scale, features)
2. List core entities and relationships
3. Sketch high-level architecture

**Next 30 minutes:**
4. Design database schema (tables, relationships, indexes)
5. Design API endpoints (methods, paths, request/response)
6. Add distributed components as needed

**Last 20 minutes:**
7. Discuss trade-offs and scalability
8. Handle questions and alternatives
9. Address bottlenecks and how to scale

---

## Preparation Timeline

### 3 Days Before:
- [ ] Review system design patterns (this document)
- [ ] Practice 2-3 schema designs from `mock_questions.md`
- [ ] Design APIs for common systems (URL shortener, task app)
- [ ] Review distributed system components

### 2 Days Before:
- [ ] Practice live coding problems out loud
- [ ] Work through `real_interview_question.py` timed
- [ ] Review `subscription_billing.py` for business logic patterns
- [ ] Practice explaining code as you write

### 1 Day Before:
- [ ] Quick review: `emergency_prep.py` + `quick_approach.md`
- [ ] Practice one full system design (30 min timed)
- [ ] Practice one coding problem (30 min timed)
- [ ] Get good sleep!

### Morning Of:
- [ ] Review this prep document
- [ ] Practice explaining one system design out loud
- [ ] Review common Python gotchas
- [ ] **Leave early for parking!** (Train may block access)

---

## Key Reminders

**Communication:**
- Think out loud - they want to see your thought process
- Ask questions when requirements are unclear
- Explain trade-offs when making design decisions

**Technical:**
- Start simple, add complexity only if needed
- Consider edge cases early
- Discuss scalability even for moderate scale
- Mention monitoring, logging, error handling

**Practical:**
- Arrive early (parking + train issues)
- Bring laptop if needed for reference
- Wear comfortable clothes (2-hour session)
- Stay hydrated and take breaks if offered

---

## Questions to Ask Them

**About the role:**
- What does a typical project lifecycle look like?
- How does the team collaborate on system design decisions?
- What's the balance between building new features vs maintaining existing systems?

**About the tech:**
- What's the current architecture for your core product?
- How do you handle scalability challenges?
- What's your deployment process like?

**About the team:**
- How big is the engineering team?
- What's the code review process?
- How do you approach technical debt?

---

## Resources Quick Links

**From your existing materials:**
- Python practice: `interview-prep/companies/casium/[python files]`
- Schema practice: `interview-prep/companies/casium/[schema files]`
- Company context: `casium_interview_prep.md`

**Additional prep:**
- Review your GridCOP and Drone Log Analysis projects (distributed systems you've built)
- Think about database/API design decisions you made in those projects
- Be ready to discuss real trade-offs you've encountered

---

Good luck! You've got this. The key is to communicate clearly, handle edge cases, and show practical engineering judgment.
