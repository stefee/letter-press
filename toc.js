const htmlToc = require('html-toc')
const extend = require('xtend')

module.exports = async function toc (html, opts) {
  return htmlToc(html, extend({
    id: '#toc',
    anchors: true,
    selectors: 'h1,h2'
  }, opts || {}))
}
