$(function () {
    var chat = $.connection.chatHub;
    chat.client.broadcastMessage = function (name, message) {

        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();

        $('#discussion').append('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };

    $('#displayname').val(1);


    $('#message').focus();



    $.connection.hub
        .start()
        .done(function () {
            $('#sendmessage').click(function () {
                // Call the Send method on the hub.
                chat.server.send($('#displayname').val(), $('#message').val());
                // Clear text box and reset focus for next comment.
                $('#message').val('').focus();
            });
        });
});
