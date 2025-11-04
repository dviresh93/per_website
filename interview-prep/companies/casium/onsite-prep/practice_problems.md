# Casium-Style Practice Problems

Practice problems modeled after the Woven assessment style, tailored to immigration platform domain.

---

## Problem 1: Visa Eligibility Checker

**Difficulty:** Medium
**Time:** 30-40 minutes
**Focus:** Business logic, rule validation, data transformation

### Scenario
You're building an eligibility checker for O-1 visa applications. The O-1 visa is for individuals with extraordinary ability. Applicants must meet specific criteria to qualify.

### Requirements

**Eligibility Criteria:**
1. Must have at least 3 of the following:
   - Major awards (Oscar, Grammy, Nobel Prize, etc.)
   - Membership in prestigious associations
   - Published work about them in major media
   - Judged others' work in their field
   - Original contributions of major significance
   - Authored scholarly articles
   - High salary (top 10% in field)
   - Past employment with distinguished organizations

2. Must have a job offer in the U.S. in their field of expertise

3. Must have evidence for each claimed criterion

### Input Format

```python
applicant = {
    "name": "Dr. Jane Smith",
    "field": "Artificial Intelligence",
    "has_job_offer": True,
    "achievements": [
        {
            "type": "major_award",
            "name": "Turing Award",
            "year": 2022,
            "evidence_documents": ["award_certificate.pdf"]
        },
        {
            "type": "scholarly_articles",
            "count": 45,
            "citations": 12000,
            "evidence_documents": ["publications_list.pdf", "google_scholar.pdf"]
        },
        {
            "type": "judging_work",
            "description": "Conference reviewer for NeurIPS, ICML",
            "years": [2020, 2021, 2022, 2023],
            "evidence_documents": ["reviewer_invitations.pdf"]
        },
        {
            "type": "high_salary",
            "current_salary": 450000,
            "field_average": 180000,
            "evidence_documents": ["offer_letter.pdf"]
        }
    ]
}
```

### Tasks

Implement the following functions:

1. **`check_eligibility(applicant)`**
   - Returns eligibility result dictionary
   - Must meet 3+ criteria AND have job offer
   - Each achievement must have evidence documents

2. **`validate_evidence(applicant)`**
   - Returns list of achievements missing evidence
   - Returns empty list if all valid

3. **`generate_summary(applicant)`**
   - Returns human-readable summary of eligibility
   - Include which criteria are met
   - Highlight missing requirements

### Expected Output

```python
{
    "eligible": True,
    "criteria_met": 4,
    "criteria_required": 3,
    "has_job_offer": True,
    "met_criteria": [
        "major_award",
        "scholarly_articles",
        "judging_work",
        "high_salary"
    ],
    "missing_evidence": [],
    "summary": "Applicant is ELIGIBLE for O-1 visa. Met 4 of 3 required criteria with valid evidence and has U.S. job offer."
}
```

### Edge Cases to Handle
- Missing job offer
- Achievements without evidence documents
- Less than 3 criteria met
- Empty achievements list
- Invalid achievement types
- None values in fields

---

## Problem 2: Case Deadline Tracker

**Difficulty:** Medium
**Time:** 30-40 minutes
**Focus:** Date calculations, data aggregation, business logic

### Scenario
You're building a deadline tracking system for immigration cases. Different visa types have different processing times and deadlines.

### Business Rules

**Processing Times (from filing date):**
- O-1: 90 days standard, 15 days premium
- H-1B: 180 days standard, 15 days premium
- EB-1A: 365 days standard, 45 days premium
- TN: 30 days (no premium available)

**Alert Thresholds:**
- Critical: < 7 days until deadline
- Warning: < 30 days until deadline
- Normal: > 30 days until deadline

### Input Format

```python
cases = [
    {
        "case_id": "CASE001",
        "client_name": "John Doe",
        "visa_type": "O-1",
        "filing_date": "2025-09-01",
        "premium_processing": True,
        "status": "pending"
    },
    {
        "case_id": "CASE002",
        "client_name": "Jane Smith",
        "visa_type": "H-1B",
        "filing_date": "2025-08-15",
        "premium_processing": False,
        "status": "approved"  # Should not include in alerts
    },
    {
        "case_id": "CASE003",
        "client_name": "Bob Johnson",
        "visa_type": "TN",
        "filing_date": "2025-10-05",
        "premium_processing": False,
        "status": "pending"
    }
]

today = "2025-10-07"
```

### Tasks

Implement the following functions:

1. **`calculate_deadline(case, today)`**
   - Calculate expected decision deadline
   - Consider premium processing
   - Return deadline date and days remaining

2. **`get_upcoming_deadlines(cases, today, days_ahead=30)`**
   - Return cases with deadlines within specified days
   - Only include "pending" cases
   - Sort by deadline (nearest first)

