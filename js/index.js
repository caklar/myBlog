$(function () {
    // 设置分页的路径
    $('.paging-inner .page').each(function () {
        if ($(this).text() == 1){
            pageRoute = '/'
        } else {
            pageRoute = '/article/page/' + $(this).text()
        }
        $(this).attr('href', pageRoute)
    })

    // 获取当前页数
    // let pageCount = $('.page').length
    let pageCount = $('#next').parent().prev().children('.page').text()
    let currentPage = $('.currentPage').text()
    let prevPage =  currentPage - 1
    let nextPage = parseInt(currentPage) + 1
    // 首页
    $('#first').attr('href', '/')
    // 上一页
    if (currentPage == 1) {
        // 当前页为首页时禁用上一页
        $('#prev').addClass('currentPage')
    } else {
        if (prevPage == 1) {
            $('#prev').attr('href', '/')
        } else {
            $('#prev').attr('href', '/article/page/' + prevPage)
        }
    }
    // 下一页
    if (currentPage == pageCount) {
        // 当前页为末页时禁用下一页
        $('#next').addClass('currentPage')
    } else {
        $('#next').attr('href', '/article/page/' + nextPage)
    }
    // 末页
    $('#last').attr('href', '/article/page/' + pageCount)
})