import cinescape, { Challenge, createPuzzle, popup } from "../api/main.mjs";

localStorage.clear();

const user = new cinescape.User("example@example.com", "1234", "Example Exemplar", "1999/9/9", "Exampleville", "male", false);
user.login();

challenge.addEventListener("progress", function() {
  console.log(`Progressed, the progress is now ${this.progress}.`);
});

createPuzzle("puzzleSelect", "something", [1, 2, 3, 4]);