import { Link } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import { photoById, storyChapters, type StoryChapter } from '../model/content';

/**
 * The Dundrod Story: short, engaging chapters rendered entirely from
 * src/content/story.json — no historical copy lives in this component.
 */
function Chapter({ chapter }: { chapter: StoryChapter }) {
  const photos = chapter.photoIds
    .map((id) => photoById.get(id))
    .filter((p) => p !== undefined);
  return (
    <section
      id={chapter.id}
      className={chapter.tone === 'paper' ? 'chapter paper' : 'chapter chapter-dark'}
      aria-labelledby={`${chapter.id}-h`}
    >
      <p className="chapter-kicker">{chapter.kicker}</p>
      <h2 id={`${chapter.id}-h`}>{chapter.title}</h2>
      {chapter.paragraphs.map((text, i) => (
        <p key={i} className={i === 0 ? 'standfirst' : undefined}>
          {text}
        </p>
      ))}
      {photos.map((p) => (
        <PhotoPlate key={p.id} photo={p} contained />
      ))}
      {chapter.link && (
        <p>
          <Link to={chapter.link.to}>{chapter.link.label}</Link>
        </p>
      )}
    </section>
  );
}

export default function Story() {
  return (
    <div className="page story-page">
      <h1>The Dundrod Story</h1>
      <p className="standfirst">
        How international motor racing came back to Northern Ireland — and
        why six seasons on a country-road circuit still matter.
      </p>
      {storyChapters.map((ch) => (
        <Chapter key={ch.id} chapter={ch} />
      ))}
      <hr className="section-rule" />
      <p>
        Continue into the <Link to="/seasons">Six Racing Seasons</Link>,
        browse <Link to="/archive">The Archive</Link>, or meet the{' '}
        <Link to="/drivers">drivers and teams</Link>.
      </p>
    </div>
  );
}
