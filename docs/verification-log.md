# Verification log

Each stage records what passed and what remains unverified.

## Retitle (owner-directed) — 2026-11-08
**Passed:** application identity renamed to "Dundrod: A Golden Age of
Motorsport" across the wordmark, cover, document titles (incl. tour and
profile pages), Open Graph/Twitter metadata, regenerated social card,
README, design-token header and CLAUDE.md; opening headline and
distinction unchanged. Gates re-run: tsc · oxlint · validator · 31/31
Vitest · full Playwright suite green.

## Post-stage QA pass (Stage 7 / publication) — 2026-11-08
**Passed — functional & technical:** full regression on the published
feature set: 31/31 Vitest, 63/63 Playwright (incl. the 12-route axe
suite and 2 new tests), tsc (forced), oxlint, validator, production
build; route sweep at both viewports — zero app console errors, zero
failed requests, zero broken images. Final historical audit
(display-scope corrected) clean: corrections register honoured,
films linked never embedded, 46/44 register intact, handling note in
no display code.
**Five UX improvements implemented:**
1. Mobile tour controls are now sticky at the bottom of the viewport —
   found in review: autoplay could advance while Pause/Next sat below
   the fold on phones.
2. Visible "Scene n of 8" counter in the tour controls (aria-live).
3. Autoplay pacing made visible: a thin gold progress bar fills over
   each scene, disappears when paused, and is removed entirely under
   prefers-reduced-motion.
4. Reduced-motion visitors are told autoplay is off and pointed at
   Play/Next instead of facing a silent still page.
5. The map toolbar now states the legend — the gold line is the
   1950–55 course — which matters most over modern satellite imagery
   on Dundrod Today; next-scene photographs also preload during the
   tour for seamless transitions.
**Not done, by instruction:** no deployment — these refinements sit on
qa-stage-7 awaiting the owner.
**Unverified / outstanding:** unchanged — consolidated in
docs/final-report.md §6.

## Publication — the complete experience live — 2026-11-08
**Passed:** PR #7 merged on the owner's authorisation; GitHub Pages
workflow run 42529691196 fully green (build with type-check and content
validator, unit tests, deploy). The complete seven-experience
application — Discover Dundrod, Story, Circuit, Seasons, Drivers &
Teams, Archive, Today — is published at
https://johnchewitt.github.io/dundrodtt/. All seven roadmap stages and
their QA passes are delivered; open verification items remain
consolidated in docs/final-report.md §6.

## Stage 7 — Final experience, verification & publication prep — 2026-11-08
**Passed:** DISCOVER DUNDROD guided visit (eight scenes from the return
of racing to the roads today; every historical sentence resolved at
render time from the canonical story/year/person records — tour.json
stores references, not retyped copy; Next/Previous/Pause/Play/Restart/
Exit, clickable progress dots, keyboard control, auto-advance that
starts paused under prefers-reduced-motion; Home now leads with the
tour). Dundrod Today built as the present-day explorer: the verified
geography on satellite imagery (each map page now opens in its
signature view), the lap walk, a sourced "What changed, and when"
record (Leathemstown Bridge, the 1965 hairpin), the heritage note
(UGP from 1953, the Joey Dunlop grandstand), a public-roads respect
notice, and honest Then & Now states. Refinement sweep: footer rights
notice; provisional-markers note on the map toolbar; live region on
archive filter counts (aria-live, after role="status" was caught
destroying heading semantics); global focus-visible for chips, tabs
and buttons; social preview card generated from DU-1950-05 with Open
Graph/Twitter metadata; README rewritten for publication; final-report
and permission-register current. Accessibility: axe-core added to the
e2e suite — 12 routes scanned, 100+ label-content-name mismatches
found in gallery/strip buttons and fixed (buttons now named by their
visible content or labels containing it); all 12 scans clean at
serious+critical. Gates: tsc (forced) · oxlint · validator · 31/31
Vitest · 61/61 Playwright (incl. 12 axe + 4 new feature tests) ·
production build · route audit zero-defect. Consolidated historical
audit green (see docs/final-report.md §3).
**Not done, by instruction:** no deployment — publication awaits the
owner's authorisation.
**Unverified / outstanding:** the open items consolidated in
docs/final-report.md §6; repository is already public (it hosts the
live site) — reviewed in §4 with one awareness flag (internal review
notes are readable in the public catalogue JSON).

