import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PhotoViewer from '../components/PhotoViewer';
import DateLabel from '../components/ui/DateLabel';
import {
  carById,
  locationById,
  personById,
  photoThumbUrl,
  photoUrl,
  teamById,
  yearById,
} from '../model/content';
import {
  appearancesOf,
  awardLabelOf,
  dundrodYearsOf,
  eventLabelOf,
  incidentsOf,
  locationsOf,
  photosOf,
  winsOf,
} from '../model/relationships';

/**
 * A driver's full Dundrod record: everything shown is derived from the
 * verified catalogue — wins from the race classifications, documented
 * entries from the sourced appearances register, photographs from the
 * archive's person links, and places from the incident records.
 */
export default function DriverProfile() {
  const { personId } = useParams();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const person = personId ? personById.get(personId) : undefined;

  // Per-person document title (the global handler only knows the
  // top-level experiences).
  useEffect(() => {
    if (person) {
      document.title = `${person.name} · Dundrod — The Forgotten Racing Years`;
    }
  }, [person]);

  if (!person) {
    return (
      <div className="page">
        <h1>Profile not found</h1>
        <p>
          No one by that register ID is in the catalogue.{' '}
          <Link to="/drivers">Back to Drivers &amp; Teams</Link>.
        </p>
      </div>
    );
  }

  const wins = winsOf(person.id);
  const apps = appearancesOf(person);
  const photos = photosOf(person.id);
  const personIncidents = incidentsOf(person.id);
  const places = locationsOf(person.id);
  const years = dundrodYearsOf(person);
  const sourceSet = [
    ...new Set([
      ...person.sourceRefs,
      ...wins.flatMap((w) => w.race.sourceRefs),
      ...apps.flatMap((a) => a.appearance.sourceRefs),
    ]),
  ];

  return (
    <div className="page profile-page">
      <p className="profile-back">
        <Link to="/drivers">← Drivers &amp; Teams</Link>
      </p>

      <header className="profile-head">
        <div className="profile-title">
          <h1>{person.name}</h1>
          <p className="profile-meta">
            {[person.nationality, person.homePlace]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {years.length > 0 && (
            <p className="profile-years">
              At Dundrod:{' '}
              {years.map((y) => (
                <Link key={y} to={`/seasons#y${y}`} className="chip">
                  {y}
                </Link>
              ))}
            </p>
          )}
          {person.context && <p className="profile-bio">{person.context}</p>}
        </div>
        {person.photoId &&
          (() => {
            const idx = photos.findIndex((p) => p.id === person.photoId);
            const portrait =
              idx >= 0 ? photos[idx] : photos.length > 0 ? photos[0] : null;
            return portrait ? (
              <button
                type="button"
                className="chapter-hero"
                onClick={() =>
                  setViewerIndex(Math.max(0, photos.indexOf(portrait)))
                }
                aria-label={`Open photograph ${portrait.id} in the viewer`}
              >
                <figure className="plate plate-contained">
                  <div className="plate-mount">
                    <img
                      src={photoUrl(portrait)}
                      alt={portrait.altText ?? ''}
                      width={portrait.width}
                      height={portrait.height}
                      style={{
                        aspectRatio: `${portrait.width} / ${portrait.height}`,
                      }}
                      data-loaded
                    />
                  </div>
                  <figcaption>
                    <span className="plate-id">{portrait.id}</span>
                    {portrait.caption}
                  </figcaption>
                </figure>
              </button>
            ) : null;
          })()}
      </header>

      {(wins.length > 0 || apps.length > 0) && (
        <>
          <h2>The Dundrod record</h2>
          <ul className="record-list">
            {wins.map(({ race, classification }) => {
              const year = yearById.get(race.yearId)?.year;
              const car = classification.carId
                ? carById.get(classification.carId)?.name
                : null;
              const team = classification.teamId
                ? teamById.get(classification.teamId)?.name
                : null;
              const coWinners = classification.winnerPersonIds
                .filter((pid) => pid !== person.id)
                .map((pid) => personById.get(pid))
                .filter((p) => p !== undefined);
              return (
                <li key={`${race.id}-${classification.award}`} className="record-win">
                  <DateLabel>{year}</DateLabel>{' '}
                  <strong>
                    {eventLabelOf[race.event]} — {awardLabelOf[classification.award]}
                  </strong>
                  {coWinners.length > 0 && (
                    <>
                      {' '}
                      shared with{' '}
                      {coWinners.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 ? ' and ' : ''}
                          <Link to={`/drivers/${p.id}`}>{p.name}</Link>
                        </span>
                      ))}
                    </>
                  )}
                  {car ? (
                    <>
                      {' '}
                      · <Link to={`/drivers#${classification.carId}`}>{car}</Link>
                    </>
                  ) : null}
                  {team && !car?.includes(team.replace(' (works)', '')) ? (
                    <>
                      {' '}
                      (<Link to={`/drivers#${classification.teamId}`}>{team}</Link>)
                    </>
                  ) : null}
                  {classification.note ? (
                    <span className="muted"> — {classification.note}</span>
                  ) : null}
                </li>
              );
            })}
            {apps.map(({ race, appearance }) => {
              const year = yearById.get(race.yearId)?.year;
              return (
                <li key={`${race.id}-${appearance.result}`}>
                  <DateLabel>{year}</DateLabel>{' '}
                  <strong>{eventLabelOf[race.event]}</strong> —{' '}
                  {appearance.result}
                  {appearance.car ? <> · {appearance.car}</> : null}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {personIncidents.length > 0 && (
        <div className="chapter-events">
          <h2 className="chapter-subhead">Documented events</h2>
          {personIncidents.map((i) => (
            <p key={i.id}>{i.text}</p>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <>
          <h2>In the archive</h2>
          <ul className="photo-strip" aria-label={`Photographs of ${person.name}`}>
            {photos.map((p, idx) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setViewerIndex(idx)}
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

      {(() => {
        const together = [
          ...new Set(
            photos.flatMap((p) => p.personIds).filter((pid) => pid !== person.id),
          ),
        ]
          .map((pid) => personById.get(pid))
          .filter((p) => p !== undefined);
        return together.length > 0 ? (
          <>
            <h2 className="chapter-subhead">In the same frames</h2>
            <div className="chapter-links">
              {together.map((p) => (
                <Link key={p.id} className="chip" to={`/drivers/${p.id}`}>
                  {p.name}
                </Link>
              ))}
            </div>
          </>
        ) : null;
      })()}

      {places.length > 0 && (
        <div className="chapter-links">
          {places.map((lid) => {
            const loc = locationById.get(lid);
            return loc ? (
              <Link key={lid} className="chip chip-place" to={`/circuit?loc=${lid}`}>
                {loc.name} on the circuit
              </Link>
            ) : null;
          })}
        </div>
      )}

      <p className="muted location-sources">Sources: {sourceSet.join(' · ')}</p>

      <PhotoViewer
        photos={photos}
        index={viewerIndex}
        onClose={() => setViewerIndex(null)}
        onNavigate={setViewerIndex}
      />
    </div>
  );
}
