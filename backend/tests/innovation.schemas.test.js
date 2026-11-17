import { describe, expect, it } from 'vitest'
import { createInnovationSchema } from '../src/modules/innovations/innovation.schemas.js'

describe('innovation intake schema', () => {
  it('trims fields and defaults support needs', () => {
    const parsed = createInnovationSchema.parse({
      title: '  Soil moisture sensor  ',
      summary: 'A practical sensor for small farms.',
      description: 'A low-cost field prototype for monitoring soil moisture.',
      agriculturalSector: 'Crop production',
      developmentStage: 'Prototype',
    })

    expect(parsed.title).toBe('Soil moisture sensor')
    expect(parsed.supportNeeds).toEqual([])
  })

  it('rejects excessive support needs and malformed organisation IDs', () => {
    expect(createInnovationSchema.safeParse({
      title: 'Soil moisture sensor',
      summary: 'A practical sensor for small farms.',
      description: 'A low-cost field prototype for monitoring soil moisture.',
      agriculturalSector: 'Crop production',
      developmentStage: 'Prototype',
      supportNeeds: Array.from({ length: 11 }, () => 'Mentorship'),
      organisationId: 'not-a-uuid',
    }).success).toBe(false)
  })
})
