import { people } from '../model/content';

export default function Drivers() {
  const drivers = people.filter((p) => p.role === 'driver' && p.context);
  return (
    <div className="page">
      <h1>Drivers &amp; Teams</h1>
      <p className="standfirst">
        World champions and works teams raced local drivers on home roads —
        none more prominent than Desmond Titterington of Holywood.
      </p>
      <p className="muted">
        Full profiles, cross-linked to seasons and photographs, arrive with
        the drivers build stage. The verified records are already here.
      </p>
      <ul>
        {drivers.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong>
            {p.context ? <span className="muted"> — {p.context}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
