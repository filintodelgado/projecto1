/**
 * @module cinescape/level
 */

import { EventModel } from "./event.mjs";
import { Puzzle } from "./puzzle.mjs";
import { Timer } from "./timer.mjs";

/**
 * An object that represents the level.
 * 
 * @typedef {{
 * "name": String,
 * "puzzles": import("./puzzle.mjs").PuzzleObject[],
 * "numberOfPuzzles": Number,
 * "puzzlesSolved": String,
 * "puzzlesUnsolved": String
 * }} LevelObject
 */

/**
 * All the events for {@link Level}.
 * 
 * @typedef {"change" | "complete"} LevelEventKeyMap
 */

/**
 * The callback defined for the events.
 * 
 * @typedef {(event: LevelObject) => void} LevelEventCallback
 */

/**
 * Defines the Level.
 * 
 * The Level ends when all the {@link Puzzle | Puzzles} have been solved.
 */
export
class Level
extends EventModel {
  name = "";

  changeCallback = (function() {
    this.dispatchEvent("change");
  }).bind(this);

  /** Event trigged everytime a change happens in the Level. */
  applyChangeEvent() {
    Puzzle.addEventListener("solve", this.changeCallback);
    Puzzle.addEventListener("unsolve", this.changeCallback);
    Puzzle.addEventListener("miss", this.changeCallback);
    Timer.addEventListener("stop", this.changeCallback);
    Timer.addEventListener("pause", this.changeCallback);
    Timer.addEventListener("start", this.changeCallback);
  }

  /** True if all the Puzzle in the level have been completed */
  get complete() { return this.numberOfPuzzlesUnsolved === 0 ? true : false }
  verifyComplete = (function() {
    // if all puzzles have been completed
    if(this.complete)
      this.dispatchEvent("complete");
  }).bind(this)

  constructor(name=null) {
    super();

    // if the name is not provided we will retrive the name from the body attribute
    // `level`
    if(!name)
      name = document.body.getAttribute("level").trim();

    // if there is no name in the body we consider that this is not a level
    if(!name)
      return null;

    Puzzle.addEventListener("solve", this.verifyComplete);
    
    this.name = name;
  }

  /**
   * Returns all the puzzles in the page.
   * 
   * @returns {import("./puzzle.mjs").PuzzleObject[]}
   */
  get puzzles() {
    // all puzzle elements will have the puzzle class
    const puzzleElements = document.querySelectorAll(".puzzle");
    // we will store it in a array
    const puzzles = [];

    // store all the elements object ito the arrays
    for(const puzzle of puzzleElements)
      // the objectify does not return a reference to the element but if we need the element
      // we can search by the id
      puzzles.push(puzzle.objectify());

    return puzzles;
  }

  /**
   * Return all the puzzles that have been solved.
   */
  get puzzlesSolved() {
    const solved = [];
    const puzzles = this.puzzles;

    for(const puzzle of puzzles)
      if(puzzle.solved) solved.push(puzzle)
    
    return solved;
  }

  /**
   * Says how many puzzles have been solved.
   */
  get numberOfPuzzlesSolved() {
    return this.puzzlesSolved.length;
  }

  /**
   * Returns all the puzzles that have not been solved.
   * 
   * @returns {import("./puzzle.mjs").PuzzleObject[]}
   */
  get puzzlesUnsolved() {
    const unsolved = [];
    const puzzles = this.puzzles;

    for(const puzzle of puzzles)
      if(!puzzle.solved) unsolved.push(puzzle)
    
    return unsolved;
  }

  /**
   * Says how many puzzles have not been solved;
   */
  get numberOfPuzzlesUnsolved() {
    return this.puzzlesUnsolved.length;
  }

  objectify() {
    return {
      "name": this.name,
      "puzzles": this.puzzles,
      "numberOfPuzzles": this.puzzles.length,
      "puzzlesSolved": this.numberOfPuzzlesSolved,
      "puzzlesUnsolved": this.numberOfPuzzlesUnsolved
    }
  }

  toJSON() {
    return this.objectify();
  }

  /* Botterplate code */

  /**
   * Adds a Event Listener for the a expecific event.
   * 
   * @param {LevelEventKeyMap} type 
   * @param {LevelEventCallback} listener 
   */
  addEventListener(type, listener) {
    super.addEventListener(type, listener);
  }

  /**
   * Triggers/Dispatch a event.
   * 
   * @param {LevelEventKeyMap} type 
   * @param {LevelObject} data 
   */
  dispatchEvent(type, data=null) {
    super.dispatchEvent(type, data=null);
  }
}

/** 
 * The current level. `null` if there is no level.
 * 
 * @type {Level | null}
 */
export
const currentLevel = new Level;