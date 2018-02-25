function browserSyncScript(dev){
  if( !dev ) return '';

  return `
    <script id="__bs_script__">
      document.write("<script async src='http://HOST:8082/browser-sync/browser-sync-client.js?v=2.18.7'><\\/script>".replace("HOST", location.hostname) );
    </script>
  `;
}

function each(arr, type){
  let template;

  switch(type){
    case 'link':
      template = '<link rel="stylesheet" type="text/css" href="{PATH}">';
      break;

    case 'script':
      template = '<script type="text/javascript" src="{PATH}"></script>';
      break;
  }

  return arr.map((filePath) => template.replace('{PATH}', filePath)).join("\n");
}

module.exports = function(model){
  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <title>${ model.head.title }</title>
        ${ each(model.head.styles, 'link') }
        <script>
          window.appData = ${ JSON.stringify(model.appData) };
        </script>
      </head>
      <body>
        <div class="shell">
          <div id="view" class="view"></div>
        </div>

        ${ each(model.body.scripts, 'script') }
        ${ browserSyncScript(model.dev) }
      </body>
    </html>
  `;
};
