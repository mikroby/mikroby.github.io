'use strict';
const maxDisplayLength = 20;
const calculator = document.querySelector('.calculator');
const display = document.querySelector('.display');
const numberEnding = /\d$/;
const dotEnabled = /[\+\-x÷]\d+$/;
const noDotsYet = /^\d+$/;
const endsWithOperators = /[x÷]$/;
const chooseOnlyOperators = /[\+x÷]|(?<=\d)\-(?=\d)/g
const chooseOnlyNumbers = /((?<!\d)\-)?\d+(\.\d+)?/g;
const operatorObject = {
  '+'(previous, current) { return previous + current },
  '-'(previous, current) { return previous - current },
  'x'(previous, current) { return previous * current },
  '÷'(previous, current) { return previous / current }
};
let errorOccured = false;


const parseLastInput = (event) => {
  const buttonClicked = event.target.textContent;

  if (errorOccured && buttonClicked !== 'C') { return };

  const currentDisplay = display.textContent;
  const endsWithNumber = numberEnding.test(currentDisplay);
  let addToDisplay;

  // ugly and long, but able to avoid all incorrect inputs.
  switch (buttonClicked) {
    case 'C':
      display.textContent = '0';
      addToDisplay = false;
      errorOccured = false;
      break;

    case '=':
      if (endsWithNumber) {
        parseAll(currentDisplay);
      }
      addToDisplay = false;
      break;

    case '.':
      addToDisplay = noDotsYet.test(currentDisplay) || dotEnabled.test(currentDisplay);
      break;

    case '-':
      if (currentDisplay === '0') { display.textContent = ''; }
      addToDisplay = endsWithNumber || endsWithOperators.test(currentDisplay);
      break;

    case '+':
    case 'x':
    case '÷':
      addToDisplay = endsWithNumber;
      break;

    case '0':
      addToDisplay = currentDisplay !== '0' ? true : false;
      break;

    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      if (currentDisplay === '0') { display.textContent = ''; }
      addToDisplay = true;
      break;
  }

  if (currentDisplay.length < maxDisplayLength && addToDisplay) {
    display.textContent += buttonClicked;
  }
};

const error = (errorMessage) => {
  display.textContent = `${errorMessage}`.toUpperCase();
  calculator.classList.add('error');
  const id = setTimeout(() => {
    clearTimeout(id);
    calculator.classList.remove('error')
  }, 600);
}

const checkError = (result) => {

  if (Number.isFinite(result) && result < Number.MAX_VALUE) {
    display.textContent = result.toString();
  }
  else {
    errorOccured = true;
    error('error. press "C"');
  }
};

const calculate = (numbers, operators) => {
  let result;

  if (operators == null) { result = numbers[0]; }
  else {
    result = numbers.reduce((previous, current, index) =>
      operatorObject[operators[index - 1]](previous, current));
  }

  checkError(result);
};

const parseAll = (input) => {
  const numbers = input.match(chooseOnlyNumbers).map(item => Number(item));
  const operators = input.match(chooseOnlyOperators);

  calculate(numbers, operators);
};

// START
(() => {
  document.querySelectorAll('.buttons')
    .forEach(item => item.addEventListener('click', parseLastInput));
})();
