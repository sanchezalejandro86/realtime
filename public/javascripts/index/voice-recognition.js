var recognition = null;

if(!('webkitSpeechRecognition' in window)){
    alert('SU BROWSER NO TIENE HABILITADO EL RECONOCIMIENTO DE VOZ. POR FAVOR ACTUALICELO, DE LO CONTRARIO NO PODRA UTILIZAR ESA FUNCIONALIDAD');
} else {
    recognition = new webkitSpeechRecognition();
    //recognition.lang = 'es-AR';
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;
}

var mic_button = $('#mic-icon');

function activarMic(){
    mic_button.removeClass('inactive');
    mic_button.addClass('active');
}

function desactivarMic(){
    mic_button.removeClass('active');
    mic_button.addClass('inactive');
}

mic_button.click(function(){
    if ($(this).hasClass('active'))
        recognition.stop();
    else if (!started)
        recognition.start();
});

if (recognition != null){

    var to_comma,
        to_send,
        time_comma = 500,
        time_send = 1000 + time_comma,
        append_comma = ', ',
        started = false;

    function clearTimeouts(){
        clearTimeout(to_comma);
        clearTimeout(to_send);
        console.log('clear');
    }

    function startTimeouts(){
        console.log('start');
        to_comma = setTimeout(trigger_addComa, time_comma);
        to_send = setTimeout(trigger_sendMessage, time_send);
    }

    recognition.onstart = function() {
        started = true;
        activarMic();
    };

    var final_transcript = '';
    var sendie = $('#sendie');

    var trigger_sendMessage = function() {
            var text = sendie.val().replace(new RegExp(append_comma + '$'), '');
            sendMessage(text);
            console.log('sending: ' + text);
        },
        trigger_addComa = function(){
            sendie.val(sendie.val() + append_comma);
        };

    recognition.onresult = function(event) {
        clearTimeouts();

        var result = event.results[event.results.length - 1];
        console.log(event.results);

        if (!result.isFinal) return;

        final_transcript = result[0].transcript;

        if (final_transcript == '') return;

        var input = $(sendie);
        input.val(input.val() + final_transcript);
        input.focus();

        input.scrollTop(input[0].scrollHeight);

        final_transcript = '';

        startTimeouts();
    };

    recognition.onerror = function(event) {
        console.log('ERROR SPEECH RECOGNITION');
        console.log(event);
        desactivarMic();
        started = false;
        clearTimeouts();
    };

    recognition.onend = function() {
        console.log('end speech recognition');
        desactivarMic();
        started = false;
    };

    //recognition.onspeechstart = function(){
    //    console.log('speech start');
    //};
    //
    //recognition.onspeechend = function(){
    //    console.log('speech end');
    //};
    //
    //recognition.onaudiostart = function(){
    //    console.log('audio start');
    //};
    //
    //recognition.onaudioend = function(){
    //    console.log('audio end');
    //};
}
