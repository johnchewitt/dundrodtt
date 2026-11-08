import { carById, personById, teamById, type Classification, type Race } from '../../model/content';
import DateLabel from './DateLabel';

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

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const month = m ? months[Number(m) - 1] : null;
  if (!month) return y;
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}

function winnerLine(c: Classification): string {
  const names = c.winnerPersonIds
    .map((id) => personById.get(id)?.name)
    .filter(Boolean)
    .join(' and ');
  const car = c.carId ? carById.get(c.carId)?.name : '';
  const teamName = c.teamId ? teamById.get(c.teamId)?.name : null;
  // Skip the entrant when the car name already carries it.
  const team =
    teamName && !car?.includes(teamName.replace(' (works)', ''))
      ? ` (${teamName})`
      : '';
  return `${names}${car ? `, ${car}` : ''}${team}`;
}

/** A race's result record: event, date chip, classifications. */
export default function RaceResultCard({ race }: { race: Race }) {
  const date = formatDate(race.date);
  return (
    <article className="race-card">
      <header>
        <h4>{eventLabel[race.event]}</h4>
        {date && <DateLabel>{date}</DateLabel>}
      </header>
      {race.championship && <p className="race-championship">{race.championship}</p>}
      {race.status === 'not-held' ? (
        <p className="race-not-held">{race.notHeldReason}</p>
      ) : (
        <ul>
          {race.classifications?.map((c) => (
            <li key={c.award}>
              <strong>{awardLabel[c.award]}:</strong> {winnerLine(c)}
              {c.note ? <span className="race-note"> — {c.note}</span> : null}
            </li>
          ))}
        </ul>
      )}
      {race.laps && race.time ? (
        <p className="race-note">
          {race.laps} laps · {race.time}
        </p>
      ) : null}
      {race.notes && <p className="race-extra">{race.notes}</p>}
    </article>
  );
}
