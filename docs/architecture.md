# Technical architecture

## Stack
- **React 19 + TypeScript + Vite**, static SPA, GitHub Pages hosting
  (hash routing or 404-redirect pattern; decided at stage 1 — hash routing
  preferred for zero-config Pages deploys; `base` set from repo name).
- **ArcGIS Maps SDK for JavaScript 5.1** via `@arcgis/map-components`
  (web components: `<arcgis-map>` etc.) with peer `@arcgis/core@^5.1` and
  `@esri/calcite-components@^5.1`. Calcite used where genuinely useful
  (map UI chrome); the exhibition's own design system styles everything
  else. No deprecated SDK methods; component-based pattern throughout.
- **State**: zustand — one small store for cross-cutting UI state
  (selected year, selected location, archive filters, viewer state).
  Everything else stays in component state or the URL.
- **Content**: static JSON in `src/content/` (schema in
  docs/data-model.md), TypeScript types alongside, and a build-time
  validation script (`npm run validate:content`) that checks referential
  integrity (every ID reference resolves) and that every photo filePath
  exists on disk, NFC-normalized. The validator runs in CI and before
  every production build, so broken links and missing images cannot ship.
- **Testing**: Vitest for data/model/util/component tests; Playwright for
  the journeys (home → timeline → archive; map fallback; keyboard nav).
- **Assets**: photographs under `public/photos/<year>/…` with the
  spreadsheet's exact relative paths (NFC). An optimisation step generates
  responsive variants/WebP where beneficial, but never upscales — 44 of 46
  images are under 800 px wide; full-bleed treatment is reserved for the
  two large 1955 PNGs, with art-directed staging (mattes, grain, duotone
  surrounds) elsewhere.

## Module layout
```
src/
  config/appSettings.ts     // site identity + ArcGIS config (no secrets)
  content/                  // static JSON — the only home of facts
  model/                    // generated/handwritten types + loaders
  store/                    // zustand store
  components/               // presentation only — no facts in components
    map/                    // ALL ArcGIS imports live here, lazy-loaded
  experiences/              // the seven core experiences (route-level)
  styles/                   // tokens.css + app css (design system)
docs/                       // this documentation set
scripts/                    // content validator, asset pipeline
```

## ArcGIS integration contract (Stage 3: implemented, awaiting the layer)
- **Owner supplies, when ready** (publicly shared, no key needed):
  - `routeLayerUrl` — FeatureLayer URL for the 1950–55 course polyline
    (rendered as an illuminated gold route; the camera opens on this
    layer's own `fullExtent`, so the app hardcodes no coordinates).
  - `landmarksLayerUrl` — FeatureLayer URL for landmark points (may be a
    sublayer of the same service) with fields:
    `locId` (string — must match `CircuitLocation.id`, e.g.
    `loc-deers-leap`; see src/content/locations.json for all 13 ids),
    `name` (string — period label shown on the map),
    `seq` (integer — clockwise order for the guided lap; features
    without `seq` are skipped by the lap but still selectable).
  - Any Web Mercator / WGS84 service works; the SDK reprojects.
  Both set in `src/config/appSettings.ts`. `VITE_ARCGIS_API_KEY`
  (uncommitted `.env`) remains supported for modern basemap styles;
  the default basemaps used (`dark-gray-vector`, `hybrid`) are keyless.
  Until supplied, both URLs are `null` and nothing is invented.
- **Division of responsibility**: the FeatureLayer owns geography
  (geometry, basemap context); local JSON owns meaning (location stories,
  photos, incidents, then-and-now). Join key: each landmark feature
  carries a `locId` attribute matching `CircuitLocation.id`.
- **Interaction**: feature click → store `selectedLocationId` → location
  panel; list/panel selection → map highlight/goTo. The schematic
  fallback (SVG redrawn from the 1953 programme map embedded in the
  context docx; labelled "schematic, not to scale") implements the same
  selection interface, so the live layer drops in with no UI rework.
  Optional cinematic guided lap runs on either backend (sequenced
  location visits; on ArcGIS, animated camera moves; on the schematic,
  SVG path traversal) and respects `prefers-reduced-motion`.
- **Fallback states**: no config → schematic with a clear notice; load
  failure → same, with a retry; never a broken or empty map panel. The
  app is fully functional with zero map configuration.

## Quality gates (every stage)
`npx tsc --noEmit` · `npm run validate:content` · `npm run test` (Vitest)
· Playwright suite for touched journeys · `npm run build` · docs update ·
entry in docs/verification-log.md · stable Git commit (branch + PR where
practical). Accessibility floor: semantic headings, keyboard operation,
visible focus, spreadsheet alt text, AA contrast, touch-sized targets,
reduced-motion support, no hover-only information.
