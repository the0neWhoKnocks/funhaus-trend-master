import { h } from 'hyperapp';

/**
 * The shell for the app
 *
 * @param {Object} state - The app's state
 * @param {Object} actions - Actions for modifying state
 */
const Shell = (state, actions) => {
  const View = state.view;
  
  return (
    <div class="view">
      <View state={state} actions={actions} />
    </div>
  );
};

export default Shell;
