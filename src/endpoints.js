const color = require('cli-color');

module.exports = {
  get: {
    WIDGET_DATA: {
      path: '/api/v1/get/widgetdata/:terms',
      handler: (req, res) => {
        const googleTrends = require('google-trends-api');
        const startTime = new Date();
        startTime.setMonth(startTime.getMonth() - 12);

        googleTrends.interestOverTime({
          keyword: req.params.terms.split(','),
          startTime,
        })
          .then((results) => {
            results = JSON.parse(results);
            const resultsArr = [];

            // separate all the coords into their own tracks
            for(let i=0; i<results.default.timelineData.length; i++){
              const currCoord = results.default.timelineData[i].value;

              for(let j=0; j<currCoord.length; j++){
                if( !resultsArr[j] ) resultsArr[j] = [];
                resultsArr[j].push(currCoord[j]);
              }
            }

            const msg = `Got data for - terms: ${ req.params.terms }`;
            const respData = {
              data: resultsArr,
              msg: msg,
              status: 200,
            };

            console.log( `${ color.green.bold.inverse(' SUCCESS ') } ${ msg }` );

            res.json(respData);
          })
          .catch((err) => {
            console.error('Oh no there was an error', err);
          });
      },
    },
  },
};
