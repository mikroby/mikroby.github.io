'use strict';
const url = 'json/got.json';
const method = { method: 'GET' };
const portraitPlaceholder = 'assets/iron throne.png';
const picturePlaceholder = 'assets/pictures/iron throne.jpg';
const shieldPlaceholder = 'assets/houses/shield.png'
const picture = document.querySelector('.picture');
const infoHeader = document.querySelector('.infoHeader');
const shield = document.querySelector('.shield');
const bio = document.querySelector('.bio');
const search = document.querySelector('.input');
let aliveCharacters;


const getJson = async () => {
  try {
    const response = await fetch(url, method);
    const list = await response.json();
    return list;
  } catch (error) {
    console.error('Error: ', error);
    return [];
  }
};

const createTag = (tag, className = '', src = '') => {
  const element = document.createElement(tag);
  if (className) { element.className = className; }
  if (src) { element.src = src; }
  return element;
};

const showPicture = (url) => {
  picture.src = url ? url : picturePlaceholder;
};

const showHeader = (text) => {
  infoHeader.textContent = text;
};

const showHouse = (house) => {
  shield.src = house ?
    `assets/houses/${house}.png` : shieldPlaceholder;
};

const showBio = (text) => {
  bio.textContent = text || 'No Information';
};

const setAnimatedOff = () => {
  const animated = document.querySelector('.animate');
  if (animated) {
    animated.classList.remove('animate');
    animated.nextSibling.classList.remove('stayGrown');
  }
};

const animateSelected = (clickedCaption) => {
  clickedCaption.previousSibling.classList.add('animate');
  clickedCaption.classList.add('stayGrown');
};

const hideUnnecessaryInfo = () => {
  picture.classList.add('displayNone');
  shield.classList.add('displayNone');
  bio.classList.add('displayNone');
}
const revealNeededInfo = () => {
  picture.classList.remove('displayNone');
  shield.classList.remove('displayNone');
  bio.classList.remove('displayNone');
}

const showInfo = (character) => {
  revealNeededInfo();
  showPicture(character.picture);
  showHeader(character.name, character.house);
  showHouse(character.house);
  showBio(character.bio);
};

function getClicked() {
  const clickedCaption = this.lastElementChild;
  setAnimatedOff();
  animateSelected(clickedCaption);
  const character = aliveCharacters
    .filter(character => character.name === clickedCaption.textContent)[0];
  showInfo(character);
};

const sortByName = (list) =>
  list.sort((a, b) => {
    const nameA = a.name.split(' ');
    const nameB = b.name.split(' ');
    const lastNameA = nameA.at(-1).toUpperCase();
    const lastNameB = nameB.at(-1).toUpperCase();
    if (lastNameA < lastNameB) { return -1; }
    if (lastNameA > lastNameB) { return 1; }
    const firstNameA = nameA.at(-2).toUpperCase();
    const firstNameB = nameB.at(-2).toUpperCase();
    if (firstNameA < firstNameB) { return -1; }
    if (firstNameA > firstNameB) { return 1; }
    return 0;
  });

function addEffects() {
  this.firstElementChild.classList.add('grow--img');
  this.lastElementChild.classList.add('grow--caption');
};

function removeEffects() {
  this.firstElementChild.classList.remove('grow--img');
  this.lastElementChild.classList.remove('grow--caption');
};

const createPortrait = (character) => {
  const figure = createTag('figure', 'portrait');
  const urlPortrait = character.portrait || portraitPlaceholder;
  const image = createTag('img', 'portrait--img', urlPortrait);
  const figcaption = createTag('figcaption', 'portrait--caption', '');
  figcaption.textContent = character.name;
  figure.appendChild(image);
  figure.appendChild(figcaption);
  figure.addEventListener('click', getClicked);
  figure.addEventListener('mouseover', addEffects);
  figure.addEventListener('mouseout', removeEffects);
  return figure;
};

const error = () => {
  hideUnnecessaryInfo();
  showHeader('Database is empty or missing !');
};

const createCharacters = (list) => {
  if (list.length === 0) {
    error();
    return
  };

  aliveCharacters = sortByName(list.filter(character => !character.dead));

  const numberOfCharacters = aliveCharacters.length;

  // kill the surplus characters over 48 to be displayed as required.
  for (let i = 0; i < numberOfCharacters - 48; i++) {
    aliveCharacters.pop();
  }
  const container = document.querySelector('.portrait--container');
  aliveCharacters.forEach(character =>
    container.appendChild(createPortrait(character))
  );
};

const searchCharacter = () => {
  if (!search.value.trim()) {
    search.value = '';
    return
  };

  const found = aliveCharacters.find(character =>
    character.name.toUpperCase() === search.value.trim().toUpperCase());

  setAnimatedOff();

  if (found) {
    showInfo(found);
  } else {
    hideUnnecessaryInfo();
    showHeader('Character not found ...');
  }
  search.value = '';
};

const keyboardHandler = (event) => {  
  if (event.key !== 'Enter') { return }
  searchCharacter();
}

const addHandlers = () => {
  document.querySelector('.search__btn').
    addEventListener('click', searchCharacter);
  search.addEventListener('keyup', keyboardHandler);
}

(() => {
  getJson().then(createCharacters);
  addHandlers();
  hideUnnecessaryInfo();
}
)();
