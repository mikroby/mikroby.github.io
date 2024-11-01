/** texts that appear during the game play */
export const texts = {
  geeseTurn: "Jelölj ki egy libát!",
  geeseWon: "A libák nyertek!",
  foxWon: "A róka nyerte a játszmát!",
  gameInfo: "A játék leírása",
  newGame: "Új játék",
  captureGoose: "A róka elkapott egyet!",
};

const DOMelements = {
  title: document.querySelector("title"),
  header: document.querySelector("header"),
  version: document.querySelector("#version"),
  geeseText: document.querySelector("#geeseText"),
  playRules: document.querySelector("#playRules"),
  backToTop: document.querySelector("#backToTop"),
};

const UItexts = {
  title: "Róka és Libák",
  header: "Róka és Libák",
  version: "v0.1.3",
  geeseText: "Libák száma:",
  playRules: [
    "<h1>",
    "Róka és Libák játék",
    "</h1>",
    "<p>",
    "A játék során a libáknak be kell szorítaniuk a rókát. Míg a róka célja, a libák elfogása, ill. szabadságának megőrzése.",
    "</p>",
    "<p>",
    "Mindegyik figura csak a vonalakkal jelzett irányok mentén mozoghat: A libák csak szomszédos üres mezőre léphetnek. A róka átugorhatja a libát, ha ott üres mező található. Az átlépett - azaz elfogott - liba eltűnik a tábláról.",
    "</p>",
    "<p>",
    "A játékos egy lépésben csak egy libát mozdíthat el. A gép jelzi mely libák mozoghatnak szabályosan és mutatja a kiválasztott elem lehetséges lépéseit is.",
    "</p>",
  ],
  backToTop: "vissza a táblához",
};

/** set textContent for DOMelements */
export const setUItexts = () => {
  Object.entries(DOMelements).forEach((entry) => {
    const text = UItexts[entry[0]];

    if (typeof text === "string") {
      entry[1].textContent = text;
    } else {
      entry[1].insertAdjacentHTML("afterbegin", text.join(""));
    }
  });
};
