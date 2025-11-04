import datetime
import calendar

def monthly_charge(month, subscription, users):
  # Early exit for edge cases
  if not subscription or not users:
    return 0

  # Get the billing month as dates
  year, month_num = map(int, month.split('-'))
  month_start = datetime.date(year, month_num, 1)
  month_end = last_day_of_month(month_start)

  # Calculate daily rate
  days_in_month = (month_end - month_start).days + 1
  daily_rate = subscription['monthly_price_in_cents'] / days_in_month

  total = 0

  for user in users:
    # When did user start being active this month?
    if user['activated_on'] > month_end:
      continue  # User never active this month

    start_billing = user['activated_on']
    if start_billing < month_start:
      start_billing = month_start

    # When did user stop being active this month?
    if user['deactivated_on'] is None:
      end_billing = month_end  # Still active
    else:
      if user['deactivated_on'] < month_start:
        continue  # User already inactive before this month
      end_billing = user['deactivated_on']
      if end_billing > month_end:
        end_billing = month_end

    # Count days and add to total
    days_active = (end_billing - start_billing).days + 1
    total += daily_rate * days_active

  return round(total)

####################
# Helper functions #
####################

def first_day_of_month(date):
  """
  Takes a datetime.date object and returns a datetime.date object
  which is the first day of that month. For example:

  >>> first_day_of_month(datetime.date(2022, 3, 17))  # Mar 17
  datetime.date(2022, 3, 1)                           # Mar  1

  Input type: datetime.date
  Output type: datetime.date
  """
  return date.replace(day=1)

def last_day_of_month(date):
  """
  Takes a datetime.date object and returns a datetime.date object
  which is the last day of that month. For example:

  >>> last_day_of_month(datetime.date(2022, 3, 17))  # Mar 17
  datetime.date(2022, 3, 31)                         # Mar 31

  Input type: datetime.date
  Output type: datetime.date
  """
  last_day = calendar.monthrange(date.year, date.month)[1]
  return date.replace(day=last_day)

def next_day(date):
  """
  Takes a datetime.date object and returns a datetime.date object
  which is the next day. For example:

  >>> next_day(datetime.date(2022, 3, 17))   # Mar 17
  datetime.date(2022, 3, 18)                 # Mar 18

  >>> next_day(datetime.date(2022, 3, 31))  # Mar 31
  datetime.date(2022, 4, 1)                 # Apr  1

  Input type: datetime.date
  Output type: datetime.date
  """
  return date + datetime.timedelta(days=1)

# Test the function
if __name__ == "__main__":
    subscription = {
        'id': 763,
        'customer_id': 328,
        'monthly_price_in_cents': 500
    }

    users = [
        {
            'id': 1,
            'name': "Employee #1",
            'customer_id': 1,
            'activated_on': datetime.date(2022, 4, 1),
            'deactivated_on': datetime.date(2022, 4, 15)
        },
        {
            'id': 2,
            'name': "Employee #2",
            'customer_id': 1,
            'activated_on': datetime.date(2022, 4, 10),
            'deactivated_on': None
        }
    ]

    result = monthly_charge("2022-04", subscription, users)
    print(f"Total charge: {result} cents")