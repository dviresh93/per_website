"""
EXAM TEMPLATE - Copy this structure tomorrow
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Any

def calculate_invoice(customer: Dict[str, Any]) -> Dict[str, float]:
    """
    STEP-BY-STEP TEMPLATE FOR TOMORROW
    """

    # STEP 1: Parse the input (copy this exactly)
    plan = customer['plan'].lower()
    plan_start = datetime.strptime(customer['plan_start_date'], '%Y-%m-%d')
    billing_start = datetime.strptime(customer['billing_period_start'], '%Y-%m-%d')
    billing_end = datetime.strptime(customer['billing_period_end'], '%Y-%m-%d')

    add_ons = customer.get('add_ons', [])
    api_calls = customer.get('api_calls', 0)

    # STEP 2: Calculate days for pro-rating
    effective_start = max(plan_start, billing_start)  # Use the later date
    days_used = (billing_end - effective_start).days + 1  # +1 is crucial!
    days_in_month = 31  # You can hardcode this if needed, or import calendar

    # STEP 3: Base plan charge (pro-rated)
    # They'll give you the PLANS dict - use it exactly like this:
    # base_charge = PLANS[plan] * days_used / days_in_month
    base_charge = Decimal('99.00') * days_used / days_in_month  # Example

    # STEP 4: Add-ons (also pro-rated)
    # They'll give you ADD_ONS dict - loop like this:
    addon_charge = Decimal('0.00')
    # for addon in add_ons:
    #     if addon in ADD_ONS:
    #         addon_charge += ADD_ONS[addon] * days_used / days_in_month

    # STEP 5: API usage (tiered)
    # They'll give you API_PRICING - use the pattern from emergency_prep.py
    usage_charge = Decimal('0.00')

    # STEP 6: Sum everything up
    subtotal = base_charge + addon_charge + usage_charge
    tax = subtotal * Decimal('0.0825')  # They'll give you the tax rate
    total = subtotal + tax

    # STEP 7: Round and return (copy this exactly)
    def round_money(amount):
        return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    return {
        'base_plan_charge': float(round_money(base_charge)),
        'add_on_charges': float(round_money(addon_charge)),
        'usage_charges': float(round_money(usage_charge)),
        'subtotal': float(round_money(subtotal)),
        'tax': float(round_money(tax)),
        'total': float(round_money(total))
    }

# MEMORIZE THIS STRUCTURE - It's your safety net tomorrow