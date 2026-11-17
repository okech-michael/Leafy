import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { authenticate } from '../../middleware/authenticate.js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import { googleAuthSchema, loginSchema, passwordResetRequestSchema, passwordUpdateSchema, refreshSchema, registerSchema } from './auth.schemas.js'

const scrypt = promisify(scryptCallback)
const REFRESH_COOKIE = 'leafy_refresh_token'
const REFRESH_COOKIE_PATH = '/api/v1/auth'
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const ACCESS_TTL_MS = 60 * 60 * 1000

function cookieOptions(config) {
  const production = config.nodeEnv === 'production'
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? 'none' : 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  }
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex')
}

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
    metadata: {
      fullName: user.profile?.fullName ?? null,
      phone: user.profile?.phone ?? null,
      avatarUrl: user.profile?.avatarUrl ?? null,
    },
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
  const session = await prisma.session.create({
    data: {
      userId,
      accessTokenHash: hash(accessToken),
      refreshTokenHash: hash(refreshToken),
      expiresAt,
      refreshExpiresAt,
    },
  })
  return { session, accessToken, refreshToken }
}

async function sendSession(res, config, user) {
  const result = await makeSession(user.id)
  res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions(config))
  return res.status(200).json({
    data: {
      user: publicUser(user),
      session: {
        accessToken: result.accessToken,
        tokenType: 'bearer',
        expiresAt: Math.floor(result.session.expiresAt.getTime() / 1000),
        expiresIn: ACCESS_TTL_MS / 1000,
      },
    },
  })
}

async function findOrCreateGoogleUser({ sub, email, name, picture }) {
  const normalizedEmail = email.toLowerCase().trim()
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: sub },
        { email: normalizedEmail },
      ],
    },
    include: { profile: true },
  })

  if (user) {
    if (user.profile && user.profile.status !== 'active') {
      throw new HttpError(403, 'This account is not active.')
    }

    const dataToUpdate = {}
    if (!user.googleId) dataToUpdate.googleId = sub
    if (!user.emailVerifiedAt) dataToUpdate.emailVerifiedAt = new Date()

    const profileUpdate = {}
    if (picture && !user.profile?.avatarUrl) profileUpdate.avatarUrl = picture
    if (name && (!user.profile?.fullName || user.profile.fullName === user.email.split('@')[0])) {
      profileUpdate.fullName = name.trim()
    }

    if (Object.keys(profileUpdate).length > 0) {
      dataToUpdate.profile = { update: profileUpdate }
    }

    if (Object.keys(dataToUpdate).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: dataToUpdate,
        include: { profile: true },
      })
    }
    return user
  }

  user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      googleId: sub,
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          fullName: name?.trim() || normalizedEmail.split('@')[0],
          avatarUrl: picture ?? null,
          status: 'active',
        },
      },
    },
    include: { profile: true },
  })
  return user
}

