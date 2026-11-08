/**
 * App settings. ArcGIS configuration is owner-supplied, never invented:
 * the FeatureLayer (item ID or service URL) arrives during development;
 * until then it stays null and the labelled schematic fallback renders.
 * Any API key comes only from an uncommitted .env (VITE_ARCGIS_API_KEY).
 */

export interface ArcgisSettings {
  /** ArcGIS Online FeatureLayer item ID or service URL. Null = not yet supplied. */
  featureLayer: string | null;
  portalUrl: string;
  apiKey: string | null;
}

export const arcgisSettings: ArcgisSettings = {
  featureLayer: null,
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
