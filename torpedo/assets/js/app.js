"use strict";

import {
  version,
  texts,
  languages,
  banners,
  bannerURL,
  storageItemName,
} from "./config.js";

import { startFirstGame, setLanguage } from "./game.js";

// static DOM elements
const title = document.querySelector("title");
const infos = document.querySelectorAll(".info");
const instructions = document.querySelector("#instructions");

// dynamic DOM elements
export const header = document.querySelector("header");
export const board = document.querySelector("#board");
export const message = document.querySelector("#message");
export const shotNumber = document.querySelector("#shotNumber");
export const hitNumber = document.querySelector("#hitNumber");
export const sunkNumber = document.querySelector("#sunkNumber");
export const button = document.querySelector("#game_control");

const allLanguageTexts = languages
  .map((lang) => Object.entries(texts[lang]))
  .flat();

const matchingPair = (content) =>
  allLanguageTexts.find((keyValuePair) => keyValuePair.includes(content));

const fillUIContentBy = (language) => {
  const {
    title: titleText,
    infos: infoTexts,
    instructions: instructionsText,
  } = texts[language].static;

  const { headline, descriptions, shipElementlist, backToTop } =
    instructionsText;

  title.textContent = titleText;

  header.textContent = titleText;

  const messagePair = matchingPair(message.textContent);

  message.textContent = messagePair ? texts[language][messagePair[0]] : "";

  infos.forEach(
    (info, index) => (info.firstChild.textContent = infoTexts[index])
  );

  const buttonPair = matchingPair(button.textContent);

  button.textContent = buttonPair
    ? texts[language][buttonPair[0]]
    : texts[language].instructions;

  instructions.innerHTML = `
  <h1>${headline}</h1>
  <p>${descriptions[0]}<br>
  ${descriptions[1]}</p>
  <ul>
  ${shipElementlist.map((item) => `<li>${item}</li>`).join("")}
  </ul>
  <p>${descriptions[2]}</p>
  <p>${descriptions[3]}</p>

  <a href="#top">
    <div class="btn">${backToTop}</div>
  </a>`;

  setLanguage(language);
};

// IIFE starter. first run on page load/refresh. set basics.
(() => {
  const fragment = document.createDocumentFragment();

  languages.forEach((language, index) => {
    const flag = document.createElement("img");

    flag.className = "flag";
    flag.alt = `${language}_flag`;
    flag.title = `change to ${language}`;
    flag.src = `${bannerURL}/${banners[language]}.svg`;
    flag.onclick = () => {
      const selectedLanguage = languages[index];
      fillUIContentBy(selectedLanguage);
      localStorage.setItem(storageItemName, JSON.stringify(selectedLanguage));
    };

    fragment.appendChild(flag);
  });

  document.querySelector("#banners").appendChild(fragment);

  board.dataset.version = `v${version}`;

  const defaultLanguage =
    JSON.parse(localStorage.getItem(storageItemName)) || languages[0];

  fillUIContentBy(defaultLanguage);
  startFirstGame();
})();
