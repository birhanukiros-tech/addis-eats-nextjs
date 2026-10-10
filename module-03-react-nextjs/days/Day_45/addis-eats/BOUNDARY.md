# Addis Eats — Boundary Map

## Purpose

This document shows the important boundaries in the Addis Eats
Next.js application.

---

## 1. Server / Client Boundary

### Server Side

The server is responsible for:

- Reading dish data.
- API routes.
- Server Actions.
- Zod validation.
- Authentication checks.
- Authorization checks.
- Updating server-side order state.
- Revalidating routes.

Important server files:

- `app/api/dishes/route.js`
- `app/api/dishes/[id]/route.js`
- `app/api/orders/route.js`
- `app/actions.js`
- `lib/auth.js`
- `lib/orders.js`
- `lib/validations.js`

### Client Side

The browser is responsible for:

- Interactive UI.
- Cart state.
- Live search.
- Form input state.
- localStorage.
- Loading and interaction feedback.

Important Client Components:

- `components/Providers.jsx`
- `components/Header.jsx`
- `components/DishList.jsx`
- `components/CartDrawer.jsx`
- `components/CancelOrderButton.jsx`
- `app/login/page.js`
- `app/checkout/page.js`
- `app/orders/page.js`

---

## 2. Authentication Boundary

Protected operations must verify the customer session.

The customer session is stored in the:

`addis-eats-customer`

HTTP cookie.

Server Actions use:

`getCurrentCustomer()`

to determine whether a customer is signed in.

---

## 3. Authorization Boundary

Being signed in is not enough to modify another customer's order.

`cancelOrder()` checks:

1. The customer is signed in.
2. The order exists.
3. The order belongs to the signed-in customer.

Only then is the order changed to:

`Cancelled`

---

## 4. Validation Boundary

User input crosses into the server through forms or API requests.

Before an order is accepted, the data passes through:

`orderSchema`

from:

`lib/validations.js`

Invalid input is rejected instead of being saved.

---

## 5. API Boundary

The API is separated from the UI.

### UI

```text
/menu
/checkout
/orders