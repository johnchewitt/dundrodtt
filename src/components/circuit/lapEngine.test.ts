import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LapEngine, type CameraAdapter, type LapStop } from './lapEngine';

const stops: LapStop[] = [
  { locId: 'loc-deers-leap', seq: 2 },
  { locId: 'loc-cochranstown', seq: 1 },
  { locId: 'loc-tornagrough', seq: 3 },
];

function makeCamera(): CameraAdapter & { visits: string[]; released: boolean } {
  const cam = {
    visits: [] as string[],
    released: false,
    async goToStop(locId: string) {
      cam.visits.push(locId);
    },
    release() {
      cam.released = true;
    },
  };
  return cam;
}

describe('LapEngine', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('visits stops in seq order with dwells, then finishes', async () => {
    const camera = makeCamera();
    const states: string[] = [];
    const engine = new LapEngine(
      stops,
      camera,
      { onStop: () => {}, onStateChange: (s) => states.push(s) },
      { dwellMs: 1000, reduceMotion: true },
    );
    engine.play();
    await vi.advanceTimersByTimeAsync(3500);
    expect(camera.visits).toEqual([
      'loc-cochranstown',
      'loc-deers-leap',
      'loc-tornagrough',
    ]);
    expect(engine.currentState).toBe('finished');
    expect(states).toContain('dwelling');
  });

  it('pause holds position; play resumes; skip advances', async () => {
    const camera = makeCamera();
    const engine = new LapEngine(
      stops,
      camera,
      { onStop: () => {}, onStateChange: () => {} },
      { dwellMs: 1000, reduceMotion: true },
    );
    engine.play();
    await vi.advanceTimersByTimeAsync(10);
    engine.pause();
    await vi.advanceTimersByTimeAsync(5000);
    expect(camera.visits).toEqual(['loc-cochranstown']); // held
    engine.skip();
    await vi.advanceTimersByTimeAsync(10);
    expect(camera.visits).toEqual(['loc-cochranstown', 'loc-deers-leap']);
  });

  it('exit releases the camera and returns to idle', async () => {
    const camera = makeCamera();
    const engine = new LapEngine(
      stops,
      camera,
      { onStop: () => {}, onStateChange: () => {} },
      { dwellMs: 1000, reduceMotion: true },
    );
    engine.play();
    await vi.advanceTimersByTimeAsync(10);
    engine.exit();
    expect(engine.currentState).toBe('idle');
    expect(camera.released).toBe(true);
    await vi.advanceTimersByTimeAsync(5000);
    expect(camera.visits).toEqual(['loc-cochranstown']); // nothing after exit
  });

  it('restart returns to the first stop', async () => {
    const camera = makeCamera();
    const engine = new LapEngine(
      stops,
      camera,
      { onStop: () => {}, onStateChange: () => {} },
      { dwellMs: 1000, reduceMotion: true },
    );
    engine.play();
    await vi.advanceTimersByTimeAsync(1100); // at second stop
    engine.restart();
    await vi.advanceTimersByTimeAsync(10);
    expect(camera.visits.at(-1)).toBe('loc-cochranstown');
  });
});
