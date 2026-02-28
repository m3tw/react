import { useState } from 'react'

import {
  AlertDialog,
  Badge,
  Button,
  ButtonGroup,
  Card,
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
  Menu,
  NavigationBar,
  NavigationDrawer,
  NavigationRail,
  ProgressIndicator,
  RadioGroup,
  SearchBar,
  BottomSheet,
  SideSheet,
  Slider,
  Snackbar,
  SplitButton,
  Surface,
  Switch,
  Tabs,
  TextField,
  PlainTooltip,
  RichTooltip,
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
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [sideSheetOpen, setSideSheetOpen] = useState(false)

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
                <Button size="xs">XS</Button>
                <Button size="s">Small</Button>
                <Button size="m" variant="tonal">Medium</Button>
                <Button size="l" variant="outlined">Large</Button>
                <Button size="xl" variant="elevated">XL</Button>
              </div>
              <div className="component-row">
                <Button shape="square">Square</Button>
                <Button shape="square" size="m" variant="tonal">Square M</Button>
                <Button shape="square" size="l" variant="outlined">Square L</Button>
                <Button toggle icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}>Like</Button>
              </div>
              <div className="component-row">
                <ButtonGroup
                  options={buttonGroupOptions}
                  value={buttonGroupValue}
                  onValueChange={setButtonGroupValue}
                />
                <ButtonGroup
                  multiSelect
                  ariaLabel="Size Filter"
                  options={[
                    { label: 'XS', value: 'xs' },
                    { label: 'S', value: 's' },
                    { label: 'M', value: 'm' },
                    { label: 'L', value: 'l' },
                    { label: 'XL', value: 'xl' },
                  ]}
                  defaultValue={['m', 'l']}
                  onValueChange={(v) => console.log('Multi-select:', v)}
                />
                <ButtonGroup
                  ariaLabel="With Icons"
                  options={[
                    { label: 'Star', value: 'star', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> },
                    { label: 'Heart', value: 'heart', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> },
                    { label: 'Pin', value: 'pin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> },
                  ]}
                  defaultValue="star"
                />
              </div>
              <div className="component-row">
                <SplitButton label="XS" size="xs" menuItems={[{ label: 'Option', value: 'o' }]} />
                <SplitButton label="Small" size="s" menuItems={[{ label: 'Option', value: 'o' }]} />
                <SplitButton
                  label="Medium"
                  menuItems={[
                    { label: 'Save as copy', value: 'copy' },
                    { label: 'Save as template', value: 'template' },
                    { label: 'Export as PDF', value: 'pdf' },
                  ]}
                  onMenuSelect={(v) => console.log('Split:', v)}
                />
                <SplitButton label="Large" size="l" variant="tonal" menuItems={[{ label: 'Schedule', value: 'schedule' }, { label: 'Draft', value: 'draft' }]} />
                <SplitButton label="XL" size="xl" variant="outlined" menuItems={[{ label: 'Copy link', value: 'link' }, { label: 'Email', value: 'email' }]} />
              </div>
              <div className="component-row">
                <Fab label="Small" size="small" />
                <Fab label="Medium" />
                <Fab label="Large" size="large" />
                <Fab label="Create new" variant="extended" />
              </div>
              <div className="component-row">
                <Fab label="Surface" color="surface" />
                <Fab label="Primary" color="primary" />
                <Fab label="Secondary" color="secondary" />
                <Fab label="Tertiary" color="tertiary" />
                <Fab
                  label="Actions"
                  menuItems={[
                    { label: 'New File', value: 'new-file', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/></svg> },
                    { label: 'New Folder', value: 'new-folder', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V8h16v10z"/></svg> },
                    { label: 'Upload', value: 'upload', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg> },
                  ]}
                  onMenuSelect={(v) => console.log('FAB menu:', v)}
                />
                <IconButton ariaLabel="Standard" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Standard Selected" selected icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Filled" variant="filled" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Filled Selected" variant="filled" selected icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Tonal" variant="tonal" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Tonal Selected" variant="tonal" selected icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Outlined" variant="outlined" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
                <IconButton ariaLabel="Outlined Selected" variant="outlined" selected icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} />
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
                <Badge label="3">
                  <IconButton ariaLabel="Notifications" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>} />
                </Badge>
                <Badge>
                  <IconButton ariaLabel="Messages" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>} />
                </Badge>
                <Badge label="999+">
                  <IconButton ariaLabel="Alerts" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>} />
                </Badge>
                <Chip label="Filter Chip" selected />
                <Chip label="Input Chip" dismissible onDismiss={() => {}} />
                <Chip label="Disabled Chip" disabled />
                <PlainTooltip content="This is a plain tooltip!">
                  <IconButton ariaLabel="Info" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>} />
                </PlainTooltip>
                <RichTooltip supportingText="Rich tooltips can contain detailed information and actions." subhead="Rich Tooltip" actionLabel="Learn more" onAction={() => console.log('Rich tooltip action')}>
                  <Button variant="outlined">Hover for details</Button>
                </RichTooltip>
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
              </div>
            </Surface>

            {/* Cards */}
            <Surface as="section" elevation={1} className="component-section">
              <h2>Cards</h2>
              <Divider />
              
              <div className="component-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                <Card style={{ width: '240px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Elevated Card</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>Default card variant. Provides shadow for emphasis and depth.</p>
                </Card>

                <Card variant="filled" style={{ width: '240px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Filled Card</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>Relies on contrast against the background instead of shadows.</p>
                </Card>

                <Card variant="outlined" style={{ width: '240px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Outlined Card</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>Clean styling with a pronounced border but no default elevation.</p>
                </Card>
              </div>
              
              <div className="component-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginTop: '16px' }}>
                <Card interactive style={{ width: '240px', minHeight: '140px' }} onClick={() => console.log('Clicked elevated!')}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Interactive Elevated</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>Click or press space/enter. Notice the elevation increases on hover!</p>
                </Card>

                <Card interactive variant="filled" style={{ width: '240px', minHeight: '140px' }} onClick={() => console.log('Clicked filled!')}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Interactive Filled</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>This filled card gains an elevation shadow when hovered.</p>
                </Card>
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
                <h3>Sheets & Drawers</h3>
                <div className="component-row">
                  <Button variant="outlined" onClick={() => setBottomSheetOpen(true)}>Open Bottom Sheet</Button>
                  <Button variant="outlined" onClick={() => setSideSheetOpen(true)}>Open Side Sheet</Button>
                </div>
                <BottomSheet
                  open={bottomSheetOpen}
                  onOpenChange={setBottomSheetOpen}
                  title="Quick Actions"
                  variant="modal"
                >
                  <p>Bottom sheet content goes here.</p>
                  <Button variant="tonal" onClick={() => setBottomSheetOpen(false)}>Dismiss</Button>
                </BottomSheet>
                <SideSheet
                  open={sideSheetOpen}
                  onOpenChange={setSideSheetOpen}
                  headline="Details"
                  variant="modal"
                  onClose={() => setSideSheetOpen(false)}
                >
                  <p>Side sheet content goes here.</p>
                </SideSheet>
                <div className="sheet-row">
                  <NavigationDrawer
                    destinations={navigationDestinations}
                    value={activeDestination}
                    onValueChange={setActiveDestination}
                    heading="Drawer Nav"
                  />
                  <SideSheet defaultOpen headline="Inline Side Sheet" divider>
                    <p>Information goes here.</p>
                  </SideSheet>
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

