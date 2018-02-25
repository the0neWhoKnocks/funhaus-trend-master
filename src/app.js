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
6. allow for skipping some terms, in case time is running low.
  - just display those terms as N/A in the results table.
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
  viewIsLoaded: false,
};
const team1 = state.teams['1'];
const team2 = state.teams['2'];
const direction = {
  BACK: 'back',
  FORWARD: 'forward',
};

function handlePrev(){
  if( state.nav.prev.length ){
    state.nav.direction = direction.BACK;
    const prev = state.nav.prev[state.nav.prev.length-1];
    state.nav.prev.pop();
    prev();
  }
}

function handleNext(){
  if( state.nav.nextView ){
    state.nav.direction = direction.FORWARD;
    state.nav.prev.push(render.bind(null, state.nav.prevView));
    if( state.nav.onPreNext ) state.nav.onPreNext();
    render(state.nav.nextView);
  }
}

function setupNav(){
  document.getElementById('view').addEventListener('click', (ev) => {
    if( ev.target ){
      if( ev.target.matches('#prevBtn') ) handlePrev();
      if( ev.target.matches('#nextBtn') ) handleNext();
  	}
  });

  document.onkeydown = (ev) => {
    if( ev.ctrlKey && state.viewIsLoaded ){
      switch( ev.keyCode ){
        case 37: handlePrev(); break;
        case 39: handleNext(); break;
      }
    }
  };
}

function render(viewName){
  let viewOpts, nextView, onPreNext;

  state.viewIsLoaded = false;

  switch(viewName){
    case viewTypes.ENTER_TERMS :
      nextView = viewTypes.TERM;
      viewOpts = { state };
      break;

    case viewTypes.FINAL_SCORE :
      viewOpts = { state };
      break;

    case viewTypes.TERM :
      nextView = viewTypes.TERM_RESULTS;
      onPreNext = () => {
        // TODO - store answers
        console.log('== store answers');
        // TODO - block Next if answers haven't been entered
      };
      viewOpts = {
        state,
        teams: [team1, team2],
        term: state.terms[state.termNdx]
      };
      break;

    case viewTypes.TERM_RESULTS :
      if( state.nav.direction && state.nav.direction === direction.BACK ) state.termNdx--;

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

      onPreNext = () => {
        if( state.nav.direction && state.nav.direction === direction.FORWARD ) state.termNdx++;
      };

      nextView = ( state.termNdx + 1 > state.terms.length-1 )
        ? viewTypes.FINAL_SCORE
        : viewTypes.TERM;
      viewOpts = { state };
      break;
  }

  const viewResult = views[viewName](viewOpts);

  if( Promise.resolve(viewResult) == viewResult ){
    els.view.innerHTML = 'Loading...';

    viewResult
    .then(markup =>
      renderComplete(markup, viewName, nextView, onPreNext)
    )
    .catch(err => { throw err; });
  }else{
    renderComplete(viewResult, viewName, nextView, onPreNext);
  }
}

function renderComplete(markup, viewName, nextView, onPreNext){
  els.view.innerHTML = markup;
  state.nav.prevView = viewName;
  state.nav.nextView = nextView;
  state.nav.onPreNext = onPreNext;
  state.viewIsLoaded = true;

  // autofocus only works on load, this will work for any view that's loaded
  const focusableEl = document.querySelector('[autofocus]');
  if( focusableEl ) focusableEl.focus();
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
  // render(viewTypes.TERM);
  //render(viewTypes.TERM_RESULTS);

  setupNav();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
}, false);
