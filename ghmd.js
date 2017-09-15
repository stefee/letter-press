// based on 1000ch/node-github-markdown
// https://github.com/1000ch/node-github-markdown
const fs = require('fs')
const path = require('path')
const extend = require('xtend')
const pug = require('pug')
const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')

module.exports = (title, markdown, templatePath, opts) => {
  if (typeof templatePath === 'object') {
    opts = templatePath
    templatePath = null
  }

  return new Promise((resolve, reject) => {
    const markdownIt = new MarkdownIt(extend({
      html: true,
      breaks: true,
      langPrefix: 'hljs ',
      highlight: (string, lang) => {
        try {
          if (lang) return hljs.highlight(lang, string).value
          return hljs.highlightAuto(string).value
        } catch (err) {
          reject(err)
        }
      }
    }, opts || {}))

    if (!templatePath) templatePath = path.join(__dirname, 'ghmd.pug')
    const baseDir = fs.existsSync(path.join(__dirname, 'node_modules'))
        ? __dirname : path.resolve(__dirname, '../..')
    const file = pug.renderFile(path.resolve(templatePath), {
      pretty: true,
      title: title,
      basedir: baseDir,
      content: markdownIt.render(markdown)
    })
    resolve(file)
  })
}
