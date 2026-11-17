import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import { contactMessageSchema } from './contact.schemas.js'

export function createContactRouter() {
  const router = Router()
  router.post('/', databaseRateLimit({ bucket: 'contact-submit', limit: 5, windowSeconds: 3600 }), async (req, res) => {
    const input = parseBody(contactMessageSchema, req.body)
    try {
      const data = await prisma.contactMessage.create({ data: input })
      res.status(201).json({ message: 'Your message was received.', data: {
        id: data.id, name: data.name, email: data.email, topic: data.topic, status: data.status, createdAt: data.createdAt,
      } })
    } catch {
      throw new HttpError(503, 'The contact service is unavailable.')
    }
  })
  return router
}
