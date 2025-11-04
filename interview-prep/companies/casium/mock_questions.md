# Database Schema Design - Mock Questions

## Mock Question 1: Online Learning Platform (35 minutes)

**Scenario**: EduTech wants to build an online learning platform where instructors can create courses, students can enroll and track progress, and the platform handles payments and certificates.

**Business Requirements**:
- Instructors can create multiple courses with lessons and quizzes
- Students pay for individual courses or subscribe monthly for unlimited access
- Track student progress through lessons and quiz scores
- Generate certificates when students complete courses
- Support discussion forums for each course
- Handle refunds and payment disputes
- Instructors earn revenue based on enrollments and completion rates

**Your Task**: Design a relational database schema that supports this platform.

---

## Mock Question 2: Food Delivery Service (35 minutes)

**Scenario**: QuickEats is a food delivery service that connects restaurants with customers through delivery drivers.

**Business Requirements**:
- Restaurants can list their menus with categories, items, and pricing
- Customers can place orders, track delivery status, and rate experiences
- Delivery drivers can accept orders, update delivery status, and track earnings
- Support multiple payment methods and split payments
- Handle promotional codes and customer loyalty points
- Track restaurant performance, driver metrics, and customer preferences
- Support scheduled deliveries and recurring orders

**Your Task**: Design a database schema for this three-sided marketplace.

---

## Mock Question 3: Project Management Tool (35 minutes)

**Scenario**: TeamFlow is building a project management application for software development teams.

**Business Requirements**:
- Teams can create projects with multiple boards (Kanban-style)
- Tasks can have subtasks, dependencies, and be assigned to team members
- Track time spent on tasks and generate timesheets
- Support file attachments and comments on tasks
- Create custom workflows and task statuses per project
- Generate reports on team productivity and project timelines
- Support different user roles (admin, project manager, developer, viewer)
- Integration with external tools requires storing API keys and webhooks

**Your Task**: Design a schema that handles complex project hierarchies and permissions.

---

## Mock Question 4: Healthcare Appointment System (35 minutes)

**Scenario**: MedConnect helps medical practices manage patient appointments, records, and billing.

**Business Requirements**:
- Patients can book appointments with specific doctors at available time slots
- Doctors have different specialties, schedules, and consultation fees
- Track patient medical history, prescriptions, and visit notes
- Handle insurance claims and payment processing
- Support recurring appointments and appointment reminders
- Manage clinic locations, rooms, and equipment scheduling
- Ensure HIPAA compliance with audit trails for data access
- Generate reports for doctors, patients, and insurance companies

**Your Task**: Design a schema for this regulated healthcare environment.

---

## Mock Question 5: Event Ticketing Platform (35 minutes)

**Scenario**: EventHub is a platform where event organizers can sell tickets and manage events.

**Business Requirements**:
- Event organizers can create events with multiple ticket types and pricing tiers
- Support venues with seating charts and capacity limits
- Handle ticket sales, transfers, and refunds
- Generate QR codes for ticket validation at entry
- Support early bird pricing, group discounts, and promotional codes
- Track attendee check-ins and generate attendance reports
- Handle waitlists when events sell out
- Support recurring events (weekly classes, monthly meetups)
- Integration with payment processors and email marketing tools

**Your Task**: Design a schema that handles complex ticketing scenarios and real-time inventory.

---

## How to Practice

1. **Set a 35-minute timer** for each question
2. **Spend 5 minutes** reading and understanding requirements
3. **Spend 25 minutes** designing the schema
4. **Spend 5 minutes** reviewing and adding missing elements

## What to Focus On

- **Core entities**: Users, products/services, transactions
- **Key relationships**: One-to-many, many-to-many with junction tables
- **Business rules**: Status fields, constraints, audit trails
- **Performance**: Indexes on foreign keys and frequently queried fields
- **Scalability**: Consider how the schema handles growth

## Common Elements to Include

- **Timestamps**: created_at, updated_at for all entities
- **Status fields**: active/inactive, pending/confirmed, etc.
- **Audit trails**: who created/modified records
- **Soft deletes**: deleted_at instead of hard deletes
- **Indexing**: On foreign keys and search fields

## Evaluation Criteria

- **Completeness**: Covers all business requirements
- **Normalization**: Proper relationships, no redundant data
- **Practical**: Considers real-world constraints and edge cases
- **Scalable**: Can handle growth in users and data
- **Clear**: Well-named tables and columns