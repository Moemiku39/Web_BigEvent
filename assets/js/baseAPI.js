// 每次发起请求都会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
})