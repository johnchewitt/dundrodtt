import { thenAndNow } from '../model/content';

export default function Today() {
  const complete = thenAndNow.filter((t) => t.status === 'complete');
  return (
    <div className="page">
      <h1>Dundrod Today</h1>
      <p className="standfirst">
        The roads are still there. This experience will set the photographs
        of 1950–1955 against the modern landscape.
      </p>
      {complete.length === 0 ? (
        <p className="coming">
          Then-and-now comparisons will appear here as present-day
          photography of the circuit&apos;s surviving landmarks is added to
          the collection.
        </p>
      ) : null}
    </div>
  );
}
