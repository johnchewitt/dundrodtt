import { lazy, Suspense } from 'react';
import { arcgisSettings } from '../../config/appSettings';
import { TakeALap } from '../circuit/GuidedLap';

const ArcGisExplorer = lazy(() => import('../circuit/ArcGisExplorer'));

/**
 * The single integration point for the circuit map. With the owner's
 * verified FeatureLayer configured, the ArcGIS explorer loads lazily
 * (the SDK never weighs down other pages). Without it — or while it
 * loads — the clearly labelled schematic fallback keeps the page whole,
 * and the landmark catalogue and story panels work either way.
 */
export default function CircuitMapSeam() {
  if (!arcgisSettings.routeLayerUrl) {
    return (
      <div>
        <div className="map-frame">
          <div
            className="map-fallback"
            role="img"
            aria-label="Schematic placeholder for the Dundrod circuit map"
          >
            <h3>The Dundrod circuit, 1950–1955</h3>
            <p>
              7 miles 732 yards of closed public roads, run clockwise. The
              interactive map opens here the moment the verified circuit
              layer is supplied — the route is never approximated from
              memory. Schematic, not to scale.
            </p>
          </div>
        </div>
        <TakeALap />
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="loading-panel" aria-label="Loading the circuit map" />}>
      <ArcGisExplorer />
    </Suspense>
  );
}
