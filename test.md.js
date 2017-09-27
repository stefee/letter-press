module.exports = (date, from, to) =>
`<p style="text-align: right">${date}</p>

${from.salutation}, 🐈

Nullam quis risus eget urna mollis ornare vel eu leo ${to.info}, ${to.name}.

Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur.

[![downloads](https://img.shields.io/npm/dm/letter-press.svg?style=flat-square)](https://npmjs.org/package/letter-press)

Inline-image: ![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

The [Frogs Website][Frogs Website]

\`\`\`js
var x = ten()
x++
console.log(x)

function ten () {
  return 10
}
\`\`\`

Table Heading  | Another Heading
-------------- | ---------------
Item           | Item
Item Row 2     | This is a cool table!
Item Row other | nice

    function code () {
      return 'this is code'
    }

Some \`inline code\`

Nulla vitae elit libero, a pharetra augue. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

---

Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed diam eget risus varius blandit sit amet non *${from.website}* and on GitHub at *https://github.com/${from.github}*. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor.

Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam quis risus eget urna mollis ornare vel eu leo.

> A blockquote is here
> and it's pretty cool!

Nulla vitae elit libero, a pharetra augue. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean lacinia bibendum nulla sed consectetur. Aenean lacinia bibendum nulla sed consectetur.

***

Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Yours faithfully,
${from.name}

[Frogs Website]: https://www.frogs.fun
`
