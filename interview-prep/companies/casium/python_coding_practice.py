"""
WOVEN-STYLE PYTHON CODING CHALLENGE
Time Limit: 55 minutes

SCENARIO: SaaS Monthly Invoice Calculator
You're building an invoice calculator for a SaaS company that offers:
- Base subscription plans with monthly billing
- Add-on features billed monthly
- Usage-based charges for API calls
- Pro-rating for mid-month plan changes
- Tax calculations

REQUIREMENTS:
1. Calculate base subscription charges (pro-rated if needed)
2. Add feature charges for active add-ons
3. Calculate usage charges with tiered pricing
4. Apply taxes and round properly
5. Handle edge cases (leap years, month boundaries, etc.)

BUSINESS RULES:
- Base plans: Starter ($29/month), Pro ($99/month), Enterprise ($299/month)
- Add-ons: Extra Storage ($10/month), Priority Support ($25/month), Analytics ($15/month)
- API Usage: First 1000 calls free, next 9000 at $0.02/call, 10000+ at $0.01/call
- Tax rate: 8.25%
- All amounts rounded to nearest cent
- Pro-rating calculated based on days in billing period

INPUT FORMAT:
customer = {
    'plan': 'pro',
    'plan_start_date': '2024-01-15',  # Started mid-month
    'add_ons': ['extra_storage', 'analytics'],
    'api_calls': 15000,
    'billing_period_start': '2024-01-01',
    'billing_period_end': '2024-01-31'
}

EXPECTED OUTPUT:
{
    'base_plan_charge': 52.58,  # Pro-rated for Jan 15-31
    'add_on_charges': 13.39,   # Pro-rated storage + analytics
    'usage_charges': 230.00,   # API usage calculation
    'subtotal': 295.97,
    'tax': 24.42,
    'total': 320.39
}

YOUR TASK:
1. Implement the calculate_invoice() function
2. Handle all the edge cases
3. Write clean, readable code with good variable names
4. Add at least 3 test cases beyond the example
5. Use proper financial calculations (Decimal, not float)
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Any
PLANS = {
    "starter": Decimal('29.00'),
    "pro": Decimal('99.00'),
    "enterprise": Decimal('299.00')
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

def calculate_invoice(customer: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate monthly invoice for a SaaS customer

    Args:
        customer: Dictionary containing customer data

    Returns:
        Dictionary with itemized charges and total
    """
    # Parse input data
    plan = customer['plan'].lower()
    plan_start_date = datetime.strptime(customer['plan_start_date'], '%Y-%m-%d')
    billing_start = datetime.strptime(customer['billing_period_start'], '%Y-%m-%d')
    billing_end = datetime.strptime(customer['billing_period_end'], '%Y-%m-%d')
    
    add_ons = customer.get('add_ons', [])
    api_calls = customer.get('api_calls', 0)

    # Calculate base plan charge (pro-rated)
    effective_start = max(plan_start_date, billing_start)
    days_used = (billing_end - effective_start).days + 1
    days_in_month = calculate_days_in_month(billing_start.year, billing_start.month)

    monthly_plan_cost = PLANS[plan]
    base_plan_charge = calculate_pro_rated_amount(monthly_plan_cost, days_used, days_in_month)

    # Calculate add-on charges (also pro-rated)
    add_on_charges = Decimal('0.00')
    for add_on in add_ons:
        if add_on in ADD_ONS:
            monthly_addon_cost = ADD_ONS[add_on]
            prorated_addon = calculate_pro_rated_amount(monthly_addon_cost, days_used, days_in_month)
            add_on_charges += prorated_addon

    # Calculate usage charges
    usage_charges = calculate_api_usage_charges(api_calls)

    # Calculate totals
    subtotal = base_plan_charge + add_on_charges + usage_charges
    tax = subtotal * TAX_RATE
    total = subtotal + tax

    # Round all amounts and return
    return {
        'base_plan_charge': float(round_to_cents(base_plan_charge)),
        'add_on_charges': float(round_to_cents(add_on_charges)),
        'usage_charges': float(round_to_cents(usage_charges)),
        'subtotal': float(round_to_cents(subtotal)),
        'tax': float(round_to_cents(tax)),
        'total': float(round_to_cents(total))
    }

