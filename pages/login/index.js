function login() {
  var username = $id('username').value;
  var password = $id('password').value;
  var users = window.localStorage.getItem('users');
  users = JSON.parse(users);
  console.log('username, password:', username, password)
  var isLogin = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      isLogin = true;
      break;
    }
  }

  if (isLogin) {
    window.sessionStorage.setItem('token', username);
    window.location.href = '../home/index.html';
  } else {
    alert('用户名密码错误')
  }
}

$('.action-login').onclick = login;

