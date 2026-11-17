import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from '../src/modules/auth/auth.schemas.js'

describe('authentication request schemas', () => {
  it('normalizes registration email and trims identity fields', () => {
    const parsed = registerSchema.parse({
      name: '  Amina Otieno  ',
      email: ' AMINA@example.com ',
      phone: '+254 700 000 000',
      password: 'secure-password',
      confirmPassword: 'secure-password',
    })

    expect(parsed.name).toBe('Amina Otieno')
    expect(parsed.email).toBe('amina@example.com')
  })

  it('rejects mismatched registration passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Amina Otieno',
      email: 'amina@example.com',
      phone: '+254700000000',
      password: 'secure-password',
      confirmPassword: 'different-password',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid login email addresses', () => {
    expect(loginSchema.safeParse({ email: 'invalid', password: 'password' }).success).toBe(false)
  })
})
