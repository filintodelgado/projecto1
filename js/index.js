import { Timer, PuzzleSelect, PuzzleForm } from "../api/main.mjs"

const timer = new Timer(10)

timer.addEventListener("pause", () => { console.log("started") })
timer.addBreakingPoint(2, (eventData) => {
  console.log(`Event trigged at ${eventData.time} seconds.`)
})

//timer.start();

/** @type {PuzzleSelect} */ 
const puzzleTest = document.querySelector("puzzle-select");

const form = document.querySelector("form");