import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CircuitMapSeam from '../components/map/CircuitMapSeam';
import LandmarkCatalogue from '../components/circuit/LandmarkCatalogue';
import LocationPanel from '../components/circuit/LocationPanel';
import { locationById } from '../model/content';
import { useUiStore } from '../store/uiStore';

export default function Circuit() {
  const [params] = useSearchParams();
  const selectLocation = useUiStore((s) => s.selectLocation);

  // Season chapters deep-link documented places: /circuit?loc=<id>
  // opens that place's story panel on arrival.
  useEffect(() => {
    const loc = params.get('loc');
    if (loc && locationById.has(loc)) selectLocation(loc);
  }, [params, selectLocation]);

  return (
    <div className="page circuit-page">
      <h1>Explore the Circuit</h1>
      <p className="standfirst">
        7 miles 732 yards of closed public roads, run clockwise through the
        townlands northwest of Belfast.
      </p>
      <p>
        The course crossed rolling ground with fast approaches, gradients,
        crests, dips, changing cambers and blind sections. The same
        landscape that made the circuit memorable left little room to
        recover from a mistake. Select a place to read its story.
      </p>
      <div className="explorer-stage">
        <CircuitMapSeam />
        <LandmarkCatalogue />
        <LocationPanel />
      </div>

      <section className="period-map" aria-labelledby="period-map-h">
        <h2 id="period-map-h">The circuit as the programmes drew it</h2>
        <p>
          A 1950s race programme map of the course, drawn from the Ordnance
          Survey of Northern Ireland. It names the corners the drivers knew —
          and the spectator grandstands and enclosures, each named for a
          county or hill of Ulster: Londonderry, Belfast and Ulster stands at
          the start and pits, Down and Mourne at the Hairpin, Fermanagh at
          Leathemstown Corner, Slemish at Wheeler&apos;s, the Erne enclosure
          inside Leathemstown. The red, blue and yellow routes guided
          spectators&apos; cars in from Belfast and beyond.
        </p>
        <figure className="plate plate-contained">
          <div className="plate-mount">
            <picture>
              <source
                srcSet={`${import.meta.env.BASE_URL}circuit/period-map.webp`}
                type="image/webp"
              />
              <img
                src={`${import.meta.env.BASE_URL}circuit/period-map.jpg`}
                alt="A 1950s race programme map of the Dundrod circuit showing corner names, the start/finish and pits, and county-named grandstands and spectator enclosures."
                loading="lazy"
                width={1600}
                height={978}
                style={{ aspectRatio: '1600 / 978' }}
                data-loaded
              />
            </picture>
          </div>
          <figcaption>
            Period race programme course map.
            <span className="figure-credit">
              {' '}
              Based upon the Ordnance Survey of Northern Ireland by sanction
              of H.M. Stationery Office.
            </span>
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
