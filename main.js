function newsLetter() {
    alert("Feliratkozás esetén értesítőt küldünk koncertjeinkről!");
}

let clickAbleImage = document.querySelectorAll('.photos img');
for (let i = 0; i < clickAbleImage.length; i++) {
    clickAbleImage[i].onclick = function () { window.open(this.src) };
}

let clickAbleElement = document.querySelector(".header1");
clickAbleElement.onclick = function () {location.assign("/index.html#pageTop")};

clickAbleElement = document.querySelector(".header2");
clickAbleElement.onclick = function () {location.assign("/links.html")};