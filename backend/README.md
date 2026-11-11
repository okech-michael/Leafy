# Leafy backend

This directory is the separately deployable backend for Leafy. Development is happening on `feature/backend`; it must not be merged into `main` without an explicit request.

## Status

The initial implementation provides:

- Express 5 API in TypeScript with `/api/v1` routing, security headers, CORS allowlisting, structured logs with credential-header redaction, request IDs, bounded JSON requests and consistent errors.
- Supabase Auth registration, login, refresh, logout, password recovery/update and authenticated profile lookup.
- A server-only Supabase service client and user-scoped clients that preserve database RLS.
- Persistent public contact submission and database-backed rate limiting.
- Initial innovation-intake endpoints for public published listings and authenticated draft create/edit/submit, with owner checks and a guarded submission transition.
- A Supabase SQL foundation for profiles, permissions, organisations, innovation intake, notifications, private file metadata, audit records, contact messages and rate limits, with RLS and a private Storage bucket.
- Vercel function entry, OpenAPI contract, API/security/deployment documentation and focused validation tests.

This is **not the complete production backend** requested for the whole Leafy ecosystem. Market/Foods/Farms/Academy/Foundation business APIs, real file-upload flows, role administration, notifications delivery, complete Daraja transactions and production operational procedures have not been implemented. Do not use the project to collect real personal or payment data yet.

## Local setup

Requirements: Node.js `>=22.12.0` and a Supabase project.

```powershell
Copy-Item .env.example .env
npm install
# Set the Supabase variables in .env before starting
npm run dev
```

In another terminal:

```powershell
npm run typecheck
npm test
npm run build
npm audit
```

The API listens on `http://localhost:5000` by default. Apply `supabase/migrations/202611110001_initial_platform.sql` to a Supabase project before using the ready check or database-backed routes.

## Deployment

Deploy this directory as its own Vercel project. Keep the frontend deployment separate. Configure Supabase secrets in Vercel environment settings for each environment; never copy real values into `.env.example`, source files, or Git.

See:

- [API contract](./docs/api.md)
- [OpenAPI document](./openapi.yaml)
- [Architecture](./docs/architecture.md)
- [Database setup](./docs/database.md)
- [Security notes](./docs/security.md)
- [Deployment](./docs/deployment.md)
- [Initial branch audit](./docs/audit.md)

## Implementation phases

| Phase | Status |
|---|---|
| 1. Repository audit and architecture | Done for the fetched `feature/backend` branch; see `docs/audit.md`. |
| 2. Project foundation and initial database migration | Foundation implemented; the full domain schema is not complete. |
| 3. Authentication, profiles and permissions | Supabase Auth endpoints and profile/RLS foundation implemented; administrative role workflows remain. |
| 4. Innovation, Farms and Foods APIs | Innovation intake is partially implemented; moderation, partner matching, Farms and Foods APIs are not implemented. |
| 5. Academy, Foundation and Market APIs | Not implemented. |
| 6. Orders, inventory and Daraja payments | Not implemented. No payment endpoint or success simulation exists. |
| 7. Notifications, files and administration | Schema foundation only; no upload, delivery or administration APIs. |
| 8. Security, tests, docs and deployment | Initial controls/docs/tests/deployment entry implemented; full security and production validation remain. |

The branch can be completed in subsequent commits by implementing domain migrations and APIs in dependency order. A successful build or mocked test is not evidence that Supabase, Vercel, email/SMS or Daraja has been production-configured.
