// check support for speechSynthesis
const info1 = document.querySelector("#info1");
const info2 = document.querySelector("#info2");
info1.textContent = `speechSynthesis: ${Boolean(speechSynthesis)}`;
info2.textContent = `window.speechSynthesis: ${Boolean(
  window.speechSynthesis
)}`;

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

  if (Object.values(form).some(({ name }) => !form[name].value)) {
    alert("Hiányzó adatok a bemondáshoz. Válassz értéket minden mezőhöz!");
    return;
  }

  if (form.button.value === "start") {
    form.button.value = "stop";
    image.src = "stop.png";
    signal = new Audio("mav_szignal.mp3");
    signal.addEventListener("ended", () => {
      window.speechSynthesis.speak(message);
    });
    signal.play();
    const [trainType, verb, time, track] = Object.values(form).map(
      ({ name }) => form[name].value
    );
    const hour = Number(time.slice(0, 2));
    const minute = Number(time.slice(3, 5));

    message.text = `${trainType} ${verb} ${hour} óra ${minute} perckor ${
      track === "2." || track === "Bé" ? "a" : "az"
    } ${track} ${verb === "indul" ? "vágányról" : "vágányra"}`;
  } else {
    form.button.value = "start";
    image.src = "start.png";
    signal.pause();
  }
};

const welcomeSignal = new Audio("KISS_signal.wav");
welcomeSignal.autoplay = true;

const initializer = (id, propName, elementType) => {
  const parent = form.querySelector(id);

  options[propName].forEach((item) => {
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

    initializer("#train-type", "trainType", "option");
    initializer("#track", "track", "option");

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
