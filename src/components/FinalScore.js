import { formatAnswer } from '../utils';
import './FinalScore.styl';

export default ({ state }) => {
  const teams = Object.keys(state.teams).map((key) => state.teams[key]);
  const team1 = teams[0];
  const team2 = teams[1];
  let lastPoints, winners, losers, winnersClass, losersClass;

  team1.finalScore = team1.points.reduce((total, curr) => total + curr);
  team2.finalScore = team2.points.reduce((total, curr) => total + curr);

  // Add multiplier to lowest score
  if( team1.finalScore < team2.finalScore ){
    lastPoints = team1.points[team1.points.length - 1];
    team1.multiplier = (lastPoints * state.finalMultiplier) - lastPoints;
    team1.finalScore += team1.multiplier;
  }else{
    lastPoints = team2.points[team2.points.length - 1];
    team2.multiplier = (lastPoints * state.finalMultiplier) - lastPoints;
    team2.finalScore += team2.multiplier;
  }

  if( team1.finalScore > team2.finalScore ){
    winners = team1;
    winnersClass = 'is--team1';
    losers = team2;
    losersClass = 'is--team2';
  }else{
    winners = team2;
    winnersClass = 'is--team2';
    losers = team1;
    losersClass = 'is--team1';
  }

  /**
   * Tally headers template
   */
  const headers = () => {
    const teamHeaders = teams.map((team) => {
      return `
        <th class="final-score__answer">${ team.name }</th>
        <th class="final-score__answer-points"></th>
      `;
    });

    return `
      <tr>
        <th>Term</th>
        ${ teamHeaders.join('') }
      </tr>
    `;
  };

  /**
   * Answer rows template
   */
  const answerRows = () => {
    const rows = [];

    state.terms.forEach((term, ndx) => {
      let highest = 0;
      const termTd = `<td>${ term }</td>`;
      const teamAnswers = [];
      const points = teams.map((team) => {
        const curr = team.points[ndx];
        if( curr > highest ) highest = curr;
        return curr;
      });

      teams.forEach((team, teamNdx) => {
        const pointClass = ( points[teamNdx] === highest ) ? 'is--high' : 'is--low';

        teamAnswers.push(`
          <td class="final-score__answer">${ formatAnswer(term, team.answers[ndx]) }</td>
          <td class="final-score__answer-points">
            <div class="final-score__points-highlight ${ pointClass }">${ points[teamNdx] }</div>
          </td>
        `);
      });

      rows.push(`<tr>${ termTd }${ teamAnswers.join('') }</tr>`);
    });

    return rows.join('');
  };

  /**
   * Template for multiplier
   *
   * @param {Boolean} hasMultiplier - Whether or not the team has a points multiplier.
   * @return {String}
   */
  const multiplier = (hasMultiplier) => {
    if( !hasMultiplier ) return '';
    return `
      <div class="final-score__multiplier">
        Multiplier Added: ${ hasMultiplier } points
      </div>
    `;
  };

  return `
    <div class="final-score">
      <div class="final-score__section">
        Winners: <span class="final-score__section-team ${ winnersClass }">${ winners.name }</span> with ${ winners.finalScore } points
        ${ multiplier(winners.multiplier) }
      </div>
      <div class="final-score__section">
        Losers: <span class="final-score__section-team ${ losersClass }">${ losers.name }</span> with ${ losers.finalScore } points
        ${ multiplier(losers.multiplier) }
      </div>
      <table class="final-score__tally">
        ${ headers() }
        ${ answerRows() }
      </table>
    </div>
  `;
};
