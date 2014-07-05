var cursor;

function $(elid) {
    return document.getElementById(elid);
}

function nl2br(txt) {
    return txt.replace(/\n/g, "<br />");
}

function writeIt(from, e) {
    e = e || window.event;
    var w = $("writer");
    var tav = from.value;
    w.innerHTML = nl2br(tav);
}

function moveIt(count, e) {
    e = e || window.event;
    var keycode = e.keyCode || e.which;
    if (keycode == 37 && parseInt(cursor.style.left) >= (0-((count-1)*10))) {
        // left arrow key
        cursor.style.left = parseInt(cursor.style.left) - 12 + "px";
    } else if (keycode == 39 && (parseInt(cursor.style.left) + 10) <= 0) {
        // right arrow key
        cursor.style.left = parseInt(cursor.style.left) + 12 + "px";
    }
}

window.onload = function() {
    document.getElementById("setter").value = "";
    cursor = $("cursor");
    cursor.style.left = "0px";
};
