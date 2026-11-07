import { Link } from 'react-router-dom';
import { siteSettings } from '../config/appSettings';
import { photoById, photoUrl } from '../model/content';

/* The two large 1955 PNGs — the only plates that carry true full-screen
   treatment. The cover crossfades slowly between them; under reduced
   motion only the first shows, still. */
const coverPhotos = [photoById.get('DU-1955-05')!, photoById.get('DU-1955-03')!];

export default function Home() {
  return (
    <section className="cover" aria-label="Dundrod — The Forgotten Racing Years">
      <div className="cover-photos" aria-hidden="true">
        {coverPhotos.map((p, i) => (
          <img
            key={p.id}
            src={photoUrl(p)}
            alt=""
            loading="eager"
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className={`cover-photo cover-photo-${i + 1}`}
          />
        ))}
      </div>

      <div className="cover-inner">
        <p className="cover-mark enter enter-1">
          Dundrod
          <span>The Forgotten Racing Years</span>
        </p>
        <h1 className="enter enter-2">{siteSettings.headline}</h1>
        <p className="cover-subtitle enter enter-3">{siteSettings.subtitle}</p>
        <p className="cover-distinction enter enter-4">
          {siteSettings.headlineDistinction} Between 1950 and 1955, the
          world&apos;s greatest drivers raced the world&apos;s finest cars on
          seven miles of closed country road above Belfast.
        </p>
        <div className="cover-actions enter enter-5">
          <Link className="cta" to="/story">
            Explore the Story
          </Link>
          <Link className="cta cta-ghost" to="/seasons">
            Six Racing Seasons
          </Link>
        </div>
      </div>

      <p className="cover-caption">
        <span className="plate-id">{coverPhotos[0].id}</span>
        {coverPhotos[0].caption}
      </p>
    </section>
  );
}
