# Database and migrations

The backend connects directly to PostgreSQL through Prisma. The Prisma schema is in `prisma/schema.prisma`; ordered SQL migrations live in `prisma/migrations/`.

For local development, set `DATABASE_URL` in `.env` and run `npm run db:dev`. For deployment, run `npm run db:migrate` against the configured database. Review each migration in staging before applying it to production, and back up production data first.

The initial schema covers users, profiles, opaque login sessions, contact messages, innovations and rate-limit buckets. Additional product tables and workflows still need migrations before those APIs are implemented.

Schedule cleanup of expired sessions and rate-limit rows as operational traffic grows. Review retention and deletion policies for contact messages and personal data. Google sign-in will require OAuth provider configuration and a migration for provider identities if the implementation needs them.
