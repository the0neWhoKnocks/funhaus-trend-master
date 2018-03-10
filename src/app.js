import { app } from 'hyperapp';
import actions from './actions';
import {
  formatAnswer,
  getParam,
  secsToTime,
} from './utils';
import Shell from './components/Shell';
import EnterTerms from './components/EnterTerms';
import FinalScore from './components/FinalScore';
import PanelNav from './components/PanelNav';
import Term from './components/Term';
import TermResults from './components/TermResults';
import './app.styl';

// https://trends.google.com/trends/explore?q=zip,zipper
// choose embed for example code

/*
1. orange & blue are teams
  - team names decided by first query
2. display team names at bottom of each colored panel, base search term in center
3. embed trends after query entered
  - have input above trends to allow them to enter more terms if they want
4. display score next to team names - points accumulate based on trends
5. on input of answers, have input on either side so it can be paired in any way
6. allow for skipping some terms, in case time is running low.
  - just display those terms as N/A in the results table.
*/

const viewTypes = {
  ENTER_TERMS: 'enterTerms',
  FINAL_SCORE: 'finalScore',
  PANEL_NAV: 'panelNav',
  TERM: 'term',
  TERM_RESULTS: 'termResults',
};
const views = {
  [viewTypes.ENTER_TERMS]: EnterTerms,
  [viewTypes.FINAL_SCORE]: FinalScore,
  [viewTypes.PANEL_NAV]: PanelNav,
  [viewTypes.TERM]: Term,
  [viewTypes.TERM_RESULTS]: TermResults,
};
const state = {
  config: {
    colors: [
      '#f44336',
      '#4285f4',
    ],
    pointMultiplier: 5, // multiply points for current losers on last round
  },
  nav: {
    globalKeyHandler: undefined,
  },
  results: {
    graphData: undefined,
    pointsSaved: false,
  },
  teams: {
    '1': {
      id: 'team1',
      answers: [],
      points: [],
    },
    '2': {
      id: 'team2',
      answers: [],
      points: [],
    },
  },
  termNdx: 0,
  terms: [],
  timer: {
    duration: 30,
    running: false,
    time: secsToTime(30),
    timeout: undefined,
  },
  view: views[viewTypes.ENTER_TERMS],
  viewTypes,
  views,
};
const team1 = state.teams['1'];
const team2 = state.teams['2'];
const viewOverride = getParam('view');
const isDemo = getParam('demo');

state.view = (viewOverride)
  ? views[viewOverride]
  : views[viewTypes.ENTER_TERMS];

/**
 * Sets up all the mock data for development work
 */
function setupAllData(){
  state.terms = ['Coin', 'Block', 'Farm', 'Regulation', 'Payment', 'Mining', 'Hold', 'Chain'];

  team1.answers = ['Puss _', 'Twitter _', 'Gold _', 'Porn _', 'Bitcoin _', 'Money _', 'Choke _', 'Daisy _'];
  team1.name = formatAnswer(state.terms[state.termNdx], team1.answers[state.termNdx]);

  team2.answers = ['Free _', 'Facebook _', 'Sex _', 'Gun _', 'Car _', 'Data _', '_ Hands', 'Email _'];
  team2.name = formatAnswer(state.terms[state.termNdx], team2.answers[state.termNdx]);
}

if( isDemo !== undefined ) setupAllData();

if( viewOverride ){
  switch(viewOverride){
    case viewTypes.TERM:
    case viewTypes.TERM_RESULTS:
      setupAllData();
      break;

    case viewTypes.FINAL_SCORE:
      setupAllData();
      team1.points = [25, 25, 25, 2, 2, 2, 2, 100];
      team2.points = [25, 25, 25, 25, 25, 25, 25, 25];
      break;
  }

  if( !state.view ){
    console.warn(`'${ viewOverride }' isn't a valid view type, using default`);
    state.view = views[viewTypes.ENTER_TERMS];
  }
}

app(state, actions, Shell, document.querySelector('#shell'));
