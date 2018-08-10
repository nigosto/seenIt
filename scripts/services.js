const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_r1r1KFKSQ';
const APP_SECRET = '369df604171b405facf5df5360e62b25';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ':' + APP_SECRET)};
const TOKEN_HEADERS = {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')}

const service = (function () {
    function register(username,password) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username,password}
        }).then(function (res) {
            saveAuthInSession(res)
            notify.showInfo('User registration successful!');
        }).catch(notify.handleError)
    }
    
    function login(username,password) {
       return $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: {username,password}
        })
    }

    function logout() {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/_logout',
            headers: TOKEN_HEADERS
        }).then(function (res) {
            sessionStorage.clear()
        }).catch(notify.handleError)
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken)
        sessionStorage.setItem('id', userInfo._id)
        sessionStorage.setItem('username', userInfo.username)
    }

    return {register,login,logout,saveAuthInSession}
})();