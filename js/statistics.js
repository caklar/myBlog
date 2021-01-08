$(function () {
    // 实现数字的动态变化
    let vistors = $('#vistors').text()
    let clickCount = $('#clickCount').text()
    // 初始计数
    let num1 = 0, num2 = 0
    // 变化时间
    let time1 = 1000 / vistors, time2 = 1000 / clickCount
    // 定时器实现数字变化
    let timer1 = setInterval(function () {
        num1 ++
        if (num1 >= vistors) {
            $('#vistors').text(vistors)
            clearInterval(timer1)
        } else {
            $('#vistors').text(num1)
        }
    }, time1)
    let timer2 = setInterval(function () {
        num2 ++
        if (num2 >= clickCount) {
            $('#clickCount').text(clickCount)
            clearInterval(timer2)
        } else {
            $('#clickCount').text(num2)
        }
    }, time2)
    // 获取点击及日期数据
    let date = JSON.parse($('#date').text())
    let count = JSON.parse($('#count').text())
    let myChart = echarts.init(document.getElementById('weekly'))
    // 显示标题，图例和坐标轴
    myChart.setOption({
        title: {
            text: '近七天点击量统计'
        },
        tooltip: {},
        legend: {
            data:['点击量']
        },
        xAxis: {
            data:  date
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '点击量',
            type: 'line',
            data: count
        }]
    })
    // 实现文章排行的动态变化
    let Width = 500 / parseInt($($('.articlecount')[0]).text())
    $('.bar').each(function () {
        let width = Math.ceil(Width * parseInt($(this).siblings('.articlecount').text()))
        $(this).animate({
            width: width
        }, 1000)
    })
})