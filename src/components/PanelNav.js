export default ({modifier}) => `
  <nav class="panel-nav ${ (modifier) ? modifier : '' }">
    <button id="prevBtn" class="panel-nav__prev-btn">&lt; Prev</button>
    <button id="nextBtn" class="panel-nav__next-btn">Next &gt;</button>
  </nav>
`;
