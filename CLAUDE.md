# DUNDROD — The Forgotten Racing Years

Permanent project instructions. These bind every development stage.

A premium interactive digital heritage experience about motor racing at the
Dundrod circuit, County Antrim, Northern Ireland, 1950–1955. Application
identity: **Dundrod — The Forgotten Racing Years**. Opening headline:
**WHEN FORMULA 1 CAME TO NORTHERN IRELAND**, subtitle: *Six extraordinary
seasons. Legendary drivers. The world's finest racing cars. One
unforgettable road circuit.*

## The headline distinction (never violate)
Dundrod hosted Formula One cars and Formula One World Championship drivers,
but it did **not** host a Formula One World Championship Grand Prix. The
headline is an engaging introduction, not a claim that Northern Ireland
hosted a championship Grand Prix. Preserve this distinction in all copy.
(Supporting facts from the sources: reigning World Champion Giuseppe Farina
won the 1951 Ulster Trophy; Moss and Fangio appeared in the V16 BRM in
1952; the Ulster Trophy was usually a single-seater race.)

## Fundamental historical rules
- Historical copy rests on the supplied sources (context docx, gallery
  spreadsheet, supplied notes, UAC material, 1950 Belfast Telegraph scan,
  owner-supplied period programme map scan). Owner authorisation
  (2026-11-08): reputable web sources may supplement them — every
  supplementary fact carries a sources.json register entry (R23+), and
  where a web figure conflicts with the corrections register or supplied
  sources, the register wins (e.g. 1955 TT time stays 7:03:11).
  Never fabricate photographs, results, locations, events, quotations,
  drivers, cars, teams, dates or attributions. Preserve source references
  and identification uncertainties — hedged wording stays hedged.
