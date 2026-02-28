import { useState } from 'react'

import {
  AlertDialog,
  Badge,
  Button,
  ButtonGroup,
  Carousel,
  Chip,
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
  SearchBar,
  Sheet,
  Slider,
  Snackbar,
  Surface,
  Switch,
  Tabs,
  Tooltip,
  TopAppBar,
} from './index'
import './App.css'

const navigationDestinations = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Projekte', value: 'projekte' },
  { label: 'Reports', value: 'reports', disabled: true },
  { label: 'Archiv', value: 'archiv', hidden: true },
]

const secondaryDestinations = [
  { label: 'Dokumentation', value: 'docs' },
  { label: 'Roadmap', value: 'roadmap' },
  { label: 'Release Notes', value: 'release-notes' },
]

const feedbackMessages = {
  success: 'Aenderungen wurden gespeichert.',
  warning: 'Warnung: Offline-Modus aktiv.',
  error: 'Fehler beim Speichern. Bitte erneut versuchen.',
} as const

const buttonFamilyOptions = [
  { label: 'Tag', value: 'day' },
  { label: 'Woche', value: 'week' },
  { label: 'Monat', value: 'month' },
]

const splitActionOptions = [
  { label: 'Speichern', value: 'save' },
  { label: 'Als Vorlage', value: 'template' },
  { label: 'Archiv', value: 'archive', disabled: true },
]

const listItems = [
  { label: 'Inbox', value: 'inbox' },
  { label: 'Review', value: 'review' },
  { label: 'Archive', value: 'archive', disabled: true },
]

const menuItems = [
  { label: 'Bearbeiten', value: 'edit' },
  { label: 'Loeschen', value: 'delete' },
]

const barDestinations = [
  { label: 'Home', value: 'home' },
  { label: 'Explore', value: 'explore' },
  { label: 'Saved', value: 'saved' },
]

const tabItems = [
  { label: 'Overview', value: 'overview' },
  { label: 'A11y', value: 'a11y' },
  { label: 'Blocked', value: 'blocked', disabled: true },
]

const carouselItems = ['Karte 1', 'Karte 2', 'Karte 3']

type SnackbarTone = keyof typeof feedbackMessages

