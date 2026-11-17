# Security notes

- Passwords are stored as salted scrypt hashes. API access tokens and refresh tokens are random opaque values; only their SHA-256 hashes are stored in PostgreSQL.
- Access tokens expire after one hour. Refresh tokens are held in an HTTP-only, same-site cookie and rotated on refresh; production sets `Secure`.
- This standalone API does not use database row-level security. Every protected query must include the authenticated user's ownership condition where applicable.
- Every request is CORS-allowlisted, uses Helmet headers, has a bounded JSON body, and receives a request ID. Authorization and cookie headers are redacted from structured logs.
- Database-backed rate limits fail closed when PostgreSQL is unavailable.
- Password recovery currently returns a generic response but does not issue or deliver recovery tokens. Configure an email provider and implement the token flow before relying on recovery.
- Google sign-in is planned and is not enabled yet.

Before production, review cookie/domain behavior, configure trusted proxy hops, set exact allowed origins, review logs and data retention, test rate-limit concurrency and ownership checks, and run dependency scanning. Do not use real user or payment data until remaining domain APIs and operational controls are implemented and reviewed.
