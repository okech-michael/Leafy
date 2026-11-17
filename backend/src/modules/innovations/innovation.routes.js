import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { authenticate } from '../../middleware/authenticate.js'
import { databaseRateLimit } from '../../middleware/rateLimit.js'
import { HttpError } from '../../shared/errors.js'
import { parseBody } from '../../shared/validation.js'
import { browseInnovationsQuerySchema, createInnovationSchema, innovationIdSchema, updateInnovationSchema } from './innovation.schemas.js'

const fieldMap = {
  ownerId: 'owner_id', organisationId: 'organisation_id', agriculturalSector: 'agricultural_sector',
  developmentStage: 'development_stage', supportNeeds: 'support_needs', submittedAt: 'submitted_at',
  createdAt: 'created_at', updatedAt: 'updated_at',
}
function apiRow(row) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [fieldMap[key] ?? key, value]))
}

export function createInnovationRouter() {
  const router = Router()
  const requireUser = authenticate()

  router.get('/', databaseRateLimit({ bucket: 'innovations-read', limit: 60, windowSeconds: 60 }), async (req, res) => {
    const { limit, offset } = parseBody(browseInnovationsQuerySchema, req.query)
    const where = { status: 'published' }
    const [rows, count] = await Promise.all([
      prisma.innovation.findMany({ where, select: { id: true, title: true, summary: true, agriculturalSector: true, developmentStage: true, createdAt: true }, orderBy: { createdAt: 'desc' }, skip: offset, take: limit }),
      prisma.innovation.count({ where }),
    ])
    res.json({ data: rows.map(apiRow), pagination: { limit, offset, count } })
  })

  router.get('/mine', databaseRateLimit({ bucket: 'innovations-mine', limit: 60, windowSeconds: 60 }), requireUser, async (req, res) => {
    const rows = await prisma.innovation.findMany({ where: { ownerId: req.authUser.id }, select: { id: true, title: true, summary: true, agriculturalSector: true, developmentStage: true, status: true, submittedAt: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: 'desc' }, take: 50 })
    res.json({ data: rows.map(apiRow) })
  })

  router.post('/', databaseRateLimit({ bucket: 'innovations-create', limit: 10, windowSeconds: 3600 }), requireUser, async (req, res) => {
    const input = parseBody(createInnovationSchema, req.body)
    try {
      const row = await prisma.innovation.create({ data: {
        ownerId: req.authUser.id, organisationId: input.organisationId ?? null, title: input.title,
        summary: input.summary, description: input.description, agriculturalSector: input.agriculturalSector,
        developmentStage: input.developmentStage, supportNeeds: input.supportNeeds, status: 'draft',
      }, select: { id: true, title: true, summary: true, agriculturalSector: true, developmentStage: true, supportNeeds: true, status: true, createdAt: true } })
      res.status(201).json({ data: apiRow(row) })
    } catch { throw new HttpError(503, 'The innovation could not be saved.') }
  })

  router.patch('/:innovationId', databaseRateLimit({ bucket: 'innovations-update', limit: 30, windowSeconds: 3600 }), requireUser, async (req, res) => {
    const { innovationId } = parseBody(innovationIdSchema, req.params)
    const input = parseBody(updateInnovationSchema, req.body)
    const data = Object.fromEntries(Object.entries({
      title: input.title, summary: input.summary, description: input.description,
      agriculturalSector: input.agriculturalSector, developmentStage: input.developmentStage, supportNeeds: input.supportNeeds,
    }).filter(([, value]) => value !== undefined))
    const result = await prisma.innovation.updateMany({ where: { id: innovationId, ownerId: req.authUser.id, status: 'draft' }, data })
    if (!result.count) throw new HttpError(409, 'Only an owned draft innovation can be updated.')
    const row = await prisma.innovation.findUnique({ where: { id: innovationId }, select: { id: true, title: true, summary: true, description: true, agriculturalSector: true, developmentStage: true, supportNeeds: true, status: true, updatedAt: true } })
    res.json({ data: apiRow(row) })
  })

  router.post('/:innovationId/submit', databaseRateLimit({ bucket: 'innovations-submit', limit: 10, windowSeconds: 3600 }), requireUser, async (req, res) => {
    const { innovationId } = parseBody(innovationIdSchema, req.params)
    const result = await prisma.innovation.updateMany({ where: { id: innovationId, ownerId: req.authUser.id, status: 'draft' }, data: { status: 'submitted', submittedAt: new Date() } })
    if (!result.count) throw new HttpError(409, 'Only an owned draft innovation can be submitted.')
    const row = await prisma.innovation.findFirst({ where: { id: innovationId, ownerId: req.authUser.id }, select: { id: true, title: true, status: true, submittedAt: true, updatedAt: true } })
    if (!row) throw new HttpError(503, 'The submitted innovation could not be retrieved.')
    res.json({ data: apiRow(row) })
  })

  router.get('/:innovationId', databaseRateLimit({ bucket: 'innovations-read', limit: 60, windowSeconds: 60 }), async (req, res) => {
    const { innovationId } = parseBody(innovationIdSchema, req.params)
    const row = await prisma.innovation.findFirst({ where: { id: innovationId, status: 'published' }, select: { id: true, title: true, summary: true, description: true, agriculturalSector: true, developmentStage: true, supportNeeds: true, createdAt: true } })
    if (!row) throw new HttpError(404, 'The requested innovation was not found.')
    res.json({ data: apiRow(row) })
  })
  return router
}
