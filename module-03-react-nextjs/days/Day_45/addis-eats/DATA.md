# Addis Eats — Data & API

## Overview

Addis Eats uses server-side data access for menu items, customer orders, and staff order management.

The application includes:

- Menu data retrieval and dish details.
- Customer-specific order history.
- Order creation and cancellation.
- API routes for dishes and orders.
- Live order updates through polling.

## Menu Data

The menu interface displays dishes with details such as name, description, price, category, and image.

Menu data is retrieved through the application's data-access and API layers. Dish details are available through the menu detail route.

Relevant routes include:

- `/menu`
- `/menu/[id]`
- `/api/dishes`
- `/api/dishes/[id]`

## Order Data and Ownership

Order data includes an order identifier, customer ownership, order details, and status.

The server associates each new order with the authenticated customer. It must not trust a customer ID supplied by the client.

Customer order queries are filtered by the current authenticated user's identity. This prevents the orders page and orders API from exposing another customer's private orders.

## Order API

The application provides API routes for accessing and managing orders:

- `/api/orders`
- `/api/orders/[id]`

Protected operations require authentication and validate the submitted data. Order modifications must also verify that the current customer owns the order, unless the operation is explicitly authorized for staff.

The application uses appropriate HTTP response codes for authentication failures, invalid input, and successful operations.

## Live Updates

The customer orders interface uses SWR to poll `/api/orders` at five-second intervals.

The API returns only orders belonging to the authenticated customer. Polling updates the displayed order information without exposing other customers' orders.

The menu search also supports finding dishes by the entered search text.

## Storage Limitations

Some demo account and order data is stored in server memory rather than a persistent database.

Consequences include:

- Data may disappear when the server restarts.
- In-memory data may not be shared across multiple server instances.
- The current demo storage should not be treated as production-grade persistence.

A production deployment should use a persistent database and enforce authentication and ownership checks for every private data operation.

## Verification

Local checks confirmed that:

1. The menu and dish detail routes are available.
2. Customer order history is scoped to the signed-in customer.
3. A customer without orders received an empty order list.
4. Live polling did not expose another customer's order.
5. Order cancellation includes a server-side ownership check.

## Related Documentation

- `README.md` — project overview and setup.
- `AUTH.md` — authentication and authorization.
- `PERF.md` — performance measurements and optimization notes.