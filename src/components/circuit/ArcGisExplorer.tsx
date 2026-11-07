import { useEffect, useRef, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import type MapView from '@arcgis/core/views/MapView';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import '@arcgis/map-components/components/arcgis-map';
import { arcgisSettings } from '../../config/appSettings';
import { useUiStore } from '../../store/uiStore';
import { LapEngine, type LapStop } from './lapEngine';
import { TakeALap, type LapControlsState } from './GuidedLap';

/* Palette (tokens.css) expressed for the map. */
const GOLD = [203, 167, 108, 1];
const GOLD_GLOW = [203, 167, 108, 0.28];
const GREEN_DEEP = [9, 43, 36, 1];
const IVORY = [242, 235, 221, 1];

/** Minimal surface of the <arcgis-map> custom element we rely on. */
interface ArcgisMapElement extends HTMLElement {
  basemap: string;
  view: MapView;
  map: { addMany(layers: FeatureLayer[]): void } | null;
}

function routeRenderers() {
  const glow = new SimpleRenderer({
    symbol: new SimpleLineSymbol({ color: GOLD_GLOW, width: 10, cap: 'round' }),
  });
  const line = new SimpleRenderer({
    symbol: new SimpleLineSymbol({ color: GOLD, width: 3.2, cap: 'round' }),
  });
  return { glow, line };
}

function landmarkRenderer() {
  return new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 11,
      color: GREEN_DEEP,
      outline: { color: GOLD, width: 1.6 },
    }),
  });
}

function landmarkLabels() {
  return new LabelClass({
    labelExpressionInfo: { expression: '$feature.name' },
    labelPlacement: 'above-center',
    symbol: {
      type: 'text',
      color: IVORY,
      haloColor: GREEN_DEEP,
      haloSize: 1.4,
      font: { family: 'Avenir Next LT Pro', size: 10, style: 'italic' },
    },
  });
}

/**
 * The interactive circuit map, created only when the owner's verified
 * FeatureLayer is configured. Geography lives entirely in the supplied
 * service: the camera opens on the route layer's own extent and every
 * marker comes from the layer — nothing is invented here. Landmark
 * features join editorial content through their `locId` field.
 */
