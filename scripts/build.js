const fsExtra = require("fs-extra");
const badge = require('./build/badge');
const less2css = require('./build/less2css');
const tidycss = require('./build/tidycss');
const widgetMerger = require('./build/widget-merger');
const analysis = require('./build/analysis');
const catalogue = require('./catalogue');

const APP_DIR = `${__dirname}/..`;
const DIST_DIR = `${APP_DIR}/dist`;

function initDist() {
  fsExtra.removeSync(DIST_DIR);
  fsExtra.copySync(`${APP_DIR}/favicon.ico`, `${DIST_DIR}/favicon.ico`)
  fsExtra.copySync(`${APP_DIR}/pages`, `${DIST_DIR}/pages`)
  fsExtra.copySync(`${APP_DIR}/data`, `${DIST_DIR}/data`)
  fsExtra.copySync(`${APP_DIR}/assets`, `${DIST_DIR}/assets`)
  fsExtra.copySync(`${APP_DIR}/widgets`, `${DIST_DIR}/widgets`)
  fsExtra.copySync(`${APP_DIR}/index.html`, `${DIST_DIR}/index.html`)
  fsExtra.copySync(`${APP_DIR}/report.html`, `${DIST_DIR}/report.html`)
}

(async () => {
  initDist();
  badge('.built', `${DIST_DIR}/**/*.html`);
  await less2css(`${DIST_DIR}/**/*.less`, `${APP_DIR}\/assets`);
  await widgetMerger(`${DIST_DIR}/pages`, `${DIST_DIR}/widgets`);
  await tidycss(`${DIST_DIR}/pages/**/*.css`);
  
  analysis(`${DIST_DIR}/report.html`, `${DIST_DIR}/**/*.css`);
})();