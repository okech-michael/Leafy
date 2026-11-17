# Local and Vercel deployment

## Local API

1. Use Node.js `>=22.12.0` and PostgreSQL.
2. From `backend/`, install dependencies and copy `.env.example` to `.env`.
3. Set `DATABASE_URL` for the target PostgreSQL database.
4. Run `npm run db:dev` to create/update the local schema.
5. Run `npm run dev`; the API listens on port `5000` by default.
6. Check `/api/v1/health/live` and `/api/v1/health/ready`.

## Vercel

Create a separate Vercel project with `backend/` as its root directory. Configure environment values in Vercel's encrypted project settings; do not upload `.env`. Use separate databases for preview/staging and production. Apply committed migrations with `npm run db:migrate` as part of release operations.

## Configuration

Required:

- `DATABASE_URL`

Optional:

- `NODE_ENV` (`development`, `test`, `production`)
- `PORT`
- `LOG_LEVEL`
- `APP_ORIGIN`
- `CORS_ALLOWED_ORIGINS`
- `TRUST_PROXY_HOPS`

Production requires HTTPS origins, an allowlist that includes `APP_ORIGIN`, and the correct trusted proxy hop count. Daraja and communications variables are listed in `.env.example` for planning, but those integrations are not enabled.
