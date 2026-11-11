import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express, { type ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import pino from 'pino'
import { pinoHttp } from 'pino-http'
import { loadConfig } from './config/env.js'
import { createAdminClient } from './lib/supabase.js'
import { createAuthRouter } from './modules/auth/auth.routes.js'
import { createContactRouter } from './modules/contact/contact.routes.js'
import { createInnovationRouter } from './modules/innovations/innovation.routes.js'
import { HttpError } from './shared/errors.js'

const config = loadConfig()
const admin = createAdminClient(config)
const logger = pino({
  level: config.logLevel,
  redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
})
const app = express()

app.set('trust proxy', config.trustProxyHops)
app.disable('x-powered-by')
app.use(pinoHttp({ logger }))
app.use(helmet())
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || config.corsAllowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new HttpError(403, 'This origin is not allowed.'))
  },
}))
app.use(express.json({ limit: '100kb', type: 'application/json' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
app.use(cookieParser())

app.get('/api/v1/health/live', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/v1/health/ready', async (_req, res, next) => {
  const { error } = await admin.from('profiles').select('id').limit(1)
  if (error) {
    next(new HttpError(503, 'The database is not ready.'))
    return
  }
  res.json({ status: 'ready' })
})

app.use('/api/v1/auth', createAuthRouter(config, admin))
app.use('/api/v1/contact', createContactRouter(admin))
app.use('/api/v1/innovations', createInnovationRouter(config, admin))

app.use((_req, _res, next) => {
  next(new HttpError(404, 'The requested endpoint was not found.'))
})

const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  const knownError = error instanceof HttpError
  const bodyError = typeof error === 'object' && error !== null && 'type' in error
    ? String(error.type)
    : ''
  const statusCode = knownError
    ? error.statusCode
    : bodyError === 'entity.parse.failed'
      ? 400
      : bodyError === 'entity.too.large'
        ? 413
        : 500
  const message = knownError
    ? error.message
    : bodyError === 'entity.parse.failed'
      ? 'Request body is not valid JSON.'
      : bodyError === 'entity.too.large'
        ? 'Request body exceeds the allowed size.'
        : 'An unexpected server error occurred.'
  if (statusCode >= 500) {
    req.log.error({ errorType: error instanceof Error ? error.name : 'UnknownError' }, 'API request failed')
  }

  res.status(statusCode).json({
    error: {
      code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : `HTTP_${statusCode}`,
      message,
      ...(knownError && error.details !== undefined ? { details: error.details } : {}),
    },
    requestId: req.id,
  })
}

app.use(errorHandler)

export default app
