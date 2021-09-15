function widgetMedia(product, mediaWidth) {
    var images = product.images || [];
    var imagesHtml = [];
    for (var i = 0; i < images.length; i++) {
        imagesHtml.push(`
<div class="small-pic-wrapper"><img data-url="${product.baseUrl}/${images[i]}" src="${product.baseUrl}/${images[i]}" /></div>
      `)
    }
    $('.big-pic-wrapper').innerHTML = `<img src="${product.baseUrl}/${images[0]}" />`;

    if (images.length > 1) {
        $('.small-pics').innerHTML = imagesHtml.join('');

        $('.small-pics').onclick = function(e) {
            var imageUrl = e.target.dataset.url;
            if (imageUrl) {
                $('.big-pic-wrapper').innerHTML = `<img src="${imageUrl}" />`;
            }
        }
    }
    if (mediaWidth) {
        $('.media').style.width = mediaWidth;
    }
}

if (window.location.pathname.match(/^\/widgets/)) {
    widgetMedia({
        images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'],
        baseUrl: '/data/catalog/mens/t-shirts/f9-t-shirt-black-2x'
    }, 600);
}

function pageProductDetail() {
    function getProductById(prodId) {
        var prod;
        var products = JSON.parse(localStorage.getItem("products")) || [];

        for (var i = 0; i < products.length; i++) {
            if (products[i].id === prodId) {
                prod = products[i];
                break;
            }
        }
        return prod;
    }

    function renderProduct(prod) {
        if (!prod) {
            $('.detail').innerHTML = 'The product is not existed.';
            return;
        }

        $('.name').innerHTML = prod.name;
        $('.price span').innerHTML = prod.price;
        if (typeof widgetMedia !== 'undefined') widgetMedia(prod);

        if (prod.specs) {
            for (var i = 0; i < prod.specs.length; i++) {
                var specName = prod.specs[i];
                var specNameLabel = specName[0].toUpperCase() + specName.slice(1);
                specNameLabel = specNameLabel.replace(/s$/, '');

                var specOptions = [];
                for (var j = 0; j < prod[specName].length; j++) {
                    var spec = prod[specName][j];
                    specOptions.push(`<option value="${spec}">${specNameLabel}: ${spec.toUpperCase()}</option>`);
                }
                $(`.spec-${specName}`).innerHTML = `<select name="${specName}">${specOptions.join('')}</select>`;
            }
        }

        if (prod.sizeChart) {
            var lines = [];
            for (var i = 0; i < prod.sizeChart.length; i++) {
                for (var key in prod.sizeChart[i]) {
                    lines.push(`<tr><td class="label">${key}</td><td>${prod.sizeChart[i][key].split(',').join('</td><td>')}</td></tr>`);
                }
            }
            $('.size-chart').innerHTML = `<div class="size-chart-title">Size Chart</div><table class="size-chart">${lines.join('')}</table>`;
        }
        if (prod.description) {
            $('.row-description').innerHTML = `${prod.description.replace(/\n/g, '<br/>')}`;
        }
    }

    var prodId = parseInt(queryParse(window.location.search).id);
    var currProd = getProductById(prodId);
    renderProduct(currProd);
    if (!currProd) return;

    $('.add-to-cart').onclick = function() {
        // 1. 校验数量为合法的数字
        var qty = parseInt($('.qty input').value || 0)
        if (isNaN(qty)) qty = 0;
        if (!qty || qty > currProd.stock) {
            $('.errmsg').className = 'errmsg errmsg-highlight';
            if (!qty)
                $('.errmsg').innerHTML = 'Please input valid numeric to buy';
            else
                $('.errmsg').innerHTML = `The stock is insufficient, please input a number less than ${currProd.stock}`;
            return;
        } else {
            $('.errmsg').className = 'errmsg';
            $('.errmsg').innerHTML = '';
        }

        // 2. 校验购物车里是否有该产品，有，则更新数量
        var cart = JSON.parse(window.sessionStorage.getItem("cart")) || [];
        var hasThisProductInCart = false;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === currProd.id) {
                var sku = currProd.id;
                if (currProd.specs) {
                    for (var j = 0; j < currProd.specs.length; j++) {
                        sku += $(`.spec-${currProd.specs[j]} select`).value;
                    }
                }
                if (sku === cart[i].sku) {
                    hasThisProductInCart = true;
                    cart[i].qty += qty;
                    break;
                }
            }
        }

        // 3. 购物车里是否有该产品，没有，则添加一条新的记录到购物车
        if (!hasThisProductInCart) {
            var prod = {
                id: currProd.id,
                sku: currProd.id,
                name: currProd.name,
                price: currProd.price,
                image: currProd.images[0],
                baseUrl: currProd.baseUrl,
                qty: qty,
                specs: currProd.specs || [],
            }
            if (currProd.specs) {
                for (var i = 0; i < currProd.specs.length; i++) {
                    var specName = currProd.specs[i];
                    prod[specName] = $(`.spec-${specName} select`).value;
                    prod.sku += prod[specName];
                }
            }
            cart.push(prod);
        }

        // 4. 减去原来库存 TODO

        // 5. 存储数据到购物车
        window.sessionStorage.setItem("cart", JSON.stringify(cart));
        // 6. 进入购车页面
        window.location.href = '/pages/cart/index.html';
    }
}

pageProductDetail();