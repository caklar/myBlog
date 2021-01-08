$(function () {
    // 文本框 label 动画
    $('.item input').on('focus', function () {
        $(this).siblings('label').stop().animate({
            'top': '-5px'
        }, 200)
    })
    $('.item input').on('blur', function () {
        if ($(this).val() == '') {
            $(this).siblings('label').stop().animate({
                'top': '20px'
            }, 200)
        }
    })
    $('#profile').on('focus', function () {
        $(this).siblings('label').stop().animate({
            'top': '-20px'
        }, 200)
    })
    $('#profile').on('blur', function () {
        if ($(this).val() == '') {
            $(this).siblings('label').stop().animate({
                'top': '20px'
            }, 200)
        }
    })

    // 文件上传预览
    $('#image').on('change', function () {
        // 取到文件对象
        let file = $('#image')[0].files[0]
        // 生成一个文件阅读器对象赋值给 filereader
        let filereader = new FileReader()
        // 把文件读到 filereader 对象中
        // 读文件需要时间，需要文件读完再去操作 img
        filereader.readAsDataURL(file)

        filereader.onload = function () {
            $('#headImage').attr('src', filereader.result)
            // $('#url').val(filereader.result)
        }
    })

    $('#save').on('click', function () {
        // 获取包括图片文件的表单数据
        let formdata = new FormData($('#mymes')[0])
        console.log(formdata.get('name'))
        // 判断是否选择图片
        if (formdata.get('image').name == '') {
            let myname = $('#name').val()
            let intro = $('#profile').val()
            let link1 = $('#link1').val()
            let link2 = $('#link2').val()
            let link3 = $('#link3').val()
            // 未选择图片则保留原来图片
            let image = $('#default').val()

            $.ajax({
                url: '/revisePersonal',
                type: 'POST',
                data: {
                    name: myname,
                    intro: intro,
                    link1: link1,
                    link2: link2,
                    link3: link3,
                    image: image
                },
                success: function (data) {
                    if (data = 'success') {
                        // 网页重定向
                        location.href = '/manage'
                    }
                }
            })
        } else {
            // 提交表单数据
            $.ajax({
                url: '/revisePersonal',
                type: 'POST',
                data: formdata,
                cache: false,           // 取消缓存
                processData: false,     // 不去处理发送的数据,不需要参数序列化
                contentType: false,     // 不去设置 Content-Type 请求头,否则默认参数无法处理数据
                success: function (data) {
                    if (data = 'success') {
                        // 网页重定向
                        location.href = '/manage'
                    }
                }
            })
        }
    })
})