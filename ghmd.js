// based on 1000ch/node-github-markdown
// https://github.com/1000ch/node-github-markdown
const fs = require('fs')
const path = require('path')
const extend = require('xtend')
const pug = require('pug')
const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')

module.exports = async function ghmd (title, markdown, opts) {
  opts = opts || {}

  const markdownIt = new MarkdownIt(extend({
    html: true,
    breaks: true,
    langPrefix: 'hljs ',
    highlight: (string, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(lang, string).value
      }
      return hljs.highlightAuto(string).value
    }
  }, opts.markdownIt || {}))

  if (opts.markdownItPlugins) {
    opts.markdownItPlugins.forEach(plugin => {
      if (Array.isArray(plugin)) {
        markdownIt.use(...plugin)
      } else {
        markdownIt.use(plugin)
      }
    })
  }

  let baseDir
  if (opts.template) {
    baseDir = path.dirname(opts.template)
  } else {
    baseDir = fs.existsSync(path.join(__dirname, 'node_modules'))
        ? __dirname
        : path.join(__dirname, '../..')
  }
  const file = pug.renderFile(
    path.resolve(opts.template || path.join(__dirname, 'ghmd.pug')),
    extend({
      pretty: true,
      title: title,
      basedir: baseDir,
      content: markdownIt.render(markdown)
    }, opts.pug || {})
  )
  return file
}
