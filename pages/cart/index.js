function $id(id) {
  return document.getElementById(id);
}

function $$id(className) {
  return document.querySelectorAll(className);
}

try {
  var cart = JSON.parse(localStorage.getItem("cart"));
  var htmlCart = [];

  for (var i = 0; i < cart.length; i++) {
    var prd = cart[i];
    htmlCart.push(`<div class="item">
        <div class="media">
          <img src="/data/images/${prd.image}" />
        </div>
        <div class="title">${prd.name}</div>
        <div class="price">${prd.price}</div>
        <div class="qty">
          <input value="${prd.qty}" />
        </div>
      </div>
    `);
  }
  $id('cart').innerHTML = htmlCart.join('');
} catch (e) {
  $id('cart').innerHTML = "火星闹饥荒，商品已经被抢购一空";
}