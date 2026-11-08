import {
  archivePhotos,
  incidents,
  races,
  yearById,
  type Appearance,
  type Classification,
  type Person,
  type Race,
} from './content';

/**
 * Derived relationships between people, races, photographs and circuit
 * places. Everything here is computed from the verified catalogue —
 * nothing editorial lives in this module.
 */

export interface Win {
  race: Race;
  classification: Classification;
}

export function winsOf(personId: string): Win[] {
  const wins: Win[] = [];
  for (const race of races) {
    for (const c of race.classifications ?? []) {
      if (c.winnerPersonIds.includes(personId)) wins.push({ race, classification: c });
    }
  }
  return wins;
}

export function appearancesOf(person: Person): { race: Race; appearance: Appearance }[] {
  return (person.appearances ?? [])
    .map((appearance) => {
      const race = races.find((r) => r.id === appearance.raceId);
      return race ? { race, appearance } : null;
    })
    .filter((x): x is { race: Race; appearance: Appearance } => x !== null)
    .sort((a, b) => a.race.id.localeCompare(b.race.id));
}

export function photosOf(personId: string) {
  return archivePhotos.filter((p) => p.personIds.includes(personId));
}

export function incidentsOf(personId: string) {
  return incidents.filter((i) => (i.personIds ?? []).includes(personId));
}

/** Circuit places documented for a person (via incident records only). */
export function locationsOf(personId: string): string[] {
  return [
    ...new Set(
      incidentsOf(personId)
        .map((i) => i.locationId)
        .filter((l): l is string => !!l),
    ),
  ];
}

/** The Dundrod years a person is documented in: wins, appearances, photographs. */
export function dundrodYearsOf(person: Person): number[] {
  const years = new Set<number>();
  for (const { race } of winsOf(person.id)) {
    const y = yearById.get(race.yearId)?.year;
    if (y) years.add(y);
  }
  for (const { race } of appearancesOf(person)) {
    const y = yearById.get(race.yearId)?.year;
    if (y) years.add(y);
  }
  for (const p of photosOf(person.id)) if (p.year) years.add(p.year);
  for (const i of incidentsOf(person.id)) {
    const y = yearById.get(i.yearId)?.year;
    if (y) years.add(y);
  }
  return [...years].sort();
}

/** Races where a team appears in the winning classifications. */
export function racesOfTeam(teamId: string): Win[] {
  const out: Win[] = [];
  for (const race of races) {
    for (const c of race.classifications ?? []) {
      if (c.teamId === teamId) out.push({ race, classification: c });
    }
  }
  return out;
}

/** Races where a car appears in the winning classifications. */
export function racesOfCar(carId: string): Win[] {
  const out: Win[] = [];
  for (const race of races) {
    for (const c of race.classifications ?? []) {
      if (c.carId === carId) out.push({ race, classification: c });
    }
  }
  return out;
}

export const eventLabelOf: Record<Race['event'], string> = {
  'ulster-trophy': 'Ulster Trophy',
  'rac-tt': 'RAC Tourist Trophy',
};

export const awardLabelOf: Record<Classification['award'], string> = {
  outright: 'Winner',
  scratch: 'Scratch / championship winner',
  handicap: 'Handicap winner',
  'fastest-finisher': 'Winner (fastest finisher)',
  'handicap-champion-trophy': 'Champion Trophy winner (handicap)',
};
