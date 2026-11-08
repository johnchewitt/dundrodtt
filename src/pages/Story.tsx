import { Link } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import { siteSettings } from '../config/appSettings';
import { photoById, photoUrl, years } from '../model/content';

const hero = photoById.get('DU-1955-05')!;
const curated = ['DU-1950-05', 'DU-1952-11', 'DU-1953-04', 'DU-1954-01']
  .map((id) => photoById.get(id)!)
  .filter(Boolean);

export default function Story() {
  return (
    <>
      <section className="hero">
        <div className="hero-photo" aria-hidden="true">
          <img
            src={photoUrl(hero)}
            alt=""
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="hero-inner">
          <p className="hero-kicker">Dundrod · County Antrim · 1950–1955</p>
          <h1>{siteSettings.headline}</h1>
          <p className="hero-subtitle">{siteSettings.subtitle}</p>
          <p className="hero-distinction">{siteSettings.headlineDistinction}</p>
          <Link className="cta" to="/seasons">
            Begin the story
          </Link>
          <ul className="year-roundels" aria-label="Seasons">
            {years.map((y) => (
              <li key={y.id}>
                <Link className="roundel" to={`/seasons#${y.id}`}>
                  {y.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="hero-caption">
          <span className="plate-id">{hero.id}</span>
          {hero.caption}
        </p>
      </section>

      <div className="page">
        <div className="paper">
          <h2>The story in brief</h2>
          <p className="standfirst">
            Dundrod brought the RAC Tourist Trophy back to Northern Ireland in
            1950, fourteen years after the fatal 1936 Ards TT.
          </p>
          <p>
            The course was a purpose-designed public-road circuit in the hills
            northwest of Belfast. Antrim County Council approved a substantial
            road and event-facilities scheme in 1949 — an estimated £40,000 of
            construction, reconstruction and widening, with a grandstand,
            offices, pits, barricades and fences, and a recommended £20,000
            grant. Then the circuit opened for racing with the Ulster Trophy
            on 12 August 1950, and the Tourist Trophy followed five weeks
            later: twenty-year-old Stirling Moss won it in Tommy Wisdom&apos;s
            Jaguar XK120, on the eve of his twenty-first birthday.
          </p>
          <p>
            Across six seasons, Dundrod moved from a local return to a stage
            for Formula One and Formula Two single-seaters, international
            sports-car teams and World Sportscar Championship racing — the
            reigning World Champion Giuseppe Farina, then Fangio and Moss in
            the experimental V16 BRM, then the works teams of Jaguar,
            Ferrari, Aston Martin and Mercedes-Benz. The 1955 Tourist Trophy
            ended the chapter: Moss and John Fitch won for Mercedes-Benz, but
            three drivers died in crashes, and the cars never raced at
            Dundrod again. Motorcycle racing had already arrived in 1953, and
            continued after the cars left.
          </p>
          <p>
            <Link to="/seasons">Follow the story through the six seasons</Link>
          </p>
        </div>

        <hr className="section-rule" />

        <h2>From the collection</h2>
        <p className="muted">
          Photographs of the Dundrod years, kindly contributed by Neville
          Armstrong. Browse all forty-four in the{' '}
          <Link to="/archive">Photo Archive</Link>.
        </p>
        {curated.map((p) => (
          <PhotoPlate key={p.id} photo={p} contained />
        ))}
      </div>
    </>
  );
}
