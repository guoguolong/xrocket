var prodId = parseInt(queryParse(window.location.search).id);

var prod;
var products = [];
try {
  products = JSON.parse(localStorage.getItem("products"));
  var htmlProduct = '';

  for (var i = 0; i < products.length; i++) {
    if (products[i].id === prodId) {
      prod = products[i];
      break;
    }
  }
  // console.log('prod:::', prod)
  if (prod) {
    $('.name').innerHTML = prod.name;
    $('.price span').innerHTML = prod.price;
    $('.large').setAttribute('src', `${prod.baseUrl}/${prod.images[0]}`);

    if (prod.sizeChart) {
      $('.more-info').innerHTML = JSON.stringify(prod.sizeChart);
    } if (prod.description) {
      $('.more-info').innerHTML = JSON.stringify(prod.description);
    }
  }
} catch (e) {
  console.log(e)
  htmlProduct = '火星闹饥荒，本商品已经被抢购一空';
  $('.detail').innerHTML = htmlProduct;
}

$('.action-add-to-cart').onclick = function () {
  if (prod) {
    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart"));
      cart = cart || [];
    } catch (e) {
      console.og('cart e:', e)
    }
    var qty = parseInt($('.qty input').value || 0)
    var hasThisProduct = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === prodId) {
        hasThisProduct = true;
        cart[i].qty += qty;
        break;
      }
    }
    if (!hasThisProduct) {
      prod.qty = qty;
      cart.push(prod);
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = '../cart/index.html'
  }
}