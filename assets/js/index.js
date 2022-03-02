$(function() {
    getUserInfo();
    layui.use(["element", "layer", "util"], function() {
        var element = layui.element,
            layer = layui.layer,
            util = layui.util,
            $ = layui.$;

        //头部事件
        util.event("lay-header-event", {
            //左侧菜单事件
            menuLeft: function(othis) {
                layer.msg("展开左侧菜单的操作", {
                    icon: 0,
                });
            },
            menuRight: function() {
                layer.open({
                    type: 1,
                    content: '<div style="padding: 15px;">处理右侧面板的操作</div>',
                    area: ["260px", "100%"],
                    offset: "rt", //右上角
                    anim: 5,
                    shadeClose: true,
                });
            },
        });
    });
    var layer = layui.layer;
    // 实现退出功能
    $("#logout").on("click", function() {
        layer.confirm(
            "确定退出登录？", { icon: 3, title: "提示" },
            function(index) {
                // 清空本体储存token
                localStorage.removeItem("token");
                // 重新跳转到login页面
                location.href = "/login.html";
                // 关闭confirm询问框
                layer.close(index);
            }
        );
    });
});
// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            renderAvatar(res.data);
        },


    });
}
// 设置用户文字头像或图片头像切换显示
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎  " + name);
    if (user.user_pic !== null) {
        $(".text-avanter").hide();
        $(".layui-nav-img").attr("src", user.user_pic).show();
    } else {
        $(".layui-nav-img").hide();
        var firstName = name[0].toUpperCase();
        $(".text-avanter").html(firstName);
    }
}