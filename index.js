const fs = require('fs')
const path = require('path')
const ghmd = require('./ghmd')
const puppeteer = require('puppeteer')

module.exports = (id, md, opts) => {
  const dist = opts && opts.dist ? opts.dist : path.resolve('dist')
  if (!fs.existsSync(dist)) fs.mkdirSync(dist)
  press(id, md, dist).catch(console.error)
}

async function press (id, md, dist) {
  const mdPath = path.join(dist, id + '.md')
  const htmlPath = path.join(dist, id + '.html')
  const pdfPath = path.join(dist, id + '.pdf')

  try {
    // write md
    write(mdPath, md)
        .then(file => console.log('File written: ' + file))
        .catch(console.error)

    // write html
    const html = await ghmd(id, md).catch(e => console.error(e))
    await write(htmlPath, html)
        .then(file => console.log('File written: ' + file))
        .catch(console.error)

    // write pdf
    pdf(htmlPath, pdfPath)
        .then(file => console.log('File written: ' + file))
        .catch(console.error)
  } catch (e) {
    throw e
  }
}

async function pdf (file, out) {
  let browser
  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('file://' + file, {
      waitUntil: 'networkidle'
    })
    await page.pdf({
      path: out,
      format: 'A4'
    })
    browser.close()
    return out
  } catch (e) {
    if (browser && browser.close) {
      console.error('Error: Problem printing PDF. Closing browser...')
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
