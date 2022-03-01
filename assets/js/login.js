$(function() {
    $("#link_reg").on("click", function() {
        $(".loginBox").hide();
        $(".regBox").show();
    });
    $("#link_login").on("click", function() {
        $(".regBox").hide();
        $(".loginBox").show();
    });
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        repwd: function(value) {
            var pwd = $('.regBox [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var username = $('.regBox [name=username]').val()
        var password = $('.regBox [name=password]').val()
        $.post('/api/reguser', { username: username, password: password }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，跳转到登录页面')
            $('#link_login').click()
        })
    })
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        var username = $('.loginBox [name=username]').val()
        var password = $('.loginBox [name=password]').val()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                localStorage.setItem('token', res.token)
                location.href = 'index.html'
            }
        })
    })
});