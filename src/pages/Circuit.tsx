import CircuitMapSeam from '../components/map/CircuitMapSeam';
import LandmarkCatalogue from '../components/circuit/LandmarkCatalogue';
import LocationPanel from '../components/circuit/LocationPanel';

export default function Circuit() {
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
