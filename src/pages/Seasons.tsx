import { Link } from 'react-router-dom';
import SeasonRail from '../components/SeasonRail';
import RaceResultCard from '../components/ui/RaceResultCard';
import { incidents, races, years } from '../model/content';

export default function Seasons() {
  return (
    <div className="page">
      <h1>Six Racing Seasons</h1>
      <SeasonRail />
      <p className="standfirst">
        1950 to 1955, year by year. The Ulster Trophy and the RAC Tourist
        Trophy were different events, and this timeline keeps them distinct.
      </p>
      <p className="muted">
        The full interactive timeline — stories, photographs and film woven
        through each season — arrives with the Seasons build stage. The
        verified race records are already here.
      </p>
      {years.map((y) => (
        <section key={y.id} id={y.id} aria-labelledby={`${y.id}-h`}>
          <hr className="section-rule" />
          <h2 id={`${y.id}-h`}>{y.year}</h2>
          <p>{y.summary}</p>
          <div className="card-grid">
            {races
              .filter((r) => r.yearId === y.id)
              .map((r) => (
                <RaceResultCard key={r.id} race={r} />
              ))}
          </div>
          {incidents
            .filter((i) => i.yearId === y.id)
            .map((i) => (
              <p key={i.id} className="muted">
                {i.text}
              </p>
            ))}
          <p>
            <Link to={`/archive?year=${y.year}`}>
              Photographs from {y.year}
            </Link>
          </p>
        </section>
      ))}
    </div>
  );
}
