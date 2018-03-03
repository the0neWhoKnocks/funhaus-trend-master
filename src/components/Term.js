import panelNav from './PanelNav';
import './Term.styl';

export default ({ state, teams, term }) => {
  let topTeam, btmTeam;

  const t1Points = ( teams[0].points.length )
    ? teams[0].points.reduce((total, curr) => total + curr)
    : 0;
  const t2Points = ( teams[1].points.length )
    ? teams[1].points.reduce((total, curr) => total + curr)
    : 0;

  if( t1Points >= t2Points ){
    topTeam = teams[0];
    btmTeam = teams[1];
  }else{
    topTeam = teams[1];
    btmTeam = teams[0];
  }

  const teamPoints = team => { // eslint-disable-line require-jsdoc
    if( !team.points.length ) return '';
    return `<div class="term-panel__team-points">${ team.points.reduce((total, curr) => total + curr) }</div>`;
  };

  const teamInfo = team => { // eslint-disable-line require-jsdoc
    if( !team.name ) return '';
    return `
      <div class="term-panel__team-info">
        <div class="term-panel__team-name">${ team.name }</div>
        ${ teamPoints(team) }
      </div>
    `;
  };

  return `
    <div class="term-panel">
      <div class="term-panel__top-divide is--${ topTeam.id }">
        ${ teamInfo(topTeam) }
      </div>
      <div class="term-panel__btm-divide is--${ btmTeam.id }">
        ${ teamInfo(btmTeam) }
      </div>
      <div class="term-panel__answers">
        <input
          class="is--team1"
          type="text"
          name="team1Answer"
          placeholder="_ TERM or TERM _"
          autofocus
        >
        <input
          class="is--team2"
          type="text"
          name="team1Answer"
          placeholder="_ TERM or TERM _"
        >
      </div>
      <div class="term-panel__center-divide">
        ${ term }
        ${ panelNav(state.panelNav) }
      </div>
    </div>
  `;
};
