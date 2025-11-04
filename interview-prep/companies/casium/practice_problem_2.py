"""
PRACTICE PROBLEM 2 (40 minutes)

Cloud Storage Service Billing

You're building a billing system for a cloud storage service.

BUSINESS RULES:
- Storage plans: Basic (100GB for $15/month), Pro (500GB for $45/month), Enterprise (2TB for $120/month)
- Overage charges: $0.05 per GB over plan limit
- Add-ons: Backup Service ($10/month), Premium Support ($25/month)
- Bandwidth usage: First 1TB free, then $0.02 per GB
- Tax rate: 6%
- Pro-rate if customer upgraded mid-month
- Round all amounts to 2 decimal places

INPUT FORMAT:
customer = {
    'plan': 'pro',
    'plan_start_date': '2024-03-15',  # Upgraded mid-month
    'storage_used_gb': 650,           # Used 650GB (150GB over 500GB limit)
    'bandwidth_used_gb': 1200,        # Used 1200GB bandwidth
    'add_ons': ['backup_service'],
    'billing_period_start': '2024-03-01',
    'billing_period_end': '2024-03-31'
}

EXPECTED OUTPUT (you calculate this):
{
    'base_plan_charge': ???,     # Pro plan pro-rated for Mar 15-31
    'overage_charges': ???,      # 150GB overage at $0.05/GB
    'add_on_charges': ???,       # Backup service pro-rated
    'bandwidth_charges': ???,    # 200GB over 1TB limit
    'subtotal': ???,
    'tax': ???,
    'total': ???
}

YOUR TASK: Implement the calculate_storage_bill() function
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any

# Pricing data
STORAGE_PLANS = {
    'basic': {'price': Decimal('15.00'), 'storage_gb': 100},
    'pro': {'price': Decimal('45.00'), 'storage_gb': 500},
    'enterprise': {'price': Decimal('120.00'), 'storage_gb': 2048}  # 2TB
}

ADD_ONS = {
    'backup_service': Decimal('10.00'),
    'premium_support': Decimal('25.00')
}

OVERAGE_RATE = Decimal('0.05')  # $0.05 per GB
BANDWIDTH_FREE_GB = 1000  # 1TB free
BANDWIDTH_RATE = Decimal('0.02')  # $0.02 per GB
TAX_RATE = Decimal('0.06')  # 6%

def calculate_storage_bill(customer: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate the monthly storage bill for a customer.

    This is different from the SaaS problem because:
    - Storage has usage-based overage charges
    - Bandwidth has its own pricing tier
    - Different add-on structure
    """
    # TODO: Implement this function
    # Hints:
    # 1. Calculate pro-rated base plan
    # 2. Calculate overage charges (storage_used - plan_limit) * rate
    # 3. Calculate bandwidth charges (bandwidth_used - free_limit) * rate
    # 4. Pro-rate add-ons
    # 5. Add tax and return

    # get the customer details 

    customer_plan = customer["plan"]
    plan_start_date = datetime.strptime(customer["plan_start_date"], "%Y-%m-%d")
    storage_used_gb = customer["storage_used_gb"]
    bandwidth_used_gb = customer["bandwidth_used_gb"]
    add_ons = customer["add_ons"]
    billing_period_start = datetime.strptime(customer["billing_period_start"], "%Y-%m-%d") 
    billing_period_end = datetime.strptime(customer["billing_period_end"], "%Y-%m-%d")

    effective_start_date = max(plan_start_date, billing_period_start)

    days_used = (billing_period_end - effective_start_date).days + 1
    days_in_month = get_days_in_month(billing_period_start.month, billing_period_start.year)

    # calculate base plan price
    # account for mid month upgrade by pro rating 

    base_plan_cost = get_prorated_plan_cost(STORAGE_PLANS[customer_plan]["price"], days_used, days_in_month)
    print("************")
    print(STORAGE_PLANS[customer_plan]["price"])
    print("************")
    # get the addons price - pro rate if and when necessary 
    addons_cost = Decimal("0.00")
    for addon in add_ons: 
        addons_cost += get_prorated_addons_cost(ADD_ONS[addon], days_used, days_in_month)
    
    # get the usage cost 
    bw_usage_cost = get_bw_usage_cost(customer_plan, bandwidth_used_gb)
    storage_cost = get_storage_usage_cost(STORAGE_PLANS[customer_plan]["storage_gb"], storage_used_gb)

    # compute sub total 
    total_cost_before_tax = base_plan_cost + addons_cost + bw_usage_cost + storage_cost

    tax = total_cost_before_tax * TAX_RATE

    total_cost_after_tax = tax + total_cost_before_tax

    return {
        'base_plan_charge': float(base_plan_cost),     # Pro plan pro-rated for Mar 15-31
        'overage_charges': float(storage_cost),      # 150GB overage at $0.05/GB
        'add_on_charges': float(addons_cost),       # Backup service pro-rated
        'bandwidth_charges': float(bw_usage_cost),    # 200GB over 1TB limit
        'subtotal': float(total_cost_before_tax),
        'tax': float(tax),
        'total': float(total_cost_after_tax)
    }

    # add taxes and return final cost 
def get_days_in_month(month, year):
    import calendar
    return calendar.monthrange(year, month)[1] 

def get_prorated_plan_cost(plan_cost, days_used, days_in_month): 
    daily_usage_rate = plan_cost/days_in_month
    pro_rated_date = daily_usage_rate * days_used
    return pro_rated_date

def get_prorated_addons_cost(addon_cost, days_used, days_in_month): 
    daily_usage_rate = addon_cost/days_in_month
    pro_rated_date = daily_usage_rate * days_used
    return pro_rated_date

def get_bw_usage_cost(plan, bandwidth_used_gb):
    additional_bandwith_used =  Decimal("0.00")
    if bandwidth_used_gb > BANDWIDTH_FREE_GB: 
        additional_bandwith_used = bandwidth_used_gb - BANDWIDTH_FREE_GB
    return additional_bandwith_used *  BANDWIDTH_RATE

def get_storage_usage_cost(available_storage, storage_used):
    additional_storage_used = Decimal("0.00")
    if storage_used > available_storage:
        additional_storage_used = storage_used - available_storage
    return additional_storage_used * OVERAGE_RATE

# Test case
if __name__ == "__main__":
    test_customer = {
        'plan': 'pro',
        'plan_start_date': '2024-03-15',
        'storage_used_gb': 650,
        'bandwidth_used_gb': 1200,
        'add_ons': ['backup_service'],
        'billing_period_start': '2024-03-01',
        'billing_period_end': '2024-03-31'
    }

    result = calculate_storage_bill(test_customer)
    print("Storage bill calculation:")
    for key, value in result.items():
        print(f"  {key}: ${value:.2f}")

# This tests a different billing pattern - give it a try!