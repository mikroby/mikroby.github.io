'use strict';

// coloumns x rows must be even number.
// figures array must contain as many elements as half of the cards' number.
const rows = 2;
const coloumns = 5;
const clock = document.querySelector('.clock');
const chooseFrom = [];
const figures = [
  '<i class="fas fa-cloud-sun-rain"></i>',
  '<i class="fas fa-umbrella"></i>',
  '<i class="fas fa-dove"></i>',
  '<i class="fas fa-dog"></i>',
  '<i class="fas fa-cat"></i>'
];
let timer, timerEnabled,
  pairsFound, cardsFlipped;


const getClassedTag = (className) => Array.from(document.querySelectorAll(`.${className}`));

const createClassedTag = (tag, nameClass) => {
  const element = document.createElement(tag);
  element.className = nameClass;
  return element;
};

const prepareField = () => {
  const playfield = document.querySelector('.playField');
  playfield.innerHTML = '';

  for (let i = 0; i < rows; i++) {
    const row = createClassedTag('div', 'rows');

    for (let i = 0; i < coloumns; i++) {
      const card = createClassedTag('div', 'cards');
      card.addEventListener('click', flipCard);

      const cardBack = createClassedTag('div', 'cards--back');
      card.appendChild(cardBack);

      const cardFront = createClassedTag('div', 'cards--front');
      card.appendChild(cardFront);

      row.appendChild(card);
    }

    playfield.appendChild(row);
  }
};

const initializeVariables = () => {
  timer = 0;
  timerEnabled = false;
  cardsFlipped = 0;
  pairsFound = 0;
};

const mixCards = () => {
  figures.forEach(item => {
    chooseFrom.push(item, item);
  });

  let index;
  getClassedTag('cards--front').forEach(item => {
    index = Math.trunc(Math.random() * chooseFrom.length);
    item.innerHTML = chooseFrom[index];
    chooseFrom.splice(index, 1);
  });
};

const showClock = () => {
  clock.textContent =
    `${Math.trunc(timer / 60).toString().padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`;

  if (timerEnabled) { timing(); }
};

const timing = () => {
  const id = setTimeout(() => {
    clearTimeout(id);
    timer++;
    showClock()
  }, 1000)
};

const startGame = () => {
  initializeVariables();
  showClock();
  prepareField();
  mixCards();
};

function flipCard() {
  if (!timerEnabled) { timerEnabled = true; timing(); }

  this.removeEventListener('click', flipCard);
  this.classList.add('cards--clicked');

  cardsFlipped++;

  if (cardsFlipped === 2) { checkPairs(); }
};

const stayFlipped = (clickedCards) => {
  clickedCards.forEach(item => {
    item.classList.replace('cards--clicked', 'cards--flipped');
  });
};

const disableOthers = () => {
  const disabled = Array.from(document.querySelectorAll
    ('.playField .cards:not(.cards--clicked):not(.cards--flipped)'));

  disabled.forEach(item => {
    item.removeEventListener('click', flipCard);
    item.classList.add('cards--disabled');
  });

  return disabled;
}

const enableOthers = (disabled) =>
  disabled.forEach(item => {
    item.addEventListener('click', flipCard)
    item.classList.remove('cards--disabled');
  });

function checkPairs() {
  const disabledCards = disableOthers();
  const clickedCards = getClassedTag('cards--clicked');

  if (clickedCards[0].innerHTML === clickedCards[1].innerHTML) {
    stayFlipped(clickedCards);
    cardsFlipped = 0;
    pairsFound++;
    enableOthers(disabledCards);

  } else {
    cardsFlipped = 0;
    const id = setTimeout(() => {
      clearTimeout(id);
      enableOthers(disabledCards);
      flipClickedBack(clickedCards)
    }, 2000);
  }

  if (pairsFound === figures.length) { gameEnd(); }
};

function flipClickedBack(clickedCards) {
  clickedCards.forEach(item => {
    item.classList.remove('cards--clicked');
    item.addEventListener('click', flipCard);
  });
};

function gameEnd() {
  timerEnabled = false;

  const waitFor = new Promise((resolve) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      getClassedTag('cards').forEach(item =>
        item.classList.remove('cards--flipped'));
      resolve()
    }, 5000)
  });

  waitFor.then(() => {
    const id = setTimeout(() => {
      clearTimeout(id);
      startGame()
    }, 550)
  });
};

export default startGame;