- The original circuit was approximately 7.416 miles (7 miles 732 yards),
  closed public roads, run clockwise. Do not substitute the post-1965
  circuit for the 1950s layout (old Leathemstown Bridge and the tighter
  1950s hairpin belong to this period; say "1950s hairpin", not "Lindsay
  Hairpin"). Do not use Clady circuit mapping (the A26/B39/A52 diagram) as
  Dundrod mapping. Do not invent exact photographic locations.
- Keep the Ulster Trophy and RAC Tourist Trophy separate. The 1952 Ulster
  Trophy took place (winner: Piero Taruffi, Vandervell-entered Ferrari 375
  — not Hawthorn); the 1952 RAC TT did not. There was no 1954 Ulster
  Trophy. Differentiate the 1954 TT scratch (Hawthorn/Trintignant, Ferrari
  750 Monza) and handicap (Laureau/Armagnac, DB-Panhard) classifications.
  Distinguish the May 1955 Ulster Trophy meeting (mixed handicap:
  Titterington fastest finisher and Ulster Trophy winner; Bill Smith won
  the handicap Champion Trophy) from the September 1955 RAC TT
  (Moss/Fitch, Mercedes-Benz 300 SLR, 84 laps, 7:03:11 — not 7:03:12).
- The 1949 scheme figures (£40,000 estimate, £20,000 grant recommended,
  12,366 lineal yards, one new 515-yard section, grandstand/offices/pits/
  barricades/fences) are reported estimates, not audited costs. The
  unverified 1954 "£8,000 loss" claim stays out. In a 1951 setting say
  "Queen Elizabeth", not "Queen Mother".
- The 1936 Ards tragedy is a distinct historical event, not a Dundrod
  incident. Do not claim Dundrod was "one of the safest" circuits, or that
  the Le Mans disaster alone ended car racing there.
- **No standalone Remembrance section.** Accidents and fatalities are
  covered sensitively within the historically relevant year and
  circuit-location stories: Eric Winterbottom (1951 TT); Jim Mayers and
  William Smith at Deer's Leap and Richard Mainwaring at Tornagrough
  (1955 TT). Describe documented fatalities accurately and respectfully —
  no graphic detail, no sensational framing.

## Photographs, films and permissions
- The gallery spreadsheet is the primary photo metadata catalogue: 46
  records — 44 for the race archive, one duplicate JPEG excluded in favour
  of its higher-resolution PNG (DU-1955-04-DUP), one contributor portrait
  (DU-ACK-01) kept out of the race archive. Keep its exact relative File
  path verbatim in each record as the catalogue identity (NFC-normalized —
  the zip extracts NFD), but SERVE images under stable register-ID asset
  names (`photos/<year>/<ID>.<ext>`): several original filenames contain
  `#` and other characters static hosts mis-serve. Display its Caption,
  use its Alt text, filter by year/event, keep Review note internal
  (never rendered).
- Collection credit, shown once at collection level: "Neville Armstrong
  kindly contributed photographs of Dundrod from the 1950s." No per-image
  donor credits. The portrait (Neville with his wife Beverley) appears
  only in acknowledgement/about contexts.
- A second contributor supplied previously unseen 1950 photographs; their
  name is not yet known. Their acknowledgement record exists with message
  ready but stays hidden — never show a placeholder name. The rare 1950
  photographs get a special presentation regardless.
- Do not publish photographs or film clips without appropriate
  permissions. British Pathé / Northern Ireland Screen footage only where
  use or embedding has been authorised; otherwise honest unavailable
  states. The Belfast Telegraph scan displays only with its credit line,
  pending owner confirmation.
- No AI-generated historical imagery. No downloading photographs of
  people from the web. Non-photographic period material whose copyright
  has expired (the programme course map, served as
  circuit/period-map.{webp,jpg} with its OSNI/HMSO credit line) and
  properly licensed landscape imagery the owner approves may be added,
  each with its credit; otherwise no third-party image downloads.
- 44 of the 46 supplied images are under 800 px wide (median 640 px);
  only two 1955 PNGs are large. Never upscale beyond light responsive
  scaling; achieve the cinematic feel through art direction (mattes,
  grain, staging, duotone surrounds), reserving true full-bleed for the
  two large PNGs.

## Visual design
Premium motorsport heritage aesthetic — a carefully curated historical
exhibition, not a racing game. Palette: British racing green `#092B24`,
midnight charcoal `#111A1B`, deep green `#123B31`, antique gold `#CBA76C`,
copper `#A46D4A`, warm ivory `#F2EBDD`. Cinematic full-width photography
(within the image-size rule above), elegant serif display headings,
readable body type, restrained film-grain and historical-paper textures,
glassmorphism information panels, animated timelines, smooth image
transitions, attractive hover states (never hover-only information),
full-screen map exploration, sophisticated responsive layouts. Avoid
racing-game styling, neon, cartoon effects, and modern Formula One
branding that would be historically misleading.

## Technology
React + TypeScript + Vite; ArcGIS Maps SDK for JavaScript 5.1 via
`@arcgis/map-components` with `@arcgis/core@^5.1` and
`@esri/calcite-components@^5.1` (Calcite where useful); no deprecated SDK
methods. Modern CSS. Lightweight shared state (zustand). Static JSON
content in `src/content/` with generated TypeScript types and a build-time
validation script (referential integrity + photo paths). Optimised local
assets. GitHub Pages hosting. Vitest (unit) + Playwright (e2e).
The circuit map consumes a user-supplied ArcGIS Online FeatureLayer when
available; configuration lives in `src/config/appSettings.ts`, keys only
in uncommitted `.env` (`VITE_ARCGIS_API_KEY`). Never commit secrets. With
no map configuration, the clearly labelled local schematic fallback keeps
the app fully runnable; see docs/architecture.md for the integration
contract.

## Development methodology
Staged vertical-slice development per docs/roadmap.md. Every stage must:
build on the existing project; preserve previously completed
functionality; use verified historical data; include functional tests;
pass `npx tsc --noEmit` and `npm run build`; update documentation; record
what passed and what remains unverified in docs/verification-log.md; and
be committed as a stable Git version (separate branch and pull request
where practical). Do not automatically move to the next stage — the owner
approves each stage boundary.
