import 'svg.js';
import './resultsGraph.styl';

/**
 * @param {Object} elId - The ID of an element that will be used to draw the SVG into.
 * @param {Object} graphData - The data used to map out the results.
 */
const resultsGraph = ({
  elId,
  graphData,
  onAnimationComplete = () => {},
  terms,
}) => {
  // http://svgjs.com/tutorials/
  const graphW = 1000;
  const graphH = 500;
  const padding = 30;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNdx = (new Date()).getMonth();
  const draw = window.SVG(elId).size(graphW, graphH);

  draw.viewbox(0, 0, graphW, graphH);
  // background
  draw
    .rect(graphW, graphH)
    .fill('#fff')
    .stroke({
      width: 5,
      color: '#ccc',
    });
  // month lines
  for(let i=0; i<12; i++){
    const xPos = ( ( graphW - (padding*2) ) / 12 ) * (i+1);
    let mNdx = (monthNdx+1)+i;

    if( mNdx >= 12 ) mNdx = Math.abs(12-mNdx);

    draw
      .line(xPos, 0+padding, xPos, graphH-padding)
      .stroke({
        width: 2,
        color: '#ccc',
        dasharray: '3,3',
      });
    draw
      .plain(`${ months[mNdx] }.`)
      .move(xPos, graphH-padding)
      .font({
        'class': 'month',
      });
  }
  // scale lines
  for(let i=0; i<5; i++){
    const yPos = (( (graphH-(padding*2)) / 4) * i) + padding;
    draw
      .line(padding, yPos, graphW-padding, yPos)
      .stroke({
        width: 2,
        color: '#eee',
        dasharray: '5,5',
      });
    draw
      .plain(`${ 100 - i*25 }`)
      .move(padding, yPos)
      .font({
        'class': 'scale-number',
      });
  }

  if( graphData ){
    const paddedW = graphW - (padding*2);
    const paddedH = graphH - (padding*2);
    const drawings = [];
    let animComplete = false;

    for(let i=0; i<graphData.length; i++){
      const points = graphData[i];
      const xInc = paddedW / points.length;
      const strCoords = [];
      const lastCoOrds = [];
      const pointRadius = 25;

      for(let j=0; j<points.length; j++){
        const xPos = (xInc * j) + padding;
        const yPos = paddedH+padding - (paddedH * (points[j] * 0.01));

        if( j === points.length-1 ){
          lastCoOrds[0] = xPos;
          lastCoOrds[1] = yPos;
        }

        strCoords.push(`${ xPos },${ yPos }`);
      }

      const line = draw
        .path(`M ${ strCoords.join(' ') }`)
        .fill('none')
        .stroke({
          width: 1,
          color: 'rgba(0,0,0,0)',
          linejoin: 'round',
        });
      const dot = draw
        .circle(pointRadius)
        .addClass(`team${ i+1 }`)
        .move(lastCoOrds[0]-(pointRadius/2), lastCoOrds[1]-(pointRadius/2));

      drawings.push({
        coOrds: strCoords,
        dot,
        line,
      });
    }

    drawings.forEach((drawing, ndx) => {
      const dot = drawing.dot;
      const coOrds = drawing.coOrds;
      const line = drawing.line;
      const length = line.length();
      const coOrdsCopy = [...coOrds];
      const drawingCoOrds = [coOrdsCopy.shift()];

      // `animate` wasn't working, so I draw another line over the top of the
      // first path. `animate`'s just used for timing.
      const drawingLine = draw
        .path(`M ${ drawingCoOrds.join('') }`)
        .addClass(`team${ ndx+1 }`)
        .fill('none')
        .stroke({
          width: 5,
          linejoin: 'round',
        });

      line
        .animate(2000, '<>')
        .during((pos, morph, eased) => {
          if( coOrdsCopy.length ){
            const point = line.pointAt(eased * length);

            drawingCoOrds.push(`${ point.x },${ point.y }`);
            drawingLine.plot(`M ${ drawingCoOrds.join(' ') }`);
            dot.center(point.x, point.y);
          }
        })
        .afterAll(() => {
          if( !animComplete ){
            onAnimationComplete();
            animComplete = true;
          }
        });
    });

  }else{
    draw
      .text(`No Results for\n\n${ terms.map(term => `"${ term }"`).join(' and ') }`)
      .move(graphW/2, graphH/2)
      .font({
        'class': 'no-results',
      });
  }
};

export default resultsGraph;
