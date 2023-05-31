import { Timer, PuzzleSelect } from "../api/main.mjs"
import puzzle from "../api/puzzle.mjs"

const timer = new Timer(10)

timer.addEventListener("start", () => { console.log("started") })
timer.addBreakingPoint(2, (eventData) => {
  console.log(`Event trigged at ${eventData.time} seconds.`)
})

//timer.start();

/** @type {PuzzleSelect} */ 
const puzzleTest = document.querySelector("puzzle-select");
console.log(puzzleTest.shuffle)