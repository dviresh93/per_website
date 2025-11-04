"""
EMERGENCY PREP - Practice these 4 patterns until they're automatic
"""

from datetime import datetime
from decimal import Decimal

# Pattern 1: Parse dates - practice this 5 times
def practice_dates():
    print("=== PATTERN 1: Parse dates ===")
    start = datetime.strptime('2024-01-15', '%Y-%m-%d')
    end = datetime.strptime('2024-01-31', '%Y-%m-%d')
    print(f"Start: {start}, End: {end}")

# Pattern 2: Calculate days - practice this 5 times
def practice_days():
    print("=== PATTERN 2: Calculate days ===")
    start = datetime.strptime('2024-01-15', '%Y-%m-%d')
    end = datetime.strptime('2024-01-31', '%Y-%m-%d')
    days = (end - start).days + 1  # +1 is crucial!
    print(f"Days: {days}")  # Should be 17

# Pattern 3: Pro-rating - practice this 10 times
def practice_prorating():
    print("=== PATTERN 3: Pro-rating ===")
    monthly_price = Decimal('99.00')
    days_used = 17
    days_in_month = 31
    prorated = monthly_price * days_used / days_in_month
    print(f"Prorated: {prorated}")  # Should be around 54.29

# Pattern 4: Tiered pricing - practice this 10 times
def practice_tiers():
    print("=== PATTERN 4: Tiered pricing ===")
    api_calls = 15000
    tiers = [
        (1000, Decimal('0.00')),   # First 1000 free
        (9000, Decimal('0.02')),   # Next 9000 at $0.02
        (float('inf'), Decimal('0.01'))  # Rest at $0.01
    ]

    remaining = api_calls
    total = Decimal('0.00')

    for tier_limit, price in tiers:
        if remaining <= 0:
            break
        calls_in_tier = min(remaining, tier_limit)
        cost = Decimal(str(calls_in_tier)) * price
        total += cost
        print(f"Tier: {calls_in_tier} calls at ${price} = ${cost}")
        remaining -= calls_in_tier

    print(f"Total API cost: ${total}")  # Should be $230

if __name__ == "__main__":
    practice_dates()
    practice_days()
    practice_prorating()
    practice_tiers()
    print("\n🎯 These are the ONLY 4 patterns you need tomorrow!")