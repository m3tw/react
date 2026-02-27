import { Button, M3ReferenceCard } from './index'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="story-badge">Story 1.3 Getting Started</p>
        <h1>M3 Getting Started ist bereit</h1>
      </header>
      <M3ReferenceCard
        title="M3 Referenzkomponente"
        supportingText="Diese erste produktive Komponente verifiziert den lauffaehigen 5-Minuten-Flow."
      />
      <section className="button-examples" aria-label="Button Beispiele">
        <h2>Action Controls: Button</h2>
        <div className="button-row">
          <Button>Standard Aktion</Button>
          <Button disabled>Disabled Aktion</Button>
          <Button loading>Loading Edge Case</Button>
        </div>
      </section>
    </main>
  )
}

export default App
