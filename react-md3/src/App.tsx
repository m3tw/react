import { M3ReferenceCard } from './index'
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
    </main>
  )
}

export default App
