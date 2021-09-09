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
    images:['1.png','2.png','3.png','4.png','5.png','6.png'],
    baseUrl: '/data/catalog/mens/t-shirts/f9-t-shirt-black-2x'
  }, 600);
}
