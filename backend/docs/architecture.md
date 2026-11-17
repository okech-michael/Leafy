# Backend architecture

The backend is a separately deployable Express 5 API written in JavaScript. It uses Prisma to access PostgreSQL and can run as a Node server locally or as a Vercel catch-all function.

## Trust boundaries

- Clients send opaque access tokens as bearer credentials. Refresh tokens are rotated and returned only in an HTTP-only cookie scoped to `/api/v1/auth`.
- Protected routes resolve sessions from PostgreSQL. User-owned queries enforce ownership in their Prisma filters; the API does not rely on PostgreSQL RLS.
- Database credentials are server-only and must never be sent to a browser.
- Authentication and contact rate-limit counters are stored in PostgreSQL rather than process memory.
- Daraja and other integrations must remain server-side and must not trust client-provided totals or payment status.

## Deployment

Deploy `backend/` as a separate Vercel project. The `api/[...path].js` entry serves the versioned Express routes. Configure exact frontend origins in `CORS_ALLOWED_ORIGINS` and set `TRUST_PROXY_HOPS=1` behind Vercel's trusted proxy.

Asynchronous email, SMS, Google OAuth and scheduled maintenance require provider configuration and additional implementation.

See [deployment](./deployment.md), [database](./database.md) and [security](./security.md).
