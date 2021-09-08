function saveShippingAddr() {
  $('.action-save-shipping-addr').onclick = function() {
    var shippAddr = {};
    shippAddr.firstName = $('.shipping-address-form input[name=firstName]').value;
    shippAddr.lastName = $('.shipping-address-form input[name=lastName]').value;
    shippAddr.address = $('.shipping-address-form input[name=address]').value;
    shippAddr.apartment = $('.shipping-address-form input[name=apartment]').value;
    shippAddr.city = $('.shipping-address-form input[name=city]').value;
    shippAddr.country = $('.shipping-address-form select[name=country]').value;
    shippAddr.state = $('.shipping-address-form select[name=state]').value;
    shippAddr.zipcode = $('.shipping-address-form input[name=zipcode]').value;
    shippAddr.phone = $('.shipping-address-form input[name=phone]').value;

    $('.shipping-address-form').style.display = 'none';
    $('.shipping-address-result').style.display = 'block';

    console.log(shippAddr);
  }
}
saveShippingAddr();

function pageOrderPlace() {

}
pageOrderPlace();