# Leafy

Leafy is intended to connect agricultural innovators, producers, organisations, institutions, investors, consumers and communities so agricultural ideas and products can become sustainable, commercially viable and impactful. Its five divisions have complementary roles: Farms supports agricultural production, Foods develops food products and related business, Market creates commercial connections, Academy builds relevant capacity, and Foundation coordinates community programmes.

This repository contains the frontend prototype for that ecosystem. The divisions are not yet connected to shared production services or operational records.

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

## Product purpose and current gaps

The divisions are intended to work together rather than operate as unrelated platforms. For example, eligible produce from a Leafy Farms operation or products from a Leafy Foods business may be presented through Leafy Market; Academy learning can develop relevant skills; Foundation programmes can connect participants with appropriate opportunities.

Agricultural innovation is a central part of Leafy's intended work. The organisation aims to connect innovators with incubation, funding, research and validation, technical assistance, mentorship and routes to market. The frontend prototype is not connected to an intake workflow. The separate `feature/backend` branch now has an initial authenticated innovation draft/submission API, but review, assessment and partner matching are not implemented; the existing marketplace seller application is not a substitute for innovation support.

Farm records are intended to support relevant Leafy production activities, not to make Leafy a generic farm ERP provider. Food ordering is one possible business workflow, not the sole purpose of Leafy Foods. Foundation programme listings and impact reporting must be based on confirmed programmes and verified records.

Sample catalogue entries, seller profiles and learner activity are illustrative. They are not confirmed Leafy suppliers, current offers, real learners, organisational achievements or impact figures. The shared admin and staff screens are workflow previews, not live operational dashboards.

## Technology

- React 19 and TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- TanStack Query
- Framer Motion and GSAP
- Lucide icons
- Oxlint
- Backend development on `feature/backend`: Express 5, TypeScript, Supabase Auth/PostgreSQL and Vercel functions (initial phase only)

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
- Backend development is on the separate `feature/backend` branch. It currently provides the initial `/api/v1` foundation, Supabase Auth endpoints and persistent contact submission; Farms and the other division APIs are not implemented. The backend requires its own Supabase configuration and Vercel deployment. It is not connected to the prototype frontend.
- Daraja credentials, server-side order validation, verified M-Pesa callbacks, backend payment status, and production payment handling are **not** included. Do not use the payment screens to collect or process real payments.
- Frontend role selectors and hidden/visible UI controls do not enforce permissions. Any production identity, role, seller, staff or participant access must be checked by a trusted backend on every relevant request.
- Contact and application forms may display a preview or save demo state locally. They must not be treated as delivered messages or received applications.
- Keep secrets in a secure server-side secret store. Never add credentials to React code, `.env` files committed to Git, or browser storage.

## Project structure

```text
src/
  backend/       Separate API project (developed on feature/backend)
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

1. Configure Supabase and separately deploy the initial API on `feature/backend`; implement remaining domain APIs, then establish database backups and production monitoring.
2. Real authentication, server-enforced authorization and secure session handling.
3. Server-side order and price calculation, payment-provider integration and verified, idempotent callbacks.
4. Secure file uploads and storage where documents are supported.
5. Approved privacy notices, terms, retention policies, customer support details and operational procedures.
6. Verification of catalogue details, programme information, contact information and any published impact claims.
7. Automated tests for the critical user journeys and backend security boundaries.

Until these are supplied and validated, treat this repository as a frontend prototype.
