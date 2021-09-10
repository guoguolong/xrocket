function initData(domId) {
  document.getElementById(domId).innerHTML = '...';

  window.localStorage.clear();
  window.sessionStorage.clear();

  window.localStorage.setItem("users", JSON.stringify(users));
  window.localStorage.setItem("categories", JSON.stringify(categories));
  window.localStorage.setItem("products", JSON.stringify(products));


  var updateProds = JSON.parse(window.localStorage.getItem("products")) || [];
  var updateUsers = JSON.parse(window.localStorage.getItem("users")) || [];
  var updateCategories = JSON.parse(window.localStorage.getItem("categories")) || [];


  document.getElementById(domId).innerHTML = `
  <div>Sample Data Initialization Completed.</div>
  <div><span class="quantity">${updateProds.length}</span> Products, 
  <span class="quantity">${updateCategories.length}</span> Categories, 
  <span class="quantity">${updateUsers.length}</span> Users saved into window.localStorage.</div>
`;
}
