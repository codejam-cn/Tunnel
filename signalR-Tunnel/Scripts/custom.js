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

var Tunnel = {
    autoClearInterval: function () {
        var s = "(●—●)(●—●)(●—●)(●—●)".split("");
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
    var interVal = null;
 

    //var ue = UE.getEditor('editor');
    var editor = UE.getEditor('editor');

    
    
    editor.addshortcutkey("SendMessage", "18+83");

    editor.addListener('SendMessage', function () {
        alert(999)
        $sendMsgBtn.trigger("click");
    })


    editor.plugin.register('kityformula', function () {
        return {
            shortcutkey: {
                "kityformula": "ctrl+13" //手动提交
            },
            commands: {
                'kityformula': {
                    execCommand: function () {
                        alert(9343432)
                        var me = this,
                            form = domUtils.findParentByTagName(me.iframe, "form", false);
                        if (form) {
                            if (me.fireEvent("beforesubmit") === false) {
                                return;
                            }
                            me.sync();
                            form.submit();
                        }
                    }
                }
            }
        }
    });



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



    //通道处理
    var chat = $.connection.chatHub;


    chat.client.broadcastMessage = function (name, message) {
        if (/^\s+$/.test(message)) {
            return false;
        }

        //调用函数处理浏览器title
        Tunnel.autoClearInterval();

        var encodedName = $('<div />').text(name).html();
        var urlRegExp = /^https?:\/\/.*$/;
        if (urlRegExp.test(message)) {
            message = "<a href='" + message + "' target='_blank'>" + message + "</a>";
        }

        //var encodedMsg = $('<div />').text(message).html();  由这一行我们可以得出怎样巧妙encode一段html字符串===> 利用.html()方法即可。ZHAOs 2016年9月6日15:23:10

        var encodedMsg = message;

        var date1 = new Date();
        var sendTime = date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
        var mesageHtml = '<li>' +
                                '<label>' + encodedName + '</label>' +
                                '<span>' + sendTime + '</span>' +
                                '<div class="encodeMsg">' + encodedMsg + '</p>' +
                        '</li>';

        $discussion.append(mesageHtml);
    };







    $.connection.hub
        .start()
        .done(function () {
            $sendMsgBtn.click(function () {

                var htmlContent = UE.getEditor('editor').getContent();

                chat.server.send($displayName.val(), htmlContent);
               
                //UE.getEditor('editor').setContent("", false).focus();
            });
        });
    
    $(document).keydown(function (e) {
        var code = e.keyCode;
        //alt  18   83 s
        if (code === 13) {
            $sendMsgBtn.trigger("click");
        }
    })

   
});

