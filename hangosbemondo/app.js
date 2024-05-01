const assetsURL = "./assets/";
const signalURL = assetsURL + "mav_szignal.mp3"
const welcomeSignalURL = assetsURL + "KISS_signal.wav"
const startImageURL = assetsURL + "start.png"
const stopImageURL = assetsURL + "stop.png"

const synth = window.speechSynthesis;
const voices = synth.getVoices();

// import options from "./options.json" assert {type: 'json'};
let options;
let signal;

const form = document.querySelector("form");
const button = document.querySelector("button");
const buttonImage = button.querySelector("img");
const pitchSlider = document.querySelector("#pitch");
const rateSlider = document.querySelector("#rate");

const toggleButton = () => {
  if (buttonImage.src.includes("start")) {
    buttonImage.src = stopImageURL;
    button.removeEventListener("click", playSound);
    button.addEventListener("click", stopSound);
  } else {
    buttonImage.src = startImageURL;
    button.removeEventListener("click", stopSound);
    button.addEventListener("click", playSound);
  }
};

const stopSound = () => {
  toggleButton();
  signal.pause();
  signal = null;
  synth.cancel();
}

const playSound = () => {
  const formValues = Object.values(form).map(({ name }) => name ? form[name].value : null)
  // omit the value of the button in the form.
  formValues.pop()

  if (formValues.some(value => !value)) {
    alert("Hiányzó adatok a bemondáshoz. Válassz értéket minden mezőhöz!");
    return;
  }

  toggleButton();

  const [trainType, verb, time, track] = formValues;
  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(3, 5));
  const trackAffix = options.affix[verb];

  const sentence = `${trainType} ${verb} ${hour} óra ${minute} perckor ${track} ${trackAffix}`;

  signal = new Audio(signalURL);
  signal.addEventListener("ended", () => {
    const message = new SpeechSynthesisUtterance(sentence);
    message.rate = rateSlider.value / 100;
    message.pitch = pitchSlider.value / 100;
    message.voice = voices.find((item) => item.lang.includes("hu"));
    message.volume = 1;
    synth.speak(message);
    message.addEventListener("end", stopSound);
  });

  signal.play();
};

const fillElement = (container, id, array, elementType) => {
  const parent = container.querySelector(id);

  array.forEach((item) => {
    const newChild = document.createElement(elementType);
    newChild.value = item.value;
    newChild.textContent = item.text;
    parent.appendChild(newChild);
  });
};

const initializeSlider = ({ slider, value }) => {
  slider.value = value;
  slider.after(value);
  slider.addEventListener("input", (event) => {
    slider.nextSibling.replaceWith(event.target.value);
  });
}

// START IIFE
(() => {
  const welcomeSignal = new Audio(welcomeSignalURL);
  welcomeSignal.autoplay = true;

  fetch("./options.json").then((data) => data.json()).then((parsedData) => {
    options = parsedData;

    [
      { id: "#train-type", value: options.trainType, },
      { id: "#verb", value: options.verb, },
      { id: "#track", value: options.track, }
    ].forEach(({ id, value }) => fillElement(form, id, value, "option"));

    [
      { slider: pitchSlider, value: options.config.pitch },
      { slider: rateSlider, value: options.config.rate }
    ].forEach(item => initializeSlider(item));

    toggleButton()
  });
})();
// TODO:
// modal az alert helyett.
// modal a bemondás szövegével
// modal animációja
