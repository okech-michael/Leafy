import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { authenticate } from '../../middleware/authenticate.js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import { loginSchema, passwordResetRequestSchema, passwordUpdateSchema, refreshSchema, registerSchema } from './auth.schemas.js'

const scrypt = promisify(scryptCallback)
const REFRESH_COOKIE = 'leafy_refresh_token'
const REFRESH_COOKIE_PATH = '/api/v1/auth'
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const ACCESS_TTL_MS = 60 * 60 * 1000

function cookieOptions(config) {
  return { httpOnly: true, secure: config.nodeEnv === 'production', sameSite: 'lax', path: REFRESH_COOKIE_PATH, maxAge: REFRESH_COOKIE_MAX_AGE }
}
function hash(value) { return createHash('sha256').update(value).digest('hex') }
async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const key = await scrypt(password, salt, 64)
  return `${salt}:${key.toString('hex')}`
}
async function verifyPassword(password, stored) {
  const [salt, key] = stored.split(':')
  const candidate = await scrypt(password, salt, 64)
  const expected = Buffer.from(key, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}
function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt),
    createdAt: user.createdAt,
    metadata: { fullName: user.profile?.fullName ?? null, phone: user.profile?.phone ?? null },
  }
}
function clearRefreshCookie(res, config) {
  const { maxAge: _maxAge, ...options } = cookieOptions(config)
  res.clearCookie(REFRESH_COOKIE, options)
}
async function makeSession(userId) {
  const accessToken = randomBytes(32).toString('base64url')
  const refreshToken = randomBytes(48).toString('base64url')
  const expiresAt = new Date(Date.now() + ACCESS_TTL_MS)
  const refreshExpiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE)
  const session = await prisma.session.create({ data: {
    userId, accessTokenHash: hash(accessToken), refreshTokenHash: hash(refreshToken), expiresAt, refreshExpiresAt,
  } })
  return { session, accessToken, refreshToken }
}
async function sendSession(res, config, user) {
  const result = await makeSession(user.id)
  res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions(config))
  return res.status(200).json({ data: {
    user: publicUser(user),
    session: { accessToken: result.accessToken, tokenType: 'bearer', expiresAt: Math.floor(result.session.expiresAt.getTime() / 1000), expiresIn: ACCESS_TTL_MS / 1000 },
  } })
}

export function createAuthRouter(config) {
  const router = Router()
  const requireUser = authenticate()

  router.post('/register', databaseRateLimit({ bucket: 'auth-register', limit: 5, windowSeconds: 3600 }), async (req, res) => {
    const input = parseBody(registerSchema, req.body)
    try {
      await prisma.user.create({ data: {
        email: input.email,
        passwordHash: await hashPassword(input.password),
        emailVerifiedAt: new Date(),
        profile: { create: { fullName: input.name, phone: input.phone } },
      } })
    } catch (error) {
      if (error?.code === 'P2002') throw new HttpError(502, 'Account registration could not be completed.')
      throw error
    }
    res.status(202).json({ message: 'Registration succeeded. You can now sign in.', data: { session: null } })
  })

  router.post('/login', databaseRateLimit({ bucket: 'auth-login', limit: 5, windowSeconds: 900 }), async (req, res) => {
    const input = parseBody(loginSchema, req.body)
    const user = await prisma.user.findUnique({ where: { email: input.email }, include: { profile: true } })
    if (!user?.passwordHash || !await verifyPassword(input.password, user.passwordHash)) throw new HttpError(401, 'Invalid email or password.')
    if (user.profile?.status !== 'active') throw new HttpError(403, 'This account is not active.')
    await sendSession(res, config, user)
  })

  router.post('/refresh', databaseRateLimit({ bucket: 'auth-refresh', limit: 30, windowSeconds: 900 }), async (req, res) => {
    const input = parseBody(refreshSchema, req.body)
    const token = req.cookies?.[REFRESH_COOKIE] ?? input?.refreshToken
    if (!token) throw new HttpError(401, 'A refresh token is required.')
    const existing = await prisma.session.findUnique({ where: { refreshTokenHash: hash(token) }, include: { user: { include: { profile: true } } } })
    if (!existing || existing.refreshExpiresAt <= new Date()) {
      clearRefreshCookie(res, config)
      throw new HttpError(401, 'The refresh token is invalid or expired.')
    }
    await prisma.session.delete({ where: { id: existing.id } })
    await sendSession(res, config, existing.user)
  })

  router.post('/password-reset', databaseRateLimit({ bucket: 'auth-password-reset', limit: 5, windowSeconds: 3600 }), async (req, res) => {
    parseBody(passwordResetRequestSchema, req.body)
    res.status(202).json({ message: 'If the account exists, password recovery instructions will be sent.' })
  })

  router.post('/password', requireUser, async (req, res) => {
    const input = parseBody(passwordUpdateSchema, req.body)
    await prisma.user.update({ where: { id: req.authUser.id }, data: { passwordHash: await hashPassword(input.password) } })
    res.status(204).end()
  })

  router.post('/logout', requireUser, async (req, res) => {
    await prisma.session.delete({ where: { id: req.authSessionId } })
    clearRefreshCookie(res, config)
    res.status(204).end()
  })

  router.get('/me', requireUser, async (req, res) => {
    const profile = await prisma.profile.findUnique({ where: { id: req.authUser.id }, select: { id: true, fullName: true, phone: true, status: true, createdAt: true } })
    res.json({ data: { user: publicUser({ ...req.authUser, profile }), profile: profile && {
      id: profile.id, full_name: profile.fullName, phone: profile.phone, status: profile.status, created_at: profile.createdAt,
    } } })
  })

  return router
}
