const fs = require('fs');
const res = require('express/lib/response');

const wrapper = fs.readFileSync('index.html', 'utf8');
const form = fs.readFileSync('form.html', 'utf8');
