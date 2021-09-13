function clearData() {
  window.localStorage.clear();
  window.sessionStorage.clear();
}

function initData(selector) {
  document.querySelector(selector).innerHTML = '...';

  clearData();

  window.localStorage.setItem("users", JSON.stringify(users));
  window.localStorage.setItem("categories", JSON.stringify(categories));
  window.localStorage.setItem("products", JSON.stringify(products));


  var updateProds = JSON.parse(window.localStorage.getItem("products")) || [];
  var updateUsers = JSON.parse(window.localStorage.getItem("users")) || [];
  var updateCategories = JSON.parse(window.localStorage.getItem("categories")) || [];


  document.querySelector(selector).innerHTML = `
  <div>
    <span class="quantity">${updateProds.length}</span> Products, 
    <span class="quantity">${updateCategories.length}</span> Categories, 
    <span class="quantity">${updateUsers.length}</span> Users initialized.
  </div>
`;
}

function checkInit() {
  var isInit = true;
  
  var categories = window.localStorage.getItem('categories');
  var users = window.localStorage.getItem('users');
  var products = window.localStorage.getItem('products');
// console.log(!orders1 , !categories1 , !products1)
  if (!users || !categories || !products) {
    isInit = false;
    clearData();
  }
  return isInit;
}