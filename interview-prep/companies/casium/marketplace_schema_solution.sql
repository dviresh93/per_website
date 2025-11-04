// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  email varchar [unique, not null]
  name varchar [not null]
  user_type varchar [not null] // 'buyer', 'seller', 'both'
  phone varchar
  address text
  created_at timestamp [default: `now()`]
  status varchar [default: 'active'] // 'active', 'suspended'
}

Table categories {
  id integer [primary key]
  name varchar [unique, not null]
  description text
  created_at timestamp [default: `now()`]
}

Table products {
  id integer [primary key]
  seller_id integer [ref: > users.id, not null]
  category_id integer [ref: > categories.id, not null]
  name varchar [not null]
  description text
  price decimal(10,2) [not null]
  stock_quantity integer [default: 0]
  status varchar [default: 'active'] // 'active', 'inactive', 'sold_out'
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table orders {
  id integer [primary key]
  buyer_id integer [ref: > users.id, not null]
  total_amount decimal(10,2) [not null]
  status varchar [default: 'pending'] // 'pending', 'shipped', 'delivered', 'cancelled'
  shipping_address text [not null]
  order_date timestamp [default: `now()`]
  shipped_date timestamp
  delivered_date timestamp
}

Table order_items {
  id integer [primary key]
  order_id integer [ref: > orders.id, not null]
  product_id integer [ref: > products.id, not null]
  quantity integer [not null, default: 1]
  unit_price decimal(10,2) [not null]

  indexes {
    (order_id, product_id) [unique]
  }
}