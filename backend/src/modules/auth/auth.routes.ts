import type { CookieOptions, Request, Response } from 'express'
import { Router } from 'express'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { AppConfig } from '../../config/env.js'
import { authenticate } from '../../middleware/authenticate.js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { createAnonymousClient } from '../../lib/supabase.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import {
  loginSchema,
  passwordResetRequestSchema,
  passwordUpdateSchema,
  refreshSchema,
  registerSchema,
} from './auth.schemas.js'

const REFRESH_COOKIE = 'leafy_refresh_token'
const REFRESH_COOKIE_PATH = '/api/v1/auth'
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000

function cookieOptions(config: AppConfig): CookieOptions {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  }
}

function setRefreshCookie(res: Response, config: AppConfig, session: Session | null): void {
  if (session?.refresh_token) {
    res.cookie(REFRESH_COOKIE, session.refresh_token, cookieOptions(config))
  }
}

function clearRefreshCookie(res: Response, config: AppConfig): void {
  const { maxAge: _maxAge, ...options } = cookieOptions(config)
  res.clearCookie(REFRESH_COOKIE, options)
}

function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email ?? null,
    emailVerified: Boolean(user.email_confirmed_at),
    createdAt: user.created_at,
    metadata: {
      fullName: user.user_metadata.full_name ?? null,
      phone: user.user_metadata.phone ?? null,
    },
  }
}

function publicSession(session: Session | null) {
  if (!session) return null
  return {
    accessToken: session.access_token,
    tokenType: session.token_type,
    expiresAt: session.expires_at,
    expiresIn: session.expires_in,
  }
}

function sessionResponse(res: Response, config: AppConfig, user: User, session: Session | null): void {
  setRefreshCookie(res, config, session)
  res.status(200).json({
    data: { user: publicUser(user), session: publicSession(session) },
  })
}

function handleAuthFailure(error: unknown, fallback: string): never {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? Number(error.status)
    : undefined
  if (status === 429) throw new HttpError(429, 'Too many requests. Please try again later.')
  throw new HttpError(502, fallback)
}

export function createAuthRouter(config: AppConfig, admin: SupabaseClient): Router {
  const router = Router()
  const requireUser = authenticate(config)

  router.post(
    '/register',
    databaseRateLimit(admin, { bucket: 'auth-register', limit: 5, windowSeconds: 3600 }),
    async (req: Request, res: Response) => {
      const input = parseBody(registerSchema, req.body)
      const supabase = createAnonymousClient(config)
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { full_name: input.name, phone: input.phone },
          emailRedirectTo: `${config.appOrigin}/auth/verify`,
        },
      })
      if (error || !data.user) handleAuthFailure(error, 'Account registration could not be completed.')

      setRefreshCookie(res, config, data.session)
      res.status(202).json({
        message: 'If registration succeeded, check your email for the verification link.',
        data: { session: publicSession(data.session) },
      })
    },
  )

  router.post(
    '/login',
    databaseRateLimit(admin, { bucket: 'auth-login', limit: 5, windowSeconds: 900 }),
    async (req: Request, res: Response) => {
      const input = parseBody(loginSchema, req.body)
      const supabase = createAnonymousClient(config)
      const { data, error } = await supabase.auth.signInWithPassword(input)
      if (error || !data.user || !data.session) {
        if (error && 'status' in error && Number(error.status) === 429) {
          throw new HttpError(429, 'Too many requests. Please try again later.')
        }
        throw new HttpError(401, 'Invalid email or password.')
      }
      sessionResponse(res, config, data.user, data.session)
    },
  )

  router.post(
    '/refresh',
    databaseRateLimit(admin, { bucket: 'auth-refresh', limit: 30, windowSeconds: 900 }),
    async (req: Request, res: Response) => {
      const input = parseBody(refreshSchema, req.body)
      const refreshToken = req.cookies?.[REFRESH_COOKIE] ?? input?.refreshToken
      if (!refreshToken) throw new HttpError(401, 'A refresh token is required.')

      const supabase = createAnonymousClient(config)
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
      if (error || !data.user || !data.session) {
        clearRefreshCookie(res, config)
        throw new HttpError(401, 'The refresh token is invalid or expired.')
      }
      sessionResponse(res, config, data.user, data.session)
    },
  )

  router.post(
    '/password-reset',
    databaseRateLimit(admin, { bucket: 'auth-password-reset', limit: 5, windowSeconds: 3600 }),
    async (req: Request, res: Response) => {
      const input = parseBody(passwordResetRequestSchema, req.body)
      const supabase = createAnonymousClient(config)
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${config.appOrigin}/auth/reset`,
      })
      if (error) handleAuthFailure(error, 'Password recovery could not be requested.')
      res.status(202).json({ message: 'If the account exists, password recovery instructions will be sent.' })
    },
  )

  router.post('/password', requireUser, async (req: Request, res: Response) => {
    const input = parseBody(passwordUpdateSchema, req.body)
    if (!req.authUser) throw new HttpError(401, 'Authentication is required.')
    const { error } = await admin.auth.admin.updateUserById(req.authUser.id, { password: input.password })
    if (error) handleAuthFailure(error, 'Password could not be updated.')
    res.status(204).end()
  })

  router.post('/logout', requireUser, async (req: Request, res: Response) => {
    const accessToken = req.header('authorization')?.replace(/^Bearer\s+/i, '')
    if (!accessToken) throw new HttpError(401, 'Authentication is required.')
    const { error } = await admin.auth.admin.signOut(accessToken, 'local')
    clearRefreshCookie(res, config)
    if (error) handleAuthFailure(error, 'The session could not be revoked.')
    res.status(204).end()
  })

  router.get('/me', requireUser, async (req: Request, res: Response) => {
    const user = req.authUser
    if (!user || !req.userSupabase) throw new HttpError(401, 'Authentication is required.')
    const { data: profile, error } = await req.userSupabase
      .from('profiles')
      .select('id, full_name, phone, status, created_at')
      .eq('id', user.id)
      .maybeSingle()
    if (error) throw new HttpError(503, 'The profile service is unavailable.')

    res.json({
      data: {
        user: publicUser(user),
        profile,
      },
    })
  })

  return router
}
