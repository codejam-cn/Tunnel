/*
    功能点：
    0.基本功能，聊天内容公屏显示
    1.进入可指定用户名，否则用默认的
    2.可以随时修改用户名
    3.enter快捷键
    4.发送消息为空则不会发出去
    5.每条消息后缀带有发送时间
    6.如果发送内容含有链接，则链接直接可点击
    ZHAOs @ 2016年9月8日11:23:34

*/
/*
    技术备注：
    用户名的cookie的key值： _tunnelUsername
*/

$(function () {

    var TUNNEL_COOKIE_KEY = "_tunnelUsername";
    //用户名处理
    var $displayName = $('#displayname');

    var cookieName = $.cookie(TUNNEL_COOKIE_KEY);
    if (!!cookieName === false) {
        var date = new Date();
        var min = date.getMinutes() + " : " + date.getSeconds();
        var name = prompt("请输入您的用户名", min);
        $displayName.val(name);
        $.cookie(TUNNEL_COOKIE_KEY, name);
    } else {
        $displayName.val(cookieName);
    }
    

    //textarea焦点
    var $textarea = $('#message');
    $textarea.focus();

    //更改用户名
    var $changeUsername = $("#changeUsername");
    $changeUsername.click(function () {
        var name1 = prompt("请输入新用户名", $displayName.val());
        $displayName.val(name1);
        $.cookie(TUNNEL_COOKIE_KEY, name1);
    });


    var $sendMsgBtn = $('#sendmessage');
    var $discussion = $("#discussion");
    //通道处理
    var chat = $.connection.chatHub;
    chat.client.broadcastMessage = function (name, message) {
        if (/^\s+$/.test(message)) {
            return false;
        }

        var encodedName = $('<div />').text(name).html();
        var urlRegExp = /https?:\/\/.*/;
        if (urlRegExp.test(message)) {
            message = "<a href='" + message + "' target='_blank'>" + message + "</a>";
        }

        //var encodedMsg = $('<div />').text(message).html();  由这一行我们可以得出怎样巧妙encode一段html字符串===> 利用.html()方法即可。ZHAOs 2016年9月6日15:23:10

        var encodedMsg = message;

        var date1 = new Date();
        var sendTime = date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();

        var mesageHtml = '<li><strong>' + encodedName + '</strong>:&nbsp;&nbsp;<span>' + encodedMsg + '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>' + sendTime + '</i></li>';

        $discussion.append(mesageHtml);
    };







    $.connection.hub
        .start()
        .done(function () {
            $sendMsgBtn.click(function () {
                chat.server.send($displayName.val(), $textarea.val());
                $textarea.val('').focus();
            });
        });


    //模拟点击
    $(document).keydown(function (e) {
        var code = e.keyCode;
        if (code === 13) {
            $sendMsgBtn.trigger("click");
        }
    })
});
