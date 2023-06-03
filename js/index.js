import { Timer, Level, User } from "../api/main.mjs"

const timer = new Timer(10)

timer.addEventListener("pause", () => { console.log("started") })
timer.addBreakingPoint(2, (eventData) => {
  console.log(`Event trigged at ${eventData.time} seconds.`)
})

//timer.start();

/** @type {PuzzleSelect} */ 
const puzzleTest = document.querySelector("puzzle-select");

const form = document.querySelector("form");

const level = new Level();

const user = new User("filintodelgado@gmail.com", "1234", "Filinto Delgado", "2003-08-04", "Vila do Conde", "male");
console.log(`The name of the user is ${user.name.nick}.`);

user.name = "something"