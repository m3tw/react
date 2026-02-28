---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
  - step-e-01-discovery
  - step-e-02-review
  - step-e-03-edit
  - step-e-04-complete
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-react-2026-02-26.md
  - _bmad-output/planning-artifacts/research/technical-react-md3-shadcn-style-library-research-2026-02-26.md
  - _bmad-output/planning-artifacts/research/domain-react-md3-shadcn-style-library-research-2026-02-26.md
documentCounts:
  briefCount: 1
  researchCount: 2
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: developer_tool
  domain: general
  complexity: medium
  projectContext: greenfield
workflowType: 'prd'
workflow: 'edit'
lastEdited: '2026-02-28'
editHistory:
  - date: '2026-02-28'
    changes: 'Material-3-Komponenten-Referenzliste ergänzt und Scope/FR/KPI/Gates darauf ausgerichtet.'
---

# Product Requirements Document - react

**Author:** Darko
**Date:** 2026-02-26

## Executive Summary

Das Produkt ist eine React-Komponentenbibliothek mit klarem Material-3-Fokus, die Teams in kurzer Zeit produktiv macht und langfristig stabil nutzbar bleibt. Es adressiert den Bedarf nach einer vollständig nutzbaren M3-Option für React, ohne Lizenzhürden und ohne unnötige Integrationskomplexität. Ziel ist ein belastbarer Kern mit hoher API-Stabilität, hoher Dokumentationsqualität und schneller Time-to-Value für Entwicklerteams.

### Was dieses Produkt besonders macht

Die Bibliothek kombiniert vier Differenzierungsfaktoren: vollständige M3-Ausrichtung, vollständige Kostenfreiheit, dokumentationsgetriebene Developer Experience und ein qualitätsorientierter Ausbaupfad. Der Kernnutzen ist, dass Teams M3-Konsistenz ohne Integrationsfriktion und ohne Paywall erreichen. Der strategische Vorteil liegt in der Verbindung aus klarer Produktpositionierung (M3 für React) und operativer Verlässlichkeit (stabile API, nachvollziehbarer Ausbau, produktionsnahe Qualität).

## Project Classification

- Project Type: developer_tool
- Domain: general
- Complexity: medium
- Project Context: greenfield

## Success Criteria

### User Success

- Teams bringen die erste produktive M3-Komponente in <= 5 Minuten zum Laufen.
- Getting-Started-Flow ist reproduzierbar und führt bei >= 90% der Erstnutzer zu einem erfolgreichen Setup.
- Nutzer können Kern-Integrationsaufgaben ohne Blocker über Doku/Beispiele abschließen.

### Business Success

- 3 Monate nach Release: >= 10 aktive Projekte, >= 50 GitHub Stars, >= 30% Time-to-Value <= 5 Minuten.
- 12 Monate nach Release: >= 100 aktive Projekte, >= 500 GitHub Stars, >= 60% Time-to-Value <= 5 Minuten.
- „Aktive Projekte“ = produktive Nutzung plus fortlaufende Nutzung im definierten Zeitfenster.
- Reichweitenmetriken werden mit Nutzungsqualität kombiniert (z. B. Anteil neuer Nutzer mit 30-Tage-Weiterverwendung).

### Technical Success

- 0 offene kritische Bugs pro Stable-Release.
- 0 kritische API-Regressionen nach Stable-Releases.
- Stabile, rückwärtskompatible API-Entwicklung mit kontrollierten Breaking Changes.
- Dokumentationsqualität als technischer Qualitätsfaktor: Beispiele sind lauffähig und konsistent zur aktuellen API.

### Measurable Outcomes

