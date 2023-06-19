import { currentLevel } from "../api/level.mjs";
import { Puzzle } from "../api/puzzle.mjs";
import { timer } from "../api/timer.mjs";

const container = document.createElement("div");
container.classList.add("HUD");

// Level name
container.appendChild(createRow(`${currentLevel.name}`))

// Puzzles
const puzzles = createRow(`Puzzles: ${currentLevel.numberOfPuzzlesSolved} de ${currentLevel.puzzles.length}`)
puzzles.classList.add("puzzles");
Puzzle.addEventListener("solve", () => {
  console.log("solve")
  puzzles.textContent = `Puzzles: ${currentLevel.numberOfPuzzlesSolved} de ${currentLevel.puzzles.length}`
})
container.appendChild(puzzles);

// Tempo
const time = createRow(`Tempo: ${timer.remainingTime}`);
time.classList.add("time");
timer.addEventListener("step", () => {
  time.textContent = `Tempo: ${timer.remainingTime}`;
})
container.appendChild(time)

function createRow(text) {
  const row = document.createElement("p");
  row.innerHTML = text;

  return row;
}

export
function applyHUD() {
  document.body.appendChild(container);

  document.head.appendChild(style);

  puzzles.textContent = `Puzzles: ${currentLevel.numberOfPuzzlesSolved} de ${currentLevel.puzzles.length}`
}