export default function ArcGisExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const landmarksRef = useRef<FeatureLayer | null>(null);
  const engineRef = useRef<LapEngine | null>(null);
  const [satellite, setSatellite] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [lap, setLap] = useState<LapControlsState>({
    state: 'idle',
    stopIndex: 0,
    total: 0,
  });
  const selectedLocationId = useUiStore((s) => s.selectedLocationId);
  const selectLocation = useUiStore((s) => s.selectLocation);

  // Build the map element once.
  useEffect(() => {
    const container = containerRef.current;
    const { routeLayerUrl, landmarksLayerUrl } = arcgisSettings;
    if (!container || !routeLayerUrl) return;

    const el = document.createElement('arcgis-map') as ArcgisMapElement;
    // Legacy basemap ids work without an API key; the layer is public.
    el.basemap = 'dark-gray-vector';
    el.style.width = '100%';
    el.style.height = '100%';
    container.appendChild(el);

    const { glow, line } = routeRenderers();
    const routeGlow = new FeatureLayer({ url: routeLayerUrl, renderer: glow });
    const route = new FeatureLayer({ url: routeLayerUrl, renderer: line });
    const landmarks = new FeatureLayer({
      url: landmarksLayerUrl ?? routeLayerUrl,
      renderer: landmarkRenderer(),
      labelingInfo: [landmarkLabels()],
      outFields: ['locId', 'name', 'seq'],
    });
    landmarksRef.current = landmarks;

    const onReady = async () => {
      const view = el.view;
      viewRef.current = view;
      el.map?.addMany([routeGlow, route, landmarks]);
      try {
        await route.when();
        if (route.fullExtent) {
          await view.goTo(route.fullExtent.expand(1.25), { animate: false });
        }
      } catch {
        setLoadError(true);
        return;
      }
      view.on('click', async (event) => {
        const hit = await view.hitTest(event, { include: [landmarks] });
        const graphic = hit.results.find((r) => r.type === 'graphic');
        const locId =
          graphic && 'graphic' in graphic
            ? (graphic.graphic.attributes?.locId as string | undefined)
            : undefined;
        if (locId) selectLocation(locId);
      });
    };
    el.addEventListener('arcgisViewReadyChange', onReady);
    const onError = () => setLoadError(true);
    el.addEventListener('arcgisError', onError);

    return () => {
      engineRef.current?.exit();
      el.removeEventListener('arcgisViewReadyChange', onReady);
      el.removeEventListener('arcgisError', onError);
      el.remove();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Catalogue/panel selection → camera.
  useEffect(() => {
    const view = viewRef.current;
    const landmarks = landmarksRef.current;
    if (!view || !landmarks || !selectedLocationId) return;
    (async () => {
      const result = await landmarks.queryFeatures({
        where: `locId = '${selectedLocationId.replace(/'/g, "''")}'`,
        returnGeometry: true,
        outFields: ['locId'],
      });
      const feature = result.features[0];
      if (feature?.geometry) {
        const reduce = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;
        await view.goTo(
          { target: feature.geometry, scale: 18000 },
          { animate: !reduce, duration: 1400 },
        );
      }
    })();
  }, [selectedLocationId]);

  // Basemap toggle (legacy ids: keyless).
  useEffect(() => {
    const el = containerRef.current?.querySelector('arcgis-map') as
      | ArcgisMapElement
      | null;
    if (el) el.basemap = satellite ? 'hybrid' : 'dark-gray-vector';
  }, [satellite]);

  const startLap = async () => {
    const landmarks = landmarksRef.current;
    const view = viewRef.current;
    if (!landmarks || !view) return;
    const result = await landmarks.queryFeatures({
      where: 'seq IS NOT NULL',
      returnGeometry: false,
      outFields: ['locId', 'seq'],
    });
    const stops: LapStop[] = result.features
      .map((f) => ({
        locId: f.attributes.locId as string,
        seq: Number(f.attributes.seq),
      }))
      .filter((s) => s.locId && Number.isFinite(s.seq));
    if (stops.length === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    engineRef.current?.exit();
    engineRef.current = new LapEngine(
      stops,
      {
        goToStop: async (locId, { animate }) => {
          const r = await landmarks.queryFeatures({
            where: `locId = '${locId.replace(/'/g, "''")}'`,
            returnGeometry: true,
            outFields: ['locId'],
          });
          const g = r.features[0]?.geometry;
          if (g) {
            await view.goTo(
              { target: g, scale: 15000 },
              { animate, duration: 2600, easing: 'cubic-in-out' },
            );
          }
        },
        release: () => selectLocation(null),
      },
      {
        onStop: (stop, stopIndex, total) => {
          selectLocation(stop.locId);
          setLap((l) => ({ ...l, stopIndex, total }));
        },
        onStateChange: (state) =>
          setLap((l) => ({
            ...l,
            state,
            total: engineRef.current?.total ?? l.total,
          })),
      },
      { reduceMotion: reduce },
    );
    engineRef.current.play();
  };

  if (loadError) {
    return (
      <div className="map-frame">
        <div className="map-fallback" role="status">
          <h3>The circuit map could not load</h3>
          <p>
            The configured circuit layer did not respond. The named places
            and their stories below still work; try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="explorer">
      <div className="explorer-map" ref={containerRef} />
      <div className="explorer-toolbar">
        <button
          type="button"
          className="menu-button"
          aria-pressed={satellite}
          onClick={() => setSatellite((v) => !v)}
        >
          {satellite ? 'Dark map' : 'Satellite'}
        </button>
        <TakeALap
          controls={lap}
          onPlay={() =>
            engineRef.current && engineRef.current.currentState === 'paused'
              ? engineRef.current.play()
              : startLap()
          }
          onPause={() => engineRef.current?.pause()}
          onSkip={() => engineRef.current?.skip()}
          onRestart={() => engineRef.current?.restart()}
          onExit={() => engineRef.current?.exit()}
        />
      </div>
    </div>
  );
}
