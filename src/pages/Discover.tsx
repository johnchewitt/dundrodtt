import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import {
  personById,
  photoById,
  storyChapters,
  yearById,
} from '../model/content';
import tourJson from '../content/tour.json';

interface TourPart {
  kind: 'story' | 'year' | 'person' | 'editorial';
  id?: string;
  index?: number;
  text?: string;
}
interface TourStep {
  id: string;
  kicker: string;
  title: string;
  photoId: string | null;
  mapFigure?: boolean;
  parts: TourPart[];
  link: { to: string; label: string };
}

const steps = tourJson as TourStep[];
const STEP_MS = 16000;

/** Every historical sentence comes from the canonical records. */
function resolvePart(part: TourPart): string | null {
  switch (part.kind) {
    case 'story': {
      const ch = storyChapters.find((c) => c.id === part.id);
      return ch?.paragraphs[part.index ?? 0] ?? null;
    }
    case 'year':
      return part.id ? (yearById.get(part.id)?.summary ?? null) : null;
    case 'person':
      return part.id ? (personById.get(part.id)?.context ?? null) : null;
    case 'editorial':
      return part.text ?? null;
  }
}

/**
 * DISCOVER DUNDROD — the guided visitor journey. Eight scenes from the
 * return of racing to the roads today, each drawing its words from the
 * verified content records and its photograph from the archive. Plays
 * itself unless the visitor prefers reduced motion; Next, Previous,
 * Pause, Restart and Exit are always one key away.
 */
export default function Discover() {
  const navigate = useNavigate();
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const timer = useRef<number | null>(null);

  const step = steps[index];
  const photo = step.photoId ? photoById.get(step.photoId) : undefined;
  const last = index === steps.length - 1;

  useEffect(() => {
    document.title = 'Discover Dundrod · Dundrod — The Forgotten Racing Years';
  }, []);

  useEffect(() => {
    if (!playing || last) return;
    timer.current = window.setTimeout(
      () => setIndex((i) => Math.min(i + 1, steps.length - 1)),
      STEP_MS,
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, index, last]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <div className="page discover-page">
      <header className="discover-head">
        <p className="chapter-kicker" aria-hidden="true">
          <span className="chapter-numeral">A guided visit</span>
        </p>
        <h1>Discover Dundrod</h1>
        <p className="muted">
          Eight scenes, about four minutes — or take it at your own pace.
        </p>
      </header>

      <section key={step.id} className="discover-stage" aria-live="polite">
        <div className="discover-text">
          <p className="chapter-kicker">
            <span className="chapter-numeral">{step.kicker}</span>
          </p>
          <h2>{step.title}</h2>
          {step.parts.map((part, i) => {
            const text = resolvePart(part);
            return text ? (
              <p key={i} className={i === 0 ? 'chapter-summary' : 'chapter-summary discover-more'}>
                {text}
              </p>
            ) : null;
          })}
          <p>
            <Link to={step.link.to} className="chip chip-archive">
              {step.link.label} →
            </Link>
          </p>
        </div>
        {photo ? (
          <PhotoPlate photo={photo} contained full loading="eager" />
        ) : step.mapFigure ? (
          <figure className="plate plate-contained">
            <div className="plate-mount">
              <picture>
                <source
                  srcSet={`${import.meta.env.BASE_URL}circuit/period-map.webp`}
                  type="image/webp"
                />
                <img
                  src={`${import.meta.env.BASE_URL}circuit/period-map.jpg`}
                  alt="A 1950s race programme map of the Dundrod circuit."
                  width={1600}
                  height={978}
                  style={{ aspectRatio: '1600 / 978' }}
                  data-loaded
                />
              </picture>
            </div>
            <figcaption>
              <span className="plate-id">Period map</span>
              The course as the race programmes drew it.
            </figcaption>
          </figure>
        ) : null}
      </section>

      <nav className="discover-controls" aria-label="Tour controls">
        <button
          type="button"
          className="menu-button"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="menu-button"
          aria-pressed={!playing}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className="menu-button"
          disabled={last}
          onClick={() => setIndex(index + 1)}
        >
          Next →
        </button>
        <button type="button" className="menu-button" onClick={() => setIndex(0)}>
          Restart
        </button>
        <Link to="/" className="menu-button discover-exit">
          Exit tour
        </Link>
      </nav>

      <ol className="discover-dots" aria-label="Tour progress">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              aria-label={`Scene ${i + 1}: ${s.title}`}
              aria-current={i === index ? 'step' : undefined}
              data-active={i === index || undefined}
              onClick={() => setIndex(i)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
