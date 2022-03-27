'use strict';

import { readData } from "./crud.js";
import { files } from "./main.js";

const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');


const setModal = async (type, timeOut) => {
  const settings = await readData(files.URL, files.settingsJSON);

  const { messages } = settings;
  const { styling } = settings;

  modal.textContent = messages[type];
  modal.style = `${styling[type]}`;
  overlay.classList.add('overlay--appear');
  modal.classList.add('modal--appear');
  modal.focus();

  const id = setTimeout(() => {
    clearTimeout(id);
    closeModal()
  }, timeOut);
};

const closeModal = () => {
  modal.blur();
  modal.classList.remove('modal--appear');
  const id = setTimeout(() => {
    clearTimeout(id);
    overlay.classList.remove('overlay--appear');
  }, 550);
};

export default setModal;
