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

      window.location.href="#payment";    
    }
  }
}

widgetShipping();