import { secsToTime } from './utils';

const actions = {

  nav: {
    setGlobalKeyHandler: val => () => ({
      globalKeyHandler: val,
    }),
  },

  results: {
    setGraphData: val => () => ({
      graphData: val,
    }),

    getPointsSaved: () => state => state.pointsSaved,
    setPointsSaved: val => () => ({
      pointsSaved: val,
    }),
  },

  timer: {
    getRunning: () => state => state.running,
    setRunning: val => () => ({
      running: val,
    }),

    setTime: val => () => ({
      time: val,
    }),

    getTimeout: () => state => state.timeout,
    setTimeout: val => () => ({
      timeout: val,
    }),

    stop: (actions) => state => {
      clearTimeout( actions.timer.getTimeout() );
      actions.timer.setTime(secsToTime(state.duration));
      actions.timer.setRunning(false);
    },
  },

  setAnswers: answers => state => {
    const teams = { ...state.teams };
    let answerMsg = '';

    Object.keys(teams).forEach((key, ndx) => {
      const teamAnswers = [...teams[key].answers];
      teamAnswers[state.termNdx] = answers[ndx];
      teams[key].answers = teamAnswers;
      answerMsg += `\n  Team ${ ndx+1 }: '${ answers[ndx] }'`;
    });

    console.log(`Answers for term '${ state.terms[state.termNdx] }'${ answerMsg }`);
    return { teams };
  },

  setTerms: val => state => {
    const terms = val.split(',').map(term => term.trim());

    for(let key in state.teams){
      const team = state.teams[key];

      // remove items in answers that don't contain current terms
      for(let i=team.answers.length-1; i>0; i--){
        const currTerm = state.terms[i];

        if( !currTerm || currTerm != terms[i] ){
          team.answers[i] = undefined;
          team.points[i] = undefined;
        }
      }
    }

    console.log('Terms set to:', terms);
    return { terms };
  },

  setTermNdx: val => () => ({
    termNdx: val,
  }),

  setView: val => () => ({
    view: val,
  }),
};

export default actions;
