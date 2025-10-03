import { useState, useEffect } from 'react';
import { CONTROLS } from '../../utils/constants';

export function useKeyboardControls() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    fire: false,
    pause: false
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case CONTROLS.MOVE_FORWARD:
          setKeys(prev => ({ ...prev, forward: true }));
          break;
        case CONTROLS.MOVE_BACKWARD:
          setKeys(prev => ({ ...prev, backward: true }));
          break;
        case CONTROLS.MOVE_LEFT:
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case CONTROLS.MOVE_RIGHT:
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case CONTROLS.FIRE:
          setKeys(prev => ({ ...prev, fire: true }));
          event.preventDefault(); // Evitar scroll con spacebar
          break;
        case CONTROLS.PAUSE:
          setKeys(prev => ({ ...prev, pause: true }));
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case CONTROLS.MOVE_FORWARD:
          setKeys(prev => ({ ...prev, forward: false }));
          break;
        case CONTROLS.MOVE_BACKWARD:
          setKeys(prev => ({ ...prev, backward: false }));
          break;
        case CONTROLS.MOVE_LEFT:
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case CONTROLS.MOVE_RIGHT:
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case CONTROLS.FIRE:
          setKeys(prev => ({ ...prev, fire: false }));
          break;
        case CONTROLS.PAUSE:
          setKeys(prev => ({ ...prev, pause: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { keys };
}