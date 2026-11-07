import { useState } from 'react';
import { arcgisSettings } from '../../config/appSettings';
import Unavailable from '../ui/Unavailable';

export interface LapControlsState {
  state: 'idle' | 'flying' | 'dwelling' | 'paused' | 'finished';
  stopIndex: number;
  total: number;
}

/**
 * "Take a Lap of Dundrod" — entry point and controls. The lap itself
 * needs the owner's verified circuit layer (camera moves along real
 * geometry only); until the layer is configured this explains itself
 * honestly instead of pretending.
 */
export function TakeALap({
  onPlay,
  onPause,
  onSkip,
  onRestart,
  onExit,
  controls,
}: {
  onPlay?: () => void;
  onPause?: () => void;
  onSkip?: () => void;
  onRestart?: () => void;
  onExit?: () => void;
  controls?: LapControlsState;
}) {
  const [explain, setExplain] = useState(false);
  const mapReady = Boolean(arcgisSettings.routeLayerUrl);

  if (!mapReady) {
    return (
      <div className="take-a-lap">
        <button
          type="button"
          className="cta cta-ghost"
          aria-expanded={explain}
          onClick={() => setExplain((v) => !v)}
        >
          Take a Lap of Dundrod
        </button>
        {explain && (
          <Unavailable title="The guided lap is nearly ready">
            The lap flies the camera around the verified 1950s course,
            pausing at its named places — so it waits for the accurate
            circuit map rather than inventing the route. It switches on
            the moment the circuit layer is supplied.
          </Unavailable>
        )}
      </div>
    );
  }

  const running =
    controls && controls.state !== 'idle' && controls.state !== 'finished';
  return (
    <div className="take-a-lap" role="group" aria-label="Guided lap controls">
      {!running ? (
        <button type="button" className="cta" onClick={onPlay}>
          {controls?.state === 'finished' ? 'Lap again' : 'Take a Lap of Dundrod'}
        </button>
      ) : (
        <>
          <span className="muted" aria-live="polite">
            Stop {controls.stopIndex + 1} of {controls.total}
          </span>
          {controls.state === 'paused' ? (
            <button type="button" className="menu-button" onClick={onPlay}>
              Play
            </button>
          ) : (
            <button type="button" className="menu-button" onClick={onPause}>
              Pause
            </button>
          )}
          <button type="button" className="menu-button" onClick={onSkip}>
            Skip
          </button>
          <button type="button" className="menu-button" onClick={onRestart}>
            Restart
          </button>
          <button type="button" className="menu-button" onClick={onExit}>
            Exit
          </button>
        </>
      )}
    </div>
  );
}
