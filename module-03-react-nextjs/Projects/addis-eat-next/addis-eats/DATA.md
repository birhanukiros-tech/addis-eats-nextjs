# Addis Eats — Data & API

## Overview

Addis Eats uses Next.js Server Components, Server Actions, API routes, SWR, and browser storage to support menu browsing and order-related features.

The application includes:

- Menu and dish-detail retrieval.
- Debounced menu search and URL-based pagination.
- Order creation through a Server Action.
- Customer order history displayed from browser `localStorage`.
- API routes for dishes and orders.
- Authentication and protected customer and staff pages.

## Menu Data

The menu displays dish names, descriptions, prices, categories, and images.

The menu page provides initial dish data. The `FilterShall` component uses SWR to retrieve paginated dish results and search results from the API.

Relevant routes:

- `/menu`
- `/menu/[id]`
- `/api/dishes`
- `/api/dishes/[id]`

Search uses a 300-millisecond debounce to reduce unnecessary requests while the user types.

Pagination is reflected in the URL through the `page` query parameter.

## Order Creation and Display

Checkout submits an order through the `placeOrder` Server Action. After a successful response, the client saves the returned order in browser `localStorage` under the key `addis-eats-orders`.

The Orders page checks the authenticated session before displaying order information. The `LiveOrders` component reads locally stored orders and filters the displayed list by the signed-in customer's username.

This behavior is suitable for demonstrating the frontend flow, but browser storage is controlled by the user and cannot establish secure order ownership.

## Order API

The project includes these API routes:

- `/api/orders`
- `/api/orders/[id]`

The presence of these routes does not mean that every order operation uses them. The current Orders interface reads from `localStorage` rather than polling `/api/orders`.

The cancellation button currently updates the order status in browser storage rather than calling the server-side cancellation action.

## Storage and Limitations

The current implementation uses browser `localStorage` for the displayed order history.

- Orders remain available in the same browser and device while the stored data remains intact.
- Orders do not automatically synchronize across browsers or devices.
- Users can inspect or modify browser storage.
- A locally displayed cancellation is not necessarily a server-confirmed update.
- Server-side in-memory storage is not reliable persistent storage across server restarts or multiple Vercel instances.

For production use, order records should be stored in a persistent server-side database. Every read and mutation must enforce authenticated ownership on the server, and order-status changes should be confirmed by the server.

## Verification

The following frontend behaviors were reported as tested locally:

1. Menu and dish-detail routes load.
2. Menu search and pagination work.
3. Checkout successfully returns an order.
4. The order appears in the Orders page for the corresponding customer in the same browser.
5. Cancelling an order changes its locally displayed status.
6. Customer and staff authentication flows remain separate from the frontend order display.

These checks demonstrate the reported frontend behavior. They do not establish complete server-side order ownership, active live polling in the Orders interface, or cross-device persistence.

## Related Documentation

- `README.md` — project overview, setup, and deployment.
- `AUTH.md` — authentication, authorization, and security limitations.
- `PERF.md` — performance measurements and optimization evidence.
