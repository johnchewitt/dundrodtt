import { useState } from 'react';
import { photoThumbUrl, photoUrl, type Photo } from '../model/content';

interface PhotoPlateProps {
  photo: Photo;
  /** Contained plates respect the small native size of archive scans. */
  contained?: boolean;
  loading?: 'eager' | 'lazy';
  /** Serve the untouched original instead of the gallery thumbnail. */
  full?: boolean;
}

/**
 * A photograph presented as a mounted exhibition plate with printed
 * caption and register number. Caption and alt come verbatim from the
 * gallery catalogue; the review note never renders. Images fade in as
 * they load (CSS transition, disabled under reduced motion).
 */
export default function PhotoPlate({
  photo,
  contained = false,
  loading = 'lazy',
  full = false,
}: PhotoPlateProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className={contained ? 'plate plate-contained' : 'plate'}>
      <div className="plate-mount">
        <img
          ref={(el) => {
            // Cached images can complete before React attaches onLoad.
            if (el?.complete && el.naturalWidth > 0) setLoaded(true);
          }}
          src={full ? photoUrl(photo) : photoThumbUrl(photo)}
          alt={photo.altText ?? ''}
          loading={loading}
          width={photo.width}
          height={photo.height}
          style={{
            // Reserve layout before load: lazy images otherwise collapse.
            aspectRatio: `${photo.width} / ${photo.height}`,
            ...(contained ? { width: `min(100%, ${photo.width}px)` } : null),
          }}
          data-loaded={loaded || undefined}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <figcaption>
        <span className="plate-id">{photo.id}</span>
        {photo.caption}
      </figcaption>
    </figure>
  );
}