## Third deployment — Stage 6 archive live — 2026-11-08
**Passed:** PR #6 (Stage 6 photographic & film archive + owner-approved
1955 Pathé newsreel + QA) merged to main; GitHub Pages workflow run
42527315117 fully green (npm ci → build with type-check and content
validator → Vitest → deploy). Live at
https://johnchewitt.github.io/dundrodtt/.
**Unverified / outstanding:** live in-browser spot-check again
recommended on first visit — the shareable viewer URL
(/#/archive?photo=DU-1951-08), the film links opening on their
holders' sites, and the circuit map.

## Post-stage QA pass (Stage 6) — 2026-11-08
**Passed — functional & technical:** 14 routes × 2 viewports audited,
including filter permutations, the shareable-photo URL, both new tabs
and a driver profile: ZERO app console errors, zero failed requests,
zero broken images (ArcGIS CDN block filtered as environmental). Gates:
tsc (forced) · oxlint · validator · 31/31 Vitest · 46/46 Playwright ·
production build.
**Fixed:** the Acknowledgements page had rendered the contributor
portrait's catalogue caption — an internal handling instruction — since
Stage 2; PhotoPlate now takes a display-caption override, Credits uses
it, and an e2e test guards both this page and Behind the Photographs.
Also fixed two viewer races found while testing: closing the dialog
could cancel an inner link's navigation (the collection link now lets
the route change unmount the viewer), and the close handler could
clobber a just-navigated URL (openPhoto now uses a functional
search-params update).
**Passed — historical accuracy:** 46-check Stage 6 audit: every
external film links to its holder's own page (BFI/Pathé/DFA), carries
rights holder, registered source and the linked-not-embedded note; no
iframes or third-party embeds anywhere in the app; no film claims
embed authorisation; the four confirm-before-publication photographs
all ship with their catalogue hedges intact and are the ones the
viewer marks "probable"; the Lost-1950 copy uses only the supplied
wording, renders no placeholder name and never the hidden record's own
message; the 1950 Pathé film is tied to the TT only and the BFI film
to the Ulster Trophy only.
**Five UX improvements implemented:**
1. Photographs are shareable: ?photo=DU-… opens the viewer, arrowing
   rewrites the URL (replace, no history spam), Escape clears it.
2. The viewer gained its museum label — the catalogue title leads the
   caption in display serif.
3. One-step "Clear all filters" chip on any filtered view.
4. Keyboard focus is now visible on every gallery plate
   (focus-visible outline on .plate-button).
5. The first Lost-1950 plates load eagerly for a faster first paint;
   everything else stays lazy.
**Regression:** full suite re-run (46/46) covering every earlier
stage's journeys; relationship integrity re-verified by the audit.
**Unverified / outstanding:** unchanged from the Stage 6 entry below;
the linked Pathé "Tragedy Mars" page carries the story's selected
originals (mute duplicate) — if the owner prefers the issued sound
newsreel, Pathé's site search can confirm its slug on a visit.

