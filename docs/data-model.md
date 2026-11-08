# Historical data model

Static JSON in `src/content/`, one file per entity collection, typed in
`src/model/`. Facts live here once; components never carry facts. Every
record carries `sourceRefs: string[]` pointing into the source catalogue
(R01–R22). Required fields marked •.

## Entities

**Year** (`years.json`) — `y1950`…`y1955`
•id ·•year ·•summary ·•sourceRefs · storyCue · photoIds[] ·
•chapterTitle (Stage 4 chapter heading) ·•heroPhotoId (validated: must
resolve to an archive photo catalogued in that year)

**Person** also carries optional `photoId` — a curated archive
photograph for the profile card (validated).

**Race** (`races.json`) — `race-1950-ut`, `race-1953-tt`, …
•id ·•yearId ·•event (`ulster-trophy` | `rac-tt`) ·•status (`held` |
`not-held`) ·•sourceRefs · date · laps · time · notHeldReason · notes ·
championship (e.g. World Sportscar Championship round, 1953–55 TT) ·
**classifications[]** when held: { •award (`outright` | `scratch` |
`handicap` | `fastest-finisher` | `handicap-champion-trophy`) ·
•winnerPersonIds[] · carId · teamId · note }
Dual-result years are structural: 1954 TT = scratch + handicap entries;
1955 UT = fastest-finisher + handicap-champion-trophy entries.

**Person** (`people.json`) — `p-stirling-moss`, `p-desmond-titterington`…
•id ·•name ·•sourceRefs · context (source-backed only) · homePlace ·
role (`driver` | `team-figure` | `other`)

**Team / Entrant** (`teams.json`) — `t-jaguar`, `t-ecurie-ecosse`…
•id ·•name ·•sourceRefs · context

**Car** (`cars.json`) — `c-jaguar-d-type`, `c-brm-v16`…
•id ·•name ·•sourceRefs · context

**Photo** (`photos.json`) — spreadsheet IDs verbatim: `DU-1950-01`…
•id ·•filePath (exact spreadsheet relative path, NFC) ·•year ·•caption
(Caption column verbatim) ·•altText ·•include · imageTitle · yearBasis ·
event · peopleNames[] (as catalogued) · personIds[] (resolved links
only where the name maps unambiguously) · carSubject · raceNumber ·
tags[] · reviewNote (internal — never rendered) · special1950 (flag for
the rare-1950 presentation) · width/height (from asset pipeline)

**CircuitLocation** (`locations.json`) — `loc-deers-leap`,
`loc-leathemstown-bridge`, `loc-1950s-hairpin`…
•id ·•name ·•sourceRefs · story · photoIds[] · incidentIds[] ·
thenAndNowIds[] · mapFeatureId (join to FeatureLayer `locId`)

**Incident** (`incidents.json`) — `inc-1951-tt`, `inc-1955-deers-leap`,
`inc-1955-tornagrough`
•id ·•yearId ·•peopleNames[] ·•text (restrained, source wording) ·
•sourceRefs · raceId · locationId
Rendered only inside year and location stories — never as a standalone
section (see CLAUDE.md).

**Source** (`sources.json`) — `R01`…`R22` plus supplied-file entries
•id ·•title · note · kind (`supplied` | `verified-web`)

**Film** (`films.json`) — `f-…` (empty until footage is authorised)
•id ·•title ·•status (`unavailable` | `authorised`) · provider
(`british-pathe` | `ni-screen` | `other`) · url/embed · date · yearId ·
sourceRef · authorisationNote
Only `authorised` films ever render as embeds; everything else is an
honest unavailable state.

**Acknowledgement** (`acknowledgements.json`)
`ack-armstrong` (•visible; message + portrait DU-ACK-01) ·
`ack-1950-contributor` (•hidden; message ready, `name: null` — never a
placeholder name on the public app)
•id ·•message ·•visibility (`visible` | `hidden`) · name · portraitPhotoId

**ThenAndNow** (`then-and-now.json`) — `tan-…` (Dundrod Today)
•id ·•locationId ·•status (`awaiting-modern-photo` | `complete`) ·
historicPhotoId · modernAssetPath (owner-supplied only) · note
No modern photography has been supplied yet; records exist only as
owner-supplied material arrives. Never source modern imagery elsewhere.

## Integrity rules (enforced by `npm run validate:content`)
- Every `*Id`/`*Ids` reference resolves to an existing record.
- Every `photo.filePath` exists on disk, NFC-normalized; every photo on
  disk is catalogued (46 ↔ 46).
- `include: false` photos (DU-1955-04-DUP, DU-ACK-01) never appear in the
  race archive; `reviewNote` never reaches the rendered DOM (tested).
- Hidden acknowledgements never render (tested).
- Race classifications match the corrections register in
  docs/source-catalogue.md (spot-checked in unit tests: 1952 UT winner,
  1954 dual result, 1955 time 7:03:11).
