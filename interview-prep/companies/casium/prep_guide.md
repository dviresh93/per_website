# Database Schema Design Practice Guide

## Systematic Approach (Follow This Order)

### 1. Read & Understand (5-7 minutes)
- **Read the entire proposal twice**
- **Identify the business domain** (e-commerce, HR, project management, etc.)
- **List all nouns** - these become potential entities
- **List all actions/processes** - these show relationships
- **Note any business rules or constraints**

### 2. Identify Core Entities (8-10 minutes)
Look for these common patterns:
- **Users/People** (customers, employees, managers)
- **Products/Services** (items, subscriptions, courses)
- **Transactions** (orders, payments, bookings)
- **Content** (posts, messages, documents)
- **Organizations** (companies, departments, teams)

### 3. Define Relationships (10-12 minutes)
- **One-to-One**: User ↔ Profile
- **One-to-Many**: Customer → Orders
- **Many-to-Many**: Students ↔ Courses (needs junction table)

### 4. Add Attributes (8-10 minutes)
For each entity, think:
- **Primary key** (usually `id`)
- **Required fields** (name, email, etc.)
- **Timestamps** (created_at, updated_at)
- **Status fields** (active, deleted, etc.)
- **Foreign keys** for relationships

### 5. Apply Best Practices (5 minutes)
- Use singular table names (user, not users)
- Use snake_case for column names
- Add indexes for foreign keys
- Consider soft deletes vs hard deletes

## Common Entity Patterns

### User Management
```sql
Table users {
  id integer [primary key]
  email varchar [unique]
  password_hash varchar
  first_name varchar
  last_name varchar
  status varchar [default: 'active'] // active, inactive, suspended
  created_at timestamp
  updated_at timestamp
}

Table user_profiles {
  id integer [primary key]
  user_id integer [ref: > users.id]
  phone varchar
  address text
  date_of_birth date
}
```

### E-commerce
```sql
Table products {
  id integer [primary key]
  name varchar
  description text
  price decimal(10,2)
  stock_quantity integer
  category_id integer [ref: > categories.id]
  status varchar [default: 'active']
  created_at timestamp
}

Table orders {
  id integer [primary key]
  user_id integer [ref: > users.id]
  total_amount decimal(10,2)
  status varchar [default: 'pending'] // pending, confirmed, shipped, delivered
  order_date timestamp
}

Table order_items {
  id integer [primary key]
  order_id integer [ref: > orders.id]
  product_id integer [ref: > products.id]
  quantity integer
  unit_price decimal(10,2)
}
```

### Content Management
```sql
Table posts {
  id integer [primary key]
  title varchar
  content text
  author_id integer [ref: > users.id]
  category_id integer [ref: > categories.id]
  status varchar [default: 'draft'] // draft, published, archived
  published_at timestamp
  created_at timestamp
}

Table comments {
  id integer [primary key]
  post_id integer [ref: > posts.id]
  user_id integer [ref: > users.id]
  content text
  parent_comment_id integer [ref: > comments.id] // for nested comments
  created_at timestamp
}
```

## Quick Decision Framework

### When to Create a New Table
- ✅ Represents a distinct business concept
- ✅ Has its own lifecycle/state
- ✅ Will have multiple records
- ✅ Other entities reference it

### When to Use a Junction Table
- ✅ Many-to-many relationship
- ✅ Need to store relationship metadata (date_joined, role, etc.)

### When to Use Enums vs Lookup Tables
- **Enums**: Fixed, rarely changing (status: active/inactive)
- **Lookup tables**: May change, user-configurable (categories, tags)

## Common Mistakes to Avoid
1. **Over-normalizing** - Don't create tables for every possible attribute
2. **Under-normalizing** - Don't store repeated data
3. **Missing foreign keys** - Always define relationships
4. **No timestamps** - Always include created_at/updated_at
5. **Generic names** - Be specific (user_posts, not just posts if multiple types)

## Time Management Strategy
- **20 minutes**: Core entities and relationships
- **10 minutes**: Add detailed attributes
- **5 minutes**: Review and polish
- **Leave buffer** for unexpected complexity

## Sample Practice Scenarios

Try designing schemas for:
1. **Course Management System** (students, courses, enrollments, assignments)
2. **Project Management Tool** (projects, tasks, team members, time tracking)
3. **Social Media Platform** (users, posts, likes, follows, messages)
4. **Inventory Management** (products, suppliers, warehouses, stock movements)
5. **Event Booking System** (events, venues, tickets, attendees)