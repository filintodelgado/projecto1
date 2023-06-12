import cinescape, { Challenge, popup } from "../api/main.mjs";

localStorage.clear();

const user = new cinescape.User("example@example.com", "1234", "Example Exemplar", "1999/9/9", "Exampleville", "male", false);
user.login();

const challenge = cinescape.createChallenge("solvePuzzleLevel", 1, "test");
challenge.addEventListener("progress", function() {
  console.log(`Progressed, the progress is now ${this.progress}.`);
});

challenge.addEventListener("progress", () => {
  popup.display("Something");
})