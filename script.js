const numberOfRows = 10;
const numberOfColumns = 10;
const selectClass = (a) => document.querySelector(`.${a}`);
const selectAll = (a) => document.querySelectorAll(`.${a}`);
const selectId = (a) => document.getElementById(`${a}`);
const nearbyBombs = {};

for (let i = 1; i <= numberOfColumns; i++) {
  for (let y = 1; y <= numberOfRows; y++) {
    const mineSquare = document.createElement(`div`);
    mineSquare.classList.add(`minesquare`);
    mineSquare.setAttribute(`id`, `mine-${i}-${y}`);
    mineSquare.classList.add(`unclicked`);
    selectClass(`minefield`).appendChild(mineSquare);
  }
}

for (let i = 1; i <= 15; i++) {
  let columnNumber = Math.trunc(Math.random() * 10) + 1;
  let rowNumber = Math.trunc(Math.random() * 10) + 1;
  selectId(`mine-${columnNumber}-${rowNumber}`).classList.add(`bomb`);
  //   selectId(`mine-${columnNumber}-${rowNumber}`).textContent = `💣`;
}

for (let i = 1; i <= numberOfColumns; i++) {
  for (let y = 1; y <= numberOfRows; y++) {
    let counter = 0;
    if (selectId(`mine-${i}-${y}`).classList.contains(`bomb`)) continue;
    for (let a = i - 1; a <= i + 1; a++) {
      if (a === 0 || a > numberOfColumns) continue;
      for (let b = y - 1; b <= y + 1; b++) {
        if (b === 0 || b > numberOfRows) continue;
        if (selectId(`mine-${a}-${b}`).classList.contains(`bomb`)) ++counter;
      }
    }
    nearbyBombs[`mine-${i}-${y}`] = counter;
    // selectId(`mine-${i}-${y}`).textContent = `${counter}`;
    counter = 0;
  }
}

const clearZeros = function (i, y) {
  for (let a = i - 1; a <= i + 1; a++) {
    if (a === 0 || a > numberOfColumns) continue;
    for (let b = y - 1; b <= y + 1; b++) {
      if (b === 0 || b > numberOfRows) continue;
      let adjunctSquare = document.getElementById(`mine-${a}-${b}`);
      adjunctSquare.classList.remove(`unclicked`);
      adjunctSquare.textContent = nearbyBombs[adjunctSquare.id];
      if (nearbyBombs[adjunctSquare.id] === 0) clearZeros(a, b);
    }
  }
};

for (let i = 1; i <= numberOfColumns; i++) {
  for (let y = 1; y <= numberOfRows; y++) {
    const clickedSquare = selectId(`mine-${i}-${y}`);
    clickedSquare.addEventListener(`click`, () => {
      clickedSquare.classList.remove(`unclicked`);
      if (clickedSquare.classList.contains("bomb")) {
        clickedSquare.textContent = `bomb`;
      } else if (nearbyBombs[clickedSquare.id] === 0) {
        clickedSquare.textContent = nearbyBombs[clickedSquare.id];
        clearZeros(i, y);
      } else {
        clickedSquare.textContent = nearbyBombs[clickedSquare.id];
      }
    });
  }
}
console.log(nearbyBombs);
