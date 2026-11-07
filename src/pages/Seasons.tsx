import { Link } from 'react-router-dom';
import SeasonRail from '../components/SeasonRail';
import {
  carById,
  incidents,
  personById,
  races,
  teamById,
  years,
  type Classification,
  type Race,
} from '../model/content';

const awardLabel: Record<Classification['award'], string> = {
  outright: 'Winner',
  scratch: 'Scratch / championship result',
  handicap: 'Handicap result',
  'fastest-finisher': 'Ulster Trophy (fastest finisher)',
  'handicap-champion-trophy': 'Handicap Champion Trophy',
};

const eventLabel: Record<Race['event'], string> = {
  'ulster-trophy': 'Ulster Trophy',
  'rac-tt': 'RAC Tourist Trophy',
};

function RaceRecord({ race }: { race: Race }) {
  return (
    <div>
      <h4>
        {eventLabel[race.event]}
        {race.championship ? ` · ${race.championship}` : ''}
      </h4>
      {race.status === 'not-held' ? (
        <p className="muted">{race.notHeldReason}</p>
      ) : (
        <ul>
          {race.classifications?.map((c) => (
            <li key={c.award}>
              <strong>{awardLabel[c.award]}:</strong>{' '}
              {c.winnerPersonIds
                .map((id) => personById.get(id)?.name)
                .join(' and ')}
              {c.carId ? `, ${carById.get(c.carId)?.name}` : ''}
              {(() => {
                // Skip the entrant when the car name already carries it
                // ("Aston Martin DB3S (Aston Martin)" reads doubled).
                const team = c.teamId ? teamById.get(c.teamId)?.name : null;
                const car = c.carId ? carById.get(c.carId)?.name : '';
                return team && !car?.includes(team.replace(' (works)', ''))
                  ? ` (${team})`
                  : '';
              })()}
              {c.note ? ` — ${c.note}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
          {races
            .filter((r) => r.yearId === y.id)
            .map((r) => (
              <RaceRecord key={r.id} race={r} />
            ))}
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
