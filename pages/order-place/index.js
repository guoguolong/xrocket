var STEPS = ['shipping', 'payment', 'pay-now'];
currStep = STEPS[0];

function initCountryAndStateSelect($country, $state) {
  var opts = [];
  for (var code in countryData) {
    var label = countryData[code];
    opts.push(`<option value="${code}">${label}</option>`);;
  }
  $country.innerHTML = opts.join('');

  function refreshStates($state, countryCode) {
    var states = stateData[countryCode];
    if (states) {
      var stateOpts = [];
      for (var code in states) {
        var label = states[code];
        stateOpts.push(`<option value="${code}">${label}</option>`);
      }      
      $state.style.display = 'block';
      $state.innerHTML = stateOpts.join('');
    } else {
      $state.style.display = 'none';
    }
  }
  refreshStates($state, 'US');

  $country.onchange = function (e) {
    refreshStates($state, e.target.value)
  }
}

function moveStep(stepCode) {
  for (var $step of $$(`.step`)) {
    $step.style.display = 'none';
  }
  $(`.step-${stepCode}`).style.display = 'flex';
  currStep = stepCode;
}

/*******  MAMIN ENTRY ***********/
initCountryAndStateSelect($('.shipping-address-form select[name=country]'), $('.shipping-address-form select[name=state]'));
moveStep(currStep);

$('.action-save-shipping').onclick = function() {
  var shippAddr = {};
  var $form = $('.shipping-address-form');
  shippAddr.firstName = $form.querySelector('input[name=firstName]').value;
  shippAddr.lastName = $form.querySelector('input[name=lastName]').value;
  shippAddr.address = $form.querySelector('input[name=address]').value;
  shippAddr.apartment = $form.querySelector('input[name=apartment]').value;
  shippAddr.city = $form.querySelector('input[name=city]').value;
  shippAddr.country = $form.querySelector('select[name=country]').value;
  shippAddr.state = $form.querySelector('select[name=state]').value;
  shippAddr.zipcode = $form.querySelector('input[name=zipcode]').value;
  shippAddr.phone = $form.querySelector('input[name=phone]').value;

  $('.section-shipping-address').style.display = 'none';
  moveStep('payment');
  console.log(shippAddr);
}

$('.action-save-payment').onclick = function() {
  moveStep('pay-now');  
}

$('.action-save-pay-now').onclick = function() {
  
}

$('.return-to-shipping').onclick = function() {
  moveStep('shipping')
}

$('.return-to-payment').onclick = function() {
  moveStep('payment')
}

// function pageOrderPlace() {
// }
// pageOrderPlace();