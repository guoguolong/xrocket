function randomFrom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function onStepChange() {
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
  renderOrderInfo();
}

function renderOrderInfo() {
  var user = JSON.parse(window.sessionStorage.getItem('user'));
  window.xrocket.purchasedOrder = window.xrocket.purchasedOrder || {
    contact: user.email
  }
  var purchasedOrder = window.xrocket.purchasedOrder;
  if (purchasedOrder) {
    $('.section-order-info .contact').innerHTML = purchasedOrder.contact;

    var addr = purchasedOrder.shippingAddr;
   
    if (addr) {
      $('.section-order-info .shipping-address').innerHTML = `${addr.address}, ${stateData[addr.country][addr.state]}, ${countryData[addr.country]}, ${addr.zipcode}`
      $('.section-order-info .shipping-address-line').style.display = 'flex';
    } else {
      $('.section-order-info .shipping-address-line').style.display = 'none';
    }
    
    var cc = purchasedOrder.creditCard;
    if (cc) {
      $('.section-order-info .credit-card').innerHTML = `Card No: ${cc.cardNo}, Name on Card: ${cc.nameOnCard}`;
      $('.section-order-info .credit-card-line').style.display = 'flex';
    } else {
      $('.section-order-info .credit-card-line').style.display = 'none';
    }

    if (purchasedOrder.shippingMethod) {
      $('.section-order-info .shipping-method').innerHTML = `${ORDER_ENUM.shippingMethod[purchasedOrder.shippingMethod].label}`;
      $('.section-order-info .shipping-method-fee').innerHTML = `${ORDER_ENUM.shippingMethod[purchasedOrder.shippingMethod].amount}`;

      $('.section-order-info .shipping-method-line').style.display = 'flex';
    } else {
      $('.section-order-info .shipping-method-line').style.display = 'none';
    }
    
    if (purchasedOrder.billingAddressType) {
      $('.section-order-info .billing-address').innerHTML = `${ORDER_ENUM.billingAddressType[purchasedOrder.billingAddressType]}`;
      $('.section-order-info .billing-address-line').style.display = 'flex';
    } else {
      $('.section-order-info .billing-address-line').style.display = 'none';
    }
  }
}

var cart = JSON.parse(window.sessionStorage.getItem('cart'));

// 测试数据
// window.xrocket = {
//   purchasedOrder: {"contact":"allen@gmail.com","shippingAddr":{"firstName":"Allen","lastName":"Guo","address":"Nanjign Yya","apartment":"aprat","city":"Nanjing","country":"US","state":"AL","zipcode":"234213","phone":"18551710938"},"shippingMethod":1,"creditCard":{"cardNo":"CA-02354235","nameOnCard":"3","expDate":"09/11","securityCode":"887"},"billingAddressType":1}
// };

window.sessionStorage.getItem('cart')
if (cart) {
  $('.order-place-page .main').style.display = 'initial';
  $('.order-place-page .sidebar').style.display = 'initial';
  $('.order-place-page .empty').style.display = 'none';

  $('.section-order-info .action-shipping-step').onclick = function() {
    window.location.href = "#shipping";
  }

  $('.section-order-info .action-payment-step').onclick = function() {
    window.location.href = "#payment";
  }

  onStepChange();
  window.onhashchange = onStepChange;

  if (typeof widgetOrderedProducts !== 'undefined') widgetOrderedProducts(cart);
    
  $('.pay-now-wrapper .action-save').onclick = function() {
    var user = JSON.parse(window.sessionStorage.getItem('user'));

    var order = window.xrocket.purchasedOrder;
    order.id = `ON-${(new Date()).getTime()}-${randomFrom(100, 999)}`;
    order.status = 2; // 1 - 待支付, 2 - 已支付
    order.contact = user.email;
    order.products = JSON.parse(window.sessionStorage.getItem('cart'));
    order.total = 0;
    for (var i = 0; i < order.products.length; i++) {
      var prd = order.products[i];
      order.total += prd.qty * prd.price;
    }
    order.total += ORDER_ENUM.shippingMethod[order.shippingMethod].amount;


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