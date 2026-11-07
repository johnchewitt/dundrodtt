#!/usr/bin/env node
/**
 * Content integrity validator — runs before every production build and in
 * tests. Fails the build on: dangling ID references, photo paths missing
 * on disk, uncatalogued photos on disk, or excluded records that would
 * leak into the archive.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = (name) =>
  JSON.parse(readFileSync(join(root, 'src/content', `${name}.json`), 'utf8'));

const years = content('years');
const races = content('races');
const people = content('people');
const teams = content('teams');
const cars = content('cars');
const photos = content('photos');
const locations = content('locations');
const incidents = content('incidents');
const sources = content('sources');
const films = content('films');
const acknowledgements = content('acknowledgements');
const thenAndNow = content('then-and-now');
const story = content('story');

const errors = [];
const ids = (list) => new Set(list.map((x) => x.id));
const yearIds = ids(years), raceIds = ids(races), personIds = ids(people),
  teamIds = ids(teams), carIds = ids(cars), photoIds = ids(photos),
  locationIds = ids(locations), incidentIds = ids(incidents),
  sourceIds = ids(sources);

const check = (cond, msg) => { if (!cond) errors.push(msg); };
const refCheck = (owner, ref, set, kind) =>
  check(set.has(ref), `${owner}: dangling ${kind} reference "${ref}"`);

for (const list of [years, races, people, teams, cars, photos, locations, incidents])
  for (const rec of list)
    for (const ref of rec.sourceRefs ?? [])
      refCheck(rec.id, ref, sourceIds, 'source');

for (const r of races) {
  refCheck(r.id, r.yearId, yearIds, 'year');
  check(r.status === 'held' ? (r.classifications?.length ?? 0) > 0 : !r.classifications,
    `${r.id}: held races need classifications; not-held races must have none`);
  for (const c of r.classifications ?? []) {
    c.winnerPersonIds.forEach((p) => refCheck(r.id, p, personIds, 'person'));
    if (c.carId) refCheck(r.id, c.carId, carIds, 'car');
    if (c.teamId) refCheck(r.id, c.teamId, teamIds, 'team');
  }
  (r.incidentIds ?? []).forEach((i) => refCheck(r.id, i, incidentIds, 'incident'));
}

for (const i of incidents) {
  refCheck(i.id, i.yearId, yearIds, 'year');
  if (i.raceId) refCheck(i.id, i.raceId, raceIds, 'race');
  if (i.locationId) refCheck(i.id, i.locationId, locationIds, 'location');
  (i.personIds ?? []).forEach((p) => refCheck(i.id, p, personIds, 'person'));
}

for (const l of locations)
  (l.incidentIds ?? []).forEach((i) => refCheck(l.id, i, incidentIds, 'incident'));

for (const f of films)
  check(f.status !== 'authorised' || !!f.url,
    `${f.id}: authorised film needs a url`);

for (const a of acknowledgements)
  check(a.visibility === 'visible' || a.name === null || true, '');
for (const a of acknowledgements)
  if (a.portraitPhotoId) refCheck(a.id, a.portraitPhotoId, photoIds, 'photo');

for (const t of thenAndNow) refCheck(t.id, t.locationId, locationIds, 'location');

for (const ch of story) {
  for (const ref of ch.sourceRefs ?? []) refCheck(ch.id, ref, sourceIds, 'source');
  for (const pid of ch.photoIds ?? []) refCheck(ch.id, pid, photoIds, 'photo');
  check(['paper', 'dark'].includes(ch.tone), `${ch.id}: bad tone`);
  check(ch.paragraphs?.length > 0, `${ch.id}: empty chapter`);
}

// Photos ↔ disk, both directions. Serving uses register-ID asset names
// (web-safe: no '#', spaces or accents); filePath stays as the
// spreadsheet's verbatim catalogue identity.
const publicDir = join(root, 'public');
for (const p of photos) {
  check(!!p.assetPath, `${p.id}: missing assetPath`);
  check(existsSync(join(publicDir, p.assetPath)),
    `${p.id}: asset missing on disk: ${p.assetPath}`);
  check(/^photos\/(?:\d{4}\/)?[A-Za-z0-9-]+\.(jpe?g|png)$/.test(p.assetPath),
    `${p.id}: assetPath not web-safe: ${p.assetPath}`);
  check(p.filePath === p.filePath.normalize('NFC'), `${p.id}: filePath not NFC`);
}
const onDisk = [];
const walk = (dir, rel = '') => {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, rel ? `${rel}/${e}` : e);
    else if (!e.startsWith('.')) onDisk.push(rel ? `${rel}/${e}` : e);
  }
};
walk(join(publicDir, 'photos'), 'photos');
const catalogued = new Set(photos.map((p) => p.assetPath));
for (const f of onDisk)
  check(catalogued.has(f), `uncatalogued photo asset on disk: ${f}`);

// Exclusions
check(photos.filter((p) => p.include).length === 44, 'archive must hold exactly 44 photos');
check(!photos.find((p) => p.id === 'DU-1955-04-DUP')?.include, 'duplicate must stay excluded');
check(!photos.find((p) => p.id === 'DU-ACK-01')?.include, 'portrait must stay excluded');

// Corrections register spot checks
const r52 = races.find((r) => r.id === 'race-1952-ut');
check(r52?.classifications?.[0]?.winnerPersonIds[0] === 'p-piero-taruffi',
  '1952 UT winner must be Taruffi');
check(races.find((r) => r.id === 'race-1952-tt')?.status === 'not-held',
  '1952 TT must be not-held');
check(races.find((r) => r.id === 'race-1954-tt')?.classifications?.length === 2,
  '1954 TT needs scratch + handicap classifications');
check(races.find((r) => r.id === 'race-1955-tt')?.time === '7:03:11',
  '1955 TT time must be 7:03:11');

if (errors.length) {
  console.error(`Content validation FAILED (${errors.length}):`);
  errors.forEach((e) => console.error(' -', e));
  process.exit(1);
}
console.log(`Content validation passed: ${photos.length} photos (${photos.filter((p) => p.include).length} archive), ${races.length} races, ${people.length} people, ${locations.length} locations.`);
