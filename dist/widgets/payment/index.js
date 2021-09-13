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

      window.location.href="#pay-now";    
    }
  }
  $('.payment .return-to-shipping').onclick = function() {
    window.location.href = "#shipping";  
  }
}

widgetPayment();