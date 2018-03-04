import { h } from 'hyperapp';
import PanelNav from './PanelNav';
import './EnterTerms.styl';

/**
 * The place where you enter all the terms you want search for.
 *
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const EnterTerms = ({ state, actions }) => {

  function preNext(){ // eslint-disable-line
    const terms = document.querySelector('#baseTerms');

    if( !terms.innerText ){
      alert('You need to add terms before you proceed.');
      return false;
    }

    actions.setTerms(terms.innerText);
    return true;
  }

  return (
    <div
      key="enterTerms"
      class="enter-terms"
    >
      <header class="enter-terms__header">
        <img class="enter-terms__header-img" src="/imgs/logo-funhaus.svg" />
        <div class="enter-terms__header-title">Trend Master</div>
      </header>
      <section class="enter-terms__body">
        <label class="enter-terms__label">
          Enter the base terms each search will be based on.<br />
          <strong>Be sure to separate each term by a comma.</strong>
        </label>
        <div
          contenteditable="true"
          id="baseTerms"
          class="enter-terms__input"
          tabindex="0"
          placeholder="term1, term2"
          oncreate={ inputRef => inputRef.focus() }
        >{ state.terms.join(', ') }</div>
        <PanelNav
          actions={ actions }
          nextView={ state.views[state.viewTypes.TERM] }
          preNextView={ preNext }
          state={ state }
        />
      </section>
    </div>
  );
};
EnterTerms.isView = true;

export default EnterTerms;
