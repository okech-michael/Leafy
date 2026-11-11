# Backend branch audit

Audit completed before replacing the branch implementation on 2026-11-11.

## Repository and branch

- Working branch: `feature/backend`
- Remote: `origin/feature/backend`
- Initial branch commit: `1b739c1` (`backend build`)
- The branch was fetched from GitHub and checked out locally before backend changes.
- The frontend and `main` branch were not used for backend development.

## Existing implementation

The original branch contained an Express 5 server with sign-up, sign-in and contact routes. Express validation middleware and a process-local login rate limiter were present. There were no database integrations, schema migrations, tests, OpenAPI documentation, Vercel API functions, or production deployment instructions.

Authentication accounts and contact submissions were held in module-level arrays. They disappeared on process restart and were not shared between serverless instances. The server minted its own JWTs and had no token verification middleware, password recovery, email verification, account persistence, or server-enforced roles. Contact submission returned success after writing only to process memory.

The branch's `.env.example` included a fixed test signing key. It has been removed and is not reproduced here. If that value was ever used outside the prototype, rotate it.

## Frontend integration observations

- The frontend's sign-in and registration form still deliberately behaves as a prototype; it does not call an API.
- Market and Foods payment pages already call legacy `/api/market/...` and `/api/foods/...` paths. Those endpoints are not implemented on this branch.
- Farms has a `/api/farms` request helper, but there are no Farms API routes.
- Foundation applications and several other workflows are saved in browser `localStorage`.

The new API uses `/api/v1/`; legacy frontend calls are not silently redirected to fake success responses.

## Current boundary

The initial implementation adds a typed Express API, Supabase Auth integration, a first Supabase migration, persistent contact submission, database-backed rate limiting, health checks, Vercel function entry, API documentation and focused schema tests. A basic innovation-intake API has since been added. Other product-domain APIs, complete payment processing, secure upload flows, email/SMS delivery and full operational workflows remain future implementation/configuration work and are tracked in `README.md`.
