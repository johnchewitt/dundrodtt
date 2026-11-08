import DriverCard from '../components/ui/DriverCard';
import { people, type Person } from '../model/content';

/**
 * Curated presentation groups (ids only — all facts stay in content).
 * Anyone not placed below falls into the wider entry, so new profiles
 * never vanish.
 */
const CHAMPIONS = [
  'p-stirling-moss',
  'p-juan-manuel-fangio',
  'p-giuseppe-farina',
  'p-mike-hawthorn',
  'p-piero-taruffi',
  'p-maurice-trintignant',
  'p-peter-collins',
  'p-reg-parnell',
];
const HOME = ['p-desmond-titterington', 'p-bobby-baird', 'p-joe-kelly'];

function Grid({ list }: { list: Person[] }) {
  return (
    <div className="card-grid">
      {list.map((p) => (
        <DriverCard key={p.id} person={p} />
      ))}
    </div>
  );
}

export default function Drivers() {
  const drivers = people.filter((p) => p.role === 'driver' && p.context);
  const figures = people.filter((p) => p.role === 'team-figure' && p.context);
  const byId = new Map(drivers.map((p) => [p.id, p]));

  const champions = CHAMPIONS.map((id) => byId.get(id)).filter(
    (p): p is Person => !!p,
  );
  const home = HOME.map((id) => byId.get(id)).filter((p): p is Person => !!p);
  const placed = new Set([...CHAMPIONS, ...HOME]);
  const rest = drivers.filter((p) => !placed.has(p.id));

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

      <h2>Champions and works stars</h2>
      <Grid list={champions} />

      <h2>The home challenge</h2>
      <p className="muted">
        Ulster and Ireland answered the works teams with drivers of their
        own.
      </p>
      <Grid list={home} />

      <h2>The wider entry</h2>
      <Grid list={rest} />

      <h2>Around the paddock</h2>
      <Grid list={figures} />
    </div>
  );
}
