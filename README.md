# Dundrod — The Forgotten Racing Years

**When Formula 1 came to Northern Ireland.** A digital heritage
experience about the six seasons of international motor racing on the
Dundrod road circuit, County Antrim, 1950–1955 — the Ulster Trophy and
the RAC Tourist Trophy, the drivers and teams who came, the photographs
and films that survive, and the roads as they are today.

**Live:** https://johnchewitt.github.io/dundrodtt/

> Dundrod hosted Formula One cars and Formula One World Championship
> drivers — though never a championship Grand Prix. That distinction is
> preserved throughout.

## The experiences

| Route | Experience |
| --- | --- |
| `/discover` | **Discover Dundrod** — the eight-scene guided visit |
| `/story` | The Dundrod Story — from the Ards TT to the last flag |
| `/circuit` | Explore the Circuit — interactive 1950s course, guided lap, period map |
| `/seasons` | Six Racing Seasons — the 1950–1955 timeline |
| `/drivers` | Drivers & Teams — profiles, Local Heroes, the machines |
| `/archive` | The Archive — photographs, films, Behind the Photographs |
| `/today` | Dundrod Today — the surviving roads on modern imagery |

## Historical integrity

- Historical copy rests on the project's supplied sources, supplemented
  by registered references (`src/content/sources.json`, R01–R42). Where
  a supplementary source conflicts with the supplied corrections
  register, the register wins.
- Nothing is invented: hedged identifications stay hedged (and surface
  as *probable*), review notes never render, no photograph is given a
  circuit location that isn't verified, and the two result systems of
  1954 — like the Ulster Trophy / RAC TT distinction everywhere — are
  kept strictly apart.
- A build-time validator (`scripts/validate-content.mjs`) enforces
  referential integrity across photographs, races, people, teams, cars,
  films, landmarks and sources on every build.
- `docs/verification-log.md` records, stage by stage, what was verified
  and what remains open. `docs/permission-register.md` tracks media
  permissions.

## Rights and attribution

- **Photographs** © their contributors, shown by kind permission.
  Collection credit: *Neville Armstrong kindly contributed photographs
  of Dundrod from the 1950s.* Seven rare 1950 photographs came from a
  second contributor, acknowledged pending their confirmed name.
- **Films** remain with their archives — British Pathé, Northern
  Ireland Screen's Digital Film Archive, BFI Player — and are linked to
  the holders' own players, never embedded, downloaded or re-cut.
- **Maps**: ArcGIS basemaps © Esri and their data providers;
  attribution is displayed on the map itself. The period course map is
  from a 1950s race programme, drawn from the Ordnance Survey of
  Northern Ireland by sanction of H.M. Stationery Office (Crown
  copyright of the era expired).
- Please contact the project before reusing any material. No licence is
  granted by this repository's visibility.

## Development

React 19 + TypeScript + Vite · ArcGIS Maps SDK for JavaScript 5.x via
`@arcgis/map-components` · zustand · static JSON content with generated
types · Vitest + Playwright.

```bash
npm ci
npm run dev        # local development
npm run build      # type-check + content validator + production build
npm run lint       # oxlint over src/e2e/scripts
npx vitest run     # unit tests
CHROME_PATH=$(which google-chrome) npx playwright test   # e2e (builds first)
```

Optional map configuration goes in an uncommitted `.env`
(`VITE_ARCGIS_API_KEY`); without it the app runs fully on the bundled
GeoJSON layers and keyless basemaps. See `docs/architecture.md`.

### Deployment

GitHub Pages via `.github/workflows/deploy.yml`: every push to `main`
runs `npm ci` → build (type-check + validator) → unit tests → deploy.
The Vite base path is `/dundrodtt/`; routing is hash-based so deep
links need no server rewrites. To deploy a fork: enable **Settings →
Pages → Source: GitHub Actions** and push to `main`.

## Acknowledgements

Built for the project's owner from his collected sources and the
contributed photographic archive. See the application's
Acknowledgements page and *Behind the Photographs*.
