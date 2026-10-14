# Addis Eats — Ethiopian Food Ordering

Addis Eats is an Ethiopian food-ordering web application built with Next.js. Customers can browse dishes, manage favorites and their cart, authenticate, place orders, and view order information. Staff can access a protected kitchen area.

**Live application:** https://addis-eats-nextjs-o13s.vercel.app/

## Features

- Browse the menu and view individual dish details.
- Search and filter dishes.
- Add dishes to the cart and manage favorites.
- Switch between light and dark themes.
- Sign up, sign in, and sign out.
- Validate checkout information and place orders.
- View order information and track order status.
- Access protected customer and staff pages.
- Manage dishes and orders through the kitchen interface.
- Provide page metadata, robots rules, and an XML sitemap.

## Tech Stack

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- API routes and server-side functionality
- Browser localStorage for supported client-side state

## Getting Started

### Requirements

- Node.js
- npm
- Git

### Installation

Clone the repository and open the project directory:

`module-03-react-nextjs/Projects/addis-eat-next/addis-eats`

Install dependencies:

```bash
npm install
```

Create `.env.local` using the environment-variable names documented in `.env.example` or the project's authentication documentation. Use valid credentials and secrets for your local environment.

**Never commit `.env.local` or expose private secrets.**

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Verification

Build the application:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

Then test the application at http://localhost:3000.

Verify authentication, customer and staff access, menu browsing, cart behavior, checkout, order information, responsive layouts, and SEO routes.

## Data and Limitations

Addis Eats uses client-side state and server-side functionality for different parts of the application. The exact storage and persistence behavior depends on the feature and implementation.

Browser localStorage is specific to a browser and device. Data stored there is not automatically synchronized across different devices.

Refer to `DATA.md` for the documented data sources, storage behavior, and limitations.

## Deployment

**Live URL:** https://addis-eats-nextjs-o13s.vercel.app/

The application is deployed on Vercel. The configured project root and environment variables must match the current project.

After deployment, verify the critical customer and staff flows and check that metadata, sitemap, and social previews work as expected.

## Documentation

- `AUTH.md` — authentication, authorization, and security verification.
- `DATA.md` — data sources, fetching, storage, and application behavior.
- `PERF.md` — performance measurements and optimization decisions.
- `FUTURE.md` — deferred features and planned improvements, if included.