- KPI 1: Anzahl aktiver Projekte (monatlich).
- KPI 2: GitHub Stars als Trust-/Reach-Signal (monatlich).
- KPI 3: Anteil Nutzer mit erster laufender Komponente in <= 5 Minuten.
- KPI 4: Getting-Started Success Rate.
- KPI 5: Offene kritische Bugs pro Stable-Release.
- KPI 6: Anteil erfolgreich abgeschlossener Getting-Started-Tutorials.
- KPI 7: Anteil neuer Nutzer mit fortlaufender Nutzung nach 30 Tagen.
- KPI 8: Komponentenabdeckung gemäß Material-3-Komponenten-Referenzliste (Ziel: 42/42 Einträge umgesetzt).

## Product Scope

### MVP - Minimum Viable Product

- Vollständige Umsetzung der Material-3-Komponenten-Referenzliste für React (42 Einträge, verbatim).
- Kostenfreie Nutzung ohne Paywall.
- Stabile API und produktionsnahe Komponentenqualität.
- Dokumentation mit ausreichend Beispielen für produktiven Einsatz.

### Material-3-Komponenten-Referenzliste (verbatim)

- App bars, Badges, Buttons, All buttons, Button groups, Buttons, Extended FABs, FAB menu, FABs, Icon buttons, Segmented buttons, Split button, Cards, Carousel, Checkbox, Chips, Date & time pickers, Date pickers, Time pickers, Dialogs, Divider, Lists, Loading & progress, Loading indicator, Progress indicators, Menus, Navigation, Navigation bar, Navigation drawer, Navigation rail, Radio button, Search, Sheets, Bottom sheets, Side sheets, Sliders, Snackbar, Switch, Tabs, Text fields, Toolbars, Tooltips

### Growth Features (Post-MVP)

- Ausbau von Dokumentationstiefe, praxisnahen Beispiel-Sammlungen und Integrationsrezepten.
- Verbesserte Onboarding- und Migrationspfade für verschiedene Team-Setups.
- Höhere Integrationsgeschwindigkeit durch bessere Referenzimplementierungen.

### Vision (Future)

- Langfristig führende M3-React-Bibliothek mit hoher Verlässlichkeit in produktiven Teams.
- Fokus bleibt auf Material 3 (keine explizite M4-Erweiterung im aktuellen Zielbild).
- Kontinuierliche Qualitätssteigerung über API-Stabilität, Doku-Exzellenz und Nutzbarkeit im Alltag.

## User Journeys

### 1) Primary User - Success Path (Alex, Frontend-Entwickler)

**Opening Scene:** Alex startet ein neues React-Feature und braucht Material-3-konforme UI ohne langes Setup.  
**Rising Action:** Er folgt der Getting-Started-Doku, installiert die Library, übernimmt ein Beispiel und integriert die erste Komponente.  
**Climax/Aha-Moment:** Die erste produktive Komponente läuft in <= 5 Minuten und verhält sich erwartbar nach M3.  
**Resolution:** Alex gewinnt Vertrauen, nutzt weitere Komponenten und reduziert Implementierungszeit sowie Design-Abweichungen.  
**Erfolgsindikator:** Time-to-First-Component <= 5 Minuten.

### 2) Primary User - Edge Case (Alex, Fehler-/Recovery-Pfad)

**Opening Scene:** Bei einer komplexeren Komponente tritt ein Integrationskonflikt (Theming/Props-Interaktion) auf.  
**Rising Action:** Alex nutzt Troubleshooting-Doku, Referenzbeispiele und reproduziert den Fehler kontrolliert.  
**Climax/Aha-Moment:** Der Konflikt ist sauber gelöst, ohne technische Schulden durch Workarounds.  
**Resolution:** Alex erlebt die Library als verlässlich, weil Recovery-Pfade dokumentiert und stabil sind.  
**Erfolgsindikator:** Time-to-Recovery für dokumentierte Edge Cases.

### 3) Secondary User - Library Maintainer

**Opening Scene:** Vor einem Stable-Release muss der Maintainer Qualität und API-Stabilität absichern.  
**Rising Action:** Er prüft kritische Bugs, API-Regressionen, Beispiel-Lauffähigkeit und Release-Checkliste.  
**Climax/Aha-Moment:** Das Release erfüllt alle Gate-Kriterien (keine kritischen Bugs, keine kritischen API-Regressionen).  
**Resolution:** Veröffentlichung mit hoher Sicherheit; Nutzer erhalten vorhersehbare und stabile Updates.  
**Erfolgsindikator:** Release-Pass-Rate nach Quality Gates.

