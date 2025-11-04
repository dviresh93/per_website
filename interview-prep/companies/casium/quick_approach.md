# 30-Minute Schema Design: Visual Method

## Time Breakdown
- **5 min**: Read & identify entities
- **20 min**: Draw core tables with relationships
- **5 min**: Add details & review

## Step 1: Quick Entity List (2 minutes)
From the learning platform requirements:
```
CORE ENTITIES:
- users (instructors + students)
- courses
- lessons
- enrollments (student ↔ course)
- payments
- certificates
- quiz_attempts
```

## Step 2: Draw Main Tables (15 minutes)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │────▶│   courses   │◀────│ enrollments │
├─────────────┤ 1:M ├─────────────┤ M:M ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ email       │     │ title       │     │ student_id  │
│ role        │     │ price       │     │ course_id   │
│ created_at  │     │ instructor_id│     │ progress %  │
└─────────────┘     │ created_at  │     │ status      │
                    └─────────────┘     │ enrolled_at │
                           │            └─────────────┘
                           │ 1:M               │
                           ▼                   │ 1:1
                    ┌─────────────┐            ▼
                    │   lessons   │     ┌─────────────┐
                    ├─────────────┤     │certificates │
                    │ id (PK)     │     ├─────────────┤
                    │ course_id   │     │ id (PK)     │
                    │ title       │     │ enrollment_id│
                    │ order_index │     │ issued_at   │
                    │ content     │     └─────────────┘
                    └─────────────┘

┌─────────────┐     ┌─────────────┐
│  payments   │     │quiz_attempts│
├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │
│ user_id     │     │ enrollment_id│
│ course_id   │     │ lesson_id   │
│ amount      │     │ score       │
│ status      │     │ completed_at│
└─────────────┘     └─────────────┘
```

## Step 3: Add Key Attributes (3 minutes)

Focus on ESSENTIAL fields only:

**users**: id, email, role ('instructor'/'student'), created_at
**courses**: id, instructor_id, title, price, status, created_at
**lessons**: id, course_id, title, order_index
**enrollments**: id, student_id, course_id, progress_pct, status
**payments**: id, user_id, course_id, amount, status
**certificates**: id, enrollment_id, issued_at
**quiz_attempts**: id, enrollment_id, lesson_id, score

## Step 4: Mark Relationships (2 minutes)

```
users 1:M courses (instructor_id)
users M:M courses (via enrollments)
courses 1:M lessons
enrollments 1:1 certificates
enrollments 1:M quiz_attempts
users 1:M payments
```

## Ultra-Fast Template

For ANY business domain, start with this pattern:

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  users  │───▶│products │◀───│ orders  │
└─────────┘    └─────────┘    └─────────┘
     │              │              │
     ▼              ▼              ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│profiles │    │categories│   │payments │
└─────────┘    └─────────┘    └─────────┘
```

Then adapt:
- **Learning**: products→courses, orders→enrollments
- **E-commerce**: Keep as-is
- **Project Mgmt**: products→projects, orders→assignments
- **Healthcare**: products→appointments, orders→visits

## Common Shortcuts

**Status everywhere**: active/inactive, pending/completed
**Timestamps everywhere**: created_at, updated_at
**Junction tables**: For any many-to-many relationship
**Soft deletes**: deleted_at column instead of hard delete

## Red Flags to Avoid
- ❌ Spending 10 minutes on one table
- ❌ Adding every possible field
- ❌ Forgetting foreign keys
- ❌ No primary keys marked
- ❌ Missing core business entities

## 30-Min Success Strategy
1. **Scan for nouns** → entities
2. **Draw boxes fast** → don't overthink
3. **Connect with arrows** → relationships
4. **Add just essential fields**
5. **Mark PKs and FKs clearly**

The goal is **functional completeness**, not perfection!