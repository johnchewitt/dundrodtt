import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { experiences } from './SiteHeader';

const SITE = 'Dundrod — The Forgotten Racing Years';

/**
 * Keeps navigation honest: per-route document titles, scroll-to-top on
 * route change, and real scrolling to in-page anchors (the year roundels
 * link to /seasons#y19xx). Smoothness is left to CSS so reduced-motion
 * preferences are respected globally.
 */
export default function ScrollAndTitle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const section = experiences.find((e) => e.path === pathname);
    document.title =
      section && section.path !== '/' ? `${section.label} · ${SITE}` : SITE;

    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
