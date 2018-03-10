import { h } from 'hyperapp';
import { getEls } from '../utils';
import PanelNav from './PanelNav';
import Timer from './Timer';
import './Term.styl';

/**
 * The place where you enter all the terms you want search for.
 *
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const Term = ({
  actions,
  state,
}) => {
  const teams = Object.keys(state.teams).map(key => state.teams[key]);
  const team1 = teams[0];
  const team2 = teams[1];
  const term = state.terms[state.termNdx];
  let topTeam, btmTeam;

  const t1Points = ( team1.points.length )
    ? team1.points.reduce((total, curr) => (curr) ? total + curr : total)
    : 0;
  const t2Points = ( team2.points.length )
    ? team2.points.reduce((total, curr) => (curr) ? total + curr : total)
    : 0;

  if( t1Points >= t2Points ){
    topTeam = team1;
    btmTeam = team2;
  }else{
    topTeam = team2;
    btmTeam = team1;
  }

  function preNext(){ // eslint-disable-line
    const answerEls = getEls('.js-teamAnswer');
    const allAnswered = answerEls.every(el => el.value.trim() !== '');

    if( !allAnswered ){
      alert("All teams haven't answered.");
      return false;
    }

    actions.setAnswers(answerEls.map(el => el.value));
    if( actions.timer.getRunning() ) actions.timer.stop(actions);

    return true;
  }

  function determinePrevView(){ // eslint-disable-line
    return ( state.termNdx - 1 < 0 )
      ? state.views[state.viewTypes.ENTER_TERMS]
      : state.views[state.viewTypes.TERM_RESULTS];
  }

  function prePrev(){ // eslint-disable-line
    if( state.termNdx !== 0 ) actions.setTermNdx(state.termNdx-1);
    if( actions.timer.getRunning() ) actions.timer.stop(actions);

    return true;
  }

  const teamPoints = team => { // eslint-disable-line
    if( !team.points.length ) return null;
    return (
      <div class="term-panel__team-points">
        { team.points.slice(0, state.termNdx+1).reduce((total, curr) => (curr) ? total + curr : total) }
      </div>
    );
  };

  const teamInfo = team => { // eslint-disable-line
    if( !team.name ) return '';
    return (
      <div class="term-panel__team-info">
        <div class="term-panel__team-name">{ team.name }</div>
        { teamPoints(team) }
      </div>
    );
  };

  return (
    <div
      key="term"
      class="term-panel"
    >
      <div class={`term-panel__top-divide is--${ topTeam.id }`}>
        { teamInfo(topTeam) }
      </div>
      <div class={`term-panel__btm-divide is--${ btmTeam.id }`}>
        { teamInfo(btmTeam) }
      </div>
      <div class="term-panel__answers">
        <input
          class="is--team1 js-teamAnswer"
          type="text"
          name="team1Answer"
          placeholder="_ TERM or TERM _"
          value={ teams[0].answers[state.termNdx] }
          oncreate={ inputRef => inputRef.focus() }
        />
        <input
          class="is--team2 js-teamAnswer"
          type="text"
          name="team2Answer"
          placeholder="_ TERM or TERM _"
          value={ teams[1].answers[state.termNdx] }
        />
      </div>
      <div class="term-panel__center-divide">
        { term }
        <Timer
          actions={ actions }
          duration={ state.timer.duration }
          state={ state }
        />
        <PanelNav
          actions={ actions }
          preNextView={ preNext }
          nextView={ state.views[state.viewTypes.TERM_RESULTS] }
          prePrevView={ prePrev }
          prevView={ determinePrevView }
          state={ state }
        />
      </div>
    </div>
  );
};
Term.isView = true;

export default Term;
