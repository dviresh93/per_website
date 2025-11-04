"""
STEP 2 - Add Tax (Still Simple!)

Same phone plan, but now add 8% tax

Your task:
1. Calculate the pro-rated bill (like before): $11.61
2. Add 8% tax: $11.61 × 0.08 = $0.93
3. Total with tax: $11.61 + $0.93 = $12.54

Try to code this yourself!
"""

from decimal import Decimal

def calculate_phone_bill_with_tax():
    # TODO: You try this one!
    # Hint: Copy from baby_steps.py and add tax calculation

    monthly_price = Decimal('30.00')
    days_used = 12
    days_in_month = 31
    tax_rate = Decimal('0.08')  # 8%

    # Your code here...

    pass

if __name__ == "__main__":
    # Test your function
    total = calculate_phone_bill_with_tax()
    print(f"Total with tax: ${total:.2f}")
    # Should be around $12.54