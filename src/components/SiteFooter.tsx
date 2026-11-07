import { acknowledgements } from '../model/content';

export default function SiteFooter() {
  const credit = acknowledgements.find(
    (a) => a.id === 'ack-armstrong' && a.visibility === 'visible',
  );
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
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
      </div>
    </footer>
  );
}
