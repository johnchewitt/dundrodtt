import { useState } from 'react';
import { Link } from 'react-router-dom';
import DriverCard from '../components/ui/DriverCard';
import {
  cars,
  people,
  photoById,
  photoUrl,
  teams,
  yearById,
  type Person,
} from '../model/content';
import { racesOfCar, racesOfTeam } from '../model/relationships';

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

function HeroFeature({ person, lead }: { person: Person; lead?: boolean }) {
  const photo = person.photoId ? photoById.get(person.photoId) : undefined;
  return (
    <article className={lead ? 'hero-feature hero-feature-lead' : 'hero-feature'}>
      {photo && (
        <Link
          to={`/drivers/${person.id}`}
          className="hero-feature-photo"
          aria-hidden="true"
          tabIndex={-1}
        >
          <img
            src={photoUrl(photo)}
            alt=""
            loading="lazy"
            width={photo.width}
            height={photo.height}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          />
          <span className="driver-photo-id">{photo.id}</span>
        </Link>
      )}
      <div className="hero-feature-text">
        <h3>
          <Link to={`/drivers/${person.id}`}>{person.name}</Link>
        </h3>
        {person.homePlace && <p className="driver-home">{person.homePlace}</p>}
        {person.context && <p>{person.context}</p>}
        <p>
          <Link to={`/drivers/${person.id}`}>Full Dundrod record →</Link>
        </p>
      </div>
    </article>
  );
}

