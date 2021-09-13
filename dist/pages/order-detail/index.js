function widgetOrderedProducts(productsInCart) {
    var productHtmls = [];
    for (var i = 0; i < productsInCart.length; i++) {
        var prd = productsInCart[i];
        productHtmls.push(`<div class="product-item">
          <div class="image-wrapper">
            <img src="${prd.baseUrl}/${prd.image}" />
          </div>
          <div class="basic-info">
            <div class="name">${prd.name}</div>
            <div>Black / S</div>  
            <div>$ ${prd.price} x ${prd.qty}</div>
          </div>
          <div class="amount">
            $ ${prd.qty * prd.price}
        </div>
      </div>
    `);
    }

    if (productHtmls.length > 0) {
        $('.product-items').innerHTML = productHtmls.join('');
        $('.subtotal').innerHTML = 49;
        $('.subtotal-and-handling').innerHTML = 89;
        $('.total').innerHTML = 89;
    } else {
        $('.sidebar').innerHTML = '<div class="empty">Cart is empty</div>';
    }
}

if (window.location.pathname.match(/^\/widgets/)) {
    var orderedGoods = [{
        "id": 2,
        "sku": "2blackS",
        "name": "F9 LONG SLEEVE T SHIRT",
        "price": 30,
        "image": "1.png",
        "baseUrl": "/data/catalog/mens/t-shirts/f9-long-sleeve-t-shirt",
        "qty": 1,
        "specs": ["colors", "sizes"],
        "colors": "black",
        "sizes": "S"
    }, {
        "id": 45,
        "sku": "45blueS",
        "name": "SPACEX STARSHIP CREW SWEATSHIRT",
        "price": 55,
        "image": "1.png",
        "baseUrl": "/data/catalog/womens/outerwear/spacex-starship-crew-sweatshirt",
        "qty": 1,
        "specs": ["colors", "sizes"],
        "colors": "blue",
        "sizes": "S"
    }];
    widgetOrderedProducts(orderedGoods);
}
const orderConstants = {
    status: {
        1: '待支付',
        2: '已支付',
    },
    shippingMethod: {
        1: {
            label: 'Shipping - UPS Home Delivery®',
            amount: 38.00
        },
        2: {
            label: 'Shipping - Fedex Home Delivery® (Slow)',
            amount: 47.00
        },
    },
    billingAddressType: {
        1: 'Same as shipping address',
        2: 'Use a different billing address',
    }
};

function pageOrderDetail(orderId) {
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
    $('.ttt').innerHTML = `<pre>${JSON.stringify(allOrders, null ,4)}</pre>`;
    if (currOrder) {
        $('.order-no').innerHTML = `${currOrder.id} <span class="order-status">${orderConstants.status[parseInt(currOrder.status)]}</span>`;

        var addr = currOrder.shippingAddr;
        $('.shipping-address').innerHTML = `${addr.address} ${addr.country} ${addr.state} ${addr.zipcode}`

        var cc = currOrder.creditCard;
        $('.credit-card').innerHTML = `Card No: ${cc.cardNo}, Name on Card: ${cc.nameOnCard}`

        $('.shipping-method').innerHTML = `${currOrder.shippingMethod}`
        $('.billing-address').innerHTML = `${currOrder.billingAddressType}`

        if (typeof widgetOrderedProducts !== 'undefined') widgetOrderedProducts(currOrder.products);
    } else {
        $('.order-detail-page').innerHTML = '<div class="empty">The order you visisted is not existed.</div>';
    }
}

// 设置测试数据 
window.localStorage.setItem('orders', '{"allen":[{"status":2, "shippingAddr":{"firstName":"Allen","lastName":"Guo","address":"月牙湖花园69号","apartment":"","city":"南京","country":"US","state":"AL","zipcode":"200000","phone":"18551710938"},"shippingMethod":"1","creditCard":{"cardNo":"CN-234235","nameOnCard":"ALLEN","expDate":"10/11","securityCode":"123"},"billingAddressType":"1","id":"ON-10000-100","products":[{"id":3,"sku":"3grayS","name":"F9 T SHIRT BLACK 2X","price":35,"image":"1.png","baseUrl":"/data/catalog/mens/t-shirts/f9-t-shirt-black-2x","qty":4,"specs":["colors","sizes"],"colors":"gray","sizes":"S"},{"id":10,"sku":"10blackS","name":"MENS DEMO 2 ASTRONAUT T SHIRT","price":30,"image":"1.png","baseUrl":"/data/catalog/mens/t-shirts/mens-demo-2-astronaut-t-shirt","qty":4,"specs":["colors","sizes"],"colors":"black","sizes":"S"}]}]}');
var orderId = queryParse(window.location.search).orderId;
pageOrderDetail(orderId);