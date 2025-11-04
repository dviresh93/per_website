"""
CODING INTERVIEW QUESTION (45 minutes)

SaaS Monthly Invoice Calculator

You are building an invoice system for a SaaS company. Given customer data,
calculate their monthly bill.

BUSINESS RULES:
- Base plans: Basic ($50/month), Pro ($120/month), Enterprise ($300/month)
- Add-ons: Extra Storage ($20/month), Priority Support ($40/month)
- API usage: First 5000 calls free, then $0.01 per call
- Tax rate: 7.5%
- Pro-rate if customer started mid-month
- Round all amounts to 2 decimal places

INPUT FORMAT:
customer = {
    'plan': 'pro',
    'plan_start_date': '2024-02-10',
    'add_ons': ['extra_storage'],
    'api_calls': 8000,
    'billing_period_start': '2024-02-01',
    'billing_period_end': '2024-02-29'  # February 2024 (leap year)
}

EXPECTED OUTPUT:
{
    'base_plan_charge': 82.76,    # Pro plan pro-rated for Feb 10-29
    'add_on_charges': 13.79,     # Extra storage pro-rated
    'usage_charges': 30.00,      # 3000 calls over free limit
    'subtotal': 126.55,
    'tax': 9.49,
    'total': 136.04
}

YOUR TASK:
Implement the calculate_monthly_invoice() function below.

You may use any helper functions you need.
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any

# Pricing data
PLANS = {
    'basic': Decimal('50.00'),
    'pro': Decimal('120.00'),
    'enterprise': Decimal('300.00')
}

ADD_ONS = {
    'extra_storage': Decimal('20.00'),
    'priority_support': Decimal('40.00')
}

TAX_RATE = Decimal('0.075')  # 7.5%
FREE_API_CALLS = 5000
API_RATE_PER_CALL = Decimal('0.01')

def calculate_monthly_invoice(customer: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate the monthly invoice for a customer.

    Args:
        customer: Dictionary containing customer billing data

    Returns:
        Dictionary with itemized charges and total
    """
    
    customer_plan = customer["plan"]
    customer_add_ons = customer["add_ons"]
    customer_api_calls = customer["api_calls"]

    customer_start_date = datetime.strptime(customer["plan_start_date"], '%Y-%m-%d')
    billing_period_start = datetime.strptime(customer["billing_period_start"], '%Y-%m-%d')
    billing_period_end = datetime.strptime(customer["billing_period_end"], '%Y-%m-%d')
    
    extact_time_of_start = max(billing_period_start, customer_start_date)
    days_used = (billing_period_end - extact_time_of_start).days + 1
    
    days_in_month = get_days_in_month(billing_period_start.month, billing_period_start.year)

    base_plan_price = get_pro_rated_baseplan_price(PLANS[customer_plan], days_used, days_in_month)
    
    total_addons_cost = Decimal('0.00')
    for addon in customer_add_ons: 
        add_on_price = ADD_ONS[addon]
        total_addons_cost += get_pro_rated_addons_cost(add_on_price, days_used, days_in_month)

    usage_cost = get_usage_cost(customer_api_calls)

    total_before_tax = usage_cost + total_addons_cost + base_plan_price

    tax = total_before_tax * TAX_RATE 
    total_after_tax = total_before_tax + tax

    return {
        'base_plan_charge': base_plan_price,    # Pro plan pro-rated for Feb 10-29
        'add_on_charges': total_addons_cost,     # Extra storage pro-rated
        'usage_charges': usage_cost,      # 3000 calls over free limit
        'subtotal': total_before_tax,
        'tax': TAX_RATE,
        'total': total_after_tax
    }

def get_pro_rated_addons_cost(add_on_price, days_used, days_in_month):
    daily_addon_rate = (add_on_price/days_in_month)
    return daily_addon_rate * days_used

def get_usage_cost(customer_api_calls): 
    usage_cost = Decimal('0.00')
    
    if customer_api_calls > FREE_API_CALLS: 
        usage_cost = (customer_api_calls - FREE_API_CALLS)* API_RATE_PER_CALL

    return usage_cost


def get_days_in_month(month, year): 
    import calendar
    return calendar.monthrange(year, month)[1]

def get_pro_rated_baseplan_price(monthly_amount, days_used, days_in_month):
    
    daily_rate = (monthly_amount/days_in_month)
    
    return days_used*daily_rate
    # GET THE NUMBER OF DAYS PLAN WAS USED FOR 
    # GET Pro rated base price 

    # check which addons were used & get a pro rated addon price

    # check how many api calls were made, and then get the total usage cost 

    # add the taxes to it to get the final cost

    # Calculate the number of days in the billing period

# Test with the provided example
if __name__ == "__main__":
    test_customer = {
        'plan': 'pro',
        'plan_start_date': '2024-02-10',
        'add_ons': ['extra_storage'],
        'api_calls': 8000,
        'billing_period_start': '2024-02-01',
        'billing_period_end': '2024-02-29'  # February 2024 (leap year)
    }
    result = calculate_monthly_invoice(test_customer)
    print("Invoice calculation:")
    for key, value in result.items():
        print(f"  {key}: ${value:.2f}")

    expected_total = 136.04
    if abs(float(result['total']) - expected_total) < 0.01:
        print(f"✅ PASSED: Total ${result['total']:.2f} matches expected ${expected_total}")
    else:
        print(f"❌ FAILED: Got ${result['total']:.2f}, expected ${expected_total}")