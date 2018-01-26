const htmlToc = require('html-toc')
const extend = require('xtend')

module.exports = async function toc (html, opts) {
  opts = extend({
    id: '#toc',
    anchors: true,
    selectors: 'h1,h2'
  }, opts || {})

  const content = htmlToc(html, opts)
  return content
}
