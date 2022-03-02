$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(val) {
            if (val.length > 6) {
                return '用户昵称必须在 1~6 个字符中间'
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                    // 调用父页面index中的方法 重新渲染用户头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})