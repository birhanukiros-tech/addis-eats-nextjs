# Addis Eats — Day 45 Verification & Hardening

Addis Eats is a food-ordering web application built with Next.js. Customers can browse dishes, search the menu, manage their cart, sign in, place orders, and view their order history. Staff have access to a protected kitchen area.

## Features

- Menu browsing, dish details, and search.
- Shopping cart with customer-specific local storage.
- Customer registration, sign-in, and sign-out.
- Google sign-in integration.
- Protected checkout and order-history pages.
- Order placement, status updates, and cancellation with server-side ownership checks.
- Live order polling using SWR.
- Staff-only kitchen access.
- Responsive styling, image optimization, and SEO metadata.
- `robots.txt` and XML sitemap.

## Tech Stack

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- SWR
- Server Actions and API routes

## Getting Started

### Requirements

- Node.js and npm
- Git

### Installation

Clone the repository and open the project folder:

```bash
git clone <repository-url>
cd addis-eats
npm install
```

Create a local `.env.local` file using the environment variables required by the authentication and Google sign-in configuration. Obtain the required values securely; never commit secrets.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

The following checks were performed locally:

- Customer order history is scoped to the signed-in customer.
- The orders API returns the current customer's data.
- Live polling does not display another customer's orders.
- Signed-out users are redirected away from protected checkout and order-history pages.
- Unsafe external login redirects fall back to the home page.
- Menu search returns matching dishes.
- `robots.txt` and `sitemap.xml` load successfully.
- `npm run build` completes successfully.

### Lighthouse — Local Mobile Measurement

| Metric | Result | Target |
|---|---:|---:|
| Performance score | 91/100 | At least 90 |
| Largest Contentful Paint (LCP) | 2.4 seconds | Under 2.5 seconds |
| Cumulative Layout Shift (CLS) | 0 | Under 0.1 |

These measurements were collected locally and may vary between runs. Interaction to Next Paint (INP), deployed performance, and real-device mobile behavior still require verification.

## Data and Demo Limitations

The current demo uses in-memory storage for some account and order data. That data may be lost when the server restarts and is not suitable for production persistence without a database.

## Deployment

**Live URL:** To be added after deployment.

After deployment, update the sitemap and canonical metadata to use the production domain. Verify authentication, order ownership, API behavior, performance, and mobile layout on the deployed site.

## Documentation

- `AUTH.md` — authentication, protected routes, and authorization.
- `DATA.md` — data sources, APIs, polling, and search behavior.
- `PERF.md` — performance measurements and optimization notes.