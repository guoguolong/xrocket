function widgetOrderedProducts(orderedProducts, handling = 0) {
    var productHtmls = [];
    var subtotal = 0;
    for (var i = 0; i < orderedProducts.length; i++) {
        var prd = orderedProducts[i];
        subtotal += prd.qty * prd.price;
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
            <span class="currency">$</span> ${prd.qty * prd.price}
        </div>
      </div>
    `);
    }

    var total = subtotal + handling;

    if (productHtmls.length > 0) {
        $('.product-items').innerHTML = productHtmls.join('');
        $('.subtotal').innerHTML = subtotal;
        if (handling) {
            $('.subtotal-and-handling').innerHTML = `${subtotal} + ${handling}`;
        } else {
            $('.handling-line').style.display = 'none'
        }
        $('.total').innerHTML = total;
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

function widgetPayment() {
    $('.payment .action-save').onclick = function() {
        var errors = 0;
        var creditCard = {};
        var $form = $('.payment .form');

        var field = validateFormField($form.querySelector('input[name=cardNo]'), 'Please enter card number');
        errors += field.isError ? 1 : 0;
        creditCard.cardNo = field.value;

        field = validateFormField($form.querySelector('input[name=nameOnCard]'), 'Please enter name on your card');
        errors += field.isError ? 1 : 0;
        creditCard.nameOnCard = field.value;

        field = validateFormField($form.querySelector('input[name=expDate]'), 'Please enter expiration date');
        errors += field.isError ? 1 : 0;
        creditCard.expDate = field.value;

        field = validateFormField($form.querySelector('input[name=securityCode]'), 'Please enter a 3 digit code', /^\d{3}$/);
        errors += field.isError ? 1 : 0;
        creditCard.securityCode = field.value;

        if (errors === 0) {
            window.xrocket.purchasedOrder = window.xrocket.purchasedOrder || {};
            window.xrocket.purchasedOrder.creditCard = creditCard;

            window.xrocket.purchasedOrder.billingAddressType = parseInt($('.section-billing-address input[name=billingAddressType]').value);

            window.location.href = "#pay-now";
        }
    }
    $('.payment .return-to-shipping').onclick = function() {
        window.location.href = "#shipping";
    }
}

widgetPayment();

function widgetShipping() {
    initCountryAndStateSelect($('.shipping .form select[name=country]'), $('.shipping .form select[name=state]'));

    $('.shipping .action-save').onclick = function() {
        var errors = 0;
        var shippingAddr = {};
        var $form = $('.shipping .form');

        var field = validateFormField($form.querySelector('input[name=firstName]'), 'Please enter first name');
        errors += field.isError ? 1 : 0;
        shippingAddr.firstName = field.value;

        field = validateFormField($form.querySelector('input[name=lastName]'), 'Please enter last name');
        errors += field.isError ? 1 : 0;
        shippingAddr.lastName = field.value;

        shippingAddr.address = $form.querySelector('input[name=address]').value;
        shippingAddr.apartment = $form.querySelector('input[name=apartment]').value;
        shippingAddr.city = $form.querySelector('input[name=city]').value;
        shippingAddr.country = $form.querySelector('select[name=country]').value;
        shippingAddr.state = $form.querySelector('select[name=state]').value;

        field = validateFormField($form.querySelector('input[name=zipcode]'), 'Please enter a 6 digit code', /\d{6}/);
        errors += field.isError ? 1 : 0;
        shippingAddr.zipcode = field.value;

        field = validateFormField($form.querySelector('input[name=phone]'), 'Please enter phone number');
        errors += field.isError ? 1 : 0;
        shippingAddr.phone = field.value;

        if (errors === 0) {
            window.xrocket.purchasedOrder = window.xrocket.purchasedOrder || {};
            window.xrocket.purchasedOrder.shippingAddr = shippingAddr;
            window.xrocket.purchasedOrder.shippingMethod = parseInt($('.section-shipping-method input[name=shippingMethod]').value);

            window.location.href = "#payment";
        }
    }
}

widgetShipping();

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