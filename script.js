//variables
let numberOfRows = 0,
  numberOfColumns = 0,
  numberOfMines = 0,
  gameStatus = ``,
  clickedCounter = 0;

const selectClass = (a) => document.querySelector(`.${a}`),
  selectAll = (a) => document.querySelectorAll(`.${a}`),
  selectId = (a) => document.getElementById(`${a}`),
  nearbyBombs = {};

//functions
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

const placeMines = function () {
  for (let i = 1; i <= numberOfMines; i++) {
    let columnNumber = Math.trunc(Math.random() * numberOfColumns) + 1;
    let rowNumber = Math.trunc(Math.random() * numberOfRows) + 1;
    selectId(`square-${rowNumber}-${columnNumber}`).classList.add(`bomb`);
  }
};

const calculateAdjBombs = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      let counter = 0;
      if (selectId(`square-${i}-${y}`).classList.contains(`bomb`)) continue;
      for (let a = i - 1; a <= i + 1; a++) {
        if (a === 0 || a > numberOfRows) continue;
        for (let b = y - 1; b <= y + 1; b++) {
          if (b === 0 || b > numberOfColumns) continue;
          if (selectId(`square-${a}-${b}`).classList.contains(`bomb`))
            ++counter;
        }
      }
      nearbyBombs[`square-${i}-${y}`] = counter;
      counter = 0;
    }
  }
};

const countForWin = function () {
  clickedCounter--;
  if (clickedCounter === 0) {
    gameStatus = `won`;
    endingGame();
  }
};

const finalDisplay = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      let theSquare = selectId(`square-${i}-${y}`);
      theSquare.classList.remove(`flagged`);
      theSquare.classList.remove(`unclicked`);
      if (
        theSquare.classList.contains(`bomb`) &&
        !theSquare.classList.contains(`exploded`)
      ) {
        theSquare.textContent = `💣`;
      } else if (theSquare.classList.contains(`exploded`)) {
        theSquare.textContent = `💥`;
      } else {
        if (!(nearbyBombs[theSquare.id] === 0)) {
          theSquare.textContent = `${nearbyBombs[theSquare.id]}`;
        } else {
          theSquare.textContent = ``;
        }
      }
    }
  }
};

const endingGame = function () {
  // remove flags and show mines
  finalDisplay();

  selectClass(`ending-title`).textContent =
    gameStatus === `won` ? `You won the game!` : `You lost the game!`;
  selectClass(`ending-title`).classList.remove(`not-shown`);
  selectClass(`play-again`).classList.remove(`not-shown`);
  selectClass(`difficulty-options-end`).classList.remove(`not-shown`);
};

const clearZeros = function (i, y) {
  selectId(`square-${i}-${y}`).classList.add(`visited`);
  for (let a = i - 1; a <= i + 1; a++) {
    if (a === 0 || a > numberOfRows) continue;
    for (let b = y - 1; b <= y + 1; b++) {
      if (b === 0 || b > numberOfColumns) continue;
      let adjunctSquare = document.getElementById(`square-${a}-${b}`);
      if (adjunctSquare.classList.contains(`unclicked`)) {
        countForWin();
      }
      adjunctSquare.classList.remove(`unclicked`);
      nearbyBombs[adjunctSquare.id] === 0
        ? (adjunctSquare.textContent = ``)
        : (adjunctSquare.textContent = nearbyBombs[adjunctSquare.id]);
      if (
        nearbyBombs[adjunctSquare.id] === 0 &&
        !adjunctSquare.classList.contains(`visited`)
      ) {
        if (adjunctSquare.classList.contains(`unclicked`)) {
          countForWin();
        }
        clearZeros(a, b);
      }
    }
  }
};

const clickingSquares = function () {
  for (let i = 1; i <= numberOfRows; i++) {
    for (let y = 1; y <= numberOfColumns; y++) {
      const clickedSquare = selectId(`square-${i}-${y}`);
      clickedSquare.addEventListener(`auxclick`, () => {
        if (gameStatus === `inProgress`) {
          if (clickedSquare.classList.contains(`flagged`)) {
            clickedSquare.classList.remove(`flagged`);
            clickedSquare.textContent = ``;
          } else {
            clickedSquare.textContent = `🚩`;
            clickedSquare.classList.add(`flagged`);
          }
        }
      });
      clickedSquare.addEventListener(`click`, () => {
        if (gameStatus === `inProgress`) {
          if (!clickedSquare.classList.contains(`flagged`)) {
            clickedSquare.classList.remove(`unclicked`);
            if (clickedSquare.classList.contains("bomb")) {
              clickedSquare.classList.add(`exploded`);
              gameStatus = `lost`;
              endingGame();
            } else if (nearbyBombs[clickedSquare.id] === 0) {
              countForWin();
              clickedSquare.textContent = ``;
              clickedSquare.classList.add(`visited`);
              clearZeros(i, y);
            } else {
              countForWin();
              clickedSquare.textContent = nearbyBombs[clickedSquare.id];
            }
          }
        }
      });
    }
  }
};
const startTheGame = function (nor, noc, nom) {
  gameStatus = `inProgress`;
  selectClass(`minefield`).innerHTML = ` `;
  numberOfRows = nor;
  numberOfColumns = noc;
  numberOfMines = nom;
  clickedCounter = nor * noc - nom;
  selectClass(`ending-title`).classList.add(`not-shown`);
  selectClass(`play-again`).classList.add(`not-shown`);
  selectClass(`difficulty-options-end`).classList.add(`not-shown`);
  selectClass(`minefield`).classList.remove(`hidden`);
  selectClass(`ending-title`).classList.remove(`hidden`);
  selectClass(`play-again`).classList.remove(`hidden`);
  selectClass(`difficulty-options-end`).classList.remove(`hidden`);
  selectClass(`minefield`).style.gridTemplateColumns = `repeat(${noc}, 1fr)`;
  selectClass(`minefield`).style.gridTemplateRows = `repeat(${nor}, 1fr)`;
  selectClass(`introscreen`).classList.add(`hidden`);
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
    calculateAdjBombs();
    clickingSquares();
  })
);
