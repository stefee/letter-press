const fs = require('fs')
const path = require('path')
const ghmd = require('./ghmd')
const puppeteer = require('puppeteer')

module.exports = (id, markdown, opts) => {
  const o = {}
  o.quiet = opts && opts.quiet ? opts.quiet : false
  o.dist = opts && opts.dist ? opts.dist : path.resolve('dist')
  o.ghmd = opts && opts.markdown ? opts.markdown : null
  o.pdf = opts && opts.pdf ? opts.pdf : {
    format: 'A4'
  }
  if (!fs.existsSync(o.dist)) fs.mkdirSync(o.dist)
  if (!fs.existsSync(o.dist)) return Promise.reject(new Error('Error: dist directory does not exist and could not be created: ' + o.dist))
  return press(id, markdown, o).catch(e => console.error('🚨 ' + e))
}

async function press (id, markdown, opts) {
  const pathMd = path.join(opts.dist, id + '.md')
  const pathHtml = path.join(opts.dist, id + '.html')
  const pathPdf = path.join(opts.dist, id + '.pdf')

  try {
    // write md
    write(pathMd, markdown)
        .then(file => opts.quiet || console.log('✨ ' + id + '.md done'))
        .catch(e => console.error('🚨 ' + e))

    // write html
    const html = await ghmd(id, markdown, opts.ghmd)
        .catch(e => console.error('🚨 ' + e))
    if (!html) throw new Error('Error: Something went wrong while generating HTML.')
    await write(pathHtml, html)
        .then(file => opts.quiet || console.log('✨ ' + id + '.html done'))
        .catch(e => console.error('🚨 ' + e))

    // write pdf
    await pdf(pathHtml, pathPdf, opts.pdf)
        .then(file => opts.quiet || console.log('✨ ' + id + '.pdf done'))
        .catch(e => console.error('🚨 ' + e))
  } catch (e) {
    throw e
  }
}

async function pdf (file, out, opts) {
  opts.path = out
  let browser
  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('file://' + file, {
      waitUntil: 'networkidle'
    })
    await page.pdf(opts)
    browser.close()
    return out
  } catch (e) {
    if (browser && browser.close) {
      console.error('🚨 Error: Problem printing PDF. Closing browser...')
      browser.close()
    }
    throw e
  }
}

function write (file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) {
        reject(err.toString())
        return
      }
      resolve(file)
    })
  })
}
