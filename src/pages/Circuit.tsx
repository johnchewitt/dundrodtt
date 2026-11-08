import CircuitMapSeam from '../components/map/CircuitMapSeam';
import { locations } from '../model/content';

export default function Circuit() {
  return (
    <div className="page">
      <h1>Explore the Circuit</h1>
      <p className="standfirst">
        7 miles 732 yards of closed public roads, run clockwise through the
        townlands northwest of Belfast.
      </p>
      <p>
        The course crossed rolling ground with fast approaches, gradients,
        crests, dips, changing cambers and blind sections. The same landscape
        that made the circuit memorable left little room to recover from a
        mistake.
      </p>
      <CircuitMapSeam />
      <h3>Named places of the 1950s course</h3>
      <ul>
        {locations.map((l) => (
          <li key={l.id}>
            {l.name}
            {l.story ? <span className="muted"> — {l.story}</span> : null}
          </li>
        ))}
      </ul>
      <p className="coming">
        Interactive landmark exploration, photographs by location and the
        cinematic guided lap arrive with the circuit build stage, consuming
        the owner&apos;s ArcGIS FeatureLayer when supplied.
      </p>
    </div>
  );
}
