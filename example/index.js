#!/usr/bin/env node

const letterpress = require('..')
const path = require('path')

const list = [
  { id: 'letter1', sender: 'Your Secret Admirer', recipient: 'John' },
  { id: 'letter2', sender: 'Your Secret Admirer', recipient: 'Tanya' }
  // ...
]

;(async () => {
  let press
  try {
    press = await letterpress.launch({
      path: path.join(__dirname, 'dist'),
      template: path.join(__dirname, 'template.pug')
    })

    const jobs = []
    list.forEach(item => {
      const markdown = letter(item.sender, item.recipient)
      const job = press.print(item.id, markdown)
      jobs.push(job)
    })

    await Promise.all(jobs)
    press.close()
  } catch (e) {
    console.error(e.toString())
    if (press && press.close) press.close()
  }
})()

function letter (sender, recipient) {
  return `Dear ${recipient},

Here is some **bold text**. *Winky face*.

\`\`\`js
var x = ten()
x++
console.log(x)

function ten () {
  return 10
}
\`\`\`

Table Heading | Another Heading
------------- | ---------------
Item          | Item
Item Row 2    | This is a cool table!

Yours sincerely,
${sender}

🐈
`
}
