"""
PRACTICE PROBLEM 3 (45 minutes)

Gym Membership Billing System

You're building a billing system for a gym chain.

BUSINESS RULES:
- Membership tiers: Basic ($39/month), Premium ($79/month), VIP ($129/month)
- Personal training sessions: $65 per session
- Class packages: Yoga Pack (10 classes for $120), Spin Pack (8 classes for $100)
- Equipment rental: $5 per day (only charged for days actually used)
- Family discount: 15% off total bill if customer has 'family_plan': true
- Late fee: $25 if customer has outstanding balance from previous month
- Tax rate: 8.25%
- Pro-rate membership if joined mid-month
- Round all amounts to 2 decimal places

INPUT FORMAT:
customer = {
    'membership_tier': 'premium',
    'membership_start_date': '2024-04-10',  # Joined mid-month
    'personal_training_sessions': 3,
    'class_packages': ['yoga_pack'],
    'equipment_rental_days': 12,
    'family_plan': True,
    'outstanding_balance': 50.00,  # Has previous balance
    'billing_period_start': '2024-04-01',
    'billing_period_end': '2024-04-30'
}

EXPECTED CALCULATIONS (work these out):
- Premium membership pro-rated for Apr 10-30 = 21 days out of 30
- 3 training sessions at $65 each
- 1 yoga pack at $120
- 12 days equipment rental at $5/day
- Subtotal before discounts
- Apply 15% family discount
- Add $25 late fee (after discount)
- Add 8.25% tax
- Final total

YOUR TASK: Implement calculate_gym_bill()
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any, List

# Pricing data
MEMBERSHIP_TIERS = {
    'basic': Decimal('39.00'),
    'premium': Decimal('79.00'),
    'vip': Decimal('129.00')
}

CLASS_PACKAGES = {
    'yoga_pack': Decimal('120.00'),
    'spin_pack': Decimal('100.00')
}

TRAINING_SESSION_RATE = Decimal('65.00')
EQUIPMENT_RENTAL_RATE = Decimal('5.00')  # per day
FAMILY_DISCOUNT_RATE = Decimal('0.15')  # 15%
LATE_FEE = Decimal('25.00')
TAX_RATE = Decimal('0.0825')  # 8.25%

def calculate_gym_bill(customer: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate monthly gym bill with multiple service types and discounts.

    This tests:
    - Pro-rating (like before)
    - Multiple service charges
    - Discount logic (new concept)
    - Fee handling (new concept)
    - Order of operations (discount before fees, tax last)
    """
    # TODO: Implement this function
    # Hint: Order matters!
    # 1. Calculate all base charges
    # 2. Apply family discount to base charges only (not fees)
    # 3. Add late fee (after discount)
    # 4. Add tax to everything

    pass

def round_to_cents(amount: Decimal) -> Decimal:
    """Helper to round to 2 decimal places"""
    return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# Test case
if __name__ == "__main__":
    test_customer = {
        'membership_tier': 'premium',
        'membership_start_date': '2024-04-10',
        'personal_training_sessions': 3,
        'class_packages': ['yoga_pack'],
        'equipment_rental_days': 12,
        'family_plan': True,
        'outstanding_balance': 50.00,
        'billing_period_start': '2024-04-01',
        'billing_period_end': '2024-04-30'
    }

    result = calculate_gym_bill(test_customer)
    print("Gym bill calculation:")
    for key, value in result.items():
        print(f"  {key}: ${value:.2f}")

# This tests order of operations and discount logic - different from previous problems!