import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import PhotoViewer from '../components/PhotoViewer';
import Unavailable from '../components/ui/Unavailable';
import { archivePhotos, films } from '../model/content';

type Section = 'photography' | 'film';

export default function Archive() {
  const [params, setParams] = useSearchParams();
  const section: Section = params.get('section') === 'film' ? 'film' : 'photography';
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const special = archivePhotos.filter((p) => p.special1950);
  const authorised = films.filter((f) => f.status === 'authorised');

  return (
    <div className="page">
      <h1>The Archive</h1>
      <p className="standfirst">
        The photographs — and, as permissions are confirmed, the films — of
        the Dundrod racing years.
      </p>

      <div className="archive-tabs" role="tablist" aria-label="Archive sections">
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
            The full searchable archive — browsing by year, event, driver,
            team, car and location — arrives with the archive build stage.
          </p>
          <h2>The 1950 photographs</h2>
          <p>
            Previously unseen images from the circuit&apos;s opening season:
            the August Ulster Trophy meeting and the September Tourist Trophy
            that made twenty-year-old Stirling Moss&apos;s name. Select a
            photograph to view it full screen.{' '}
            <Link to="/seasons#y1950">Read the 1950 story</Link>.
          </p>
          <ul className="viewer-list">
            {special.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="plate-button"
                  onClick={() => setViewerIndex(i)}
                  aria-label={`View full screen: ${p.imageTitle ?? p.id}`}
                >
                  <PhotoPlate photo={p} contained />
                </button>
              </li>
            ))}
          </ul>
          <PhotoViewer
            photos={special}
            index={viewerIndex}
            onClose={() => setViewerIndex(null)}
            onNavigate={setViewerIndex}
          />
        </div>
      ) : (
        <div id="panel-film" role="tabpanel" aria-labelledby="tab-film">
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
