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
    $$id('.name')[0].innerHTML = prod.name;
    $$id('.price span')[0].innerHTML = prod.price;
    // $$id('.main-pic')[0].setAttribute('src', `/data/images/${prod.image}`);
  }
} catch (e) {
  console.log(e)
  htmlProduct = '火星闹饥荒，本商品已经被抢购一空';
  document.getElementById('detail').innerHTML = htmlProduct;
}

$$id('.action-add-to-cart')[0].onclick = function () {
  if (prod) {
    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart"));
      cart = cart || [];
    } catch (e) {
      console.og('cart e:', e)
    }
    var qty = parseInt($$id('.qty input')[0].value || 0)
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