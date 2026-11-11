import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/config/env.js'

const supabaseValues = {
  SUPABASE_URL: 'https://leafy-test.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
}

describe('backend configuration', () => {
  it('uses localhost defaults outside production', () => {
    const config = loadConfig(supabaseValues)
    expect(config.appOrigin).toBe('http://localhost:5173')
    expect(config.corsAllowedOrigins).toEqual(['http://localhost:5173'])
  })

  it('accepts a fully configured production origin and trusted proxy', () => {
    const config = loadConfig({
      ...supabaseValues,
      NODE_ENV: 'production',
      APP_ORIGIN: 'https://leafy.example',
      CORS_ALLOWED_ORIGINS: 'https://leafy.example',
      TRUST_PROXY_HOPS: '1',
    })

    expect(config.corsAllowedOrigins).toEqual(['https://leafy.example'])
  })

  it('requires HTTPS origins in production without exposing secret values', () => {
    let message = ''
    try {
      loadConfig({
        ...supabaseValues,
        NODE_ENV: 'production',
        SUPABASE_SERVICE_ROLE_KEY: 'do-not-include-this-value',
      })
    } catch (error) {
      if (error instanceof Error) message = error.message
    }

    expect(message).toMatch(/APP_ORIGIN.*CORS_ALLOWED_ORIGINS/)
    expect(message).not.toContain('do-not-include-this-value')
  })
})
