import { h } from 'hyperapp';
import './PanelNav.styl';

/**
 * The place where you enter all the terms you want search for.
 *
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const PanelNav = ({
  actions,
  nextView,
  preNextView,
  prePrevView,
  prevView,
  state,
}) => {
  const navState = state.nav;

  function handlePrev(){ // eslint-disable-line
    let proceed = true;
    if( prePrevView ) proceed = prePrevView();
    if( proceed ) actions.setView(
      (prevView.isView) ? prevView : prevView()
    );
  }

  function handleNext(){ // eslint-disable-line
    let proceed = true;
    if( preNextView ) proceed = preNextView();
    if( proceed ) actions.setView(
      (nextView.isView) ? nextView : nextView()
    );
  }

  function globalKeyHandler(ev){ // eslint-disable-line
    if( ev.ctrlKey ){
      switch( ev.keyCode ){
        case 37:
          if(prevView) handlePrev();
          break;

        case 39:
          if(nextView) handleNext();
          break;
      }
    }
  }

  function onCreate(){ // eslint-disable-line
    if( navState.globalKeyHandler ) document.removeEventListener('keydown', navState.globalKeyHandler);
    actions.nav.setGlobalKeyHandler(globalKeyHandler);
    document.addEventListener('keydown', globalKeyHandler);
  }

  return (
    <nav
      key="panelNav"
      class="panel-nav"
      oncreate={ onCreate }
    >
      <button
        id="prevBtn"
        class="panel-nav__prev-btn"
        disabled={ !prevView }
        onclick={ handlePrev }
      >&lt; Prev</button>
      <button
        id="nextBtn"
        class="panel-nav__next-btn"
        disabled={ !nextView }
        onclick={ handleNext }
      >Next &gt;</button>
    </nav>
  );
};

export default PanelNav;
