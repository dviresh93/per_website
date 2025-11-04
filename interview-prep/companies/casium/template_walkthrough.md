# Database Schema Template & Walkthrough

## Basic Template Pattern

For ANY database problem, follow this template:

```sql
// Main entities (the "things")
Table entity1 {
  id integer [primary key]
  name varchar
  // other fields
  created_at timestamp [default: `now()`]
}

Table entity2 {
  id integer [primary key]
  name varchar
  // other fields
  created_at timestamp [default: `now()`]
}

// Junction table (for many-to-many relationships)
Table entity1_entity2 {
  entity1_id integer [ref: > entity1.id]
  entity2_id integer [ref: > entity2.id]
  // extra fields if needed
  created_at timestamp [default: `now()`]
}
```

## Simple Example: School System

**Question**: Design a database for a school where students take classes and teachers teach classes.

### Step 1: Find the "Things" (Entities)
Reading the question, I see:
- **Students** (people taking classes)
- **Teachers** (people teaching classes)
- **Classes** (subjects being taught)

### Step 2: Apply the Template

```sql
// Entity 1: Students
Table students {
  id integer [primary key]
  name varchar
  email varchar
  grade_level varchar
  created_at timestamp [default: `now()`]
}

// Entity 2: Teachers
Table teachers {
  id integer [primary key]
  name varchar
  email varchar
  subject varchar
  created_at timestamp [default: `now()`]
}

// Entity 3: Classes
Table classes {
  id integer [primary key]
  name varchar
  teacher_id integer [ref: > teachers.id]  // One teacher per class
  classroom varchar
  schedule varchar
  created_at timestamp [default: `now()`]
}

// Junction Table: Students ↔ Classes (many-to-many)
Table enrollments {
  student_id integer [ref: > students.id]
  class_id integer [ref: > classes.id]
  grade varchar
  enrolled_date timestamp [default: `now()`]
}
```

### Step 3: The Relationships Explained

**One-to-Many**: `teachers → classes`
- One teacher teaches many classes
- Use `teacher_id` in the classes table

**Many-to-Many**: `students ↔ classes`
- Many students take many classes
- Needs a junction table: `enrollments`

## Your Turn: Simple Practice Question

**Question**: Design a database for a bookstore where customers buy books and authors write books.

### Step 1: Find Your Entities (2 minutes)
Write down the main "things":
- ____________
- ____________
- ____________

### Step 2: Fill in the Template (10 minutes)

```sql
// Entity 1:
Table _______ {
  id integer [primary key]
  name varchar
  // add 2-3 more fields
  created_at timestamp [default: `now()`]
}

// Entity 2:
Table _______ {
  id integer [primary key]
  name varchar
  // add 2-3 more fields
  created_at timestamp [default: `now()`]
}

// Entity 3:
Table _______ {
  id integer [primary key]
  title varchar
  // add 2-3 more fields
  // add a foreign key to connect to authors
  created_at timestamp [default: `now()`]
}

// Junction Table (for customers buying books):
Table _______ {
  customer_id integer [ref: > customers.id]
  book_id integer [ref: > books.id]
  // add purchase date, quantity, price
  created_at timestamp [default: `now()`]
}
```

### Step 3: Relationships (3 minutes)
- Authors → Books: _____________ (one-to-many or many-to-many?)
- Customers ↔ Books: _____________ (one-to-many or many-to-many?)

## The Answer Template:

```sql
Table customers {
  id integer [primary key]
  name varchar
  email varchar
  phone varchar
  created_at timestamp [default: `now()`]
}

Table authors {
  id integer [primary key]
  name varchar
  bio text
  nationality varchar
  created_at timestamp [default: `now()`]
}

Table books {
  id integer [primary key]
  title varchar
  isbn varchar
  price decimal(8,2)
  author_id integer [ref: > authors.id]  // One author per book (simplified)
  created_at timestamp [default: `now()`]
}

Table purchases {
  customer_id integer [ref: > customers.id]
  book_id integer [ref: > books.id]
  quantity integer [default: 1]
  purchase_price decimal(8,2)
  purchase_date timestamp [default: `now()`]
}
```

## Key Rules to Remember:

1. **Every table starts with**:
   - `id integer [primary key]`
   - `name varchar` (or similar identifying field)
   - `created_at timestamp [default: 'now()']`

2. **For one-to-many relationships**:
   - Add `other_table_id integer [ref: > other_table.id]`

3. **For many-to-many relationships**:
   - Create a junction table with both IDs

4. **Common field types**:
   - `varchar` for short text
   - `text` for long text
   - `integer` for numbers
   - `decimal(8,2)` for money
   - `timestamp` for dates/times

Try the bookstore example and let me know what you come up with!