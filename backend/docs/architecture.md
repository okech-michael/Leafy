# Backend architecture

The backend is a separately deployable Express 5 API written in TypeScript. It uses Supabase Auth for identity and Supabase PostgreSQL with row-level security (RLS) for persistent records. It can run as a Node server locally or as a Vercel catch-all function when this directory is deployed as its own Vercel project.

## Trust boundaries

- The browser receives a Supabase access token and sends it as a bearer token. A rotating refresh token is returned only as an HTTP-only cookie scoped to `/api/v1/auth`.
- Protected routes verify the token through Supabase Auth and use a Supabase client carrying that user's token for RLS-governed queries.
- The service-role client is server-only and currently used for rate-limit RPCs, health checks and the narrow contact-message insert. It must not be sent to a browser or used for user-owned records.
- `profiles`, organisation membership, innovations, notifications, file metadata and private storage objects have database RLS policies. New tables must ship with grants and policies in the same migration.
- Authentication and contact rate-limit counters are stored in PostgreSQL, not process memory. Configure a scheduled cleanup for expired `rate_limit_buckets` rows before public production traffic.
- Daraja and other integrations must be isolated behind server-side services and must never trust client-provided totals or payment status.

## Deployment

Deploy `backend/` as a separate Vercel project with the project root set to this directory. The `api/[...path].ts` entry serves the versioned Express routes. The frontend remains a separate deployment. Configure the exact frontend origins in `CORS_ALLOWED_ORIGINS`, and set `TRUST_PROXY_HOPS=1` only when deployed behind Vercel's trusted proxy.

The API uses no local file persistence, in-memory sessions, or long-running background worker. Asynchronous email, SMS and scheduled maintenance still require an external provider/queue or a scheduled Vercel/Supabase job.

See [deployment.md](./deployment.md), [database.md](./database.md), and [security.md](./security.md).
