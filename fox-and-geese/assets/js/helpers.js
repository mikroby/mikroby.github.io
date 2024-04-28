const infoBox = document.querySelector(".infoBox");
const geeseNumber = document.querySelector("#geeseNumber");
const button = document.querySelector("#button");

let timerId, keepPrevMessage;

export const showInfoBoxWithTimeout = (text, timeout = 1500, action) => {
  if (keepPrevMessage) {
    return
  }

  if (action === 'keep') {
    keepPrevMessage = true
  }

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
    keepPrevMessage = false
    infoBox.classList.remove("showUp");
  }, timeout);
};

export const buttonHandler = (text, onClickCallback) => {
  button.textContent = text;
  if (onClickCallback) {
    button.onclick = onClickCallback;
  }
};

export const showGeeseNumber = (value) => {
  geeseNumber.textContent = value;
};
