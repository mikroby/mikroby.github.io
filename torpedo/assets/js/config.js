export const shipMark = '<i class="fas fa-square"></i>';
export const shootMark = '<i class="fas fa-times"></i>';

export const shipsToAccomodate = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
export const maxCell = 10;
export const maxShots = 45;

export const storageItemName = "Torpedoes";

export const sounds = {
  hit: {
    url: "assets/sound/hit.wav",
    volume: 0.5,
  },
  missed: {
    url: "assets/sound/missed.wav",
    volume: 1,
  },
  sunk: {
    url: "assets/sound/sunk.wav",
    volume: 1,
  },
};

export const languages = ["HUN", "ENG"];
// https://www.npmjs.com/package/country-flag-icons
export const bannerURL =
  "http://purecatamphetamine.github.io/country-flag-icons/3x2";
export const banners = {
  HUN: "HU",
  ENG: "GB",
};

export const texts = {
  HUN: {
    hit: "Talált!",
    sunk: "Talált, Süllyedt!",
    won: "Minden hajó elsüllyedt!",
    lost: "Elfogyott a lőszer...",
    newGame: "Új játék",
    instructions: "A játék leírása",
    static: {
      title: "Torpedó",
      infos: ["Lövések száma:", "Találatok száma:", "Elsüllyedt hajók:"],
      instructions: {
        headline: "Torpedó játék",
        description_1: "Süllyeszd el a táblán elrejtett hajókat!",
        description_2:
          "A számítógép véletlenszerűen elrejt 10 hajót a négyzethálós táblán:",
        shipElementlist: [
          "1db 4 elemből,",
          "2db 3 elemből,",
          "3db 2 elemből,",
          "4db 1 elemből",
          "álló egységet.",
        ],
        description_3:
          "A hajók egyenesvonalú függőleges vagy vízszintes alakzatok és sem oldalaik, sem csúcsaik mentén nem érintkeznek.",
        description_4:
          "Lövést leadni a tábla kívánt mezőjére kattintva lehet. Minden elsüllyesztett hajóért egy bónusz torpedó jár. A gép eltérő színű karakterekkel jelzi a találatot és az elvétett lövést. A játék végén a sértetlen hajóelemek is megjelennek.",
        backToTop: "Vissza a táblához",
      },
    },
  },
  ENG: {
    hit: "Hit!",
    sunk: "Hit & Sunk!",
    won: "All ships have been sunk!",
    lost: "Run out of torpedoes...",
    newGame: "New Game",
    instructions: "Instructions",
    static: {
      title: "Torpedoes",
      infos: ["Remaining Shots:", "Ship Elements Hit:", "Ships Sunk:"],
      instructions: {
        headline: "Torpedoes game",
        description_1: "Sink all the ships hidden on the board!",
        description_2: "The computer placed a fleet of 10 ships randomly:",
        shipElementlist: [
          "1 ship of 4 elements",
          "2 ships of 3 elements",
          "3 ships of 2 elements",
          "4 ships of 1 element",
        ],
        description_3:
          "Every ship forms a line horizontally or vertically and never touches one another by their sides or corners",
        description_4:
          "Click or tap on the choosen cell of the board to shoot. You get one extra torpedo on each sunken ship. The computer displays the missed shots and hits. At the end it reveals the intacted elements.",
        backToTop: "Back to top",
      },
    },
  },
};
