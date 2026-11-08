import { useEffect, useState } from 'react';
import { races, years } from '../model/content';

/**
 * The horizontal 1950–1955 timeline: a sticky strip of year stations
 * joined by a single track line. Each station carries the year numeral,
 * one dot per scheduled meeting (filled when the race was held, hollow
 * when it was not — 1952's missing TT and 1954's missing Ulster Trophy
 * stay honest), and the chapter title. The current chapter is marked as
 * the visitor reads (IntersectionObserver).
 */
export default function SeasonTimeline() {
  const [active, setActive] = useState<string | null>(null);

  // Keep the active station visible inside the horizontally scrolling
  // strip (matters on narrow screens where later years sit off-screen).
  useEffect(() => {
    if (!active) return;
    const station = document.querySelector(
      `.season-timeline li[data-active]`,
    );
    station?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    for (const y of years) {
      const el = document.getElementById(y.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="season-timeline" aria-label="Six racing seasons, 1950 to 1955">
      <ol>
        {years.map((y) => {
          const meetings = races.filter((r) => r.yearId === y.id);
          return (
            <li key={y.id} data-active={active === y.id || undefined}>
              <a
                href={`#/seasons#${y.id}`}
                title={`${y.year} — ${y.chapterTitle}`}
                aria-current={active === y.id ? 'true' : undefined}
              >
                <span className="tl-meetings" aria-hidden="true">
                  {meetings.map((r) => (
                    <i
                      key={r.id}
                      className="tl-dot"
                      data-held={r.status === 'held' || undefined}
                      title={
                        r.status === 'held'
                          ? r.event === 'ulster-trophy'
                            ? 'Ulster Trophy held'
                            : 'RAC Tourist Trophy held'
                          : r.event === 'ulster-trophy'
                            ? 'No Ulster Trophy this year'
                            : 'RAC Tourist Trophy not held'
                      }
                    />
                  ))}
                </span>
                <span className="tl-year">{y.year}</span>
                <span className="tl-cue">{y.chapterTitle}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
