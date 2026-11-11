import { Router } from 'express'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppConfig } from '../../config/env.js'
import { createAnonymousClient } from '../../lib/supabase.js'
import { authenticate } from '../../middleware/authenticate.js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import {
  browseInnovationsQuerySchema,
  createInnovationSchema,
  innovationIdSchema,
  updateInnovationSchema,
} from './innovation.schemas.js'

export function createInnovationRouter(config: AppConfig, admin: SupabaseClient): Router {
  const router = Router()
  const requireUser = authenticate(config)

  router.get('/', databaseRateLimit(admin, { bucket: 'innovations-read', limit: 60, windowSeconds: 60 }), async (req, res) => {
    const { limit, offset } = parseBody(browseInnovationsQuerySchema, req.query)

    const { data, error, count } = await createAnonymousClient(config)
      .from('innovations')
      .select('id, title, summary, agricultural_sector, development_stage, created_at', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw new HttpError(503, 'The innovation catalogue is unavailable.')
    res.json({ data, pagination: { limit, offset, count: count ?? 0 } })
  })

  router.get('/mine', databaseRateLimit(admin, { bucket: 'innovations-mine', limit: 60, windowSeconds: 60 }), requireUser, async (req, res) => {
    if (!req.authUser || !req.userSupabase) throw new HttpError(401, 'Authentication is required.')
    const { data, error } = await req.userSupabase
      .from('innovations')
      .select('id, title, summary, agricultural_sector, development_stage, status, submitted_at, created_at, updated_at')
      .eq('owner_id', req.authUser.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw new HttpError(503, 'Your innovation records are unavailable.')
    res.json({ data })
  })

  router.post('/', databaseRateLimit(admin, { bucket: 'innovations-create', limit: 10, windowSeconds: 3600 }), requireUser, async (req, res) => {
    if (!req.authUser || !req.userSupabase) throw new HttpError(401, 'Authentication is required.')
    const input = parseBody(createInnovationSchema, req.body)
    const { data, error } = await req.userSupabase
      .from('innovations')
      .insert({
        owner_id: req.authUser.id,
        organisation_id: input.organisationId ?? null,
        title: input.title,
        summary: input.summary,
        description: input.description,
        agricultural_sector: input.agriculturalSector,
        development_stage: input.developmentStage,
        support_needs: input.supportNeeds,
        status: 'draft',
      })
      .select('id, title, summary, agricultural_sector, development_stage, support_needs, status, created_at')
      .single()

    if (error || !data) throw new HttpError(503, 'The innovation could not be saved.')
    res.status(201).json({ data })
  })

  router.patch('/:innovationId', databaseRateLimit(admin, { bucket: 'innovations-update', limit: 30, windowSeconds: 3600 }), requireUser, async (req, res) => {
    if (!req.userSupabase) throw new HttpError(401, 'Authentication is required.')
    const { innovationId } = parseBody(innovationIdSchema, req.params)
    const input = parseBody(updateInnovationSchema, req.body)
    const updates = {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.summary !== undefined ? { summary: input.summary } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.agriculturalSector !== undefined ? { agricultural_sector: input.agriculturalSector } : {}),
      ...(input.developmentStage !== undefined ? { development_stage: input.developmentStage } : {}),
      ...(input.supportNeeds !== undefined ? { support_needs: input.supportNeeds } : {}),
    }

    const { data, error } = await req.userSupabase
      .from('innovations')
      .update(updates)
      .eq('id', innovationId)
      .select('id, title, summary, description, agricultural_sector, development_stage, support_needs, status, updated_at')
      .maybeSingle()

    if (error) throw new HttpError(503, 'The innovation could not be updated.')
    if (!data) throw new HttpError(409, 'Only an owned draft innovation can be updated.')
    res.json({ data })
  })

  router.post('/:innovationId/submit', databaseRateLimit(admin, { bucket: 'innovations-submit', limit: 10, windowSeconds: 3600 }), requireUser, async (req, res) => {
    if (!req.authUser || !req.userSupabase) throw new HttpError(401, 'Authentication is required.')
    const { innovationId } = parseBody(innovationIdSchema, req.params)
    const { data: submitted, error: submitError } = await req.userSupabase
      .rpc('submit_innovation', { p_innovation_id: innovationId })

    if (submitError) throw new HttpError(503, 'The innovation could not be submitted.')
    if (submitted !== true) throw new HttpError(409, 'Only an owned draft innovation can be submitted.')

    const { data, error } = await req.userSupabase
      .from('innovations')
      .select('id, title, status, submitted_at, updated_at')
      .eq('id', innovationId)
      .eq('owner_id', req.authUser.id)
      .maybeSingle()
    if (error || !data) throw new HttpError(503, 'The submitted innovation could not be retrieved.')
    res.json({ data })
  })

  router.get('/:innovationId', databaseRateLimit(admin, { bucket: 'innovations-read', limit: 60, windowSeconds: 60 }), async (req, res) => {
    const { innovationId } = parseBody(innovationIdSchema, req.params)
    const { data, error } = await createAnonymousClient(config)
      .from('innovations')
      .select('id, title, summary, description, agricultural_sector, development_stage, support_needs, created_at')
      .eq('id', innovationId)
      .eq('status', 'published')
      .maybeSingle()

    if (error) throw new HttpError(503, 'The innovation catalogue is unavailable.')
    if (!data) throw new HttpError(404, 'The requested innovation was not found.')
    res.json({ data })
  })

  return router
}
