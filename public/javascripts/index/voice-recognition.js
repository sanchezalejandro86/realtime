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
    else
        recognition.start();
});

if (recognition != null){

    recognition.onstart = function() {
        activarMic();
    };

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

        if (final_transcript != ''){
            var input = $(sendie);
            input.val(input.val() + final_transcript);
            input.focus();
            final_transcript = '';
        }
    };

    recognition.onerror = function(event) {
        console.log('ERROR SPEECH RECOGNITION');
        console.log(event);
        desactivarMic();
    };

    recognition.onend = function() {
        console.log('end speech recognition');
        //desactivarMic();
    };

}
