"use strict";

const getRandomIntegerLessThan = (value) => Math.trunc(Math.random() * value);

export const getRandomElementFrom = (list) =>
  list[getRandomIntegerLessThan(list.length)];

export const swapValue = (direction) => (direction === "row" ? "col" : "row");

export const getMaxFitRectSizes = (direction, size, maxSize) => ({
  maxY: direction === "row" ? maxSize : maxSize - size,
  maxX: direction === "col" ? maxSize : maxSize - size,
});

export const fillMatrixWith = ({ rows, cols, value }) =>
  Array(rows)
    .fill()
    .map(() => Array(cols).fill(value));

export const playSound = ({ url, volume }) => {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play();
};
