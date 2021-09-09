const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const glob = require("glob");
const less = require("less");
const jsdom = require("jsdom");
const beautify = require('beautify');
const HtmlParser = require('./build/html-parser');
const Badge = require('./build/badge');
const { JSDOM } = jsdom;

const APP_DIR = `${__dirname}/..`;
const DIST_DIR = `${APP_DIR}/dist`;
const options = {};

function initDist() {
  // fsExtra.removeSync(DIST_DIR)
  fsExtra.copySync(`${APP_DIR}/favicon.ico`, `${DIST_DIR}/favicon.ico`)
  fsExtra.copySync(`${APP_DIR}/pages`, `${DIST_DIR}/pages`)
  fsExtra.copySync(`${APP_DIR}/data`, `${DIST_DIR}/data`)
  fsExtra.copySync(`${APP_DIR}/assets`, `${DIST_DIR}/assets`)
  fsExtra.copySync(`${APP_DIR}/widgets`, `${DIST_DIR}/widgets`)
  fsExtra.copySync(`${APP_DIR}/index.html`, `${DIST_DIR}/index.html`)
}

function readWidgetInfo(widgetName) {
  const resp = {
    dom: null,
    css: [],
    script: [],
    cssLinks: {},
    scriptLinks: {}
  }
  const widgetHtmlFile = `${DIST_DIR}/widgets/${widgetName}/index.html`;
  const content = fs.readFileSync(widgetHtmlFile, 'utf-8');
  resp.dom = new JSDOM(content);

  resp.dom.window.document.querySelectorAll('link')?.forEach(linkEle => {
    const href = linkEle.getAttribute('href');
    if (!(href.match(/^http[s]{0,1}:/) || href.match(/^\//))) {
      const content = fs.readFileSync(`${path.dirname(widgetHtmlFile)}/${href}`, 'utf-8');
      resp.css.push({ type: 'content', content: content })
    } else {
      resp.css.push({ type: 'link', content: linkEle });
      resp.cssLinks[href] = href;
    }
  });

  resp.dom.window.document.querySelectorAll('script')?.forEach(scriptEle => {
    const scriptName = scriptEle.getAttribute('src');
    if (scriptName.match(/^[^/]/)) {
      const content = fs.readFileSync(`${path.dirname(widgetHtmlFile)}/${scriptName}`, 'utf-8');
      resp.script.push({ type: 'content', content: content })
    } else {
      resp.script.push({ type: 'link', content: scriptEle });
      resp.scriptLinks[scriptName] = scriptName;
    }
  });

  return resp;
}

async function processLess() {
  const lessFiles = glob.sync(`${DIST_DIR}/**/*.less`, options);

  await Promise.all(lessFiles.map(async lessFile => {
    let lessContent = fs.readFileSync(lessFile, 'utf-8');
    lessContent = lessContent.replace(/@import "(.*)\/assets/, `@import "${APP_DIR}\/assets`);

    const cssFile = lessFile.replace(/\.less$/, '.css')
    const output = await less.render(lessContent);
    fs.writeFileSync(cssFile, output.css)
  }));

  // 删除less
  const files = glob.sync(`${DIST_DIR}/**/*.less`, options);
  files.forEach(lessFile => {
    fsExtra.removeSync(lessFile);
  });
}

async function postProccessCss(filename) {
  const fs = require('fs');
  const postcss = require('postcss');
  const cssnano = require('cssnano');
  const cssnanoPreset = require('cssnano-preset-advanced');
  const autoprefixer = require('autoprefixer');
  const beautify = require('beautify');

  const css = fs.readFileSync(filename, 'utf-8');

  const result = await postcss([cssnano({
    preset: cssnanoPreset({
      discardComments: true,
    }),
    plugins: [
      autoprefixer
    ]
  })]).process(css, {
    from: undefined
  });

  fs.writeFileSync(filename, beautify(result.css, { format: 'css' }))
}

async function mergeWidgets() {
  const htmlFiles = glob.sync(`${DIST_DIR}/pages/**/*.html`, options);
  htmlFiles.forEach(htmlFile => {
    try {

      const mainHtmlParser = HtmlParser(htmlFile, true);

      let mainEmbedLink = mainHtmlParser.data.link.embed['index.css'];
      let mainEmbedScript = mainHtmlParser.data.script.embed['index.js'];

      const widgetEles = mainHtmlParser.data.dom.window.document.querySelectorAll("widget");

      widgetEles?.forEach((ele) => {
        const widgetName = ele.getAttribute('name');
        const widgetHtmlParser = HtmlParser(`${DIST_DIR}/widgets/${widgetName}/index.html`);

        const widgetInfo = readWidgetInfo(widgetName);
        
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

// function addBuiltBadge(nodeKey) {
//   function dateFtt(fmt, date)  {
//     var o = { 
//       "M+" : date.getMonth() + 1, //月份 
//       "d+" : date.getDate(),      //日 
//       "h+" : date.getHours(),     //小时 
//       "m+" : date.getMinutes(),   //分 
//       "s+" : date.getSeconds(),   //秒 
//       "q+" : Math.floor((date.getMonth()+3)/3), //季度 
//       "S" : date.getMilliseconds()    //毫秒 
//     }; 
//     if(/(y+)/.test(fmt))
//       fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
//     for(var k in o) 
//       if(new RegExp("("+ k +")").test(fmt)) 
//     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
//     return fmt; 
//   }

//   // // 更新头文件
//   const now = dateFtt('hh:mm:ss MM/dd', new Date());
//   const builtAt = 'built@' + now;

//   const htmlFiles = glob.sync(`${DIST_DIR}/**/*.html`, options);
//   htmlFiles.forEach(htmlFile => {
//     // console.log(htmlFile)
//     dom = new JSDOM(fs.readFileSync(htmlFile, 'utf-8'));
//     if (dom.window.document.querySelector('title')) {
//       dom.window.document.querySelector('title').innerHTML += '@' + now;
//     }
//     if (dom.window.document.querySelector(nodeKey)) {
//       dom.window.document.querySelector(nodeKey).innerHTML = builtAt;
//       fs.writeFileSync(htmlFile, beautify(dom.serialize(), { format: 'html' }));  
//     }
//     fs.writeFileSync(htmlFile, beautify(dom.serialize(), { format: 'html' }));
//   });
// }

(async () => {
  initDist();

  Badge('.built', `${DIST_DIR}/**/*.html`);

  await processLess();
  await mergeWidgets();

  // 后处理 css， tdiy.
  const cssFiles = glob.sync(`${DIST_DIR}/pages/**/*.css`, options);
  cssFiles.forEach(cssFile => {
    postProccessCss(cssFile);
  });
})();