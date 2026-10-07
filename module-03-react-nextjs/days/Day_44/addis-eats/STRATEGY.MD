# Addis Eats — Next.js Strategy

## Purpose

This document explains why each part of Addis Eats uses a
Server Component, Client Component, API Route, or Server Action.

---

## Route Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | Server Component | Displays the home page without requiring browser state. |
| `/menu` | Server Component + Client Component | Server fetches/filter data; client handles live search and cart interaction. |
| `/menu/[id]` | Server Component | Displays one dish using its dynamic ID. |
| `/cart` | Client Component | Cart state and quantity changes require browser interaction. |
| `/checkout` | Client Component + Server Action | Form needs client state, while order submission and validation run on the server. |
| `/checkout/success` | Client/Server UI | Displays the result after a successful order. |
| `/orders` | Client Component | Reads and updates order history stored in localStorage. |
| `/login` | Client Component + Server Action | Form uses useActionState; login is handled on the server. |

---

## API Strategy

### GET `/api/dishes`

Returns the complete dish list.

### GET `/api/dishes/[id]`

Returns one dish by ID.

Unknown IDs return HTTP 404.

### POST `/api/orders`

Accepts order information and validates it with Zod.

Invalid data returns HTTP 422 with field errors.

---

## Server Action Strategy

Server Actions are used for operations that change data
or require server-side authorization.

### `login()`

Validates username and password and creates the customer session cookie.

### `placeOrder()`

- Checks that the customer is signed in.
- Validates the order with Zod.
- Creates the order.
- Revalidates the orders route.

### `cancelOrder()`

- Checks that the customer is signed in.
- Finds the requested order.
- Checks that the order belongs to the current customer.
- Changes the order status to Cancelled.
- Revalidates the orders route.

---

## Client Component Strategy

A component becomes a Client Component when it needs browser-only
features or interactive state.

Examples include:

- `useState`
- `useEffect`
- `useActionState`
- `useTransition`
- `localStorage`
- click handlers
- cart interaction

Examples:

- Header
- DishList
- CartDrawer
- Providers
- Checkout page
- Login page
- Orders page

---

## Data Strategy

Dish data is read from the server.

Cart state is managed on the client and persisted in localStorage.

Order history is currently stored in localStorage for the capstone.

The server also keeps orders temporarily in memory so that
Server Actions can demonstrate server-side authorization.

---

## Validation Strategy

Zod provides shared validation through:

`lib/validations.js`

The order schema validates:

- name
- phone
- delivery address

The phone number also uses a regular expression to require
a valid Ethiopian-style 10-digit number beginning with `09` or `07`.

---

## Rendering Principle

Use Server Components by default.

Use Client Components only when browser interaction or browser APIs
are required.

Use Server Actions for server-side mutations and authorization.

Use API Routes when an HTTP endpoint is required.

### Rendering Results

The final production build reports the application routes as
dynamic server-rendered routes.

| Route | Final Build Result | Meaning |
|---|---|---|
| `/` | Dynamic | Server-rendered on demand. |
| `/cart` | Dynamic | Client-side cart UI is included in a dynamically rendered route. |
| `/login` | Dynamic | Login UI is rendered as part of the application route. |
| `/checkout` | Dynamic | Uses server-side order/authentication behavior. |
| `/checkout/success` | Dynamic | Part of the checkout flow. |
| `/menu` | Dynamic | Uses request/search information for filtering. |
| `/orders` | Dynamic | Displays client-side order history and interacts with the application. |
| `/menu/[id]` | Dynamic | Dynamic dish route. |
| `/api/dishes` | Dynamic API | HTTP API endpoint. |
| `/api/dishes/[id]` | Dynamic API | Dynamic HTTP API endpoint. |
| `/api/orders` | Dynamic API | HTTP POST endpoint for order requests. |

### Build Conclusion

The final production build completed successfully.

Next.js reports the application routes as dynamically
server-rendered on demand.

This does not change the Server Component and Client Component
strategy. Those choices describe where code executes and what
capabilities a component needs, while the build output describes
how Next.js renders the resulting route.

The final build therefore confirms that the application compiles
successfully and that the documented architecture is consistent
with the production build.