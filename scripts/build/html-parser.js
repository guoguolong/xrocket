const fs = require("fs");
const path = require("path");
const beautify = require('beautify');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function parseHtmlFile(htmlFileName) {
  const htmlStruct = {
    dom: null,
    link: {
      embed: {},
      links: {},
    },
    script: {
      embed: {},
      links: {},
    }
  }

  const content = fs.readFileSync(htmlFileName, 'utf-8');
  htmlStruct.dom = new JSDOM(content);
  const doc = htmlStruct.dom.window.document;

  function calcLinkInfo(tagName, htmlStruct) {
    if (tagName !== 'link' && tagName !== 'script') return;
    doc.querySelectorAll(tagName)?.forEach(node => {
      const href = node.getAttribute('href') || node.getAttribute('src');
      if (!href) return; // 内嵌 script

      let content = node;
      let type = 'links';

      if (!(href.match(/^http[s]{0,1}:/) || href.match(/^\//))) {
        content = fs.readFileSync(`${path.dirname(htmlFileName)}/${href}`, 'utf-8');
        type = 'embed';
      }

      htmlStruct[tagName][type][href] = { type, node, content };
    });
  }

  calcLinkInfo('link', htmlStruct)
  calcLinkInfo('script', htmlStruct)

  return htmlStruct;
}

module.exports = (_htmlFileName, isNormalized = false) => {
  let htmlFileName = _htmlFileName;
  let htmlStruct;

  // 如果不存在 embed 的link 和 script 文件，在同级目录下创建一个
  function normalized(_htmlStruct) {
    const struct = htmlStruct || _htmlStruct;
    if (Object.values(struct.link.embed).length < 1) {
      const filename = 'index.css';    
      const ele = struct.dom.window.document.createElement("link");
      ele.setAttribute('href', filename);
      ele.setAttribute('rel', 'stylesheet');
      ele.setAttribute('type', 'text/css');

      struct.link.embed[filename] = { node: ele, content: ''};
      fs.writeFileSync(`${path.dirname(htmlFileName)}/${filename}`, '');
    }
    if (Object.values(struct.script.embed).length < 1) {
      const filename = 'index.js';
      const ele = struct.dom.window.document.createElement("script");
      ele.setAttribute('src', filename);
      ele.setAttribute('type', 'text/javascript');
      
      struct.script.embed[filename] = { node: ele, content: ''};
      fs.writeFileSync(`${path.dirname(htmlFileName)}/${filename}`, '');
    }
  }

  function _cleanupLinkScriptFromDom(_dom) {
    const dom = _dom || htmlStruct.dom;
    const linkEles = dom.window.document.querySelectorAll('link');
    const scriptEles = dom.window.document.querySelectorAll('script');

    linkEles.forEach(ele => {
      if (ele.getAttribute('href')) ele.remove();
      // ele.parentNode.removeChild(ele);
    });
    scriptEles.forEach(ele => {
      if (ele.getAttribute('src')) ele.remove();
      // ele.parentNode.removeChild(ele);
    });
    return dom;
  }

  function updateLinkScriptToDom(_htmlStruct) {
    const struct = _htmlStruct || htmlStruct;

    // 清理先
    _cleanupLinkScriptFromDom(struct.dom);

    const headEle = struct.dom.window.document.querySelector('head');
    const bodyEle = struct.dom.window.document.querySelector('body');
    Object.values(struct.link.links).forEach(item => {
        headEle.appendChild(item.node);
    });
    Object.values(struct.link.embed).forEach(item => {
        headEle.appendChild(item.node);
    });
    Object.values(struct.script.links).forEach(item => {
        bodyEle.appendChild(item.node);
    });
    Object.values(struct.script.embed).forEach(item => {
        bodyEle.appendChild(item.node);
    });
    return struct;
  }

  htmlStruct = parseHtmlFile(htmlFileName);

  if (isNormalized) normalized();
  return {
    updateLinkScriptToDom,
    data: htmlStruct,
  }
}