3. **`categorize_by_urgency(cases, today)`**
   - Group cases by urgency level (critical/warning/normal)
   - Only include "pending" cases
   - Return dictionary with counts and case lists

### Expected Output

```python
# calculate_deadline(cases[0], "2025-10-07")
{
    "case_id": "CASE001",
    "deadline": "2025-09-16",  # 15 days from Sept 1 (premium)
    "days_remaining": -21,  # Overdue!
    "status": "overdue"
}

# get_upcoming_deadlines(cases, "2025-10-07", days_ahead=30)
[
    {
        "case_id": "CASE003",
        "client_name": "Bob Johnson",
        "deadline": "2025-11-04",  # 30 days from Oct 5
        "days_remaining": 28,
        "urgency": "warning"
    }
]

# categorize_by_urgency(cases, "2025-10-07")
{
    "critical": {
        "count": 1,
        "cases": ["CASE001"]  # Overdue counts as critical
    },
    "warning": {
        "count": 1,
        "cases": ["CASE003"]
    },
    "normal": {
        "count": 0,
        "cases": []
    }
}
```

### Edge Cases
- Overdue cases (deadline passed)
- Cases already approved/denied
- Invalid dates
- Negative days_ahead parameter
- Empty case list

---

## Problem 3: Document Validation Workflow

**Difficulty:** Medium-Hard
**Time:** 40-50 minutes
**Focus:** Multi-step workflow, validation logic, error handling

### Scenario
Immigration cases require specific documents. You need to validate that all required documents are uploaded, properly categorized, and verified.

### Document Requirements by Visa Type

```python
REQUIRED_DOCS = {
    "O-1": [
        "passport",
        "resume",
        "job_offer_letter",
        "evidence_of_achievement",  # At least 3 types
        "itinerary"
    ],
    "H-1B": [
        "passport",
        "resume",
        "job_offer_letter",
        "degree_certificate",
        "labor_condition_application"
    ]
}

EVIDENCE_TYPES = [
    "awards",
    "media_coverage",
    "judging_work",
    "original_contributions",
    "scholarly_articles",
    "high_salary",
    "memberships"
]
```

### Input Format

```python
case = {
    "case_id": "CASE001",
    "visa_type": "O-1",
    "documents": [
        {
            "doc_id": "DOC001",
            "type": "passport",
            "filename": "passport.pdf",
            "upload_date": "2025-09-01",
            "verified": True
        },
        {
            "doc_id": "DOC002",
            "type": "resume",
            "filename": "resume.pdf",
            "upload_date": "2025-09-01",
            "verified": True
        },
        {
            "doc_id": "DOC003",
            "type": "job_offer_letter",
            "filename": "offer.pdf",
            "upload_date": "2025-09-02",
            "verified": False
        },
        {
            "doc_id": "DOC004",
            "type": "evidence_of_achievement",
            "evidence_type": "awards",
            "filename": "turing_award.pdf",
            "upload_date": "2025-09-03",
            "verified": True
        },
        {
            "doc_id": "DOC005",
            "type": "evidence_of_achievement",
            "evidence_type": "scholarly_articles",
            "filename": "publications.pdf",
            "upload_date": "2025-09-03",
            "verified": True
        },
        {
            "doc_id": "DOC006",
            "type": "evidence_of_achievement",
            "evidence_type": "high_salary",
            "filename": "salary_proof.pdf",
            "upload_date": "2025-09-03",
            "verified": True
        }
    ]
}
```

### Tasks

Implement the following functions:

1. **`validate_documents(case)`**
   - Check all required documents are present
   - For O-1, verify at least 3 evidence types
   - Check all documents are verified
   - Return validation result with details

2. **`get_missing_documents(case)`**
   - Return list of missing required documents
   - For evidence, specify how many more needed

3. **`get_unverified_documents(case)`**
   - Return list of uploaded but unverified documents
   - Include document type and upload date

4. **`calculate_completion_percentage(case)`**
   - Return percentage of case completion
   - Based on: required docs present + all verified

### Expected Output

```python
# validate_documents(case)
{
    "case_id": "CASE001",
    "valid": False,
    "issues": [
        "Missing required document: itinerary",
        "Document not verified: job_offer_letter (DOC003)"
    ],
    "required_docs_present": 4,
    "required_docs_total": 5,
    "evidence_types_count": 3,
    "evidence_types_required": 3,
    "all_verified": False
}

# get_missing_documents(case)
["itinerary"]

# get_unverified_documents(case)
[
    {
        "doc_id": "DOC003",
        "type": "job_offer_letter",
        "filename": "offer.pdf",
        "days_since_upload": 5
    }
]

# calculate_completion_percentage(case)
{
    "completion": 75.0,  # 3 of 4 criteria met (docs present, evidence count, but not all verified)
    "breakdown": {
        "required_docs_uploaded": True,
        "evidence_requirement_met": True,
        "all_documents_verified": False
    }
}
```

