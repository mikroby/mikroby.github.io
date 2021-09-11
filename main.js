function newsLetter() {
    alert("Feliratkozás esetén értesítőt küldünk koncertjeinkről!");
}

function openNewWindow() {
    window.open(this.src);
}

// All image on the photo-page can be clickable and open in new window
let clickAbleImage = document.querySelectorAll('.photos img');
for (let i = 0; i < clickAbleImage.length; i++) {
    clickAbleImage[i].onclick = openNewWindow;
}

// in all pages the headers can be clickable...
let clickAbleHeader = document.querySelector(".header1");
clickAbleHeader.onclick = function () { location.assign("/index.html#pageTop") };

clickAbleHeader = document.querySelector(".header2");
clickAbleHeader.onclick = function () { location.assign("/links.html#link") };