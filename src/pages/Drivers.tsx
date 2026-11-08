import DriverCard from '../components/ui/DriverCard';
import { people } from '../model/content';

export default function Drivers() {
  const drivers = people.filter((p) => p.role === 'driver' && p.context);
  const figures = people.filter((p) => p.role === 'team-figure' && p.context);
  return (
    <div className="page">
      <h1>Drivers &amp; Teams</h1>
      <p className="standfirst">
        World champions and works teams raced local drivers on home roads —
        none more prominent than Desmond Titterington of Holywood.
      </p>
      <p className="muted">
        Each profile carries a photograph from the archive where one exists.
        Select a photograph anywhere in the app to jump to the people in it.
      </p>
      <div className="card-grid">
        {drivers.map((p) => (
          <DriverCard key={p.id} person={p} />
        ))}
      </div>
      <h2>Around the paddock</h2>
      <div className="card-grid">
        {figures.map((p) => (
          <DriverCard key={p.id} person={p} />
        ))}
      </div>
    </div>
  );
}
