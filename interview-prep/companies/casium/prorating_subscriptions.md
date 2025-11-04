# Prorating Subscriptions - Reconstructed Problem & Solution

## Original Problem (Reconstructed)

### Scenario
You're building a billing system for a SaaS company. Users can activate and deactivate their subscriptions at any time during the month. You need to calculate the total revenue for a given month by pro-rating subscriptions based on the days each user was active.

### Problem Statement
Given a list of users with their activation/deactivation dates and monthly subscription rates, calculate the total revenue for a specific month.

### Business Rules
1. Users are charged based on the number of days they were active in the month
2. Daily rate = Monthly rate / Days in month
3. If a user activates mid-month, charge only from activation date onwards
4. If a user deactivates mid-month, charge only until deactivation date
5. Handle cases where activation/deactivation dates span multiple years
6. Both activation and deactivation dates are inclusive (charge for both days)

### Input Format

```python
users = [
    {
        'id': 1,
        'activated_on': '2024-01-01',
        'deactivated_on': None,  # Still active
        'monthly_rate': 100.00
    },
    {
        'id': 2,
        'activated_on': '2024-01-15',
        'deactivated_on': '2024-01-25',
        'monthly_rate': 50.00
    },
    {
        'id': 3,
        'activated_on': '2023-12-20',
        'deactivated_on': '2024-02-10',
        'monthly_rate': 75.00
    }
]

month = '2024-01'  # Calculate revenue for January 2024
```

### Expected Output

```python
{
    'month': '2024-01',
    'total_revenue': 258.06,
    'user_charges': [
        {'user_id': 1, 'days_active': 31, 'charge': 100.00},
        {'user_id': 2, 'days_active': 11, 'charge': 17.74},
        {'user_id': 3, 'days_active': 31, 'charge': 75.00}
    ]
}
```

### Helper Functions Provided

```python
from datetime import datetime
import calendar

def parse_date(date_string):
    """
    Parse a date string in YYYY-MM-DD format to a datetime object.

    Args:
        date_string: String in format 'YYYY-MM-DD'

    Returns:
        datetime object
    """
    return datetime.strptime(date_string, '%Y-%m-%d')

def get_days_in_month(year, month):
    """
    Get the number of days in a given month.
    Handles leap years correctly.

    Args:
        year: Integer year (e.g., 2024)
        month: Integer month (1-12)

    Returns:
        Integer number of days in the month
    """
    return calendar.monthrange(year, month)[1]

def get_month_boundaries(month_string):
    """
    Get the first and last day of a month from a month string.

    Args:
        month_string: String in format 'YYYY-MM'

    Returns:
        Tuple of (first_day, last_day) as datetime objects
    """
    year, month = map(int, month_string.split('-'))
    first_day = datetime(year, month, 1)
    last_day = datetime(year, month, get_days_in_month(year, month))
    return first_day, last_day
```

### Your Task
Implement the `calculate_monthly_revenue()` function.

---

## Solution

