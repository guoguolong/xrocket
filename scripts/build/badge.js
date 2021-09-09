const glob = require("glob");
const fs = require("fs");
const jsdom = require("jsdom");
const beautify = require('beautify');
const { JSDOM } = jsdom;

module.exports = (nodeKey, paths) => {
  function dateFtt(fmt, date)  {
    var o = { 
      "M+" : date.getMonth() + 1, //月份 
      "d+" : date.getDate(),      //日 
      "h+" : date.getHours(),     //小时 
      "m+" : date.getMinutes(),   //分 
      "s+" : date.getSeconds(),   //秒 
      "q+" : Math.floor((date.getMonth()+3)/3), //季度 
      "S" : date.getMilliseconds()    //毫秒 
    }; 
    if(/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    for(var k in o) 
      if(new RegExp("("+ k +")").test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
    return fmt; 
  }

  // // 更新头文件
  const now = dateFtt('hh:mm:ss MM/dd', new Date());
  const builtAt = 'built@' + now;

  const htmlFiles = glob.sync(paths, {});
  htmlFiles.forEach(htmlFile => {
    dom = new JSDOM(fs.readFileSync(htmlFile, 'utf-8'));
    if (dom.window.document.querySelector('title')) {
      dom.window.document.querySelector('title').innerHTML += '@' + now;
    }
    if (dom.window.document.querySelector(nodeKey)) {
      dom.window.document.querySelector(nodeKey).innerHTML = builtAt;
      fs.writeFileSync(htmlFile, beautify(dom.serialize(), { format: 'html' }));  
    }
    fs.writeFileSync(htmlFile, beautify(dom.serialize(), { format: 'html' }));
  });
}
