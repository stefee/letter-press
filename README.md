# letter-press

Print GitHub Markdown to PDF using headless Chrome.

## Example

Print `letter.md` to `dist/letter.pdf` then log a completion message.

```js
const letterpress = require('letter-press')
const letter = fs.readFileSync(path.join(__dirname, 'letter.md'))

letterpress.print('letter', letter)
  .then(() => console.log('🐈  done'))
```

#### Example: Print multiple letters using a template

Print letters to `dist/*.pdf` based on a Markdown template and some data (e.g. mailing list).

```js
const letterpress = require('letter-press')

const letter = (sender, recipient) =>
`Dear ${recipient},

Here is some **bold text**. *Winky face*.

Yours sincerely,
${sender}
`
const list = [
  { id: 'letter1', sender: 'Your Secret Lesbian Admirer', recipient: 'John' }
  // ...
];

(async () => {
  const press = await letterpress.launch()

  const jobs = []
  list.forEach(item => {
    const markdown = letter(item.sender, item.recipient)
    const job = press.print(item.id, markdown)
    jobs.push(job)
  })

  await Promise.all(jobs)
  press.close()
})()
```

## API

### `letterpress.print(id, markdown, [opts])`
Print the given `markdown` string to PDF. **Return:** Promise

Writes the following files:<br>
`dist/id.html`<br>
`dist/id.pdf`

### `letterpress.launch([opts])`
Launch a new Press. **Return:** Promise of Press

### `Press.prototype.print(id, markdown, [opts])`
Print the given `markdown` string to PDF. **Return:** Promise of Press

Writes the following files:<br>
`dist/id.html`<br>
`dist/id.pdf`

The returned Promise resolves with the Press object so that tasks can be chained together (e.g. `letterpress.launch` then `press.print` then `press.close`). However, it is not necessary to wait for a `print` to resolve before calling `print` again - print scheduling is all handled under the hood.

### `Press.prototype.close()`
Close this Press. Call after all prints have resolved.

### Options
These options can be set at launch and/or for each print.

`opts.path` Path to output folder. **Default:** `dist`

`opts.quiet` Only log errors. **Default:** `false`

`opts.template` Path to pug template file used when generating HTML. The template must contain a `!=content`, and may contain a `!=title`. **Default:** [Template File](https://github.com/srilq/letter-press/blob/master/ghmd.pug)

`opts.markdown` Options passed to markdown-it `new MarkdownIt(opts)`. [API](https://github.com/markdown-it/markdown-it#api)

`opts.pdf` Options passed to puppeteer `page.pdf(opts)`. [API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions)
