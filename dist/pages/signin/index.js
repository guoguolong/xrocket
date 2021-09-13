function pageLogin() {
    function signin() {
        var email = $('.email').value;
        var password = $('.password').value;
        var users = window.localStorage.getItem('users');
        users = JSON.parse(users) || [];

        var userLogined = false;
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === email && users[i].password === password) {
                userLogined = users[i];
                break;
            }
        }

        if (userLogined) {
            $('.errmsg').className = 'errmsg';
            $('.errmsg').innerHTML = '';

            window.sessionStorage.setItem('user', JSON.stringify({
                email: userLogined.email,
                username: userLogined.username,
                nickname: userLogined.nickname,
            }));
            var from = queryParse(window.location.search).f;
            if (from && from.match(/^\/pages\//)) {
                window.location.href = from;
            } else {
                window.location.href = '/pages/home/index.html';
            }
        } else {
            $('.errmsg').className = 'errmsg errmsg-highlight';
            $('.errmsg').innerHTML = 'Wrong email or password, try again.'
        }
    }
    $('.action-signin').onclick = signin;
}

pageLogin();