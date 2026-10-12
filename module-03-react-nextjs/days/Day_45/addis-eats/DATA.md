# Addis Eats — Data & API

## Overview

Addis Eats uses Next.js server components, server actions, API routes, SWR, and browser storage to manage menu and order information.

The application includes:

- Menu and dish-detail retrieval.
- Customer authentication and protected pages.
- Order creation through a server action.
- Customer order history displayed from browser `localStorage`.
- Debounced menu search and URL-based pagination.
- API routes for dishes and orders.

## Menu Data

The menu displays dish names, descriptions, prices, categories, and images.

The menu page supplies initial dish data. The `FilterShall` component uses SWR to retrieve paginated dish results and search results from the API.

Relevant routes:

- `/menu`
- `/menu/[id]`
- `/api/dishes`
- `/api/dishes/[id]`

Menu search is debounced by 300 milliseconds to reduce unnecessary requests while typing.

Menu pagination is reflected in the URL using the `page` query parameter.

## Order Creation and Display

Checkout uses the `placeOrder` server action to submit an order. After a successful response, the checkout client saves the returned order in browser `localStorage` under the key `addis-eats-orders`.

The Orders page checks the authenticated session before displaying the customer's order history.

The `LiveOrders` component reads orders from browser storage and filters the displayed list by the signed-in customer's username.

This implementation is intended for a frontend-focused demonstration. Browser storage is controlled by the user and is not a secure source of order ownership.

## Order API

The application includes:

- `/api/orders`
- `/api/orders/[id]`

These routes remain part of the project. However, the current Orders interface reads from `localStorage` rather than polling `/api/orders`.

The current cancellation button updates the order status in browser storage. It does not call the server-side cancellation action.

## Storage Limitations

The current order-history interface uses browser `localStorage`.

Consequences include:

- Orders persist in the same browser on the same device.
- Orders do not automatically synchronize across browsers or devices.
- Browser storage can be inspected or modified by the user.
- The displayed cancellation status is a local change, not a server-confirmed update.

The server-side order store also uses in-memory storage, which is not reliable shared persistence across Vercel instances or server restarts.

A production implementation requiring shared order history must use persistent server-side storage, authenticated ownership checks, and server-confirmed order updates.

## Verification

The following frontend behaviors were tested locally:

1. The menu and dish-detail routes load.
2. Menu search and pagination work.
3. Checkout successfully returns an order.
4. The order appears in the Orders page for the corresponding customer in the same browser.
5. Cancelling an order changes its locally displayed status.
6. The customer and staff authentication flows remain separate from the frontend order display.

These tests demonstrate the current frontend behavior. They do not establish that server-side order ownership, live order polling, or cross-device persistence is fully implemented.

## Related Documentation

- `README.md` — project overview and setup.
- `AUTH.md` — authentication and authorization.
- `PERF.md` — performance measurements and optimization evidence.