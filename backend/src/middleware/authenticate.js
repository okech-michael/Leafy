import { createHash } from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import { HttpError } from '../shared/errors.js'

export function authenticate() {
  return async (req, _res, next) => {
    const match = req.header('authorization')?.match(/^Bearer\s+([^\s]+)$/i)
    if (!match) return next(new HttpError(401, 'Authentication is required.'))
    try {
      const session = await prisma.session.findUnique({
        where: { accessTokenHash: createHash('sha256').update(match[1]).digest('hex') },
        include: { user: { include: { profile: true } } },
      })
      if (!session || session.expiresAt <= new Date()) return next(new HttpError(401, 'The access token is invalid or expired.'))
      if (!session.user.profile || session.user.profile.status !== 'active') return next(new HttpError(403, 'This account is not active.'))
      req.authUser = session.user
      req.authSessionId = session.id
      return next()
    } catch {
      return next(new HttpError(503, 'The account service is unavailable.'))
    }
  }
}
