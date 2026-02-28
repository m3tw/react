import { useState } from 'react'

import {
  AlertDialog,
  Badge,
  Button,
  ButtonGroup,
  Carousel,
  Checkbox,
  Chip,
  DatePickerModal,
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

const IconDashboard = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
const IconProjects = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
const IconReports = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;

const navigationDestinations = [
  { label: 'Dashboard', value: 'dashboard', icon: IconDashboard },
  { label: 'Projekte', value: 'projekte', icon: IconProjects },
  { label: 'Reports', value: 'reports', disabled: true, icon: IconReports },
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
  const [showModalPicker, setShowModalPicker] = useState(false)
  const [showModalInputPicker, setShowModalInputPicker] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  return (
    <div className="app-shell">
      <TopAppBar
        actions={[
          { label: 'Search', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> },
          { label: 'More options', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg> },
        ]}
        ariaLabel="App Header"
        title="Material 3 Kitchen Sink"
        supportingText="React Components Demo"
        navigationIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        }
        onNavigationClick={() => setMobileDrawerOpen(true)}
        navigationAriaLabel="Open navigation menu"
      />

      {/* Mobile navigation drawer overlay */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-overlay">
          <div className="mobile-drawer-scrim" onClick={() => setMobileDrawerOpen(false)} aria-hidden="true" />
          <div className="mobile-drawer-container">
            <NavigationDrawer
              heading="Navigation"
              destinations={navigationDestinations}
              value={activeDestination}
              onValueChange={(v) => { setActiveDestination(v); setMobileDrawerOpen(false) }}
              ariaLabel="Mobile Navigation"
            />
          </div>
        </div>
      )}

      <div className="main-layout">
        <div className="desktop-rail">
          <NavigationRail
            ariaLabel="Main Navigation"
            destinations={navigationDestinations}
            onValueChange={setActiveDestination}
            value={activeDestination}
          />
        </div>

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
                <Button variant="elevated">Elevated</Button>
                <Button>Filled</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button disabled>Disabled</Button>
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
                  <DateTimePicker label="Select Date" />
                  <DateTimePicker label="Disabled Picker" disabled />
                </div>
                <div className="component-row">
                  <Button variant="outlined" onClick={() => setShowModalPicker(true)}>Open Modal Date Picker</Button>
                  <Button variant="outlined" onClick={() => setShowModalInputPicker(true)}>Open Modal Input Picker</Button>
                </div>
                <DatePickerModal
                  open={showModalPicker}
                  onConfirm={(d) => { console.log('Modal selected:', d); setShowModalPicker(false) }}
                  onCancel={() => setShowModalPicker(false)}
                />
                <DatePickerModal
                  open={showModalInputPicker}
                  initialMode="input"
                  onConfirm={(d) => { console.log('Input selected:', d); setShowModalInputPicker(false) }}
                  onCancel={() => setShowModalInputPicker(false)}
                />
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

