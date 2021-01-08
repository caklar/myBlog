$(function () {
    $('.delete').on('click', function () {
        // 获取文章 id
        const id = $(this).parent().parent().children('td:first-child').text()
        // 文章删除请求
        $.ajax({
            url: '/articleThrow',
            method: 'POST',
            async: true,
            data: {
                id: id
            },
            // dataType: 'json',
            success: function () {
                alert('文章已移入回收站')
                location.href='/articleOps'
            }
        })
    })
})