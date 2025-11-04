# Simple Database Schema Questions (20-25 minutes each)

## Question 1: Library Management System

**Scenario**: A small library wants to track their books and member checkouts.

**Requirements**:
- Track books (title, author, ISBN, available copies)
- Track library members (name, email, phone)
- Track which books are checked out by which members
- Track due dates and return dates
- Generate overdue book reports

**Expected Tables**: ~4-5 tables
**Complexity**: Beginner - simple relationships

---

## Question 2: Employee Time Tracking

**Scenario**: A small company wants to track employee work hours.

**Requirements**:
- Store employee information (name, department, hourly rate)
- Track daily time entries (clock in/out times)
- Calculate total hours worked per day
- Generate weekly timesheets
- Track different project codes for time entries

**Expected Tables**: ~3-4 tables
**Complexity**: Beginner - basic time calculations

---

## Question 3: Recipe Management App

**Scenario**: A cooking app that stores recipes and ingredients.

**Requirements**:
- Store recipes (name, instructions, prep time, servings)
- Store ingredients with quantities needed per recipe
- Track user favorites and ratings
- Support different measurement units (cups, grams, etc.)
- Allow users to scale recipes up/down

**Expected Tables**: ~4-5 tables
**Complexity**: Intermediate - many-to-many relationships

---

## Question 4: Pet Veterinary Clinic

**Scenario**: A vet clinic needs to manage pets, owners, and appointments.

**Requirements**:
- Track pet owners (name, contact info)
- Track pets (name, species, breed, owner)
- Schedule appointments with different vets
- Record visit notes and treatments
- Track vaccination records and due dates

**Expected Tables**: ~5-6 tables
**Complexity**: Intermediate - multiple relationships

---

## Question 5: School Grade Book

**Scenario**: Teachers need to track student grades and assignments.

**Requirements**:
- Store student information (name, grade level, student ID)
- Create assignments with point values and due dates
- Record grades for each student on each assignment
- Calculate overall class averages
- Track attendance records

**Expected Tables**: ~4-5 tables
**Complexity**: Beginner-Intermediate - straightforward academic domain

---

## Quick Success Strategy for Simple Questions

### 15-Minute Approach:
1. **Identify main entities** (2 min) - usually 3-5 obvious ones
2. **Draw basic relationships** (5 min) - focus on who owns what
3. **Add essential fields** (5 min) - IDs, names, key business data
4. **Quick review** (3 min) - can it answer the business questions?

### Common Patterns:
- **Users + Things**: owners→pets, students→grades, members→books
- **Junction Tables**: recipes↔ingredients, students↔assignments
- **Status Fields**: available/checked_out, active/inactive
- **Timestamps**: created_at, due_date, returned_at

### Keep It Simple:
- Start with 3-4 core tables
- Add supporting tables only if time allows
- Focus on business logic over technical perfection
- Use natural primary keys when obvious (ISBN for books)

These are much more manageable for building confidence before tackling complex scenarios!