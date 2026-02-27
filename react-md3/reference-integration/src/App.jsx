import {
  AlertDialog,
  Dialog,
  M3ReferenceCard,
  Surface,
  TopAppBar,
} from 'react-md3'

export function App() {
  return (
    <main>
      <TopAppBar
        actions={[{ label: 'Run smoke check' }]}
        supportingText="Install -> Build -> Test"
        title="Reference Integration Smoke"
      />
      <Surface as="section" aria-label="Reference integration panel" tonal>
        <M3ReferenceCard
          supportingText="Diese Referenzintegration nutzt ausschliesslich den Public Entry react-md3."
          title="Public API only"
        />
        <p aria-label="Dialog export vorhanden">
          Dialog exportiert: {String(Boolean(Dialog))} / AlertDialog exportiert: {String(Boolean(AlertDialog))}
        </p>
      </Surface>
    </main>
  )
}
