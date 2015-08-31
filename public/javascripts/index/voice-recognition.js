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
        time_comma = 2500,
        time_send = 3000 + time_comma,
        append_comma = ', ',
        started = false;

    function clearTimeouts(){
        clearTimeout(to_comma);
        clearTimeout(to_send);
        //console.log('clear');
    }

    function startTimeouts(){
        //console.log('start');
        to_comma = setTimeout(trigger_addComa, time_comma);
        to_send = setTimeout(trigger_sendMessage, time_send);
    }

    var final_transcript = '';
    var sendie = $('#sendie');
    var recognizing = false;
    var ignore_onend = false;
    var final_span = $('#final_span');
    var interim_span = $('#interim_span');

    var trigger_sendMessage = function() {
            //var text = getSendieText().replace(new RegExp(append_comma + '$'), '');
            var text = final_transcript.replace(new RegExp(append_comma + '$'), '');
            sendMessage(text);
            final_transcript = '';
            console.log('sending: ' + text);
        },
        trigger_addComa = function() {
            setSendieText(getSendieText() + append_comma);
        };

    recognition.onstart = function() {
        started = true;
        activarMic();
        recognizing = true;
        ignore_onend = false;
    };

    recognition.onresult = function(event) {
        clearTimeouts();

        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
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
        final_span.html(linebreak(final_transcript));
        interim_span.html(linebreak(interim_transcript));
    };

    recognition.onerror = function(event) {
        console.log('ERROR SPEECH RECOGNITION');
        console.log(event);
        desactivarMic();
        started = false;
        clearTimeouts();
        ignore_onend = true;
    };

    recognition.onend = function() {
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
        recognizing = false;

        recognition.start();
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
