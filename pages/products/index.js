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

function renderProducts(query = {}, pageNo = 1, pageSize = 12) {
  var allProducts = [];
  try {
    allProducts = JSON.parse(localStorage.getItem("products"));
  } catch (e) {
    console.log(e)
    $id('products').innerHTML = '<div class="empty">病毒入侵，躲进地堡</div>';
  }

  var products = [];
  for (var i = 0; i < allProducts.length; i++) {
    var prd = allProducts[i];
    if (query.keyword) {
      if (!prd.name.match(new RegExp(decodeURI(query.keyword)))) continue;
    }
    if (query.c) {
      if (query.c != prd.categoryId && query.c != prd.subCategoryId) continue;
    }
    products.push(prd);
  }

  var productHtmls = [];
  var limit = pageNo * pageSize;
  if (limit > products.length) limit = products.length;

  for (var i = 0; i < limit; i++) {
    var prd = products[i];
    if (!query.c|| (query.c == prd.categoryId || query.c == prd.subCategoryId)) {
      if (query.keyword) {
        if (!prd.name.match(new RegExp(decodeURI(query.keyword)))) continue;
      }
      productHtmls.push(`<div data-id="${prd.id}" class="item-wrapper" onclick="link(${prd.id})" >
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

  if (products.length <= pageSize || limit >= products.length) $('.more-action').style.display = 'none';

  if (productHtmls.length > 0) {
    $id('products').innerHTML = productHtmls.join('');
  } else {
    $id('products').innerHTML = '<div class="empty">Our stock of this category is currently depleted due to a flood in the warehouse!</div>';
  }
}

$('.more-action').onclick = function() {
  renderProducts(query, ++pageNo);
}

var pageNo = 1;
var pageSize = 12;

var query = queryParse(window.location.search);
renderCategoryTitle(query.c);
renderProducts(query);

if (query.keyword) {
  $('.keyword').innerHTML = 'Searched Result By [<span class="value">' + decodeURI(query.keyword) + '</span>]';
  $('.keyword').className = 'keyword-highlight';
}
