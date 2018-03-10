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

/**
 * Returns an iterable Array of DOM elements.
 *
 * @param {String} query - What CSS class or id to find.
 * @param {Object} ctx - What element to look for elements in.
 * @return {Array}
 */
function getEls(query, ctx){
  return Array.prototype.slice.call(
    (ctx || document).querySelectorAll(query)
  );
}

/**
 * Gets a query parameter value
 *
 * @param {String} param - The parameter name
 * @return {String|undefined}
 */
function getParam(param){
  if( !document.location.search ) return undefined;

  const params = new URLSearchParams(document.location.search.substring(1));
  return params.get(param);
}

/**
 * Parses seconds into a time for a clock
 *
 * @param {Number} s - number of seconds
 * @return {String}
 */
function secsToTime(s){
  let mins = s / 60;
  let secs = ( mins >= 1 ) ? mins*60 - secs : s;

  mins = ( mins < 1 )
    ? '00'
    : ( mins >= 10 ) ? mins : `0${ mins }`;
  secs = ( secs < 1 )
    ? '00'
    : ( secs >= 10 ) ? secs : `0${ secs }`;

  return `${ mins }:${ secs }`;
}

export {
  formatAnswer,
  getEls,
  getParam,
  secsToTime,
};
