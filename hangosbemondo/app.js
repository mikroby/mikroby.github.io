const synth = window.speechSynthesis;
const voices = synth.getVoices();
// check support for speechSynthesis
const info = document.querySelectorAll(".info");
info[0].textContent = `window.speechSynthesis: ${Boolean(synth)}`;
info[1].textContent = JSON.stringify(voices);

// import options from "./options.json" assert {type: 'json'};
let options;
let signal;

const message = new SpeechSynthesisUtterance();
message.rate = 0.6;
message.pitch = 0.5;
message.volume = 1;

const form = document.querySelector("form");
const image = document.querySelector("img");

const playSound = (event) => {
  event.preventDefault();

  try {
    if (Object.values(form).some(({ name }) => !form[name].value)) {
      alert("Hiányzó adatok a bemondáshoz. Válassz értéket minden mezőhöz!");
      return;
    }

    if (form.button.value === "start") {
      form.button.value = "stop";
      image.src = "stop.png";

      const [trainType, verb, time, track] = Object.values(form).map(
        ({ name }) => form[name].value
      );
      const hour = Number(time.slice(0, 2));
      const minute = Number(time.slice(3, 5));
      const trackAffix = options.affix[verb];
      const prep = options.track.find((item) => item.value === track).prep;

      message.text = `${trainType} ${verb} ${hour} óra ${minute} perckor ${prep} ${track} ${trackAffix}`;

      signal = new Audio("mav_szignal.mp3");
      signal.addEventListener("ended", () => {
        synth.speak(message);
      });
      signal.play();
    } else {
      form.button.value = "start";
      image.src = "start.png";
      signal.pause();
      synth.cancel();
    }
  } catch (error) {
    info[2].textContent = `${error.message}`;
  }
};

const welcomeSignal = new Audio("KISS_signal.wav");
welcomeSignal.autoplay = true;

const initializer = (id, array, elementType) => {
  const parent = form.querySelector(id);

  array.forEach((item) => {
    const newChild = document.createElement(elementType);
    newChild.value = item.value;
    newChild.textContent = item.text;
    parent.appendChild(newChild);
  });
};

fetch("./options.json")
  .then((data) => data.json())
  .then((parsed) => {
    options = parsed;

    initializer("#train-type", options.trainType, "option");
    initializer("#track", options.track, "option");

    form.addEventListener("submit", playSound);

    message.addEventListener("end", () => {
      form.button.value = "start";
      image.src = "start.png";
    });
  });
// TODO:
// modal az alert helyett.
// modal a bemondás szövegével
// modal animációja
