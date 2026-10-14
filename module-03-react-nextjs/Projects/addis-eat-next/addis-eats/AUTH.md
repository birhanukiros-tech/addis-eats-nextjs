# Addis Eats — Authentication & Authorization

## Overview

Addis Eats uses server-side authentication and authorization to protect customer and staff features.

The application includes:

- Customer registration, sign-in, and sign-out.
- Google sign-in integration.
- Signed session cookies.
- Protected customer routes and server actions.
- Order ownership checks.
- Staff-only access to the kitchen area.

## Session Security

The application uses a signed session token stored in an HTTP-only cookie. Session helpers validate the token and identify the current user.

Review the authentication implementation to confirm the cookie's `httpOnly`, `secure`, `sameSite`, and expiration settings. Production deployment should use HTTPS and a strong session secret.

Keep credentials and secrets in `.env.local` locally or in the deployment platform's environment settings. Never commit secrets to Git.

## Protected Routes

The following customer routes require authentication:

- `/checkout`
- `/orders`

Unauthenticated users are redirected to login. The `next` parameter supports returning users to an intended internal destination after signing in.

The login redirect logic is designed to reject unsafe external destinations, protocol-relative URLs, and staff-only destinations.

The `/kitchen` route is reserved for staff and must verify the authenticated user's role server-side.

## Order Handling and Ownership

The `placeOrder` server action is documented as requiring an authenticated customer, validating submitted customer details, retrieving dish information, and calculating totals on the server.

The order's customer ID should come from the authenticated session, not from an untrusted customer ID submitted by the browser.

After a successful order, the checkout client stores the returned order in browser `localStorage` under `addis-eats-orders`.

The Orders page displays locally stored orders filtered by the signed-in customer's username. This filtering is a frontend display feature, not a security boundary: users can inspect or modify browser storage.

The current cancellation interface updates cancellation status in localStorage rather than calling the `cancelOrder` server action. Although that server action includes an ownership check, the client-side cancellation flow does not currently enforce ownership through that server action.

**Important limitation:** Browser-local order history is not secure, shared server-side order storage. It is not automatically synchronized across devices.

## Staff Authorization

The `/kitchen` route uses a server-side role check. Hiding staff controls in the interface alone is not sufficient authorization.

Customer accounts must not be able to access staff-only functionality.

## Verification Evidence

The following checks were reported as performed locally:

1. Signed-out access to protected customer routes redirects to login.
2. Signed-in customers can access checkout.
3. Customer order history is filtered for the signed-in customer.
4. The orders API returned an empty data list for a customer with no orders.
5. Live order polling was checked for cross-customer data exposure.
6. Unsafe external login redirects fell back to the home page.
7. The cancellation action's ownership check was reviewed in code.
8. Customer access to the staff-only kitchen route was checked.

**Testing limitation:** A direct attempt to cancel another customer's hidden order was not confirmed as an executed test. Do not present this attack as a successfully blocked live test without running it.

## Demo Storage Limitations

Some demo accounts or orders may use server memory or browser localStorage, depending on the feature. In-memory data can be lost when the server restarts and may not be shared reliably across multiple server instances.

Before production use, implement or verify persistent server-side order storage, enforce authorization on every order mutation, review session lifecycle management, and consider rate limiting and security monitoring.

## Summary

Authentication identifies the current user through a validated session. Authorization determines which routes and resources that user may access.

Addis Eats includes protected customer and staff features, but client-side order storage and cancellation behavior have limitations that should be addressed before treating the order system as production-ready.