## Stage 6 — The Photographic & Film Archive — 2026-11-08
**Passed:** archive rebuilt as the collection's centrepiece. Photography:
editorial masonry gallery (1/2/3 columns, register order preserved),
full filter set — year, event, driver (catalogued people only), car/
subject, caption/name/ID search, all URL-addressable — plus the honest
note that no place filter exists because no photograph has a verified
circuit location. THE LOST PHOTOGRAPHS OF 1950 editorial leads the
gallery (supplied facts only; anonymous second-contributor
acknowledgement, no placeholder name). Viewer gains subject line,
catalogue-derived identification label (probable/catalogued, computed
from the cataloguer's own hedge words — never a new claim) and a
collection link. Behind the Photographs: Armstrong feature with the
supplied portrait and message, collection-credit explanation, the
anonymous 1950 acknowledgement, and a sources-and-permissions note.
Film: three-film collection (BFI Player 1955 Ulster Trophy; NI Screen
DFA 1955 TT, dated 17 September; British Pathé 1950 TT, Film ID
2533.08) — every film linked to its holder's own player with rights
holder, description, race/driver chips and a linked-not-embedded note;
nothing downloaded, rehosted or re-cut; Pathé/NI Screen embedding stays
an honest unavailable state. Season chapters gained "On film" blocks
(1950 and 1955). Performance: 46 webp thumbnails (≤560px, no
upscaling) generated by scripts/derive_photo_thumbs.py — originals
untouched; galleries, strips and profile strips serve thumbnails
(archive page payload ~8MB→~1.6MB of imagery); viewer serves
originals one at a time with neighbour preload and a reduced-motion-
aware fade. Permission register created (docs/permission-register.md).
Validator extended: film year/race/person/location/source refs,
external films require their linked-not-embedded note, and every
photograph must have its thumbnail on disk. Gates: tsc (forced,
non-incremental) · oxlint · validator · 31/31 Vitest (3 new) · 43/43
Playwright (7 new) · production build · visual review 1440/390 px.
**Fixed en route:** the contributor portrait's catalogue caption is an
internal handling instruction and was briefly rendered in Behind the
Photographs — replaced with editorial display text and guarded by an
e2e test; incremental tsc masked a missing helper once, so the gate
sequence now forces a clean build.
**Unverified / outstanding:** contributor confirmation for publishing
"previously unseen" beyond the supplied wording is recorded as given in
the project rules; second contributor's name still unknown (acknowledged
anonymously); Belfast Telegraph scan still unpublished pending its
owner; no Pathé/NI Screen embedding authorised; "Tragedy Mars Ulster
T.T." (Pathé, 1955) and "Accent On Sport" were found in Pathé's
catalogue but are not linked — no verified page URL was retrievable
(Pathé blocks server fetches), and the former needs a sensitivity
decision from the owner before it is ever surfaced.

## Second deployment — Stages 4 & 5 live — 2026-11-08
**Passed:** PR #4 (Stage 4 seasons timeline + owner-feedback refinements
+ QA) and PR #5 (Stage 5 drivers, teams & cars + QA) merged to main in
order; GitHub Pages workflow run 42521445184 fully green (npm ci →
build with type-check and content validator → 28/28 Vitest → deploy).
Live at https://johnchewitt.github.io/dundrodtt/.
**Unverified / outstanding:** in-browser spot-check of the live ArcGIS
map and new pages not performed this session — the desktop-app browser
bridge was offline and the workspace cannot reach github.io directly;
recommend a quick look at /#/seasons, a driver profile and the circuit
map on first visit. Stage branches left undeleted as before.

## Post-stage QA pass (Stage 5) — 2026-11-08
**Passed — functional & technical:** route-wide console/network/image
audit at 1440 px and 390 px covering every experience plus four driver
profiles and the unknown-ID route (honest not-found page): zero broken
images; the only console error is the sandbox-blocked ArcGIS tunnel
(the live site loads the SDK). Found and fixed a test-infrastructure
hazard: Playwright reused any stray preview server, so e2e could run
against a stale build — webServer now always builds first and never
reuses (two "failures" during QA were exactly this, both passed against
the real build). Gates: tsc clean · oxlint clean · validator green ·
28/28 Vitest · 36/36 Playwright (4 new) · production build.
**Passed — historical accuracy:** 180-check scripted audit of Stage 5
data: no appearance duplicates or contradicts a win; appearances only
in held races; results never phrased as win claims; all sources
resolve; localHero is exactly the two NI drivers; Porsche and the
Platé entry carry no victory links; every car photograph's catalogued
subject matches its car; specs all carry R39; Bill Smith / William
Smith remain separate records pending verification.
**Five UX improvements implemented:**
1. Profile pages set per-person document titles (found in audit: all
   profiles shared the generic site title).
2. Shared victories link their co-winners — Moss's 1955 record links
   John Fitch, Collins links Griffith, and so on.
