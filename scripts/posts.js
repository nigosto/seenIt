let posts = (function () {
    function getAllPosts() {
       return $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/posts?query={}&sort={"_kmd.ect": -1}',
            headers: TOKEN_HEADERS
        })
    }

    return {getAllPosts}
})();