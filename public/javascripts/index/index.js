function initializePeerStunTurnOptions() {
    // Call XirSys ICE servers
    $.ajax({
        url: "https://service.xirsys.com/ice",
        data: {
            ident: "fedetemoli",
            secret: "39f3ecf8-4b42-11e5-816c-568c2a156275",
            domain: "www.snailtest.com",
            application: "default",
            room: "default",
            secure: 1
        },
        success: function (data, status) {
            // data.d is where the iceServers object lives
            customConfig = data.d;
            console.log(customConfig);
        },
        async: false
    });
}

var connOpts = { key: 'bp70suzmx5ok1emi' };

var herokuOpts = {
    host: 'testsnail.herokuapp.com',
    port: '',
    debug: 3,
    secure: true
};

var localOpts = {
    key: 'peerjs',
    host: '/',
    port: 443,
    path: '/api',
    debug: 3,
    secure: true
};


function getNewPeer(){
    var conn = localOpts;

    if(conn.config == null){
        initializePeerStunTurnOptions();
        conn.config = customConfig;
    }

    return new Peer(conn);
}
var peer = getNewPeer();

var ping;

function startPing(_peer) {
    ping = setInterval(
        function(){
            if (_peer == null) {
                console.log('no more ping');
                clearInterval(ping);
                return;
            }
            console.log('pinging');
            _peer.socket.send({ type: 'ping' });
        }, 20000);
}

var socket = io();
var mediaStream = null;
var messages;

var color = "";
var suggest = "";

if (json && json.length > 0)
    messages = json;

var sp = $("#search-panel"),
    chat_area = $('#chat-area'),
    search_input = $('#search-input'),
    search_button = $('#search-button');

//**********************+BUSCADOR***********************//
google.load('search', '1', {"language": "pt_br"});

var imageSearch;
function OnLoad() {
    // Our ImageSearch instance.
    imageSearch = new google.search.ImageSearch();
    imageSearch.setResultSetSize(8);
    imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch]);
}
google.setOnLoadCallback(OnLoad);

function removeImg(idRemove){
    var elementToRemove = $("#" + idRemove);
    if(elementToRemove != null){
        elementToRemove.remove();
    }
}

function fullSizeImage(aImageId){
    socket.emit('full size image', {urlImage: $('#img_'+aImageId).attr('src'), input: search_input.val(),classRoom: classRoom});
}

function searchComplete(searcher) {
    if (!searcher.results) return;

    var sr = $('#search-results');
    sr.html('');

    var agregados = 0;

    if (searcher.results.length > 0) {
        var randomSearchId = Math.floor(Math.random() * 1000000000) + 1;
        for (var i = 0; i < searcher.results.length; i++) {
            var result = searcher.results[i];

            var randomImageId = Math.floor(Math.random() * 1000000000) + 1;
            sr.append(
                '<div class="col-xs-4 search-result">\
                    <a id="' + randomImageId + '" href="javascript:fullSizeImage(' + randomImageId + ')" target="_blank">\
                        <img id="img_' + randomImageId + '" onerror="removeImg('+randomImageId+')" class="search-results-image" src="' + result.url + '" />\
                    </a>\
                </div>'
            );
            agregados++;
            if ((agregados) % 3 == 0){
                sr.append('<div class="separator"></div>');
            }
        }
    } else {
        sr.html('Sem resultados');
    }
}

//******************************************************//

function sendSearch() {
    socket.emit('search changed', {text: search_input.val(), classRoom: classRoom});
}

