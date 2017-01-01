
const prepend = (dir, tmp, path) => `
// [weave] hot reload enabled
//
// root: ${dir}
// file: ${path}
//

import render from 'weave-render';

`;

const append = (dir, tmp, path) => `
if (module.hot) {
  module.hot.accept(function(err) {
    if (err) {
      console.error('Cannot apply hot update to ${JSON.stringify(path)}: ' + err.message);
    }
  });
  module.hot.dispose(function(data) {
    setImmediate(function() {
      delete require.cache[require.resolve('application')];
      const { default: router } = require('application');
      if ( typeof router !== 'function' ) return;
      render(router);
      document.head.querySelectorAll('link[rel="stylesheet"]').forEach(e => e.href = e.href);
    });
  });
}
`;

const separator = '\n\n';

module.exports = function (source, map) {

  /**
   * execute cacheable
   */
  this.cacheable && this.cacheable();

  const { resourcePath: path, query } = this;
  const { dir, tmp } = JSON.parse(query.substring(1));

  /**
   * return modified source code
   */
  if (this.sourceMap === false) {
    return this.callback(null, [
      prepend(dir, tmp, path),
      source,
      append(dir, tmp, path),
    ].join(separator));
  }
  return this.callback(null, [
    prepend(dir, tmp, path),
    source,
    append(dir, tmp, path),
  ].join(separator), map);
}
