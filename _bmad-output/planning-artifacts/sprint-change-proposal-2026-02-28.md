# Sprint Change Proposal - react

**Datum:** 2026-02-28  
**Ausloeser:** PRD-Korrektur auf explizite Material-3-Komponenten-Referenzliste (42 Eintraege, verbatim)  
**Modus:** Batch

## 1) Issue Summary

Im PRD wurde der Scope auf eine explizite 42er-Komponentenliste geschaerft. Dadurch sind Folgeartefakte nicht mehr konsistent:

- `epics.md` verwendet bei FR1/FR13/FR14/FR15 sowie NFR13/NFR14 noch die alte, weniger praezise Formulierung.
- Governance-Artefakte enthalten noch keinen expliziten 42/42-Traceability-Mechanismus.
- Code-Evidenz zeigt aktuell `12` exportierte Komponenten (`react-md3/src/components/index.ts`) und damit eine potenzielle Abdeckungsluecke gegen das PRD-Ziel `42/42`.

## 2) Impact Analysis

### Epic Impact

- **Epic 2** ist direkt betroffen (M3-Abdeckung und Nachweisfuehrung).
- **Epic 4** ist betroffen (Release-/Governance-Gates fuer Drift-Vermeidung).
- **Epic 1/5** sind indirekt betroffen (Doku-Referenzen, KPI-/Reporting-Konsistenz).

### Story Impact

- Bestehende Storytexte und Akzeptanzkriterien in Epic 2 brauchen Referenzlisten-Alignment.
- Neue Stories erforderlich:
  - **Story 2.6**: 42/42-Abdeckungsnachweis + Lueckenschliessung
  - **Story 4.4**: automatisiertes PRD↔Epics-Traceability-Gate

### Artifact Conflicts

- **PRD:** bereits aktualisiert (Quelle der Wahrheit).
- **Epics:** veraltet bzgl. FR/NFR-Wording und explizitem 42/42-Nachweis.
- **Architecture:** benoetigt explizite Verankerung eines Coverage-/Traceability-Gates.
- **Implementation Readiness Report:** basiert auf altem Stand und muss nachgezogen oder als historisch markiert werden.
- **UI/UX:** kein separates Dokument vorhanden (N/A).

### Technischer Impact

- Zusaetzlicher CI-Check fuer Drift-Erkennung zwischen PRD und Epics.
- Neue Umsetzungswelle fuer fehlende Komponenten plus Nachweisartefakt (Coverage-Matrix 42/42).

## 3) Recommended Approach

**Gewaehlter Pfad:** Hybrid, primär **Direct Adjustment** (Option 1), ohne Rollback, bei unveraendertem MVP-Ziel `42/42`.

### Begruendung

- Rollback (Option 2) adressiert nicht das Kernproblem (Alignment + Abdeckungsnachweis).
- MVP-Reduktion (Option 3) widerspricht der expliziten Nutzerentscheidung „MVP bleibt 42/42“.
- Direct Adjustment erhaelt Zielbild und schafft belastbare Governance gegen erneute Drift.

### Aufwand / Risiko / Timeline Impact

- **Aufwand:** Medium bis High
- **Risiko:** Medium
- **Timeline Impact:** zusaetzliche Sprint-Planung fuer neue Stories erforderlich

## 4) Detailed Change Proposals

### A) Stories / Epics

#### Proposal A1 - FR/NFR-Sync in `epics.md`

**OLD**
- `FR1: ... alle offiziell definierten Material-3-Komponenten ...`
- `FR13/FR14/FR15: ... pro Komponente ...`
- `NFR13: ... relevanter Komponenten`
- `NFR14: ... Kernkomponenten`

**NEW**
- `FR1: ... alle Eintraege der Material-3-Komponenten-Referenzliste ...`
- `FR13/FR14/FR15: ... pro Komponente der Material-3-Komponenten-Referenzliste ...`
- `NFR13/NFR14: ... Komponenten der Material-3-Komponenten-Referenzliste ...`

**Rationale:** Traceability auf den aktualisierten PRD-Stand und eindeutige Messbarkeit.

#### Proposal A2 - Epic-2-Zieltext praezisieren

**OLD**
- `Entwickler koennen alle offiziellen Material-3-Komponenten ...`

