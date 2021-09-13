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

            window.xrocket.purchasedOrder.billingAddressType = $('.section-billing-address input[name=billingAddressType]').value;

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
            window.xrocket.purchasedOrder.shippingMethod = $('.section-shipping-method input[name=shippingMethod]').value;

            window.location.href = "#payment";
        }
    }
}

widgetShipping();

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