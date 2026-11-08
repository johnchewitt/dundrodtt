import { Link } from 'react-router-dom';
import { acknowledgements } from '../model/content';
import { experiences } from './SiteHeader';

export default function SiteFooter() {
  const credit = acknowledgements.find(
    (a) => a.id === 'ack-armstrong' && a.visibility === 'visible',
  );
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav aria-label="Experiences (footer)">
          <ul className="footer-nav">
            {experiences.map((e) => (
              <li key={e.path}>
                <Link to={e.path}>{e.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/credits">Acknowledgements</Link>
            </li>
          </ul>
        </nav>
        {credit && (
          <p>
            Neville Armstrong kindly contributed photographs of Dundrod from
            the 1950s.
          </p>
        )}
        <p>
          Dundrod hosted Formula One cars and Formula One World Championship
          drivers — though never a championship Grand Prix. Historical copy is
          drawn from the project&apos;s supplied source material.
        </p>
        <p className="footer-rights">
          Photographs © their contributors, shown by kind permission;
          period films remain with their archives and are linked, never
          rehosted. Map data © Esri and its data providers (attribution on
          the map). Please contact the project before reusing any material.
        </p>
      </div>
    </footer>
  );
}
