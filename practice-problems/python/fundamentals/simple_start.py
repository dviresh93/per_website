"""
SIMPLE STARTER PROBLEM - Build confidence first!

Problem: Calculate a simple monthly subscription bill

Given:
- Customer has a "basic" plan at $20/month
- Customer started on January 10th
- Billing period: January 1-31 (31 days)
- Tax rate: 10%

Calculate:
- How much should they pay for January?
- (Hint: They only used 22 days of January: Jan 10-31)

Expected answer: Around $14.19 + tax = $15.61
"""

from datetime import datetime
from decimal import Decimal

def simple_invoice():
    # TODO: You implement this step by step
    # 1. Figure out how many days they used (Jan 10-31)
    # 2. Pro-rate the $20 monthly fee
    # 3. Add 10% tax
    # 4. Return the total

    pass

# Test it
if __name__ == "__main__":
    result = simple_invoice()
    print(f"Customer owes: ${result}")

# When you're done, we'll build up to harder problems