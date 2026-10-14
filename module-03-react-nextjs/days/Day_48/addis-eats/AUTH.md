# Addis Eats — Authentication & Authorization

## Overview

Addis Eats uses server-side authentication and authorization to protect customer and staff features.

The authentication system supports:

- Customer registration, sign-in, and sign-out.
- Google sign-in integration.
- Signed session cookies.
- Protected customer pages and server actions.
- Customer-specific order queries.
- Order ownership checks before cancellation.
- Staff-only access to the kitchen area.

## Session Security

The application uses a signed session token stored in an HTTP-only cookie. Session helpers validate the token and identify the current customer.

Cookie settings should be reviewed in the authentication implementation to confirm the actual `httpOnly`, `secure`, `sameSite`, and expiration values. Production deployment must use HTTPS and an appropriately configured session secret.

Required secrets and authentication configuration belong in `.env.local` for local development or the deployment platform's environment-variable settings. Never commit secrets to Git.

## Protected Routes

The following customer routes require authentication:

- `/checkout`
- `/orders`

Unauthenticated users are redirected to the login page. The `next` parameter allows users to return to an intended internal destination after signing in.

Unsafe external destinations, protocol-relative URLs, and staff-only destinations are rejected by the login redirect logic.

The `/kitchen` route is reserved for staff and checks the authenticated user's role server-side.


## Order Storage and Ownership

The `placeOrder` server action requires a signed-in customer, validates the submitted customer details, retrieves dish information, and calculates the order totals on the server.

The server assigns the order's customer ID from the authenticated session rather than trusting a customer ID submitted by the browser.

After a successful order, the checkout client stores the returned order in browser `localStorage` under the key `addis-eats-orders`.

The Orders page requires authentication. Its `LiveOrders` component reads the locally stored orders and filters the displayed list using the signed-in customer's username.

The current Orders interface also updates cancellation status in `localStorage` on the client. Although the `cancelOrder` server action contains an ownership check, the current client-side cancellation button does not call that server action.

**Important limitation:** Filtering orders by username in browser storage is a frontend display feature, not a security boundary. Browser storage can be inspected or modified by the user. This implementation is for a frontend-focused demo and does not provide secure, shared order history across devices.


## Staff Authorization

Staff access is controlled by the authenticated user's role. The `/kitchen` route performs a server-side role check rather than relying only on whether staff controls are visible in the UI.

Customer accounts must not be able to access staff-only features.

## Verification Performed

The following checks were performed locally:

1. Signed-out access to protected customer routes redirects to login.
2. Signed-in customers can access checkout.
3. Customer order history is scoped to the authenticated customer.
4. The orders API returned an empty data list for a customer with no orders.
5. Live order polling did not reveal another customer's order.
6. Unsafe external login redirects fell back to the home page.
7. The cancellation action checks order ownership before updating an order.
8. Customer access to the staff-only kitchen route was checked.

The cancellation ownership guard was reviewed in code. A direct attempt to cancel another customer's hidden order was not confirmed as an executed test.

## Demo Storage Limitations

Some demo accounts and orders are stored in server memory. This means that data may be lost when the server restarts, and the current in-memory implementation is not suitable for reliable multi-instance production storage.

Before production use, persistent database storage, robust session lifecycle management, rate limiting, and appropriate security monitoring should be reviewed.

## Summary

Authentication establishes the current user through a server-validated session. Authorization checks whether that user may access a route or modify a resource.

Addis Eats applies these checks to customer pages, order operations, API handlers, and staff-only access.