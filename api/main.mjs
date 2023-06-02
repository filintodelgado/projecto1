/**
 * The CineScape is a School project to make a educational ScapeRoom.
 * We made this Framework/API to make the whole process a lot easier.
 * 
 * This model includes things like:
 * 1. Puzzle Components;
 * 1. Timer;
 * 1. Event Model.
 * 
 * @module cinescape
 */

/* Puzzle */
// import and exports as bundle
import * as puzzle from "./puzzle.mjs";
// contains every import
export { puzzle };

// import and exports individually
import { Puzzle, PuzzleSelect } from "./puzzle.mjs";
export { Puzzle, PuzzleSelect }

/* Form */
import * as form from "./form.mjs";
export { form };

import { PuzzleFormSelect } from "./form.mjs";
export { PuzzleFormSelect };

/* Timer */
import { Timer } from "./timer.mjs";
export { Timer };

/* Event Model */
import { EventModel } from "./event.mjs";
export { EventModel };

/* Level */
import { Level } from "./level.mjs"
export { Level };

/* Defautl */
export default 
{ 
  PuzzleSelect,
  Timer,
  PuzzleFormSelect,
  Level
}
