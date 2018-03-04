const actions = {

  nav: {
    setGlobalKeyHandler: val => () => ({
      globalKeyHandler: val,
    }),
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

  setPointsSaved: val => () => ({
    pointsSaved: val,
  }),

  setTerms: val => () => {
    const terms = val.split(',').map(term => term.trim());
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
