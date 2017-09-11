// based on 1000ch/node-github-markdown
// https://github.com/1000ch/node-github-markdown
const path = require('path')
const pug = require('pug')
const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')

module.exports = (title, markdown, opts) => {
  return new Promise((resolve, reject) => {
    const markdownIt = new MarkdownIt(opts || {
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
    })

    const file = pug.renderFile(path.join(__dirname, 'ghmd.pug'), {
      pretty: true,
      title: title,
      basedir: path.resolve('node_modules'),
      content: markdownIt.render(markdown)
    })
    resolve(file)
  })
}
