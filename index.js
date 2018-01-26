const fs = require('fs')
const path = require('path')
const extend = require('xtend')
const ghmd = require('./ghmd')
const toc = require('./toc')
const puppeteer = require('puppeteer')

module.exports = {
  launch: function launch (opts) {
    return new Press(opts).launch()
  },
  print: async function print (id, markdown, opts) {
    const press = new Press(opts)
    try {
      await press.launch()
      await press.print(id, markdown)
    } finally {
      if (press && press.close) press.close()
    }
  },
  Press
}

function Press (opts) {
  this._opts = extend({
    path: path.resolve('dist'),
    quiet: false,
    pdf: {
      format: 'A4',
      printBackground: true
    }
  }, opts || {})
  this._opts._logLevel = this._opts.quiet ? 1 : 2
  this._browser = null
  this._page = null
  this._printQueue = Promise.resolve()
}

Press.prototype.launch = async function () {
  if (this._browser && this._browser.close) return this

  this._log('launching press...')
  try {
    this._browser = await puppeteer.launch(this._opts.puppeteer || {})
  } catch (e) {
    console.error('🚨  Unexpected error while launching browser!')
    throw e
  }
  return this
}

Press.prototype.close = function () {
  if (this._browser && this._browser.close) {
    this._log('closing press...')
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

  const preprocessors = o.preprocessors || []

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

    const file = path.join(o.path, id + '.html')
    const out = path.join(o.path, id + '.pdf')

    // write html
    let html = await ghmd(id, markdown, {
      markdownIt: o.markdownIt,
      template: o.template,
      pug: o.pug,
      markdownItPlugins: o.markdownItPlugins
    })
    if (o.toc) html = await toc(html, o.toc)

    let promise = Promise.resolve(html)
    preprocessors.forEach(f => (promise = promise.then(f)))
    html = await promise

    await this._writeFile(file, html)
    this._log(`${id}.html done`)

    // queue print job
    await this._queuePrint(file, out, o.pdf)
    this._log(`${id}.pdf done`)
  } catch (e) {
    this._logError(`🚨  Error printing ${id} !`)
    throw e
  }

  return this
}

Press.prototype._queuePrint = function (file, out, opts) {
  this._printQueue = this._printQueue.then(() => this._pdf(file, out, opts))
  return this._printQueue
}

Press.prototype._pdf = async function (file, out, opts) {
  try {
    this._page = await this._browser.newPage()
    await this._page.goto('file://' + file, { waitUntil: 'networkidle2' })
    await this._page.pdf(extend(opts, { path: out }))
  } catch (e) {
    throw e
  }
}

Press.prototype._writeFile = async function (file, data) {
  fs.writeFile(file, data, err => { if (err) throw err })
}

Press.prototype._log = function (thing) {
  if (this._opts._logLevel >= 2) console.log('♥ ' + thing)
}

Press.prototype._logError = function (message) {
  if (this._opts._logLevel >= 1) console.error(message)
}
