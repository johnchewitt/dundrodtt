import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import PhotoViewer from '../components/PhotoViewer';
import Unavailable from '../components/ui/Unavailable';
import { archivePhotos, films } from '../model/content';

type Section = 'photography' | 'film';
type EventFilter = 'all' | 'ulster-trophy' | 'rac-tt';

const YEARS = [1950, 1951, 1952, 1953, 1954, 1955];

function matchesEvent(event: string | null, filter: EventFilter): boolean {
  if (filter === 'all') return true;
  if (!event) return false;
  return filter === 'ulster-trophy'
    ? event.includes('Ulster Trophy')
    : event.includes('Tourist Trophy');
}

export default function Archive() {
  const [params, setParams] = useSearchParams();
  const section: Section = params.get('section') === 'film' ? 'film' : 'photography';
  const yearParam = Number(params.get('year'));
  const year = YEARS.includes(yearParam) ? yearParam : null;
  const eventParam = params.get('event');
  const event: EventFilter =
    eventParam === 'ulster-trophy' || eventParam === 'rac-tt' ? eventParam : 'all';
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const filtered = archivePhotos.filter(
    (p) => (year === null || p.year === year) && matchesEvent(p.event, event),
  );
  const filtering = year !== null || event !== 'all';

  const special = archivePhotos.filter((p) => p.special1950);
  const authorised = films.filter((f) => f.status === 'authorised');
  const external = films.filter((f) => f.status === 'external');

  const viewerPhotos = filtering ? filtered : archivePhotos;
  const indexOf = (id: string) => viewerPhotos.findIndex((p) => p.id === id);

  const setFilters = (y: number | null, e: EventFilter) => {
    const next: Record<string, string> = {};
    if (y !== null) next.year = String(y);
    if (e !== 'all') next.event = e;
    setParams(next);
    setViewerIndex(null);
  };

  return (
    <div className="page">
      <h1>The Archive</h1>
      <p className="standfirst">
        The photographs — and, as permissions are confirmed, the films — of
        the Dundrod racing years.
      </p>

      <div
        className="archive-tabs"
        role="tablist"
        aria-label="Archive sections"
        onKeyDown={(e) => {
          // ARIA tabs pattern: arrow keys move and activate.
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          const next: Section = section === 'photography' ? 'film' : 'photography';
          setParams(next === 'photography' ? {} : { section: next });
          document.getElementById(`tab-${next}`)?.focus();
        }}
      >
        {(
          [
            ['photography', 'Photography'],
            ['film', 'Film'],
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

      {section === 'photography' ? (
        <div id="panel-photography" role="tabpanel" aria-labelledby="tab-photography">
          <p className="muted">
            Forty-four photographs, kindly contributed by Neville Armstrong.
            Select any photograph to view it full screen.
          </p>

          <div className="archive-filters" role="group" aria-label="Filter photographs">
            <span className="filter-label">Year</span>
            <button
              type="button"
              className="chip"
              aria-pressed={year === null}
              onClick={() => setFilters(null, event)}
            >
              All
            </button>
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                className="chip"
                aria-pressed={year === y}
                onClick={() => setFilters(y, event)}
              >
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
              <button
                key={key}
                type="button"
                className="chip"
                aria-pressed={event === key}
                onClick={() => setFilters(year, key)}
              >
                {label}
              </button>
            ))}
          </div>

          {filtering ? (
            <>
              <h2>
                {filtered.length}{' '}
                {filtered.length === 1 ? 'photograph' : 'photographs'}
                {year !== null ? ` from ${year}` : ''}
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
              {filtered.length === 0 && (
                <p className="muted">
                  No photographs in the archive match this combination — the
                  catalogue is honest about its gaps. Clear a filter to keep
                  browsing.
                </p>
              )}
              <ul className="gallery-grid">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="plate-button"
                      onClick={() => setViewerIndex(indexOf(p.id))}
                      aria-label={`View full screen: ${p.imageTitle ?? p.id}`}
                    >
                      <PhotoPlate photo={p} contained />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2>The 1950 photographs</h2>
              <p>
                Previously unseen images from the circuit&apos;s opening
                season: the August Ulster Trophy meeting and the September
                Tourist Trophy that made twenty-year-old Stirling
                Moss&apos;s name.{' '}
                <Link to="/seasons#y1950">Read the 1950 story</Link>.
              </p>
              <ul className="gallery-grid gallery-special">
                {special.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="plate-button"
                      onClick={() => setViewerIndex(indexOf(p.id))}
                      aria-label={`View full screen: ${p.imageTitle ?? p.id}`}
                    >
                      <PhotoPlate photo={p} contained />
                    </button>
                  </li>
                ))}
              </ul>
              <h2>The full archive, 1951–1955</h2>
              <ul className="gallery-grid">
                {archivePhotos
                  .filter((p) => !p.special1950)
                  .map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="plate-button"
                        onClick={() => setViewerIndex(indexOf(p.id))}
                        aria-label={`View full screen: ${p.imageTitle ?? p.id}`}
                      >
                        <PhotoPlate photo={p} contained />
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
          <PhotoViewer
            photos={viewerPhotos}
            index={viewerIndex}
            onClose={() => setViewerIndex(null)}
            onNavigate={setViewerIndex}
          />
        </div>
      ) : (
        <div id="panel-film" role="tabpanel" aria-labelledby="tab-film">
          {external.length > 0 && (
            <>
              <h2>Watch elsewhere</h2>
              <p className="muted">
                Period footage held by national archives, viewed on their own
                players — linked here, not embedded.
              </p>
              <ul className="film-links">
                {external.map((f) => (
                  <li key={f.id}>
                    <a href={f.url} target="_blank" rel="noreferrer">
                      {f.title}
                    </a>
                    {f.authorisationNote && (
                      <span className="muted"> — {f.authorisationNote}</span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
          {authorised.length === 0 ? (
            <Unavailable title="No authorised footage yet">
              British Pathé and Northern Ireland Screen material will appear
              here — and within the relevant race-year stories — once
              permission to use it is confirmed. In the meantime, the{' '}
              photographs tell the story.
            </Unavailable>
          ) : null}
        </div>
      )}
    </div>
  );
}
