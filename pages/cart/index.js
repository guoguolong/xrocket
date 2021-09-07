function pageCart() {

  function renderCart() {
    var cart = JSON.parse(window.sessionStorage.getItem("cart")) || [];
    if (cart.length <= 0) {
      $('.cart-page .empty').className = 'empty';
      $('.cart-page .cart').className = 'cart hide';
      return;
    }

    $('.cart-page .empty').className = 'empty hide';
    $('.cart-page .cart').className = 'cart';

    var htmlCart = [];
    var amount = 0;
    for (var i = 0; i < cart.length; i++) {
      var prd = cart[i];
      var specLabels = [];
      for (var j = 0; j < prd.specs.length; j++) {
        specLabels.push(prd[prd.specs[j]].toUpperCase());
      }
      var subTotal = prd.price * prd.qty;
      amount += subTotal;
      htmlCart.push(`<tr class="item">
          <td class="product-info">
            <div class="picture">
              <a href="/pages/product-detail/index.html?id=${prd.id}"><img src="${prd.baseUrl}/${prd.image}" /></a>
            </div>
            <div class="info">
              <div class="name">
                <a href="/pages/product-detail/index.html?id=${prd.id}">${prd.name}</a>
              </div>
              <div class="specs">${specLabels.join(' / ')}</div>
              <div class="price">$ ${prd.price}</div>
            </div>
          </td>
          <td>
            <div class="qty"><input value="${prd.qty}" /></div>
            <div class="remove">
              <span data-sku="${prd.sku}" class="link">REMOVE</span>
            </div>
          </td>
          <td>
            <div class="sub-total">$ ${prd.price * prd.qty}</div>
          </td>
        </tr>
      `);
    }
    $('.amount .value').innerHTML = amount.toFixed(2);
    $('.cart-items').innerHTML = htmlCart.join('');
  }

  $('.cart-items').addEventListener('click', function(e) {
    var sku = e.target.dataset.sku;
    if (sku) {
      var cart = [];
      try {
        cart = JSON.parse(window.sessionStorage.getItem("cart")) || [];
      } catch (e) {}
      var updatedCart = [];
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].sku != sku) {
          updatedCart.push(cart[i]);
        }
      }
      if (updatedCart.length > 0) {
        window.sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        window.sessionStorage.removeItem('cart');
      }
      renderCart();
      if (updateCartIndicator) updateCartIndicator();
    }
  });

  renderCart();
}

pageCart();