import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  APP_ORIGIN: z.url().optional(),
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
}).superRefine((config, context) => {
  if (config.NODE_ENV === 'production') {
    if (new URL(config.SUPABASE_URL).protocol !== 'https:') {
      context.addIssue({ code: 'custom', path: ['SUPABASE_URL'], message: 'Must use HTTPS in production.' })
    }

    if (!config.APP_ORIGIN) {
      context.addIssue({ code: 'custom', path: ['APP_ORIGIN'], message: 'Required in production.' })
    } else if (new URL(config.APP_ORIGIN).protocol !== 'https:') {
      context.addIssue({ code: 'custom', path: ['APP_ORIGIN'], message: 'Must use HTTPS in production.' })
    }

    if (!config.CORS_ALLOWED_ORIGINS?.trim()) {
      context.addIssue({ code: 'custom', path: ['CORS_ALLOWED_ORIGINS'], message: 'Required in production.' })
    }
    if (config.TRUST_PROXY_HOPS < 1) {
      context.addIssue({ code: 'custom', path: ['TRUST_PROXY_HOPS'], message: 'Set this to the trusted Vercel proxy hop count.' })
    }
  }

  if (config.APP_ORIGIN) {
    const appUrl = new URL(config.APP_ORIGIN)
    if (appUrl.origin !== config.APP_ORIGIN) {
      context.addIssue({ code: 'custom', path: ['APP_ORIGIN'], message: 'Must be an origin without a path or query.' })
    }
  }

  const allowedOrigins = config.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []
  const normalizedAllowedOrigins = new Set<string>()
  allowedOrigins.forEach((origin, index) => {
    try {
      const parsedOrigin = new URL(origin)
      if (parsedOrigin.origin !== origin || parsedOrigin.protocol === 'http:' && config.NODE_ENV === 'production') {
        context.addIssue({
          code: 'custom',
          path: ['CORS_ALLOWED_ORIGINS', index],
          message: 'Use an exact HTTPS origin in production.',
        })
      }
      normalizedAllowedOrigins.add(parsedOrigin.origin)
    } catch {
      context.addIssue({
        code: 'custom',
        path: ['CORS_ALLOWED_ORIGINS', index],
        message: 'Each allowed origin must be a valid origin URL.',
      })
    }
  })
  if (config.NODE_ENV === 'production' && config.APP_ORIGIN && !normalizedAllowedOrigins.has(config.APP_ORIGIN)) {
    context.addIssue({
      code: 'custom',
      path: ['CORS_ALLOWED_ORIGINS'],
      message: 'Must include APP_ORIGIN.',
    })
  }
})

export type AppConfig = {
  nodeEnv: 'development' | 'test' | 'production'
  port: number
  appOrigin: string
  corsAllowedOrigins: string[]
  trustProxyHops: number
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceRoleKey: string
}

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = environmentSchema.safeParse(source)
  if (!parsed.success) {
    const invalidNames = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
    throw new Error(`Invalid backend configuration. Check: ${invalidNames.join(', ')}`)
  }

  const configuredOrigins = parsed.data.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173'
  const origins = [...new Set(configuredOrigins.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => new URL(origin).origin))]

  return {
    nodeEnv: parsed.data.NODE_ENV,
    port: parsed.data.PORT,
    appOrigin: parsed.data.APP_ORIGIN ?? 'http://localhost:5173',
    corsAllowedOrigins: origins,
    trustProxyHops: parsed.data.TRUST_PROXY_HOPS,
    logLevel: parsed.data.LOG_LEVEL,
    supabaseUrl: parsed.data.SUPABASE_URL,
    supabaseAnonKey: parsed.data.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
  }
}