### 4) API/Integration User - Integrations-Entwickler

**Opening Scene:** Ein Integrations-Entwickler bindet die Library in einen bestehenden Produkt-Stack mit eigenen Build-/Theme-Konventionen ein.  
**Rising Action:** Er nutzt Integrationsrezepte, passt Konfiguration an und validiert Kompatibilität in CI.  
**Climax/Aha-Moment:** Integration läuft ohne Bruch im bestehenden Entwicklungsworkflow.  
**Resolution:** Die Library wird teamweit als Standardbaustein für neue Features etabliert.  
**Erfolgsindikator:** Integrationsdurchlauf in CI ohne kritische Anpassungsfehler.

### 5) Support/Troubleshooting Journey

**Opening Scene:** Ein Support-Verantwortlicher bearbeitet ein Nutzerproblem mit einer fehlerhaften Implementierung.  
**Rising Action:** Er nutzt reproduzierbare Fehlerbilder, bekannte Workarounds und klare Eskalationspfade.  
**Climax/Aha-Moment:** Ursache und Fix sind eindeutig, der Nutzerfall wird ohne langes Ping-Pong geschlossen.  
**Resolution:** Support-Aufwand sinkt, da Probleme schneller triagiert und gelöst werden.  
**Erfolgsindikator:** Mean Time to Resolution (MTTR) für wiederkehrende Integrationsprobleme.

### Journey Requirements Summary

- **Onboarding & Setup:** schneller Einstieg, klare Getting-Started-Pfade, reproduzierbare Erstintegration.
- **Troubleshooting & Recovery:** dokumentierte Fehlerbilder, belastbare Fix-Pfade, Edge-Case-Beispiele.
- **Release Governance:** Qualitätstore für Bugs, API-Regressionen und Doku-Konsistenz.
- **Integrationstiefe:** belastbare Rezepte für bestehende Stacks und CI-validierte Integrationen.
- **Supportfähigkeit:** klare Triage- und Eskalationspfade für Produktionsprobleme.
- **Wiederverwendung:** konsistente API/DX, damit Teams die Library als Standard in Folgethemen einsetzen.

## Domain-Specific Requirements

### Compliance & Regulatory

- Keine domain-spezifischen regulatorischen Vorgaben (kein Healthcare/Fintech/Gov-Regime).
- Mindeststandard für Vertrauen: transparente Dependency- und Release-Herkunft über nachvollziehbare Supply-Chain-Signale.

### Technical Constraints

- Strikte API-Stabilität und nachvollziehbare Versionierung (SemVer-Disziplin).
- Explizite Kompatibilitätsmatrix für unterstützte React-/Node-/Build-Umfelder.
- Reproduzierbare Qualität über stabile Beispiele, Regressionstests und klare Release-Gates.

### Integration Requirements

- Verlässliche Integration in bestehende React-Toolchains ohne invasive Anpassungen.
- Dokumentierte Integrationsrezepte für typische Team-Setups.
- Klarer Migrationspfad bei Breaking Changes und nachvollziehbare Changelogs.

### Risk Mitigations

- Risiko: Scope-Überdehnung bei kompletter M3-Abdeckung -> Gegenmaßnahme: priorisierte Release-Phasen und harte Qualitätsgates.
- Risiko: API-Drift/Regression -> Gegenmaßnahme: API-Review-Disziplin und Regression-Checks vor Stable-Releases.
- Risiko: Integrationsfriktion in realen Projekten -> Gegenmaßnahme: CI-validierte Referenzintegration und Troubleshooting-Pfade.
- Risiko: Scope-Drift ohne Governance -> Gegenmaßnahme: definierte Schwellenwerte für aktiven Scope-Schnitt.

