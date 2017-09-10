#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const press = require('.')
const letter = require('./test.md')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json')))
const date = new Date()
const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
data.from.forEach(from => data.to.forEach(to => {
  const md = letter(dateString, from, to)
  const id = from.id + '_' + to.id
  press(id, md)
}))
