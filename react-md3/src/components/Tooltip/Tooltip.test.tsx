import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PlainTooltip } from './PlainTooltip'
import { RichTooltip } from './RichTooltip'
import { Tooltip } from './Tooltip'

describe('PlainTooltip', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows tooltip on focus and links via aria-describedby', () => {
    const { getByText, getByRole } = render(
      <PlainTooltip content="Help text">
        <button>Trigger</button>
      </PlainTooltip>,
    )

    fireEvent.focus(getByText('Trigger'))

    const tooltip = getByRole('tooltip')
    expect(tooltip).toHaveTextContent('Help text')

    const anchor = tooltip.closest('.m3-plain-tooltip-anchor')!
    expect(anchor.getAttribute('aria-describedby')).toBe(tooltip.id)
  })

  it('dismisses on Escape', () => {
    const { getByText, queryByRole } = render(
      <PlainTooltip content="Dismiss me">
        <button>Trigger</button>
      </PlainTooltip>,
    )

    fireEvent.focus(getByText('Trigger'))
    expect(queryByRole('tooltip')).toBeInTheDocument()

    fireEvent.keyDown(getByText('Trigger'), { key: 'Escape' })
    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('respects controlled open=false', () => {
    const { queryByRole } = render(
      <PlainTooltip content="Hidden" open={false} onOpenChange={() => {}}>
        <button>Trigger</button>
      </PlainTooltip>,
    )

    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('throws when open is set without onOpenChange', () => {
    expect(() =>
      render(
        <PlainTooltip content="Broken" open={true}>
          <button>Trigger</button>
        </PlainTooltip>,
      ),
    ).toThrow('Controlled PlainTooltip erwartet onOpenChange.')
  })

  it('shows tooltip after hover delay', () => {
    vi.useFakeTimers()

    const { getByText, queryByRole } = render(
      <PlainTooltip content="Delayed">
        <button>Trigger</button>
      </PlainTooltip>,
    )

    fireEvent.mouseEnter(getByText('Trigger'))
    expect(queryByRole('tooltip')).not.toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(500) })
    expect(queryByRole('tooltip')).toBeInTheDocument()
  })

  it('hides tooltip on mouse leave', () => {
    vi.useFakeTimers()

    const { getByText, queryByRole } = render(
      <PlainTooltip content="Leave me">
        <button>Trigger</button>
      </PlainTooltip>,
    )

    fireEvent.mouseEnter(getByText('Trigger'))
    act(() => { vi.advanceTimersByTime(500) })
    expect(queryByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(getByText('Trigger'))
    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })
})

describe('RichTooltip', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders with role="tooltip" when no actions', () => {
    const { getByText, getByRole } = render(
      <RichTooltip supportingText="Details here" subhead="Title">
        <button>Info</button>
      </RichTooltip>,
    )

    fireEvent.focus(getByText('Info'))

    const tooltip = getByRole('tooltip')
    expect(tooltip).toHaveTextContent('Details here')
    expect(tooltip).toHaveTextContent('Title')
  })

  it('renders with role="dialog" when actionLabel is set', () => {
    const onAction = vi.fn()

    const { getByText, getByRole } = render(
      <RichTooltip supportingText="Learn more" actionLabel="Action" onAction={onAction}>
        <button>Info</button>
      </RichTooltip>,
    )

    fireEvent.focus(getByText('Info'))

    expect(getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(getByText('Action'))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('throws when actionLabel is provided without onAction', () => {
    expect(() =>
      render(
        <RichTooltip supportingText="Oops" actionLabel="Do it">
          <button>Trigger</button>
        </RichTooltip>,
      ),
    ).toThrow('RichTooltip erwartet actionLabel und onAction gemeinsam.')
  })

  it('throws when open is set without onOpenChange', () => {
    expect(() =>
      render(
        <RichTooltip supportingText="Broken" open={true}>
          <button>Trigger</button>
        </RichTooltip>,
      ),
    ).toThrow('Controlled RichTooltip erwartet onOpenChange.')
  })

  it('stays open when hovering the tooltip surface', () => {
    vi.useFakeTimers()

    const { getByText, queryByRole } = render(
      <RichTooltip supportingText="Hover me" subhead="Sticky">
        <button>Info</button>
      </RichTooltip>,
    )

    fireEvent.mouseEnter(getByText('Info'))
    act(() => { vi.advanceTimersByTime(500) })
    expect(queryByRole('tooltip')).toBeInTheDocument()

    // Leave anchor, start hide timer
    fireEvent.mouseLeave(getByText('Info'))

    // Enter the tooltip surface — cancels hide timer
    fireEvent.mouseEnter(queryByRole('tooltip')!)
    act(() => { vi.advanceTimersByTime(1500) })
    expect(queryByRole('tooltip')).toBeInTheDocument()

    // Leave the tooltip surface — starts hide timer again
    fireEvent.mouseLeave(queryByRole('tooltip')!)
    act(() => { vi.advanceTimersByTime(1500) })
    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('dismisses on Escape', () => {
    const { getByText, queryByRole } = render(
      <RichTooltip supportingText="Dismiss me">
        <button>Info</button>
      </RichTooltip>,
    )

    fireEvent.focus(getByText('Info'))
    expect(queryByRole('tooltip')).toBeInTheDocument()

    fireEvent.keyDown(getByText('Info'), { key: 'Escape' })
    expect(queryByRole('tooltip')).not.toBeInTheDocument()
  })
})

describe('Tooltip alias', () => {
  it('is the same component as PlainTooltip', () => {
    expect(Tooltip).toBe(PlainTooltip)
  })
})
