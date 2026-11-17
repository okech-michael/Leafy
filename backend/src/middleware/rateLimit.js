import { createHash } from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import { HttpError } from '../shared/errors.js'

export function databaseRateLimit(options) {
  return async (req, res, next) => {
    const address = req.ip || req.socket.remoteAddress
    if (!address) return next(new HttpError(503, 'Request rate limiting is unavailable.'))
    const key = createHash('sha256').update(`${options.bucket}:${address}`).digest('hex')
    try {
      const allowed = await prisma.$transaction(async (tx) => {
        const now = new Date()
        const row = await tx.rateLimitBucket.upsert({
          where: { bucketKey: key },
          create: { bucketKey: key, windowStartedAt: now, requestCount: 1 },
          update: { requestCount: { increment: 1 } },
        })
        if (now - row.windowStartedAt >= options.windowSeconds * 1000) {
          await tx.rateLimitBucket.update({ where: { bucketKey: key }, data: { windowStartedAt: now, requestCount: 1 } })
          return true
        }
        return row.requestCount <= options.limit
      })
      if (!allowed) {
        res.setHeader('Retry-After', String(options.windowSeconds))
        return next(new HttpError(429, 'Too many requests. Please try again later.'))
      }
      return next()
    } catch {
      return next(new HttpError(503, 'Request rate limiting is unavailable.'))
    }
  }
}