## Developer Tool Specific Requirements

### Project-Type Overview

react ist als Developer Tool auf hohe Integrationsgeschwindigkeit, API-Verlässlichkeit und langfristige Wartbarkeit ausgerichtet. Der Produktkern ist eine Material-3-React-Library mit klarer DX-Priorität und reproduzierbarer Nutzung im Teamalltag.

### Technical Architecture Considerations

- Public API muss stabil, klar versioniert und für TypeScript/JavaScript gleichermaßen nutzbar sein.
- Toolchain-Kompatibilität umfasst npm, pnpm, yarn und bun.
- IDE-Ergonomie ist Teil des Produktwerts (Type Hints, IntelliSense, brauchbare API-Tooltips).
- Doku ist produktionskritisch und muss zur veröffentlichten API synchron bleiben.

### Language Matrix

- Primär: TypeScript.
- Konsum: TypeScript + JavaScript.
- Alle öffentlichen APIs müssen für beide Zielgruppen eindeutig dokumentiert und nutzbar sein.

### Installation Methods

- Offiziell unterstützte Installationspfade: npm, pnpm, yarn, bun.
- Installationsanleitungen müssen pro Package Manager validiert und aktuell gehalten werden.

### API Surface

- Konsistente, vorhersehbare und semver-konforme API-Entwicklung.
- Keine kritischen API-Regressionen in Stable-Releases.
- Breaking Changes nur mit klaren Migrationsempfehlungen.
- Explizite Deprecation-Policy mit angekündigtem Vorlauf vor Entfernung/Änderung.

### Code Examples

- Pro Komponente mindestens ein praxisnahes Standardbeispiel.
- Zusätzlich pro Komponente mindestens ein Edge-Case-/Fehlerfall-Beispiel.
- Beispiele müssen ausführbar und CI-validierbar sein.
- Qualitätsstandard je Beispielset: Happy Path + Edge Case + Troubleshooting-Verweis.

### Migration Guide

- Verbindlicher Migration Guide für relevante Versionssprünge.
- Changelog und Migrationsempfehlungen müssen zusammenhängend und handlungsorientiert sein.

### Implementation Considerations

- Qualitätsgates koppeln API-Stabilität, Doku-Konsistenz und Beispiel-Lauffähigkeit.
- Integrationsrezepte priorisieren reale Team-Szenarien gegenüber Demo-Only-Inhalten.
- Developer Experience wird als messbare Erfolgsdimension behandelt, nicht nur als Nice-to-have.
- Kompatibilitäts-Policy folgt einem klaren Fenster (aktuelle + LTS-relevante Umfelder).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience-MVP (beste DX schnell liefern bei gleichzeitig vollständiger M3-Abdeckung).  
**Resource Requirements:** Kernteam 3-5 Personen mit Skills in React/TypeScript, Design-System und QA/Release.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Alex Success Path (erste produktive Komponente <= 5 Minuten)
- Alex Edge Case Recovery
- Integrations-Entwickler Journey
- Maintainer Release-Quality Journey
- Support/Troubleshooting Journey

**Must-Have Capabilities:**
- Vollständige Umsetzung der Material-3-Komponenten-Referenzliste (42 Einträge, verbatim).
- Stabile semver-konforme API mit klarer Deprecation-Policy.
- Offiziell unterstützte Installation via npm/pnpm/yarn/bun.
- Pro Komponente lauffähige Beispiele (Happy Path + Edge Case + Troubleshooting-Verweis).
- Release-Gates für kritische Bugs/API-Regressionen.
- Phase-1-Steuerung über Komponentenfamilien mit klaren Fertigstellungsgates.

### Post-MVP Features

**Phase 2 (Post-MVP):**
- Ausbau von Dokumentationstiefe und Integrationsrezepten.
- Verbesserte Migrations- und Onboarding-Pfade für Teams.
- Erhöhte Integrationsgeschwindigkeit über referenznahe Praxisbeispiele.

