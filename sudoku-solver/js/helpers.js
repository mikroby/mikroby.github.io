"use strict";

export const deepCopy = (object) => JSON.parse(JSON.stringify(object));

const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const prepare = (input) => {
  const output = [];

  for (let row = 0; row < 9; row++) {
    const part = Math.floor(row / 3) * 3;
    const rowArray = [];

    for (let col = 0; col < 9; col++) {
      const house = part + Math.floor(col / 3);

      rowArray.push({
        value: input[row][col] || allNumbers,
        house,
      });
    }

    output.push(rowArray);
  }

  return output;
};

export const purge = (input) =>
  input.map((row) =>
    row.map(({ value }) => (typeof value === "number" ? value : null))
  );

// could be improved?
export const displayInTerminal = (input) => {
  input.forEach((row, index) => {
    const rowMixedArray = row.map((value) => (value ? value : "·"));

    if (index % 3 === 0 && index !== 0) {
      console.log("─────┼─────┼─────");
    }

    const rowString = rowMixedArray.join(" ");
    const finalRow = `${rowString.slice(0, 5)}│${rowString.slice(
      6,
      11
    )}│${rowString.slice(12)}`;

    console.log(finalRow);
  });
};

const getElementsNotIncludedIn = (array, elements) =>
  elements.filter((element) => !array.includes(element));

export const reduceByHouse = (values, board, house) => {
  const allFixedValuesInHouse = board
    .flat()
    .filter((item) => item.house === house && typeof item.value === "number")
    .map((item) => item.value);

  return getElementsNotIncludedIn(allFixedValuesInHouse, values);
};

export const reduceByRow = (values, board, row) => {
  const allFixedValuesInRow = board[row]
    .filter((item) => typeof item.value === "number")
    .map((item) => item.value);

  return getElementsNotIncludedIn(allFixedValuesInRow, values);
};

export const reduceByCol = (values, board, col) => {
  const allFixedValuesInCol = [];

  board.forEach((item) => {
    const curentValue = item[col].value;
    if (typeof curentValue === "number") {
      allFixedValuesInCol.push(curentValue);
    }
  });

  return getElementsNotIncludedIn(allFixedValuesInCol, values);
};

const getElementOfOneOccuranceIn = (array, elements) => {
  let result = elements;

  for (const element of elements) {
    const counter = array.reduce(
      (acc, curr) => (curr === element ? acc + 1 : acc),
      0
    );

    if (counter === 1) {
      result = [element];
      break;
    }
  }

  return result;
};

export const reduceByOnlyinHouse = (values, board, house) => {
  const allUnsolvedValuesInHouse = board
    .flat()
    .filter((item) => item.house === house && typeof item.value !== "number")
    .flatMap((item) => item.value);

  return getElementOfOneOccuranceIn(allUnsolvedValuesInHouse, values);
};

export const reduceByOnlyInRow = (values, board, row) => {
  const allUnsolvedValuesInRow = board[row]
    .filter((item) => typeof item.value !== "number")
    .flatMap((item) => item.value);

  return getElementOfOneOccuranceIn(allUnsolvedValuesInRow, values);
};

export const reduceByOnlyInCol = (values, board, col) => {
  const allUnsolvedValuesInCol = [];

  board.forEach((item) => {
    const curentValue = item[col].value;
    if (typeof curentValue !== "number") {
      allUnsolvedValuesInCol.push(...curentValue);
    }
  });

  return getElementOfOneOccuranceIn(allUnsolvedValuesInCol, values);
};

export const getIsSolved = (board) =>
  board.flat().every((item) => typeof item.value === "number");

//** returns a list of probable values in ascending order of probability */
export const getProbabilityList = (board) =>
  board
    .flatMap((row, y) => row.map((cell, x) => ({ ...cell, row: y, col: x })))
    .filter((cell) => typeof cell.value !== "number")
    .sort((a, b) =>
      b.value.length === a.value.length
        ? b.house - a.house
        : b.value.length - a.value.length
    )
    .flatMap((cell) => cell.value.map((value) => ({ ...cell, value })));
