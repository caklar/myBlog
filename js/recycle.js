$(function () {
    // 恢复
    $('.recover').on('click', function () {
        // 获取文章 id
        const id = $(this).parent().parent().children('td:first-child').text()
        // 文章删除请求
        $.ajax({
            url: '/articleRecover',
            method: 'POST',
            async: true,
            data: {
                id: id
            },
            // dataType: 'json',
            success: function () {
                alert('文章已恢复')
                location.href = '/recycle'
            }
        })
    })
    // 删除
    $('.delete').on('click', function () {
        // 获取文章 id
        const id = $(this).parent().parent().children('td:first-child').text()
        // 文章删除请求
        $.ajax({
            url: '/articleDelete',
            method: 'POST',
            async: true,
            data: {
                id: id
            },
            // dataType: 'json',
            success: function () {
                alert('文章已删除')
                location.href = '/recycle'
            }
        })
    })
})