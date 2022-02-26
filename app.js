let msg = 'hello';
console.log(msg);
const e = require('express');
var express = require('express');
var md = require('markdown-it')();
var decode = require('decode-html')
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
  var url = new URL(ref);

  const relPath = '.' + url.pathname + '.md';
  const body = "";
  if (req.body.markdown) {
    const dir = url.pathname.split('/')[1];
    fs.mkdirSync(dir, { recursive: true })
    console.log('req.body.markdown',req.body.markdown);
    fs.writeFileSync(relPath, decode(req.body.markdown));
  }

  if (ref.match(/create/)) {
    resp.send('OK, dude')
  } else {
    resp.redirect(ref);
  }
});

app.get('*', (req, resp) => {

    let data = "";
    let file = ""
    try {
        const relPath = '.' + req.path + '.md';
        if (fs.existsSync(relPath)) {
          file = fs.readFileSync(relPath, 'utf8')
          data = md.render(file);
        } else {
          // new page
          data = "No page found, create a new one?"
        }
      } catch (err) {
        data = err.stack;
      }
    const wrapped = wrapper.replace(/BODY/g, data);
    resp.send(wrapped + form.replace(/REPLACEME/g, file));
});

app.listen(80);