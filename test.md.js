module.exports = (date, from, to) =>
`<p style="text-align: right">${date}</p>

${from.salutation},

Nullam quis risus eget urna mollis ornare vel eu leo the ${to.position} position at ${to.company}.

Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur.

\`\`\`js
var x = ten()
x++
console.log(x)

function ten () {
  return 10
}
\`\`\`

Nulla vitae elit libero, a pharetra augue. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed diam eget risus varius blandit sit amet non *${from.website}* and on GitHub at *https://github.com/${from.github}*. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor.

Yours faithfully,
${from.name}

Website: *${from.website}*
Email: *${from.email}*
Email (UKC): *${from.emailUKC}*
Mob: ${from.mob}
`
