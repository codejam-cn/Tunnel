var Tunnel = {
    TUNNEL_COOKIE_KEY: "_tunnelUsername",
    //用户名处理
    usernameProcess: function ($displayName) {
        var me = this;

        //显示和设置用户名
        var cookieName = $.cookie(me.TUNNEL_COOKIE_KEY);
        if (!!cookieName === false) {
            var date = new Date();
            var min = date.getMinutes() + " : " + date.getSeconds();
            var name = prompt("请输入您的用户名", min);
            $displayName.val(name);
            $.cookie(me.TUNNEL_COOKIE_KEY, name, { expires: 7 });
        } else {
            $displayName.val(cookieName);
        }


        //更改用户名
        var $changeUsername = $("#changeUsername");
        $changeUsername.click(function () {
            var name1 = prompt("请输入新用户名", $displayName.val());
            $displayName.val(name1);
            $.cookie(me.TUNNEL_COOKIE_KEY, name1);
        });
    },
    autoClearInterval: function () {
        var s = "Tunnel".split("");
        function func() {
            s.push(s[0]);
            s.shift();// 去掉数组的第一个元素  
            document.title = s.join("");
        }
        var interVal = setInterval(func, 1000);//设置时间间隔运行  

        setTimeout(function () {
            clearInterval(interVal);
            document.title = s.join("");
        }, 5000);
    }
};


$(function () {
    var $sendMsgBtn = $('#sendmessage');
    var $discussion = $("#discussion");

    var ulHeight = $discussion.parent().height();
    $discussion.slimScroll({
        height: ulHeight + 'px'
    });

    var editor = UE.getEditor('editor');

 
    var $displayName = $('#displayname');
    Tunnel.usernameProcess($displayName);


    //通道处理
    var chat = $.connection.chatHub;


    chat.client.broadcastMessage = function (name, result) {
        //调用函数处理浏览器title
        Tunnel.autoClearInterval();

        var date1 = new Date();
        var sendTime = date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();

        var mesageHtml = '<li>' +
                                '<label>' + name + '</label>' +
                                '<span>' + sendTime + '</span>' +
                                '<div class="encodeMsg">' + result + '</p>' +
                        '</li>';

        $discussion.prepend(mesageHtml);
    };


    $.connection.hub
        .start()
        .done(function () {
            $sendMsgBtn.click(function () {
                var htmlContent = UE.getEditor("editor").getContent();
                var textContent = UE.getEditor("editor").getContentTxt();

                if (htmlContent === "") {
                    return false;
                }
                var result = "";
                var urlRegExp = /^https?:\/\/.*$/;
                if (urlRegExp.test(textContent)) {
                    result = "<a href='" + textContent + "' target='_blank'>" + textContent + "</a>";
                } else {
                    result = htmlContent;
                }
                chat.server.send($displayName.val(), result);
                editor.setContent("", false);
                editor.focus();
            });
        });

    //$(document).keydown(function (e) {
    //    var code = e.keyCode;
    //    //alt  18   83 s
    //    if (code === 13) {
    //        $sendMsgBtn.trigger("click");
    //    }
    //})

});

