const synth = window.speechSynthesis;
const voices = synth.getVoices();

// import options from "./options.json" assert {type: 'json'};
let options;
let signal;

const form = document.querySelector("form");
const button = form.button;
const image = document.querySelector("img");
const pitchSlider = document.querySelector("#pitch");
const rateSlider = document.querySelector("#rate");

const playSound = (event) => {
  event.preventDefault();

  if (Object.values(form).some(({ name }) => !form[name].value)) {
    alert("Hiányzó adatok a bemondáshoz. Válassz értéket minden mezőhöz!");
    return;
  }

  if (button.value === "start") {
    toggleButton();

    const [trainType, verb, time, track] = Object.values(form).map(
      ({ name }) => form[name].value
    );
    const hour = Number(time.slice(0, 2));
    const minute = Number(time.slice(3, 5));
    const trackAffix = options.affix[verb];
    const prep = options.track.find((item) => item.value === track).prep;

    const text = `${trainType} ${verb} ${hour} óra ${minute} perckor ${prep} ${track} ${trackAffix}`;

    signal = new Audio("mav_szignal.mp3");
    signal.addEventListener("ended", () => {
      const message = new SpeechSynthesisUtterance(text);
      message.rate = rateSlider.value / 100;
      message.pitch = pitchSlider.value / 100;
      message.voice = voices.find((item) => item.lang.includes("hu"));
      message.volume = 1;
      synth.speak(message);
      message.addEventListener("end", () => {
        toggleButton();
      });
    });
    signal.play();
  } else {
    toggleButton();
    signal.pause();
    synth.cancel();
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

const toggleButton = () => {
  if (button.value === "start") {
    button.value = "stop";
    image.src = "stop.png";
  } else {
    button.value = "start";
    image.src = "start.png";
  }
};

fetch("./options.json")
  .then((data) => data.json())
  .then((parsed) => {
    options = parsed;

    initializer("#train-type", options.trainType, "option");
    initializer("#track", options.track, "option");

    const { rate, pitch } = options.config;
    pitchSlider.value = pitch;
    pitchSlider.after(pitch);
    rateSlider.value = rate;
    rateSlider.after(rate);

    pitchSlider.addEventListener("input", (event) => {
      pitchSlider.nextSibling.replaceWith(event.target.value);
    });

    rateSlider.addEventListener("input", (event) => {
      rateSlider.nextSibling.replaceWith(event.target.value);
    });

    form.addEventListener("submit", playSound);
  });
// TODO:
// modal az alert helyett.
// modal a bemondás szövegével
// modal animációja
