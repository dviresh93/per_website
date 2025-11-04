# Food Delivery Service - Visual Schema Design

## Step 1: Quick Entity List (2 minutes)
```
MAIN ACTORS: customers, restaurants, drivers
CORE OBJECTS: menu_items, orders, deliveries
SUPPORTING: payments, ratings, promos
```

## Step 2: Visual Layout (15 minutes)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ restaurants │────▶│ menu_items  │◀────│ categories  │
├─────────────┤ 1:M ├─────────────┤ M:1 ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ name (PK)   │
│ name        │     │ name        │     │ description │
│ address     │     │ price       │     └─────────────┘
│ phone       │     │ restaurant_id│
│ rating_avg  │     │ category_name│
│ status      │     │ available   │
└─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ customers   │     │order_items  │
├─────────────┤     ├─────────────┤
│ id (PK)     │     │ order_id    │◀─── Composite PK
│ name        │     │ menu_item_id│◀─── (order_id,
│ email       │     │ quantity    │     menu_item_id)
│ phone       │     │ unit_price  │
│ address     │     └─────────────┘
│ loyalty_pts │            ▲
└─────────────┘            │
       │                   │
       │ 1:M               │
       ▼                   │
┌─────────────┐            │
│   orders    │───────────▶┘
├─────────────┤ 1:M
│ id (PK)     │
│ customer_id │     ┌─────────────┐
│ restaurant_id│    │ deliveries  │
│ driver_id   │◀───├─────────────┤
│ promo_code  │ 1:1│ order_id(PK)│◀─── Natural PK
│ status      │    │ driver_id   │
│ total_amt   │    │ status      │
│ created_at  │    │ pickup_time │
│ scheduled_at│    │ delivery_time│
└─────────────┘    └─────────────┘
       │                   ▲
       │ 1:M               │ M:1
       ▼                   │
┌─────────────┐     ┌─────────────┐
│  payments   │     │   drivers   │
├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │
│ order_id    │     │ name        │
│ amount      │     │ phone       │
│ method      │     │ vehicle_info│
│ status      │     │ earnings    │
│ transaction_id│   │ rating_avg  │
└─────────────┘     │ status      │
                    └─────────────┘

SUPPORTING TABLES:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   ratings   │  │ promo_codes │  │customer_prefs│
├─────────────┤  ├─────────────┤  ├─────────────┤
│ order_id    │◀─│ code (PK)   │  │ customer_id │◀─ Composite PK
│ rating_type │  │ discount    │  │ cuisine_type│◀─ (customer_id,
│ target_id   │  │ expires_at  │  │ price_range │   cuisine_type)
│ rating      │  │ max_uses    │  │ dietary_restr│
│ comment     │  └─────────────┘  └─────────────┘
└─────────────┘
 ▲ Composite PK: (order_id, rating_type)
```

## Step 3: dbdiagram.io Code (10 minutes)

```sql
Table restaurants {
  id integer [pk]
  name varchar [not null]
  address text
  phone varchar
  rating_average decimal(3,2)
  status varchar [default: 'active']
  created_at timestamp
}

Table menu_items {
  id integer [pk]
  restaurant_id integer [ref: > restaurants.id]
  category_name varchar [ref: > categories.name]
  name varchar [not null]
  description text
  price decimal(8,2) [not null]
  available boolean [default: true]
}

Table categories {
  name varchar [pk]
  description text
}

Table customers {
  id integer [pk]
  name varchar [not null]
  email varchar [unique]
  phone varchar
  default_address text
  loyalty_points integer [default: 0]
  created_at timestamp
}

Table drivers {
  id integer [pk]
  name varchar [not null]
  phone varchar [not null]
  vehicle_info text
  earnings_total decimal(10,2) [default: 0]
  rating_average decimal(3,2)
  status varchar [default: 'available']
  created_at timestamp
}

Table orders {
  id integer [pk]
  customer_id integer [ref: > customers.id]
  restaurant_id integer [ref: > restaurants.id]
  driver_id integer [ref: > drivers.id]
  promo_code varchar [ref: > promo_codes.code]
  status varchar [default: 'pending']
  total_amount decimal(8,2)
  delivery_address text
  scheduled_at timestamp
  created_at timestamp

  indexes {
    (customer_id, created_at)
    (restaurant_id, created_at)
    (driver_id, created_at)
  }
}

Table order_items {
  order_id integer [ref: > orders.id]
  menu_item_id integer [ref: > menu_items.id]
  quantity integer [not null]
  unit_price decimal(8,2) [not null]

  indexes {
    (order_id, menu_item_id) [pk]
  }
}

Table deliveries {
  order_id integer [pk, ref: - orders.id]
  driver_id integer [ref: > drivers.id]
  status varchar [default: 'assigned']
  pickup_time timestamp
  delivery_time timestamp
  created_at timestamp
}

Table payments {
  id integer [pk]
  order_id integer [ref: > orders.id]
  amount decimal(8,2) [not null]
  payment_method varchar [not null]
  status varchar [default: 'pending']
  transaction_id varchar [unique]
  created_at timestamp
}

Table ratings {
  order_id integer [ref: > orders.id]
  rating_type varchar [not null] // 'restaurant', 'driver'
  target_id integer [not null] // restaurant_id or driver_id
  rating integer [not null] // 1-5 stars
  comment text
  created_at timestamp

  indexes {
    (order_id, rating_type) [pk]
  }
}

Table promo_codes {
  code varchar [pk]
  discount_amount decimal(8,2)
  discount_percentage integer
  minimum_order decimal(8,2)
  expires_at timestamp
  max_uses integer
  current_uses integer [default: 0]
}

Table customer_preferences {
  customer_id integer [ref: > customers.id]
  cuisine_type varchar
  price_range varchar
  dietary_restrictions text

  indexes {
    (customer_id, cuisine_type) [pk]
  }
}
```

## Key Design Decisions

1. **Three-sided marketplace**: Separate tables for customers, restaurants, drivers
2. **Flexible ratings**: Single table with type field (restaurant vs driver ratings)
3. **Order flow**: orders → order_items → deliveries → payments
4. **Status tracking**: Status fields throughout for real-time updates
5. **Performance**: Indexes on time-based queries for dashboards

## Business Requirements Covered
✅ Restaurant menus with categories and pricing
✅ Customer orders with delivery tracking
✅ Driver assignment and status updates
✅ Multiple payment methods
✅ Promotional codes and loyalty points
✅ Rating system for restaurants and drivers
✅ Scheduled deliveries support

This handles the core marketplace dynamics while staying simple enough to build in 30 minutes!