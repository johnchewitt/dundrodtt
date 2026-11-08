import { photoById, photoUrl, type Person } from '../../model/content';

/**
 * Driver / figure profile card: a curated archive photograph where one
 * exists, name, home place and verified context. Each card carries its
 * person ID as an anchor, so season chapters and the photograph viewer
 * can deep-link straight to a profile.
 */
export default function DriverCard({ person }: { person: Person }) {
  const photo = person.photoId ? photoById.get(person.photoId) : undefined;
  return (
    <article className="driver-card" id={person.id}>
      {photo && (
        <div className="driver-photo">
          <img
            src={photoUrl(photo)}
            alt={photo.altText ?? ''}
            loading="lazy"
            width={photo.width}
            height={photo.height}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          />
          <span className="driver-photo-id">{photo.id}</span>
        </div>
      )}
      <h3>{person.name}</h3>
      {person.homePlace && <p className="driver-home">{person.homePlace}</p>}
      {person.context && <p>{person.context}</p>}
    </article>
  );
}