```python
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
import calendar
from typing import List, Dict, Optional, Any

# Helper functions provided
def parse_date(date_string):
    """Parse a date string in YYYY-MM-DD format to a datetime object."""
    return datetime.strptime(date_string, '%Y-%m-%d')

def get_days_in_month(year, month):
    """Get the number of days in a given month. Handles leap years correctly."""
    return calendar.monthrange(year, month)[1]

def get_month_boundaries(month_string):
    """Get the first and last day of a month from a month string."""
    year, month = map(int, month_string.split('-'))
    first_day = datetime(year, month, 1)
    last_day = datetime(year, month, get_days_in_month(year, month))
    return first_day, last_day


# Main solution
def calculate_monthly_revenue(users: List[Dict[str, Any]], month: str) -> Dict[str, Any]:
    """
    Calculate total revenue for a given month with pro-rated subscriptions.

    Args:
        users: List of user dictionaries with activation/deactivation dates
        month: Month string in format 'YYYY-MM'

    Returns:
        Dictionary with total revenue and per-user charges
    """
    # Parse the month parameter into usable date objects
    month_start, month_end = get_month_boundaries(month)
    year, month_num = map(int, month.split('-'))
    days_in_month = get_days_in_month(year, month_num)

    total_revenue = Decimal('0.00')
    user_charges = []

    # Iterate over each user
    for user in users:
        user_id = user['id']
        monthly_rate = Decimal(str(user['monthly_rate']))

        # Parse activation date
        activated_on = parse_date(user['activated_on'])

        # Parse deactivation date (None if still active)
        deactivated_on = None
        if user['deactivated_on'] is not None:
            deactivated_on = parse_date(user['deactivated_on'])

        # Calculate days active in this billing month
        days_active = calculate_active_days(
            activated_on,
            deactivated_on,
            month_start,
            month_end
        )

        # Calculate charge for this user
        if days_active > 0:
            daily_rate = monthly_rate / days_in_month
            charge = daily_rate * days_active
            charge = round_to_cents(charge)

            total_revenue += charge

            user_charges.append({
                'user_id': user_id,
                'days_active': days_active,
                'charge': float(charge)
            })

    return {
        'month': month,
        'total_revenue': float(round_to_cents(total_revenue)),
        'user_charges': user_charges
    }


def calculate_active_days(activated_on: datetime,
                         deactivated_on: Optional[datetime],
                         month_start: datetime,
                         month_end: datetime) -> int:
    """
    Calculate the number of days a user was active in a given month.

    Handles edge cases:
    - User activated before the month started
    - User activated during the month
    - User deactivated during the month
    - User still active (deactivated_on is None)
    - User activated and deactivated in different years

    Args:
        activated_on: Date when user was activated
        deactivated_on: Date when user was deactivated (None if still active)
        month_start: First day of the billing month
        month_end: Last day of the billing month

    Returns:
        Number of days active in the month (0 if not active at all)
    """
    # Determine the effective start date (later of activation or month start)
    effective_start = max(activated_on, month_start)

    # Determine the effective end date
    if deactivated_on is None:
        # User is still active, so use month end
        effective_end = month_end
    else:
        # User deactivated, use earlier of deactivation or month end
        effective_end = min(deactivated_on, month_end)

    # If user was never active during this month, return 0
    if effective_start > month_end or effective_end < month_start:
        return 0

    # Calculate days (add 1 because both start and end dates are inclusive)
    days_active = (effective_end - effective_start).days + 1

    # Handle negative days (shouldn't happen with proper logic, but safeguard)
    return max(0, days_active)


def round_to_cents(amount: Decimal) -> Decimal:
    """Round amount to nearest cent (2 decimal places)."""
    return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


# Test cases
def test_full_month_active():
    """Test user active for entire month"""
    users = [
        {
            'id': 1,
            'activated_on': '2024-01-01',
            'deactivated_on': None,
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    assert result['total_revenue'] == 100.00
    assert result['user_charges'][0]['days_active'] == 31
    print("✅ Test 1 passed: Full month active")


def test_mid_month_activation():
    """Test user activated mid-month"""
    users = [
        {
            'id': 2,
            'activated_on': '2024-01-15',
            'deactivated_on': None,
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # Jan 15-31 = 17 days out of 31
    expected = round(100.00 * 17 / 31, 2)
    assert abs(result['total_revenue'] - expected) < 0.01
    assert result['user_charges'][0]['days_active'] == 17
    print("✅ Test 2 passed: Mid-month activation")


def test_mid_month_deactivation():
    """Test user deactivated mid-month"""
    users = [
        {
            'id': 3,
            'activated_on': '2024-01-01',
            'deactivated_on': '2024-01-15',
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # Jan 1-15 = 15 days out of 31
    expected = round(100.00 * 15 / 31, 2)
    assert abs(result['total_revenue'] - expected) < 0.01
    assert result['user_charges'][0]['days_active'] == 15
    print("✅ Test 3 passed: Mid-month deactivation")


def test_activated_and_deactivated_same_month():
    """Test user activated and deactivated in same month"""
    users = [
        {
            'id': 4,
            'activated_on': '2024-01-10',
            'deactivated_on': '2024-01-20',
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # Jan 10-20 = 11 days out of 31
    expected = round(100.00 * 11 / 31, 2)
    assert abs(result['total_revenue'] - expected) < 0.01
    assert result['user_charges'][0]['days_active'] == 11
    print("✅ Test 4 passed: Activated and deactivated same month")


def test_cross_year_activation():
    """Test user activated in previous year"""
    users = [
        {
            'id': 5,
            'activated_on': '2023-12-15',
            'deactivated_on': None,
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # Should charge for full month (31 days)
    assert result['total_revenue'] == 100.00
    assert result['user_charges'][0]['days_active'] == 31
    print("✅ Test 5 passed: Cross-year activation")


def test_cross_year_deactivation():
    """Test user deactivated in future year"""
    users = [
        {
            'id': 6,
            'activated_on': '2024-01-01',
            'deactivated_on': '2025-06-15',
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # Should charge for full month (31 days)
    assert result['total_revenue'] == 100.00
    assert result['user_charges'][0]['days_active'] == 31
    print("✅ Test 6 passed: Cross-year deactivation")


def test_activated_previous_year_deactivated_mid_month():
    """Test user activated in previous year, deactivated mid-month"""
    users = [
        {
            'id': 7,
            'activated_on': '2023-11-10',
            'deactivated_on': '2024-01-20',
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # Jan 1-20 = 20 days out of 31
    expected = round(100.00 * 20 / 31, 2)
    assert abs(result['total_revenue'] - expected) < 0.01
    assert result['user_charges'][0]['days_active'] == 20
    print("✅ Test 7 passed: Activated previous year, deactivated mid-month")


def test_not_active_during_month():
    """Test user not active during billing month"""
    users = [
        {
            'id': 8,
            'activated_on': '2024-02-01',
            'deactivated_on': '2024-02-28',
            'monthly_rate': 100.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')
    # User was not active in January
    assert result['total_revenue'] == 0.00
    assert len(result['user_charges']) == 0
    print("✅ Test 8 passed: Not active during month")


def test_leap_year():
    """Test February in a leap year"""
    users = [
        {
            'id': 9,
            'activated_on': '2024-02-01',
            'deactivated_on': None,
            'monthly_rate': 116.00  # Chosen so daily rate is exactly $4
        }
    ]

    result = calculate_monthly_revenue(users, '2024-02')
    # 2024 is a leap year, Feb has 29 days
    assert result['total_revenue'] == 116.00
    assert result['user_charges'][0]['days_active'] == 29
    print("✅ Test 9 passed: Leap year February")


def test_multiple_users():
    """Test multiple users with different scenarios"""
    users = [
        {
            'id': 1,
            'activated_on': '2024-01-01',
            'deactivated_on': None,
            'monthly_rate': 100.00
        },
        {
            'id': 2,
            'activated_on': '2024-01-15',
            'deactivated_on': '2024-01-25',
            'monthly_rate': 50.00
        },
        {
            'id': 3,
            'activated_on': '2023-12-20',
            'deactivated_on': '2024-02-10',
            'monthly_rate': 75.00
        }
    ]

    result = calculate_monthly_revenue(users, '2024-01')

    # User 1: 31 days = $100.00
    # User 2: 11 days = $50 * 11/31 = $17.74
    # User 3: 31 days = $75.00
    # Total = $192.74

    expected_total = 100.00 + (50.00 * 11 / 31) + 75.00
    assert abs(result['total_revenue'] - expected_total) < 0.01
    assert len(result['user_charges']) == 3
    print("✅ Test 10 passed: Multiple users")


if __name__ == "__main__":
    print("Running test suite...\n")

    test_full_month_active()
    test_mid_month_activation()
    test_mid_month_deactivation()
    test_activated_and_deactivated_same_month()
    test_cross_year_activation()
    test_cross_year_deactivation()
    test_activated_previous_year_deactivated_mid_month()
    test_not_active_during_month()
    test_leap_year()
    test_multiple_users()

    print("\n🎉 All tests passed!")

    # Example usage
    print("\n" + "="*50)
    print("EXAMPLE USAGE")
    print("="*50)

    example_users = [
        {
            'id': 1,
            'activated_on': '2024-01-01',
            'deactivated_on': None,
            'monthly_rate': 100.00
        },
        {
            'id': 2,
            'activated_on': '2024-01-15',
            'deactivated_on': '2024-01-25',
            'monthly_rate': 50.00
        },
        {
            'id': 3,
            'activated_on': '2023-12-20',
            'deactivated_on': '2024-02-10',
            'monthly_rate': 75.00
        }
    ]

    result = calculate_monthly_revenue(example_users, '2024-01')

    print(f"\nMonth: {result['month']}")
    print(f"Total Revenue: ${result['total_revenue']:.2f}")
    print("\nPer-User Breakdown:")
    for charge in result['user_charges']:
        print(f"  User {charge['user_id']}: {charge['days_active']} days active = ${charge['charge']:.2f}")
```

---

## Key Insights from Feedback

### What You Did Right ✅
1. Parsed the month parameter into a usable date object
2. Calculated days in month correctly (handled leap years)
3. Iterated over users or days

### What Was Missing ❌
1. **Cross-year handling**: Didn't handle when activation was in 2023 but billing month was 2024
2. **Mid-month edge cases**: Logic for mid-month activation/deactivation had bugs
3. **Code organization**: Should have extracted helper functions like `calculate_active_days()`
4. **Testing**: Should have added automated tests

### Solution Improvements
- Extracted `calculate_active_days()` as a named function
- Properly handled all date boundary cases using `max()` and `min()`
- Added comprehensive test suite (10+ tests)
- Used proper financial calculations with `Decimal`
- Clear documentation and edge case handling
