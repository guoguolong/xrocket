function randomFrom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setupStep() {
  if (window.location.hash === '#shipping' || !window.location.hash) {
    $('.shipping-wrapper').style.display = 'block';
    $('.payment-wrapper').style.display = 'none';
    $('.pay-now-wrapper').style.display = 'none';
  } else if (window.location.hash === '#payment') {
    $('.shipping-wrapper').style.display = 'none';
    $('.payment-wrapper').style.display = 'block';
    $('.pay-now-wrapper').style.display = 'none';
  } else if (window.location.hash === '#pay-now') {
    $('.shipping-wrapper').style.display = 'none';
    $('.payment-wrapper').style.display = 'none';
    $('.pay-now-wrapper').style.display = 'block';
  }  
}

var cart = JSON.parse(window.sessionStorage.getItem('cart'));
if (cart) {
  $('.order-place-page .main').style.display = 'initial';
  $('.order-place-page .sidebar').style.display = 'initial';
  $('.order-place-page .empty').style.display = 'none';

  setupStep();
  window.onhashchange = setupStep;

  if (typeof widgetOrderedProducts !== 'undefined') widgetOrderedProducts(cart);
    
  $('.pay-now-wrapper .action-save').onclick = function() {
    var user = JSON.parse(window.sessionStorage.getItem('user'));

    var order = window.xrocket.purchasedOrder;
    order.id = `ON-${(new Date()).getTime()}-${randomFrom(100, 999)}`;
    order.status = 2; // 1 - 待支付, 2 - 已支付
    order.contact = user.email;
    order.products = JSON.parse(window.sessionStorage.getItem('cart'));

    var allOrders = JSON.parse(window.localStorage.getItem('orders')) || {};
    allOrders[user.username] = allOrders[user.username] || [];
    allOrders[user.username].push(order);

    // 持久化到 localStorage
    window.localStorage.setItem('orders', JSON.stringify(allOrders));

    // 清空购物车
    window.sessionStorage.removeItem("cart");
    // 清空暂存的订单数据
    window.xrocket.purchasedOrder = null;
    window.location.href = `/pages/order-detail/index.html?orderId=${order.id}`;
  }

  $('.pay-now-wrapper .return-to-payment').onclick = function() {
    window.location.href = "#payment";  
  }
} else {
  $('.order-place-page .main').style.display = 'none';
  $('.order-place-page .sidebar').style.display = 'none';
  $('.order-place-page .empty').style.display = 'initial';
}