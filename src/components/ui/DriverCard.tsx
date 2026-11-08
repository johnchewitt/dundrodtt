import type { Person } from '../../model/content';

/** Driver / figure profile card: name, home place, verified context. */
export default function DriverCard({ person }: { person: Person }) {
  return (
    <article className="driver-card">
      <h3>{person.name}</h3>
      {person.homePlace && <p className="driver-home">{person.homePlace}</p>}
      {person.context && <p>{person.context}</p>}
    </article>
  );
}
