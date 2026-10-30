# Leafy

Leafy is a responsive React frontend for a connected community, learning, agriculture, food and commerce ecosystem. It brings the public Leafy landing site together with dedicated experiences for Leafy Academy, Market, Farms, Foods and Foundation.

> **Prototype notice:** Most application data and workflows are local frontend demonstrations, not production services. Do not enter real personal, financial, health, farm or other confidential information. The project does not provide production authentication, authorization, a shared database, or a verified payment integration.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Getting started](#getting-started)
- [Available commands](#available-commands)
- [Application routes](#application-routes)
- [Data, integrations and security](#data-integrations-and-security)
- [Project structure](#project-structure)
- [Production readiness](#production-readiness)

## Features

- **Leafy landing site:** Responsive homepage, division directory, account screens and the silent brand-introduction video background.
- **Leafy Academy:** Course catalogue and learning views, lessons, assessments, assignments, progress, certificates, notifications, learner profile and settings.
- **Leafy Market:** Product and seller browsing, product details, wishlist, cart, checkout, payment status, order history, customer account, seller workspace and marketplace operations screens.
- **Leafy Farms:** Public information and resources, farmer onboarding, farm and crop records, seasons, activity calendar, inputs, harvests, livestock, finances, expert requests, produce drafts, reports and workspace previews.
- **Leafy Foods:** Food catalogue, categories, meals and packages, product details, cart, checkout, payment status, orders, customer account, bulk-order enquiries, support and operations screens.
- **Leafy Foundation:** Public storytelling, About, consolidated Our Work and Get Involved pages, stories, contact, participant workspace and a separate staff-management preview.
- **Responsive navigation and layouts** for public, customer, learner, farmer and staff-facing screens.

The interface includes demonstrations of complete user journeys, but a visible screen or success message does not imply that a real service, payment or server-side workflow is connected.

## Technology

- React 19 and TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- TanStack Query
- Framer Motion and GSAP
- Lucide icons
- Oxlint

## Getting started

### Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8)
- npm

### Install and run

```bash
npm ci
npm run dev
```

Vite prints the local development URL in the terminal (usually `http://localhost:5173`). To make the server available on the local network:

```bash
npm run dev -- --host 0.0.0.0
```

Do not expose a development server to an untrusted network.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Run the TypeScript project build, then create the production frontend in `dist/`. |
| `npm run lint` | Run Oxlint. |
| `npm run preview` | Serve the built `dist/` output locally for preview. Run `npm run build` first. |

## Application routes

| Route | Experience |
| --- | --- |
| `/` | Leafy landing page |
| `/destination` | Division directory |
| `/auth/login`, `/auth/register`, `/auth/forgot`, `/auth/reset`, `/auth/verify` | Account-flow previews |
| `/dashboard`, `/employee`, `/admin` | Shared portal previews |
| `/academy/*` | Academy and learner experience |
| `/market/*` | Marketplace, cart, checkout, orders and seller/operations previews |
| `/farms/*` | Farms public site, farmer workspace and role previews |
| `/foods/*` | Foods storefront, cart, checkout and operations previews |
| `/foundation/*` | Foundation public site and separate participant/staff previews |

Division navigation is owned by each division so its public pages and workspace flows remain distinct. Administrative and role-selection screens in this frontend are demonstrations only; they are not access-controlled.

### Notable Market routes

- `/market/products` and `/market/products/:productId` — product browsing and details
- `/market/cart` — shopping cart
- `/market/checkout` — customer and delivery details
- `/market/payment` and `/market/payment/:paymentId` — payment status experience
- `/market/orders` and `/market/orders/:orderId` — order views
- `/market/seller/*` — seller workspace preview
- `/market/manage/*` — operations preview

The Foods experience has a similar sequence under `/foods/`, including `/foods/cart`, `/foods/checkout` and `/foods/payment`.

## Data, integrations and security

- Academy, Market, Farms, Foods and Foundation prototype state is persisted in browser `localStorage` under separate keys. It is local to the browser and is not shared across devices or users. Clearing site data removes it.
- The catalogues, example records, activity histories and role controls are frontend demo data unless a screen explicitly says otherwise.
- The Farms service includes an API request helper for `/api/farms`; a working backend and API deployment configuration are not included here.
- Daraja credentials, server-side order validation, verified M-Pesa callbacks, backend payment status, and production payment handling are **not** included. Do not use the payment screens to collect or process real payments.
- Frontend role selectors and hidden/visible UI controls do not enforce permissions. Any production identity, role, seller, staff or participant access must be checked by a trusted backend on every relevant request.
- Contact and application forms may display a preview or save demo state locally. They must not be treated as delivered messages or received applications.
- Keep secrets in a secure server-side secret store. Never add credentials to React code, `.env` files committed to Git, or browser storage.

## Project structure

```text
src/
  academy/       Academy routes and learner state
  assets/        Static assets, including the landing video
  farms/         Farms routes, browser persistence and state
  foods/         Foods routes, browser persistence and state
  foundation/    Foundation routes, browser persistence and state
  market/        Market routes and browser-persisted catalogue/cart state
  App.tsx        Shared site routes, landing page and division integration
  index.css      Global styles and Tailwind import
  main.tsx       React application entry point
```

The landing video is stored at `src/assets/leafy-brand-intro-silent.mp4` and imported by the landing page so Vite includes it in production builds.

## Production readiness

Before using Leafy with real users or data, the project needs, at minimum:

1. A deployed API and database with validation, migrations, backups and monitoring.
2. Real authentication, server-enforced authorization and secure session handling.
3. Server-side order and price calculation, payment-provider integration and verified, idempotent callbacks.
4. Secure file uploads and storage where documents are supported.
5. Approved privacy notices, terms, retention policies, customer support details and operational procedures.
6. Verification of catalogue details, programme information, contact information and any published impact claims.
7. Automated tests for the critical user journeys and backend security boundaries.

Until these are supplied and validated, treat this repository as a frontend prototype.
