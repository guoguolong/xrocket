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

setupStep();
window.onhashchange = setupStep;

$('.pay-now-wrapper .action-save').onclick = function() {
    window.location.href = "/pages/order-created/index.html";
}

$('.pay-now-wrapper .return-to-payment').onclick = function() {
    window.location.href = "#payment";
}