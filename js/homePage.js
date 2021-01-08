$(function () {
    // 搜索事件
    $('#search-btn').on('click', function () {
        let str = $('#search-input').val()
        let route = '/articleSearch/'
        $(this).attr('href', route + str)
    })
    // // 设置 cookie
    // function setCookie(name, value, {expires, path, domain, secure}) {
    //     // 使中文转化为编码形式防止乱码
    //     var cookieStr = name + "=" + escape(value)
    //     if (expires) {
    //         cookieStr += ";expires=" + expires // 设置日期函数
    //     }
    //     if (path) {
    //         cookieStr += ";path=" + path;
    //     }
    //     if (domain) {
    //         cookieStr += ";domain=" + domain;
    //     }
    //     if (secure) {
    //         cookieStr += ";secure";
    //     }
    //     document.cookie = cookieStr;
    // }
    // // 获取 cookie
    // function getCookie(name) {
    //     var prefix = name + "="
    //     var cookieStartIndex = document.cookie.indexOf(prefix)
    //     if (cookieStartIndex == -1) {
    //         return null
    //     }    
    //     var cookieEndIndex=document.cookie.indexOf(";", cookieStartIndex+prefix.length)
    //     if (cookieEndIndex == -1) {
    //         cookieEndIndex = document.cookie.length
    //     }
    //     return unescape(document.cookie.substring(cookieStartIndex+prefix.length,cookieEndIndex))
    // }
    // // 移除 cookie
    // function removeCookie(name) {
    //     document.cookie = name + "=;expires=" + new Date(0);
    // }
    // // 时间修正
    // function fixDate(date) {
    //     var base = new Date(0)
    //     var skew = base.getTime()
    //     if (skew > 0) {
    //         date.setTime(date.getTime() - skew)
    //     }
    // }

    // var now = new Date()
    // fixDate(now)
    // now.setTime(now.getTime() + 24 * 60 * 60 * 1000)
    // var visits = getCookie('counter')
    // if (!visits) {
    //     visits = 1
    //     setCookie("counter", visits, now)
    // }
    // console.log("您是到访的第" + visits + "位用户！")
})