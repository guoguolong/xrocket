
function renderFeaturedProducts(catId, subCatId) {
  function link(id) {
    window.location.href = `/pages/product-detail/index.html?id=${id}`;
  }

  var products = [];
  try {
    products = JSON.parse(localStorage.getItem("products"));
  } catch (e) {
    console.log(e)
    $id('products').innerHTML = "病毒入侵，躲进地堡";
  }

  var htmlProducts = [];
  for (var i = 0; i < products.length; i++) {
    var prd = products[i];
    if (prd.isFeatured) {
      htmlProducts.push(`<div class="item-wrapper" onclick="link(${prd.id})">
        <div class="item">
          <div class="media">
            <img src="${prd.baseUrl}/${prd.images[0]}" />
          </div>
          <div class="title">${prd.name}</div>
          <div class="price">$${prd.price}</div>
        </div>
      </div>
      `);
    }
    if (htmlProducts.length >= 2) break;
  }
  $('.featured-products').innerHTML = htmlProducts.join('');
}

renderFeaturedProducts();
