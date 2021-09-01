function renderMenu() {
  var html = '';
  var categories = JSON.parse(window.localStorage.getItem('categories'));
  for (var i = 0; i < categories.length; i++) {
    var c = categories[i];
    html += `<a href="/pages/products/index.html?c=${c.id}"><span>${c.title}</span></a>`;
  }
  $('.menu').innerHTML = html;
}

function checkUserLogin() {
  var username = window.sessionStorage.getItem('token');
  if (username) {
    $('.link-login').style.display = 'none';
    $('.link-userinfo').style.display = 'block';
    $('.link-logout').style.display = 'block';
    $('.link-userinfo').innerHTML = '欢迎' + window.sessionStorage.getItem('token');
  } else {
    $('.link-login').style.display = 'block';
    $('.link-userinfo').style.display = 'none';
    $('.link-logout').style.display = 'none';
  }

  $('.link-logout').onclick = function () {
    window.sessionStorage.removeItem('token');
    window.location.href = '/pages/home/index.html'
  }
}

renderMenu();
checkUserLogin();
