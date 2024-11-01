const infoBox = document.querySelector(".infoBox");
const geeseNumber = document.querySelector("#geeseNumber");
const button = document.querySelector("#button");

let timerId,
  overrideEnabled = true;

export const showInfoBoxWithTimeout = (text, timeout = 1500, action) => {
  switch (action) {
    case "no_override":
      overrideEnabled = false;
      break;
    case "override":
      overrideEnabled = true;
      break;
    default:
  }

  if (!overrideEnabled && action !== "no_override") {
    return;
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
    overrideEnabled = true;
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
