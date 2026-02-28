import { describe, expect, it } from 'vitest'

import * as publicApi from './index'

describe('public API barrel', () => {
  it('exports only the documented symbols via src/index.ts', () => {
    expect(Object.keys(publicApi).sort()).toEqual([
      'AlertDialog',
      'Badge',
      'Button',
      'ButtonGroup',
      'Carousel',
      'Checkbox',
      'Chip',
      'DatePickerModal',
      'DateTimePicker',
      'Dialog',
      'Divider',
      'Fab',
      'IconButton',
      'List',
      'M3ReferenceCard',
      'M3_REFERENCE_FALLBACK_TEXT',
      'Menu',
      'NavigationBar',
      'NavigationDrawer',
      'NavigationRail',
      'ProgressIndicator',
      'RadioGroup',
      'Ripple',
      'SearchBar',
      'Sheet',
      'Slider',
      'Snackbar',
      'SplitButton',
      'Surface',
      'Switch',
      'Tabs',
      'TextField',
      'Tooltip',
      'TopAppBar',
    ])
  })
})