**Phase 3 (Expansion):**
- Skalierung des Ökosystems (weiterer Ausbau von Tooling/Workflows).
- Reifegrade bei Qualität, Stabilität und Community-Adoption weiter erhöhen.
- Systematische Erweiterung für breitere Einsatzszenarien im React-Ökosystem.

### Risk Mitigation Strategy

**Technical Risks:** Vollständige M3-Abdeckung kann Delivery verlangsamen -> Mitigation: priorisierte Release-Phasen, harte Quality Gates, klare Scope-Schnittregeln.  
**Market Risks:** Adoption gegen etablierte Alternativen -> Mitigation: klarer Differenzierungsfokus (M3 + kostenlos + starke DX), Pilot-Adoptionsfenster und schnelle Time-to-Value.  
**Resource Risks:** Teamkapazität für Komponenten + Doku + QA -> Mitigation: Kernteam-Fokus, sequenziertes Rollout, Priorisierung auf journeys-kritische Deliverables.

### Phase Transition Criteria

- Übergang Phase 1 -> Phase 2 nur bei erfüllten Go/No-Go-Kriterien (z. B. Setup-Erfolgsrate, kritische Bugs, API-Stabilität, 42/42 Einträge der Material-3-Komponenten-Referenzliste umgesetzt).
- Übergang Phase 2 -> Phase 3 nur bei belastbarer Nutzungsqualität und nachgewiesener Integrationsreife.

## Functional Requirements

### Component Delivery & Usage

- FR1: Frontend-Entwickler können alle Einträge der Material-3-Komponenten-Referenzliste in React nutzen.
- FR2: Frontend-Entwickler können Komponenten in bestehenden React-Anwendungen ohne Neuaufbau der Anwendung einführen.
- FR3: Frontend-Entwickler können Komponenten konsistent mit Material-3-Prinzipien einsetzen.
- FR4: Frontend-Entwickler können Komponenten für produktive Nutzung in realen Features verwenden.
- FR5: Frontend-Entwickler können Komponenten kontrolliert an ihren Produktkontext anpassen.

### Installation & Setup Experience

- FR6: Entwickler können die Library über offiziell unterstützte Package-Manager installieren.
- FR7: Entwickler können eine erste produktive Komponente in einem klaren Getting-Started-Flow integrieren.
- FR8: Teams können Installations- und Setup-Schritte reproduzierbar in mehreren Projekten anwenden.

### API Contract & Lifecycle

- FR9: Entwickler können sich auf eine dokumentierte öffentliche API verlassen.
- FR10: Entwickler können Änderungen an der öffentlichen API über versionierte Releases nachvollziehen.
- FR11: Entwickler können bei relevanten API-Änderungen auf dokumentierte Migrationshinweise zugreifen.
- FR12: Maintainer können API-Änderungen entlang einer klaren Deprecation-Policy kommunizieren.

### Documentation & Example Coverage

- FR13: Entwickler können für jede Komponente der Material-3-Komponenten-Referenzliste auf eine API-Beschreibung zugreifen.
- FR14: Entwickler können pro Komponente der Material-3-Komponenten-Referenzliste mindestens ein praxisnahes Standardbeispiel nutzen.
- FR15: Entwickler können pro Komponente der Material-3-Komponenten-Referenzliste mindestens ein Edge-Case- oder Fehlerfall-Beispiel nutzen.
- FR16: Entwickler können zu typischen Integrationsproblemen konkrete Troubleshooting-Anleitungen finden.
- FR17: Entwickler können Integrationsrezepte für gängige Team-Setups finden.

### Integration & Compatibility

- FR18: Integrations-Entwickler können die Library mit unterstützten React-/Node-/Build-Umfeldern einsetzen.
- FR19: Integrations-Entwickler können Kompatibilitätsinformationen für unterstützte Umfelder einsehen.
- FR20: Teams können die Library in CI-validierten Entwicklungsabläufen betreiben.

### Quality Governance & Release Readiness

