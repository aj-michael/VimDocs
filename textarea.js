function SetCursorPosition(pos) {
    var obj = document.getElementById('mainta'),
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
}


window.onload = function() {
    var ta = document.getElementById('mainta');

    ta.onkeypress = function(e) {
        var keycode = e.which || e.keyCode,
            key;
        key = String.fromCharCode(keycode);
        if (keycode == 48) {    // '0'
            e.preventDefault();
            SetCursorPosition(0);
        }
    }

};
