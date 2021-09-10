const fsExtra = require("fs-extra");
const glob = require("glob");
const less = require("less");
const fs = require("fs");

module.exports = async (pathPattern, assetsDir) => {
  const options = {}
  const lessFiles = glob.sync(pathPattern, options);

  await Promise.all(lessFiles.map(async lessFile => {
    let lessContent = fs.readFileSync(lessFile, 'utf-8');
    lessContent = lessContent.replace(/@import "(.*)\/assets/, `@import "${assetsDir}`);

    const cssFile = lessFile.replace(/\.less$/, '.css')
    const output = await less.render(lessContent);
    fs.writeFileSync(cssFile, output.css)
  }));

  // 删除less
  const files = glob.sync(pathPattern, options);
  files.forEach(lessFile => {
    fsExtra.removeSync(lessFile);
  });
}