function App() {
  const [activeDestination, setActiveDestination] = useState('dashboard')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarTone, setSnackbarTone] = useState<SnackbarTone>('success')
  const [snackbarMessage, setSnackbarMessage] = useState<string>(feedbackMessages.success)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [eventMessage, setEventMessage] = useState('Keine kritischen Ereignisse.')

  const [buttonGroupValue, setButtonGroupValue] = useState('day')
  const [listValue, setListValue] = useState('inbox')
  const [navigationBarValue, setNavigationBarValue] = useState('home')
  const [tabValue, setTabValue] = useState('overview')
  const [switchChecked, setSwitchChecked] = useState(false)
  const [sliderValue, setSliderValue] = useState(35)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [coverageEvent, setCoverageEvent] = useState('Kein Coverage-Ereignis.')
  const [searchResult, setSearchResult] = useState('Noch keine Suche ausgefuehrt.')

  const openFeedback = (tone: SnackbarTone) => {
    setSnackbarTone(tone)
    setSnackbarMessage(feedbackMessages[tone])
    setSnackbarOpen(true)
  }

  return (
    <div className="app-shell">
      <p className="story-badge">Story 2.6 42/42 Coverage</p>
      <TopAppBar
        actions={[
          { label: 'Suche' },
          { label: 'Sync pausiert', disabled: true },
          { label: 'Versteckte Aktion', hidden: true },
        ]}
        ariaLabel="Produktkopfzeile"
        supportingText="FR1, FR14 und FR15 werden ueber Matrix, Demo und Tests gemeinsam nachgewiesen."
        title="M3 42/42 Coverage ist verifizierbar"
      />
      <section aria-label="Referenzlayout" className="layout-grid">
        <NavigationRail
          ariaLabel="Hauptnavigation kompakt"
          compact
          destinations={navigationDestinations}
          onValueChange={setActiveDestination}
          value={activeDestination}
        />
        <NavigationDrawer
          ariaLabel="Hauptnavigation erweitert"
          destinations={navigationDestinations}
          heading="Projektbereiche"
          onValueChange={setActiveDestination}
          value={activeDestination}
        />
        <Surface aria-label="Hauptinhalt" as="main" elevation={2} tonal>
          <h1>Feedback Overlay Referenzlayout</h1>
          <p>Aktive Destination: {activeDestination}</p>
          <p>Disabled + Hidden Eintraege bleiben sichtbar steuerbar und ohne Deep-Import-Abhaengigkeit.</p>
          <div className="feedback-controls">
            <Button onClick={() => openFeedback('success')}>Success zeigen</Button>
            <Button onClick={() => openFeedback('warning')} variant="tonal">
              Warning zeigen
            </Button>
            <Button onClick={() => openFeedback('error')} variant="text">
              Error zeigen
            </Button>
          </div>
          <div className="feedback-controls">
            <Button onClick={() => setDialogOpen(true)}>Dialog oeffnen</Button>
            <Button onClick={() => setAlertDialogOpen(true)} variant="text">
              Kritischen AlertDialog oeffnen
            </Button>
          </div>
          <p className="event-log">{eventMessage}</p>
        </Surface>
      </section>
      <section aria-label="Navigation Varianten" className="variants-grid">
        <NavigationRail
          ariaLabel="Sekundaernavigation erweitert"
          destinations={secondaryDestinations}
          value="docs"
        />
        <Surface aria-label="Hinweise" as="aside" elevation={1}>
          <h2>API-Hinweise</h2>
          <ul>
            <li>Compact vs. erweitert: ueber `compact` bei `NavigationRail` steuerbar.</li>
            <li>Aktive Destination: ueber `value` + `onValueChange` kontrolliert.</li>
            <li>Disabled/Hidden: Eintraege ueber `disabled` bzw. `hidden` absichern.</li>
            <li>Snackbar: non-blocking Status + optionale Retry-Action.</li>
            <li>Dialog/AlertDialog: modales Overlay mit Fokusfuehrung und klaren Aktionen.</li>
          </ul>
        </Surface>
      </section>
      <section aria-label="Story 2.6 Coverage Matrix Demo" className="coverage-grid">
        <Surface aria-label="FR14 Standardbeispiele" as="section" elevation={1}>
          <h2>Story 2.6 Coverage Matrix</h2>
          <p>
            FR1 (vollstaendige Referenznutzung), FR14 (Standardbeispiele) und FR15 (Edge-Cases) sind
            fuer jede Referenzgruppe dokumentiert.
          </p>
          <div className="coverage-row">
            <Badge label="Done" tone="success" />
            <Badge label="Gap" tone="warning" />
            <IconButton ariaLabel="Favorit markieren" selected />
            <Fab label="+" menuItems={[{ label: 'Notiz', value: 'note' }]} onMenuSelect={setCoverageEvent} />
            <Fab label="Schnell erstellen" variant="extended" />
          </div>
          <div className="coverage-row">
            <ButtonGroup
              ariaLabel="Button-Familie"
              onValueChange={setButtonGroupValue}
              options={buttonFamilyOptions}
              value={buttonGroupValue}
              variant="segmented"
            />
            <ButtonGroup
              ariaLabel="Split Aktionen"
              onValueChange={setCoverageEvent}
              options={splitActionOptions}
              variant="split"
            />
          </div>
          <p>Button-Familie aktiv: {buttonGroupValue}</p>
          <div className="coverage-row coverage-row--three">
            <DateTimePicker label="Date & Time" mode="datetime" />
            <DateTimePicker label="Date" mode="date" />
            <DateTimePicker disabled label="Time (Edge)" mode="time" />
          </div>
          <div className="coverage-row coverage-row--three">
            <Chip label="Assist Chip" selected />
            <Chip dismissible label="Filter Chip" onDismiss={() => setCoverageEvent('Chip entfernt')} />
            <Tooltip content="Kontext-Hinweis fuer Edge Cases" label="Tooltip Nachweis" />
          </div>
          <div className="coverage-row coverage-row--three">
            <ProgressIndicator label="Loading & progress" value={72} />
            <ProgressIndicator indeterminate label="Loading indicator" />
            <Divider />
          </div>
          <div className="coverage-row coverage-row--three">
            <List
              ariaLabel="Listen Beispiel"
              onValueChange={(nextValue) => {
                setListValue(nextValue)
                setCoverageEvent(`List Select: ${nextValue}`)
              }}
              items={listItems}
              value={listValue}
            />
            <Menu
              items={menuItems}
              onSelect={(nextValue) => setCoverageEvent(`Menu Select: ${nextValue}`)}
            />
            <Carousel
              activeIndex={carouselIndex}
              items={carouselItems}
              onActiveIndexChange={setCarouselIndex}
            />
          </div>
          <p>Carousel Index: {carouselIndex + 1} / {carouselItems.length}</p>
          <p className="coverage-event-log">{coverageEvent}</p>
        </Surface>
        <Surface aria-label="FR15 Edge Cases" as="aside" elevation={1} tonal>
          <h2>Edge-Case- und Fehlerfall-Nachweise</h2>
          <NavigationBar
            destinations={barDestinations}
            onValueChange={setNavigationBarValue}
            value={navigationBarValue}
          />
          <p>Navigation Bar aktiv: {navigationBarValue}</p>
          <SearchBar onSearch={(query) => setSearchResult(`Search fuer: ${query}`)} />
          <p>{searchResult}</p>
          <Tabs onValueChange={setTabValue} tabs={tabItems} value={tabValue} />
          <p>Aktiver Tab: {tabValue}</p>
          <div className="coverage-row coverage-row--two">
            <Switch checked={switchChecked} label="M3 Switch" onCheckedChange={setSwitchChecked} />
            <Slider
              label="Abdeckung"
              onValueChange={(nextValue) => setSliderValue(nextValue)}
              value={sliderValue}
            />
          </div>
          <p>
            Switch aktiv: {switchChecked ? 'ja' : 'nein'} | Slider: {sliderValue}
          </p>
          <Sheet placement="bottom" title="Bottom Sheet">
            <p>Bottom-Sheet-Standardbeispiel</p>
          </Sheet>
          <Sheet placement="side" title="Side Sheet">
            <p>Side-Sheet-Edge-Case mit gleichem API-Muster</p>
          </Sheet>
          <Divider orientation="vertical" />
        </Surface>
      </section>
      <Dialog
        description="Aenderungen werden sofort veroeffentlicht."
        onCancel={() => setEventMessage('Dialog geschlossen ohne Uebernahme.')}
        onConfirm={() => setEventMessage('Dialog bestaetigt und Status aktualisiert.')}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title="Aenderung speichern?"
      >
        <p>Nutze den Dialog fuer prioritaere Entscheidungen mit klarer Action-Hierarchie.</p>
      </Dialog>
      <AlertDialog
        cancelLabel="Abbrechen"
        confirmLabel="Loeschen"
        description="Dieser Schritt entfernt den Eintrag dauerhaft und kann nicht rueckgaengig gemacht werden."
        onCancel={() => setEventMessage('Destructive Confirm abgebrochen.')}
        onConfirm={() => setEventMessage('Destructive Confirm ausgefuehrt.')}
        onOpenChange={setAlertDialogOpen}
        open={alertDialogOpen}
        title="Destruktive Aktion bestaetigen"
      />
      <Snackbar
        actionLabel={snackbarTone === 'error' ? 'Erneut versuchen' : undefined}
        message={snackbarMessage}
        onAction={
          snackbarTone === 'error'
            ? () => setEventMessage('Retry fuer fehlgeschlagenen Vorgang gestartet.')
            : undefined
        }
        onDismiss={() => setEventMessage('Statusmeldung geschlossen.')}
        onOpenChange={setSnackbarOpen}
        open={snackbarOpen}
        tone={snackbarTone}
      />
    </div>
  )
}

export default App
