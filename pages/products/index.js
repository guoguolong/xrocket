function link(id) {
  window.location.href = `/pages/product-detail/index.html?id=${id}`;
}

function flipCard(image, side) {
  if (side == 'b') 
    image.setAttribute('src', image.dataset.cardB)
  else 
    image.setAttribute('src', image.dataset.cardA)
  image.className = 'fadeIn2';
}

function renderCategoryTitle(catId) {
  var title = '';
  if (catId) {
    var categories = JSON.parse(localStorage.getItem("categories"));
    for (var i = 0; i < categories.length; i++) {
      var c = categories[i];
      if (c.id == catId) {
        title = c.title;
        break;
      }
      if (c.children) {
        for (var j = 0; j < c.children.length; j++) {
          var subC = c.children[j];
          if (subC.id == catId) {
            title = subC.title;
          }
        }
      }
      if (title) break;
    }
    if (title) {
      $('.category-title').innerHTML = title;
    } else {
      $('.category-title').innerHTML = 'Sold Out';
    }
  }
}

function renderProducts(catId, subCatId) {
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
    if (!catId || (catId == prd.categoryId || catId == prd.subCategoryId)) {
      htmlProducts.push(`<div data-id="${prd.id}" class="item-wrapper" onclick="link(${prd.id})" >
        <div class="item">
          <div class="media">
            <img class="down" src="${prd.baseUrl}/${prd.images[1] || prd.images[0]}" />
            <img class="top" src="${prd.baseUrl}/${prd.images[0]}" />
          </div>
          <div class="title">${prd.name}</div>
          <div class="price">$${prd.price}</div>
        </div>
      </div>
      `);
    }
  }
  if (htmlProducts.length > 0) {
    $id('products').innerHTML = htmlProducts.join('');
  } else {
    $id('products').innerHTML = '<div class="empty">Our stock of this category is currently depleted due to a flood in the warehouse!</div>';
  }
}

var query = queryParse(window.location.href);
renderCategoryTitle(query.c);
renderProducts(query.c);
