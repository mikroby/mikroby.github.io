const NUM_COMPONENTS = 3;
const promises = new Array(NUM_COMPONENTS)
  .fill()
  .map(() => Promise.withResolvers());

let counter = 0;

const onLoaded = (component) => {
  const { resolve } = promises[counter];
  resolve(component);
  counter++;
};

const setStyleAfterRender = (element, CSSprop, value) => {
  const id = setTimeout(() => {
    clearTimeout(id);
    element.style[CSSprop] = value;
  }, 0);
};

const onClick = (event, bubble) => {
  const { top, bottom, right } = event.target.getBoundingClientRect();
  bubble.style.top = `${(top + bottom) / 2}px`;
  bubble.style.left = `${right}px`;
  bubble.textContent = event.target.dataset.txt;

  setStyleAfterRender(bubble, "transform", "translateY(-50%) scaleX(1)");
};

const onMouseLeave = (bubble) =>
  setStyleAfterRender(bubble, "transform", "translateY(-50%) scaleX(0)");

const startApp = (results) => {
  document.querySelector("#content").hidden = false;
  document.querySelector("#spinner").hidden = true;

  const badges = document.querySelectorAll(".badge");
  const bubble = document.querySelector(".bubble");

  badges.forEach((badge) => {
    badge.addEventListener("click", (event) => onClick(event, bubble));
    badge.addEventListener("mouseleave", () => onMouseLeave(bubble));
  });
  console.log(results);
};

Promise.all(promises.map((item) => item.promise))
  .then((results) => startApp(results))
  .catch((error) => console.error(error));
