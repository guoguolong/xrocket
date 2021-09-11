const APP_DIR = `${__dirname}/..`;

const analysis = require('./build/analysis');
analysis(`${APP_DIR}/report.html`, `${APP_DIR}/dist/**/*.css`);


