# Exercise: Immigration Services Management System

## Scenario: Client Case Management Database for Casium

You're designing a database for Casium to manage their immigration clients, visa applications, and legal processes.

## Requirements:
- Clients apply for different types of visas (O-1, H-1B, EB-1A, EB-2 NIW, etc.)
- Each client can have multiple applications over time (renewal, different visa types)
- Track application status through various stages (preparation, filed, approved, denied)
- Assign immigration lawyers and consultants to client cases
- Store required documents for each application type
- Track deadlines, filing dates, and government response times
- Manage client payments and billing for different service packages

## Your Task:

Complete the schema below:

```sql
// TODO: Complete this immigration services schema

Table clients {
  // Add fields for client management
  // Think about: personal info, contact details, current status
}

Table visa_types {
  // Add fields for different visa categories
  // Think about: O-1, H-1B, EB-1A, processing times, requirements
}

Table lawyers {
  // Add fields for legal team
  // Think about: specializations, bar admissions, experience
}

Table applications {
  // Add fields for visa applications
  // Think about: which client, which visa type, current status, dates
}

// TODO: Create table for required documents
Table _______ {
  // Different visa types require different documents
  // How do you track what's needed vs what's submitted?
}

// TODO: Create table for application status tracking
Table _______ {
  // Track the journey: preparation → filing → review → decision
  // What information do you need for each status change?
}

// TODO: Create table for payments and billing
Table _______ {
  // Track client payments for different services
  // Different visa types have different pricing
}
```

## Immigration Industry Questions Your Schema Should Answer:
1. How many O-1 visa applications are currently pending?
2. Which clients need to submit additional documents this week?
3. What's the average processing time for EB-1A applications?
4. Which lawyer is handling the most active cases?
5. How much revenue was generated from H-1B applications this quarter?
6. Which clients have upcoming deadlines for document submission?

## Immigration-Specific Considerations:
- Applications have strict government deadlines
- Document requirements vary significantly by visa type
- Clients often need multiple visa types over their career journey
- Legal compliance and audit trails are critical
- Processing times vary by government agency and visa type
- Premium processing options affect timelines and costs

## Instructions:
- Edit this file directly
- Think about the complex legal and compliance requirements
- Consider the client journey from initial consultation to approval
- Include fields relevant to immigration law (USCIS case numbers, priority dates, etc.)
- Use proper DBML syntax

This reflects the real challenges that immigration services companies like Casium face daily! 🏛️
```