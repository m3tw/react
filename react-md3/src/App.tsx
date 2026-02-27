import { useState } from 'react'

import { NavigationDrawer, NavigationRail, Surface, TopAppBar } from './index'
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

function App() {
  const [activeDestination, setActiveDestination] = useState('dashboard')

  return (
    <div className="app-shell">
      <p className="story-badge">Story 2.4 Navigation/Surfaces</p>
      <TopAppBar
        actions={[
          { label: 'Suche' },
          { label: 'Sync pausiert', disabled: true },
          { label: 'Versteckte Aktion', hidden: true },
        ]}
        ariaLabel="Produktkopfzeile"
        supportingText="AppBar, Navigation und Surface folgen einem konsistenten M3-Muster."
        title="M3 Navigation & Surfaces sind bereit"
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
          <h1>Navigation Surface Referenzlayout</h1>
          <p>Aktive Destination: {activeDestination}</p>
          <p>Disabled + Hidden Eintraege bleiben sichtbar steuerbar und ohne Deep-Import-Abhaengigkeit.</p>
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
          </ul>
        </Surface>
      </section>
    </div>
  )
}

export default App
