import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
let server
let apiOrigin

beforeAll(async () => {
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('LOG_LEVEL', 'silent')
  vi.stubEnv('DATABASE_URL', 'postgresql://leafy:secret@localhost:5432/leafy_test')

  const { default: app } = await import('../src/app.js')
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('The API test server did not bind to a TCP port.')
  apiOrigin = `http://127.0.0.1:${address.port}`
}, 30000)

afterAll(async () => {
  if (!server) return
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve())
  })
  vi.unstubAllEnvs()
})

describe('API application', () => {
  it('serves a liveness response without requiring a database round trip', async () => {
    const response = await fetch(`${apiOrigin}/api/v1/health/live`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('returns a consistent error envelope for unknown routes', async () => {
    const response = await fetch(`${apiOrigin}/api/v1/not-implemented`)
    const payload = await response.json()

    expect(response.status).toBe(404)
    expect(payload.error.code).toBe('HTTP_404')
    expect(payload.requestId).toBeTruthy()
  })

  it('rejects malformed JSON as a client error', async () => {
    const response = await fetch(`${apiOrigin}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    })
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error.code).toBe('HTTP_400')
  })
})
