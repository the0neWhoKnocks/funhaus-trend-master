import panelNav from './PanelNav';
import './EnterTerms.styl'

export default ({ state }) => `
  <div class="enter-terms">
    <header class="enter-terms__header">
      <img class="enter-terms__header-img" src="/imgs/logo-funhaus.svg">
      <div class="enter-terms__header-title">Trend Master</div>
    </header>
    <section class="enter-terms__body">
      <label class="enter-terms__label">
        Enter the base terms each search will be based on.<br>
        <strong>Be sure to separate each term by a comma.</strong>
      </label>
      <div
        contenteditable="true"
        id="baseTerms"
        class="enter-terms__input"
        tabindex="0"
        autofocus
      >${ state.terms.join(', ') }</div>
      ${ panelNav(state.panelNav) }
    </section>
  </div>
`;
