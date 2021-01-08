$(function () {
    // 获取初始路径,用以区分不同页面
    const route = $('#first').attr('href')
    if (route == '/article') {
        $('#first').attr('href', '/')
    }
    // 设置分页的路径
    $('.paging-inner .page').each(function () {
        let pageRoute = ''
        if ($(this).text() == 1) {
            if (route == '/article') {
                pageRoute = '/'
            } else {
                pageRoute = route
            }
        } else {
            pageRoute = route + '/page/' + $(this).text()
        }
        $(this).attr('href', pageRoute)
    })

    // 获取当前页数
    // let pageCount = $('.page').length
    let pageCount = $('#next').parent().prev().children('.page').text()
    let currentPage = $('.currentPage').text()
    let prevPage =  currentPage - 1
    let nextPage = parseInt(currentPage) + 1
    // 上一页
    if (currentPage == 1) {
        // 当前页为首页时禁用上一页
        $('#prev').addClass('currentPage')
    } else {
        if (prevPage == 1) {
            if (route == '/article') {
                $('#prev').attr('href', '/')
            } else {
                $('#prev').attr('href', route)
            }
        } else {
            $('#prev').attr('href', route + '/page/' + prevPage)
        }
    }
    // 下一页
    if (currentPage == pageCount) {
        // 当前页为末页时禁用下一页
        $('#next').addClass('currentPage')
    } else {
        $('#next').attr('href', route + '/page/' + nextPage)
    }
    // 末页
    $('#last').attr('href', route + '/page/' + pageCount)
})