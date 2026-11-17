import { describe, expect, it } from 'vitest'
import { contactMessageSchema } from '../src/modules/contact/contact.schemas.js'

describe('contact message schema', () => {
  it('normalizes a valid message for storage', () => {
    const parsed = contactMessageSchema.parse({
      name: '  Amina Otieno ',
      email: ' AMINA@example.com ',
      topic: 'Partnership',
      message: '  Please contact me about a partnership.  ',
    })

    expect(parsed.name).toBe('Amina Otieno')
    expect(parsed.email).toBe('amina@example.com')
    expect(parsed.message).toBe('Please contact me about a partnership.')
  })

  it('rejects unsupported topics and oversized messages', () => {
    expect(contactMessageSchema.safeParse({
      name: 'Amina Otieno',
      email: 'amina@example.com',
      topic: 'Other',
      message: 'Hello',
    }).success).toBe(false)

    expect(contactMessageSchema.safeParse({
      name: 'Amina Otieno',
      email: 'amina@example.com',
      topic: 'Partnership',
      message: 'x'.repeat(5001),
    }).success).toBe(false)
  })
})
