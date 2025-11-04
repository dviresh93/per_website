"""
BABY STEPS - Super Simple Problem

Problem: Phone Plan Bill
- Basic plan: $30/month
- Customer started on January 20th
- January has 31 days
- How much do they owe for January?

Steps:
1. Customer used January 20-31 = 12 days
2. Daily rate = $30 ÷ 31 days = $0.97 per day
3. Bill = 12 days × $0.97 = $11.61

Let's code this step by step!
"""

from decimal import Decimal

def calculate_phone_bill():
    print("=== SUPER SIMPLE PHONE BILL ===")

    # Step 1: Basic info
    monthly_price = Decimal('30.00')
    days_in_january = 31
    days_customer_used = 12  # Jan 20-31

    # Step 2: Calculate daily rate
    daily_rate = monthly_price / days_in_january
    print(f"Daily rate: ${daily_rate}")

    # Step 3: Calculate total bill
    total_bill = daily_rate * days_customer_used
    print(f"Customer used {days_customer_used} days")
    print(f"Total bill: ${total_bill}")

    return float(total_bill)

if __name__ == "__main__":
    result = calculate_phone_bill()
    print(f"\n✅ Customer owes: ${result:.2f}")