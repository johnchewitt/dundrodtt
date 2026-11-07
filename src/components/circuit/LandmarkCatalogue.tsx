import { locations } from '../../model/content';
import { useUiStore } from '../../store/uiStore';

/**
 * The catalogue of verified course locations — historic names from the
 * period sources, in course order as listed. Selection drives both the
 * story panel and (once the owner's layer is live) the map camera.
 */
export default function LandmarkCatalogue() {
  const selected = useUiStore((s) => s.selectedLocationId);
  const selectLocation = useUiStore((s) => s.selectLocation);
  return (
    <nav className="landmark-catalogue" aria-label="Circuit locations">
      <ul>
        {locations.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              className="landmark-chip"
              aria-pressed={selected === l.id}
              onClick={() => selectLocation(selected === l.id ? null : l.id)}
            >
              {l.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
