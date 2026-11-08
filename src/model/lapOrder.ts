/**
 * The clockwise lap order of the circuit landmarks, seq 1–14, matching
 * public/circuit/landmarks.geojson (unit-tested against it). The lap —
 * like every race — begins at the start and finish line.
 */
export const lapOrder: string[] = [
  'loc-start-finish',
  'loc-rushyhill',
  'loc-leathemstown-corner',
  'loc-leathemstown-bridge',
  'loc-deers-leap',
  'loc-cochranstown',
  'loc-quarterland',
  'loc-irelands-corner',
  'loc-budore',
  'loc-jordans-cross',
  'loc-wheelers-corner',
  'loc-tornagrough',
  'loc-1950s-hairpin',
  'loc-the-quarry',
];

export function lapNeighbours(locId: string): {
  previous: string | null;
  next: string | null;
} {
  const i = lapOrder.indexOf(locId);
  if (i === -1) return { previous: null, next: null };
  return {
    previous: lapOrder[(i + lapOrder.length - 1) % lapOrder.length],
    next: lapOrder[(i + 1) % lapOrder.length],
  };
}
