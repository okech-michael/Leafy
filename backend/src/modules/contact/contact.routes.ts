import { Router } from 'express'
import type { SupabaseClient } from '@supabase/supabase-js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import { contactMessageSchema } from './contact.schemas.js'

export function createContactRouter(admin: SupabaseClient): Router {
  const router = Router()

  router.post(
    '/',
    databaseRateLimit(admin, { bucket: 'contact-submit', limit: 5, windowSeconds: 3600 }),
    async (req, res) => {
      const input = parseBody(contactMessageSchema, req.body)
      const { data, error } = await admin
        .from('contact_messages')
        .insert({
          name: input.name,
          email: input.email,
          topic: input.topic,
          message: input.message,
        })
        .select('id, name, email, topic, status, created_at')
        .single()

      if (error || !data) throw new HttpError(503, 'The contact service is unavailable.')

      res.status(201).json({
        message: 'Your message was received.',
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          topic: data.topic,
          status: data.status,
          createdAt: data.created_at,
        },
      })
    },
  )

  return router
}
