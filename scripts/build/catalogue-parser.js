const glob = require("glob");
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = (pathPattern, basePath = '/') => {
  const pages = [];
  const htmlFiles = glob.sync(pathPattern, {});
  htmlFiles.forEach(htmlFile => {
    const key = htmlFile.split('/')[htmlFile.split('/').length - 2];
    dom = new JSDOM(fs.readFileSync(htmlFile, 'utf-8'));
    doc = dom.window.document;

    const $meta = doc.querySelector('meta[name="description"]');
    if ($meta) {
      const [seq, title, search, deprecated] = $meta.getAttribute('content').split(':')
      if (title && deprecated !== 'deprecated') {
        pages.push([key, title.trim(), seq, search]);
      }
    } else {
      const $title = doc.querySelector('title');
      if ($title) {
        let [brandName, title] = $title.innerHTML.split('-');
        if (brandName.trim().toLowerCase() !== 'xrocket') {
          title = brandName.trim();
        }
        pages.push([key, title.trim(), 1000]);
      }
    }
  });

  // 正序排列
  pages.sort((curr, next)=> {
    if (curr[2] > next[2]) {
      return 1;
    } else if(curr[2] < next[2]){
      return -1;
    } else {
      return 0;
    }
  });

  const pageHtml = pages.map(page => {
    const [key, title, seq, search] = page;
    return `<li><a href="${basePath}/${key}/index.html${search || ''}">${title}</a></li>`;
  })
  return pageHtml;
}