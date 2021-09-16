function widgetShipping(style) {
  initCountryAndStateSelect($('.shipping .form select[name=country]'), $('.shipping .form select[name=state]'));  

  var $form = $('.shipping .form');
  var $addressField = $form.querySelector('input[name=address]');
  var $apartmentField = $form.querySelector('input[name=apartment]');
  var $firstNameField = $form.querySelector('input[name=firstName]');
  var $lastNameField = $form.querySelector('input[name=lastName]');
  var $cityField = $form.querySelector('input[name=city]');
  var $firstNameField = $form.querySelector('input[name=firstName]');
  var $countryField = $form.querySelector('select[name=country]');
  var $stateField = $form.querySelector('select[name=state]');
  var $phoneField = $form.querySelector('input[name=phone]');
  var $zipcodeField = $form.querySelector('input[name=zipcode]');

  $('.shipping .action-save').onclick = function() {
    var errors = 0;
    var shippingAddr = {};

    var field = validateFormField($firstNameField, 'Please enter first name');
    errors += field.isError ? 1 : 0;
    shippingAddr.firstName = field.value;

    field = validateFormField($lastNameField, 'Please enter last name');
    errors += field.isError ? 1 : 0;
    shippingAddr.lastName = field.value;

    shippingAddr.address = $addressField.value;
    shippingAddr.apartment = $apartmentField.value;
    shippingAddr.city = $cityField.value;
    shippingAddr.country = $countryField.value;
    shippingAddr.state = $stateField.value;
    
    field = validateFormField($zipcodeField, 'Please enter a 6 digit code', /\d{6}/);
    errors += field.isError ? 1 : 0;
    shippingAddr.zipcode = field.value;

    field = validateFormField($phoneField, 'Please enter phone number');
    errors += field.isError ? 1 : 0;
    shippingAddr.phone = field.value;

    if (errors === 0) {
      window.xrocket.purchasedOrder = window.xrocket.purchasedOrder || {};
      window.xrocket.purchasedOrder.shippingAddr = shippingAddr;
      window.xrocket.purchasedOrder.shippingMethod = parseInt($('.section-shipping-method input[name=shippingMethod]').value);

      window.location.href="#payment";    
    }
  }
  
  $firstNameField.onkeydown = function() {
    validateFormField($firstNameField, 'Please enter first name');
  }
  $lastNameField.onkeydown = function() {
    validateFormField($lastNameField, 'Please enter last name');
  }
  $zipcodeField.onkeydown = function() {
    validateFormField($zipcodeField, 'Please enter a 6 digit code', /\d{6}/);
  }
  $phoneField.onkeydown = function() {
    validateFormField($phoneField, 'Please enter phone number');
  }

  applyStyle(style, '.shipping');
}

widgetShipping();