# Seven-stage development roadmap

Staged vertical slices. Every stage builds on the last, preserves completed
functionality, uses verified historical data, includes tests, passes
`tsc --noEmit` + production build, updates docs, records results in
docs/verification-log.md, and ends in a stable Git commit (branch + PR
where practical). **No stage starts without the owner's go-ahead.**

**Delivery status (the owner's prompt pack numbers stages in its own
order; this roadmap tracks the work itself):** foundation + content
spine ✅ · cinematic home/story ✅ · circuit explorer with provisional
1950s geometry, landmarks and guided lap ✅ (owner's Stage 3 prompt) ·
six-seasons interactive timeline ✅ (owner's Stage 4 prompt, 2026-11-08) ·
photographic & film archive ✅ (owner's Stage 6 prompt, 2026-11-08: masonry gallery, full faceted filters, Lost Photographs of 1950, Behind the Photographs, linked film collection, thumbnails) · drivers & teams: profile
cards + deep-link anchors shipped, full profiles to come · Dundrod Today ✅ and the final experience/verification stage ✅ (owner's Stage 7 prompt, 2026-11-08: Discover Dundrod guided tour, Today explorer, accessibility suite, publication prep — deployment awaiting owner authorisation).

## Stage 1 — Foundation, identity and content spine
Scaffold (React+TS+Vite, GitHub Pages-ready base/routing), design system
from the master palette (racing green `#092B24`, midnight charcoal
`#111A1B`, deep green `#123B31`, antique gold `#CBA76C`, copper `#A46D4A`,
warm ivory `#F2EBDD`), typography, grain/paper textures, glass panels;
app shell + navigation for the seven experiences; zustand store; full
static JSON content set generated from the spreadsheet and context doc;
content validator; Vitest + Playwright harness; photo asset pipeline
(NFC, variants, no upscaling). *Salvage from the first prototype: NFC
handling, verified photo data, map-seam pattern.*
**Accept:** validator green (46↔46); shell keyboard/touch accessible;
tests run in CI shape; build clean.

## Stage 2 — The Dundrod Story (home)
Cinematic editorial home: WHEN FORMULA 1 CAME TO NORTHERN IRELAND opening
(with the non-championship distinction preserved), how racing came to
Dundrod, the UAC's role, the 1949 scheme, why six seasons matter; routes
into timeline, map, archive.
**Accept:** headline distinction present; all copy source-backed; both
visitor journeys start cleanly; responsive 360–1440.

## Stage 3 — Six Racing Seasons (interactive timeline)
Animated six-year timeline; each year reveals events (UT/TT kept
distinct, not-held years stated), stories, drivers, cars, teams, results
by classification, photographs, context; fatalities covered sensitively
in-year. Reduced-motion variant.
**Accept:** classification correctness unit-tested (1952/1954/1955);
year↔archive cross-links resolve; animation respects reduced motion.

## Stage 4 — The Photographic Archive
Searchable archive of the 44 race photos: browse by year, event, driver,
team, car and location; large-format viewer with caption, credit and
context; collection-level credit; special presentation of the rare 1950
photographs; lazy loading; empty states.
**Accept:** every archive entry resolves to a real image; review notes
and excluded records never render; keyboard-operable viewer; filters
shareable via URL.

## Stage 5 — Explore the Circuit (ArcGIS)
ArcGIS Maps SDK 5.1 map components + Calcite chrome; consume the
owner-supplied FeatureLayer when configured (`locId` join), full-screen
exploration, landmark panels linking photos/stories/incidents; labelled
schematic fallback with identical selection interface; optional cinematic
guided lap (both backends, reduced-motion aware).
**Accept:** app fully functional with zero map config; no deprecated SDK
APIs; feature↔panel selection both directions; fallback states explicit.

## Stage 6 — Drivers & Teams + Film Archive
Profiles of drivers, teams and cars (source-backed; local drivers
prominent, particularly Desmond Titterington) cross-linked to years,
races and photographs; film archive integrating only authorised British
Pathé / NI Screen footage into year stories and a collection view, with
honest unavailable states otherwise.
**Accept:** no invented biography; every profile link resolves; no
unauthorised embeds.

## Stage 7 — Dundrod Today, polish and release
Then-and-now exploration from owner-supplied modern material (records
stay `awaiting-modern-photo` until it exists); surviving-landmark
stories; full accessibility and performance pass; complete Playwright
journey suite; GitHub Pages deployment workflow; final verification log
and handover docs.
**Accept:** acceptance checklist green across app; deploy reproducible;
release blockers from the source catalogue resolved or consciously
deferred by the owner.
