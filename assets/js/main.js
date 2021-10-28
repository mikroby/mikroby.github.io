'use strict';

// function declaration-nel.
/* function openModal() {
    document.querySelector('#overlay').setAttribute('class','overlay--appear');
    document.querySelector('#modal').setAttribute('class','modal--appear');
}

function closeModal(){
    document.querySelector('#overlay').setAttribute('class','overlay--vanish');
    document.querySelector('#modal').setAttribute('class','modal--vanish');
}
 */

// arrow function-nel.
const openModal = () => {
    document.querySelector('#overlay').setAttribute('class', 'overlay--appear');
    document.querySelector('#modal').setAttribute('class', 'modal--appear');
}

const closeModal = () => {
    document.querySelector('#overlay').setAttribute('class', 'overlay--vanish');
    document.querySelector('#modal').setAttribute('class', 'modal--vanish');
}