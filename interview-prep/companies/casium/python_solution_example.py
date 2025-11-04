"""
COMPLETE SOLUTION WITH COACHING COMMENTARY
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Any
import calendar

# Pricing constants
PLANS = {
    'starter': Decimal('29.00'),
    'pro': Decimal('99.00'),
    'enterprise': Decimal('299.00')
}

ADD_ONS = {
    'extra_storage': Decimal('10.00'),
    'priority_support': Decimal('25.00'),
    'analytics': Decimal('15.00')
}

API_PRICING = [
    (1000, Decimal('0.00')),    # First 1000 free
    (9000, Decimal('0.02')),    # Next 9000 at $0.02
    (float('inf'), Decimal('0.01'))  # 10000+ at $0.01
]

TAX_RATE = Decimal('0.0825')  # 8.25%

def calculate_days_in_month(year: int, month: int) -> int:
    """
    COACHING POINT: Use calendar.monthrange() - handles leap years automatically
    This is cleaner than manual leap year logic
    """
    return calendar.monthrange(year, month)[1]

def calculate_pro_rated_amount(monthly_amount: Decimal, days_used: int, days_in_month: int) -> Decimal:
    """
    COACHING POINT: Pro-rating formula is simple division
    Key: Use Decimal arithmetic throughout, round at the end
    """
    if days_used <= 0 or days_in_month <= 0:
        return Decimal('0.00')

    daily_rate = monthly_amount / days_in_month
    return daily_rate * days_used

def calculate_api_usage_charges(api_calls: int) -> Decimal:
    """
    COACHING POINT: Tiered pricing is a classic programming pattern
    Process each tier until you've consumed all usage
    """
    if api_calls <= 0:
        return Decimal('0.00')

    total_charge = Decimal('0.00')
    remaining_calls = api_calls

    for tier_limit, price_per_call in API_PRICING:
        if remaining_calls <= 0:
            break

        # How many calls fall in this tier?
        calls_in_tier = min(remaining_calls, tier_limit)

        # Calculate charge for this tier
        tier_charge = Decimal(str(calls_in_tier)) * price_per_call
        total_charge += tier_charge

        # Reduce remaining calls
        remaining_calls -= calls_in_tier

    return total_charge

def round_to_cents(amount: Decimal) -> Decimal:
    """
    COACHING POINT: Always use ROUND_HALF_UP for financial calculations
    This is "banker's rounding" - industry standard
    """
    return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_invoice(customer: Dict[str, Any]) -> Dict[str, float]:
    """
    COACHING POINT: Break this into clear sections:
    1. Parse input data
    2. Calculate each charge type
    3. Sum and apply taxes
    4. Round and return
    """

    # 1. Parse input data
    plan = customer['plan'].lower()
    plan_start_date = datetime.strptime(customer['plan_start_date'], '%Y-%m-%d')
    billing_start = datetime.strptime(customer['billing_period_start'], '%Y-%m-%d')
    billing_end = datetime.strptime(customer['billing_period_end'], '%Y-%m-%d')

    add_ons = customer.get('add_ons', [])
    api_calls = customer.get('api_calls', 0)

    # 2. Calculate base plan charge (pro-rated)
    # COACHING POINT: Use the later of plan_start or billing_start
    effective_start = max(plan_start_date, billing_start)

    # Calculate days used in this billing period
    days_used = (billing_end - effective_start).days + 1  # +1 because end date is inclusive
    days_in_month = calculate_days_in_month(billing_start.year, billing_start.month)

    monthly_plan_cost = PLANS[plan]
    base_plan_charge = calculate_pro_rated_amount(monthly_plan_cost, days_used, days_in_month)

    # 3. Calculate add-on charges (also pro-rated)
    add_on_charges = Decimal('0.00')
    for add_on in add_ons:
        if add_on in ADD_ONS:
            monthly_addon_cost = ADD_ONS[add_on]
            prorated_addon = calculate_pro_rated_amount(monthly_addon_cost, days_used, days_in_month)
            add_on_charges += prorated_addon

    # 4. Calculate usage charges
    usage_charges = calculate_api_usage_charges(api_calls)

    # 5. Calculate totals
    subtotal = base_plan_charge + add_on_charges + usage_charges
    tax = subtotal * TAX_RATE
    total = subtotal + tax

    # 6. Round all amounts and return
    # COACHING POINT: Convert Decimal to float for return, but only after all calculations
    return {
        'base_plan_charge': float(round_to_cents(base_plan_charge)),
        'add_on_charges': float(round_to_cents(add_on_charges)),
        'usage_charges': float(round_to_cents(usage_charges)),
        'subtotal': float(round_to_cents(subtotal)),
        'tax': float(round_to_cents(tax)),
        'total': float(round_to_cents(total))
    }

# Test cases with COACHING COMMENTARY
def test_basic_invoice():
    """
    COACHING POINT: This test verifies the exact scenario from the problem
    Key insight: Jan 15-31 = 17 days out of 31 total
    """
    customer = {
        'plan': 'pro',
        'plan_start_date': '2024-01-15',
        'add_ons': ['extra_storage', 'analytics'],
        'api_calls': 15000,
        'billing_period_start': '2024-01-01',
        'billing_period_end': '2024-01-31'
    }

    result = calculate_invoice(customer)
    expected = {
        'base_plan_charge': 54.29,  # $99 * (17/31) = 54.29 (rounded)
        'add_on_charges': 13.71,   # ($10 + $15) * (17/31) = 13.71
        'usage_charges': 230.00,   # 1000*0 + 9000*0.02 + 5000*0.01 = 230
        'subtotal': 298.00,        # Sum of above, rounded
        'tax': 24.59,             # 298.00 * 0.0825 = 24.585, rounded to 24.59
        'total': 322.59
    }

    print("Basic test result:", result)

    # COACHING POINT: In real assessment, add assertions
    assert abs(result['total'] - expected['total']) < 0.01, f"Expected {expected['total']}, got {result['total']}"
    print("✅ Basic test passed!")

def test_full_month():
    """
    COACHING POINT: Test the simple case - full month billing
    No pro-rating complications
    """
    customer = {
        'plan': 'starter',
        'plan_start_date': '2024-01-01',
        'add_ons': ['priority_support'],
        'api_calls': 500,  # Under free tier
        'billing_period_start': '2024-01-01',
        'billing_period_end': '2024-01-31'
    }

    result = calculate_invoice(customer)

    # Should be $29 + $25 + $0 = $54, plus tax
    expected_subtotal = 54.00
    expected_total = expected_subtotal * 1.0825  # Add 8.25% tax

    print("Full month test:", result)
    assert abs(result['subtotal'] - expected_subtotal) < 0.01
    print("✅ Full month test passed!")

def test_leap_year():
    """
    COACHING POINT: Edge case testing is crucial
    February 2024 has 29 days (leap year)
    """
    customer = {
        'plan': 'pro',
        'plan_start_date': '2024-02-15',  # Leap year February
        'add_ons': [],
        'api_calls': 0,
        'billing_period_start': '2024-02-01',
        'billing_period_end': '2024-02-29'
    }

    result = calculate_invoice(customer)

    # Feb 15-29 in leap year = 15 days out of 29
    # $99 * (15/29) = $51.21
    expected_base = 99.00 * (15/29)

    print("Leap year test:", result)
    assert abs(result['base_plan_charge'] - expected_base) < 0.01
    print("✅ Leap year test passed!")

def test_high_usage():
    """
    COACHING POINT: Test the tiered pricing thoroughly
    50,000 API calls should hit all tiers
    """
    customer = {
        'plan': 'enterprise',
        'plan_start_date': '2024-01-01',
        'add_ons': [],
        'api_calls': 50000,
        'billing_period_start': '2024-01-01',
        'billing_period_end': '2024-01-31'
    }

    result = calculate_invoice(customer)

    # Expected usage: 1000*$0 + 9000*$0.02 + 40000*$0.01 = $580
    expected_usage = 0 + (9000 * 0.02) + (40000 * 0.01)  # = 180 + 400 = 580

    print("High usage test:", result)
    assert abs(result['usage_charges'] - expected_usage) < 0.01
    print("✅ High usage test passed!")

if __name__ == "__main__":
    print("🧪 Running all tests...\n")
    test_basic_invoice()
    print()
    test_full_month()
    print()
    test_leap_year()
    print()
    test_high_usage()
    print("\n🎉 All tests passed!")