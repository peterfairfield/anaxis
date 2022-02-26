let msg = 'hello';
console.log(msg);
const e = require('express');
var express = require('express');
var md = require('markdown-it')();
var markdownItAttrs = require('@gerhobbelt\\markdown-it-attrs');
var app = express();

md.use(markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
});

const fs = require('fs');

const wrapper = fs.readFileSync('index.html', 'utf8');

app.get('*', (req, resp) => {
    console.log(req.path);
    let data = "";
    try {
        const relPath = '.' + req.path + '.md';
        if (fs.existsSync(relPath)) {
          data = fs.readFileSync(relPath, 'utf8');
        } else {
          // create it
          fs.writeFileSync(relPath, '# New Page')
          data = "# New Page Created"         
        }
      } catch (err) {
        data = err.stack;
      }
    const rendered = md.render(data);
    const wrapped = wrapper.replace('BODY', rendered);
    resp.send(wrapped);
});

app.listen(3000);