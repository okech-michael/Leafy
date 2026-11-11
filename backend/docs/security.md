# Security notes

- Supabase Auth is the source of truth for passwords, verification, recovery and sessions; this API does not mint its own JWTs.
- Access tokens are verified with Supabase Auth on protected routes. The browser refresh token is set as HTTP-only, scoped, same-site cookie; production sets `Secure`.
- User-scoped database requests carry the user's bearer token and are subject to RLS. The service-role key is confined to the server and used only for narrowly defined operations.
- Every request is CORS-allowlisted, uses Helmet headers, has a bounded JSON body, and receives a request ID. Authorization and cookie headers are redacted from structured logs.
- Database-backed rate limits fail closed if the rate-limit RPC is unavailable. The SQL function accepts only hashed keys and is executable only by `service_role`.
- API errors do not return provider error details or stack traces to clients.
- Private uploads are restricted to an owner-specific path in a private bucket. The initial storage policy permits images and PDFs up to 20 MiB; upload authorization endpoints have not yet been implemented.

Before production, review cookie/domain deployment behavior, configure trusted proxy hops, set exact allowed origins, enable provider-side bot protection where available, review logs/retention, test RLS and rate-limit concurrency, and run dependency scanning. Do not use real user or payment data until the remaining domain APIs and policies have been implemented and independently tested.
