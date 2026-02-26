import { describe, expect, it } from 'vitest'

import * as publicApi from './index'

describe('public API barrel', () => {
  it('exports M3ReferenceCard via src/index.ts', () => {
    expect(publicApi.M3ReferenceCard).toBeTypeOf('function')
  })
})
