import { h } from 'hyperapp';
import { secsToTime } from '../utils';
import './Timer.styl';

/**
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const Timer = ({
  actions,
  duration=30,
  state,
}) => {
  function incTime(dur){ // eslint-disable-line
    const timeout = setTimeout(() => {
      dur -= 1;

      if( dur === 0 ){
        actions.timer.setTime(secsToTime(duration));
        actions.timer.setRunning(false);
      }else{
        actions.timer.setTime(secsToTime(dur));
        incTime(dur);
      }
    }, 1000);
    actions.timer.setTimeout(timeout);
  }

  function startTimer(){ // eslint-disable-line
    incTime(duration);
    actions.timer.setRunning(true);
  }

  function stopTimer(){ // eslint-disable-line
    actions.timer.stop(actions);
  }

  function onCreate(){ // eslint-disable-line
    actions.timer.setTime(`${ secsToTime(duration) }`);
  }

  return (
    <div
      key="timer"
      class="timer"
      oncreate={ onCreate }
    >
      <div class="timer__display">{ state.timer.time }</div>
      { state.timer.running && (
        <button
          class="timer__btn"
          onclick={ stopTimer }
        >Stop</button>
      )}
      { !state.timer.running && (
        <button
          class="timer__btn"
          onclick={ startTimer }
        >Start</button>
      )}
    </div>
  );
};

export default Timer;
