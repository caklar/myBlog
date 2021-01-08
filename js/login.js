$(function () {
    // 文本框 label 动画
    $('.item input').on('focus', function () {
        $(this).siblings('label').stop().animate({
            'top': '-5px'
        }, 200)
        $(this).siblings('label').css('color', '#555')
    })
    $('.item input').on('blur', function () {
        if ($(this).val() == '') {
            $(this).siblings('label').stop().animate({
                'top': '20px'
            }, 200)
        }
        $(this).siblings('label').css('color', '#999')
    })
    
    // 登录
    $('#sign').on('click', function () {
        let username = $('#username').val()
        let password = $('#password').val()
        $.ajax({
            url: '/userlogin',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                if (data == 1) {
                    location.href = '/manage'
                } else {
                    alert('用户名或密码不正确')
                }
            }
        })
    })
})
