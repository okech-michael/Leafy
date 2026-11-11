import { z } from 'zod'

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  topic: z.enum([
    'General question',
    'Volunteering',
    'Partnership',
    'Community initiative',
    'Story consent',
  ]),
  message: z.string().trim().min(1).max(5000),
})
