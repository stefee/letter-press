const fs = require('fs')
const path = require('path')
const ghmd = require('./ghmd')

module.exports = (id, md, opts) => {
  const dist = opts.dist ? opts.dist : path.join(__dirname, 'dist')
  if (!fs.existsSync(dist)) fs.mkdirSync(dist)
  write(path.join(dist, id + '.md'), md)
  const html = ghmd(id, md)
  write(path.join(dist, id + '.html'), html)

  function write (file, data) {
    fs.writeFile(file, data, err => {
      if (err) throw err
      console.log('File written: ' + file)
    })
  }
}
