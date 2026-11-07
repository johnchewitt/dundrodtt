import { photoUrl, type Photo } from '../model/content';

interface PhotoPlateProps {
  photo: Photo;
  /** Contained plates respect the small native size of archive scans. */
  contained?: boolean;
  loading?: 'eager' | 'lazy';
}

/**
 * A photograph presented as a mounted exhibition plate with printed
 * caption and register number. Caption and alt come verbatim from the
 * gallery catalogue; the review note never renders.
 */
export default function PhotoPlate({
  photo,
  contained = false,
  loading = 'lazy',
}: PhotoPlateProps) {
  return (
    <figure className={contained ? 'plate plate-contained' : 'plate'}>
      <div className="plate-mount">
        <img
          src={photoUrl(photo)}
          alt={photo.altText ?? ''}
          loading={loading}
          width={photo.width}
          height={photo.height}
        />
      </div>
      <figcaption>
        <span className="plate-id">{photo.id}</span>
        {photo.caption}
      </figcaption>
    </figure>
  );
}
