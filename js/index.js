import { Timer, Level } from "../api/main.mjs"

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

console.log(puzzleTest.objectify());
console.log(level.puzzles)