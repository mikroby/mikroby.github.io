'use strict';

import { deleteUser, updateUser, newUser } from "./crud.js";
import { start } from "./main.js";
import setModal from "./modal.js";

let defaultValues, temporary;

const clickBtns = {
  'edit--btn': edit,
  'delete--btn': erase,
  'save--btn': save,
  'cancel--btn': cancel
}

const setEventListener = (element, eventFunction) => {
  element.forEach(item => {
    item.addEventListener('click', eventFunction);
  });
};

const btnClickHandlers = () => {
  for (let key of Object.keys(clickBtns)) {
    setEventListener(document.querySelectorAll(`.${key}`), clickBtns[key]);
  }
};

const disableOtherButtons = (clicked) => {
  const allButtons = Array.from(document.querySelectorAll
    ('.edit--btn,.delete--btn,.input--btn'));
  temporary = allButtons.filter(item => item !== clicked);
  temporary.forEach(item => item.style.pointerEvents = "none");
};

const releaseButtons = () => {
  temporary.forEach(item => item.style.pointerEvents = "all");
};

const detectFalseClick = function (event) {
  const row = document.querySelector('#row--modifing');
  let targetElement = event.target;
  do {
    if (targetElement === row) {
      return;
    }
    targetElement = targetElement.parentNode;
  } while (targetElement);

  setModal('incomplete', 5000);
}

const setFalseClickHandler = (parent) => {
  parent.parentElement.id = 'row--modifing';
  document.addEventListener("click", detectFalseClick);
};

const disableFalseClickHandler = () => {
  document.removeEventListener('click', detectFalseClick);
  document.querySelector('#row--modifing').id = '';
};

const createInputs = (parent) => {
  defaultValues = [];
  const grandParent = parent.parentElement;
  const coloums = grandParent.querySelectorAll('td:not(.id):not(.opt)');
  coloums.forEach(item => {
    defaultValues.push(item.textContent);
    item.innerHTML = `<input type="text" value="${item.textContent}">`
  });
};

function edit() {
  const clicked = this;
  const parent = clicked.parentElement;
  clicked.classList.add('displayNone');
  parent.children[1].classList.add('displayNone');
  parent.children[2].classList.remove('displayNone');
  parent.children[3].classList.remove('displayNone');
  createInputs(parent);
  disableOtherButtons(clicked);
  setFalseClickHandler(parent);
};

function erase() {
  const clicked = this;
  const grandParent = clicked.parentElement.parentElement;
  const userId = grandParent.querySelector('.id').textContent;
  grandParent.remove();
  deleteUser(userId).then(start);
};

const validate = (userData, headers) => {
  // it would be better to read regexp-s from settings.json.
  const validators = {
    'name': /^[A-Z][a-z]+( [A-Z][a-z]+[A-z]+)+$/,
    'emailAddress':
      /^[a-z\d][a-z_\d]+((\.[a-z\d][a-z_\d]+)+)?@[a-z\d][a-z_\d]+((\.[a-z\d][a-z_\d]+)+)?\.[a-z]+$/,
    'address': /^\d+ [A-Z][a-z]+( [A-Z][a-z]+[A-z]+)+$/
  };
  return headers.every((item, index) => validators[item].test(userData[index]));
};

const packObject = (userData, headers) => {
  const userObject = {};
  headers.forEach((item, index) => userObject[item] = userData[index]);
  return userObject;
};

function save() {
  const clicked = this;
  const grandParent = clicked.parentElement.parentElement;
  const userId = grandParent.querySelector('.id').textContent;
  const coloums = Array.from(grandParent.querySelectorAll('td:not(.id):not(.opt)'));
  const userData = coloums.map(item => item.firstElementChild.value);
  const headers = coloums.map(item => item.className);

  if (validate(userData, headers)) {
    updateUser(userId, packObject(userData, headers)).then(start);
    setModal('modified', 5000);
    disableFalseClickHandler();
    releaseButtons();
  } else {
    setModal('invalid', 5000);
  }
};

const cancelInputs = (parent) => {
  const grandParent = parent.parentElement;
  const coloums = grandParent.querySelectorAll('td:not(.id):not(.opt)');
  coloums.forEach((item, index) => {
    item.innerHTML = '';
    item.textContent = `${defaultValues[index]}`;
  });
};

function cancel() {
  const clicked = this;
  const parent = clicked.parentElement;
  parent.children[0].classList.remove('displayNone');
  parent.children[1].classList.remove('displayNone');
  parent.children[2].classList.add('displayNone');
  clicked.classList.add('displayNone');
  cancelInputs(parent);
  disableFalseClickHandler();
  releaseButtons();
};

const addNewUser = (event) => {
  event.preventDefault();
  const coloums = Array.from(document.querySelectorAll('.header--inputs input[name]'));
  const userData = coloums.map(item => item.value);
  const headers = coloums.map(item => item.name);

  if (validate(userData, headers)) {
    setModal('success', 5000);
    newUser(packObject(userData, headers)).then(start);
  } else {
    setModal('invalid', 5000);
  }
  return true;
};

export { btnClickHandlers, addNewUser };
