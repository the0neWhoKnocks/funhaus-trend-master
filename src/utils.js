/**
 * Takes an answer in the format `_ <word>` or `<word> _` and replaces the token
 * `_` with the current term.
 *
 * @param {String} term - Current term
 * @param {String} answer - Team's answer
 * @return {String}
 */
function formatAnswer(term, answer){
  return answer.replace(/[_]+/, term);
}

export {
  formatAnswer,
};
