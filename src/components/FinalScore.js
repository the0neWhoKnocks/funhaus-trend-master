export default ({ state }) => {
  const team1 = state.teams['1'];
  const team2 = state.teams['2'];
  let lastPoints, winners, losers;

  team1.finalScore = team1.points.reduce((total, curr) => total + curr);
  team2.finalScore = team2.points.reduce((total, curr) => total + curr);

  // Add multiplier to lowest score
  if( team1.finalScore < team2.finalScore ){
    lastPoints = team1.points[team1.points.length - 1];
    team1.multiplier = (lastPoints * state.finalMultiplier) - lastPoints;
    team1.finalScore += team1.multiplier;
  }else{
    lastPoints = team2.points[team2.points.length - 1];
    team2.multiplier += (lastPoints * state.finalMultiplier) - lastPoints;
    team2.finalScore += team2.multiplier;
  }

  if( team1.finalScore > team2.finalScore ){
    winners = team1;
    losers = team2;
  }else{
    winners = team2;
    losers = team1;
  }

  return `
    <div>
      Winners: ${ winners.name } with ${ winners.finalScore } points
      ${ winners.multiplier && `<div>+${ winners.multiplier }</div>` }
    </div>
    <div>
      Losers: ${ losers.name } with ${ losers.finalScore } points
      ${ losers.multiplier && `<div>+${ losers.multiplier }</div>` }
    </div>
  `;
};
