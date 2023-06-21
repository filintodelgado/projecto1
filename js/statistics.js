import { loggedUser } from "../api/user.mjs";

const time = document.querySelector("#time");
const puzzles = document.querySelector("#puzzles");
const challenge = document.querySelector("#challenge");

puzzles.textContent = `${loggedUser.puzzlesSolved} puzzles`;
time.textContent = `${loggedUser.timePlayed} segundos`;
challenge.textContent = `${loggedUser.challengeCompleted} atividades`;