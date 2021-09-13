function widgetOrderedProducts(orderedProducts, handling = 0) {
  var productHtmls = [];
  var subtotal = 0;
  for (var i = 0; i < orderedProducts.length; i++) {
    var prd = orderedProducts[i];
    subtotal += prd.qty * prd.price;
    productHtmls.push(`<div class="product-item">
          <div class="image-wrapper">
            <img src="${prd.baseUrl}/${prd.image}" />
          </div>
          <div class="basic-info">
            <div class="name">${prd.name}</div>
            <div>Black / S</div>  
            <div>$ ${prd.price} x ${prd.qty}</div>
          </div>
          <div class="amount">
            <span class="currency">$</span> ${prd.qty * prd.price}
        </div>
      </div>
    `);
  }

  var total = subtotal + handling;

  if (productHtmls.length > 0) {
    $('.product-items').innerHTML = productHtmls.join('');
    $('.subtotal').innerHTML = subtotal;
    if (handling) {
      $('.subtotal-and-handling').innerHTML = `${subtotal} + ${handling}`;
    } else {
      $('.handling-line').style.display = 'none'
    }
    $('.total').innerHTML = total;
  } else {
    $('.sidebar').innerHTML = '<div class="empty">Cart is empty</div>';
  }
}

if (window.location.pathname.match(/^\/widgets/)) {
  var orderedGoods = [{"id":2,"sku":"2blackS","name":"F9 LONG SLEEVE T SHIRT","price":30,"image":"1.png","baseUrl":"/data/catalog/mens/t-shirts/f9-long-sleeve-t-shirt","qty":1,"specs":["colors","sizes"],"colors":"black","sizes":"S"},{"id":45,"sku":"45blueS","name":"SPACEX STARSHIP CREW SWEATSHIRT","price":55,"image":"1.png","baseUrl":"/data/catalog/womens/outerwear/spacex-starship-crew-sweatshirt","qty":1,"specs":["colors","sizes"],"colors":"blue","sizes":"S"}];
  widgetOrderedProducts(orderedGoods);
}