const toc = require('html-toc');
const extend = require('xtend');

module.exports = (html, opts) => {
  opts = extend(
    {
      id: '#toc',
      anchors: true,
      selectors: 'h1,h2'
    },
    opts || {}
  );

  return new Promise((resolve, reject) => {
    try {
      const content = toc(html, opts);
      resolve(content);
    } catch (e) {
      reject(e);
    }
  });
};
