import type { Person } from '../../model/content';

/**
 * Driver / figure profile card: name, home place, verified context.
 * Each card carries its person ID as an anchor, so season chapters and
 * the photograph viewer can deep-link straight to a profile.
 */
export default function DriverCard({ person }: { person: Person }) {
  return (
    <article className="driver-card" id={person.id}>
      <h3>{person.name}</h3>
      {person.homePlace && <p className="driver-home">{person.homePlace}</p>}
      {person.context && <p>{person.context}</p>}
    </article>
  );
}