- FR21: Maintainer können Releases anhand definierter Qualitätskriterien bewerten.
- FR22: Maintainer können sicherstellen, dass kritische Fehler vor Stable-Releases adressiert sind.
- FR23: Maintainer können dokumentierte Beispiel- und API-Konsistenz vor Releases prüfen.
- FR24: Product-/Maintainer-Verantwortliche können Phasenübergänge über definierte Go/No-Go-Kriterien steuern.

### Support & Recovery Capabilities

- FR25: Support-Verantwortliche können wiederkehrende Integrationsprobleme mit dokumentierten Pfaden triagieren.
- FR26: Entwickler können bei Fehlerszenarien strukturierte Recovery-Pfade anwenden.
- FR27: Teams können bekannte Problemklassen und empfohlene Lösungswege zentral nachvollziehen.

### Adoption & Product Learning

- FR28: Product-Verantwortliche können aktive Nutzung über definierte Aktivitätskriterien bewerten.
- FR29: Product-Verantwortliche können Time-to-Value und Setup-Erfolg als Produktfortschritt verfolgen.
- FR30: Product-Verantwortliche können Nutzungsqualität über Weiterverwendung im Zeitverlauf bewerten.
- FR31: Product-Verantwortliche können einheitliche Messdefinitionen für Kernmetriken verbindlich anwenden.
- FR32: Product-Verantwortliche können Nutzerfeedback strukturiert erfassen und in Priorisierungsentscheidungen einfließen lassen.

## Non-Functional Requirements

### Performance

- Referenzbeispiele und Dokumentationsseiten sind im üblichen Entwicklungsumfeld in <= 2 Sekunden interaktiv.
- Kerninteraktionen in Referenzbeispielen erfolgen ohne wahrnehmbare Verzögerung für den Nutzer.
- Performance-Abweichungen in Kernpfaden werden vor Stable-Releases bewertet und adressiert.

### Security

- 0 offene kritische Security-Vulnerabilities in Release-Dependencies.
- Release-Artefakte müssen nachvollziehbare Supply-Chain-/Provenance-Signale aufweisen.
- Zugriffs- und Veröffentlichungsprozesse werden nach Least-Privilege-Prinzip geführt.
- Security-Prüfungen erfolgen vor jedem Stable-Release und regelmäßig im Entwicklungszyklus.

### Scalability

- Release- und Support-Prozesse bleiben auch bei 10x Nutzerwachstum funktionsfähig.
- Kernqualitätsmetriken (kritische Bugs, API-Regressionen, Setup-Erfolg) dürfen bei Wachstum nicht signifikant degradieren.
- Priorisierungs- und Delivery-Prozesse sind auf steigende Komponenten- und Integrationslast ausgelegt.

### Accessibility

- Komponenten erfüllen WCAG-2.2-AA-konforme Grundanforderungen.
- Accessibility-Anforderungen sind Bestandteil der Qualitätsprüfung vor Stable-Releases.
- Dokumentation enthält Hinweise für barrierearme Nutzung der Komponenten der Material-3-Komponenten-Referenzliste.
- Komponenten der Material-3-Komponenten-Referenzliste müssen eine explizit dokumentierte Accessibility-Abdeckung aufweisen.

### Integration

- Unterstützte React-/Node-/Package-Manager-Matrix muss in CI reproduzierbar grün sein.
- Integrationsrezepte für Standard-Setups müssen aktuell, lauffähig und konsistent zur API sein.
- Breaking Changes erfordern dokumentierte Migrationspfade für betroffene Integrationen.

### Reliability

- Stable-Releases enthalten keine kritischen bekannten Regressionen.
- Für Release-Probleme existiert ein klarer Rollback-/Hotfix-Prozess.
- Kritische Release-Probleme müssen innerhalb eines klar definierten Reaktionsziels adressiert werden.
- Qualitätsgates für API-Konsistenz, Beispiel-Lauffähigkeit und kritische Defekte sind vor Release verpflichtend.
