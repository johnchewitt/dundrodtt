/**
 * Typed access to the static JSON content in src/content/.
 * Facts live only in the JSON; components receive them through here.
 * Schema: docs/data-model.md. Integrity: scripts/validate-content.mjs.
 */

import yearsJson from '../content/years.json';
import racesJson from '../content/races.json';
import peopleJson from '../content/people.json';
import teamsJson from '../content/teams.json';
import carsJson from '../content/cars.json';
import photosJson from '../content/photos.json';
import locationsJson from '../content/locations.json';
import incidentsJson from '../content/incidents.json';
import sourcesJson from '../content/sources.json';
import filmsJson from '../content/films.json';
import acknowledgementsJson from '../content/acknowledgements.json';
import thenAndNowJson from '../content/then-and-now.json';
import storyJson from '../content/story.json';

export type EventKind = 'ulster-trophy' | 'rac-tt';
export type Award =
  | 'outright'
  | 'scratch'
  | 'handicap'
  | 'fastest-finisher'
  | 'handicap-champion-trophy';

export interface Year {
  id: string;
  year: number;
  summary: string;
  storyCue?: string;
  /** Stage 4 chapter heading, e.g. "Racing Comes to Dundrod". */
  chapterTitle: string;
  /** Photo register ID used as the chapter hero plate. */
  heroPhotoId: string;
  sourceRefs: string[];
}

export interface Classification {
  award: Award;
  winnerPersonIds: string[];
  carId?: string;
  teamId?: string;
  note?: string;
}

export interface Race {
  id: string;
  yearId: string;
  event: EventKind;
  status: 'held' | 'not-held';
  date?: string;
  laps?: number;
  time?: string;
  championship?: string;
  classifications?: Classification[];
  notHeldReason?: string;
  notes?: string;
  incidentIds?: string[];
  sourceRefs: string[];
}

export interface Person {
  id: string;
  name: string;
  /** Curated archive photograph shown on the profile card. */
  photoId?: string;
  role?: 'driver' | 'team-figure' | 'other';
  homePlace?: string;
  context?: string;
  sourceRefs: string[];
}

export interface Team {
  id: string;
  name: string;
  context?: string;
  sourceRefs: string[];
}

export interface Car {
  id: string;
  name: string;
  context?: string;
  sourceRefs: string[];
}

export interface Photo {
  id: string;
  /** The gallery spreadsheet's exact relative File path — catalogue identity, kept verbatim. */
  filePath: string;
  /** Served asset path under public/, named by register ID (web-safe). */
  assetPath: string;
  imageTitle: string | null;
  year: number | null;
  yearBasis: string | null;
  event: string | null;
  peopleNames: string[];
  /** IDs of catalogued people unambiguously matched from peopleNames (hedged names keep their hedge in display). */
  personIds: string[];
  carSubject: string | null;
  raceNumber: string | null;
  caption: string | null;
  altText: string | null;
  tags: string[];
  include: boolean;
  /** Internal editorial note — never rendered. */
  reviewNote: string | null;
  special1950: boolean;
  width: number;
  height: number;
  sourceRefs: string[];
}

export interface CircuitLocation {
  id: string;
  name: string;
  story?: string;
  incidentIds?: string[];
  photoIds?: string[];
  mapFeatureId?: string;
  /**
   * Confidence: the historic name is verified from period sources.
   * 'pending' — no map position yet (never an invented pin);
   * 'provisional' — placed on the verified route from period/owner maps
   * and route geometry, awaiting survey-grade confirmation;
   * 'verified' — confirmed against authoritative mapping.
   */
  geometryStatus: 'pending' | 'provisional' | 'verified';
  sourceRefs: string[];
}

export interface Incident {
  id: string;
  yearId: string;
  raceId?: string;
  locationId?: string;
  peopleNames: string[];
  personIds?: string[];
  text: string;
  sourceRefs: string[];
}

export interface Source {
  id: string;
  title: string;
  note?: string;
  kind: 'supplied' | 'verified-web';
}

export interface Film {
  id: string;
  title: string;
  status: 'unavailable' | 'authorised' | 'external';
  provider?: 'british-pathe' | 'ni-screen' | 'other';
  url?: string;
  date?: string;
  yearId?: string;
  sourceRef?: string;
  authorisationNote?: string;
}

export interface Acknowledgement {
  id: string;
  visibility: 'visible' | 'hidden';
  name: string | null;
  message: string;
  portraitPhotoId: string | null;
}

export interface ThenAndNow {
  id: string;
  locationId: string;
  status: 'awaiting-modern-photo' | 'complete';
  historicPhotoId?: string;
  modernAssetPath?: string;
  note?: string;
}

export interface StoryFigure {
  src: string;
  webp?: string;
  alt: string;
  caption: string;
  credit?: string;
  width: number;
  height: number;
}

export interface StoryChapter {
  id: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  photoIds: string[];
  /** Non-photographic figure (e.g. the period course map). */
  figure?: StoryFigure;
  link: { to: string; label: string } | null;
  sourceRefs: string[];
  tone: 'paper' | 'dark';
}

export const years = yearsJson as Year[];
export const storyChapters = storyJson as StoryChapter[];
export const races = racesJson as Race[];
export const people = peopleJson as Person[];
export const teams = teamsJson as Team[];
export const cars = carsJson as Car[];
export const photos = photosJson as Photo[];
export const locations = locationsJson as CircuitLocation[];
export const incidents = incidentsJson as Incident[];
export const sources = sourcesJson as Source[];
export const films = filmsJson as Film[];
export const acknowledgements = acknowledgementsJson as Acknowledgement[];
export const thenAndNow = thenAndNowJson as ThenAndNow[];

/** The 44-photo race archive (never the duplicate or the portrait). */
export const archivePhotos = photos.filter((p) => p.include);

export const byId = <T extends { id: string }>(list: T[]) =>
  new Map(list.map((item) => [item.id, item]));

export const personById = byId(people);
export const carById = byId(cars);
export const teamById = byId(teams);
export const yearById = byId(years);
export const photoById = byId(photos);
export const locationById = byId(locations);

/**
 * URL for a photo's served asset. Serving uses stable register-ID names
 * (web-safe on any static host); the spreadsheet's exact File path stays
 * in the catalogue as the record's identity.
 */
export function photoUrl(photo: Pick<Photo, 'assetPath'>): string {
  return import.meta.env.BASE_URL + photo.assetPath;
}
