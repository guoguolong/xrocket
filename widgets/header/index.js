function updateCartIndicator() {
  var cart = JSON.parse(window.sessionStorage.getItem("cart")) || [];  
  $('header .qty .value').innerHTML = cart.length;
  if (cart.length > 0)
    $('header .link-cart a').className = 'cart-hightlight';
  else
    $('header .link-cart a').className = '';        
}  

function widgetHeader() {
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
    var user = window.sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      $('.link-login').style.display = 'none';
      $('.link-userinfo').style.display = 'block';
      $('.link-logout').style.display = 'block';
      $('.link-userinfo').innerHTML = 'Welcome ' + user.nickname;
    } else {
      $('.link-login').style.display = 'block';
      $('.link-userinfo').style.display = 'none';
      $('.link-logout').style.display = 'none';
    }

    $('.link-logout').onclick = function () {
      window.sessionStorage.removeItem('user');
      window.location.href = '/pages/login/index.html'
    }
  }

  function toggleSearchBar() {
    var searchBar = $('.search-bar');
    var openCtrl = $('.link-search');
    var closeCtrl = $('.search-bar .action-close');
    var maskname = '#modalbox';

    function activate() {
      searchBar.style.display = 'flex';
      $('body').style.overflow = 'hidden';
    }

    function deactivate() {
      searchBar.style.display = 'none';
      $('body').style.overflow = 'auto';     
    }

    openCtrl.onclick = function() {
      activate();
    }

    closeCtrl.onclick = function() {
      deactivate();
    }

    if (window.location.hash === maskname) {
      activate();
    }
  }

  $('.search-input').onkeydown = function (e) {
    var evt = window.event || e; 
    var keyword = e.target.value.trim();
    if (evt.keyCode == 13 && keyword){
      window.location.href= `/pages/products/index.html?keyword=${keyword}`;
    }
  }

  updateCartIndicator();
  renderMenu();
  checkUserLogin();
  toggleSearchBar();
}

widgetHeader();