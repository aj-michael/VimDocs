var ta, mode, modelbl;
var text, line, pos, vpos;
var clipboard;
var NORMAL = "Normal",
    VISUAL = "Visual",
    INSERT = "Insert";
var wordDelimiters = [" ",".","-","/"];
var scope = this;

function CharacterAt(i) {
    return ta.value.substring(i,i+1);
}

function BeginningOfLastWord() {
    var index = ta.selectionStart-2;
    while (index >= 0 && wordDelimiters.indexOf(CharacterAt(index)) == -1) {
        index = index - 1;
    }
    return index+1;
}

function EndOfNextWord() {
    var index = ta.selectionStart + 1;
    while (index < ta.value.length && wordDelimiters.indexOf(CharacterAt(index)) == -1) {
        index = index + 1;
    }
    return index + 1;
}

function InsertAtCaret(value) {
    pos = ta.selectionStart;
    ta.value = ta.value.substring(0,pos) + value + ta.value.substring(pos,ta.value.length);
    text[line][pos] = value;
    pos = pos + value.length;
    ta.setSelectionRange(pos,pos);
}

function ReplaceAtCaret(value) {
    pos = ta.selectionStart;
    ta.value = ta.value.substring(0,pos) + value + ta.value.substring(pos+1,ta.value.length);
    text[line][pos] = value;
    ta.setSelectionRange(pos,pos);
}

function SetCursorPosition(pos) {
    ta.focus();
    ta.setSelectionRange(pos, pos);
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
        case 97:    // a
            mode = 1;
            modelbl.innerHTML = INSERT;
            break;
        case 98:    // b
            SetCursorPosition(BeginningOfLastWord());
            break;
        case 101:   // e
            SetCursorPosition(EndOfNextWord());
            break;
        case 104:   // h
            pos = ta.selectionStart;
            ta.setSelectionRange(pos-1,pos-1);
            break;
        case 105:   // i
            pos = ta.selectionStart;
            ta.setSelectionRange(pos-1,pos-1);
            mode = 1;
            modelbl.innerHTML = INSERT;
            break;
        case 106:   // j
            break;
        case 107:   // k
            break;
        case 108:   // l
            var pos = ta.selectionStart;
            ta.setSelectionRange(pos+1,pos+1);
            break;
        case 112:   // p
            InsertAtCaret(clipboard);
            break;
        case 114:   // r
            var original = scope['HandleNormalMode'];
            scope['HandleNormalMode'] = function(e, keycode) {
                ReplaceAtCaret(String.fromCharCode(keycode));    
                scope['HandleNormalMode'] = original; 
            }
            break;
        case 118:   // v
            mode = 2;
            modelbl.innerHTML = VISUAL;
            vpos = ta.selectionStart;
            break;
        case 119:   // w
            SetCursorPosition(EndOfNextWord());
            break;
        case 126:   // ~
            pos = ta.selectionStart;
            var current = CharacterAt(pos);
            ReplaceAtCaret(String.fromCharCode(32 ^ current.charCodeAt(0)));
            break;
    }
}

function HandleInsertMode(e, keycode) {
    pos = ta.selectionStart;
    switch (keycode) {
        case 9:     // <tab>
            InsertAtCaret("    ");
            e.preventDefault();
            break;
        case 27:    // <esc>
            mode = 0;
            modelbl.innerHTML = NORMAL;
            e.preventDefault();
            break;
        case 99:    // c
            if (e.ctrlKey) {
                mode = 0;
                modelbl.innerHTML = NORMAL;
                e.preventDefault();
            } else {
                text[line][pos-1] = keycode;
                pos++;
            }
            break
        default:
            text[line][pos] = String.fromCharCode(keycode);
            pos = pos + 1;
    }
}

function HandleVisualMode(e, keycode) {
    switch (keycode) {
        case 27:    // <ESC>
            mode = 0;
            modelbl.innerHTML = NORMAL;
            e.preventDefault();
            break;
        case 99:    // c
            if (e.ctrlKey) {
                mode = 0;
                modelbl.innerHTML = NORMAL;
                e.preventDefault();
            }
            break;
        case 104:   // h
            pos = ta.selectionStart + ta.selectionEnd - vpos;
            if (pos > vpos) {
                ta.setSelectionRange(vpos,pos-1);
            } else {
                ta.setSelectionRange(pos-1,vpos);
            }
            break;
        case 108:   // l
            pos = ta.selectionStart + ta.selectionEnd - vpos;
            if (pos < vpos) {
                ta.setSelectionRange(pos+1,vpos);
            } else {
                ta.setSelectionRange(vpos,pos+1);
            }
            break;
        case 121:   // y
            clipboard = ta.value.substring(ta.selectionStart,ta.selectionEnd);
            ta.setSelectionRange(ta.selectionStart, ta.selectionStart);
            mode = 0;
            modelbl.innerHTML = NORMAL;
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
        case 2:
            e.preventDefault();
            HandleVisualMode(e, keycode);
            break;
    }
}

window.onload = function() {
    ta = document.getElementById('mainta');
    modelbl = document.getElementById('mode');
    ta.value = "";
    modelbl.innerHTML = NORMAL;
    mode = 0;
    text = [];
    line = 0;
    pos = 0;
    text[line] = [];
    ta.onkeypress = HandleKeypress;
    ta.focus();
};
