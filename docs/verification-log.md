# Verification log

Each stage records what passed and what remains unverified.

## Stage 1 — Foundation, identity and content spine — 2026-11-07
**Passed:** React 19 + TS + Vite scaffold with GitHub Pages base
(`/dundrodtt/`, hash routing); full design system from the master palette
(film grain, paper, glass, gold/copper accents, Fraunces + Archivo
self-hosted); accessible shell (skip link, dialog menu, keyboard/touch
parity, reduced motion) with all seven experiences plus Acknowledgements;
zustand store; complete static JSON content set (6 years, 12 races with
classification-correct results, 21 people, 7 teams, 15 cars, 13
locations, 3 incidents, 24 sources, 2 acknowledgements) generated/
authored from verified sources; all 46 photographs served under stable
register-ID asset names with the spreadsheet File path kept verbatim as
catalogue identity; content validator green (46↔46, refs, exclusions,
corrections register); `tsc --noEmit` clean; 13/13 Vitest tests (content
invariants, review-note never renders, hidden acknowledgement never
renders); 4/4 Playwright e2e (headline + distinction, all-experience
navigation, 1952 facts, archive images load) against system Chrome via
CHROME_PATH; production build 97 kB gzipped JS.
**Unverified / outstanding:** ArcGIS packages deliberately deferred to
Stage 5 (seam in place; keeps builds light); Playwright browser download
blocked in this environment (system Chrome used — CI should
`npx playwright install chromium`); original `#`-containing filenames
confirmed unservable on static hosts (hence register-ID serving); plus
all pre-stage outstanding items below.

## Pre-stage (documentation & architecture) — 2026-11-07
**Passed:** all three primary materials inspected; spreadsheet audited —
46 records, 44 include=Yes, duplicate and portrait handled as catalogued;
all 46 File paths verified against extracted photographs (zero missing,
zero orphans); image-size survey done (44/46 under 800 px wide); NFD→NFC
filename issue identified with handling rule; ArcGIS SDK 5.1 package
pattern confirmed (@arcgis/map-components, @arcgis/core ^5.1,
@esri/calcite-components ^5.1).
**Unverified / outstanding:** UAC history PDF not yet supplied (R02);
ArcGIS FeatureLayer not yet supplied; no authorised film links; no modern
photography for Dundrod Today; second contributor's name unknown;
Belfast Telegraph display permission unconfirmed; four photo records
carry confirm-before-publication notes; hero-candidate PNG has a baked-in
viewer icon.
