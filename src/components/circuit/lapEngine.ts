/**
 * Guided-lap engine for "Take a Lap of Dundrod".
 *
 * Pure sequencing logic, independent of ArcGIS: the map supplies a
 * CameraAdapter and the engine walks the ordered landmark stops —
 * controlled camera movement with a dwell at each stop, never a racing
 * simulation. Reduced motion collapses camera flights to instant jumps.
 */

export interface LapStop {
  /** CircuitLocation.id — joins to editorial content. */
  locId: string;
  /** Order around the clockwise lap (the layer's `seq` field). */
  seq: number;
}

export interface CameraAdapter {
  /** Move the camera to a stop; resolve when the flight completes. */
  goToStop(locId: string, options: { animate: boolean }): Promise<void>;
  /** Called when the lap exits, for any cleanup/highlight removal. */
  release(): void;
}

export interface LapCallbacks {
  /** A stop is reached (camera arrived, dwell begins). */
  onStop: (stop: LapStop, stopIndex: number, total: number) => void;
  /** Lap state changed (for control UIs). */
  onStateChange: (state: LapState) => void;
}

export type LapState = 'idle' | 'flying' | 'dwelling' | 'paused' | 'finished';

export interface LapOptions {
  /** How long to hold on each stop, ms. */
  dwellMs?: number;
  /** Reduced motion: no animated flights. */
  reduceMotion?: boolean;
}

export class LapEngine {
  private stops: LapStop[];
  private camera: CameraAdapter;
  private cb: LapCallbacks;
  private dwellMs: number;
  private animate: boolean;

  private index = -1;
  private state: LapState = 'idle';
  private dwellTimer: ReturnType<typeof setTimeout> | null = null;
  private generation = 0;

  constructor(
    stops: LapStop[],
    camera: CameraAdapter,
    callbacks: LapCallbacks,
    options: LapOptions = {},
  ) {
    this.stops = [...stops].sort((a, b) => a.seq - b.seq);
    this.camera = camera;
    this.cb = callbacks;
    this.dwellMs = options.dwellMs ?? 9000;
    this.animate = !(options.reduceMotion ?? false);
  }

  get currentState(): LapState {
    return this.state;
  }

  get currentIndex(): number {
    return this.index;
  }

  get total(): number {
    return this.stops.length;
  }

  play(): void {
    if (this.state === 'paused' && this.index >= 0) {
      this.setState('dwelling');
      this.armDwell();
      return;
    }
    if (this.state === 'idle' || this.state === 'finished') {
      void this.flyTo(0);
    }
  }

  pause(): void {
    if (this.state === 'dwelling' || this.state === 'flying') {
      this.clearDwell();
      this.generation++; // cancels an in-flight goTo continuation
      this.setState('paused');
    }
  }

  skip(): void {
    if (this.index + 1 < this.stops.length) {
      void this.flyTo(this.index + 1);
    } else {
      this.finish();
    }
  }

  restart(): void {
    void this.flyTo(0);
  }

  exit(): void {
    this.clearDwell();
    this.generation++;
    this.index = -1;
    this.setState('idle');
    this.camera.release();
  }

  private async flyTo(index: number): Promise<void> {
    this.clearDwell();
    const gen = ++this.generation;
    this.index = index;
    this.setState('flying');
    await this.camera.goToStop(this.stops[index].locId, {
      animate: this.animate,
    });
    if (gen !== this.generation) return; // paused/exited mid-flight
    this.cb.onStop(this.stops[index], index, this.stops.length);
    this.setState('dwelling');
    this.armDwell();
  }

  private armDwell(): void {
    this.clearDwell();
    this.dwellTimer = setTimeout(() => {
      if (this.index + 1 < this.stops.length) void this.flyTo(this.index + 1);
      else this.finish();
    }, this.dwellMs);
  }

  private clearDwell(): void {
    if (this.dwellTimer) clearTimeout(this.dwellTimer);
    this.dwellTimer = null;
  }

  private finish(): void {
    this.clearDwell();
    this.setState('finished');
  }

  private setState(state: LapState): void {
    this.state = state;
    this.cb.onStateChange(state);
  }
}
