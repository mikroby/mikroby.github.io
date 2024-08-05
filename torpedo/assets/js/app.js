"use strict";

import {
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

  message.textContent = "";

  infos.forEach(
    (info, index) => (info.firstChild.textContent = infoTexts[index])
  );

  const allTextsFlatten = languages
    .map((lang) => Object.entries(texts[lang]).flat())
    .flat();
  const index = allTextsFlatten.findIndex(
    (item) => item === button.textContent
  );
  button.textContent =
    index > 0
      ? texts[language][allTextsFlatten[index - 1]]
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
  document.querySelector(".banners").innerHTML = languages
    .map(
      (language) =>
        `<img class="flag" alt="${language}_flag" src="${bannerURL}/${banners[language]}.svg" title="change to ${language}">`
    )
    .join("");

  document.querySelectorAll(".flag").forEach(
    (flag, index) =>
      (flag.onclick = () => {
        const selectedLanguage = languages[index];
        fillUIContentBy(selectedLanguage);
        localStorage.setItem(storageItemName, JSON.stringify(selectedLanguage));
      })
  );

  const defaultLanguage =
    JSON.parse(localStorage.getItem(storageItemName)) || languages[0];

  fillUIContentBy(defaultLanguage);
  startFirstGame();
})();
