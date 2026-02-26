import { M3ReferenceCard } from './index'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="story-badge">Story 1.1 Startpunkt</p>
        <h1>M3 React Starter ist bereit</h1>
      </header>
      <M3ReferenceCard
        title="M3 Referenzkomponente"
        supportingText="Diese erste produktive Komponente verifiziert den lauffaehigen Starterpfad."
      />
    </main>
  )
}

export default App
