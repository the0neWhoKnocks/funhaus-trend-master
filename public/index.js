function browserSyncScript(dev){
  if( !dev ) return '';

  return `
    <script id="__bs_script__">
      document.write("<script async src='http://HOST:8082/browser-sync/browser-sync-client.js?v=2.18.7'><\\/script>".replace("HOST", location.hostname) );
    </script>
  `;
}

module.exports = function(model){
  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <title>${ model.head.title }</title>
        <link rel="stylesheet" type="text/css" href="/css/app.css">
        <script>
          window.appData = ${ JSON.stringify(model.appData) };
        </script>
      </head>
      <body>
        <div class="shell">
          <div id="view" class="view"></div>
        </div>

        <script language="javascript" type="text/javascript" src="/js/app.js"></script>
        <script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1308_RC02/embed_loader.js"></script>
        ${ browserSyncScript(model.dev) }
      </body>
    </html>
  `;
};
