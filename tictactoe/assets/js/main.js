// megállapítások tetszőleges cellaszámú és akár téglalap alakú pálya esetére (is). gyorsabb és általános érvényű a kód:
// 1.) ha N a megnyeréshez szükséges jelek száma, akkor elegendő 2*N-1-ik lépéstől keresni a lehetséges győztest.
// 2.) nem kell az egész táblát végigellenőrizni, elegendő az éppen lerakott jel oszlopában, sorában és a két áthaladó átlóban összeszámolni a lerakott jel db-számát.
// 3.) az éppen aktuális vonal mentén az összeszámolásnál ha a soron következő cella tartalma nem egyezik az előző celláéval, a számlálót nullázni kell és ehhez hozzáadva a kurrens cella értékét folytatni a számlálást.
// az alábbi kód a fentiek közül, egyelőre 3x3-as méretű táblán működve az 1.)-est valósítja meg, később szeretném általános esetre kibővíteni.

'use strict';

// 'X' meaning: marks[0], data-value=-1.
// 'O' meaning: marks[1], data-value=1.
const marks = ['X', 'O'];
const checkPatterns = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9],
  [1, 4, 7], [2, 5, 8], [3, 6, 9],
  [1, 5, 9], [3, 5, 7]
];
const minMarksToWin = 3;
const minStepsToCheckWinner = 2 * minMarksToWin - 1;
let currentMark;
let steps;
let winnerIs;

(function fisrtStart() {
  initialize();
})();

function newGameStart() {
  closeModal();
  initialize();
}

const openModal = (mainMessage, altMessage, okBtnLabel, cancelBtnLabel) => {
  document.querySelector('#overlay').setAttribute('class', 'overlay--appear');
  document.querySelector('#modal').setAttribute('class', 'modal--appear');
  document.querySelector('.modal__header').textContent = mainMessage;
  document.querySelector('.modal__content').textContent = altMessage;
  document.querySelector('.modal__btn__ok').textContent = okBtnLabel;
  document.querySelector('.modal__btn__cancel').textContent = cancelBtnLabel;
}

const closeModal = () => {
  document.querySelector('#overlay').setAttribute('class', 'overlay--vanish');
  document.querySelector('#modal').setAttribute('class', 'modal--vanish');
}

function initialize() {
  document.querySelectorAll('.cell').forEach(item => {
    item.addEventListener('click', gameMainMethod);
    item.setAttribute('data-value', 0);
    item.textContent = '';
  });
  steps = 0;
  winnerIs = '';

  // first player starts with first element of marks array = 'X'.
  changePlayer();
  showPlayer();
}

function gameMainMethod() {

  animateHeader();

  putMark(this);

  if (steps >= minStepsToCheckWinner) {
    check();
  }

  changePlayer();
  showPlayer();
}

function animateHeader() {
  const element = document.querySelector('#game__header');
  element.className = 'game__header--shock';
  const id = setTimeout(() => {
    clearTimeout(id);
    element.className = ''
  }, 510);
}

function putMark(cell) {
  cell.textContent = currentMark;
  cell.setAttribute('data-value', currentMark === marks[0] ? -1 : 1);
  cell.removeEventListener('click', gameMainMethod);
}

function check() {
  let sumOfMarks;

  checkPatterns.forEach(pattern => {
    sumOfMarks = 0;
    pattern.forEach(index =>
      sumOfMarks += Number(document.querySelector(`[data-index = '${index}']`)
        .getAttribute('data-value')));

    if (Math.abs(sumOfMarks) === minMarksToWin) {
      winnerIs = currentMark;
      displayWinner(winnerIs, pattern);
    }
  });

  if (steps === 9 && winnerIs === '') {
    displayDraw();
  }
}

function displayWinner(winnerIs, pattern) {

  document.querySelectorAll('.cell').forEach(element => element.removeEventListener('click', gameMainMethod));

  pattern.forEach(index => document.querySelector(`[data-index = '${index}']`)
    .className = 'cell winnerCells');

  const id1 = setTimeout(() => {
    clearTimeout(id1);
    document.querySelectorAll('.cell.winnerCells')
      .forEach(element => element.className = 'cell')
  }, 2510);

  const id2 = setTimeout(() => {
    clearTimeout(id2);
    openModal(`A győztes: ${winnerIs} jelű játékos!`, '', 'Új játék', 'Kilépés')
  }, 2520);
}

function displayDraw() {
  openModal('Döntetlen eredmény !', 'Vége a játéknak, nincs több üres cella.', 'Új játék', 'Kilépés');
}

function showPlayer(player) {
  document.querySelector('#nextPlayer').textContent = currentMark;
}

function changePlayer() {
  currentMark = marks[steps % 2];
  steps++;
}