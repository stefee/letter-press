#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const test = require('tape')
const press = require('.')
const letter = require('./test.md')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json')))
const date = new Date()
const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

test('press test', function (t) {
  const dist = path.resolve('test')
  const paths = ['dapibus_bar.html', 'dapibus_foo.md', 'parturient_bar.pdf', 'dapibus_bar.md', 'dapibus_foo.pdf', 'parturient_foo.html', 'dapibus_bar.pdf', 'parturient_bar.html', 'parturient_foo.md', 'dapibus_foo.html', 'parturient_bar.md', 'parturient_foo.pdf']

  t.plan(paths.length)
  t.comment('removing dir ' + dist)
  rimraf(dist, function (err) {
    if (err) {
      t.fail(err.toString())
      return
    }
    const proms = run({
      dist: dist,
      quiet: true
    })
    Promise.all(proms).then(() => {
      paths.forEach(p => {
        t.ok(fs.existsSync(path.join(dist, p)), 'file exists: ' + p)
      })
      t.end()
    }).catch(e => t.fail(e.toString()))
  })
})

function run (opts) {
  const proms = []
  data.from.forEach(from => data.to.forEach(to => {
    const md = letter(dateString, from, to)
    const id = from.id + '_' + to.id
    proms.push(press(id, md, opts))
  }))
  return proms
}
