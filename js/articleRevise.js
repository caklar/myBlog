$(function() {
    const editor = editormd("editor", {
        width  : "90%",
        height : "530px",
        path   : "/node_modules/editor.md/lib/",
        saveHTMLToTextarea : true,
    })

    $("form").on("click",function (e) {
        //阻止默认行为
        e.preventDefault();
    })

    $('#btn').on('click', function () {
        let id = $('#a_id').val()
        let topic = $('#topic').val()
        let classify = $('#classify').val()
        let tag = $('#tag').val()
        let content = editor.getHTML()
        let contentmd = $('#md').val()
        
        $.ajax({
            url: '/articleRevise',
            method: 'POST',
            async: true,
            data: {
                id: id,
                topic: topic,
                classify: classify,
                tag: tag,
                content: content,
                contentmd: contentmd
            },
            // dataType: 'json',
            success: function () {
                alert('修改成功')
                location.href='/articleOps'
            }
        })
    })
})