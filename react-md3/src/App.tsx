import { useState } from 'react'

import {
  AlertDialog,
  Button,
  Dialog,
  NavigationDrawer,
  NavigationRail,
  Snackbar,
  Surface,
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

type SnackbarTone = keyof typeof feedbackMessages

function App() {
  const [activeDestination, setActiveDestination] = useState('dashboard')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarTone, setSnackbarTone] = useState<SnackbarTone>('success')
  const [snackbarMessage, setSnackbarMessage] = useState<string>(feedbackMessages.success)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [eventMessage, setEventMessage] = useState('Keine kritischen Ereignisse.')

  const openFeedback = (tone: SnackbarTone) => {
    setSnackbarTone(tone)
    setSnackbarMessage(feedbackMessages[tone])
    setSnackbarOpen(true)
  }

  return (
    <div className="app-shell">
      <p className="story-badge">Story 2.5 Feedback/Overlay</p>
      <TopAppBar
        actions={[
          { label: 'Suche' },
          { label: 'Sync pausiert', disabled: true },
          { label: 'Versteckte Aktion', hidden: true },
        ]}
        ariaLabel="Produktkopfzeile"
        supportingText="Snackbar, Dialog und AlertDialog folgen einem konsistenten M3-Muster."
        title="M3 Feedback & Overlay sind bereit"
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
