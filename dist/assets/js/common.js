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
  query = query.slice(1);
  var result = {};

  var params = query.split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    var idxOfEqual = params[i].indexOf('=');
    result[param.slice(0, idxOfEqual)] = param.slice(idxOfEqual + 1);
  }
  return result;
}

function linkToProdPage(id) {
  window.location.href = `/pages/product-detail/index.html?id=${id}`;
}

function createNodeFromHtml(templateHtml, className) {
  className = className || 'template';
  var template = `<div class="${className}">${templateHtml}</div>`;
  var doc = new DOMParser().parseFromString(template, 'text/html');
  return doc.querySelector('.' + className);
}

function applyStyle(style, selector) {
  if (style === true) {
    style = {
      width: '800px',
      margin: '30px auto',
      padding: '20px',
      'border-radius': '4px',
      'border': '1px solid #E5E5E5',
    }
  }
  if (typeof style === 'object') {
    var oldStyle = $(selector).style;
    for (var name in style) {
      oldStyle[name] = style[name];
    }
  }
}

function widgetMock() {
  var widgets = $$('widget');
  for (var i = 0; i < widgets.length; i++) {
    var widget = widgets[i];
    widget.className = 'widget';
    if (widget.getAttribute('width')) widget.style.width = widget.getAttribute('width');
    if (widget.getAttribute('height')) widget.style.height = widget.getAttribute('height');
    widget.innerHTML = widget.getAttribute('name');
  }
}
widgetMock();

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
