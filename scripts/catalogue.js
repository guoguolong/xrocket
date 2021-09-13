const fs = require("fs");
const jsdom = require("jsdom");
const beautify = require('beautify');
const { JSDOM } = jsdom;
const catalogueParser = require('./build/catalogue-parser');

const APP_DIR = `${__dirname}/..`;

const indexHtmlFile = `${APP_DIR}/index.html`;
dom = new JSDOM(fs.readFileSync(indexHtmlFile, 'utf-8'));
doc = dom.window.document;

doc.querySelector('.pages ol').innerHTML = catalogueParser(`${APP_DIR}/pages/**/index.html`, '/pages').join('');
doc.querySelector('.widgets ol').innerHTML = catalogueParser(`${APP_DIR}/widgets/**/index.html`, '/widgets').join('');

fs.writeFileSync(indexHtmlFile, beautify(dom.serialize(), { format: 'html' }));