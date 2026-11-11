import { createHash } from 'node:crypto'
import type { RequestHandler } from 'express'
import type { SupabaseClient } from '@supabase/supabase-js'
import { HttpError } from '../shared/errors.js'

export function databaseRateLimit(
  admin: SupabaseClient,
  options: { bucket: string; limit: number; windowSeconds: number },
): RequestHandler {
  return async (req, res, next) => {
    const clientAddress = req.ip || req.socket.remoteAddress
    if (!clientAddress) {
      return next(new HttpError(503, 'Request rate limiting is unavailable.'))
    }

    const key = createHash('sha256')
      .update(`${options.bucket}:${clientAddress}`)
      .digest('hex')

    const { data, error } = await admin.rpc('consume_rate_limit', {
      p_key: key,
      p_window_seconds: options.windowSeconds,
      p_max_requests: options.limit,
    })

    if (error) {
      return next(new HttpError(503, 'Request rate limiting is unavailable.'))
    }
    if (data !== true) {
      res.setHeader('Retry-After', String(options.windowSeconds))
      return next(new HttpError(429, 'Too many requests. Please try again later.'))
    }

    return next()
  }
}
