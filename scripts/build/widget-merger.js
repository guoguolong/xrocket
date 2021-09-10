const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const glob = require("glob");
const jsdom = require("jsdom");
const beautify = require('beautify');
const HtmlParser = require('./html-parser');
const { JSDOM } = jsdom;

function $doc(htmlStruct) {
  return htmlStruct.dom.window.document;
}

module.exports = async (pagesDir, widgetDir) => {
  const options = {};
  const htmlFiles = glob.sync(`${pagesDir}/**/*.html`, options);
  htmlFiles.forEach(htmlFile => {
    try {

      const mainHtmlParser = HtmlParser(htmlFile, true);

      let mainEmbedLink = mainHtmlParser.data.link.embed['index.css'];
      let mainEmbedScript = mainHtmlParser.data.script.embed['index.js'];

      const widgetEles = mainHtmlParser.data.dom.window.document.querySelectorAll("widget");

      widgetEles?.forEach((ele) => {
        const widgetName = ele.getAttribute('name');
        const widgetHtmlParser = HtmlParser(`${widgetDir}/${widgetName}/index.html`);
        
        // 合并 html
        ele.outerHTML = widgetHtmlParser.data.dom.window.document.querySelector(`.${widgetName}`).outerHTML;

        // 处理 css
        Object.entries(widgetHtmlParser.data.link.embed).forEach(([filename, info]) => {
          mainEmbedLink.content = info.content + '\n' + mainEmbedLink.content;
        });

        Object.entries(widgetHtmlParser.data.link.links).forEach(([filename, info]) => {
          mainHtmlParser.data.link.links[filename] = info;
        });

        // 处理 js
        Object.entries(widgetHtmlParser.data.script.embed).forEach(([filename, info]) => {
          mainEmbedScript.content = info.content + '\n' + mainEmbedScript.content;
        });

        Object.entries(widgetHtmlParser.data.script.links).forEach(([filename, info]) => {
          mainHtmlParser.data.script.links[filename] = info;
        });
      })

      // 将更新后的 css 回写.
      fs.writeFileSync(`${path.dirname(htmlFile)}/${mainEmbedLink.node.getAttribute('href')}`,
        beautify(mainEmbedLink.content, { format: 'css' }));
        
      // 将更新后的 js 回写.
      fs.writeFileSync(`${path.dirname(htmlFile)}/${mainEmbedScript.node.getAttribute('src')}`, 
        beautify(mainEmbedScript.content, { format: 'js' }));

      // 回写 link 和 script 到 html文件.
      mainHtmlParser.updateLinkScriptToDom();
      fs.writeFileSync(htmlFile, beautify(mainHtmlParser.data.dom.serialize(), { format: 'html' }));
    } catch (e) {
      console.log(e);
    }
  });
}