import { arcgisSettings } from '../../config/appSettings';

/**
 * The single integration point for the circuit map.
 *
 * Stage 5 adds the ArcGIS Maps SDK 5.1 view (map components) behind this
 * seam, consuming the owner-supplied FeatureLayer. Until then — and
 * always, when no FeatureLayer is configured — the clearly labelled
 * schematic fallback renders, and the app stays fully runnable with zero
 * map configuration.
 */
export default function CircuitMapSeam() {
  const configured = Boolean(arcgisSettings.featureLayer);
  return (
    <div className="map-frame">
      <div
        className="map-fallback"
        role="img"
        aria-label="Schematic placeholder for the Dundrod circuit map"
      >
        <h3>The Dundrod circuit, 1950–1955</h3>
        <p>
          7 miles 732 yards of closed public roads, run clockwise. This panel
          will hold the interactive circuit experience; the schematic drawing
          redrawn from the 1953 programme map stands in first. Schematic, not
          to scale.
        </p>
        {configured && (
          <p>
            A circuit FeatureLayer is configured; the interactive ArcGIS map
            arrives with the circuit build stage.
          </p>
        )}
      </div>
    </div>
  );
}
