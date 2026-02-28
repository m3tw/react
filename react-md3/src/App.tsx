import { useState } from 'react'

import {
  AlertDialog,
  Badge,
  Button,
  ButtonGroup,
  Carousel,
  Checkbox,
  Chip,
  DateTimePicker,
  Dialog,
  Divider,
  Fab,
  IconButton,
  List,
  M3ReferenceCard,
  Menu,
  NavigationBar,
  NavigationDrawer,
  NavigationRail,
  ProgressIndicator,
  RadioGroup,
  SearchBar,
  Sheet,
  Slider,
  Snackbar,
  Surface,
  Switch,
  Tabs,
  TextField,
  Tooltip,
  TopAppBar,
} from './index'
import './App.css'

const navigationDestinations = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Projekte', value: 'projekte' },
  { label: 'Reports', value: 'reports', disabled: true },
]

const listItems = [
  { label: 'Inbox', value: 'inbox' },
  { label: 'Review', value: 'review' },
  { label: 'Archive', value: 'archive' },
]

const buttonGroupOptions = [
  { label: 'Tag', value: 'day' },
  { label: 'Woche', value: 'week' },
  { label: 'Monat', value: 'month' },
]

const radioOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]

const carouselItems = ['Slide 1', 'Slide 2', 'Slide 3']

