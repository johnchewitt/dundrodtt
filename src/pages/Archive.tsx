
import { Link, useSearchParams } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import PhotoViewer from '../components/PhotoViewer';
import Unavailable from '../components/ui/Unavailable';
import {
  acknowledgements,
  archivePhotos,
  films,
  locationById,
  personById,
  photoById,
  photoUrl,
  raceById,
  yearById,
  type Photo,
} from '../model/content';

type Section = 'photography' | 'film' | 'behind';
type EventFilter = 'all' | 'ulster-trophy' | 'rac-tt';

const YEARS = [1950, 1951, 1952, 1953, 1954, 1955];

function matchesEvent(event: string | null, filter: EventFilter): boolean {
  if (filter === 'all') return true;
  if (!event) return false;
  return filter === 'ulster-trophy'
    ? event.includes('Ulster Trophy')
    : event.includes('Tourist Trophy');
}

function matchesQuery(p: Photo, q: string): boolean {
  return [p.id, p.imageTitle, p.caption, p.carSubject, ...p.peopleNames]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(q);
}

const providerName: Record<string, string> = {
  'british-pathe': 'British Pathé',
  'ni-screen': 'Northern Ireland Screen',
  other: 'the archive holder',
};

export default function Archive() {
  const [params, setParams] = useSearchParams();
  const section: Section =
    params.get('section') === 'film'
      ? 'film'
      : params.get('section') === 'behind'
        ? 'behind'
        : 'photography';
  const yearParam = Number(params.get('year'));
  const year = YEARS.includes(yearParam) ? yearParam : null;
  const eventParam = params.get('event');
  const event: EventFilter =
    eventParam === 'ulster-trophy' || eventParam === 'rac-tt' ? eventParam : 'all';
  const driver = params.get('driver');
  const subject = params.get('subject');
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const photoParam = params.get('photo');

  // People and subjects offered as filters come straight from the catalogue.
  const driverOptions = [
    ...new Set(archivePhotos.flatMap((p) => p.personIds)),
  ]
    .map((id) => personById.get(id))
    .filter((p) => p !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
  const subjectOptions = [
    ...new Set(
      archivePhotos.map((p) => p.carSubject).filter((s): s is string => !!s),
    ),
  ].sort();

  const filtered = archivePhotos.filter(
    (p) =>
      (year === null || p.year === year) &&
      matchesEvent(p.event, event) &&
      (!driver || p.personIds.includes(driver)) &&
      (!subject || p.carSubject === subject) &&
      (!q || matchesQuery(p, q)),
  );
  const filtering = year !== null || event !== 'all' || !!driver || !!subject || !!q;

  const special = archivePhotos.filter((p) => p.special1950);
  const authorised = films.filter((f) => f.status === 'authorised');
  const external = films.filter((f) => f.status === 'external');
  const armstrong = acknowledgements.find((a) => a.id === 'ack-armstrong');
  const portrait = armstrong?.portraitPhotoId
    ? photoById.get(armstrong.portraitPhotoId)
    : undefined;

  const viewerPhotos = filtering ? filtered : archivePhotos;
  const indexOf = (id: string) => viewerPhotos.findIndex((p) => p.id === id);
  // The viewer is URL-addressable: ?photo=DU-1951-08 opens it, navigation
  // rewrites it (replace, not push), closing clears it — so any
  // photograph can be shared as a link.
  const viewerIndex = photoParam ? indexOf(photoParam) : null;
  const openPhoto = (index: number | null) => {
    // Functional update: the dialog's close event can fire just after a
    // link inside it has navigated, so always start from the live URL.
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (index === null || !viewerPhotos[index]) next.delete('photo');
        else next.set('photo', viewerPhotos[index].id);
        return next;
      },
      { replace: true },
    );
  };

  const setFilters = (next: Record<string, string | null>) => {
    const merged: Record<string, string> = {};
    const current = {
      year: year !== null ? String(year) : null,
      event: event !== 'all' ? event : null,
      driver,
      subject,
      q: q || null,
      ...next,
    };
    for (const [k, v] of Object.entries(current)) if (v) merged[k] = v;
    setParams(merged); // drops any open ?photo= — filters define a new set
  };

  const plateButton = (p: Photo) => (
    <button
      type="button"
      className="plate-button"
      onClick={() => openPhoto(indexOf(p.id))}
    >
      <PhotoPlate photo={p} contained />
    </button>
  );

  return (
    <div className="page archive-page">
      <h1>The Archive</h1>
      <p className="standfirst">
        The photographs — and the films, viewed with their holders — of the
        Dundrod racing years.
      </p>

      <div
        className="archive-tabs"
        role="tablist"
        aria-label="Archive sections"
        onKeyDown={(e) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          const order: Section[] = ['photography', 'film', 'behind'];
          const delta = e.key === 'ArrowRight' ? 1 : order.length - 1;
          const next = order[(order.indexOf(section) + delta) % order.length];
          setParams(next === 'photography' ? {} : { section: next });
          document.getElementById(`tab-${next}`)?.focus();
        }}
      >
        {(
          [
            ['photography', 'Photography'],
            ['film', 'Film'],
            ['behind', 'Behind the Photographs'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={section === key}
            aria-controls={`panel-${key}`}
            tabIndex={section === key ? 0 : -1}
            className="archive-tab"
            onClick={() => setParams(key === 'photography' ? {} : { section: key })}
          >
            {label}
          </button>
        ))}
      </div>

      {section === 'photography' && (
        <div id="panel-photography" role="tabpanel" aria-labelledby="tab-photography">
          <div className="archive-filters" role="group" aria-label="Filter photographs">
            <span className="filter-label">Year</span>
            <button type="button" className="chip" aria-pressed={year === null}
              onClick={() => setFilters({ year: null })}>
              All
            </button>
            {YEARS.map((y) => (
              <button key={y} type="button" className="chip" aria-pressed={year === y}
                onClick={() => setFilters({ year: String(y) })}>
                {y}
              </button>
            ))}
            <span className="filter-label">Event</span>
            {(
              [
                ['all', 'All'],
                ['ulster-trophy', 'Ulster Trophy'],
                ['rac-tt', 'RAC TT'],
              ] as const
            ).map(([key, label]) => (
              <button key={key} type="button" className="chip" aria-pressed={event === key}
                onClick={() => setFilters({ event: key === 'all' ? null : key })}>
                {label}
              </button>
            ))}
          </div>
          <div className="archive-filters archive-filters-row2">
            <label className="filter-select">
              <span className="filter-label">Driver</span>
              <select
                value={driver ?? ''}
                onChange={(e) => setFilters({ driver: e.target.value || null })}
              >
                <option value="">All catalogued people</option>
                {driverOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-select">
              <span className="filter-label">Car / subject</span>
              <select
                value={subject ?? ''}
                onChange={(e) => setFilters({ subject: e.target.value || null })}
              >
                <option value="">All subjects</option>
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-select filter-search">
              <span className="filter-label">Search</span>
              <input
                type="search"
                placeholder="Caption, name or register ID…"
                value={params.get('q') ?? ''}
                onChange={(e) => setFilters({ q: e.target.value || null })}
              />
            </label>
          </div>
          <p className="muted archive-note">
            No photograph in the collection has a verified circuit location
            yet, so there is no place filter — identifications are never
            guessed.
          </p>

          {filtering ? (
            <>
              <h2 aria-live="polite">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'photograph' : 'photographs'}
                {year !== null ? ` from ${year}` : ''}
                {driver ? ` of ${personById.get(driver)?.name ?? ''}` : ''}
                {event !== 'all'
                  ? event === 'ulster-trophy'
                    ? ' · Ulster Trophy'
                    : ' · RAC Tourist Trophy'
                  : ''}
              </h2>
              {year !== null && (
                <p>
                  <Link to={`/seasons#y${year}`}>Read the {year} story</Link>.
                </p>
              )}
              <p>
                <button
                  type="button"
                  className="chip chip-clear"
                  onClick={() => setParams({})}
                >
                  Clear all filters
                </button>
              </p>
              {filtered.length === 0 && (
                <p className="muted">
                  No photographs in the archive match this combination — the
                  catalogue is honest about its gaps. Clear a filter to keep
                  browsing.
                </p>
              )}
              <ul className="masonry">
                {filtered.map((p) => (
                  <li key={p.id}>{plateButton(p)}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <section className="lost-1950" aria-labelledby="lost-1950-h">
                <p className="chapter-kicker" aria-hidden="true">
                  <span className="chapter-numeral">A special archive story</span>
                </p>
                <h2 id="lost-1950-h" className="lost-1950-title">
                  The Lost Photographs of 1950
                </h2>
                <p className="chapter-standfirst">
                  Previously unseen images from the circuit&apos;s opening
                  season.
                </p>
                <p className="chapter-summary">
                  Seven photographs from Dundrod&apos;s first year reached
                  this archive from a second contributor: the August 1950
                  Ulster Trophy meeting and the September Tourist Trophy in
                  which twenty-year-old Stirling Moss made his name. Their
                  contributor&apos;s acknowledgement will be made by name
                  once confirmed — the photographs themselves could not
                  wait. <Link to="/seasons#y1950">Read the 1950 story</Link>.
                </p>
                <ul className="masonry masonry-special">
                  {special.map((p, i) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="plate-button"
                        onClick={() => openPhoto(indexOf(p.id))}
                      >
                        <PhotoPlate photo={p} contained loading={i < 2 ? 'eager' : 'lazy'} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <h2>The full archive, 1951–1955</h2>
              <ul className="masonry">
                {archivePhotos
                  .filter((p) => !p.special1950)
                  .map((p) => (
                    <li key={p.id}>{plateButton(p)}</li>
                  ))}
              </ul>
            </>
          )}
          <PhotoViewer
            photos={viewerPhotos}
            index={viewerIndex !== null && viewerIndex >= 0 ? viewerIndex : null}
            onClose={() => openPhoto(null)}
            onNavigate={openPhoto}
          />
        </div>
      )}

      {section === 'film' && (
        <div id="panel-film" role="tabpanel" aria-labelledby="tab-film">
          {external.length > 0 && (
            <>
              <h2>The film collection</h2>
              <p className="muted">
                Period footage held by national archives. Each film is viewed
                on its holder&apos;s own player — linked, never downloaded,
                rehosted or re-cut.
              </p>
              <div className="card-grid film-grid">
                {external.map((f) => {
                  const filmYear = f.yearId ? yearById.get(f.yearId) : undefined;
                  const race = f.raceId ? raceById.get(f.raceId) : undefined;
                  return (
                    <article key={f.id} className="driver-card film-card">
                      <h3>{f.title}</h3>
                      <p className="driver-home">
                        {[
                          f.provider ? providerName[f.provider] : null,
                          f.rightsHolder && f.rightsHolder !== providerName[f.provider ?? '']
                            ? f.rightsHolder
                            : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      {f.description && <p>{f.description}</p>}
                      <p className="card-chips">
                        {filmYear && (
                          <Link className="chip" to={`/seasons#${filmYear.id}`}>
                            {filmYear.year}
                            {race
                              ? race.event === 'ulster-trophy'
                                ? ' Ulster Trophy'
                                : ' RAC TT'
                              : ''}
                          </Link>
                        )}
                        {(f.personIds ?? []).map((pid) => {
                          const person = personById.get(pid);
                          return person ? (
                            <Link key={pid} className="chip" to={`/drivers/${pid}`}>
                              {person.name}
                            </Link>
                          ) : null;
                        })}
                        {(f.locationIds ?? []).map((lid) => {
                          const loc = locationById.get(lid);
                          return loc ? (
                            <Link key={lid} className="chip chip-place" to={`/circuit?loc=${lid}`}>
                              {loc.name}
                            </Link>
                          ) : null;
                        })}
                      </p>
                      <p>
                        <a className="cta film-cta" href={f.url} target="_blank" rel="noreferrer">
                          {f.provider && f.provider !== 'other'
                            ? `Watch at ${providerName[f.provider]}`
                            : 'Watch the film'}
                        </a>
                      </p>
                      {f.authorisationNote && (
                        <p className="muted film-note">{f.authorisationNote}</p>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
          {authorised.length === 0 ? (
            <Unavailable title="No embedded footage yet">
              British Pathé and Northern Ireland Screen material plays here
              — inside the race-year stories too — only once permission to
              embed it is confirmed. Until then the collection above links
              to each film on its holder&apos;s own player.
            </Unavailable>
          ) : null}
        </div>
      )}

      {section === 'behind' && (
        <div id="panel-behind" role="tabpanel" aria-labelledby="tab-behind">
          <section className="behind" aria-labelledby="behind-h">
            <p className="chapter-kicker" aria-hidden="true">
              <span className="chapter-numeral">The people who kept these</span>
            </p>
            <h2 id="behind-h" className="lost-1950-title">
              Behind the Photographs
            </h2>
            <p className="chapter-summary">
              Every photograph in this archive survived because someone kept
              it: in an album, a drawer, a box carried between houses for
              seventy years. An afternoon&apos;s racing lasts hours; a
              photograph of it can last forever, but only if it is kept, and
              only if it is shared. This page thanks the people who did
              both.
            </p>

            {armstrong && (
              <article className="hero-feature hero-feature-lead behind-feature">
                {portrait && (
                  <figure className="plate plate-contained">
                    <div className="plate-mount">
                      <img
                        src={photoUrl(portrait)}
                        alt={portrait.altText ?? ''}
                        loading="lazy"
                        width={portrait.width}
                        height={portrait.height}
                        style={{
                          aspectRatio: `${portrait.width} / ${portrait.height}`,
                        }}
                        data-loaded
                      />
                    </div>
                    {/* The portrait's catalogue caption is a handling
                        instruction, not display copy — the message
                        alongside carries the real caption. */}
                    <figcaption>
                      <span className="plate-id">{portrait.id}</span>
                      Neville and Beverley Armstrong.
                    </figcaption>
                  </figure>
                )}
                <div className="hero-feature-text">
                  <h3>{armstrong.name}</h3>
                  <p>{armstrong.message}</p>
                  <p>
                    The race archive&apos;s forty-four photographs of
                    1950–1955 — paddock, pits and full flight — are credited
                    to the collection as a whole rather than image by image,
                    at collection level:{' '}
                    <em>
                      Neville Armstrong kindly contributed photographs of
                      Dundrod from the 1950s.
                    </em>
                  </p>
                </div>
              </article>
            )}

            <h3 className="chapter-subhead">The 1950 photographs</h3>
            <p className="chapter-summary">
              The seven rare photographs of the opening 1950 season came
              from a second contributor, whose acknowledgement will be made
              by name once confirmed.{' '}
              <Link to="/archive">See the Lost Photographs of 1950</Link>.
            </p>

            <h3 className="chapter-subhead">Sources &amp; permissions</h3>
            <p className="chapter-summary">
              Captions, identifications and dates come verbatim from the
              archive&apos;s catalogue; hedged identifications stay hedged
              and are marked <em>probable</em> in the viewer. Films are
              linked to their holders&apos; own players, never rehosted. A
              1950 Belfast Telegraph page and further footage await their
              owners&apos; confirmation before they appear here.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
