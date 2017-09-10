const fs = require('fs')
const path = require('path')
const pify = require('pify')
const ghmd = require('./ghmd')
const puppeteer = require('puppeteer')

module.exports = (id, md, opts) => {
  const dist = opts && opts.dist ? opts.dist : path.resolve('dist')
  if (!fs.existsSync(dist)) fs.mkdirSync(dist)
  write(path.join(dist, id + '.md'), md)
  const html = ghmd(id, md)
  const htmlPath = path.join(dist, id + '.html')
  const pdfPath = path.join(dist, id + '.pdf')
  write(htmlPath, html).then(path => print(path, pdfPath))
      .catch(err => {
        throw err
      })

  async function print (html, pdf) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('file://' + html, {
      waitUntil: 'networkidle'
    })
    await page.pdf({
      path: pdf,
      format: 'A4'
    })
    console.log('File written: ' + pdf)
    browser.close()
  }

  function write (file, data) {
    return pify(fs.writeFile)(file, data).then(err => {
      if (err) throw err
      console.log('File written: ' + file)
      return file
    })
  }
}
