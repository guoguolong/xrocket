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

    window.location.href="#payment";    
    console.log(shippAddr);
  }
}

widgetShipping();