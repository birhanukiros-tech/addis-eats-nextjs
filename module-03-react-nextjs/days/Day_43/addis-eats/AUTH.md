# Addis Eats Authentication & Authorization

## Overview

Addis Eats uses server-side session authentication to protect customer and staff-only areas.

The authentication system provides:

* Customer sign-in and sign-out
* Secure HTTP-only session cookies
* Protected customer routes
* Session-based authorization
* Order ownership checks
* Staff role authorization
* Protected API and server actions

## Session Security

The application stores the authenticated session in a cookie configured with:

* `httpOnly`
* `secure`
* `sameSite`
* An appropriate expiration time

The `getSession()` helper is used by protected pages and server-side code to determine the currently authenticated user.

## Protected Routes

Middleware protects the following private customer routes:

* `/checkout`
* `/orders`

Unauthenticated users are redirected to the sign-in page.

The intended destination is passed using the `next` parameter so that the user can return to the page they originally requested after signing in.

Unsafe `next` values are rejected unless they start with `/`.

## Order Ownership

Orders are scoped to the authenticated customer.

The orders page uses the current session username when retrieving orders:

```js
const orders = getOrdersFor(session.username);
```

The order query filters orders using the customer's ID:

```js
order.customerId === customerId
```

This prevents one customer from reading another customer's orders.

Order writes also verify ownership before modifying an existing order. For example, cancelling an order checks:

```js
if (order.customerId !== customer.username) {
  return {
    success: false,
    error: "You are not allowed to cancel this order.",
  };
}
```

New orders receive their `customerId` from the authenticated session rather than trusting a customer ID supplied by the client.

## API Security

The `/api/orders` handler checks the current authenticated customer before accepting an order.

Unauthenticated requests receive:

```text
401 Unauthorized
```

Authenticated requests with valid order data are accepted with:

```text
201 Created
```

The API also assigns the order ownership using the authenticated customer's username.

## Staff Authorization

A staff role is supported for administrative access.

The `/kitchen` route is protected server-side by checking the authenticated user's role before rendering the staff page.

Authorization is therefore not based only on hiding elements in the UI.

## Security Testing

The following authentication and authorization scenarios were tested:

1. Signed-out user attempting to place an order → rejected with HTTP `401`.
2. Signed-in customer submitting a valid order → accepted with HTTP `201`.
3. Orders page retrieves only orders belonging to the authenticated customer.
4. Order cancellation verifies ownership before updating the order.
5. Staff-only `/kitchen` access is checked server-side.
6. Unsafe redirect destinations are rejected.

## Summary

Authentication identifies the current user through the server-side session.

Authorization determines whether that authenticated user is allowed to access a route or modify a resource.

Addis Eats applies both concepts to customer routes, orders, server actions, API handlers, and the staff-only kitchen route.
