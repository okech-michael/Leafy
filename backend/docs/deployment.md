# Local and Vercel deployment

## Local API

1. Use Node.js `>=22.12.0`.
2. From `backend/`, install dependencies and copy `.env.example` to `.env`.
3. Configure the Supabase URL, anonymous key and service-role key in the untracked `.env`.
4. Apply the ordered SQL migration to a Supabase project.
5. Run `npm run dev`. The API listens on port `5000` by default.
6. Check `GET http://localhost:5000/api/v1/health/live` and `/api/v1/health/ready`.

## Vercel

Create a separate Vercel project with `backend/` as its root directory. Configure all environment values in Vercel's encrypted project settings; do not upload `.env`. Use separate Supabase projects and credentials for preview/staging and production. Configure the frontend origin list exactly and set `TRUST_PROXY_HOPS=1` for the Vercel deployment.

The frontend project is independent and continues to use the root `vercel.json`. This backend project has its own Vercel function entry and configuration.

## Configuration

Required at startup:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `NODE_ENV` (`development`, `test`, `production`)
- `PORT`
- `LOG_LEVEL`

Required for production:

- `APP_ORIGIN` (HTTPS origin only; no path)
- `CORS_ALLOWED_ORIGINS` (comma-separated exact HTTPS origins; must include `APP_ORIGIN`)
- `TRUST_PROXY_HOPS` (set to the trusted proxy hop count for the deployment)

Daraja and communications variables are listed in `.env.example` for planning, but those integrations are not enabled by this implementation.
