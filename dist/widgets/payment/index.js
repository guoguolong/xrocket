function widgetPayment() {
  $('.payment .action-save').onclick = function() {
    var creditCard = {};
    var $form = $('.payment .form');
    creditCard.cardNo = $form.querySelector('input[name=cardNo]').value;
    creditCard.nameOnCard = $form.querySelector('input[name=nameOnCard]').value;

    window.location.href="#pay-now";    
    console.log(creditCard);
  }
}

widgetPayment();