$(document).ready(function(){

    var event_search,
        sendie = $('#sendie');

    if (locked) sendie.attr('disabled', 'true');

    search_button.on('click', function(){
        clearTimeout(event_search);
        var items = search_input.val().split(',');
        imageSearch.execute(items[items.length - 1].trim());
    });

    search_input.on('keydown', function(e) {
        if (e.which == 17) { //--Comparte la b�squeda con CTRL
            search_button.click();
            sendSearch();
        } else if (e.keyCode == 13){
            search_button.click();
        }
    });

    search_input.on('input', function(e) {
        clearTimeout(event_search);
        event_search = setTimeout(function () {
            search_button.click();
            console.log(search_input.val());
        }, 1000);
    });

    $("#fullScreen").click(function(e){
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    });

    //************SOCKET EVENTS********************//
    socket.on('search changed', function(data){
        if (data.classRoom == classRoom){
            search_input.val(data.text);
            search_button.click();
        }
    });

    socket.on('newMessageChat', function (data) {
        if (data.classRoom == classRoom){
            addChatMsg(data, false);
        }
    });

    socket.on('messageChatChanged', function (data) {
        if (data.classRoom == classRoom){
            $("#" + data.inputId).text(data.text);
        }
    });

    socket.on('messageRemoved', function (data) {
        removeChatMsg(data.inputId);
    });

    socket.on('full size image', function (data) {
        if (data.classRoom == classRoom){
            search_input.val(data.input);
            var imageUrl = data.urlImage;
            var sr = $('#search-results');
            //imageBackHtml = sr.html();
            sr.empty();

            var myImage = new Image();
            myImage.className  = "search-results-big-image";
            myImage.src = imageUrl;

            var buttonReturn = '<button class="returnImageList" style="background-color: transparent;border: 0;">\
                                    <img src="/images/back_button.png" style="height:60px;" alt="BACK" title="BACK">\
                                </button>';

            sr.append(myImage);
            sr.append(buttonReturn);
        }
    });

    socket.on('clear search images', function (data) {
        if (data.classRoom == classRoom){
            search_input.val('');
            var sr = $('#search-results');
            sr.empty();
        }
    });
    //**********************************************//

    var search_results = $('#search-results');

    sendie.keydown(function (e) {
        processKeyDownChat(e);
    });

    chat_area.on("keydown", "li .messages p", function(e){
        if (e.which == 46){
            e.preventDefault(); //--El SUPR no suprime
            return;
        }

        if (e.which == 13 && !e.shiftKey) {
            var inputId = $(e.target).attr('id');
            var item = $("#" + inputId).parent();

            sendUpdate(e, true);

            item.removeClass('msg-pending');
            e.preventDefault();
        }

    });

    chat_area.on('input', 'li .messages p', function(e) {
        sendUpdate(e, false);

        $(e.target).parent().addClass('msg-pending');
        if ($(e.target).text() == "")
            $(e.target).text(' ');
    });

    function sendUpdate(e, persist){
        var inputId = $(e.target).attr('id');
        var inputValue = $(e.target).text();

        socket.emit('messageChatChanged', {
            text: inputValue,
            inputId: inputId,
            classRoom: classRoom,
            update: persist
        });
    }

    $(messages).each(function(i, data) {
        if (profesor) {
            addChatMsg(data, data.teacher);
        } else {
            addChatMsg(data, false); //si no es profesor, se agregan como si fueran de otros porque no podemos identifcar alumnos aun
        }
    });

    search_results.on("click", ".returnImageList", function(e){
        search_button.click();
    })

    $('#chat-area').on('click', '.msg-remove', function (e) {
        var id = $(this).siblings('.messages').children('p').attr('id');
        socket.emit('messageRemoved', { inputId: id, classRoom : classRoom });

        removeChatMsg(id);
    });
});

function removeChatMsg(id) {
    var msg = $('#' + id);
    msg.parent().parent().remove();
}
function addChatMsg(data, sent){

    var date = new Date(data.inputId);

    var msg =
        '<li class="' + (sent?'self':'other') + '" data.sender="' + data.author + '">\
            ' + (canRemove(data.author)? '<span class="glyphicon glyphicon-remove msg-remove"></span>': '') + '\
            <div class="triangle"></div>\
            <div class="messages">\
                <p id="' + data.inputId + '" contenteditable="' + canEdit(data.author) + '" style="word-break:keep-all;">' + data.text + '</p>\
                <span class="sender ignore-kolich">' + data.author + '</span>\
            </div>\
        </li>';

    $('#chat-area').append(msg);
    document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
}

function sendMessage(text){

    var data = {
        text: text,
        inputId: Date.now(),
        classRoom: classRoom,
        author: $('#name').val(),
        teacher: profesor
    };

    socket.emit('newMessageChat', data);
    addChatMsg(data, true);
    $('#sendie').val("");
}