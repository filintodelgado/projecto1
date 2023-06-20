import { currentLevel } from "../api/level.mjs";
import { Puzzle } from "../api/puzzle.mjs";
import { timer } from "../api/timer.mjs";
import { loggedUser } from "../api/user.mjs";

const container = document.createElement("div");
container.classList.add("HUD");

// Level name
container.appendChild(createRow(`${currentLevel.name}`))

// Puzzles
const puzzles = createRow(`Puzzles: ${currentLevel.numberOfPuzzlesSolved} de ${currentLevel.puzzles.length}`)
puzzles.classList.add("puzzles");
Puzzle.addEventListener("solve", () => {
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

const profileContainer = document.createElement("div");
profileContainer.classList.add("profile-container");

const goHome = document.createElement("a");
goHome.setAttribute("href", "./escapeRoom.html")
goHome.textContent = "Pagina Inicial";

const profileLink = document.createElement("a");
profileLink.setAttribute("href", "./profile.html");
profileLink.textContent = loggedUser.name.full;

profileContainer.appendChild(goHome);
profileContainer.appendChild(profileLink);

export
function applyHUD() {
  document.body.appendChild(container);
  document.body.appendChild(profileContainer)

  puzzles.textContent = `Puzzles: ${currentLevel.numberOfPuzzlesSolved} de ${currentLevel.puzzles.length}`
}