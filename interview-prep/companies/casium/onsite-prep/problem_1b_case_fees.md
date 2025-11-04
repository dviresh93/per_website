# Problem 1B: Visa Application Fee Calculator

**Difficulty:** Medium
**Time:** 30-40 minutes
**Focus:** Business logic, validation, data transformation

---

## Scenario

You're building a fee calculator for visa applications. Different visa types have different base fees, and there are additional fees for premium processing, dependents, and attorney services.

---

## Fee Structure

**Base Fees by Visa Type:**
- O-1: $460
- H-1B: $460
- TN: $50
- EB-1A: $700
- EB-2 NIW: $700

**Additional Fees:**
- Premium Processing: $2,500 (not available for TN visas)
- Each Dependent: Same as base fee for primary applicant
- Attorney Review: $3,000 (optional)
- Rush Attorney Review: $5,000 (optional, cannot combine with regular attorney review)

**Business Rules:**
1. TN visas do NOT support premium processing
2. Cannot have both attorney_review and rush_attorney_review
3. Dependents count must be 0 or positive integer
4. Invalid visa types should return an error

---

## Input Format

```python
application = {
    "visa_type": "O-1",
    "premium_processing": True,
    "dependents": 2,
    "attorney_review": False,
    "rush_attorney_review": True
}
```

---

## Tasks

Implement the following function:

### `calculate_visa_fees(application)`

**Returns a dictionary with:**
- `valid`: Boolean - whether the application is valid
- `errors`: List of error messages (empty if valid)
- `fee_breakdown`: Dictionary with itemized fees
- `total_fee`: Total amount (only if valid)

---

## Expected Output

### Example 1: Valid Application
```python
application = {
    "visa_type": "O-1",
    "premium_processing": True,
    "dependents": 2,
    "attorney_review": False,
    "rush_attorney_review": True
}

# Expected output:
{
    "valid": True,
    "errors": [],
    "fee_breakdown": {
        "base_fee": 460,
        "premium_processing": 2500,
        "dependents_fee": 920,  # 2 × $460
        "attorney_fee": 5000,
        "subtotals": {
            "government_fees": 3880,  # base + premium + dependents
            "attorney_fees": 5000
        }
    },
    "total_fee": 8880
}
```

### Example 2: Invalid - TN with Premium
```python
application = {
    "visa_type": "TN",
    "premium_processing": True,
    "dependents": 0,
    "attorney_review": False,
    "rush_attorney_review": False
}

# Expected output:
{
    "valid": False,
    "errors": ["Premium processing is not available for TN visas"],
    "fee_breakdown": None,
    "total_fee": None
}
```

### Example 3: Invalid - Both Attorney Options
```python
application = {
    "visa_type": "H-1B",
    "premium_processing": False,
    "dependents": 1,
    "attorney_review": True,
    "rush_attorney_review": True
}

# Expected output:
{
    "valid": False,
    "errors": ["Cannot select both attorney_review and rush_attorney_review"],
    "fee_breakdown": None,
    "total_fee": None
}
```

### Example 4: Invalid Visa Type
```python
application = {
    "visa_type": "INVALID",
    "premium_processing": False,
    "dependents": 0,
    "attorney_review": False,
    "rush_attorney_review": False
}

# Expected output:
{
    "valid": False,
    "errors": ["Invalid visa type: INVALID. Supported types: O-1, H-1B, TN, EB-1A, EB-2 NIW"],
    "fee_breakdown": None,
    "total_fee": None
}
```

---

## Edge Cases to Handle

1. **Invalid visa type**
2. **TN visa with premium processing** (not allowed)
3. **Both attorney options selected** (conflicting)
4. **Negative dependents** (treat as 0)
5. **None values** for boolean fields (treat as False)
6. **None for dependents** (treat as 0)
7. **Missing required fields** (visa_type is required)
8. **Multiple validation errors** (return all errors, not just first one)

---

## Validation Priority

If multiple errors exist, return ALL of them in the errors list:

```python
application = {
    "visa_type": "TN",
    "premium_processing": True,
    "dependents": -5,
    "attorney_review": True,
    "rush_attorney_review": True
}

# Should return:
{
    "valid": False,
    "errors": [
        "Premium processing is not available for TN visas",
        "Cannot select both attorney_review and rush_attorney_review"
    ],
    "fee_breakdown": None,
    "total_fee": None
}
```

---

## Success Criteria

Your solution should:
- ✅ Handle all edge cases listed above
- ✅ Return detailed fee breakdown for valid applications
- ✅ Return ALL validation errors (not just first one)
- ✅ Use clear variable names and helper functions
- ✅ Be easy to extend (e.g., adding new visa types or fees)

---

## Similar Complexity to Problem 1

Like the Visa Eligibility Checker:
- Business logic with multiple rules
- Validation with multiple error conditions
- Data transformation (input → structured output)
- Edge case handling (None, invalid, negative values)
- Dictionary manipulation

**Key difference:** This focuses more on **calculations and validation** rather than counting criteria.
