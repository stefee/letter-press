#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const extend = require('xtend')
const test = require('tape')
const letterpress = require('.')
const letter = require('./test.md')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json')))
const date = new Date()
const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

const testDir = path.join(__dirname, 'test')
if (!fs.existsSync(testDir)) {
  try {
    fs.mkdirSync(testDir)
  } catch (e) {
    throw new Error('Output directory does not exist and could not be created: ' + testDir)
  }
}

const opts = {
  puppeteer: {
    args: [
      '--no-sandbox',
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps'
    ]
  }
}

test('print', function (t) {
  const out = path.join(testDir, 'print')
  const expected = [
    'dapibus_foo.html',
    'dapibus_foo.pdf'
  ]

  t.plan(expected.length + 1)

  const markdown = letter(dateString, data.from[0], data.to[0])
  const id = data.from[0].id + '_' + data.to[0].id

  t.comment(`removing dir ${out} ...`)
  rimraf(out, function (err) {
    if (err) throw err

    letterpress.print(id, markdown, extend({
      path: out
    }, opts || {}))
      .catch(e => {
        console.error(e.toString())
        t.fail('complete print')
      })
      .then(() => {
        t.pass('complete print')
        expected.forEach(p => t.ok(fs.existsSync(path.join(out, p)), 'exists: ' + p))
        t.end()
      })
  })
})

test('print with launch & close', function (t) {
  const out = path.join(testDir, 'print_with_launch_close')
  const expected = [
    'dapibus_foo.html',
    'dapibus_foo.pdf'
  ]

  t.plan(expected.length + 1)

  const markdown = letter(dateString, data.from[0], data.to[0])
  const id = data.from[0].id + '_' + data.to[0].id

  t.comment(`removing dir ${out} ...`)
  rimraf(out, async function (err) {
    if (err) throw err

    let instance
    letterpress.launch(extend({
      path: out
    }, opts || {}))
      .then(press => {
        instance = press
        return press
      })
      .then(press => press.print(id, markdown))
      .then(press => press.close())
      .then(() => t.pass('complete print with launch & close'))
      .catch(e => {
        console.error(e.toString())
        t.fail('complete print with launch & close')
        if (instance && instance.close) instance.close()
      })
      .then(() => {
        expected.forEach(p => t.ok(fs.existsSync(path.join(out, p)), 'exists: ' + p))
        t.end()
      })
  })
})

test('print multiple', function (t) {
  const out = path.join(testDir, 'print_multiple')
  const expected = [
    'dapibus_foo.html',
    'dapibus_bar.html',
    'dapibus_fooo.html',
    'dapibus_barr.html',
    'parturient_foo.html',
    'parturient_bar.html',
    'parturient_fooo.html',
    'parturient_barr.html',
    'dapibus_foo.pdf',
    'dapibus_bar.pdf',
    'dapibus_fooo.pdf',
    'dapibus_barr.pdf',
    'parturient_foo.pdf',
    'parturient_bar.pdf',
    'parturient_fooo.pdf',
    'parturient_barr.pdf'
  ]

  t.plan(expected.length + (data.from.length * data.to.length) + 1)

  t.comment(`removing dir ${out} ...`)
  rimraf(out, async function (err) {
    if (err) throw err

    let press
    try {
      press = await letterpress.launch(extend({
        path: out
      }, opts || {}))

      const ps = [] // promises
      data.from.forEach(from => {
        data.to.forEach(to => {
          const markdown = letter(dateString, from, to)
          const id = from.id + '_' + to.id

          ps.push(
            press.print(id, markdown)
              .then(() => t.pass('print ' + id))
              .catch(e => {
                console.error(e.toString())
                t.fail('print ' + id)
              })
          )
        })
      })

      await Promise.all(ps)
      press.close()
      t.pass('complete print multiple')
    } catch (e) {
      console.error(e.toString())
      t.fail('complete print multiple')
      if (press && press.close) press.close()
    }

    expected.forEach(p => t.ok(fs.existsSync(path.join(out, p)), 'exists: ' + p))
    t.end()
  })
})
