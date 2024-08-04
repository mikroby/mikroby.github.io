export const shipMark = '<i class="fas fa-square"></i>';
export const shootMark = '<i class="fas fa-times"></i>';

export const shipsToAccomodate = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
export const maxCell = 10;
export const maxShots = 45;

export const languages = ["hun", "eng"];
export const texts = {
  hun: {
    hit: "Talált!",
    sunk: "Talált, Süllyedt!",
    won: "Minden hajó elsüllyedt!",
    lost: "Elfogyott a lőszer...",
    newGame: "Új játék",
    rules: "A játék leírása",
    static: {
      title: "Torpedó",
      instructions: {
        headline: "Torpedó játék",
        paragraph_1: "",
        list: ["", "", "", "", "", ""],
        paragraph_2: "",
        paragraph_3: "",
        back: "Vissza a táblához"
      }
    }
  },
  eng: {
    hit: "Hit!",
    sunk: "Hit & Sunk!",
    won: "All ships have been sunk!",
    lost: "Run out of torpedoes...",
    newGame: "New Game",
    rules: "Instructions",
    static: {
      title: "Battleships",
      instructions: {
        headline: "Battleships game",
        paragraph_1: "",
        list: ["", "", "", "", "", ""],
        paragraph_2: "",
        paragraph_3: "",
        back: "Back to top",
      }
    }
  },
};

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
