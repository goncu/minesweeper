let numberOfRows = 0,
  numberOfColumns = 0,
  numberOfMines = 0,
  flagCounter = 0,
  gameStatus = ``;
const selectClass = (a) => document.querySelector(`.${a}`),
  selectAll = (a) => document.querySelectorAll(`.${a}`),
  selectId = (a) => document.getElementById(`${a}`),
  nearbyMines = {};
//setting starting conditions
const startTheGame = function (nor, noc, nom) {
  gameStatus = `inProgress`;
  numberOfRows = nor;
  numberOfColumns = noc;
  numberOfMines = nom;
  flagCounter = 0;
  selectClass(`introscreen`).classList.add(`hidden`);
  selectClass(`minefield`).innerHTML = ` `;
  selectClass(`minefield`).style.gridTemplateColumns = `repeat(${noc}, 1fr)`;
  selectClass(`minefield`).style.gridTemplateRows = `repeat(${nor}, 1fr)`;
  selectClass(`minefield`).classList.remove(`hidden`);
  selectClass(`game-info`).classList.remove(`hidden`);
  selectClass(`game-info`).textContent = `Remaining mines: ${
    numberOfMines - flagCounter
  }.`;
  selectClass(`play-again`).classList.add(`not-shown`);
  selectClass(`play-again`).classList.remove(`hidden`);
  selectClass(`difficulty-options-end`).classList.add(`not-shown`);
  selectClass(`difficulty-options-end`).classList.remove(`hidden`);
};
//creating playing field based on difficulty
const createMinefield = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      const mineSquare = document.createElement(`div`);
      mineSquare.classList.add(`minesquare`);
      mineSquare.setAttribute(`id`, `square-${i}-${y}`);
      mineSquare.classList.add(`unclicked`);
      selectClass(`minefield`).appendChild(mineSquare);
    }
  }
};
// placing mines based on difficulty
const placeMines = function () {
  for (let i = 1; i <= numberOfMines; i++) {
    let columnNumber = Math.trunc(Math.random() * numberOfColumns + 1);
    let rowNumber = Math.trunc(Math.random() * numberOfRows + 1);
    if (
      selectId(`square-${rowNumber}-${columnNumber}`).classList.contains(`mine`)
    ) {
      i--;
      continue;
    }
    selectId(`square-${rowNumber}-${columnNumber}`).classList.add(`mine`);
  }
};
// calculating the number of adjacent mines for each square without a mine
const calculateAdjMines = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      let counter = 0;
      if (selectId(`square-${i}-${y}`).classList.contains(`mine`)) continue;
      for (let a = i - 1; a <= i + 1; a++) {
        if (a === 0 || a > numberOfRows) continue;
        for (let b = y - 1; b <= y + 1; b++) {
          if (b === 0 || b > numberOfColumns) continue;
          if (selectId(`square-${a}-${b}`).classList.contains(`mine`))
            ++counter;
        }
      }
      nearbyMines[`square-${i}-${y}`] = counter;
      counter = 0;
    }
  }
};
// chain clearing the adjacent squares of squares with no adjacent mines
const clearAroundZeros = function (i, y) {
  selectId(`square-${i}-${y}`).classList.add(`visited`);
  for (let a = i - 1; a <= i + 1; a++) {
    if (a === 0 || a > numberOfRows) continue;
    for (let b = y - 1; b <= y + 1; b++) {
      if (b === 0 || b > numberOfColumns) continue;
      let adjacentSquare = document.getElementById(`square-${a}-${b}`);
      adjacentSquare.classList.remove(`unclicked`);
      if (adjacentSquare.classList.contains(`flagged`)) {
        adjacentSquare.classList.remove(`flagged`);
        flagCounter--;
        selectClass(`game-info`).textContent = `Remaining mines: ${
          numberOfMines - flagCounter
        }.`;
      }
      nearbyMines[adjacentSquare.id] === 0
        ? (adjacentSquare.textContent = ``)
        : (adjacentSquare.textContent = nearbyMines[adjacentSquare.id]);
      if (
        nearbyMines[adjacentSquare.id] === 0 &&
        !adjacentSquare.classList.contains(`visited`)
      ) {
        clearAroundZeros(a, b);
      }
    }
  }
};
// function for flagging
const flagTheSquare = function (square) {
  if (gameStatus === `inProgress`) {
    if (square.classList.contains(`question-mark`)) {
      square.classList.remove(`question-mark`);
      square.textContent = ``;
    } else if (square.classList.contains(`flagged`)) {
      square.classList.remove(`flagged`);
      square.classList.add(`question-mark`);
      flagCounter--;
      square.textContent = `?`;
      selectClass(`game-info`).textContent = `Remaining mines: ${
        numberOfMines - flagCounter
      }.`;
    } else if (square.classList.contains(`unclicked`)) {
      square.textContent = `🚩`;
      square.classList.add(`flagged`);
      flagCounter++;
      selectClass(`game-info`).textContent = `Remaining mines: ${
        numberOfMines - flagCounter
      }.`;
      if (flagCounter === numberOfMines) {
        selectClass(`btn-end`).classList.remove(`hidden`);
      }
    }
  }
};
//function for flagging with key press
const flagWithPress = function () {
  let hovered = ``;
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      const hoveredSquare = selectId(`square-${i}-${y}`);
      hoveredSquare.addEventListener(`mouseover`, function () {
        hovered = hoveredSquare;
      });
      document.addEventListener(`keydown`, function (el) {
        if (el.key === `f`) {
          flagTheSquare(hovered);
        }
      });
    }
  }
};
// function for click behaviour of squares
const clickingSquares = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      const clickedSquare = selectId(`square-${i}-${y}`);
      clickedSquare.addEventListener(`auxclick`, () => {
        flagTheSquare(clickedSquare);
      });
      // for left clicking
      clickedSquare.addEventListener(`click`, () => {
        if (gameStatus === `inProgress`) {
          if (!clickedSquare.classList.contains(`flagged`)) {
            clickedSquare.classList.remove(`unclicked`);
            if (clickedSquare.classList.contains(`mine`)) {
              clickedSquare.classList.add(`exploded`);
              gameStatus = `lost`;
              endingGame();
            } else if (nearbyMines[clickedSquare.id] === 0) {
              clickedSquare.textContent = ``;
              clickedSquare.classList.add(`visited`);
              clearAroundZeros(i, y);
            } else {
              clickedSquare.textContent = nearbyMines[clickedSquare.id];
            }
          }
        }
      });
    }
  }
};
// for checking if flags are correctly placed
const checkFlags = function () {
  gameStatus = `won`;
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      let squareToCheck = selectId(`square-${i}-${y}`);
      if (
        squareToCheck.classList.contains(`mine`) &&
        !squareToCheck.classList.contains(`flagged`)
      ) {
        gameStatus = `lost`;
        squareToCheck.classList.add(`miss`);
      }
    }
  }
};
// for opening up the minefield when the game ends
const finalDisplay = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      let theSquare = selectId(`square-${i}-${y}`);
      theSquare.classList.remove(`flagged`);
      theSquare.classList.remove(`unclicked`);
      if (
        theSquare.classList.contains(`mine`) &&
        !theSquare.classList.contains(`exploded`) &&
        !theSquare.classList.contains(`miss`)
      ) {
        theSquare.textContent = `💣`;
      } else if (
        theSquare.classList.contains(`exploded`) ||
        theSquare.classList.contains(`miss`)
      ) {
        theSquare.textContent = `💥`;
      } else {
        if (!(nearbyMines[theSquare.id] === 0)) {
          theSquare.textContent = `${nearbyMines[theSquare.id]}`;
        } else {
          theSquare.textContent = ``;
        }
      }
    }
  }
};
// for ending the game
const endingGame = function () {
  finalDisplay();
  selectClass(`btn-end`).classList.add(`hidden`);
  selectClass(`game-info`).textContent =
    gameStatus === `won` ? `You won the game!` : `You lost the game!`;
  selectClass(`play-again`).classList.remove(`not-shown`);
  selectClass(`difficulty-options-end`).classList.remove(`not-shown`);
};
//initializing the game
selectAll(`btn-dif`).forEach((btn) =>
  btn.addEventListener(`click`, () => {
    btn.classList.contains(`btn-easy`)
      ? startTheGame(10, 10, 10)
      : btn.classList.contains(`btn-medium`)
      ? startTheGame(16, 16, 40)
      : startTheGame(16, 30, 99);
    createMinefield();
    placeMines();
    calculateAdjMines();
    clickingSquares();
    flagWithPress();
  })
);
// functionality of Complete button
selectClass(`btn-end`).addEventListener(`click`, () => {
  checkFlags();
  endingGame();
});
