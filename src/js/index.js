let loginData = {
    title: '标签',
    list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
};

$.ajax({
    type: "GET",
    // async:false,
    url: "../components/list.html",
    data: loginData,
    dataType: "html",
    success: function(data){
        var render = template.compile(data);
        var html = render(loginData);
        $("#nav").html("").html(html);
    }
});

