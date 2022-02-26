let msg = 'hello';
console.log(msg);
const e = require('express');
var express = require('express');
var md = require('markdown-it')();
var markdownItAttrs = require('@gerhobbelt\\markdown-it-attrs');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

md.use(markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
});

const fs = require('fs');
const res = require('express/lib/response');

const wrapper = fs.readFileSync('index.html', 'utf8');
const form = fs.readFileSync('form.html', 'utf8');

app.use(express.static('public'));

app.post('/create', (req, resp) => {
  const ref = req.get('Referrer');
  console.log('ref', ref);
  console.log('req.body', req.body);
  var url = new URL(ref);
  console.log(url.pathname)

  const relPath = '.' + url.pathname + '.md';
  const body = "";
  if (!fs.existsSync(relPath)) {
    console.log('writing markdown,', req.body.markdown);
    fs.writeFileSync(relPath, req.body.markdown);
    // resp.send(wrapper.replace('BODY', req.body.markdown));
  }
  if (ref.match(/create/)) {
    resp.send('OK')
  } else {
    resp.redirect(ref);
  }
});

app.get('*', (req, resp) => {

    console.log(req.path);
    let data = "";
    try {
        const relPath = '.' + req.path + '.md';
        if (fs.existsSync(relPath)) {
          data = md.render(fs.readFileSync(relPath, 'utf8'));
        } else {
          // new page
          data = wrapper.replace('BODY', form); 
        }
      } catch (err) {
        data = err.stack;
      }
    const wrapped = wrapper.replace('BODY', data);
    resp.send(wrapped);
});

app.listen(3000);