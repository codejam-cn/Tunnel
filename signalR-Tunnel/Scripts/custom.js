$(function () {
    var chat = $.connection.chatHub;
    chat.client.broadcastMessage = function (name, message) {

        var encodedName = $('<div />').text(name).html();

        var urlRegExp = /https?:\/\/.*/;
        if (urlRegExp.test(message)) {
            message = "<a href='" + message + "' target='_blank'>" + message + "</a>";
        }

        //var encodedMsg = $('<div />').text(message).html();  由这一行我们可以得出怎样巧妙encode一段html字符串===> 利用.html()方法即可。ZHAOs 2016年9月6日15:23:10

        var encodedMsg = message;

        var mesageHtml = '<li><strong>' + encodedName + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>';

        $('#discussion').append(mesageHtml);
    };

    $('#displayname').val(1);


    $('#message').focus();



    $.connection.hub
        .start()
        .done(function () {
            $('#sendmessage').click(function () {                
                chat.server.send($('#displayname').val(), $('#message').val());                
                $('#message').val('').focus();
            });
        });

    $(document).keydown(function (e) {
        var code = e.keyCode;
        if (code === 13) {
            $('#sendmessage').trigger("click");
        }
    })
});
