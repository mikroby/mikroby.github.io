'use strict';

// configurable constants
const delayTime = 3500;
const sliderHeight = 650;
const defaultSlideIndex = 1;

const maxSlides = datas.length;
const slider = document.querySelector('.slider');
const buttons = document.querySelector('.buttons');
const caption = document.querySelector('.caption');
const numbering = document.querySelector('.numbering');
const dotContainer = document.querySelector('.dot--container');
const slideContainer = document.querySelector('.slide--container');
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

const startDefault = (defaultValue = 0) => {
  const dot = document.querySelector(`.dot[data-index='${defaultValue}']`);
  dot.classList.add('dot-selected');
}

const createSlide = (index) => {
  const image = `<img src='${datas[index - 1].url}' class='slide'></img>`;
  slideContainer.insertAdjacentHTML('afterbegin', image);
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
  actualDot.classList.remove('dot-selected');
  this.classList.add('dot-selected');
  changeSlide(this.dataset.index);
}

const animate = (item, eventProperty, classNameTo) =>
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

const changeSlide = async (index) => {
  clearTimeout(timeoutId);
  const slide = document.querySelector('.slide');
  slide.classList.add('goLeft');
  await animate(slide, 'left');
  slide.src = datas[index - 1].url;
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
  createSlide(defaultSlideIndex);
  showInfo(defaultSlideIndex);
  trigger(delayTime);

})();
