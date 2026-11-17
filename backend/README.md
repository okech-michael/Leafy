# Leafy backend

This directory is the separately deployable JavaScript API for Leafy. The backend uses Express 5, PostgreSQL, and Prisma. Google sign-in is planned as a future authentication provider integration.

## Current scope

- Express API with `/api/v1` routing, security headers, CORS allowlisting, structured logs, request IDs, bounded JSON requests and consistent errors.
- PostgreSQL persistence through Prisma for users, profiles, sessions, contact messages, innovations and rate limits.
- Email/password registration and login with hashed passwords and opaque, rotating database sessions. Password recovery currently returns the non-enumerating response but requires an email provider and token flow before it can complete.
- Public contact submission, database-backed rate limiting and innovation intake endpoints.
- Vercel catch-all entry, OpenAPI contract, API/security/deployment docs and JavaScript schema tests.

This is not a complete production backend. Google OAuth, email verification/recovery delivery, domain APIs, file uploads, notification delivery, payments and complete operational procedures remain future work. Do not use the project to collect real personal or payment data yet.

## Local setup

Requirements: Node.js `>=22.12.0` and PostgreSQL.

```sh
cp .env.example .env
npm install
# Set DATABASE_URL to a PostgreSQL database
npm run db:dev
npm run dev
```

The API listens on `http://localhost:5000` by default. `npm run build` generates the Prisma client. Use `npm run db:migrate` to apply committed migrations in a deployed environment.

## Deployment

Deploy this directory as its own Vercel project. Configure `DATABASE_URL` in Vercel environment settings and run committed Prisma migrations as part of release operations. Keep database credentials in deployment secrets.

See [API contract](./docs/api.md), [OpenAPI](./openapi.yaml), [architecture](./docs/architecture.md), [database setup](./docs/database.md), [security notes](./docs/security.md) and [deployment](./docs/deployment.md).
