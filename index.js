const fs = require('fs')
const path = require('path')
const extend = require('xtend')
const ghmd = require('./ghmd')
const puppeteer = require('puppeteer')

module.exports = {
  launch: (opts) => {
    return new Press(opts).launch()
  },
  print: async (id, markdown, opts) => {
    const press = new Press(opts)
    try {
      await press.launch()
      await press.print(id, markdown)
      press.close()
    } catch (e) {
      if (press && press.close) press.close()
      throw e
    }
  },
  Press: Press
}

function writeFile (file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) {
        reject(err.toString())
        return
      }
      resolve(true)
    })
  })
}

function Press (opts) {
  this._opts = extend({
    path: path.resolve('dist'),
    writeMarkdown: true,
    pdf: {
      format: 'A4'
    }
  }, opts || {})
  this._browser = null
  this._page = null
  this._printJobs = []
}

Press.prototype.launch = async function () {
  if (this._browser && this._browser.close) return this

  try {
    this._browser = await puppeteer.launch()
    return this
  } catch (e) {
    console.error('🚨  Unexpected error while launching browser!')
    throw e
  }
}

Press.prototype.close = function () {
  if (this._browser && this._browser.close) {
    try {
      this._browser.close()
      delete this._browser
    } catch (e) {
      console.error('🚨  Unexpected error while closing browser!')
      throw e
    }
  }
}

Press.prototype.print = async function (id, markdown, opts) {
  const o = extend(this._opts, opts || {})

  try {
    if (!this._browser || !this._browser.close) throw new Error('Press not initialised. Press.prototype.launch is required first.')
    if (typeof id !== 'string') throw new Error('Expected String for first argument: id')
    if (typeof markdown !== 'string') throw new Error('Expected String for second argument: markdown')
    if (!fs.existsSync(o.path)) {
      try {
        fs.mkdirSync(o.path)
      } catch (e) {
        throw new Error('Output directory does not exist and could not be created: ' + o.path)
      }
    }

    const pathMd = path.join(o.path, id + '.md')
    const pathHtml = path.join(o.path, id + '.html')
    const pathPdf = path.join(o.path, id + '.pdf')

    // write md
    if (o.writeMarkdown) {
      let err
      writeFile(pathMd, markdown)
      .then(() => console.log(`✨  ${id}.md done`))
      .catch(e => { err = e })
      if (err) throw err
    }

    // write html
    const html = await ghmd(id, markdown, o.template, o.ghmd)
    await writeFile(pathHtml, html)
    console.log(`✨  ${id}.html done`)

    // wait for print existing tasks
    await Promise.all(this._printJobs)

    // write pdf
    this._page = await this._browser.newPage()
    this._printJobs.push(this._pdf(pathHtml, pathPdf, o.pdf))
    await Promise.all(this._printJobs)

    console.log(`✨  ${id}.pdf done`)
  } catch (e) {
    console.error(`🚨  Error printing ${id} !`)
    throw e
  }

  return this
}

Press.prototype._pdf = async function (file, out, opts) {
  try {
    await this._page.goto('file://' + file, {
      waitUntil: 'networkidle'
    })
    await this._page.pdf(extend(opts, { path: out }))
    return out
  } catch (e) {
    throw e
  }
}
