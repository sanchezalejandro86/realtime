if (!window.Kolich){
    Kolich = {};
}

Kolich.Selector = {};
Kolich.Selector.getSelected = function(){
    var t = '';
    if(window.getSelection) {
        t = window.getSelection();
    }else if(document.getSelection) {
        t = document.getSelection();
    }else if(document.selection) {
        t = document.selection.createRange().text;
    }
    return t;
};

Kolich.Selector.mouseup = function(){
    var input = search_input;
    var st = Kolich.Selector.getSelected();

    if ((st + "").trim() == '' ||
        st == input.val() ||
        $(st.focusNode).hasClass('ignore-kolich') ||
        $(st.focusNode.parentNode).hasClass('ignore-kolich') ||
        $(st.focusNode.firstChild).hasClass('ignore-kolich')) return;

    input.val(st); //a pedido de Nicolas, cuando selecciona con el kolich queda eso solo en el input y busca y comparte

    var str = input.val();
    if(str.indexOf(",") != -1){
        str = $.trim(str.substr(str.indexOf(",") + 1 ));
    }
    input.val(str);

    search_button.click();
    sendSearch();
};


$(document).bind("mouseup", Kolich.Selector.mouseup);