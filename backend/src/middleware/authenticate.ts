import type { RequestHandler } from 'express'
import type { AppConfig } from '../config/env.js'
import { createUserClient } from '../lib/supabase.js'
import { HttpError } from '../shared/errors.js'

export function authenticate(config: AppConfig): RequestHandler {
  return async (req, _res, next) => {
    const authorization = req.header('authorization')
    const match = authorization?.match(/^Bearer\s+([^\s]+)$/i)
    if (!match) {
      return next(new HttpError(401, 'Authentication is required.'))
    }

    const userSupabase = createUserClient(config, match[1])
    const { data, error } = await userSupabase.auth.getUser(match[1])
    if (error || !data.user) {
      return next(new HttpError(401, 'The access token is invalid or expired.'))
    }

    const { data: profile, error: profileError } = await userSupabase
      .from('profiles')
      .select('status')
      .eq('id', data.user.id)
      .maybeSingle()
    if (profileError) {
      return next(new HttpError(503, 'The account service is unavailable.'))
    }
    if (!profile || profile.status !== 'active') {
      return next(new HttpError(403, 'This account is not active.'))
    }

    req.authUser = data.user
    req.userSupabase = userSupabase
    return next()
  }
}
