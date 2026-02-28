import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders tooltip content on hover for standard state', () => {
    const { getByText, getByRole } = render(<Tooltip content="Mehr Informationen" label="Info" />)

    fireEvent.mouseEnter(getByText('Info'))
    expect(getByRole('tooltip')).toHaveTextContent('Mehr Informationen')
  })

  it('hides tooltip in edge case when open=false', () => {
    const { queryByRole } = render(<Tooltip content="Hidden" label="Info" open={false} />)

    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
