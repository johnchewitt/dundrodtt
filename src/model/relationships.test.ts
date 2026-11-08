import { describe, expect, it } from 'vitest';
import { people, personById, races } from './content';
import {
  appearancesOf,
  dundrodYearsOf,
  locationsOf,
  photosOf,
  winsOf,
} from './relationships';

describe('derived relationships (Stage 5)', () => {
  it('Moss has exactly his three TT wins in the winning record', () => {
    const wins = winsOf('p-stirling-moss');
    const ids = wins.map((w) => w.race.id).sort();
    expect(ids).toEqual(['race-1950-tt', 'race-1951-tt', 'race-1955-tt']);
  });

  it('documented appearances all resolve to real races with sources', () => {
    for (const p of people) {
      for (const { race, appearance } of appearancesOf(p)) {
        expect(races.some((r) => r.id === race.id)).toBe(true);
        expect(appearance.sourceRefs.length).toBeGreaterThan(0);
      }
    }
  });

  it('Titterington years span his documented record', () => {
    const t = personById.get('p-desmond-titterington')!;
    const years = dundrodYearsOf(t);
    expect(years).toContain(1954); // photographed with the Ferrari
    expect(years).toContain(1955); // Ulster Trophy win + TT D-Type
  });

  it('incident-based place links stay verified', () => {
    expect(locationsOf('p-jim-mayers')).toEqual(['loc-deers-leap']);
    expect(locationsOf('p-richard-mainwaring')).toEqual(['loc-tornagrough']);
    expect(locationsOf('p-stirling-moss')).toEqual([]);
  });

  it('local heroes are exactly the two Northern Ireland drivers', () => {
    const heroes = people.filter((p) => p.localHero).map((p) => p.id).sort();
    expect(heroes).toEqual(['p-bobby-baird', 'p-desmond-titterington']);
  });

  it('every person photo link resolves both ways', () => {
    for (const p of people) {
      for (const photo of photosOf(p.id)) {
        expect(photo.personIds).toContain(p.id);
      }
    }
  });
});
