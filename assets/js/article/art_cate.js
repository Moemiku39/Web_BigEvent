$(function() {
    var layer = layui.layer
    var form = layui.form
        // 获取文章分类列表
    initArticleList()

    function initArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('#tb-tr').html(htmlStr)
            }
        })
    }
    // 定义layer.open索引
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $('#form-add').serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加文章分类失败')
                    }
                    initArticleList()
                        // 根据索引关闭弹出层
                    layer.close(indexAdd);
                }
            })
        })
        // 编辑文章类别
        // 定义修改层索引
    var indexEdit = null
    $('tbody').on('click', '#btnEdit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')

                }
                form.val('form-edit', res.data)
            }

        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArticleList()
            }
        })
    })
    $('body').on('click', '#btnDel', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArticleList()
                }
            })



        });
    })
})