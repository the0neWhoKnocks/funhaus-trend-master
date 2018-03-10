import { h } from 'hyperapp';
import { formatAnswer } from '../utils';
import PanelNav from './PanelNav';
import resultsGraph from './resultsGraph';
import './TermResults.styl';

/**
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const TermResults = ({
  actions,
  state,
}) => {
  const terms = Object.keys(state.teams).map(key =>
    formatAnswer(state.terms[state.termNdx], state.teams[key].answers[state.termNdx])
  );
  const team1 = state.teams['1'];
  const team2 = state.teams['2'];
  const graphId = 'trendsPlaceholder';

  async function getData(){ // eslint-disable-line
    const widgetData = await fetch(`${ window.appData.endpoints.get.WIDGET_DATA }/${ terms.join(',') }`)
      .then(resp => resp.json());
    const graphData = widgetData.data;

    if( graphData ){
      const latestNdx = graphData[0].length-1;
      team1.points[state.termNdx] = graphData[0][latestNdx];
      team2.points[state.termNdx] = graphData[1][latestNdx];
      actions.results.setGraphData(graphData);
    }else{
      team1.points[state.termNdx] = 0;
      team2.points[state.termNdx] = 0;
    }

    actions.results.setPointsSaved(true);
  }

  function onCreate(){ // eslint-disable-line
    if( state.results.pointsSaved ){
      actions.results.setGraphData(undefined);
      actions.results.setPointsSaved(false);
    }

    getData();
  }

  function onGraphResults(){ // eslint-disable-line
    const el = document.querySelector('.js-points');
    if(el) el.classList.add('is--visible');
  }

  function onUpdate(){ // eslint-disable-line
    if( state.results.pointsSaved ){
      resultsGraph({
        elId: graphId,
        graphData: state.results.graphData,
        onAnimationComplete: onGraphResults,
        terms,
      });
    }
  }

  function determineNextView(){ // eslint-disable-line
    return ( state.termNdx + 1 > state.terms.length-1 )
      ? state.views[state.viewTypes.FINAL_SCORE]
      : state.views[state.viewTypes.TERM];
  }

  function preNext(){ // eslint-disable-line
    if( state.termNdx !== state.terms.length-1 ) actions.setTermNdx(state.termNdx+1);
    return actions.results.getPointsSaved();
  }

  let winner, winningTerm, loser, losingTerm;
  if( state.results.pointsSaved ){
    const team1Points = team1.points[state.termNdx];
    const team2Points = team2.points[state.termNdx];

    if( team1Points >= team2Points ){
      winner = team1;
      winningTerm = terms[0];
      loser = team2;
      losingTerm = terms[1];
    }else{
      winner = team2;
      winningTerm = terms[1];
      loser = team1;
      losingTerm = terms[0];
    }
  }

  return (
    <div
      key="termResults"
      class="term-results"
      oncreate={ onCreate }
      onupdate={ onUpdate }
    >
      <div class="term-results__graph">
        { state.results.pointsSaved && ([
          <div class="term-results__graph-points js-points">
            <div>
              <span class={`is--${ winner.id }`}>{ `"${ winningTerm }"` }</span> { `${ winner.points[state.termNdx] } points` }
            </div>
            <div>
              <span class={`is--${ loser.id }`}>{ `"${ losingTerm }"` }</span> { `${ loser.points[state.termNdx] } points` }
            </div>
          </div>,
          <div id={ graphId }></div>,
        ])}
        { !state.results.pointsSaved && ([
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAH0CAQAAAAEIc+mAAAGW0lEQVR42u3VMQ0AAAzDsJU/6VHoW8mGkCc5AGBeJAAAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEOXAAAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADF0CADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdAkAwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQJQAAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEOXAAAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0ADB0AMDQAQBDBwAMHQAMHQAwdADA0AEAQwcAQwcADB0AMHQAwNABwNABAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcADB0ADB0AMHQAwNABAEMHAEMHAAwdADB0AMDQAcDQAQBDBwAMHQAwdAAwdADA0AEAQwcAOg9iFgH16tHopAAAAABJRU5ErkJggg==" />,
          <div class="term-results__loading"> Loading Results</div>,
        ])}
      </div>
      <PanelNav
        actions={ actions }
        nextView={ determineNextView }
        preNextView={ preNext }
        prevView={ state.views[state.viewTypes.TERM] }
        state={ state }
      />
    </div>
  );
};
TermResults.isView = true;

export default TermResults;
