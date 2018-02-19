export default ({state}) => `
  <div class="base-terms">
    <label class="base-terms__label">Enter the base terms each search will be based on (separated by a comma).</label>
    <div
      contenteditable="true"
      id="baseTerms"
      class="base-terms__input"
    >${state.terms.join(', ')}</div>
  </div>
`;
