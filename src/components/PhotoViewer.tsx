import { useEffect, useRef } from 'react';
import { photoUrl, type Photo } from '../model/content';

interface PhotoViewerProps {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen image viewer. Native <dialog>: Esc closes, focus is
 * trapped; arrow keys move between photographs. Captions and register
 * numbers come verbatim from the catalogue.
 */
export default function PhotoViewer({
  photos,
  index,
  onClose,
  onNavigate,
}: PhotoViewerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (photo && !dialog.open) dialog.showModal();
    if (!photo && dialog.open) dialog.close();
  }, [photo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === 'ArrowRight' && index < photos.length - 1)
        onNavigate(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, photos.length, onNavigate]);

  return (
    <dialog
      ref={ref}
      className="photo-viewer"
      aria-label="Photograph viewer"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      {photo && (
        <figure>
          <img src={photoUrl(photo)} alt={photo.altText ?? ''} />
          <figcaption>
            <span className="plate-id">{photo.id}</span>
            {photo.caption}
          </figcaption>
          <div className="viewer-controls">
            <button
              type="button"
              className="menu-button"
              disabled={index === 0}
              onClick={() => index !== null && onNavigate(index - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="menu-button"
              onClick={() => ref.current?.close()}
            >
              Close
            </button>
            <button
              type="button"
              className="menu-button"
              disabled={index === photos.length - 1}
              onClick={() => index !== null && onNavigate(index + 1)}
            >
              Next
            </button>
          </div>
        </figure>
      )}
    </dialog>
  );
}
