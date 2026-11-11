# Database and migrations

Migrations in `supabase/migrations/` target Supabase PostgreSQL and Supabase Auth/Storage. Apply them to a staging project first, inspect the resulting RLS policies and grants, then promote the same ordered migration to production.

The initial migration creates:

- Auth-linked profiles, a default least-privilege member role, role/permission assignments and organisation memberships.
- Organisation records and an agricultural innovation intake table.
- Private contact messages, user notifications, private file metadata, audit records and database-backed rate-limit buckets.
- Ownership and moderation RLS policies, a private Storage bucket, and a profile-creation trigger.

Role assignments and permission mappings are not writable by ordinary authenticated users. The `super_admin` role is seeded but no user is automatically given it. Assign privileged roles only through a verified administrative process.

## Operational requirements

- Back up production data and test restore procedures before migrations.
- Schedule `select public.prune_rate_limit_buckets();` at least daily using Supabase Cron or a trusted scheduled job; the function removes rate-limit rows older than one day.
- Review retention and deletion policies for contact messages, audit records, uploaded files and personal data.
- Restrict the Supabase service-role key to backend deployment secrets.
- Test RLS using anonymous, owner, other-user, organisation-member and administrator identities before enabling real data.

The initial migration is a platform foundation, not the complete business schema. Market inventory/orders/payments, Foods, Farms, Academy, Foundation applications/programmes and related workflows still need their own migrations and APIs before production use.
