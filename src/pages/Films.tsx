import { films } from '../model/content';

export default function Films() {
  const authorised = films.filter((f) => f.status === 'authorised');
  return (
    <div className="page">
      <h1>Film Archive</h1>
      <p className="standfirst">
        Period footage of the Dundrod races, shown where use has been
        authorised.
      </p>
      {authorised.length === 0 ? (
        <p className="coming">
          No authorised footage is available yet. British Pathé and Northern
          Ireland Screen material will appear here — and within the relevant
          race-year stories — once permission to use it is confirmed.
        </p>
      ) : null}
    </div>
  );
}
