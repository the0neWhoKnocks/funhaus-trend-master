import { h } from 'hyperapp';
import { formatAnswer } from '../utils';
import PanelNav from './PanelNav';
import './TermResults.styl';

/**
 * The place where you enter all the terms you want search for.
 *
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const TermResults = ({
  actions,
  state,
}) => {
  const terms = Object.keys(state.teams).map(key =>
    formatAnswer(state.terms[state.termNdx], state.teams[key].answers[state.termNdx])
  ).reverse(); // reverse to keep colors
  const arg2 = {
    comparisonItem: terms.map(query => ({
      keyword: query,
      geo: '',
      time: 'today 12-m',
    })),
    category: 0,
    property: '',
  };
  const arg3 = {
    exploreQuery: `q=${ terms.join(',') }&date=today 12-m,today 12-m`,
    guestPath: 'https://trends.google.com:443/trends/embed/',
  };
  const team1 = state.teams['1'];
  const team2 = state.teams['2'];
  const graphId = 'trendsPlaceholder';

  async function getData(){ // eslint-disable-line
    const widgetData = await fetch(`${ window.appData.endpoints.get.WIDGET_DATA }/${ terms.join(',') }`)
      .then(resp => resp.json());

    // TODO - save points using actions
    if( widgetData.data ){
      widgetData.data.value.reverse();
      team1.points[state.termNdx] = widgetData.data.value[0];
      team2.points[state.termNdx] = widgetData.data.value[1];
    }else{
      team1.points[state.termNdx] = 0;
      team2.points[state.termNdx] = 0;
    }

    actions.setPointsSaved(true);

    console.log(widgetData);

    // Calling `renderExploreWidgetTo` from this context errors, but injecting
    // a script node works.
    const script = document.createElement('script');
    script.innerHTML = `
      window.trends.embed.renderExploreWidgetTo(
        document.getElementById('${ graphId }'),
        'TIMESERIES',
        ${ JSON.stringify(arg2).replace(/"/g, "'") },
        ${ JSON.stringify(arg3).replace(/"/g, "'") }
      );
    `;
    const placeholder = document.getElementById(graphId);
    placeholder.innerHTML = '';
    placeholder.appendChild(script);
  }

  async function onCreate(){ // eslint-disable-line
    if( state.pointsSaved ) actions.setPointsSaved(false);
    getData();
  }

  function determineNextView(){ // eslint-disable-line
    return ( state.termNdx + 1 > state.terms.length-1 )
      ? state.views[state.viewTypes.FINAL_SCORE]
      : state.views[state.viewTypes.TERM];
  }

  function preNext(){ // eslint-disable-line
    if( state.termNdx !== state.terms.length-1 ) actions.setTermNdx(state.termNdx+1);
    return state.pointsSaved;
  }

  return (
    <div
      key="termResults"
      class="term-results"
      oncreate={ onCreate }
    >
      <div class="term-results__graph" id={ graphId }>
        <div class="term-results__loading"> Loading Results</div>
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
