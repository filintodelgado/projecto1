/**
 * Main cinescape module
 * @module cinescape
 */

/* Puzzle */
// import and exports as bundle
import * as puzzle from "./puzzle.mjs";
// contains every import
export { puzzle };

// import and exports individually
import { Puzzle, PuzzleSelect, PuzzleChoose } from "./puzzle.mjs";
export { Puzzle, PuzzleSelect, PuzzleChoose }

/* Defautl */
export default { PuzzleSelect }
