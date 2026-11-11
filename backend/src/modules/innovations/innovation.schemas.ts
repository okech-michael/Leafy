import { z } from 'zod'

export const createInnovationSchema = z.object({
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().min(10).max(20000),
  agriculturalSector: z.string().trim().min(2).max(120),
  developmentStage: z.string().trim().min(2).max(80),
  supportNeeds: z.array(z.string().trim().min(1).max(80)).max(10).default([]),
  organisationId: z.uuid().optional(),
})

export const updateInnovationSchema = createInnovationSchema
  .omit({ organisationId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be provided.')

export const browseInnovationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
})

export const innovationIdSchema = z.object({
  innovationId: z.uuid(),
})
