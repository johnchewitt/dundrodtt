import { describe, expect, it } from 'vitest';
import {
  acknowledgements,
  archivePhotos,
  personById,
  photos,
  races,
} from './content';

describe('photo catalogue', () => {
  it('holds exactly 46 records with a 44-photo race archive', () => {
    expect(photos).toHaveLength(46);
    expect(archivePhotos).toHaveLength(44);
  });

  it('keeps the duplicate and the portrait out of the archive', () => {
    const ids = new Set(archivePhotos.map((p) => p.id));
    expect(ids.has('DU-1955-04-DUP')).toBe(false);
    expect(ids.has('DU-ACK-01')).toBe(false);
  });

  it('marks the rare 1950 photographs for special presentation', () => {
    const special = archivePhotos.filter((p) => p.special1950);
    expect(special.length).toBeGreaterThan(0);
    expect(special.every((p) => p.year === 1950)).toBe(true);
  });
});

describe('corrections register', () => {
  it('records Taruffi as the 1952 Ulster Trophy winner', () => {
    const r = races.find((x) => x.id === 'race-1952-ut')!;
    const winner = r.classifications![0].winnerPersonIds[0];
    expect(personById.get(winner)?.name).toBe('Piero Taruffi');
  });

  it('records the 1952 TT and 1954 Ulster Trophy as not held', () => {
    expect(races.find((x) => x.id === 'race-1952-tt')?.status).toBe('not-held');
    expect(races.find((x) => x.id === 'race-1954-ut')?.status).toBe('not-held');
  });

  it('keeps both 1954 TT classifications', () => {
    const r = races.find((x) => x.id === 'race-1954-tt')!;
    const awards = r.classifications!.map((c) => c.award).sort();
    expect(awards).toEqual(['handicap', 'scratch']);
  });

  it('keeps both 1955 Ulster Trophy awards distinct', () => {
    const r = races.find((x) => x.id === 'race-1955-ut')!;
    const awards = r.classifications!.map((c) => c.award).sort();
    expect(awards).toEqual(['fastest-finisher', 'handicap-champion-trophy']);
  });

  it('records the 1955 TT at 84 laps in 7:03:11', () => {
    const r = races.find((x) => x.id === 'race-1955-tt')!;
    expect(r.laps).toBe(84);
    expect(r.time).toBe('7:03:11');
  });
});

describe('acknowledgements', () => {
  it('keeps the second contributor hidden with no placeholder name', () => {
    const hidden = acknowledgements.find(
      (a) => a.id === 'ack-1950-contributor',
    )!;
    expect(hidden.visibility).toBe('hidden');
    expect(hidden.name).toBeNull();
  });
});
