import { describe, expect, it } from 'vitest'

import * as publicApi from './index'

describe('public API barrel', () => {
  it('exports only the documented symbols via src/index.ts', () => {
    expect(Object.keys(publicApi).sort()).toEqual([
      'Button',
      'Checkbox',
      'M3ReferenceCard',
      'M3_REFERENCE_FALLBACK_TEXT',
      'RadioGroup',
      'TextField',
    ])
  })
})
