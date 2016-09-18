var Tunnel = {
    TUNNEL_COOKIE_KEY: "_tunnelUsername",

    $sendMsgBtn: null,//消息发送按钮
    $discussion: null,//消息容器
    $displayName : null,
    editor:null,//富文本编辑器本身

    init: function () {
        var me = this;
        me.$sendMsgBtn = $('#sendmessage');
        me.$discussion = $("#discussion");
        me.$displayName = $('#displayname');

        var ulHeight = me.$discussion.parent().height();
        me.$discussion.slimScroll({
            height: ulHeight + 'px'
        });

        me.editor = UE.getEditor('editor');

        //用户名的处理
        me.usernameProcess(me.$displayName);


        //快捷键注册
        me.editor.addListener('keydown', function (t, evt) {
            var keyCode = evt.keyCode || evt.which;
            if ((evt.altKey && keyCode === 83) || ((evt.ctrlKey && keyCode === 13)) || (keyCode === 13)) {
                me.$sendMsgBtn.trigger("click");
            }
        });


        //通道处理
        var chat = $.connection.chatHub;


        chat.client.broadcastMessage = function (name, result) {
            //调用函数处理浏览器title
            me.autoClearInterval();

            var date1 = new Date();
            var sendTime = date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();

            var mesageHtml = '<li>' +
                                    '<div class="msgTop">'+
                                        '<label>' + name + '</label>' +
                                        '<span>' + sendTime + '</span>' +
                                    '</div>'+
                                    '<div class="encodeMsg">' + result + '</p>' +
                            '</li>';

            me.$discussion.prepend(mesageHtml);
        };


        $.connection.hub
            .start()
            .done(function () {
                me.$sendMsgBtn.click(function () {
                    var htmlContent = me.editor.getContent();
                    var textContent = me.editor.getContentTxt();

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
                    chat.server.send(me.$displayName.val(), result);
                    me.editor.setContent("", false, false);
                    //editor.execCommand('cleardoc');
                    //editor.body.innerHTML = "";
                    //me.editor.selection.getRange().setCursor(true, false);
                    $(me.editor.body).empty();

                    me.editor.focus();
                });
            });

    },
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
    Tunnel.init();
});

