function widgetPayment() {
    $('.payment .action-save').onclick = function() {
        var creditCard = {};
        var $form = $('.payment .form');
        creditCard.cardNo = $form.querySelector('input[name=cardNo]').value;
        creditCard.nameOnCard = $form.querySelector('input[name=nameOnCard]').value;

        window.location.href = "#pay-now";
        console.log(creditCard);
    }
}

widgetPayment();

function widgetShipping() {
    initCountryAndStateSelect($('.shipping .form select[name=country]'), $('.shipping .form select[name=state]'));

    $('.shipping .action-save').onclick = function() {
        var shippAddr = {};
        var $form = $('.shipping .form');
        shippAddr.firstName = $form.querySelector('input[name=firstName]').value;
        shippAddr.lastName = $form.querySelector('input[name=lastName]').value;
        shippAddr.address = $form.querySelector('input[name=address]').value;
        shippAddr.apartment = $form.querySelector('input[name=apartment]').value;
        shippAddr.city = $form.querySelector('input[name=city]').value;
        shippAddr.country = $form.querySelector('select[name=country]').value;
        shippAddr.state = $form.querySelector('select[name=state]').value;
        shippAddr.zipcode = $form.querySelector('input[name=zipcode]').value;
        shippAddr.phone = $form.querySelector('input[name=phone]').value;

        window.location.href = "#payment";
        console.log(shippAddr);
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