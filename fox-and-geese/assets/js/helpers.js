const infoBox = document.querySelector(".infoBox");
const geeseNumber = document.querySelector("#geeseNumber");
const button = document.querySelector(".btn");

let timerId;

export const showInfoBoxWithTimeout = (text, timeout = 1500) => {
  if (timerId) {
    clearTimeout(timerId);
  }
  infoBox.textContent = text;
  infoBox.classList.add("showUp");

  if (timeout === Infinity) {
    return;
  }

  timerId = setTimeout(() => {
    clearTimeout(timerId);
    timerId = null;
    infoBox.classList.remove("showUp");
  }, timeout);
};

export const buttonHandler = (text, onClickCallback) => {
  button.textContent = text;
  if (onClickCallback) {
    button.onclick = onClickCallback;
  }
};

export const showGeeseNumber = (num) => {
  geeseNumber.textContent = num;
};
