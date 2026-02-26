type M3ReferenceCardProps = {
  title: string
  supportingText?: string
}

export const M3_REFERENCE_FALLBACK_TEXT =
  'Material 3 Referenzkomponente fuer den Projektstart ist sichtbar gerendert.'

export function M3ReferenceCard({
  title,
  supportingText = M3_REFERENCE_FALLBACK_TEXT,
}: M3ReferenceCardProps) {
  return (
    <section className="m3-reference-card" role="region" aria-label="M3 Referenzkomponente">
      <h2>{title}</h2>
      <p>{supportingText}</p>
    </section>
  )
}
