function pageOrders() {
  var allOrders = JSON.parse(window.localStorage.getItem('orders')) || [];
  // allOrders = {"allen":[{"contact":"allen@gmail.com","shippingAddr":{"firstName":"Allen","lastName":"asdfasd","address":"","apartment":"","city":"","country":"US","state":"AL","zipcode":"213412","phone":"18551710938"},"shippingMethod":1,"creditCard":{"cardNo":"C9021345","nameOnCard":"ALLEN","expDate":"01/11","securityCode":"232"},"billingAddressType":1,"id":"ON-1631529676429-923","status":2,"products":[{"id":3,"sku":"3grayS","name":"F9 T SHIRT BLACK 2X","price":35,"image":"1.png","baseUrl":"/data/catalog/mens/t-shirts/f9-t-shirt-black-2x","qty":1,"specs":["colors","sizes"],"colors":"gray","sizes":"S"}],"total":73},{"contact":"allen@gmail.com","shippingAddr":{"firstName":"Allen","lastName":"MMM","address":"","apartment":"","city":"","country":"US","state":"AL","zipcode":"134123","phone":"19832458347"},"shippingMethod":1,"creditCard":{"cardNo":"C0235","nameOnCard":"addd","expDate":"0111","securityCode":"211"},"billingAddressType":1,"id":"ON-1631529711247-651","status":2,"products":[{"id":67,"sku":67,"name":"MISSION PATCH COLLECTION 2","price":121,"image":"1.png","baseUrl":"/data/catalog/accessories/mission-patch-collection-2","qty":1,"specs":[]}],"total":159},{"contact":"allen@gmail.com","shippingAddr":{"firstName":"Allen","lastName":"GUo","address":"ddd","apartment":"","city":"南京","country":"US","state":"AL","zipcode":"200000","phone":"23453453452"},"shippingMethod":1,"creditCard":{"cardNo":"C0013","nameOnCard":"Alen0masd","expDate":"01/11","securityCode":"243"},"billingAddressType":1,"id":"ON-1631529794580-435","status":2,"products":[{"id":65,"sku":65,"name":"DRONE SHIP LUGGAGE TAGS","price":20,"image":"1.png","baseUrl":"/data/catalog/accessories/drone-ship-luggage-tags","qty":1,"specs":[]}],"total":58}]}
  var user = JSON.parse(window.sessionStorage.getItem('user'));
  var ordersForCurrUser = allOrders[user.username];
  var html = [];
  if (ordersForCurrUser) {
    for (var i = 0; i < ordersForCurrUser.length; i++) {
      var order = ordersForCurrUser[i];
      var names = [];
      var defaultPic;
      for (var j = 0; j < order.products.length; j++) {
        var prd = order.products[j];
        if (!defaultPic) defaultPic = `${prd.baseUrl}/${prd.image}`;
        names.push(`<div>${prd.name}</div>`);
      }
      var item = `
        <tr class="order-item">
          <td>
            <a href="/pages/order-detail/index.html?orderId=${order.id}">${order.id}</a>
          </td>
          <td class="col-basic-info">
            <div class="image-wrapper">
              <img src="${defaultPic}" />
            </div>
            <div class="name-wrapper">${names.join('')}</div>
          </td>
          <td>
            <span class="currency">$</span>
            <span >${order.total}</span>
          </td>
          <td>
            ${ORDER_ENUM.status[parseInt(order.status)]}
          </td>
        </tr>`;
      html.push(item);   
    }
  }

  if (html.length > 0) {
    $('.orders .body').innerHTML = html.join('');
  } else {
    $('.orders').innerHTML = '<div class="empty">You haven\'t made any order.</div>';
  }
}

pageOrders();
