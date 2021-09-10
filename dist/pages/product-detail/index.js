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
    var prodId = parseInt(queryParse(window.location.search).id);

    function renderProduct(prodId) {
        var prod;
        var products = [];
        try {
            products = JSON.parse(localStorage.getItem("products")) || [];
            var htmlProduct = '';

            for (var i = 0; i < products.length; i++) {
                if (products[i].id === prodId) {
                    prod = products[i];
                    break;
                }
            }
            if (prod) {
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
        } catch (e) {
            console.log(e)
            $('.detail').innerHTML = '火星闹饥荒，本商品已经被抢购一空';
        }
        return prod;
    }

    var currProd = renderProduct(prodId);

    $cart = $('.add-to-cart');
    if ($cart) {
        $('.add-to-cart').onclick = function() {
            if (currProd) {
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

                var cart = [];
                try {
                    cart = JSON.parse(window.sessionStorage.getItem("cart")) || [];
                } catch (e) {
                    console.og('Cart Exception:', e)
                }
                var hasThisProduct = false;
                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].id === currProd.id) {
                        var sku = currProd.id;
                        if (currProd.specs) {
                            for (var j = 0; j < currProd.specs.length; j++) {
                                sku += $(`.spec-${currProd.specs[j]} select`).value;
                            }
                        }
                        if (sku === cart[i].sku) {
                            hasThisProduct = true;
                            cart[i].qty += qty;
                            break;
                        }
                    }
                }

                if (!hasThisProduct) {
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

                // 减去原来库存 TODO

                window.sessionStorage.setItem("cart", JSON.stringify(cart));
                window.location.href = '/pages/cart/index.html'
            }
        }
    }
}

pageProductDetail();