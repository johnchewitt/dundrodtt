import SectionRail from './ui/SectionRail';
import { years } from '../model/content';

/** Sticky season jump-rail for the Six Racing Seasons timeline. */
export default function SeasonRail() {
  return (
    <SectionRail
      ariaLabel="Jump to a season"
      routePath="/seasons"
      items={years.map((y) => ({ id: y.id, label: String(y.year) }))}
    />
  );
}