**NEW**
- `Entwickler koennen alle Eintraege der Material-3-Komponenten-Referenzliste (42, verbatim) ...`

**Rationale:** Scope-Unklarheit entfernen, 42/42 explizit verankern.

#### Proposal A3 - Neue Story 2.6 einfuegen

**Story:** `2.6 42/42-Komponentenabdeckung nachweisen und Restluecken schliessen`

**Akzeptanzkriterien (neu):**
- Given die PRD-Referenzliste mit 42 Eintraegen
- When eine Coverage-Matrix erstellt und geprueft wird
- Then ist jeder Referenzeintrag einem implementierten Komponentenartefakt zugeordnet oder als Luecke mit Umsetzungsplan dokumentiert
- And Abschlusskriterium ist `42/42` mit reproduzierbarem Nachweis

**Rationale:** Objektiver Zielnachweis und priorisierte Restumsetzung.

#### Proposal A4 - Neue Story 4.4 einfuegen

**Story:** `4.4 PRD↔Epics Traceability-Gate automatisieren`

**Akzeptanzkriterien (neu):**
- Given PRD + Epics als Planungsartefakte
- When CI-Traceability-Check laeuft
- Then driftet FR/NFR/KPI-Referenzierung nicht unbeobachtet
- And Build/Gate failt bei Abweichungen (mind. FR1/13/14/15, NFR13/14, KPI8-Referenz)

**Rationale:** Governance-Haertung gegen erneute Scope-/Requirements-Drift.

### B) PRD Modifications

- Keine weitere inhaltliche PRD-Aenderung erforderlich (PRD ist bereits aktualisiert und dient als Source of Truth).

### C) Architecture Changes

#### Proposal C1 - `architecture.md` um expliziten Coverage-/Traceability-Mechanismus erweitern

**OLD**
- Allgemeine Quality-Gate-Formulierungen ohne explizite 42/42-Kopplung.

**NEW**
- Expliziter Mechanismus: `PRD-Komponenten-Referenzliste (42) -> Coverage-Matrix -> CI Traceability Gate -> Release-Freigabe`.

**Rationale:** Architektur- und Governance-Alignment mit aktualisiertem Produktziel.

### D) Secondary Artifacts

#### Proposal D1 - `implementation-readiness-report-2026-02-26.md` aktualisieren oder historisieren

**OLD**
- Enthält alte FR/NFR-Formulierungen und alte Scope-Interpretation.

**NEW**
- Entweder: aktualisierte Formulierungen + Bezug auf 42/42
- Oder: klar als historischer Snapshot markieren und neuen Readiness-Report erzeugen

**Rationale:** Vermeidung widerspruechlicher Steuerungsgrundlagen.

## 5) Implementation Handoff

**Scope-Kategorie:** **Moderate** (Backlog-Reorganisation + Governance-Updates)

### Handoff-Empfaenger und Verantwortung

- **Product Owner / Scrum Master**
  - Story 2.6 und 4.4 in der Sprintplanung priorisieren und einplanen
  - Priorisierung und Sprint-Reihenfolge anpassen
  - `sprint-status.yaml` um neue Story-Eintraege erweitern (Status: `backlog`)

- **Development Team**
  - Coverage-Matrix erstellen
  - Restkomponenten gem. priorisierter Lueckenliste umsetzen
  - Traceability-Check implementieren

- **Architect / PM**
  - `architecture.md` und Governance-Definitionen aktualisieren
  - Scope-Konsistenz und Abnahmekriterien final sign-off

### Success Criteria fuer Umsetzung

- Planungsartefakte konsistent zu PRD (keine FR/NFR-Drift)
- Neue Stories formal vorhanden und priorisiert
- Nachweisbare Komponentenabdeckung `42/42`
- CI-gestuetztes Traceability-Gate aktiv

## Approval & Handoff Log

- **User Approval:** yes (erteilt)
- **Scope Classification:** Moderate
- **Routing:** Product Owner / Scrum Master fuer Backlog-Reorganisation, danach Dev + Architect fuer Umsetzung
- **Unmittelbar umgesetzt im Rahmen dieses Workflows:**
  - `epics.md` auf neuen FR/NFR-Stand gebracht
  - Story `2.6` und Story `4.4` angelegt
  - `sprint-status.yaml` um neue Story-Keys im Status `backlog` erweitert
