const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const glob = require("glob");
const less = require("less");
const options = {};
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const APP_DIR = `${__dirname}/..`;
const DIST_DIR = `${APP_DIR}/dist`;

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

(async () => {
  initDist();

  await processLess();

  const htmlFiles = glob.sync(`${DIST_DIR}/pages/**/*.html`, options);
  htmlFiles.forEach(htmlFile => {
    try {
      const dom = new JSDOM(fs.readFileSync(htmlFile, 'utf-8'));
      let firstLinkEle = dom.window.document.querySelectorAll('link')?.[1];

      let firstScriptEle;
      const scripts = dom.window.document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.getAttribute('src') === 'index.js') {
          firstScriptEle = script;
        }
      })

      const widgetEles = dom.window.document.querySelectorAll("widget");
      widgetEles?.forEach(ele => {
        const widgetName = ele.getAttribute('name');
        const widgetInfo = readWidgetInfo(widgetName);
        // 处理 html
        ele.outerHTML = widgetInfo.dom.window.document.querySelector(`.${widgetName}`).outerHTML;

        // 处理 css
        if (firstLinkEle) {
          const href = firstLinkEle.getAttribute('href');
          const firstCssFilename = `${path.dirname(htmlFile)}/${href}`;
          let firstCssContent = fs.readFileSync(firstCssFilename, 'utf-8');
          widgetInfo.css.forEach(css => {
            if (css.type === 'content') {
              firstCssContent = css.content + '\n' + firstCssContent;
            } else {
              firstLinkEle.parentElement.insertBefore(css.content, firstLinkEle);
            }
          })
          fs.writeFileSync(firstCssFilename, firstCssContent)
        }

        // 处理 js
        if (firstScriptEle) {
          const scriptName = firstScriptEle.getAttribute('src');
          const firstFilename = `${path.dirname(htmlFile)}/${scriptName}`;
          let firstContent = fs.readFileSync(firstFilename, 'utf-8');
          widgetInfo.script.forEach(item => {
            if (item.type === 'content') {
              firstContent = item.content + '\n' + firstContent;
            } else {
              firstScriptEle.parentElement.insertBefore(item.content, firstScriptEle);
            }
          })
          fs.writeFileSync(firstFilename, firstContent)
        }
      })

      fs.writeFileSync(htmlFile, dom.serialize());
    } catch (e) {
      console.log(e);
    }
  });

  // 后处理 css， tdiy.
  const cssFiles = glob.sync(`${DIST_DIR}/pages/**/*.css`, options);
  cssFiles.forEach(cssFile => {
    postProccessCss(cssFile);
  });
})();