# letter-press

Print markdown letters.

## Example

```js
const press = require('letter-press')
const fs = require('fs')
const path = require('path')

const example = fs.readFileSync(path.join(__dirname, 'example.md'))
press('example', example, { dist: 'dist' })
    .then(() { console.log('Done!') })
```

## API

### `press(id, markdown, [opts])`
Print the given `markdown` string. Writes the following files:

`dist/id.md`<br>
`dist/id.html`<br>
`dist/id.pdf`<br>

Returns a Promise. **Note:** The markdown `.md` file is written asynchronously.

#### Options
`opts.dist` path to output folder. **Default:** `dist`<br>
`opts.quiet` only log errors. **Default:** `false`<br>
`opts.markdown` options passed to markdown-it `new MarkdownIt(opts)` [API](https://github.com/markdown-it/markdown-it#api)<br>
`opts.pdf` options passed to puppeteer `page.pdf(opts)` [API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions)
