# Problem Pattern Preferences for Casium Interview Prep

**Last Updated:** October 12, 2025

---

## 🎯 Preferred Problem Pattern: "Pro-Rating with Date Logic"

### Pattern Characteristics:
1. **Financial/Cost Calculations** - Calculate charges, fees, rates based on time periods
2. **Date/Time Logic** - Handle date ranges, boundaries, cross-year/month edges
3. **Pro-rating Formula** - Partial period → partial cost (e.g., daily rate × days active)
4. **Business Rules** - Clear rules for when/how charges apply
5. **Edge Cases** - None values, overlaps, gaps, leap years, mid-period changes
6. **Aggregation** - Per-entity breakdown + total summary
7. **Helper Functions** - Date parsing, boundary calculations provided or needed

### Example Reference Problem:
- **File:** `/interview-prep/companies/casium/prorating_subscriptions.md`
- **Time Limit:** 50 minutes
- **Difficulty:** Medium-Hard

---

## ✅ Approved Problem Types (Immigration-themed)

### **Type 1: Attorney Retainer Fee Calculator**
**Scenario:** Calculate pro-rated attorney fees based on case activity periods
- Attorney hourly/monthly rates
- Case active dates (filing → approval/denial/withdrawal)
- Calculate fees for specific billing period
- Handle mid-period case starts/closures
- Aggregate fees across multiple cases

**Key Elements:**
- Cost = (Rate) × (Days Active) / (Days in Period)
- Date boundary handling
- None values (ongoing cases)
- Cross-month/year boundaries

---

### **Type 2: Premium Processing Fee Calculator**
**Scenario:** Calculate USCIS premium processing fees based on service periods
- Different visa types → different processing fees
- Service start/end dates
- Pro-rated fees if service started/ended mid-period
- Handle partial refunds for early withdrawals
- Aggregate fees across multiple cases in a billing cycle

**Key Elements:**
- Cost = (Processing Fee) × (Service Days) / (Standard Period Days)
- Visa type rules (H-1B, O-1, EB-2 have different fees)
- Date range calculations
- Refund logic

---

### **Type 3: Case Filing Fee Proration**
**Scenario:** Calculate pro-rated government filing fees for immigration cases
- Cases filed/withdrawn at different times in billing cycle
- Government fees based on active days before approval/denial
- Handle early withdrawal refunds (partial)
- Multi-case aggregation for law firm billing

**Key Elements:**
- Cost = (Filing Fee) × (Days Until Resolution) / (Expected Processing Days)
- Resolution types (approval, denial, withdrawal) affect calculations
- Date boundaries
- Edge cases (same-day withdrawal, expedited processing)

---

### **Type 4: Document Translation Cost Proration**
**Scenario:** Calculate translation service costs for immigration documents
- Per-page translation rates
- Rush fees for expedited service
- Pro-rated costs if documents submitted/completed mid-billing period
- Volume discounts based on page count
- Aggregate costs for multiple applicants

**Key Elements:**
- Cost = (Base Rate × Pages) + Rush Fee (if applicable) - Discount
- Date logic for rush deadlines
- Tiered pricing rules
- Multi-applicant aggregation

---

## 🔄 How Claude Should Generate These Problems

### **When User Asks for Practice Problems:**

**Step 1: Check this file first**
- Read `/interview-prep/companies/casium/onsite-prep/problem_pattern_preference.md`
- Confirm user wants "pro-rating with date logic" pattern

**Step 2: Select or Generate Problem**
- Choose from approved types above OR
- Create new problem following the same pattern (financial calculation + date logic + business rules)

**Step 3: Ensure Problem Has:**
- [ ] Financial/cost calculation component
- [ ] Date range logic (activation/deactivation, start/end dates)
- [ ] Pro-rating formula (partial period → partial cost)
- [ ] At least 5 edge cases to handle
- [ ] None/null values for ongoing cases
- [ ] Cross-month or cross-year boundaries
- [ ] Helper functions (provided or to be implemented)
- [ ] Clear input/output format
- [ ] Expected output with calculations
- [ ] 50-minute time limit (matching Casium's Woven assessment)

**Step 4: Match Complexity**
- Similar to `prorating_subscriptions.md`
- Medium-Hard difficulty
- Requires helper function extraction
- Multiple edge cases
- Aggregation required

---

## 🚫 Avoid These Problem Types (for Casium prep)

- ❌ Pure algorithm problems (sorting, searching, graph traversal)
- ❌ Data structure implementation (building trees, linked lists)
- ❌ System design disguised as coding (too broad)
- ❌ LeetCode-style optimization puzzles
- ❌ Problems without financial/cost component
- ❌ Problems without date/time logic

---

## 📋 Problem Generation Template

When creating new problems, follow this structure:

```markdown
# [Problem Title] - [Immigration Context]

## Scenario
[Describe the business context - attorney fees, USCIS processing, etc.]

## Problem Statement
Given [list of entities with dates/rates], calculate [financial metric] for [time period].

## Business Rules
1. [Pro-rating rule]
2. [Edge case handling rule]
3. [Aggregation rule]
4. [Date boundary rule]

## Input Format
[Provide clear data structure with example]

## Expected Output
[Show output structure with calculated values]

## Helper Functions Provided (optional)
[List any date parsing/calculation helpers]

## Edge Cases to Consider
1. None/null values (ongoing cases)
2. Cross-month/year boundaries
3. Leap years
4. Same-day start/end
5. Overlapping periods
6. [Domain-specific edge cases]

## Time Limit
50 minutes
```

---

## 💡 Example Prompt for Future Sessions

**User should say:**
```
I want to practice a Casium-style problem.
Review: /interview-prep/companies/casium/onsite-prep/problem_pattern_preference.md
Generate a new pro-rating + date logic problem (50 min, immigration-themed).
```

**Claude will:**
1. Read this preference file
2. Either select from approved types OR create similar problem
3. Follow the pattern (cost + dates + pro-rating + edge cases)
4. Match complexity to prorating_subscriptions.md
5. Set up practice session with 50-minute timer

---

## 📊 Problem Inventory

### Problems Already Created:
1. ✅ **Prorating Subscriptions** - Reference problem (completed)
2. ✅ **Invoice Payment Tracker** - Session 5 (completed, but different pattern - not pro-rating)

### Problems to Create (Pro-Rating Pattern):
1. ⏳ **Attorney Retainer Fee Calculator** - Next session (Session 6)
2. 📝 **Premium Processing Fee Calculator** - Future
3. 📝 **Case Filing Fee Proration** - Future
4. 📝 **Document Translation Cost Proration** - Future
5. 📝 **[Generate new variations as needed]** - Ongoing

---

## 🎯 Success Criteria

**You'll know the pattern is right when:**
- Problem involves calculating money based on time periods
- Pro-rating formula is needed (partial period → partial cost)
- Date boundary logic is complex (cross-month/year, None values)
- Multiple edge cases must be handled
- Helper function extraction is beneficial
- Aggregation required (per-entity + total)
- Solvable in 50 minutes with good planning

---

## 🔄 This File Should Be Updated:

- When you discover new problem patterns you like
- After completing problems (mark as done)
- When you want to avoid certain problem types
- When you find new edge cases worth practicing

**Keep this file as the source of truth for your Casium interview prep problem preferences!**
