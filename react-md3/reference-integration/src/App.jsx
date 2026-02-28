import {
  AlertDialog,
  Dialog,
  Surface,
} from 'react-md3'

export function App() {
  return (
    <main>
      <header>
        <h2>Reference Integration Smoke</h2>
        <p>Install -&gt; Build -&gt; Test</p>
      </header>
      <Surface as="section" aria-label="Reference integration panel" tonal>
        <section aria-label="Public API card">
          <h3>Public API only</h3>
          <p>Diese Referenzintegration nutzt ausschliesslich den Public Entry react-md3.</p>
        </section>
        <p aria-label="Dialog export vorhanden">
          Dialog exportiert: {String(Boolean(Dialog))} / AlertDialog exportiert: {String(Boolean(AlertDialog))}
        </p>
      </Surface>
    </main>
  )
}