### Edge Cases
- Unknown visa type
- Invalid evidence types
- Documents uploaded but wrong type
- Empty document list
- Case with extra documents (not an error)

---

## Problem 4: Immigration Case Analytics

**Difficulty:** Medium
**Time:** 35-45 minutes
**Focus:** Data aggregation, metrics calculation, reporting

### Scenario
Generate analytics dashboard for immigration cases to track firm performance.

### Input Format

```python
cases = [
    {
        "case_id": "C001",
        "visa_type": "O-1",
        "attorney": "Sarah Lee",
        "filing_date": "2025-07-15",
        "decision_date": "2025-09-20",
        "status": "approved",
        "revenue": 8000.00
    },
    {
        "case_id": "C002",
        "visa_type": "H-1B",
        "attorney": "John Chen",
        "filing_date": "2025-08-01",
        "decision_date": "2025-10-05",
        "status": "approved",
        "revenue": 5000.00
    },
    {
        "case_id": "C003",
        "visa_type": "O-1",
        "attorney": "Sarah Lee",
        "filing_date": "2025-09-01",
        "decision_date": None,
        "status": "pending",
        "revenue": 8000.00
    },
    {
        "case_id": "C004",
        "visa_type": "EB-1A",
        "attorney": "John Chen",
        "filing_date": "2025-06-15",
        "decision_date": "2025-09-30",
        "status": "denied",
        "revenue": 0.00  # Refunded
    }
]
```

### Tasks

Implement the following functions:

1. **`calculate_approval_rate_by_visa_type(cases)`**
   - Only include decided cases (approved or denied)
   - Calculate percentage approved per visa type
   - Return sorted by approval rate

2. **`get_attorney_performance(cases)`**
   - Calculate per-attorney metrics:
     - Total cases handled
     - Approval rate
     - Total revenue
     - Average processing time (days)
   - Only count decided cases for rates

3. **`get_revenue_by_month(cases, year=2025)`**
   - Group revenue by filing month
   - Include both approved and pending cases
   - Format: {"2025-07": 8000.00, ...}

4. **`calculate_avg_processing_time_by_visa(cases)`**
   - Calculate average days from filing to decision
   - Only include decided cases
   - Group by visa type

### Expected Output

```python
# calculate_approval_rate_by_visa_type(cases)
[
    {"visa_type": "H-1B", "total_decided": 1, "approved": 1, "approval_rate": 100.0},
    {"visa_type": "O-1", "total_decided": 1, "approved": 1, "approval_rate": 100.0},
    {"visa_type": "EB-1A", "total_decided": 1, "approved": 0, "approval_rate": 0.0}
]

# get_attorney_performance(cases)
{
    "Sarah Lee": {
        "total_cases": 2,
        "decided_cases": 1,
        "approval_rate": 100.0,
        "total_revenue": 16000.00,
        "avg_processing_days": 67.0
    },
    "John Chen": {
        "total_cases": 2,
        "decided_cases": 2,
        "approval_rate": 50.0,
        "total_revenue": 5000.00,
        "avg_processing_days": 72.5
    }
}

# get_revenue_by_month(cases, 2025)
{
    "2025-06": 0.00,
    "2025-07": 8000.00,
    "2025-08": 5000.00,
    "2025-09": 8000.00
}
```

### Edge Cases
- No decided cases
- All pending cases
- Empty case list
- Invalid dates
- Division by zero (no cases for attorney)

---

## Tips for Solving These Problems

### 1. **Read Carefully**
- Understand business rules completely
- Note edge cases in requirements
- Clarify ambiguities before coding

### 2. **Plan First**
- Identify entities and their relationships
- List helper functions you'll need
- Think through edge cases

### 3. **Code Clearly**
- Use descriptive variable names
- Extract complex logic into helper functions
- Add comments for business logic

### 4. **Handle Edge Cases**
- None/null values
- Empty collections
- Boundary dates
- Division by zero
- Invalid inputs

### 5. **Test Thoroughly**
- Walk through examples
- Test edge cases
- Verify output format matches requirements

---

## Practice Schedule

**Session 1 (90 min):**
- Problem 1: Visa Eligibility (40 min)
- Review and refactor (20 min)
- Problem 2: Deadline Tracker (30 min)

**Session 2 (90 min):**
- Problem 3: Document Validation (45 min)
- Review and refactor (20 min)
- Problem 4: Analytics (25 min)

**Session 3 (60 min):**
- Redo Problem 1 from scratch (30 min)
- Redo Problem 2 from scratch (30 min)

**Day Before Interview:**
- Quick review: `prorating_subscriptions.md` (30 min)
- One timed problem of your choice (30 min)

---

**Remember:** These problems mirror the complexity and domain of what Casium does. Practice explaining your thought process out loud as you solve them!
