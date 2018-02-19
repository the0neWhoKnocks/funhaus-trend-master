import { formatAnswer } from '../utils';

export default ({state}) => {
  const terms = Object.keys(state.teams).map(key =>
    formatAnswer(state.terms[state.termNdx], state.teams[key].answers[state.termNdx])
  ).reverse(); // reverse to keep colors
  const arg2 = {
    comparisonItem: terms.map(query => {
      return {keyword:query, geo:'', time:'today 12-m'}
    }),
    category: 0,
    property: '',
  };
  const arg3 = {
    exploreQuery: `q=${terms.join(',')}&date=today 12-m,today 12-m`,
    guestPath: 'https://trends.google.com:443/trends/embed/',
  };
  // can't insert script tags, so get hacky
  const widgetCode = `
    <img
      src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      onload="
        trends.embed.renderExploreWidgetTo(document.querySelector('#trendsPlaceholder'), 'TIMESERIES', ${ JSON.stringify(arg2).replace(/"/g, "'") }, ${ JSON.stringify(arg3).replace(/"/g, "'") });
        this.parentNode.removeChild(this);
      "
    />
  `;
  const team1 = state.teams['1'];
  const team2 = state.teams['2'];

  fetch(`${ window.appData.endpoints.get.WIDGET_DATA }/${ terms.join(',') }`)
  .then(resp => resp.json())
  .then(resp => {
    resp.data.value.reverse();
    team1.points.push(resp.data.value[0]);
    team2.points.push(resp.data.value[1]);
    console.log(resp.data.value, team1.points, team2.points);
  })

  return `
    <div class="term-results">
      <div id="trendsPlaceholder"></div>
      ${widgetCode}
    </div>
  `;
};
