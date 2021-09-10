const fs = require('fs');
const glob = require('glob');
const beautify = require('beautify');

const APP_DIR = `${__dirname}/..`;

function parseCssLines(css, lines) {
    css = beautify(css, {format: 'css'});
    const cssLines = css.split('\n');
    cssLines.forEach(line => {
        if (line.match(/^[ ]{4}.*:.+/)) {
            line = line.trim();
            if (line.match(/;$/)) line = line.slice(0, line.length - 1);

            if (line.match(/\{$/) 
                || line.match(/^\/\//)
                || line.match(/^\/\*/)
                ) return;
            let [propName, propValue] = line.split(':')
            propValue = propValue.trim();

            lines[propName] = lines[propName] || {
                values: {},
                total: 0,
            };

            if (propValue.match(/px$|vw$|vh$|em$|rem$/i)) {
              propValue = propValue.replace(/\d/g, '').toLowerCase();
            }

            lines[propName].values[propValue] = lines[propName].values[propValue] || 0;
            lines[propName].values[propValue] ++;
            lines[propName].total ++;
        }
    })
}

const lines = {};
const files = glob.sync(`${APP_DIR}/dist/**/*.css`)
files.forEach(file => {
    const css = fs.readFileSync(file, 'utf-8');
    parseCssLines(css, lines)
})


const lineArr = Object.entries(lines)

lineArr.sort((curr, next)=> {
    if (curr[1].total > next[1].total) {
        return -1;
    } else if(curr[1].total < next[1].total){
        return 1;
    } else {
        return 0;
    }
});

const filename = `${APP_DIR}/report.html`;
let content = fs.readFileSync(filename, 'utf-8');
content = content.replace(/<script type="text\/javascript" data-type="report">[\s\S]*?<\/script>/, 
    `<script type="text/javascript" data-type="report">\n var reportData = ${JSON.stringify(lineArr)};\n</script>`);
fs.writeFileSync(filename, content);