export default function Drivers() {
  const [query, setQuery] = useState('');

  const drivers = people.filter((p) => p.role === 'driver' && p.context);
  const figures = people.filter((p) => p.role === 'team-figure' && p.context);
  const byId = new Map(drivers.map((p) => [p.id, p]));

  const heroes = drivers.filter((p) => p.localHero);
  const lead = heroes.find((p) => p.id === 'p-desmond-titterington');
  const otherHeroes = heroes.filter((p) => p.id !== 'p-desmond-titterington');

  const q = query.trim().toLowerCase();
  const matches = (p: Person) =>
    [p.name, p.homePlace, p.nationality, p.context]
      .filter(Boolean)
      .some((s) => s!.toLowerCase().includes(q));
  const searching = q.length > 0;
  const found = searching ? drivers.filter(matches) : [];

  const champions = CHAMPIONS.map((id) => byId.get(id)).filter(
    (p): p is Person => !!p,
  );
  const home = HOME.map((id) => byId.get(id)).filter((p): p is Person => !!p);
  const placed = new Set([...CHAMPIONS, ...HOME]);
  const rest = drivers.filter((p) => !placed.has(p.id));

  return (
    <div className="page drivers-page">
      <h1>Drivers &amp; Teams</h1>
      <p className="standfirst">
        World champions and works teams raced local drivers on home roads —
        none more prominent than Desmond Titterington of Holywood.
      </p>
      <nav className="page-jumps" aria-label="Sections on this page">
        <a href="#/drivers#local-heroes">Local heroes</a>
        <a href="#/drivers#the-drivers">The drivers</a>
        <a href="#/drivers#the-teams">Teams &amp; entrants</a>
        <a href="#/drivers#the-machines">The machines</a>
      </nav>

      <section id="local-heroes" aria-labelledby="local-heroes-h">
        <p className="chapter-kicker" aria-hidden="true">
          <span className="chapter-numeral">The home crowd's own</span>
        </p>
        <h2 id="local-heroes-h" className="local-heroes-title">
          Local Heroes
        </h2>
        <p className="chapter-standfirst">
          When the world's fastest drivers came to Ulster, Ulster answered.
        </p>
        <p className="chapter-summary">
          Dundrod's crowds watched world champions on their own townland
          roads — and watched their own take them on. Desmond Titterington
          of Holywood won the 1955 Ulster Trophy as fastest finisher and
          then, that September, shared the works Jaguar D-Type with Mike
          Hawthorn to lead the challenge to the Mercedes team in the final
          Tourist Trophy. Belfast's Bobby Baird raced — and built — his own
          cars here from the circuit's very first meeting, and Dublin's{' '}
          <Link to="/drivers/p-joe-kelly">Joe Kelly</Link> twice put his Alta
          among the Ulster Trophy's top four.
        </p>
        {lead && <HeroFeature person={lead} lead />}
        <div className="hero-feature-row">
          {otherHeroes.map((p) => (
            <HeroFeature key={p.id} person={p} />
          ))}
        </div>
      </section>

      <section id="the-drivers" aria-labelledby="the-drivers-h">
        <h2 id="the-drivers-h">The drivers</h2>
        <p className="muted">
          Each profile carries a photograph from the archive where one
          exists; select a card for the full Dundrod record.
        </p>
        <p className="drivers-search">
          <label htmlFor="driver-search">Search the catalogue</label>
          <input
            id="driver-search"
            type="search"
            placeholder="Name, place, car or team…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>

        {searching ? (
          <>
            <h3 className="chapter-subhead">
              {found.length}{' '}
              {found.length === 1 ? 'driver matches' : 'drivers match'}{' '}
              “{query.trim()}”
            </h3>
            {found.length === 0 && (
              <p className="muted">
                No one in the catalogue matches — the register only holds
                documented Dundrod competitors.
              </p>
            )}
            <Grid list={found} />
          </>
        ) : (
          <>
            <h3 className="chapter-subhead">Champions and works stars</h3>
            <Grid list={champions} />
            <h3 className="chapter-subhead">The home challenge</h3>
            <Grid list={home} />
            <h3 className="chapter-subhead">The wider entry</h3>
            <Grid list={rest} />
            <h3 className="chapter-subhead">Around the paddock</h3>
            <Grid list={figures} />
          </>
        )}
      </section>

      <section id="the-teams" aria-labelledby="the-teams-h">
        <h2 id="the-teams-h">Teams &amp; entrants</h2>
        <p className="muted">
          Works teams and independent entrants are different things, and the
          cards say which is which. No team was here every year — each card
          records only its documented Dundrod involvement.
        </p>
        <div className="card-grid">
          {teams.map((t) => {
            const photo = t.photoId ? photoById.get(t.photoId) : undefined;
            const wins = racesOfTeam(t.id);
            const winYears = [
              ...new Set(
                wins
                  .map((w) => yearById.get(w.race.yearId)?.year)
                  .filter((y): y is number => !!y),
              ),
            ];
            return (
              <article key={t.id} className="driver-card team-card">
                {photo && (
                  <div className="driver-photo">
                    <img
                      src={photoUrl(photo)}
                      alt={photo.altText ?? ''}
                      loading="lazy"
                      width={photo.width}
                      height={photo.height}
                      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                    />
                    <span className="driver-photo-id">{photo.id}</span>
                  </div>
                )}
                <h3>{t.name}</h3>
                <p className="driver-home">
                  {[
                    t.kind === 'works'
                      ? 'Works team'
                      : t.kind === 'entrant'
                        ? 'Independent entrant'
                        : t.kind === 'privateer'
                          ? 'Privateer'
                          : null,
                    t.country,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {t.context && <p>{t.context}</p>}
                {winYears.length > 0 && (
                  <p className="card-chips">
                    {winYears.map((y) => (
                      <Link key={y} className="chip" to={`/seasons#y${y}`}>
                        Victory, {y}
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section id="the-machines" aria-labelledby="the-machines-h">
        <h2 id="the-machines-h">The machines</h2>
        <p className="muted">
          The cars the crowds came to see, from Moss&apos;s XK120 to the
          extraordinary BRM V16. Technical notes are kept to what the
          references verify.
        </p>
        <div className="card-grid">
          {cars.map((c) => {
            const photo = c.photoId ? photoById.get(c.photoId) : undefined;
            const wins = racesOfCar(c.id);
            const winYears = [
              ...new Set(
                wins
                  .map((w) => yearById.get(w.race.yearId)?.year)
                  .filter((y): y is number => !!y),
              ),
            ];
            return (
              <article key={c.id} className="driver-card car-card">
                {photo && (
                  <div className="driver-photo">
                    <img
                      src={photoUrl(photo)}
                      alt={photo.altText ?? ''}
                      loading="lazy"
                      width={photo.width}
                      height={photo.height}
                      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                    />
                    <span className="driver-photo-id">{photo.id}</span>
                  </div>
                )}
                <h3>{c.name}</h3>
                {c.spec && <p className="car-spec">{c.spec}</p>}
                {c.context && <p>{c.context}</p>}
                {winYears.length > 0 && (
                  <p className="card-chips">
                    {winYears.map((y) => (
                      <Link key={y} className="chip" to={`/seasons#y${y}`}>
                        Victory, {y}
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
