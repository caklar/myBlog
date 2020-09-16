$(function () {
    // 设置分页的路径
    $('.paging-inner a').each(function () {
        pageRoute = '/article/page/' + $(this).text()
        $(this).attr('href', pageRoute)
    })
    // 首页
    $('#first').attr('href', '/page/1')

    // 页面切换操作
    $('.paging-inner').on('click', 'a', function () {
        console.log('1')
        $(this).parent().siblings().children('a').removeClass('currentPage')
        $(this).addClass('currentPage')
    })
})