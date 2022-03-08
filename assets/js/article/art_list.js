$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var pageContent = {
        pagenum: 1, //页码
        pagesize: 1, // 每页显示文章数量
        cate_id: "", // 文章分类的ID
        state: "", // 文章的发布状态
    };
    // 获取文章列表数据
    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: pageContent,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                layer.msg("获取文章列表成功!");
                var htmlStr = template("tplTable", res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            },
        });
    }
    template.defaults.imports.dateFormate = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var hh = dt.getHours();
        hh = hh < 10 ? "0" + hh : hh;
        var mm = dt.getMinutes();
        mm = mm < 10 ? "0" + mm : mm;
        var ss = dt.getSeconds();
        ss = ss < 10 ? "0" + ss : ss;

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };

    // 初始化文章分类的方法

    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败！");
                }
                layer.msg("获取分类数据成功");
                var htmlStr = template("tplCate", res);
                $("[name=cate_id]").html(htmlStr);
                // 动态生成的元素需要layui重新渲染表单
                form.render();
            },
        });
    }
    $("#formFilter").on("submit", function(e) {
        e.preventDefault();
        var cateId = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        pageContent.cate_id = cateId;
        pageContent.state = state;
        initTable();
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法渲染分页
        laypage.render({
            elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到,
            limit: pageContent.pagesize, // 每一页显示几条数据
            limits: [1, 3, 5, 7],
            curr: pageContent.pagenum, // 设置默认被选中的分页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            // 分页跳转函数  触发方式有两种 一是点击页码的时候 二是调用laypage.render方法的时候 第二种方式会导致jump死循环
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值赋值到页面内容参数中
                pageContent.pagenum = obj.curr;
                // console.log(obj.limit); //得到每页显示的条数
                pageContent.pagesize = obj.limit;
                // 如果通过第二种方式调用则first的值为true 就不调用initable()
                // 如果通过第一种方式调用则first的值为FALSE 就调用initable()方法
                //首次不执行
                if (!first) {
                    //do something
                    // 根据最新的页码值渲染页面
                    initTable();
                }
            },
        });
    }
    $("body").on("click", "#btnArtDel", function() {
        var btnDelLength = $('btnArtDel').length
            // 给删除按钮设置自定义data-id属性 然后通过模板引擎 关联到文章Id 再获取Id值
        var pageId = $(this).attr("data-id");
        layer.confirm(
            "是否删除文章？", { icon: 3, title: "提示" },
            function(index) {
                $.ajax({
                    method: "GET",
                    url: "/my/article/delete/" + pageId,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg("删除文章失败!");
                        }
                        layer.msg("删除文章成功！");
                        // 当前数据删除完成后 需判断当前这一页中是否还有剩余数据 如果没有数据就让页码值-1 之后再重新调用initable方法
                        pageContent.pagenum = pageContent.pagenum === 1 ? 1 : pageContent.pagenum - 1
                        initTable()

                    },
                });
                layer.close(index);
            }
        );
    });
    $('body').on('click', '#btnEdit', function() {
        // 将点击编辑对应的文章id通过url参数传递出去
        location.href = '/article/art_edit.html?' + 'id=' + $(this).attr('data-id')
    })
});