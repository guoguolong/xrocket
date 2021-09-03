const BASE_DIR = `${__dirname}/..`;
const DATA_DIR = `${BASE_DIR}/data`;
const fs = require('fs');
const glob = require('glob');
const categories = require(`${DATA_DIR}/source/categories`);
const products = require(`${DATA_DIR}/source/products`);

let globalPrdId = 0;
function fillProducts(prodFiles, products, c, subC) {
  prodFiles.forEach((prdFolder) => {
    const prdKey = prdFolder.split('/').pop();
    const imageFiles = glob.sync(`${prdFolder}/*.png`);
    const images = imageFiles.map(imgFile => imgFile.split('/').pop())
    products[prdKey].id = ++globalPrdId;
    products[prdKey] = products[prdKey] || {};
    products[prdKey].key = prdKey;
    let names = prdKey.split('-');
    products[prdKey].name = products[prdKey].name || names.join(' ').toUpperCase();
    products[prdKey].categoryId = c.id;
    if (products[prdKey].stock === undefined) products[prdKey].stock = 9999;
    if (subC) products[prdKey].subCategoryId = subC.id;
    products[prdKey].images = images;


    if (c.name.toLowerCase() === 'mens') {
      products[prdKey].colors = products[prdKey].colors || ['black'];
      products[prdKey].sizes = products[prdKey].sizes || ["S", "M", "L", "XL", "2X", "3XL", "4X", "5X"];

      if (subC.name.toLowerCase() === 't-shirts') {
        products[prdKey].sizeChart = products[prdKey].sizeChart || [
          { Size: 'S,M,L,XL,2X,3X,4X,5X' },
          { Length: '28",29",30",31",32",33",34",35"' },
          { Width: '19",20.5",22",24",26",28",30",32"' },
        ];
        products[prdKey].price = products[prdKey].price || 30;
      } else if (subC.name.toLowerCase() === 'outerwear') {
        products[prdKey].sizeChart = products[prdKey].sizeChart || [
          { Size: 'S,M,L,XL,2X,3X,4X,5X' },
          { Length: '27",28",29",30",31",32",33",34"' },
          { Width: '19.25",21.25",23.25",25.25",27.25",29.25",31.25",32.25"' }
        ];
        products[prdKey].price = products[prdKey].price || 50;
      }
    } else if (c.name.toLowerCase() === 'womens') {
      products[prdKey].colors = products[prdKey].colors || ['black'];
      if (subC.name.toLowerCase() === 't-shirts') {
        products[prdKey].sizes = products[prdKey].sizes || ["S", "M", "L", "XL", "2X"];
        products[prdKey].sizeChart = products[prdKey].sizeChart || [
          { Size: 'S,M,L,XL,2X' },
          { Length: '26.5",27",27.5",28.25",29"' },
          { Width: '16.25",17.25",18.25",19.75",21.25"' },
        ];
        products[prdKey].price = products[prdKey].price || 30;
      } else if (subC.name.toLowerCase() === 'outerwear') {
        products[prdKey].sizes = products[prdKey].sizes || ["S", "M", "L", "XL", "2X", "3XL", "4X", "5X"];
        products[prdKey].sizeChart = products[prdKey].sizeChart || [
          { Size: 'S,M,L,XL,2X,3X,4X,5X' },
          { Length: '28",29",30",31",32",33",33",34"' },
          { Width: '20",22",24",26",28",30",32",34"' },
        ];
        products[prdKey].price = products[prdKey].price || 50;
      }
    } else if (c.name.toLowerCase() === 'kids') {
      products[prdKey].colors = products[prdKey].colors || ['black'];
      if (subC.name.toLowerCase() === 't-shirts') {
        products[prdKey].price = products[prdKey].price || 20;
        products[prdKey].sizes = products[prdKey].sizes || ["S", "M", "L"];
        products[prdKey].sizeChart = products[prdKey].sizeChart || [
          { Size: 'S,M,L' },
          { Length: '20.5",22",23.5"' },
          { Width: '15.5",17",18.5"' },
        ];
      } else if (subC.name.toLowerCase() === 'outerwear') {
        products[prdKey].price = products[prdKey].price || 28;
        products[prdKey].sizes = products[prdKey].sizes || ["S", "M", "L", "XL", "2X", "3XL", "4X", "5X"];
        products[prdKey].sizeChart = products[prdKey].sizeChart || [
          { Size: '2T,3T,4T,S,M,L' },
          { Length: '15.5",16.5",17.5",19",20.5",22"' },
          { Width: '13.5",14",14.5",15.5",17",18.5"' },
        ];
      }
    } else {
      products[prdKey].price = products[prdKey].price || 121;
    }
    if (products[prdKey].colors && products[prdKey].sizes) {
      products[prdKey].specs = ['colors', 'sizes'];
    } else if (products[prdKey].colors) {
      products[prdKey].specs = ['colors'];
    } else if (products[prdKey].sizes) {
      products[prdKey].specs = ['sizes'];
    } else if (products[prdKey].vehicle) {
      products[prdKey].specs = ['vehicle'];
    }

    let subP = '';

    if (subC) {
      subP += `/${subC.name.toLowerCase()}`;
    }
    products[prdKey].baseUrl = `/data/catalog/${c.name.toLowerCase()}${subP}/${prdKey}`;
  })
}

categories.forEach(c => {
  if (c.children && c.children.length > 0) {
    c.children.forEach(subC => {
      const files = glob.sync(`${DATA_DIR}/catalog/${c.name.toLowerCase()}/${subC.name.toLowerCase()}/*`)
      fillProducts(files, products, c, subC);
    });
  } else {
    const files = glob.sync(`${DATA_DIR}/catalog/${c.name.toLowerCase()}/*`);
    fillProducts(files, products, c);
  }
})

// console.log(JSON.stringify(products, null, 2));

fs.writeFileSync(`${DATA_DIR}/source/products.js`, 'module.exports = ' + JSON.stringify(products, null, 2))
fs.writeFileSync(`${DATA_DIR}/products.js`, 'var products = ' + JSON.stringify(Object.values(products), null, 2))
fs.writeFileSync(`${DATA_DIR}/categories.js`, 'var categories = ' + JSON.stringify(categories, null, 2))
