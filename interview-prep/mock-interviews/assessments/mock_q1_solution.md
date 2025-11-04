# Mock Question 1 Solution: Online Learning Platform

## My Approach (How I'd Solve This)

### Step 1: Identify Core Entities (5 minutes)
Reading through requirements, I spot these main "things":
- **Users** (instructors and students)
- **Courses** (created by instructors)
- **Lessons** (part of courses)
- **Quizzes** (part of courses)
- **Enrollments** (students in courses)
- **Payments** (for courses/subscriptions)
- **Certificates** (when completed)
- **Forum Posts** (discussions)

### Step 2: Map Relationships (10 minutes)
- Instructor (1) → Courses (many)
- Course (1) → Lessons (many)
- Course (1) → Quizzes (many)
- Students ↔ Courses (many-to-many via enrollments)
- Course (1) → Forum Posts (many)
- Enrollment (1) → Certificate (1)

### Step 3: Build Schema (20 minutes)

```sql
-- Core user management
Table users {
  id integer [primary key]
  email varchar [unique, not null]
  password_hash varchar [not null]
  first_name varchar [not null]
  last_name varchar [not null]
  role varchar [not null] // 'instructor', 'student', 'admin'
  status varchar [default: 'active'] // 'active', 'suspended', 'deleted'
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

-- Course structure
Table courses {
  id integer [primary key]
  instructor_id integer [ref: > users.id, not null]
  title varchar [not null]
  description text
  price decimal(10,2) [not null]
  difficulty_level varchar // 'beginner', 'intermediate', 'advanced'
  estimated_hours integer
  status varchar [default: 'draft'] // 'draft', 'published', 'archived'
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table lessons {
  id integer [primary key]
  course_id integer [ref: > courses.id, not null]
  title varchar [not null]
  content text
  video_url varchar
  order_index integer [not null]
  duration_minutes integer
  created_at timestamp [default: `now()`]
}

Table quizzes {
  id integer [primary key]
  course_id integer [ref: > courses.id, not null]
  lesson_id integer [ref: > lessons.id] // optional - quiz can be course-level
  title varchar [not null]
  passing_score integer [default: 70] // percentage
  max_attempts integer [default: 3]
  created_at timestamp [default: `now()`]
}

Table quiz_questions {
  id integer [primary key]
  quiz_id integer [ref: > quizzes.id, not null]
  question_text text [not null]
  question_type varchar [not null] // 'multiple_choice', 'true_false', 'essay'
  correct_answer text
  points integer [default: 1]
  order_index integer [not null]
}

-- Student progress and enrollment
Table enrollments {
  id integer [primary key]
  student_id integer [ref: > users.id, not null]
  course_id integer [ref: > courses.id, not null]
  enrollment_type varchar [not null] // 'individual', 'subscription'
  status varchar [default: 'active'] // 'active', 'completed', 'dropped'
  progress_percentage decimal(5,2) [default: 0.00]
  enrolled_at timestamp [default: `now()`]
  completed_at timestamp

  Indexes {
    (student_id, course_id) [unique]
  }
}

Table lesson_progress {
  id integer [primary key]
  enrollment_id integer [ref: > enrollments.id, not null]
  lesson_id integer [ref: > lessons.id, not null]
  status varchar [default: 'not_started'] // 'not_started', 'in_progress', 'completed'
  time_spent_minutes integer [default: 0]
  completed_at timestamp

  Indexes {
    (enrollment_id, lesson_id) [unique]
  }
}

Table quiz_attempts {
  id integer [primary key]
  enrollment_id integer [ref: > enrollments.id, not null]
  quiz_id integer [ref: > quizzes.id, not null]
  score_percentage decimal(5,2)
  status varchar [default: 'in_progress'] // 'in_progress', 'completed'
  attempt_number integer [not null]
  started_at timestamp [default: `now()`]
  completed_at timestamp
}

-- Payment and subscription handling
Table subscriptions {
  id integer [primary key]
  student_id integer [ref: > users.id, not null]
  plan_type varchar [not null] // 'monthly', 'annual'
  price decimal(10,2) [not null]
  status varchar [default: 'active'] // 'active', 'cancelled', 'expired'
  starts_at timestamp [not null]
  expires_at timestamp [not null]
  created_at timestamp [default: `now()`]
}

Table payments {
  id integer [primary key]
  user_id integer [ref: > users.id, not null]
  course_id integer [ref: > courses.id] // null for subscription payments
  subscription_id integer [ref: > subscriptions.id] // null for course payments
  amount decimal(10,2) [not null]
  payment_method varchar [not null] // 'credit_card', 'paypal', 'bank_transfer'
  status varchar [default: 'pending'] // 'pending', 'completed', 'failed', 'refunded'
  transaction_id varchar [unique] // external payment processor ID
  created_at timestamp [default: `now()`]
}

Table refunds {
  id integer [primary key]
  payment_id integer [ref: > payments.id, not null]
  amount decimal(10,2) [not null]
  reason text
  status varchar [default: 'pending'] // 'pending', 'approved', 'rejected'
  requested_at timestamp [default: `now()`]
  processed_at timestamp
}

-- Certificates
Table certificates {
  id integer [primary key]
  enrollment_id integer [ref: > enrollments.id, not null]
  certificate_number varchar [unique, not null]
  issued_at timestamp [default: `now()`]
  expires_at timestamp // some certificates might expire
}

-- Discussion forums
Table forum_posts {
  id integer [primary key]
  course_id integer [ref: > courses.id, not null]
  user_id integer [ref: > users.id, not null]
  parent_post_id integer [ref: > forum_posts.id] // for replies
  title varchar
  content text [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

-- Instructor revenue tracking
Table instructor_earnings {
  id integer [primary key]
  instructor_id integer [ref: > users.id, not null]
  course_id integer [ref: > courses.id, not null]
  enrollment_id integer [ref: > enrollments.id, not null]
  amount decimal(10,2) [not null]
  earned_at timestamp [default: `now()`]
  payout_status varchar [default: 'pending'] // 'pending', 'paid'
}
```

## Key Design Decisions

1. **User roles in single table** - Simple enum rather than separate instructor/student tables
2. **Enrollment as central hub** - Links students to courses and tracks all progress
3. **Flexible payment model** - Supports both individual course purchases and subscriptions
4. **Progress tracking** - Separate tables for lesson progress and quiz attempts
5. **Forum structure** - Self-referencing posts table for threaded discussions
6. **Revenue tracking** - Separate table to track instructor earnings per enrollment

## Business Rules Handled

- ✅ Multiple courses per instructor
- ✅ Student progress tracking through lessons and quizzes
- ✅ Both individual and subscription payments
- ✅ Certificate generation on completion
- ✅ Discussion forums per course
- ✅ Refund handling
- ✅ Instructor revenue calculation

## Potential Extensions

- Course categories/tags
- Student reviews and ratings
- Course prerequisites
- Bulk discounts for organizations
- Video streaming analytics
- Mobile app support tokens