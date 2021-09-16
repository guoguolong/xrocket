(function () {
  // 设置测试数据 
  // window.localStorage.setItem('orders', '{"allen":[{"total": 453.2, "contact":"allen@gmail.com", "status":2, "shippingAddr":{"firstName":"Allen","lastName":"Guo","address":"月牙湖花园69号","apartment":"","city":"南京","country":"US","state":"AL","zipcode":"200000","phone":"18551710938"},"shippingMethod":1,"creditCard":{"cardNo":"CN-234235","nameOnCard":"ALLEN","expDate":"10/11","securityCode":"123"},"billingAddressType":1,"id":"ON-10000-100","products":[{"id":3,"sku":"3grayS","name":"F9 T SHIRT BLACK 2X","price":35,"image":"1.png","baseUrl":"/data/catalog/mens/t-shirts/f9-t-shirt-black-2x","qty":4,"specs":["colors","sizes"],"colors":"gray","sizes":"S"},{"id":10,"sku":"10blackS","name":"MENS DEMO 2 ASTRONAUT T SHIRT","price":30,"image":"1.png","baseUrl":"/data/catalog/mens/t-shirts/mens-demo-2-astronaut-t-shirt","qty":4,"specs":["colors","sizes"],"colors":"black","sizes":"S"}]}]}');
  var orderId = queryParse(window.location.search).orderId;

  var currOrder = null;
  var allOrders = JSON.parse(window.localStorage.getItem('orders')) || [];
  var user = JSON.parse(window.sessionStorage.getItem('user'));
  var ordersForCurrUser = allOrders[user.username];
  if (ordersForCurrUser) {
    for (var i = 0; i < ordersForCurrUser.length; i++) {
      if (ordersForCurrUser[i].id == orderId) {
        currOrder = ordersForCurrUser[i];
        break;
      }
    }
  }

  if (currOrder) {
    $('.order-no').innerHTML = currOrder.id;

    var addr = currOrder.shippingAddr;
    $('.section-order-info .contact').innerHTML = `${currOrder.contact} <span class="order-status">${ORDER_ENUM.status[parseInt(currOrder.status)]}</span>`
    $('.section-order-info .shipping-address').innerHTML = `${addr.address}, ${stateData[addr.country][addr.state]}, ${countryData[addr.country]}, ${addr.zipcode}`
    
    var cc = currOrder.creditCard;
    $('.section-order-info .credit-card').innerHTML = `Card No: ${cc.cardNo}, Name on Card: ${cc.nameOnCard}`

    $('.section-order-info .shipping-method').innerHTML = `${ORDER_ENUM.shippingMethod[currOrder.shippingMethod].label}`
    $('.section-order-info .shipping-method-fee').innerHTML = `${ORDER_ENUM.shippingMethod[currOrder.shippingMethod].amount}`
    $('.section-order-info .billing-address').innerHTML = `${ORDER_ENUM.billingAddressType[currOrder.billingAddressType]}`
    
    if (typeof widgetOrderedProducts !== 'undefined') widgetOrderedProducts(currOrder.products, ORDER_ENUM.shippingMethod[currOrder.shippingMethod].amount);
  } else {
    $('.order-detail-page').innerHTML = '<div class="empty">The order you visisted is not existed.</div>';
  }
})();
