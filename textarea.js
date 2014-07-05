var ta;
var mode;   // 0 for normal, 1 for insert
var modelbl;

function SetCursorPosition(pos) {
    if (ta.selectionStart) {
        ta.focus();
        ta.setSelectionRange(pos, pos);
    } else {
        ta.focus();
    }
}

function StartOfFile() {
    SetCursorPosition(0);
}

function EndOfFile() {
    var temp = ta.value;
    ta.value = ' ';
    ta.value = temp;
}

function HandleNormalMode(e, keycode) {
    switch (keycode) {
        case 36:    // $
            EndOfLine();
            break;
        case 48:    // 0
            SetCursorPosition(0);
            break;
        case 97:
            var pos = ta.selectionStart;
            ta.setSelectionRange(pos-1,pos-1);
            mode = 1;
            modelbl.innerHTML = "Insert";
            break;
        case 104:   // h
            var pos = ta.selectionStart;
            ta.setSelectionRange(pos-1,pos-1);
            break;
        case 105:   // i
            mode = 1;
            modelbl.innerHTML = "Insert";
            break;
        case 106:   // j
            break;
        case 107:   // k
            break;
        case 108:   // l
            var pos = ta.selectionStart;
            ta.setSelectionRange(pos+1,pos+1);
            break;
            
    }
}

function HandleInsertMode(e, keycode) {
    switch (keycode) {
        case 27:    // <ESC>
            mode = 0;
            modelbl.innerHTML = "Normal";
            e.preventDefault();
            break;
        case 99:    // c
            if (e.ctrlKey) {
                mode = 0;
                modelbl.innerHTML = "Normal";
                e.preventDefault();
            }
            break;
    }
}

function HandleKeypress(e) {
    var keycode = e.which || e.keyCode;
    switch (mode) {
        case 0:
            e.preventDefault();
            HandleNormalMode(e, keycode);
            break;
        case 1:
            HandleInsertMode(e, keycode);
            break;               
    }
}

window.onload = function() {
    ta = document.getElementById('mainta');
    modelbl = document.getElementById('mode');
    ta.value = "";
    modelbl.innerHTML = "Normal";
    mode = 0;
        
    ta.onkeypress = HandleKeypress;
};
