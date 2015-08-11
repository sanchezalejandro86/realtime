var socket = io();
//var peer = new Peer('', {
//    key: 'peerjs',
//    host: 'peer-jlavera.c9.io',
//    port: 8080,
//    path: '/peerjs',
//    debug: 3,
//    secure: false
//});

function setConnection(){
    // peer = new Peer({key: 'bp70suzmx5ok1emi'});
    peer = new Peer('', {
        //key: 'peerjs',
        host: 'testsnail.herokuapp.com',
        port: '',
        //path: '/peerjs',
        debug: 3,
        secure: true
    });
    return peer;
}

var peer;
setConnection();

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

var recognition = null;


if(!('webkitSpeechRecognition' in window)){
    $("#mic_off").show();
    $("#mic_on").hide();
    alert('SU BROWSER NO TIENE HABILITADO EL RECONOCIMIENTO DE VOZ. POR FAVOR ACTUALICELO, DE LO CONTRARIO NO PODRA UTILIZAR ESA FUNCIONALIDAD');
} else {
    recognition = new webkitSpeechRecognition();
    //recognition.lang = 'es-AR';
    recognition.lang = 'pt-BR';
    //recognition.continuous = true;
    //recognition.interimResults = true;
    $("#mic_on").show();
    $("#mic_off").hide();
}

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
                    <a id="'+randomImageId+'" href="javascript:fullSizeImage('+randomImageId+')" target="_blank"><img id="img_'+randomImageId+'" onerror="removeImg('+randomImageId+')" class="search-results-image" src="' + result.url + '"></a>\
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

//*********************KOLICH********************//
if (!window.Kolich){
    Kolich = {};
}

Kolich.Selector = {};
Kolich.Selector.getSelected = function(){
    var t = '';
    if(window.getSelection){
        t = window.getSelection();
    }else if(document.getSelection){
        t = document.getSelection();
    }else if(document.selection){
        t = document.selection.createRange().text;
    }
    return t;
};

Kolich.Selector.mouseup = function(){
    var st = Kolich.Selector.getSelected();
    if ((st + "").trim() == '' ||
        $(st.focusNode).hasClass('ignore-kolich') ||
        $(st.focusNode.parentNode).hasClass('ignore-kolich') ||
        $(st.focusNode.firstChild).hasClass('ignore-kolich')) return;

    var input = search_input;
    input.val(st); //a pedido de Nicolas, cuando selecciona con el kolich queda eso solo en el input y busca y comparte

    var str = input.val();
    if(str.indexOf(",") != -1){
        str = $.trim(str.substr(str.indexOf(",") + 1 ));
    }
    input.val(str);

    search_button.click();
    sendSearch();
};

//**********************************************//
function sendSearch() {
    socket.emit('search changed', {text: search_input.val(), classRoom: classRoom});
}

$(document).ready(function(){

    if (locked) $('#sendie').attr('disabled', 'true');

    var event_search;

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

    $(document).bind("mouseup", Kolich.Selector.mouseup);

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
            $("#" + data.inputId + ' .msg-text').text(data.text);
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

            var buttonReturn = '<input type="button" class="returnImageList" value="Back" />';

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

    //************VOICE RECOGNITION********************//
    if(recognition != null){
        recognition.onstart = function() {
            $("#mic_on").hide();
            $("#mic_off").show();
        }

        var final_transcript = '';

        recognition.onresult = function(event) {
            var interim_transcript = '';

            for (var i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            if(final_transcript != ''){
                var input = search_input;
                if (input.val() != "") //--Agregar coma
                    final_transcript = ", " + final_transcript;

                input.val(input.val() + final_transcript);
                input.focus();
                final_transcript = '';
                search_button.click();
            }

            //final_transcript = capitalize(final_transcript);
            //final_span.innerHTML = linebreak(final_transcript);
            //interim_span.innerHTML = linebreak(interim_transcript);

            //alert(final_transcript);
        }

        recognition.onerror = function(event) {
            alert('ERROR SPEECH RECOGNITION');
            $("#mic_off").hide();
            $("#mic_on").show();
        }

        recognition.onend = function() {
            $("#mic_off").hide();
            $("#mic_on").show();
        }

        $("#mic_on").click(function(){
            recognition.start();
            $("#mic_on").hide();
            $("#mic_off").show();
        });

        $("#mic_off").click(function(){
            recognition.stop();
            $("#mic_off").hide();
            $("#mic_on").show();
        });
    }
    //*********************************************//

    $('#sendie').keydown(function (e) {
        processKeyDownChat(e);
    });

    chat_area.on("keydown", ".chatInput .msg-text", function(e){
        if (e.which == 46) e.preventDefault(); //--El SUPR no suprime

        var inputId = $(e.target).parent().attr('id');
        var item = $("#" + inputId);
        var inputValue = $(e.target).text();
        var update = (e.which == 13 && !e.shiftKey);

        socket.emit('messageChatChanged', { text: inputValue, inputId: inputId, classRoom: classRoom, update: update });

        item.removeClass('msg-pending');
        if (update) e.preventDefault();
    });

    chat_area.on('input', '.chatInput .msg-text', function(e){
        $(e.target).parent().addClass('msg-pending');
        if ($(e.target).text() == "")
            $(e.target).text(' ');
    });

    function sendUpdate(udate){

    }

    $(messages).each(function(i, data) {
        if (profesor) {
            addChatMsg(data, data.teacher);
        }else {
            addChatMsg(data, false); //si no es profesor, se agregan como si fueran de otros porque no podemos identifcar alumnos aun
        }
    });

    $("#search-results").on("click", ".returnImageList", function(e){
        /*var sr = $('#search-results');
         sr.empty();
         sr.append(imageBackHtml);
         imageBackHtml = null;*/
        search_button.click();
    })


});

function removeChatMsg(id) {
    var msg = $('#' + id);
    if (!msg.prev().hasClass('chatInput') && !msg.next().hasClass('chatInput')) {
        msg.prev().remove();
        msg.prev().remove();
    }
    msg.remove();
}

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

function addChatMsg(data, sent){
    var date = new Date(data.inputId);
    var msg =
        '<div contentEditable="false" id="' + data.inputId + '" \
            class="form-control chatInput ' + (sent? 'msg-sent' : 'msg-rcv')+ '" data-sender="' + data.author + '">\
            <span class="msg-text" contenteditable="' + (!locked && profesor) + '" style="word-break:keep-all;">' + data.text + '</span>\
            ' + getRemove() + '\
        </div>';
    /* '<div contentEditable="false" id="' + data.inputId + '" \
     class="form-control chatInput ' + (sent? 'msg-sent' : 'msg-rcv')+ '" data-sender="' + data.author + '">\
     <span class="msg-text" contenteditable="true">' + data.text + '</span>\
     ' + getRemove() + '\
     <span contenteditable="false" class="msg-date">' +
     padLeft(date.getDate(),2) + "/" + padLeft(date.getMonth() + 1, 2) + "/" + padLeft(date.getYear() + 1900, 4) + ' ' + padLeft(date.getHours(),2) + ':' + padLeft(date.getMinutes(),2) + '</span>\
     </div>'; */

    var chat_area = $('#chat-area');
    var last = $('#chat-area>*:last-child');

    if (last.length == 0 || data.author != last.data('sender'))
        chat_area.append('\
                            <hr class="chat-separator">\
                            <span class="msg-sender ' + (sent? 'msg-sender-sent' : 'msg-sender-rcv') + '">' +
            data.author.substring(0, 9) + '</span>');

    chat_area.append(msg);
    document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
}
