import { useState } from 'react';
import PhotoViewer from '../components/PhotoViewer';
import SeasonChapter from '../components/SeasonChapter';
import SeasonTimeline from '../components/SeasonTimeline';
import { archivePhotos, years } from '../model/content';

/**
 * Six Racing Seasons — the interactive historical timeline. A sticky
 * horizontal timeline leads six cinematic chapters, one per year, each
 * built entirely from the verified content catalogue. The photograph
 * viewer is scoped to the chapter it was opened from, so arrowing
 * through images stays within that season.
 */
export default function Seasons() {
  const [viewer, setViewer] = useState<{ yearId: string; index: number } | null>(null);

  const photosOf = (yearId: string) => {
    const y = years.find((x) => x.id === yearId);
    return archivePhotos.filter((p) => p.year === y?.year);
  };

  const viewerPhotos = viewer ? photosOf(viewer.yearId) : [];

  return (
    <div className="page seasons-page">
      <h1>Six Racing Seasons</h1>
      <p className="standfirst">
        1950 to 1955, year by year. The Ulster Trophy and the RAC Tourist
        Trophy were different events, and this timeline keeps them distinct.
      </p>
      <SeasonTimeline />
      {years.map((y, i) => (
        <SeasonChapter
          key={y.id}
          year={y}
          photos={photosOf(y.id)}
          chapterNumber={i + 1}
          onOpenPhoto={(index) => setViewer({ yearId: y.id, index })}
        />
      ))}
      <PhotoViewer
        photos={viewerPhotos}
        index={viewer?.index ?? null}
        onClose={() => setViewer(null)}
        onNavigate={(index) =>
          setViewer((v) => (v ? { ...v, index } : v))
        }
      />
    </div>
  );
}
