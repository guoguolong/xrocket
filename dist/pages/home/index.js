function widgetFeatured(catId, subCatId) {
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
            htmlProducts.push(`<div class="item-wrapper" onclick="linkToProdPage(${prd.id})">
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

widgetFeatured();

function widgetBanner() {
    window.addEventListener('load', function() {
        var $img = document.querySelector('.banner img');
        $img.className = 'loaded';
    })
}

widgetBanner();