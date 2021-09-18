function widgetImageGallery(product, mainPicIndex, style) {
  var pos = mainPicIndex || 0;
  var images = product.images || [];
  var MAX_COUNT = images.length;

  var imagesHtml = [];
  for (var i = 0; i < images.length; i++) {
    imagesHtml.push(`<div class="image-wrapper"><img src="${product.baseUrl}/${images[i]}" /></div>`)
  }
  var $images = $('.image-gallery .images');
  
  $images.innerHTML = imagesHtml.join('');

  if (MAX_COUNT <= 1) {
    $('.next-btn').style.display = 'none';
  } else {
    $('.prev-btn').onclick = function() {
      if (pos >= 0) { $('.prev-btn').style.display = 'none'; return;}

      var width = $images.querySelector('.image-wrapper').offsetWidth;
      
      $('.next-btn').style.display = 'block';
      pos++;
      $('.image-gallery .images').style.left = pos * width + 'px';;
    }
    $('.next-btn').onclick = function() {
      if (pos <= -(MAX_COUNT - 1)) { $('.next-btn').style.display = 'none'; return; }
      var width = $images.querySelector('.image-wrapper').offsetWidth;
      
      $('.prev-btn').style.display = 'block';
      pos--;
      $('.image-gallery .images').style.left = pos * width + 'px';
    }
  }

  applyStyle(style, '.image-gallery');
}

if (window.location.pathname.match(/^\/widgets/)) {
  widgetImageGallery({
    images:['1.png','2.png','3.png','4.png','5.png','6.png'],
    baseUrl: '/data/catalog/mens/t-shirts/f9-t-shirt-black-2x'
  }, 0, {
    padding: 0,
    margin: '30px auto',
    width: '500px',    
  });
}
