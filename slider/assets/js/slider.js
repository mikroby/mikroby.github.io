'use strict';

// configurable constants
const delayTime = 3500;
const sliderHeight = 650;
const defaultSlideIndex = 1;

const sound = new Audio('assets/sound/click.wav');
sound.volume = 0.5;

const maxSlides = datas.length;
const slider = document.querySelector('.slider');
const buttons = document.querySelector('.buttons');
const caption = document.querySelector('.caption');
const numbering = document.querySelector('.numbering');
const dotContainer = document.querySelector('.dot--container');
const slide = document.querySelector('.slide');
let timeoutId;
import datas from './datas.js';

const setSliderHeight = (heightValue) => {
  slider.style = `height: ${heightValue}px;`;
};

const makeDots = () => {
  const dots = datas.map((item, index) =>
    `<div class="dot" data-index='${index + 1}'></div>`);
  dotContainer.innerHTML = dots.join('');
}

const addEvents = () => {
  const dots = document.querySelectorAll('.dot');
  dots.forEach(item =>
    item.addEventListener('click', nextDot));
  buttons.firstElementChild.addEventListener('click', cyclePrevious);
  buttons.lastElementChild.addEventListener('click', cycleNext);
}

const startDefault = (index = 1) => {
  const dot = document.querySelector(`.dot[data-index='${index}']`);
  dot.classList.add('dot-selected');

  slide.src = `${datas[index - 1].url}`;
}

const showInfo = (index) => {
  caption.textContent = `${datas[index - 1].caption}`;
  numbering.textContent = `${index} / ${maxSlides}`;
  const style = `color: ${datas[index - 1].color};`;
  caption.style = style;
  numbering.style = style;
  buttons.style = style;
}

function nextDot() {
  const actualDot = document.querySelector('.dot-selected');
  if (this === actualDot) { return }
  actualDot.classList.remove('dot-selected');
  this.classList.add('dot-selected');
  changeSlide(this.dataset.index);
}

const animate = (item, eventProperty) =>
  new Promise(resolve => {
    const transitionEnded = event => {
      if (event.propertyName !== eventProperty) {
        return;
      }
      item.removeEventListener('transitionend', transitionEnded);
      resolve();
    }
    item.addEventListener('transitionend', transitionEnded);
  });

const imageLoaded = (index) =>
  new Promise(resolve => {
    slide.onload = resolve;
    slide.src = datas[index - 1].url;
  });

const changeSlide = async (index) => {
  clearTimeout(timeoutId);
  slide.classList.add('goLeft');
  await animate(slide, 'left');
  sound.play();
  await imageLoaded(index);
  slide.classList.remove('goLeft');
  await animate(slide, 'left');
  showInfo(index);
  trigger(delayTime);
}

const cyclePrevious = () => {
  const actualDot = document.querySelector('.dot-selected');
  const parameter = actualDot.dataset.index > 1 ?
    actualDot.previousElementSibling : actualDot.parentElement.lastElementChild;
  nextDot.call(parameter);
}

const cycleNext = () => {
  const actualDot = document.querySelector('.dot-selected');
  const parameter = actualDot.dataset.index < datas.length ?
    actualDot.nextElementSibling : actualDot.parentElement.firstElementChild;
  nextDot.call(parameter);
}

const trigger = (timing) => {
  timeoutId = setTimeout(() => cycleNext(), timing);
}


// IIFE starter.
(() => {
  setSliderHeight(sliderHeight);
  makeDots();
  addEvents();
  startDefault(defaultSlideIndex);
  showInfo(defaultSlideIndex);
  trigger(delayTime);
})();
