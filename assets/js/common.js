function $id(id) {
  return document.getElementById(id);
}

function $(className) {
  return document.querySelector(className);
}

function $$(className) {
  return document.querySelectorAll(className);
}

function queryParse(query) {
  if (!query) return {};
  var q = query.split('?')[1];
  if (!q) return {};

  var qArr = q.split('&');
  var result = {};
  for (var i = 0; i < qArr.length; i++) {
    var pair = qArr[i].split('=');
    result[pair[0]] = pair[1];
  }
  return result;
}

// function setCookie(cname,cvalue,exdays) {
//   var d = new Date();
//   d.setTime(d.getTime()+(exdays*24*60*60*1000));
//   var expires = "expires="+d.toGMTString();
//   document.cookie = cname + "=" + cvalue + "; " + expires + ';path=/';
// }

// function getCookie(cname)
// {
//   var name = cname + "=";
//   var ca = document.cookie.split(';');
//   for(var i=0; i<ca.length; i++) 
//   {
//     var c = ca[i].trim();
//     if (c.indexOf(name)==0) return c.substring(name.length,c.length);
//   }
//   return "";
// }