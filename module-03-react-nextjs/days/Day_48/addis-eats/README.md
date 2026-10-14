
# Addis Eats — Day 48 Accessibility & Production Readiness

Addis Eats is an Ethiopian food-ordering web application built with Next.js. Customers can browse dishes, manage their cart, sign in, place orders, and view their order information. Staff can access a protected kitchen area to manage dishes and orders.

## Features

- Browse dishes and view dish details.
- Responsive menu with optimized images.
- Customer-specific shopping carts stored in browser localStorage.
- Customer registration, sign-in, sign-out, and optional Google sign-in.
- Checkout form with validation and duplicate-submission prevention.
- Order records saved to browser localStorage by the Day 48 checkout flow.
- Cart drawer with keyboard navigation and Escape-to-close behavior.
- Accessible menu, cart, checkout, and header controls.
- Staff-only kitchen interface.
- Dish and order management.
- SEO metadata, robots rules, and XML sitemap.

## Tech Stack

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- React Server Actions for authentication-related operations
- Browser localStorage for cart and Day 48 checkout order records

## Getting Started

### Requirements

- Node.js
- npm
- Git

### Installation

From the cloned repository, open the Day 48 project directory:

`module-03-react-nextjs/days/Day_48/addis-eats`

Install dependencies:

```bash
npm install
```

Create `.env.local` using the required values described in `.env.example`. Use valid password hashes, a unique session secret, and a Google OAuth client ID if Google sign-in is enabled.

Do not commit `.env.local` or expose real secrets.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Verification

Run a production build:

```bash
npm run build
```

Start the production build locally:

```bash
npm run start
```

Test the application at http://localhost:3000.

### Accessibility checks

- Navigate through links and buttons using Tab and Shift + Tab.
- Activate buttons and links using Enter or Space where appropriate.
- Verify visible keyboard focus indicators.
- Check cart-drawer Escape behavior and focus restoration.
- Check checkout validation and duplicate-submit prevention.
- Verify that controls remain usable at narrow mobile widths.

## Data and Demo Limitations

The Day 48 checkout flow saves new order records in browser localStorage under `addis-eats-orders`. Cart data is stored under customer-specific or guest cart keys.

Browser-local order records are not automatically shared across different browsers or devices. Clearing browser storage may remove these records.

Authentication and session handling remain in the existing application. Server-side order synchronization and SSE behavior require separate verification and are deferred until after Days 48, 49, and 50.

## Deployment

**Live URL:** https://addis-eats-nextjs-o13s.vercel.app/

The Day 48 version must be deployed to the correct Vercel project root before this URL represents the Day 48 release.

Configure the required environment variables in the appropriate Vercel environments. Never place private secrets in `NEXT_PUBLIC_` variables.

After deployment, verify the login flow, menu, cart, checkout, order storage, staff access, SEO routes, and mobile usability.

## Documentation

- `AUTH.md` — authentication and access control.
- `DATA.md` — data sources and application behavior.
- `PERF.md` — performance measurements and optimization notes.
