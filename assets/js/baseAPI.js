// 每次发起请求都会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 防止用户未登录直接进入有权限的页面
    options.complete = function(res) {
        if (
            res.responseJSON.status == 1 &&
            res.responseJSON.message == "身份认证失败！"
        ) {
            // 强制清空token
            localStorage.removeItem("token");
            // 强制跳转到登录页面
            location.href = "/login.html";
        }

    }

})