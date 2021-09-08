function widgetMedia(product, mediaWidth) {
  var images = product.images || [];
  var imagesHtml = [];
  for (var i = 0; i < images.length; i++) {
    imagesHtml.push(`
<div class="small-pic-wrapper"><img data-url="${product.baseUrl}/${images[i]}" src="${product.baseUrl}/${images[i]}" /></div>
      `)
  }
  $('.small-pics').innerHTML = imagesHtml.join('');
  $('.big-pic-wrapper').innerHTML = `<img src="${product.baseUrl}/${images[0]}" />`;

  $('.small-pics').onclick = function(e) {
    var imageUrl = e.target.dataset.url;
    if (imageUrl) {
      $('.big-pic-wrapper').innerHTML = `<img src="${imageUrl}" />`;
    }
  }
  if (mediaWidth) {
    $('.media').style.width = mediaWidth;
  }
}

if (!window.inPage) {
  widgetMedia({
    images:['1.png','1.png','2.png','1.png','2.png','1.png','2.png','2.png'],
    baseUrl: '/data/catalog/mens/t-shirts/men-s-falcon-1-t-shirt'
  });
}

