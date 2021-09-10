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

window.addEventListener('load', function() {
    var $img = document.querySelector('.banner img');
    $img.className = 'loaded';
})

function queryParse(query) {
    var q = query.slice(1);
    var qArr = q.split('&');
    var result = {};
    for (var i = 0; i < qArr.length; i++) {
        var pair = qArr[i].split('=');
        result[pair[0]] = pair[1];
    }
    return result;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ';path=/';
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}