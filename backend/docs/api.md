# API contract (v1)

Base path: `/api/v1`

Successful responses use a `data` field where applicable. Errors use:

```json
{
  "error": {
    "code": "HTTP_400",
    "message": "Request validation failed.",
    "details": [{ "field": "email", "message": "Invalid email address" }]
  },
  "requestId": "request-id"
}
```

## Health

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health/live` | Public | Process liveness; does not imply database readiness. |
| GET | `/health/ready` | Public | Checks that Supabase can query the profile table. |

## Authentication

| Method | Path | Access | Request | Result |
|---|---|---|---|---|
| POST | `/auth/register` | Public, rate-limited | `{ "name", "email", "phone", "password", "confirmPassword" }` | `202`; user and optional access-token session; verification email handled by Supabase Auth. |
| POST | `/auth/login` | Public, rate-limited | `{ "email", "password" }` | `200`; user and access token. Refresh token is an HTTP-only cookie. |
| POST | `/auth/refresh` | Refresh cookie, rate-limited | No body required. A refresh-token body is accepted for non-cookie clients. | `200`; rotated access token and refresh cookie. |
| POST | `/auth/password-reset` | Public, rate-limited | `{ "email" }` | `202`; non-enumerating recovery response. |
| POST | `/auth/password` | Bearer token | `{ "password" }` | `204`; changes the current user's password. |
| POST | `/auth/logout` | Bearer token | No body | `204`; revokes the current Supabase session and clears the refresh cookie. |
| GET | `/auth/me` | Bearer token | No body | `200`; authenticated user and RLS-scoped profile. |

Use the returned `accessToken` in `Authorization: Bearer <token>`. Browser requests involving the refresh cookie must set `credentials: "include"` and use the same trusted site. Do not store the refresh token in local storage.

## Contact

| Method | Path | Access | Request | Result |
|---|---|---|---|---|
| POST | `/contact` | Public, rate-limited | `{ "name", "email", "topic", "message" }` | `201`; persisted message metadata. |

Allowed topics are `General question`, `Volunteering`, `Partnership`, `Community initiative`, and `Story consent`. No API to read or manage contact messages is exposed yet.

## Innovation intake

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/innovations?limit=20&offset=0` | Public, rate-limited | List published innovations only; limit is 1–50. |
| GET | `/innovations/:innovationId` | Public, rate-limited | Read one published innovation. |
| GET | `/innovations/mine` | Active account, rate-limited | List the caller's own records. |
| POST | `/innovations` | Active account, rate-limited | Create a draft owned by the caller. |
| PATCH | `/innovations/:innovationId` | Active account, rate-limited | Update fields on an owned draft; RLS enforces ownership/status. |
| POST | `/innovations/:innovationId/submit` | Active account, rate-limited | Transition an owned draft to submitted via a guarded database function. |

Submission does not publish an innovation. Review, moderation, partner matching, document upload and status-notification workflows are not implemented.

## Not yet implemented

No `/farms`, `/foods`, `/academy`, `/market`, `/orders`, `/payments`, `/foundation`, innovation moderation, `/files`, `/notifications`, `/admin`, email, SMS or Daraja routes are available yet. Their expected phases and prerequisites are listed in the backend README. Unknown paths return `404`.
