# Final testing & historical verification report

Stage 7 — Final Experience Design, Historical Verification & Publication.
Date: 2026-11-08. Prepared alongside docs/verification-log.md (stage
history) and docs/permission-register.md (media rights).

## 1. The application

Seven experiences, all live from the verified catalogue:
Discover Dundrod (guided eight-scene visit) · The Dundrod Story ·
Explore the Circuit (interactive 1950s course, guided lap, period map) ·
Six Racing Seasons · Drivers & Teams (profiles, Local Heroes, teams,
machines) · The Archive (photography, film, Behind the Photographs) ·
Dundrod Today (satellite explorer, change record, road-respect note).

## 2. Test execution (all executed this stage)

| Gate | Result |
| --- | --- |
| TypeScript (`tsc -b --force`, non-incremental) | clean |
| Lint (oxlint, react plugin — typescript-eslint awaits TS 7 support upstream) | clean |
| Content validator (referential integrity, photo paths, thumbnails, films, landmarks) | green — 46/44 photos, 12 races, 34 people, 12 teams, 15 cars, 14 locations, 4 films |
| Unit tests (Vitest) | 31/31 |
| End-to-end (Playwright, builds fresh, system Chrome) | 61/61 — includes tour controls, Today, archive filters, viewer deep links, lap walk, profiles, films |
| Accessibility (axe-core on 12 routes, serious+critical) | 12/12 clean — 100+ label-content mismatches found and fixed this stage; ArcGIS canvas internals excluded (Esri's) |
| Production build | clean |
| Route audit (14 routes × 2 viewports) | zero app console errors, zero failed requests, zero broken images |

Performance (production build): app imagery 1.6 MB thumbnails serving
all galleries (8 MB originals load only one-at-a-time in the viewer);
ArcGIS SDK (~634 kB gzip) lazy-loads only on map pages; social card
104 kB. Not executed: Lighthouse (no Chrome audit tooling in this
environment) — field numbers worth a check on the live site.

## 3. Historical verification

Consolidated audit (this stage, scripted, on top of the per-stage
audits): corrections register fully honoured (1952 UT Taruffi / 1952 TT
not held / no 1954 UT / 1954 scratch-vs-handicap distinct / 1955 TT
7:03:11 / "1950s hairpin" with 'Lindsay' only in the 1965 note /
"Queen Elizabeth" / no £8,000 claim / no safety overclaims); no
appearance duplicates or contradicts a win; hedged identifications
verbatim and surfaced as *probable*; review notes render nowhere (the
one catalogue record that stores a handling note stores it verbatim and
no display code prints it — e2e-guarded on both pages that show the
portrait); every guided-tour sentence resolves from a canonical record
(story / year / person) or is marked editorial and non-historical.

**Flagged, not invented (open verification items):**
- Bill Smith (May 1955 Champion Trophy) vs William Smith (September
  1955): kept as the two records the sources supplied, pending
  confirmation they are the same William T. Smith.
- Shawe-Taylor's 1950 finishing position: unrecorded, stated as such.
- Bira's 1952 result: "entered; photographed" only.
- All 14 landmark positions: provisional on the verified route, pending
  survey-grade confirmation; stated in the UI and map toolbar.
- Winterbottom's location (Wheeler's Corner): a reported attribution,
  hedged in copy.
- 1955 Ulster Trophy day-of-month: month known, day unverified.

## 4. Rights & permissions review

- Photographs: contributed; collection-level Armstrong credit only; the
  1950 contributor anonymous until confirmed; portrait confined to
  acknowledgement contexts. Four hedged records ship hedged.
- Films: four records, every one an outbound link to its holder's own
  player (BFI, NI Screen DFA, British Pathé ×2); no embedding claimed
  or performed; no downloads or re-cuts. Embedding stays an honest
  unavailable state pending written permission.
- Not published: the 1950 Belfast Telegraph scan (awaiting its owner).
- Maps: Esri basemap attribution renders on the map; README and footer
  state it. The period programme map carries its OSNI/HMSO credit;
  the era's Crown copyright has expired.
- Trademarks: period team and marque names appear in their historical,
  descriptive sense only; no modern F1 branding anywhere (per the
  project rules).
- **Repository visibility: already public** (it hosts the live GitHub
  Pages site). The prompt's gate — "do not make the repository public
  until permission-sensitive material has been cleared" — is therefore
  about what the repo contains: everything in it is either contributed
  with permission, derived, or linked rather than copied; the one
  pending item (Belfast Telegraph scan) is *not* in the repository.
  The internal review notes in photos.json are visible to a repo reader
  — they are editorial handling notes, not personal data; flagged for
  the owner's awareness.
- Footer now carries the public rights notice; README carries licensing
  and attribution in full. No open-source licence has been applied to
  the repository — that choice is the owner's; until then, default
  all-rights-reserved applies.

## 5. Deployment readiness

GitHub Pages workflow proven across three deployments (push to main →
type-check + validator + unit tests → deploy). Vite base path
`/dundrodtt/`; hash routing needs no rewrites; favicon, social preview
card and Open Graph metadata in place. **Not deployed this stage** —
awaiting the owner's authorisation, per the prompt.

## 6. Outstanding limitations (carried, all documented)

Second contributor's name · Belfast Telegraph permission · film embed
permissions · UAC history PDF (R02) unsupplied · modern landscape
photography for Then & Now (none borrowed in the meantime) · ArcGIS
FeatureLayer (app runs fully on bundled verified GeoJSON) · survey-grade
landmark confirmation · live-site Lighthouse pass.
