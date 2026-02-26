---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - _bmad-output/planning-artifacts/research/technical-react-md3-shadcn-style-library-research-2026-02-26.md
  - _bmad-output/planning-artifacts/research/domain-react-md3-shadcn-style-library-research-2026-02-26.md
date: 2026-02-26
author: Darko
---

# Product Brief: react

## Executive Summary

react wird als quelloffene, Material-3-native React-Komponentenbibliothek positioniert, die die Nutzbarkeit von shadcn/ui mit einem konsequenten Material-3-Fokus verbindet. Das Produkt adressiert eine konkrete Luecke fuer Teams, die Material 3 in React einsetzen wollen, aber heute zwischen komplexen, aus Sicht des Nutzers eingeschraenkten oder nicht-M3-fokussierten Optionen waehlen muessen.

Der strategische Ansatz ist **"stabiler Kern + schneller Ausbau"**: ein hochwertiger v1-Kern mit klaren Qualitaetsstandards statt unkontrolliertem Big-Bang. Damit wird ein glaubwuerdiges Produktversprechen aufgebaut: exzellente Dokumentation mit vielen Beispielen, einfache Installation und Nutzung, stabile API sowie keine bekannten kritischen Fehler.

---

## Core Vision

### Problem Statement

Teams, die Material 3 mit React umsetzen moechten, finden keine Bibliothek, die zugleich vollstaendig genug, einfach nutzbar und hochwertig dokumentiert ist.

### Problem Impact

Bleibt das Problem ungeloest, wechseln Teams auf weniger passende Bibliotheken und akzeptieren Kompromisse bei Designsystem-Konsistenz, Entwicklungsaufwand und Entwicklerzufriedenheit.

### Why Existing Solutions Fall Short

- MUI wird als komplex wahrgenommen und aus Nutzersicht durch Paywalls eingeschraenkt.
- MUI deckt den gewuenschten Material-3-Fokus nicht ausreichend ab.
- shadcn/ui bietet gute Developer Experience, aber keinen Material-3-Fokus.
- Bestehende Material-3-Web-Component-Ansaetze wirken fuer React-Anwendungsfaelle unvollstaendig.

### Proposed Solution

Eine vollstaendig quelloffene React-Bibliothek mit klarem Material-3-Fokus und dokumentationsgetriebenem Ansatz. Der Start erfolgt mit einem belastbaren v1-Kern (Button, TextField, Select, Dialog, Card), der schnell ausgebaut wird. Prioritaet haben einfache Installation, stabile API und hohe Zuverlaessigkeit der Komponenten.

### Key Differentiators

- Dokumentation-first mit reichhaltigen Beispielen statt versteckter Wissenshuerden.
- Kein Paywall-Modell.
- Klare Produktstrategie: stabiler Kern + transparenter Ausbau.
- Qualitaetsversprechen mit konkreten Mindeststandards (Doku/Beispiele, einfache Nutzung, stabile API, keine kritischen bekannten Fehler).

## Target Users

### Primary Users

**Kernsegment:** Frontend-Entwickler, die Material 3 in React schnell, stabil und mit wenig Integrationsaufwand einsetzen wollen.

**Persona: Alex (Frontend-Entwickler)**
- **Kontext:** Produktteam mit hohem UI-Qualitaetsanspruch (einsetzbar in verschiedenen Umfeldern).
- **Ziel:** schnelle Installation, einfache Konfiguration, erste Komponente schnell produktiv.
- **Aktueller Workaround:** Nutzung anderer Bibliotheken mit Kompromissen.
- **Aha-Moment:** Komponenten funktionieren sofort und entsprechen der Material-3-Spezifikation.

### Secondary Users

Aktuell **noch zu validieren**. Potenzielle Gruppen (z. B. Designer, Tech Leads, Product Owner) werden als eigener Discovery-Backlog behandelt.

### User Journey

- **Discovery (Annahmen):** GitHub, Suchmaschinen, X/Twitter.
- **Onboarding:** Getting-Started-Seite -> Installationsbefehle kopieren -> CLI-Installation -> automatische fehlerfreie Konfiguration.
- **Core Usage:** Komponenten auswaehlen (oder alle) und direkt in den Entwicklungsalltag integrieren.
- **Success Moment:** Erste Komponenten laufen sofort material-3-konform.
- **Long-term:** Taegliche Nutzung in der Entwicklung.

## Success Metrics

Erfolg bedeutet, dass reale Projekte die Bibliothek produktiv einsetzen und Nutzer extrem schnell zum ersten funktionierenden Material-3-Ergebnis kommen.

**User Success (outcome-orientiert):**
- Nachweisbare produktive Nutzung in externen Projekten.
- Time-to-Value: Nutzer kommen im Regelfall in <= 5 Minuten zur ersten laufenden Komponente.
- Getting-Started-Erfolg: >= 90% erfolgreiche Erst-Setups.
- Produktqualitaet: 0 offene kritische Bugs in Stable-Releases.

### Business Objectives

**Primaeres Ziel:** Adoption & Community-Trust aufbauen.

- **3 Monate:** >= 10 aktive Projekte, >= 50 GitHub Stars, >= 30% Time-to-Value unter 5 Minuten.
- **12 Monate:** >= 100 aktive Projekte, >= 500 GitHub Stars, >= 60% Time-to-Value unter 5 Minuten.

### Key Performance Indicators

- **KPI 1 - Aktive Projekte:** Anzahl aktiver Projekte mit Bibliotheksnutzung (monatlich).
- **KPI 2 - Community Signal:** GitHub Stars als frueher Trust-Indikator (monatlich).
- **KPI 3 - Time-to-First-Component:** Anteil Nutzer mit erster laufender Komponente in <= 5 Minuten.
- **KPI 4 - Getting-Started Success Rate:** Erfolgreiche Erst-Setups / Gesamt-Setups.
- **KPI 5 - Release Health:** Anzahl offener kritischer Bugs pro Stable-Release.
- **KPI 6 - Doku-Qualitaet:** Anteil erfolgreich abgeschlossener Getting-Started-Tutorials.

## MVP Scope

### Core Features

- Vollstaendige Umsetzung **aller** offiziellen Material-3-Komponenten gemaess Referenz: https://m3.material.io/components
- React-native API-Umsetzung mit Fokus auf einfache Installation und Konfiguration.
- Nutzbare, reichhaltige Dokumentation mit Beispielen fuer produktive Integration.
- Stabile, alltagstaugliche Komponentenqualitaet fuer den taeglichen Einsatz.

### Out of Scope for MVP

- Figma-Plugin
- Analytics-Features
- Bezahlte Cloud-Features
- Enterprise-Support-Angebote

### MVP Success Criteria

MVP gilt als erfolgreich, wenn die bereits definierten Success Metrics erreicht werden:
- 3 Monate: >= 10 aktive Projekte, >= 50 GitHub Stars, >= 30% Time-to-Value < 5 Min
- 12 Monate: >= 100 aktive Projekte, >= 500 GitHub Stars, >= 60% Time-to-Value < 5 Min
- Qualitaetskriterien: 0 offene kritische Bugs pro Stable-Release, >= 90% erfolgreiche Erst-Setups

### Future Vision

- Nach erfolgreicher Etablierung der M3-Bibliothek: Migration/Erweiterung auf **Material 4**, sobald verfuegbar.

<!-- Content will be appended sequentially through collaborative workflow steps -->
