function pageProducts() {
    function renderKeyword(keyword) {
        if (keyword) {
            $('.keyword').innerHTML = 'Searched Result By [<span class="value">' + decodeURI(keyword) + '</span>]';
            $('.keyword').className = 'keyword-highlight';
        }
    }

    function renderCategoryTitle(catId) {
        if (!catId) return;
        var title = '';
        var categories = JSON.parse(localStorage.getItem("categories")) || [];
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

    function renderProducts(query = {}, pageNo = 1, pageSize = 12) {
        var allProducts = JSON.parse(localStorage.getItem("products")) || [];
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

        var limit = pageNo * pageSize;
        if (limit > products.length) limit = products.length;
        var productHtmls = [];
        for (var i = 0; i < limit; i++) {
            var prd = products[i];
            if (!query.c || (query.c == prd.categoryId || query.c == prd.subCategoryId)) {
                if (query.keyword) {
                    if (!prd.name.match(new RegExp(decodeURI(query.keyword)))) continue;
                }
                productHtmls.push(`<div data-id="${prd.id}" class="item-wrapper" onclick="linkToProdPage(${prd.id})" >
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
            $('.products').innerHTML = productHtmls.join('');
        } else {
            $('.products').innerHTML = '<div class="empty">Our stock of this category is currently depleted due to a flood in the warehouse!</div>';
        }
    }

    var query = queryParse(window.location.search);
    var pageNo = query.pageNo || 1;
    var pageSize = query.pageSize || 12;

    renderCategoryTitle(query.c);
    renderKeyword(query.keyword);
    renderProducts(query);

    $('.more-action').onclick = function() {
        renderProducts(query, ++pageNo);
    }
}

pageProducts();