function updateMyOrdersIndicator() {
  var user = JSON.parse(window.sessionStorage.getItem('user'));
  if (user) {
    var allOrders = JSON.parse(window.localStorage.getItem('orders')) || [];
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var ordersForCurrUser = allOrders[user.username];
    if (ordersForCurrUser && ordersForCurrUser.length > 0) {
      $('header .link-orders a').className = 'cart-hightlight';
      $('header .link-orders a').innerHTML = `MY ORDERS(${ordersForCurrUser.length})`;
    } else {
      $('header .link-orders a').className = '';
      $('header .link-orders a').innerHTML = `MY ORDERS`;
    }
  }
}

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
    var categories = JSON.parse(window.localStorage.getItem('categories')) || [];
    for (var i = 0; i < categories.length; i++) {
      var c = categories[i];
      html += `<a href="/pages/products/index.html?c=${c.id}"><span>${c.title}</span></a>`;
    }
    $('.menu').innerHTML = html;
  }

  function checkUserLogin() {
    var user = window.sessionStorage.getItem('user');
    var $privateLinks = $$('.private-link');
    if (user) {
      user = JSON.parse(user);
      $('.link-signin').style.display = 'none';
      $('.userinfo').innerHTML = user.nickname;
    } else {
      for (var i = 0; i < $privateLinks.length; i++) {
        $privateLinks[i].style.display = 'none';
      }
      $('.link-signin').style.display = 'block';
      $('.userinfo').innerHTML = '';
    }
    for (var i = 0; i < $privateLinks.length; i++) {
      $privateLinks[i].style.display = user ? 'block' : 'none';
    }

    $('.link-signout').onclick = function () {
      window.sessionStorage.removeItem('user');
      window.location.href = '/pages/signin/index.html'
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
  updateMyOrdersIndicator();
  renderMenu();
  checkUserLogin();
  toggleSearchBar();
}

widgetHeader();