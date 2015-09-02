var recognition = null;

function setRecognition() {
    recognition = new webkitSpeechRecognition();
    //recognition.lang = 'es-AR';
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    addEvents(recognition);
}

if(!('webkitSpeechRecognition' in window)){
    alert('SU BROWSER NO TIENE HABILITADO EL RECONOCIMIENTO DE VOZ. POR FAVOR ACTUALICELO, DE LO CONTRARIO NO PODRA UTILIZAR ESA FUNCIONALIDAD');
} else {
    setRecognition();
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

function startRec(){
    setRecognition();
    recognition.start();
}
function stopRec(){
    recognition.stop();
}

mic_button.click(function(){
    if ($(this).hasClass('active')){
        ignore_onend = false;
        restart = false;
        stopRec();
    } else if (!started)
        startRec();
});

function addEvents(rec){

    rec.onstart = function() {
        started = true;
        restart = true;
        activarMic();
        ignore_onend = false;
    };

    rec.onresult = function(event) {
        clearTimeouts();

        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            rec.onend = null;
            stopRec();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                startTimeouts();
            } else
                interim_transcript += event.results[i][0].transcript;
        }
        final_transcript = capitalize(final_transcript);
        showFinal(linebreak(final_transcript));
        showInterim(linebreak(interim_transcript));
    };

    rec.onerror = function(event) {
        console.log('ERROR SPEECH RECOGNITION');
        console.log(event);
        desactivarMic();
        started = false;
        clearTimeouts();
        ignore_onend = false;
        restart = true;
    };

    rec.onend = function() {
        if (ignore_onend) return;

        console.log('end speech recognition');
        desactivarMic();

        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }

        started = false;

        if (restart) startRec();
    };

}

if (recognition != null){

    var to_comma,
        to_send,
        time_comma = 1000,
        time_send = 1000 + time_comma,
        append_comma = ', ',
        started = false;

    function clearTimeouts(){
        clearTimeout(to_comma);
        clearTimeout(to_send);
    }

    function startTimeouts(){
        to_comma = setTimeout(trigger_addComma, time_comma);
        to_send = setTimeout(trigger_sendMessage, time_send);
    }

    var final_transcript = '';
    var sendie = $('#sendie');
    var ignore_onend = false;
    var restart = true;

    var trigger_sendMessage = function() {
            removeComma(append_comma);
            sendMessage();
            final_transcript = '';
        },
        trigger_addComma = function() {
            addComma(append_comma);
        };

    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    var first_char = /\S/;
    function capitalize(s) {
        return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
}
