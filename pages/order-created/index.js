function pageOrderCompleted() {
  var href = $('.order-no').getAttribute('href');
  var orderId = '345323426457X';
  $('.order-no').setAttribute('href', `${href}'?id=${orderId}`);
  $('.order-no').innerHTML = orderId;
}

pageOrderCompleted();