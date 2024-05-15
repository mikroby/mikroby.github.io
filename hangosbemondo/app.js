const assetsURL = "./assets/";
const stationSignalURL = assetsURL + "mav_szignal.mp3"
const welcomeSignalURL = assetsURL + "KISS_signal.wav"
const startImageURL = assetsURL + "start.png"
const stopImageURL = assetsURL + "stop.png"

const stationSignal = new Audio(stationSignalURL);
const synth = window.speechSynthesis;
const message = new SpeechSynthesisUtterance();

let affixes, controller, voicesHUN;

// it does not work on mobile:
// import parsedData from "./options.json" assert {type: 'json'};

const form = document.querySelector("form");
const button = document.querySelector("button");
const buttonImage = button.querySelector("img");
const pitchSlider = document.querySelector("#pitch");
const rateSlider = document.querySelector("#rate");
const info = document.querySelector('#info');

const toggleButton = () => {
  if (buttonImage.src.includes("start")) {
    buttonImage.src = stopImageURL;
    button.onclick = stopSound;
    // button.removeEventListener("click", playSound);
    // button.addEventListener("click", stopSound);
  } else {
    buttonImage.src = startImageURL;
    button.onclick = playSound;
    // button.removeEventListener("click", stopSound);
    // button.addEventListener("click", playSound);
  }
};

const sayIt = (sentence) => {
  try {
    message.text = sentence;
    message.lang = 'hu-HU';
    message.voice = voicesHUN.length > 0 ? voicesHUN[0] : message.voice;
    message.rate = rateSlider.value / 100;
    message.pitch = pitchSlider.value / 100;
    message.volume = 1;

    synth.cancel();
    synth.speak(message);
  } catch (error) {
    info.textContent = error
  }

  message.addEventListener("end", toggleButton, { once: true });
}

const stopSound = () => {
  toggleButton();
  controller.abort()
  stationSignal.pause();
  synth.cancel();
}

const playSound = () => {
  const formValues = Object.values(form).map(({ name }) => form[name].value)

  if (formValues.some(value => !value)) {
    alert("Hiányzó adatok a bemondáshoz. Válassz értéket minden mezőhöz!");
    return;
  }

  toggleButton();

  const [trainType, verb, time, track] = formValues;
  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(3, 5));
  const trackAffix = affixes[verb];

  const sentence = `${trainType} ${verb} ${hour} óra ${minute} perckor ${track} ${trackAffix}`;

  controller = new AbortController();

  stationSignal.addEventListener("ended", () => {
    sayIt(sentence)
  }, { once: true, signal: controller.signal });

  stationSignal.load();
  stationSignal.play();
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
(async () => {
  synth.addEventListener('voiceschanged', () => {
    const voicesAll = synth.getVoices();
    voicesHUN = voicesAll.filter(item => item.lang.toLowerCase().includes("hu"));

    info.textContent = `${voicesHUN.length}:${voicesHUN[0].name}`
  })

  const welcomeSignal = new Audio(welcomeSignalURL);
  welcomeSignal.autoplay = true;

  const data = await fetch("./options.json");
  const { options, config } = await data.json();
  const { pitch, rate } = config;
  affixes = options.affix;

  [
    { id: "#train-type", value: options.trainType, },
    { id: "#verb", value: options.verb, },
    { id: "#track", value: options.track, }
  ].forEach(({ id, value }) => fillElement(form, id, value, "option"));

  [
    { slider: pitchSlider, value: pitch },
    { slider: rateSlider, value: rate }
  ].forEach(item => initializeSlider(item));

  toggleButton();

})();
// TODO:
// modal instead of alert
// modal with animation
