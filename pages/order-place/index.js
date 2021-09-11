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

if (typeof widgetOrderedProducts !== 'undefined') {
  widgetOrderedProducts(JSON.parse(window.sessionStorage.getItem("cart")) || []);
}

$('.pay-now-wrapper .action-save').onclick = function() {
  window.location.href = "/pages/order-created/index.html";
}

$('.pay-now-wrapper .return-to-payment').onclick = function() {
  window.location.href = "#payment";  
}
