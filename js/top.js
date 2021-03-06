$(function () {
    $(window).on('scroll', function () {
        // 回到顶部的显示和隐藏
        if ($(this).scrollTop() > 400) {
            $('.top').show()
        } else {
            $('.top').hide()
        }
    })

    // 点击回到顶部
    $('.top').on('click', function () {
        // 清除定时器防止重叠
        clearInterval(timer)

        // 设置定时器
        var timer = setInterval(function () {
            // 页面滚动距离大于 0 时开始改变
            if ($(window).scrollTop() > 0) {
                // 距离递减
                let top = $(window).scrollTop() - 100
                $(window).scrollTop(top)
            } else {
                // 滚动到顶部时清除定时器
                clearInterval(timer)
            }
        }, 10)
    })
})