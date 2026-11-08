/**
 * App settings. ArcGIS configuration is owner-supplied, never invented:
 * the owner's verified circuit FeatureLayer (route polyline + landmark
 * points) arrives during development; until then the URLs stay null and
 * the labelled schematic fallback renders. The layer will be shared
 * publicly, so no API key is required; VITE_ARCGIS_API_KEY (uncommitted
 * .env) remains supported for modern basemap styles if ever wanted.
 *
 * Expected layer schema — see docs/architecture.md:
 *   route layer:     polyline(s) of the 1950–55 course
 *   landmarks layer: points with fields locId (matches
 *                    CircuitLocation.id), name, seq (guided-lap order)
 */

export interface ArcgisSettings {
  /**
   * Route polyline for the 1950–55 course. Either a hosted FeatureLayer
   * URL, or a GeoJSON file — remote URL or a repo-relative path such as
   * "circuit/route.geojson" (place the file in public/circuit/).
   * Null = not yet supplied.
   */
  routeLayerUrl: string | null;
  /** Landmark points (same options; fields locId, name, seq). */
  landmarksLayerUrl: string | null;
  portalUrl: string;
  apiKey: string | null;
}

export const arcgisSettings: ArcgisSettings = {
  // The 1950–55 route, corrected at the hairpin and owner-approved
  // 2026-11-08; provenance in data/circuit/PROVENANCE.md.
  routeLayerUrl: 'circuit/route.geojson',
  // Provisional landmark points: placed on the verified route from the
  // 1954 programme map order, the owner's corner map and the route's
  // own geometry; period names. See landmarks.geojson properties note.
  landmarksLayerUrl: 'circuit/landmarks.geojson',
  portalUrl: 'https://www.arcgis.com',
  apiKey: import.meta.env.VITE_ARCGIS_API_KEY ?? null,
};

export const siteSettings = {
  identity: 'Dundrod — The Forgotten Racing Years',
  headline: 'When Formula 1 Came to Northern Ireland',
  subtitle:
    "Six extraordinary seasons. Legendary drivers. The world's finest racing cars. One unforgettable road circuit.",
  /** The distinction that must accompany the headline framing. */
  headlineDistinction:
    'Dundrod hosted Formula One cars and Formula One World Championship drivers — though never a championship Grand Prix.',
};
