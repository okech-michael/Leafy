import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/config/env.js'

const databaseValues = {
  DATABASE_URL: 'postgresql://leafy:secret@localhost:5432/leafy_test',
}

describe('backend configuration', () => {
  it('uses localhost defaults outside production', () => {
    const config = loadConfig(databaseValues)
    expect(config.appOrigin).toBe('http://localhost:5173')
    expect(config.corsAllowedOrigins).toEqual(['http://localhost:5173'])
  })

  it('accepts a fully configured production origin and trusted proxy', () => {
    const config = loadConfig({
      ...databaseValues,
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
        ...databaseValues,
        NODE_ENV: 'production',
        APP_ORIGIN: 'http://leafy.example/path',
      })
    } catch (error) {
      if (error instanceof Error) message = error.message
    }

    expect(message).toMatch(/APP_ORIGIN/)
    expect(message).not.toContain('leafy.example')
  })
})
