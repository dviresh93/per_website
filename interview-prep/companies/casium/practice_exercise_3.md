# Exercise 3: E-commerce Platform

## Scenario: Online Store Management

You're designing a database for an online store where customers order products from different categories.

## Requirements:
- Customers can create accounts and place multiple orders
- Products belong to categories (Electronics, Clothing, Books, etc.)
- Each order can contain multiple products with different quantities
- Track order status (pending, shipped, delivered, cancelled)
- Customers can leave reviews for products they've purchased
- Track inventory levels for each product
- Support discount codes that customers can apply to orders

## Your Task:

Complete the schema below by filling in the missing tables and fixing any issues:

```sql
// TODO: Complete this schema

Table customers {
  // Add your fields here
}

Table categories {
  // Add your fields here
}

Table products {
  // Add your fields here
  // Don't forget to connect to categories!
}

Table orders {
  // Add your fields here
  // Don't forget to connect to customers!
}

// TODO: Create a junction table for orders ↔ products
Table _______ {
  // What fields do you need here?
}

// TODO: Create a table for product reviews
Table _______ {
  // What fields do you need here?
}

// TODO: Create a table for discount codes
Table _______ {
  // What fields do you need here?
}
```

## Questions Your Schema Should Answer:
1. What products are in the "Electronics" category?
2. How many items are in customer John's current order?
3. What's the average rating for product "iPhone 15"?
4. Which orders used discount code "SAVE20"?
5. How many units of each product are in stock?

## Instructions:
- Edit this file directly
- Fill in all the TODO sections
- Use proper syntax: `integer [primary key]`, `[ref: > table.id]`, etc.
- Think about which relationships are one-to-many vs many-to-many
- Don't forget timestamps and status fields!

Good luck! 🚀
```