#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const test = require('tape')
const letterpress = require('.')
const letter = require('./test.md')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json')))
const date = new Date()
const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

test('letterpress test single auto', function (t) {
  const out = path.join(__dirname, 'test')
  const expected = ['dapibus_foo.md', 'dapibus_foo.html', 'dapibus_foo.pdf']

  t.plan(expected.length + 1)

  const markdown = letter(dateString, data.from[0], data.to[0])
  const id = data.from[0].id + '_' + data.to[0].id

  t.comment(`removing dir ${out} ...`)
  rimraf(out, function (err) {
    if (err) throw err

    letterpress.print(id, markdown, { path: out })
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

test('letterpress test single with constructor', function (t) {
  const out = path.join(__dirname, 'test')
  const expected = ['dapibus_foo.md', 'dapibus_foo.html', 'dapibus_foo.pdf']

  t.plan(expected.length + 1)

  const markdown = letter(dateString, data.from[0], data.to[0])
  const id = data.from[0].id + '_' + data.to[0].id

  t.comment(`removing dir ${out} ...`)
  rimraf(out, async function (err) {
    if (err) throw err

    let press
    try {
      press = await letterpress.launch({ path: out })
      await press.print(id, markdown)
      press.close()
      t.pass('complete print')
    } catch (e) {
      console.error(e.toString())
      t.fail('complete print')
      if (press && press.close) {
        press.close()
      }
    }

    expected.forEach(p => t.ok(fs.existsSync(path.join(out, p)), 'exists: ' + p))
    t.end()
  })
})

test('letterpress test multiple asynchronous', function (t) {
  const out = path.join(__dirname, 'test')
  const expected = [
    'dapibus_foo.html',
    'dapibus_bar.html',
    'parturient_foo.html',
    'parturient_bar.html',
    'dapibus_foo.pdf',
    'dapibus_bar.pdf',
    'parturient_foo.pdf',
    'parturient_bar.pdf'
  ]

  t.plan(expected.length + (data.from.length * data.to.length) + 1)

  t.comment(`removing dir ${out} ...`)
  rimraf(out, async function (err) {
    if (err) throw err

    let press
    try {
      press = await letterpress.launch({
        path: out,
        writeMarkdown: false
      })

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
      if (press && press.close) {
        press.close()
      }
    }

    expected.forEach(p => t.ok(fs.existsSync(path.join(out, p)), 'exists: ' + p))
    t.end()
  })
})
