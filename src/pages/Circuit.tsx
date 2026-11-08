import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CircuitMapSeam from '../components/map/CircuitMapSeam';
import LandmarkCatalogue from '../components/circuit/LandmarkCatalogue';
import LocationPanel from '../components/circuit/LocationPanel';
import { locationById } from '../model/content';
import { useUiStore } from '../store/uiStore';

export default function Circuit() {
  const [params] = useSearchParams();
  const selectLocation = useUiStore((s) => s.selectLocation);

  // Season chapters deep-link documented places: /circuit?loc=<id>
  // opens that place's story panel on arrival.
  useEffect(() => {
    const loc = params.get('loc');
    if (loc && locationById.has(loc)) selectLocation(loc);
  }, [params, selectLocation]);

  return (
    <div className="page circuit-page">
      <h1>Explore the Circuit</h1>
      <p className="standfirst">
        7 miles 732 yards of closed public roads, run clockwise through the
        townlands northwest of Belfast.
      </p>
      <p>
        The course crossed rolling ground with fast approaches, gradients,
        crests, dips, changing cambers and blind sections. The same
        landscape that made the circuit memorable left little room to
        recover from a mistake. Select a place to read its story.
      </p>
      <div className="explorer-stage">
        <CircuitMapSeam />
        <LandmarkCatalogue />
        <LocationPanel />
      </div>
    </div>
  );
}