3. The search box now keeps its own promise: "name, place, car or
   team" — the haystack includes each driver's documented cars and
   teams, so "BRM" finds Fangio and "Ecurie Ecosse" finds Titterington.
4. Team and machine cards are anchor targets; the cars and teams named
   in a profile's record deep-link straight to their cards.
5. "In the same frames" — each profile surfaces the other catalogued
   people who appear in its photographs, as profile chips (derived
   from personIds; nothing asserted beyond the captions).
**Regression:** full suite re-run after all changes (36/36) covering
every earlier stage's journeys; relationship integrity re-verified by
the 180-check audit plus the Vitest relationships suite.
**Unverified / outstanding:** unchanged from the Stage 5 entry below
(no web portraits by policy; Shawe-Taylor's 1950 finish unrecorded;
Bira's 1952 result unverified; the two Smiths; Porsche driver detail).

## Stage 5 — Drivers, Teams & Legendary Cars — 2026-11-08
**Passed:** LOCAL HEROES editorial feature (Titterington lead card —
1955 Ulster Trophy fastest-finisher win and the shared works D-Type with
Hawthorn; Bobby Baird feature; Joe Kelly woven into the home-challenge
prose). Searchable driver catalogue (name/place/nationality/context)
with an honest no-match state. Full profile route /drivers/:personId:
nationality and home, derived "At Dundrod" year chips, The Dundrod
record (wins derived from race classifications + a new sourced
`appearances` register for documented non-winning results and entries),
documented events, archive photo strip with viewer, circuit-place chips
(incident-derived only), aggregated source line. New structured data:
`appearances` on 16 drivers (Parnell 2nd '51, Gerard 2nd '50, Kelly
4th/'50 3rd/'52, Baird's three meetings, the BRM DNFs, Whitehead's
piston, 1955 entries, etc., all source-referenced); nationalities;
localHero flags (exactly the two NI drivers); four new documented
drivers (Peter Walker, Ken Wharton, Cuth Harrison, Brian Shawe-Taylor).
Teams expanded 7→12 with kind (works/entrant) and country — Alfa Romeo,
Maserati, Porsche (1955, R23), DB and the Enrico Platé entry added; no
team implied beyond its documented years (cards carry only derived
victory chips). Car collection: verified one-line specs (new R39) and
archive photographs on the 15 catalogued cars with derived victory
chips. All person links app-wide (photo viewer, season chips, cards)
now open full profiles. Relationships module unit-tested (Moss =
exactly three TT wins; incident→place links; photo↔person symmetry).
Gates: tsc · oxlint · validator green (34 people, 12 teams) · 28/28
Vitest · 32/32 Playwright (4 new) · production build · visual review
at 1440/390 px.
**Unverified / outstanding:** no licensed portraits — profiles use the
archive's action/paddock photographs (policy: no web photos of people);
Shawe-Taylor's 1950 finishing position is not in the register and the
profile says so; Bira's 1952 participation is recorded as entered +
photographed (finishing position unverified); the register keeps Bill
Smith (May 1955 Champion Trophy) and William Smith (September 1955
fatality) as the separate records the supplied sources gave — whether
they are the same William T. Smith needs verification before any merge;
Porsche's 1955 drivers beyond the Gregory loan are not catalogued.

## Post-stage QA pass (Stage 4 + refinements) — 2026-11-08
**Passed — functional & technical:** route-by-route console/network/image
audit at 1440 px and 390 px: zero broken images on any route (all 44
photos, covers, period map, both geojson layers resolve); the only
failing requests in this environment are the ArcGIS CDN domains blocked
by the sandbox proxy (the deployed site loads them — verified in a real
browser at deployment). Fixed: index.html never linked the shipped
favicon.svg, so every page load 404'd on /favicon.ico — link added
(Vite rebases it under /dundrodtt/). Fixed: @testing-library/dom peer
dependency pruned by an earlier --legacy-peer-deps install — restored.
Lint gate added: typescript-eslint does not yet support TypeScript 7.0
(upstream issue #10940), so `npm run lint` runs oxlint (react plugin)
over src/e2e/scripts — currently clean; revisit typescript-eslint when
TS ≥7.1 support lands. Gates: tsc clean · lint clean · validator green
(46/44 photos, 12 races, 30 people, 14 locations) · 22/22 Vitest (new
lap-order↔landmarks test) · 28/28 Playwright (2 new) · production build.
**Passed — historical accuracy:** 70-check scripted audit green: 1952
UT held (Taruffi, Vandervell Ferrari 375) vs 1952 TT not held; no 1954
Ulster Trophy; 1954 scratch/handicap winners distinct; 1955 UT
fastest-finisher vs Champion Trophy distinct; 1955 TT 84 laps 7:03:11
(7:03:12 nowhere); 'Lindsay' appears only inside the 1965 explanatory
note; 'Queen Elizabeth' not 'Queen Mother'; £8,000 claim absent; Ards
marked not a Dundrod event; hedged identifications verbatim; hidden
contributor nameless; hero photos match their years; every photo
personId resolves. Three location stories reworded for attribution
precision (descriptions credited to writers/today's riders, not period
drivers; unsourced corner direction removed).
**Five UX improvements implemented (not just listed):**
1. Archive year + event filter chips — also fixes a real defect: season
   chapters linked /archive?year=YYYY but the archive ignored the
   parameter; filtered view shows count, story link, and an honest
   empty state (e.g. 1952 + RAC TT).
2. Photograph viewer: event/meta line under the caption and touch-swipe
   navigation between photographs.
3. Season timeline strip auto-scrolls the active year station into view
   while reading (narrow screens) and carries full chapter titles.
4. Location panel "walk the lap": previous/next stop navigation in
   clockwise seq order from the start/finish line (shared lapOrder
   module, unit-tested against landmarks.geojson).
5. Drivers & Teams grouped presentation — Champions and works stars /
   The home challenge / The wider entry / Around the paddock — curated
   ids only, unplaced profiles fall through so nothing can vanish.
**Regression:** earlier-stage features re-verified by the full e2e
suite (cover, story, circuit explorer with toolbar, seasons anchors,
archive viewer, credits, titles) plus photo/driver/year/location
relationship checks in the accuracy audit.
**Unverified / outstanding:** ArcGIS runtime behaviour re-verified in
this sandbox only up to the CDN block — live-site map re-check belongs
with the next deployment; ESLint proper deferred to typescript-eslint
TS7 support; everything in the Stage 4 and refinement entries below
still stands (survey-grade landmark positions, 1955 UT day-of-month,
Winterbottom location hedge, licensed corner photography pending).

## Refinement pass (owner testing feedback) — 2026-11-08
**Passed:** period programme map scan (owner-supplied) saved as evidence
and served in-app (circuit/period-map.webp/jpg, OSNI/HMSO credit, Crown
copyright of the era expired) — displayed on Explore the Circuit and as
the figure in the Story's circuit chapter. Landmark-name audit against
the scan: all 13 shipped names confirmed period-correct (Deer's Leap and
Tornagrough are not labelled on this map but are documented period names
from the 1955 race sources); added a 14th landmark, Start & Finish and
the Pits, placed on the Quarry–Rushyhill straight per the map
(provisional like the rest), and renumbered the guided lap to begin at
the start line. Corner-by-corner driver's-eye stories written for all 14
places from researched sources (Motor Sport 1955 report and Oct 2000
feature, Maurice Hamilton, Bob Montgomery/Irish Times, RacingCircuits,
modern riders' accounts hedged as such) — sources R23–R38 registered.
Ards chapter renamed "The Ards TT" and expanded (1928–1936, Harry
Ferguson, Caracciola/Nuvolari, the 5 September 1936 accident told
without graphic detail, 2024 memorial; Ards/Dundrod distinction kept).
Story chapters now each carry imagery where the pack or the period map
provides it (the Ards chapter honestly has none). Nine new driver
profiles (Baird, Parnell, Gerard, Kelly, Allard, Bira, Rolt, Macklin,
Rosier) + enriched existing ones; photos.json personIds re-resolved
(28→42 links); every profile card now shows a curated archive photograph
(register-ID badge). Race records gained verified dates (1951 UT 2 June,
1951 TT 15 Sept, 1953 UT 16 May, 1953 TT 5 Sept, 1954 TT 11 Sept, 1955
TT 17 Sept) and podium/pole/fastest-lap notes rendered on the result
cards. Winterbottom's 1951 accident location added as reported
(Wheeler's Corner, hedged, R28) — giving 1951 a circuit link chip.
Archive photography is now the full 44-photo gallery (responsive 2–3
columns, captions below; the 1950 rarities keep a roomier two-across
section); Film tab links out to the BFI Player's free 1955 Ulster Trophy
film (external link, not embedded; Film.status 'external' added).
CLAUDE.md amended on the owner's instruction: web supplementation
allowed with register entries; corrections register still wins (7:03:11
kept over Wikipedia's 7:03:12). Gates: validator green (30 people, 14
locations), tsc clean, 21/21 Vitest, 26/26 Playwright e2e (5 new),
visual review of Archive/Drivers/Circuit/Story.
**Unverified / outstanding:** start/finish landmark position is
provisional (placed ~45% along the Quarry→Rushyhill straight to match
the map's label; survey-grade confirmation outstanding like all
landmarks); 1955 Ulster Trophy exact date still month-only; Winterbottom
location is a reported attribution (Wikipedia fatalities list), hedged
in copy; no internet photographs of the corners added this pass — the
desktop-app bridge (used previously to fetch imagery through the
owner's browser) was offline, and the workspace proxy blocks image
hosts; licensed modern corner photography (e.g. CC BY-SA Geograph) can
be added with per-image credits when the owner reconnects or supplies
files. No photographs of drivers will be downloaded from the web, per
policy.

## Stage 4 — Six Racing Seasons interactive timeline — 2026-11-08
**Passed:** horizontal 1950–1955 timeline strip (sticky, scrollable; one
station per year with chapter title and a dot per scheduled meeting —
filled when held, hollow for the 1952 TT and 1954 Ulster Trophy, so the
strip itself stays historically honest); six cinematic story chapters
built entirely from the verified catalogue — chapter kicker (roman
numeral + ghost year numeral), prompt-supplied chapter titles, storyCue
standfirst, verified summary, hero photograph per year (1955's large PNG
gets the wide treatment; all others stay within native-size rules),
race-result panels unchanged in their classification distinctions,
documented events kept inside their year (no standalone remembrance),
clickable photo strip per year opening the full-screen viewer scoped to
that season, and connected link chips (race winners and documented-event
people → driver-profile anchors; documented places → `/circuit?loc=`
deep link that opens the location story panel). Photo viewer now links
catalogued people in the image to their profiles; `photos.json` gained
`personIds` (28 resolved, exact-name matches only — uncatalogued names
stay as text, hedged names keep their hedge); `years.json` gained
`chapterTitle` + `heroPhotoId`; validator extended (hero resolves, is in
the archive, matches its year; personIds resolve). Driver cards carry
`id` anchors. Gates: `tsc --noEmit` clean, build + validator green,
21/21 Vitest (3 new Stage 4 content tests), 21/21 Playwright e2e (5 new:
timeline dots honest, 1954 two-result-system distinction, year-scoped
viewer, viewer→driver deep link, chapter→circuit place deep link).
Visual review at 1440 px and 390 px via screenshots.
**Fixed en route (latent regressions exposed when the ArcGIS CDN became
reachable in the test sandbox):** the desktop-nav rule
`.menu-button { display:none }` at ≥60rem was hiding every toolbar that
reuses the class — circuit map-mode/lap buttons and the photo viewer's
Previous/Close/Next on desktop. Now scoped to the masthead menu and its
drawer. Chapter anchors also gained scroll-margin so deep links clear
the sticky timeline.
**Unverified / outstanding:** no photograph has a verified circuit
location, so no photo→map jumps were added (prompt allows them only if
verified); per-image contributor credits deliberately not added to the
viewer — the collection-level Armstrong credit remains the only credit,
per the permanent photo rules; plus the standing outstanding items
below.

## Merge & first deployment — 2026-11-08
**Passed:** PRs #1–#3 merged to main (stage branches left in place — the
environment's safety rules block branch deletion; owner can tidy).
GitHub Pages deployment added (.github/workflows/deploy.yml: npm ci,
build with type-check + content validator, Vitest, upload + deploy);
owner enabled Pages (Source: GitHub Actions); live at
https://johnchewitt.github.io/dundrodtt/. Two live-only defects found
and fixed by verifying in a real browser: (1) repo-relative GeoJSON
paths resolved against the SDK's CDN-origin workers — made absolute;
(2) even absolute, concurrent worker fetches proved flaky (one of three
loaded) — the app now fetches GeoJSON on the main thread and hands each
layer its own blob URL. Verified live: cover with crossfade, circuit
explorer with illuminated route and all 13 labelled landmarks on the
dark basemap, map-click → camera flight → floating Tornagrough story
panel with restrained incident text, Then & Now section and provisional
note. Camera-opening extent via queryExtent fallback.

## Stage 3 completion — landmarks, lap, map modes — 2026-11-08
**Passed:** 13 provisional landmark points generated — every point
snapped onto the verified route polyline, positioned from the 1954
programme map order, the owner's corner map and the route's own
geometric features (the B101/B38 junction, the angled stream-crossing
kink at Leathemstown Bridge, the digitised hairpin tip); period names,
clockwise seq 1–13; provenance appended to data/circuit/PROVENANCE.md.
landmarksLayerUrl configured: markers with period-style labels,
map-click → story panel, catalogue → camera goTo, and "Take a Lap of
Dundrod" (full play/pause/skip/restart/exit on the tested LapEngine)
are all live. Map modes: dark / satellite / 3D terrain scene
(arcgis-scene, world elevation), store-driven; the location panel gains
a Then & Now section (honest no-modern-photo state + "see this place
from above today" satellite action). geometryStatus 'provisional'
introduced and labelled in the panel. Gates: validator (now checks
landmarks locIds, unique seq, Dundrod-area coordinates); tsc; oxlint;
Vitest 18/18; Playwright 15/15; production build.
**Unverified / outstanding (honestly):** live rendering of basemap,
markers, camera flights, 2D/3D transitions and lap motion needs an
open network (this environment blocks the ArcGIS CDN — the e2e asserts
the explorer-or-honest-error contract instead); landmark positions are
provisional pending survey-grade confirmation; Then & Now photo
comparisons await approved modern photography; no photo↔location links
exist yet so no "Show on Circuit" actions are shown (none invented).

## Stage 3 circuit wiring — 2026-11-08
**Passed:** the owner's circuit trace (supplied as EPSG:29902 GeoJSON +
modern UGP corner map) was verified — closed loop, clockwise, correct
Dundrod geography, 12,061 m — and found to follow the post-1965 layout
at the hairpin (modern corner names incl. Lindsay Hairpin / Joey's
Windmill on the companion map). With the owner's approval the 1950s
hairpin was restored: a 19-vertex spur digitised from georeferenced
current imagery of the surviving roads (Upper Springfield Rd out, the
now-dead-end lane back), corroborated by the 1954 RAC TT programme
track map (OS-based; copy in data/circuit/) and the documented ~110 m
1965 relocation. Corrected route (12,313 m) committed as
public/circuit/route.geojson (WGS84) with full provenance in
data/circuit/PROVENANCE.md; routeLayerUrl configured; explorer renders
route-only without landmarks (none supplied — nothing invented); lap
and location-panel copy updated; validator, tsc, Vitest 17/17,
Playwright 16/16, build green.
**Unverified / outstanding:** live map rendering (this environment
blocks the ArcGIS CDN — verify with npm run dev on an open network);
the ~60 m of the hairpin U crossing a modern yard is approximate;
measured length sits +3.2% over the documented 7 mi 732 yd (owner's
base trace +1.1%; quoted old-vs-modern figures are in tension with any
sizeable spur — shape evidence treated as primary; owner may refine if
the 1952–67 OS sheet surfaces); Leathemstown retained as supplied
pending a period-sheet check; landmark points (locId/name/seq) still
awaited for markers, camera moves and the guided lap.

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
