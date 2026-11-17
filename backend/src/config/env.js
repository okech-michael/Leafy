import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z.url(),
  APP_ORIGIN: z.url().optional(),
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
}).superRefine((config, context) => {
  if (config.NODE_ENV === 'production') {
    if (!config.APP_ORIGIN) context.addIssue({ code: 'custom', path: ['APP_ORIGIN'], message: 'Required in production.' })
    else if (new URL(config.APP_ORIGIN).protocol !== 'https:') context.addIssue({ code: 'custom', path: ['APP_ORIGIN'], message: 'Must use HTTPS in production.' })
    if (!config.CORS_ALLOWED_ORIGINS?.trim()) context.addIssue({ code: 'custom', path: ['CORS_ALLOWED_ORIGINS'], message: 'Required in production.' })
    if (config.TRUST_PROXY_HOPS < 1) context.addIssue({ code: 'custom', path: ['TRUST_PROXY_HOPS'], message: 'Set this to the trusted Vercel proxy hop count.' })
  }
  if (config.APP_ORIGIN && new URL(config.APP_ORIGIN).origin !== config.APP_ORIGIN) {
    context.addIssue({ code: 'custom', path: ['APP_ORIGIN'], message: 'Must be an origin without a path or query.' })
  }
  const origins = config.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []
  const normalized = new Set()
  origins.forEach((origin, index) => {
    try {
      const parsed = new URL(origin)
      if (parsed.origin !== origin || parsed.protocol === 'http:' && config.NODE_ENV === 'production') {
        context.addIssue({ code: 'custom', path: ['CORS_ALLOWED_ORIGINS', index], message: 'Use an exact HTTPS origin in production.' })
      }
      normalized.add(parsed.origin)
    } catch {
      context.addIssue({ code: 'custom', path: ['CORS_ALLOWED_ORIGINS', index], message: 'Each allowed origin must be a valid origin URL.' })
    }
  })
  if (config.NODE_ENV === 'production' && config.APP_ORIGIN && !normalized.has(config.APP_ORIGIN)) {
    context.addIssue({ code: 'custom', path: ['CORS_ALLOWED_ORIGINS'], message: 'Must include APP_ORIGIN.' })
  }
})

export function loadConfig(source = process.env) {
  const parsed = environmentSchema.safeParse(source)
  if (!parsed.success) {
    const names = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
    throw new Error(`Invalid backend configuration. Check: ${names.join(', ')}`)
  }
  const origins = parsed.data.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173'
  return {
    nodeEnv: parsed.data.NODE_ENV,
    port: parsed.data.PORT,
    databaseUrl: parsed.data.DATABASE_URL,
    appOrigin: parsed.data.APP_ORIGIN ?? 'http://localhost:5173',
    corsAllowedOrigins: [...new Set(origins.split(',').map((origin) => origin.trim()).filter(Boolean).map((origin) => new URL(origin).origin))],
    trustProxyHops: parsed.data.TRUST_PROXY_HOPS,
    logLevel: parsed.data.LOG_LEVEL,
    googleClientId: parsed.data.GOOGLE_CLIENT_ID || null,
    googleClientSecret: parsed.data.GOOGLE_CLIENT_SECRET || null,
    googleCallbackUrl: parsed.data.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
  }
}
