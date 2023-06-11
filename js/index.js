import cinescape, { Challenge } from "../api/main.mjs";

localStorage.clear();

const user = new cinescape.User("example@example.com", "1234", "Example Exemplar", "1999/9/9", "Exampleville", "male", false);
user.login();

//console.log(cinescape.loggedUser);

const challenge = new cinescape.createChallenge("solvePuzzleLevel", 12, "test");
challenge.addEventListener("progress", function() {
  console.log(`Progressed, the progress is now ${this.progress}.`);
});