function App() {
  // Navigation & Tabs
  const [activeDestination, setActiveDestination] = useState('dashboard')
  const [tabValue, setTabValue] = useState('overview')

  // Overlays & Feedback
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  
  // Inputs & Selections
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('a')
  const [switchChecked, setSwitchChecked] = useState(false)
  const [sliderValue, setSliderValue] = useState(35)
  const [searchValue, setSearchValue] = useState('')
  const [textValue, setTextValue] = useState('')

  // Other components
  const [buttonGroupValue, setButtonGroupValue] = useState('day')
  const [listValue, setListValue] = useState('inbox')
  const [carouselIndex, setCarouselIndex] = useState(0)

  return (
    <div className="app-shell">
      <TopAppBar
        actions={[
          { label: 'Profile' },
          { label: 'Settings' }
        ]}
        ariaLabel="App Header"
        title="Material 3 Kitchen Sink"
        supportingText="React Components Demo"
      />

      <div className="main-layout">
        <NavigationRail
          ariaLabel="Main Navigation"
          destinations={navigationDestinations}
          onValueChange={setActiveDestination}
          value={activeDestination}
        />

        <main className="content-container">
          <header className="page-header">
            <h1>Component Overview</h1>
            <p>A comprehensive showcase of all implemented M3 components.</p>
          </header>

          <div className="component-grid">

            {/* Buttons & Actions */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Buttons & Actions</h2>
              <Divider />
              <div className="component-row">
                <Button>Filled Button</Button>
                <Button variant="tonal">Tonal Button</Button>
                <Button variant="text">Text Button</Button>
                <Button disabled>Disabled Button</Button>
              </div>
              <div className="component-row">
                <ButtonGroup
                  options={buttonGroupOptions}
                  value={buttonGroupValue}
                  onValueChange={setButtonGroupValue}
                />
              </div>
              <div className="component-row">
                <Fab label="Add" />
                <Fab label="Create new" variant="extended" />
                <IconButton selected={true} ariaLabel="Favorite" />
                <IconButton ariaLabel="Bookmark" />
                <IconButton disabled ariaLabel="Disabled" />
              </div>
            </Surface>

            {/* Inputs & Selections */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Inputs & Selections</h2>
              <Divider />
              <div className="component-row">
                <TextField 
                  label="Standard Text Field" 
                  value={textValue} 
                  onChange={(e) => setTextValue(e.target.value)} 
                />
                <TextField 
                  label="Text Field Error" 
                  value="Invalid Input" 
                  onChange={() => {}} 
                  errorText="This is an error message."
                />
                <TextField 
                  label="Disabled Text Field" 
                  value="Disabled" 
                  disabled
                />
              </div>
              <div className="component-row">
                <SearchBar 
                  onSearch={(q) => setSearchValue(q)} 
                />
                {searchValue && <p style={{ margin: 0, fontSize: '0.85rem' }}>Search: {searchValue}</p>}
              </div>
              <div className="component-col">
                <div className="component-row">
                  <Checkbox 
                    label="Checkbox Item" 
                    checked={checkboxChecked} 
                    onChange={(e) => setCheckboxChecked(e.target.checked)} 
                  />
                  <Checkbox 
                    label="Disabled Checkbox" 
                    checked={true} 
                    disabled 
                  />
                  <Checkbox 
                    label="Error Checkbox" 
                    checked={false} 
                    errorText="Must check to proceed."
                  />
                </div>
                <div className="component-row">
                  <Switch 
                    label="Switch Item" 
                    checked={switchChecked} 
                    onCheckedChange={setSwitchChecked} 
                  />
                  <Switch 
                    label="Disabled Switch" 
                    checked={false} 
                    disabled
                  />
                </div>
                <RadioGroup 
                  label="Options"
                  options={radioOptions} 
                  value={radioValue} 
                  onValueChange={setRadioValue} 
                />
                <RadioGroup 
                  label="Disabled Options"
                  options={[
                    { label: 'Disabled A', value: 'a' },
                    { label: 'Disabled B', value: 'b', disabled: true }
                  ]}
                  value="a" 
                  disabled
                />
                <div className="slider-container">
                  <Slider 
                    label="Volume" 
                    value={sliderValue} 
                    onValueChange={setSliderValue} 
                  />
                </div>
              </div>
            </Surface>

            {/* Data Display & Indicators */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Data Display & Indicators</h2>
              <Divider />
              <div className="component-row">
                <Badge label="New" tone="success" />
                <Badge label="Warning" tone="warning" />
                <Badge label="Error" tone="error" />
                <Badge label="Neutral" tone="neutral" />
                <Chip label="Filter Chip" selected />
                <Chip label="Input Chip" dismissible onDismiss={() => {}} />
                <Chip label="Disabled Chip" disabled />
                <Tooltip label="Hover me" content="This is a tooltip message!" />
              </div>
              <div className="component-row">
                <ProgressIndicator label="Determinate (72%)" value={72} />
                <ProgressIndicator label="Indeterminate" indeterminate />
              </div>
              <div className="component-col">
                <List 
                  items={listItems} 
                  value={listValue} 
                  onValueChange={setListValue} 
                />
              </div>
            </Surface>

            {/* Pickers & Complex */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Pickers & Complex</h2>
              <Divider />
              <div className="component-col">
                <div className="component-row">
                  <DateTimePicker label="Select Date" mode="date" />
                  <DateTimePicker label="Select Time" mode="time" />
                  <DateTimePicker label="Disabled Picker" mode="date" disabled />
                </div>
                <Tabs 
                  tabs={[
                    { label: 'Overview', value: 'overview' },
                    { label: 'A11y', value: 'a11y' },
                    { label: 'Blocked (Disabled)', value: 'blocked', disabled: true },
                  ]} 
                  value={tabValue} 
                  onValueChange={setTabValue} 
                />
                <div className="carousel-container">
                  <Carousel 
                    items={carouselItems} 
                    activeIndex={carouselIndex} 
                    onActiveIndexChange={setCarouselIndex} 
                  />
                </div>
                <M3ReferenceCard 
                  title="M3 Reference Card" 
                  supportingText="An example of a composed card component." 
                />
              </div>
            </Surface>

            {/* Overlays & Feedback */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Overlays & Feedback</h2>
              <Divider />
              <div className="component-row">
                <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                <Button onClick={() => setAlertDialogOpen(true)} variant="tonal">Open Alert Dialog</Button>
                <Button onClick={() => setSnackbarOpen(true)} variant="text">Show Snackbar</Button>
                <Menu 
                  items={[
                    { label: 'Action 1', value: '1' }, 
                    { label: 'Action 2', value: '2' },
                    { label: 'Disabled Action', value: '3', disabled: true }
                  ]} 
                  onSelect={() => {}} 
                />
              </div>

              {/* Overlays rendering */}
              <Dialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                title="Standard Dialog"
                description="This is a standard dialog overlay for general information or choices."
                onConfirm={() => setDialogOpen(false)}
                onCancel={() => setDialogOpen(false)}
              >
                <p>Additional custom content can go here.</p>
              </Dialog>

              <AlertDialog
                open={alertDialogOpen}
                onOpenChange={setAlertDialogOpen}
                title="Action Required"
                description="Are you sure you want to perform this destructive action?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={() => setAlertDialogOpen(false)}
                onCancel={() => setAlertDialogOpen(false)}
              />

              <Snackbar
                open={snackbarOpen}
                onOpenChange={setSnackbarOpen}
                message="Operation completed successfully."
                tone="success"
                actionLabel="Undo"
                onAction={() => setSnackbarOpen(false)}
              />
            </Surface>

            {/* Additional Navigation */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Additional Navigation</h2>
              <Divider />
              <div className="component-col">
                <NavigationBar 
                  destinations={navigationDestinations} 
                  value={activeDestination} 
                  onValueChange={setActiveDestination} 
                />
              </div>
              <div className="component-col sheet-demo">
                <h3>Sheets & Drawers (inline preview)</h3>
                <div className="sheet-row">
                  <NavigationDrawer 
                    destinations={navigationDestinations} 
                    value={activeDestination} 
                    onValueChange={setActiveDestination} 
                    heading="Drawer Nav"
                  />
                  <Sheet placement="side" title="Side Sheet">
                    <p>Information goes here.</p>
                  </Sheet>
                </div>
              </div>
            </Surface>

          </div>
        </main>
      </div>
    </div>
  )
}

export default App

