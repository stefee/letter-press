#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const press = require('.')
const letter = require('./test.md')

const date = new Date()
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json')))
data.from.forEach(from => data.to.forEach(to => {
  const today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  const md = letter(today, from, to)
  const id = from.id + '_' + to.id
  press(id, md)
}))