export function createAuthRouter(config) {
  const router = Router()
  const requireUser = authenticate()

  router.post('/register', databaseRateLimit({ bucket: 'auth-register', limit: 5, windowSeconds: 3600 }), async (req, res) => {
    const input = parseBody(registerSchema, req.body)
    try {
      await prisma.user.create({
        data: {
          email: input.email,
          passwordHash: await hashPassword(input.password),
          emailVerifiedAt: new Date(),
          profile: { create: { fullName: input.name, phone: input.phone } },
        },
      })
    } catch (error) {
      if (error?.code === 'P2002') throw new HttpError(502, 'Account registration could not be completed.')
      throw error
    }
    res.status(202).json({ message: 'Registration succeeded. You can now sign in.', data: { session: null } })
  })

  router.post('/login', databaseRateLimit({ bucket: 'auth-login', limit: 5, windowSeconds: 900 }), async (req, res) => {
    const input = parseBody(loginSchema, req.body)
    const user = await prisma.user.findUnique({ where: { email: input.email }, include: { profile: true } })
    if (!user?.passwordHash || !await verifyPassword(input.password, user.passwordHash)) {
      throw new HttpError(401, 'Invalid email or password.')
    }
    if (user.profile?.status !== 'active') throw new HttpError(403, 'This account is not active.')
    await sendSession(res, config, user)
  })

  router.post('/refresh', databaseRateLimit({ bucket: 'auth-refresh', limit: 30, windowSeconds: 900 }), async (req, res) => {
    const input = parseBody(refreshSchema, req.body)
    const token = req.cookies?.[REFRESH_COOKIE] ?? input?.refreshToken
    if (!token) throw new HttpError(401, 'A refresh token is required.')
    const existing = await prisma.session.findUnique({
      where: { refreshTokenHash: hash(token) },
      include: { user: { include: { profile: true } } },
    })
    if (!existing || existing.refreshExpiresAt <= new Date()) {
      clearRefreshCookie(res, config)
      throw new HttpError(401, 'The refresh token is invalid or expired.')
    }
    await prisma.session.delete({ where: { id: existing.id } })
    await sendSession(res, config, existing.user)
  })

  // Google OAuth - start redirect flow
  router.get('/google', (req, res) => {
    if (!config.googleClientId) {
      const errorMsg = 'Google authentication is not configured on the backend. Please set GOOGLE_CLIENT_ID in backend/.env'
      return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent(errorMsg)}`)
    }

    const returnTo = typeof req.query.returnTo === 'string' && req.query.returnTo.startsWith('/') && !req.query.returnTo.startsWith('//')
      ? req.query.returnTo
      : '/dashboard'

    const statePayload = JSON.stringify({
      nonce: randomBytes(16).toString('hex'),
      returnTo,
    })
    const state = Buffer.from(statePayload).toString('base64url')

    const isProduction = config.nodeEnv === 'production'
    res.cookie('leafy_oauth_state', state, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: REFRESH_COOKIE_PATH,
      maxAge: 10 * 60 * 1000,
    })

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', config.googleClientId)
    googleAuthUrl.searchParams.set('redirect_uri', config.googleCallbackUrl)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'openid email profile')
    googleAuthUrl.searchParams.set('state', state)
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'select_account')

    res.redirect(googleAuthUrl.toString())
  })

  // Google OAuth - callback handler
  router.get('/google/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query
    const storedState = req.cookies?.leafy_oauth_state

    const isProduction = config.nodeEnv === 'production'
    res.clearCookie('leafy_oauth_state', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: REFRESH_COOKIE_PATH,
    })

    let returnTo = '/dashboard'
    try {
      if (typeof state === 'string') {
        const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'))
        if (decoded?.returnTo && decoded.returnTo.startsWith('/') && !decoded.returnTo.startsWith('//')) {
          returnTo = decoded.returnTo
        }
      }
    } catch {
      // Ignore state parse failures
    }

    if (error) {
      const msg = typeof error_description === 'string' ? error_description : String(error)
      return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent(msg)}`)
    }

    if (!code || typeof code !== 'string') {
      return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent('Authorization code missing from Google.')}`)
    }

    if (!storedState || storedState !== state) {
      return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent('Invalid OAuth state. Please try again.')}`)
    }

    try {
      if (!config.googleClientId || !config.googleClientSecret) {
        throw new Error('Google OAuth credentials not configured on backend.')
      }

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.googleClientId,
          client_secret: config.googleClientSecret,
          redirect_uri: config.googleCallbackUrl,
          grant_type: 'authorization_code',
        }),
      })

      if (!tokenRes.ok) {
        const tokenErr = await tokenRes.text()
        req.log?.error({ err: tokenErr }, 'Google token exchange failed')
        return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent('Failed to exchange authorization code with Google.')}`)
      }

      const tokenData = await tokenRes.json()

      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })

      if (!userInfoRes.ok) {
        return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent('Failed to fetch user profile from Google.')}`)
      }

      const profileData = await userInfoRes.json()
      if (!profileData.sub || !profileData.email) {
        return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent('Incomplete profile received from Google.')}`)
      }

      const user = await findOrCreateGoogleUser({
        sub: profileData.sub,
        email: profileData.email,
        name: profileData.name,
        picture: profileData.picture,
      })

      const sessionResult = await makeSession(user.id)
      res.cookie(REFRESH_COOKIE, sessionResult.refreshToken, cookieOptions(config))

      return res.redirect(`${config.appOrigin}/auth/callback?token=${encodeURIComponent(sessionResult.accessToken)}&returnTo=${encodeURIComponent(returnTo)}`)
    } catch (err) {
      const msg = err instanceof HttpError ? err.message : 'Google authentication failed.'
      return res.redirect(`${config.appOrigin}/auth/login?error=${encodeURIComponent(msg)}`)
    }
  })

  // Google OAuth - POST token / credential handler
  router.post('/google', databaseRateLimit({ bucket: 'auth-google', limit: 10, windowSeconds: 900 }), async (req, res) => {
    const input = parseBody(googleAuthSchema, req.body)

    let sub, email, name, picture

    if (input.credential) {
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(input.credential)}`)
      if (!verifyRes.ok) {
        throw new HttpError(401, 'Invalid Google credential token.')
      }
      const tokenInfo = await verifyRes.json()

      if (config.googleClientId && tokenInfo.aud !== config.googleClientId) {
        throw new HttpError(401, 'Google credential token audience mismatch.')
      }

      sub = tokenInfo.sub
      email = tokenInfo.email
      name = tokenInfo.name
      picture = tokenInfo.picture
    } else if (input.code) {
      if (!config.googleClientId || !config.googleClientSecret) {
        throw new HttpError(500, 'Google OAuth credentials not configured on backend.')
      }
      const redirectUri = input.redirectUri || 'postmessage'
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: input.code,
          client_id: config.googleClientId,
          client_secret: config.googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      })

      if (!tokenRes.ok) {
        throw new HttpError(401, 'Failed to exchange authorization code with Google.')
      }
      const tokenData = await tokenRes.json()

      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      if (!userInfoRes.ok) throw new HttpError(401, 'Failed to fetch user profile from Google.')
      const profileData = await userInfoRes.json()

      sub = profileData.sub
      email = profileData.email
      name = profileData.name
      picture = profileData.picture
    }

    if (!sub || !email) {
      throw new HttpError(400, 'Incomplete profile returned from Google.')
    }

    const user = await findOrCreateGoogleUser({ sub, email, name, picture })
    await sendSession(res, config, user)
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
    const profile = await prisma.profile.findUnique({
      where: { id: req.authUser.id },
      select: { id: true, fullName: true, phone: true, avatarUrl: true, status: true, createdAt: true },
    })
    res.json({
      data: {
        user: publicUser({ ...req.authUser, profile }),
        profile: profile && {
          id: profile.id,
          full_name: profile.fullName,
          phone: profile.phone,
          avatar_url: profile.avatarUrl,
          status: profile.status,
          created_at: profile.createdAt,
        },
      },
    })
  })

  return router
}
