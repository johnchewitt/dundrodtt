import PhotoPlate from '../components/PhotoPlate';
import { acknowledgements, photoById, sources } from '../model/content';

export default function Credits() {
  const visible = acknowledgements.filter((a) => a.visibility === 'visible');
  return (
    <div className="page">
      <h1>Acknowledgements</h1>
      {visible.map((a) => {
        const portrait = a.portraitPhotoId
          ? photoById.get(a.portraitPhotoId)
          : null;
        return (
          <section key={a.id}>
            <p className="standfirst">{a.message}</p>
            {portrait ? (
              /* The portrait's catalogue caption is an internal handling
                 note — display copy comes from the acknowledgement. */
              <PhotoPlate
                photo={portrait}
                contained
                caption="Neville and Beverley Armstrong."
              />
            ) : null}
          </section>
        );
      })}
      <hr className="section-rule" />
      <h2>Sources</h2>
      <p className="muted">
        Historical copy in this app is drawn from the project&apos;s supplied
        material and the references verified alongside it.
      </p>
      <ul>
        {sources.map((s) => (
          <li key={s.id} className="muted">
            {s.id} — {s.title}
            {s.note ? ` (${s.note})` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
