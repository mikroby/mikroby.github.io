'use strict';

// smooth scroll working with js-import
const scroll = new SmoothScroll('a.nav-link, a.navbar-brand', {
  speed: 300,
  speedAsDuration: true
});


// smooth scroll with jquery didn't work under bootstrap
// $('a.nav-link, a.navbar-brand').on('click', function (event) {
//   event.preventDefault();
//   const href = $(this).attr('href');//   
//   $('html, body').animatescroll({ scrollTop: $(href).offset().top }, 300);
// });


// tooltip working
$('[data-toggle="tooltip"]').tooltip()

// modal launch working
$('footer a').on('click', function (event) {
  event.preventDefault();
  const dataTarget = $(this).data('target');
  $(dataTarget).modal();
});

// force navbar to change appearance when scrolled down.
const modifyNavbar = () => {
  const value = document.documentElement.scrollTop;

  if (value > 50 && trigger === false) {
    trigger = true;
    all.forEach(item =>
      item.classList.add('outScrolled'));
  }
  if (value <= 50 && trigger === true) {
    trigger = false;
    all.forEach(item =>
      item.classList.remove('outScrolled'));
  }
}

const all = Array.from(document.querySelectorAll
  ('.nav-link, .navbar, .navbar-brand, .menu'));
let trigger = false;
window.onscroll = modifyNavbar;