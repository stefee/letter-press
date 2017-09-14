#!/usr/bin/env node

const letterpress = require('..')
const path = require('path')

const letter = (sender, recipient) =>
`Dear ${recipient},

Here is some **bold text**. *Winky face*.

Yours sincerely,
${sender}
`
const list = [
  { id: 'letter1', sender: 'Your Secret Lesbian Admirer', recipient: 'John' },
  { id: 'letter2', sender: 'Your Secret Lesbian Admirer', recipient: 'Tanya' }
  // ...
];

(async () => {
  const press = await letterpress.launch({
    path: path.join(__dirname, 'dist')
  })

  const jobs = []
  list.forEach(item => {
    const markdown = letter(item.sender, item.recipient)
    const job = press.print(item.id, markdown)
    jobs.push(job)
  })

  await Promise.all(jobs)
  press.close()
})()