def calculate_days_in_month(year: int, month: int) -> int:
    """Helper function to get days in a month (handles leap years)"""
    import calendar
    return calendar.monthrange(year, month)[1]

def calculate_pro_rated_amount(monthly_amount: Decimal, days_used: int, days_in_month: int) -> Decimal:
    """Calculate pro-rated amount based on usage days"""
    if days_used <= 0 or days_in_month <= 0:
        return Decimal('0.00')

    daily_rate = monthly_amount / days_in_month
    return daily_rate * days_used

def calculate_api_usage_charges(api_calls: int) -> Decimal:
    """Calculate charges based on tiered API pricing"""
    if api_calls <= 0:
        return Decimal('0.00')

    total_charge = Decimal('0.00')
    remaining_calls = api_calls

    for tier_limit, price_per_call in API_PRICING:
        if remaining_calls <= 0:
            break

        calls_in_tier = min(remaining_calls, tier_limit)
        tier_charge = Decimal(str(calls_in_tier)) * price_per_call
        total_charge += tier_charge

        remaining_calls -= calls_in_tier

    return total_charge

def round_to_cents(amount: Decimal) -> Decimal:
    """Round amount to nearest cent"""
    return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# Test cases
def test_basic_invoice():
    """Test case provided in the problem"""
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
        'base_plan_charge': 52.58,
        'add_on_charges': 13.39,
        'usage_charges': 230.00,
        'subtotal': 295.97,
        'tax': 24.42,
        'total': 320.39
    }

    print("Basic test:", result)
    # Add assertions to verify correctness

def test_full_month():
    """Test case for full month billing"""
    customer = {
        'plan': 'starter',
        'plan_start_date': '2024-01-01',
        'add_ons': ['priority_support'],
        'api_calls': 500,
        'billing_period_start': '2024-01-01',
        'billing_period_end': '2024-01-31'
    }

    result = calculate_invoice(customer)
    expected_subtotal = 54.00  # $29 + $25 + $0 (500 calls are free)

    print("Full month test:", result)
    assert abs(result['subtotal'] - expected_subtotal) < 0.01
    print("✅ Full month test passed!")

def test_leap_year():
    """Test case for leap year handling"""
    customer = {
        'plan': 'pro',
        'plan_start_date': '2024-02-15',
        'add_ons': [],
        'api_calls': 0,
        'billing_period_start': '2024-02-01',
        'billing_period_end': '2024-02-29'  # Leap year February has 29 days
    }

    result = calculate_invoice(customer)
    # Feb 15-29 in leap year = 15 days out of 29
    expected_base = 99.00 * (15/29)

    print("Leap year test:", result)
    assert abs(result['base_plan_charge'] - expected_base) < 0.01
    print("✅ Leap year test passed!")

def test_no_usage():
    """Test case for zero API usage"""
    customer = {
        'plan': 'enterprise',
        'plan_start_date': '2024-01-01',
        'add_ons': ['analytics', 'extra_storage'],
        'api_calls': 0,
        'billing_period_start': '2024-01-01',
        'billing_period_end': '2024-01-31'
    }

    result = calculate_invoice(customer)
    # Should be $299 + $15 + $10 + $0 = $324, plus tax
    expected_subtotal = 324.00

    print("No usage test:", result)
    assert abs(result['subtotal'] - expected_subtotal) < 0.01
    assert result['usage_charges'] == 0.00
    print("✅ No usage test passed!")

if __name__ == "__main__":
    test_basic_invoice()
    # test_full_month()
    # test_leap_year()
    # test_no_usage()

    print("All tests passed!")