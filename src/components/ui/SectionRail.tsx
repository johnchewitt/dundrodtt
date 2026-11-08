import { useEffect, useState } from 'react';

export interface RailItem {
  id: string;
  label: string;
  ariaLabel?: string;
}

/**
 * Sticky jump-rail of gold-ringed stops for long scrolling pages, with
 * the current section marked as the visitor reads (IntersectionObserver).
 * Used for seasons and story chapters.
 */
export default function SectionRail({
  items,
  routePath,
  ariaLabel,
}: {
  items: RailItem[];
  routePath: string;
  ariaLabel: string;
}) {
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
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="season-rail" aria-label={ariaLabel}>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${routePath}#${item.id}`}
              aria-label={item.ariaLabel}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
