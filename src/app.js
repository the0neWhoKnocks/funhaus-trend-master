import {
  formatAnswer,
} from './utils';
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
*/

const els = {};
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
  // multiply points for current losers on last round
  finalMultiplier: 5,
  nav: {
    prev: [],
  },
  teams: {
    '1': {
      id: 'team1',
      answers: ['Puss _', 'Twitter _', 'Gold _', 'Porn _', 'Bitcoin _', 'Money _', 'Choke _', 'Daisy _'],
      points: [],
    },
    '2': {
      id: 'team2',
      answers: ['Free _', 'Facebook _', 'Sex _', 'Gun _', 'Car _', 'Data _', '_ Hands', 'Email _'],
      points: [],
    },
  },
  termNdx: 0,
  terms: [
    'Coin',
    'Block',
    'Farm',
    'Regulation',
    'Payment',
    'Mining',
    'Hold',
    'Chain',
  ],
};
const team1 = state.teams['1'];
const team2 = state.teams['2'];

function setupNav(prevView, nextView, onPreNext){
  els.prevPanelBtn = document.querySelector('#prevBtn');
  els.nextPanelBtn = document.querySelector('#nextBtn');

  if( state.nav.prev.length ){
    els.prevPanelBtn.addEventListener('click', () => {
      const prev = state.nav.prev[state.nav.prev.length-1];

      state.nav.prev.pop();
      prev();
    });
  }

  els.nextPanelBtn.addEventListener('click', () => {
    state.nav.prev.push(render.bind(null, prevView));

    if( onPreNext ) onPreNext();

    render(nextView);
  });
}

function render(viewName){
  let navModifier, viewOpts, nextView, onPreNext;

  switch(viewName){
    case viewTypes.ENTER_TERMS :
      nextView = viewTypes.TERM;
      viewOpts = { state };
      break;
    case viewTypes.FINAL_SCORE :
      viewOpts = { state };
      break;
    case viewTypes.TERM :
      if( team1.name ) state.termNdx += 1; // TODO - this will get f'd on Prev

      // TODO - if final round - add multiplier message

      navModifier = 'for--term';
      nextView = viewTypes.TERM_RESULTS;
      onPreNext = () => {
        console.log('== store answers');
      };
      viewOpts = {
        teams: [team1, team2],
        term: state.terms[state.termNdx]
      };
      break;
    case viewTypes.TERM_RESULTS :
      if( !team1.name ){
        team1.name = formatAnswer(
          state.terms[state.termNdx],
          team1.answers[state.termNdx]
        );
        team2.name = formatAnswer(
          state.terms[state.termNdx],
          team2.answers[state.termNdx]
        );
      }

      nextView = ( state.termNdx + 1 > state.terms.length-1 )
        ? viewTypes.FINAL_SCORE
        : viewTypes.TERM;
      viewOpts = { state };
      break;
  }

  els.view.innerHTML =
    views[viewName](viewOpts)
    + views.panelNav({ modifier:navModifier });

  setupNav(viewName, nextView, onPreNext);
}

function init(){
  els.view = document.querySelector('#view');

  // team1.name = formatAnswer(state.terms[state.termNdx], team1.answers[state.termNdx]);
  // team1.points[0] = 25;
  // team1.points[1] = 25;
  // team2.name = formatAnswer(state.terms[state.termNdx], team2.answers[state.termNdx]);
  // team2.points[0] = 25;
  // team2.points[1] = 2;

  render(viewTypes.ENTER_TERMS);
  //render(viewTypes.TERM);
  //render(viewTypes.TERM_RESULTS);
}

document.addEventListener('DOMContentLoaded', () => {
  init();

//   const arg2 = {
//     comparisonItem: keywords.map(query => {
//       return {keyword:query, geo:'', time:'today 12-m'}
//     }),
//     category: 0,
//     property: ''
//   };
//   const arg3 = {
//     exploreQuery: `q=${keywords.join(',')}&date=today 12-m,today 12-m`,
//     guestPath: 'https://trends.google.com:443/trends/embed/'
//   };

  //trends.embed.renderExploreWidgetTo(document.querySelector('#trendsPlaceholder'), 'TIMESERIES', arg2, arg3);
}, false);
