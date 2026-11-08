import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CircuitMapSeam from '../components/map/CircuitMapSeam';
import LandmarkCatalogue from '../components/circuit/LandmarkCatalogue';
import LocationPanel from '../components/circuit/LocationPanel';
import { locationById, locations, thenAndNow } from '../model/content';
import { lapOrder } from '../model/lapOrder';
import { useUiStore } from '../store/uiStore';

/**
 * Dundrod Today: the same verified geography as Explore the Circuit,
 * seen from the present. The map opens on modern satellite imagery with
 * the 1950s alignment drawn over it; the walk follows the lap through
 * the surviving corners; changes since the racing years are stated from
 * the sources, never guessed.
 */
export default function Today() {
  const setMapMode = useUiStore((s) => s.setMapMode);
  const selectLocation = useUiStore((s) => s.selectLocation);
  const [params] = useSearchParams();

  // The present-day view: modern imagery under the historic line.
  useEffect(() => {
    setMapMode('satellite');
  }, [setMapMode]);

  useEffect(() => {
    const loc = params.get('loc');
    if (loc && locationById.has(loc)) selectLocation(loc);
  }, [params, selectLocation]);

  const complete = thenAndNow.filter((t) => t.status === 'complete');
  // The two places the modern circuit no longer follows, per the sources.
  const changed = ['loc-leathemstown-bridge', 'loc-1950s-hairpin'];

  return (
    <div className="page circuit-page today-page">
      <h1>Dundrod Today</h1>
      <p className="standfirst">
        The roads are still there — and they are ordinary public roads
        again.
      </p>
      <p>
        The 1950s course survives almost whole in the working countryside
        northwest of Belfast: the same banks, crests and townlands, carrying
        everyday traffic. The map below opens on today&apos;s satellite
        imagery with the 1950–55 alignment drawn over it; select a place to
        read its story, or switch to the dark exhibition map and 3D terrain.
      </p>
      <p className="road-respect">
        If you visit: these are live public roads past homes and farms, with
        normal speed limits and no closed-road racing. Please drive gently,
        park considerately and enjoy the landscape as its residents do — the
        history is in the place, not the speed.
      </p>

      <div className="explorer-stage">
        <CircuitMapSeam />
        <LandmarkCatalogue />
        <LocationPanel />
      </div>

      <section aria-labelledby="changed-h">
        <h2 id="changed-h">What changed, and when</h2>
        <p className="chapter-summary">
          Remarkably little. Writers who knew the racing years describe a
          circuit scarcely changed since the 1950s. The sources record two
          real differences from the course the cars knew, both from the 1965
          rebuilding for motorcycle racing:
        </p>
        <ul className="changed-list">
          {changed.map((id) => {
            const loc = locationById.get(id);
            return loc ? (
              <li key={id}>
                <Link className="chip chip-place" to={`/today?loc=${id}`}>
                  {loc.name}
                </Link>{' '}
                <span className="muted">{loc.story}</span>
              </li>
            ) : null;
          })}
        </ul>
        <p className="chapter-summary">
          Every other named place on the walk —{' '}
          {lapOrder
            .filter((id) => !changed.includes(id) && id !== 'loc-start-finish')
            .slice(0, 5)
            .map((id) => locationById.get(id)?.name)
            .filter(Boolean)
            .join(', ')}{' '}
          and the rest — still sits on the road the drivers raced.
        </p>
      </section>

      <section aria-labelledby="heritage-h">
        <h2 id="heritage-h">The racing that stayed</h2>
        <p className="chapter-summary">
          Car racing ended here in September 1955, but Dundrod&apos;s racing
          life did not: the motorcycle Ulster Grand Prix had moved to the
          circuit in 1953 and ran here for decades, giving the same rural
          roads a second, much longer sporting history. The grandstand on
          the start–finish straight today is named for Joey Dunlop. That
          later story — the bikes, the rebuilt hairpin, the new names — is
          its own; this archive keeps to the six car-racing seasons, told in{' '}
          <Link to="/seasons">the timeline</Link> and{' '}
          <Link to="/archive">the archive</Link>.
        </p>
      </section>

      <section aria-labelledby="thennow-h">
        <h2 id="thennow-h">Then &amp; Now</h2>
        {complete.length === 0 ? (
          <p className="coming">
            Side-by-side comparisons appear here as approved present-day
            photography of the surviving corners is added — none is invented
            or borrowed in the meantime. Until then, every place panel on
            the map offers &ldquo;See this place from above today&rdquo;,
            and the satellite view keeps the comparison honest:{' '}
            {locations.length} named places, one unchanged landscape.
          </p>
        ) : null}
      </section>
    </div>
  );
}
