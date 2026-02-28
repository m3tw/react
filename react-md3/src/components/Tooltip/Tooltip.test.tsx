import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders tooltip content for standard state', () => {
    const { getByRole } = render(<Tooltip content="Mehr Informationen" label="Info" />)

    expect(getByRole('tooltip')).toHaveTextContent('Mehr Informationen')
  })

  it('hides tooltip in edge case when open=false', () => {
    const { queryByRole } = render(<Tooltip content="Hidden" label="Info" open={false} />)

    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
