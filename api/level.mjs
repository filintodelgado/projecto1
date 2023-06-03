/**
 * @module cinescape/level
 */

export
class Level {
  name = "";

  constructor(name=null) {
    // if the name is not provided we will retrive the name from the body attribute
    // `level`
    if(!name)
      name = document.body.getAttribute("level").trim();

    // if there is no name in the body we consider that this is not a level
    if(!name)
      return null;
    
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

  objectify() {}
}

/** 
 * The current level. `null` if there is no level.
 * 
 * @type {Level | null}
 */
export
const currentLevel = new Level;