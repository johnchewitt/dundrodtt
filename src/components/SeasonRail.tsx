import { useEffect, useState } from 'react';
import { years } from '../model/content';

/**
 * Sticky season jump-rail for the Six Seasons timeline: one gold-ringed
 * stop per year, the current season marked as the visitor scrolls.
 * A first step toward the fully animated timeline of the Seasons stage.
 */
export default function SeasonRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    for (const y of years) {
      const el = document.getElementById(y.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="season-rail" aria-label="Jump to a season">
      <ul>
        {years.map((y) => (
          <li key={y.id}>
            <a
              href={`#/seasons#${y.id}`}
              aria-current={active === y.id ? 'true' : undefined}
            >
              {y.year}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
