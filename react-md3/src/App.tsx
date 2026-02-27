import { useState } from 'react'

import { Button, Checkbox, M3ReferenceCard, RadioGroup, TextField } from './index'
import './App.css'

function App() {
  const [projectName, setProjectName] = useState('M3 Formular')
  const [newsletter, setNewsletter] = useState(false)
  const [contactMethod, setContactMethod] = useState('email')

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="story-badge">Story 2.3 Form/Selection</p>
        <h1>M3 Form &amp; Selection sind bereit</h1>
      </header>
      <M3ReferenceCard
        title="M3 Referenzkomponente"
        supportingText="Slice B erweitert die Basis um robuste Form- und Selection-Komponenten."
      />
      <section className="button-examples" aria-label="Button Beispiele">
        <h2>Action Controls: Button</h2>
        <div className="button-row">
          <Button>Standard Aktion</Button>
          <Button disabled>Disabled Aktion</Button>
          <Button loading>Loading Edge Case</Button>
        </div>
      </section>
      <section aria-label="Form Beispiele" className="form-examples">
        <h2>Form Controls: TextField</h2>
        <div className="form-grid">
          <TextField
            label="Projektname"
            onChange={(event) => setProjectName(event.target.value)}
            supportingText="Standardbeispiel mit kontrolliertem Value."
            value={projectName}
          />
          <TextField
            errorText="Bitte einen gueltigen API-Schluessel eingeben."
            label="API-Schluessel"
            placeholder="api_..."
          />
        </div>
      </section>
      <section aria-label="Selection Beispiele" className="selection-examples">
        <h2>Selection Controls: Checkbox &amp; RadioGroup</h2>
        <div className="selection-grid">
          <Checkbox
            checked={newsletter}
            label="Newsletter abonnieren"
            onChange={(event) => setNewsletter(event.target.checked)}
            supportingText="Standardbeispiel mit kontrolliertem Checked-State."
          />
          <Checkbox
            disabled
            label="AGB bestaetigen"
            required
            supportingText="Edge Case: disabled + required."
          />
          <RadioGroup
            label="Kontaktkanal"
            onValueChange={setContactMethod}
            options={[
              { label: 'E-Mail', value: 'email' },
              { label: 'Telefon', value: 'phone' },
            ]}
            supportingText={`Aktuell gewaehlt: ${contactMethod}`}
            value={contactMethod}
          />
          <RadioGroup
            errorText="Bitte Freigabestatus festlegen."
            label="Freigabestatus"
            options={[
              { label: 'Entwurf', value: 'draft' },
              { label: 'Freigegeben', value: 'released', disabled: true },
            ]}
          />
        </div>
      </section>
    </main>
  )
}

export default App
