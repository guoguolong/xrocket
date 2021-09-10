const postcss = require('postcss');
const beautify = require('beautify');
const cssnano = require('cssnano');
const cssnanoPreset = require('cssnano-preset-advanced');
const autoprefixer = require('autoprefixer');
const glob = require("glob");
const fs = require("fs");

module.exports = async (pathPattern) => {
  const options = {};

  const cssFiles = glob.sync(pathPattern, options);
  cssFiles.forEach(async filename => {
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
  });
}