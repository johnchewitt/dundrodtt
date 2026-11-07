# Verification log

Each stage records what passed and what remains unverified.

## Stage 3 — Interactive circuit explorer — 2026-11-07
**Passed:** the circuit experience is built end-to-end around the
owner's still-awaited FeatureLayer (owner confirmed: not ready yet,
will be shared publicly, no API key). Selection model is
backend-independent: the 13-location landmark catalogue (period names,
chips) drives a floating glass story panel with verified stories,
restrained incident records (Deer's Leap, Tornagrough), documented-year
links into the seasons, honest no-verified-photographs and
geometry-pending states, and source references — all working today
without the map. ArcGIS Maps SDK installed (@arcgis/map-components +
core + calcite 5.2.1, satisfies ^5.1); the explorer module
(ArcGisExplorer) is lazy-loaded ONLY when `routeLayerUrl` is set:
dark/satellite keyless basemaps, illuminated gold route (glow + line
renderers), labelled landmark layer, hitTest click → locId → panel,
catalogue selection → camera goTo, load-error state, and the guided
"Take a Lap" built on a pure, fully unit-tested LapEngine
(play/pause/skip/restart/exit, dwell sequencing, reduced-motion instant
jumps, no racing-speed simulation). Layer schema contract documented in
docs/architecture.md (locId/name/seq). Gates: validator; tsc; oxlint;
Vitest 17/17 (4 new LapEngine tests); Playwright 16/16 (2 new: Deer's
Leap panel + sensitive text + year link; honest no-map states with
zero ArcGIS chunks requested); build — ArcGIS fully code-split, main
bundle ~349 KB raw.
**Not executed (honestly):** live map rendering, geometry/coordinate
verification, landmark positions, camera behaviour on real geometry,
2D/3D transitions, FeatureLayer query performance, Then & Now against
satellite imagery — all require the owner's verified circuit layer;
the schematic fallback and honest states cover every surface
meanwhile. 3D scene option and Then & Now swipe are scoped to light up
after the layer lands (both need real geometry to be anything but
pretence).
**Uncertainty documented:** all 13 locations carry
`geometryStatus: "pending"`; no photo↔location links exist because the
catalogue records no verified photographic locations — none invented,
no "Show on Circuit" actions shown without coordinates.

## Stage 2 QA pass — 2026-11-07
**Problems found and fixed:** Archive tabs ignored arrow keys (ARIA tabs
pattern incomplete) — roving tabindex + ArrowLeft/Right activation
added; cover CTA fell below the fold on landscape phones (844×390) — a
short-screen media query now tightens the cover (first fix failed from
cascade order: the override sat before the base rule; moved to end of
file); cover shipped ~4.3 MB of PNG on first paint — display-resolution
WebP derivatives (242 KB total, scripts/derive_cover_assets.py, served
via <picture> with catalogue PNG fallback) cut the measured cover image
payload to ~156 KB at first view.
**Five UX improvements implemented:** (1) keyboard-accessible archive
tabs; (2) museum-lobby cards under the cover — one glass card per
experience, so home routes visitors instead of ending at the fold;
(3) story chapter jump-rail (SectionRail generalised from the season
rail) with current-chapter highlight; (4) full-screen viewer gains a
"n of N" counter (aria-live) and preloads neighbouring plates;
(5) cover performance + short-screen art direction above.
**Tests executed (all passed):** validator; tsc; oxlint; Vitest 13/13;
Playwright 14/14 (4 new: lobby cards, tab keyboard pattern, viewer
counter, chapter-rail highlight); production build; console/network
sweep across all nine routes — zero errors, zero failed requests;
landscape CTA probe now true.
**Not executed:** ArcGIS tests (still no ArcGIS code by design, Stage
5); bundled Playwright browser (blocked download — system Chrome via
CHROME_PATH).
**Accuracy audit:** story.json chapters re-checked against the context
document — Ards figures (8 dead, up to 40 injured, 5 Sep 1936), 1949
scheme framed as estimates, 1950 opening facts, Farina/royals wording,
1954 dual classification, 1955 restraint all verbatim-faithful; the UAC
chapter's ribbon-cutting line matches the supplied Belfast Telegraph
scan ("Premier Declares New Circuit Open"; caption names Sir Basil
Brooke with the UAC chairman). No new historical claims introduced by
QA; lobby card copy is navigational only.
**Still requiring owner verification:** unchanged from Stage 1 QA.

## Stage 2 — Cinematic foundation & visual identity — 2026-11-07
**Passed:** full-screen cinematic cover (DUNDROD / THE FORGOTTEN RACING
YEARS wordmark, headline, subtitle, distinction line, "Explore the
Story" + ghost CTA) with slow crossfade/drift between the two large 1955
PNGs — static under reduced motion — and one orchestrated staggered
entrance; navigation restructured to the six main experiences (The
Dundrod Story, Explore the Circuit, Six Racing Seasons, Drivers & Teams,
The Archive, Dundrod Today) with Acknowledgements in the footer and the
old /films route redirecting into The Archive's Film section; The
Dundrod Story page rendered entirely from src/content/story.json (seven
chapters: Ards, circuit creation, 1949 scheme, UAC, 1950 return,
1951–54 rise, 1955 end — fatalities handled in-story with restraint, no
standalone remembrance); design-system components added (DateLabel,
RaceResultCard, DriverCard, Unavailable, full-screen PhotoViewer with
Esc/arrow keys, glass cards, loading shimmer, archive tabs); Archive
gains Photography/Film subcategories with the special 1950 presentation
opening the full-screen viewer; Seasons refactored onto RaceResultCard;
Drivers onto card grid; lazy plates reserve layout via aspect-ratio
(collapse-before-load fixed). Gates: validator green (story chapter refs
included); tsc clean; oxlint clean; Vitest 13/13; Playwright 10/10
(cover + distinction + story CTA, six-experience nav + footer credits,
story chapter links, 1952 facts, viewer open/Esc, film unavailable
state, anchors, titles, mobile menu, /films redirect); production build;
visual review at 1280/390 of cover, story, drivers.
**Unverified / outstanding:** as Stage 1 (owner supplies + the four
hedged photo records + hero PNG baked icon). UAC chapter deliberately
short until the club history PDF arrives.

## Stage 1 QA pass — 2026-11-07
**Problems found and fixed:** year roundels navigated to `/seasons#y19xx`
without scrolling (anchor target 1,880 px below fold) — fixed with a
scroll/anchor manager; document titles never changed per route — now
per-experience; season jump-rail initially clipped under the desktop
masthead — sticky offsets corrected; redundant "Aston Martin DB3S (Aston
Martin)" entrant display suppressed when the car name carries the
entrant (data unchanged).
**Five UX improvements implemented:** (1) navigation correctness —
per-route titles, scroll-to-top, working year anchors with
scroll-margins; (2) sticky season jump-rail on Six Seasons with
IntersectionObserver current-season highlight; (3) photo presentation —
contained plates centred on full-width contour-textured mattes, fade-in
on load (reduced-motion safe, cached-image safe), gentle hover lift;
(4) first-time journey — "Begin the story" CTA in the hero and a footer
experience nav (no dead ends); (5) hero art direction — mobile
object-position 68% keeps the Mercedes in frame, fetchPriority high.
**Tests executed (all passed):** content validator; `tsc -b`; oxlint
(exit 0); Vitest 13/13; Playwright 7/7 (4 original + 3 new regression
tests: anchor scrolling, per-route titles, mobile menu open/navigate/
close) via system Chrome; production build; route sweep desktop+mobile —
zero console errors, zero failed requests/broken image paths.
**Not executed:** ArcGIS map performance/layer loading — no ArcGIS code
exists yet by design (packages deferred to Stage 5; seam renders the
labelled schematic fallback). Playwright's bundled browser cannot
download in this environment; e2e ran against system Chrome
(CHROME_PATH) — CI should install the bundled browser.
**Accuracy audit:** photo captions/alt generated verbatim from the
spreadsheet by script; corrections register enforced by validator and
unit tests (1952 UT Taruffi, 1952 TT/1954 UT not held, 1954 dual
classifications, 1955 UT dual awards, 7:03:11); UT/TT rendered as
separate labelled records each year; collection credit exactly as
specified; hidden acknowledgement and review notes covered by
never-render tests. No historical content was added or altered in QA.
**Still requiring owner verification:** the four confirm-before-
publication photo records (shipping with hedged wording); Belfast
Telegraph scan display permission; hero PNG's baked-in viewer icon
(mitigated by scrim/crop, still visible in some crops); plus the
pre-stage outstanding supplies (UAC PDF, FeatureLayer, film
authorisations, modern photography, contributor name).

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
