import { Link } from 'react-router-dom';
import PhotoPlate from '../PhotoPlate';
import DateLabel from '../ui/DateLabel';
import {
  incidents,
  locationById,
  photoById,
  yearById,
} from '../../model/content';
import { useUiStore } from '../../store/uiStore';

/**
 * Floating story panel for the selected circuit location. Everything
 * shown is verified editorial data; what is not yet verified is said
 * plainly rather than invented — no fabricated pins, photo locations
 * or modern viewpoints.
 */
export default function LocationPanel() {
  const selected = useUiStore((s) => s.selectedLocationId);
  const selectLocation = useUiStore((s) => s.selectLocation);
  const location = selected ? locationById.get(selected) : null;
  if (!location) return null;

  const locIncidents = incidents.filter((i) => i.locationId === location.id);
  const raceYears = [
    ...new Set(
      locIncidents
        .map((i) => yearById.get(i.yearId)?.year)
        .filter((y) => y !== undefined),
    ),
  ];
  const photos = (location.photoIds ?? [])
    .map((id) => photoById.get(id))
    .filter((p) => p !== undefined);

  return (
    <aside
      className="location-panel glass"
      aria-label={`About ${location.name}`}
    >
      <header className="location-panel-head">
        <div>
          <h3>{location.name}</h3>
          <DateLabel>1950–1955 course</DateLabel>
        </div>
        <button
          type="button"
          className="menu-button"
          onClick={() => selectLocation(null)}
        >
          Close
        </button>
      </header>

      {location.story ? (
        <p>{location.story}</p>
      ) : (
        <p className="muted">
          A named place on the 1950s course, recorded in the period
          programme and circuit histories.
        </p>
      )}

      {raceYears.length > 0 && (
        <p className="muted">
          Documented events:{' '}
          {raceYears.map((y) => (
            <Link key={y} to={`/seasons#y${y}`} className="location-year-link">
              {y}
            </Link>
          ))}
        </p>
      )}

      {photos.length > 0 ? (
        photos.map((p) => <PhotoPlate key={p.id} photo={p} contained />)
      ) : (
        <p className="muted">
          No photographs in the collection are verified for this exact
          location yet — identifications are never guessed.{' '}
          <Link to="/archive">Browse the archive</Link>.
        </p>
      )}

      {location.geometryStatus === 'pending' && (
        <p className="location-pending">
          The historic name is verified from period sources; its position
          on the interactive map arrives with the verified circuit layer.
        </p>
      )}

      <p className="muted location-sources">
        Sources: {location.sourceRefs.join(' · ')}
      </p>
    </aside>
  );
}
