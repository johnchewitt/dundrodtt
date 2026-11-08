import { useEffect, useRef, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-scene';
import { arcgisSettings } from '../../config/appSettings';
import { useUiStore } from '../../store/uiStore';
import { LapEngine, type LapStop } from './lapEngine';
import { TakeALap, type LapControlsState } from './GuidedLap';

/* Palette (tokens.css) expressed for the map. */
const GOLD = [203, 167, 108, 1];
const GOLD_GLOW = [203, 167, 108, 0.28];
const GREEN_DEEP = [9, 43, 36, 1];
const IVORY = [242, 235, 221, 1];

/** Either hosted FeatureLayers or repo-local GeoJSON files work; the
 *  two classes share the query/render surface the explorer uses. */
type CircuitLayer = FeatureLayer | GeoJSONLayer;

/** The camera/query surface shared by MapView and SceneView. */
interface ViewLike {
  goTo(target: unknown, options?: unknown): Promise<unknown>;
  on(name: string, handler: (event: never) => void): unknown;
  hitTest(
    event: unknown,
    options?: { include: unknown[] },
  ): Promise<{ results: Array<{ type: string; graphic?: { attributes?: Record<string, unknown> } }> }>;
}

/** Minimal surface of the <arcgis-map>/<arcgis-scene> custom elements. */
interface ArcgisViewElement extends HTMLElement {
  basemap: string;
  view: ViewLike;
  map: { addMany(layers: CircuitLayer[]): void } | null;
}

function makeLayer(
  url: string,
  options: {
    renderer: SimpleRenderer;
    labelingInfo?: LabelClass[];
    outFields?: string[];
  },
): CircuitLayer {
  const isGeojson = /\.(geo)?json($|\?)/i.test(url);
  // GeoJSON is WGS84 by spec; the SDK reprojects. A relative path serves
  // from the app's own origin (e.g. public/circuit/route.geojson).
  const resolved =
    isGeojson && !/^https?:/i.test(url) ? import.meta.env.BASE_URL + url : url;
  return isGeojson
    ? new GeoJSONLayer({ url: resolved, ...options })
    : new FeatureLayer({ url: resolved, ...options });
}

function buildLayers() {
  const { routeLayerUrl, landmarksLayerUrl } = arcgisSettings;
  if (!routeLayerUrl) return null;
  const routeGlow = makeLayer(routeLayerUrl, {
    renderer: new SimpleRenderer({
      symbol: new SimpleLineSymbol({ color: GOLD_GLOW, width: 10, cap: 'round' }),
    }),
  });
  const route = makeLayer(routeLayerUrl, {
    renderer: new SimpleRenderer({
      symbol: new SimpleLineSymbol({ color: GOLD, width: 3.2, cap: 'round' }),
    }),
  });
  // Landmarks only when their layer exists — never derived from the
  // route line, never invented.
  const landmarks = landmarksLayerUrl
    ? makeLayer(landmarksLayerUrl, {
        renderer: new SimpleRenderer({
          symbol: new SimpleMarkerSymbol({
            size: 11,
            color: GREEN_DEEP,
            outline: { color: GOLD, width: 1.6 },
          }),
        }),
        labelingInfo: [
          new LabelClass({
            labelExpressionInfo: { expression: '$feature.name' },
            labelPlacement: 'above-center',
            symbol: {
              type: 'text',
              color: IVORY,
              haloColor: GREEN_DEEP,
              haloSize: 1.4,
              font: { family: 'Avenir Next LT Pro', size: 10, style: 'italic' },
            },
          }),
        ],
        outFields: ['locId', 'name', 'seq'],
      })
    : null;
  return { routeGlow, route, landmarks };
}

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The interactive circuit explorer. Geography lives entirely in the
 * supplied layers: the camera opens on the route's own extent and every
 * marker comes from the landmarks layer — nothing is invented here.
 * Landmark features join editorial content through their `locId` field.
 * mapMode: dark exhibition map, satellite (Then & Now), or 3D terrain.
 */
export default function ArcGisExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<ViewLike | null>(null);
  const elRef = useRef<ArcgisViewElement | null>(null);
  const landmarksRef = useRef<CircuitLayer | null>(null);
  const engineRef = useRef<LapEngine | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [lap, setLap] = useState<LapControlsState>({
    state: 'idle',
    stopIndex: 0,
    total: 0,
  });
  const mapMode = useUiStore((s) => s.mapMode);
  const setMapMode = useUiStore((s) => s.setMapMode);
  const selectedLocationId = useUiStore((s) => s.selectedLocationId);
  const selectLocation = useUiStore((s) => s.selectLocation);
  const is3D = mapMode === '3d';

  // Build (or rebuild, on 2D/3D switch) the view element.
  useEffect(() => {
    const container = containerRef.current;
    const layers = buildLayers();
    if (!container || !layers) return;

    const el = document.createElement(
      is3D ? 'arcgis-scene' : 'arcgis-map',
    ) as ArcgisViewElement;
    // Legacy basemap ids work without an API key; the layers are local.
    el.basemap =
      useUiStore.getState().mapMode === 'satellite' ? 'hybrid' : 'dark-gray-vector';
    if (is3D) el.setAttribute('ground', 'world-elevation');
    el.style.width = '100%';
    el.style.height = '100%';
    container.appendChild(el);
    elRef.current = el;
    landmarksRef.current = layers.landmarks;

    const onReady = async () => {
      const view = el.view;
      viewRef.current = view;
      el.map?.addMany(
        layers.landmarks
          ? [layers.routeGlow, layers.route, layers.landmarks]
          : [layers.routeGlow, layers.route],
      );
      try {
        await layers.route.when();
        if (layers.route.fullExtent) {
          await view.goTo(layers.route.fullExtent.expand(1.25), {
            animate: false,
          });
        }
      } catch {
        setLoadError(true);
        return;
      }
      const landmarks = layers.landmarks;
      if (!landmarks) return;
      (view as unknown as { on(n: string, h: (e: unknown) => void): void }).on(
        'click',
        async (event) => {
          const hit = await view.hitTest(event, { include: [landmarks] });
          const graphic = hit.results.find((r) => r.type === 'graphic');
          const locId = graphic?.graphic?.attributes?.locId as
            | string
            | undefined;
          if (locId) selectLocation(locId);
        },
      );
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
      elRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is3D]);

  // Basemap follows mapMode without rebuilding the view.
  useEffect(() => {
    const el = elRef.current;
    if (el) el.basemap = mapMode === 'satellite' ? 'hybrid' : 'dark-gray-vector';
  }, [mapMode]);

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
        await view.goTo(
          { target: feature.geometry, scale: 18000 },
          { animate: !reduceMotion(), duration: 1400 },
        );
      }
    })();
  }, [selectedLocationId]);

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
      { reduceMotion: reduceMotion() },
    );
    engineRef.current.play();
  };

  if (loadError) {
    return (
      <div className="map-frame">
        <div className="map-fallback" role="status">
          <h3>The circuit map could not load</h3>
          <p>
            The circuit layers did not respond. The named places and their
            stories below still work; try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="explorer">
      <div className="explorer-map" ref={containerRef} />
      <div className="explorer-toolbar">
        <div role="group" aria-label="Map view" className="map-mode-group">
          {(
            [
              ['dark', 'Dark map'],
              ['satellite', 'Satellite'],
              ['3d', '3D terrain'],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className="menu-button"
              aria-pressed={mapMode === mode}
              onClick={() => setMapMode(mode)}
            >
              {label}
            </button>
          ))}
        </div>
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
