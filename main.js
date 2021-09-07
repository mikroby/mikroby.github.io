function newsLetter() {
    alert("Feliratkozás esetén értesítőt küldünk koncertjeinkről!");
}

let clickAbleImage = document.querySelectorAll('.photos img');
for (let i = 0; i < clickAbleImage.length; i++) {
    clickAbleImage[i].onclick = function () { window.open(this.src) };
}

let clickAbleElement = document.querySelectorAll('div[class*="header"]');
for (let i = 0; i < clickAbleElement.length; i++) {
    clickAbleElement[i].onclick = function () { location.assign("/index.html#pageTop") };
}
