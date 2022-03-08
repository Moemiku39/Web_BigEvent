$(function() {
    var layer = layui.layer
    var form = layui.form
    iniCate()
    initEditor()

    function iniCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                var htmlStr = template('tplTable', res)
                $('[name=cate_id]').html(htmlStr)
                    // 因为下拉列表内容是动态生成的  所以需要调用form.render方法重新渲染表格来显示内容
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImg').on('click', function() {
        $('#iptFile').click()

    })
    $('#iptFile').on('change', function(e) {
            // 获取文件列表数组
            var files = e.target.files
            if (files.length === 0) {
                return
            }
            // 根据选择的文件，创建一个对应的 URL 地址：
            var newImgURL = URL.createObjectURL(files[0])
                //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
        // 定义文章状态 默认已发布
    var artState = '已发布'
    $('#btnDraft').on('click', function() {
        artState = '草稿'
    })
    $('#formPub').on('submit', function(e) {
        e.preventDefault()
            // 基于form表单快速创建formdata对象
        var formData = new FormData($(this)[0])
            // 将文章的发布状态 存入表单数据中
        formData.append('state', artState)

        //将封面裁剪后图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象存储到表单数据中
                formData.append('cover_img', blob)
                    //  调用发布文章的方法
                pubArticle(formData)
            })
    })

    function pubArticle(formData) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: formData,
            // 如果向服务器提交formdata格式的数据 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                console.log(res);
                layer.msg('发布文章成功！')
                    // 发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})