import { describe, expect, it } from 'vitest'

import * as publicApi from './index'

describe('public API barrel', () => {
  it('exports only the documented symbols via src/index.ts', () => {
    expect(Object.keys(publicApi).sort()).toEqual([
      'AlertDialog',
      'Badge',
      'BottomAppBar',
      'BottomSheet',
      'Button',
      'ButtonGroup',
      'Card',
      'Carousel',
      'Checkbox',
      'Chip',
      'DatePickerModal',
      'DateTimePicker',
      'Dialog',
      'Divider',
      'DockedToolbar',
      'Fab',
      'FloatingToolbar',
      'FullScreenDialog',
      'IconButton',
      'List',
      'LoadingIndicator',
      'Menu',
      'NavigationBar',
      'NavigationDrawer',
      'NavigationRail',
      'PlainTooltip',
      'ProgressIndicator',
      'RadioGroup',
      'RichTooltip',
      'SearchBar',
      'SideSheet',
      'Slider',
      'Snackbar',
      'SplitButton',
      'Surface',
      'Switch',
      'Tabs',
      'TextField',
      'TimePicker',
      'Tooltip',
      'TopAppBar',
    ])
  })
})
