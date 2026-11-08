import { Link } from 'react-router-dom';
import {
  films,
  incidents,
  locationById,
  personById,
  photoThumbUrl,
  races,
  type Photo,
  type Year,
} from '../model/content';
import RaceResultCard from './ui/RaceResultCard';
import PhotoPlate from './PhotoPlate';

interface SeasonChapterProps {
  year: Year;
  /** This year's archive photographs, in register order. */
  photos: Photo[];
  chapterNumber: number;
  onOpenPhoto: (index: number) => void;
}

const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/**
 * One cinematic story chapter of the six-season timeline: hero
 * photograph, chapter title, the season's verified story, race result
 * panels (classifications kept distinct), documented accidents within
 * their year, the year's photographs, and connected links to driver
 * profiles and circuit places — all resolved from catalogue IDs.
 */
export default function SeasonChapter({
  year,
  photos,
  chapterNumber,
  onOpenPhoto,
}: SeasonChapterProps) {
  const yearRaces = races.filter((r) => r.yearId === year.id);
  const yearIncidents = incidents.filter((i) => i.yearId === year.id);

  const heroIndex = photos.findIndex((p) => p.id === year.heroPhotoId);
  const hero = heroIndex >= 0 ? photos[heroIndex] : null;
  const wideHero = hero !== null && hero.width >= 1000;

  // Connected people: race winners plus those named in documented
  // events, in catalogue order of first appearance.
  const linkedPeople: string[] = [];
  for (const r of yearRaces)
    for (const c of r.classifications ?? [])
      for (const pid of c.winnerPersonIds)
        if (!linkedPeople.includes(pid)) linkedPeople.push(pid);
  for (const i of yearIncidents)
    for (const pid of i.personIds ?? [])
      if (!linkedPeople.includes(pid)) linkedPeople.push(pid);

  const linkedLocations = [
    ...new Set(
      yearIncidents.map((i) => i.locationId).filter((l): l is string => !!l),
    ),
  ];

  return (
    <section id={year.id} className="chapter" aria-labelledby={`${year.id}-h`}>
      <header className={wideHero ? 'chapter-opener chapter-opener-wide' : 'chapter-opener'}>
        <div className="chapter-text">
          <p className="chapter-kicker" aria-hidden="true">
            <span className="chapter-numeral">{numerals[chapterNumber - 1]}</span>
            <span className="chapter-yearmark">{year.year}</span>
          </p>
          <h2 id={`${year.id}-h`}>{year.chapterTitle}</h2>
          {year.storyCue && <p className="chapter-standfirst">{year.storyCue}</p>}
          <p className="chapter-summary">{year.summary}</p>
        </div>
        {hero && (
          <button
            type="button"
            className="chapter-hero"
            onClick={() => onOpenPhoto(heroIndex)}
            aria-label={`Open photograph ${hero.id} in the viewer`}
          >
            <PhotoPlate photo={hero} contained full loading={chapterNumber === 1 ? 'eager' : 'lazy'} />
          </button>
        )}
      </header>

      <h3 className="chapter-subhead">The meetings</h3>
      <div className="card-grid">
        {yearRaces.map((r) => (
          <RaceResultCard key={r.id} race={r} />
        ))}
      </div>

      {(() => {
        const yearFilms = films.filter(
          (f) => f.yearId === year.id && f.status !== 'unavailable' && f.url,
        );
        return yearFilms.length > 0 ? (
          <div className="chapter-films">
            <h3 className="chapter-subhead">On film</h3>
            {yearFilms.map((f) => (
              <p key={f.id}>
                <a href={f.url} target="_blank" rel="noreferrer">
                  {f.title}
                </a>{' '}
                <span className="muted">
                  — viewed on {f.rightsHolder ?? "the holder's own player"}.
                </span>
              </p>
            ))}
          </div>
        ) : null;
      })()}

      {yearIncidents.length > 0 && (
        <div className="chapter-events">
          <h3 className="chapter-subhead">Documented events</h3>
          {yearIncidents.map((i) => (
            <p key={i.id}>{i.text}</p>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <>
          <h3 className="chapter-subhead">Photographs from {year.year}</h3>
          <ul className="photo-strip" aria-label={`Photographs from ${year.year}`}>
            {photos.map((p, idx) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onOpenPhoto(idx)}
                  aria-label={`Open ${p.altText ?? p.id} in the viewer`}
                >
                  <img
                    src={photoThumbUrl(p)}
                    alt=""
                    loading="lazy"
                    width={p.width}
                    height={p.height}
                  />
                  <span className="strip-id">{p.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {(linkedPeople.length > 0 || linkedLocations.length > 0) && (
        <div className="chapter-links">
          {linkedPeople.map((pid) => {
            const person = personById.get(pid);
            return person ? (
              <Link key={pid} className="chip" to={`/drivers/${pid}`}>
                {person.name}
              </Link>
            ) : null;
          })}
          {linkedLocations.map((lid) => {
            const loc = locationById.get(lid);
            return loc ? (
              <Link key={lid} className="chip chip-place" to={`/circuit?loc=${lid}`}>
                {loc.name} on the circuit
              </Link>
            ) : null;
          })}
          <Link className="chip chip-archive" to={`/archive?year=${year.year}`}>
            All {year.year} photographs
          </Link>
        </div>
      )}
    </section>
  );
}
