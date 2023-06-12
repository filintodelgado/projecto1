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
import { Puzzle, PuzzleSelect, createPuzzle } from "./puzzle.mjs";
export { Puzzle, PuzzleSelect, createPuzzle }

/* Form */
import { PuzzleFormSelect } from "./form.mjs";
export { PuzzleFormSelect };

/* Timer */
import { Timer, timer } from "./timer.mjs";
export { Timer, timer };

/* Event Model */
import { EventModel } from "./event.mjs";
export { EventModel };

/* Level */
import { Level, currentLevel } from "./level.mjs"
export { Level, currentLevel };

/* User */
import { User, getLoggedUser, loggedUser } from "./user.mjs";
export { User, getLoggedUser, loggedUser };

/* Challenge */
import { Challenge, SolvePuzzleChallenge, CompleteLevelChallenge, SolvePuzzleInLevelChanllenge, CompleteUnderSecondsChallenge, createChallenge, restoreChallenge } from "./challenge.mjs";
export { Challenge, SolvePuzzleChallenge, CompleteLevelChallenge, SolvePuzzleInLevelChanllenge, CompleteUnderSecondsChallenge, createChallenge, restoreChallenge };

/* Popup */
import { Popup, popup } from "./popup.mjs";
export { Popup, popup }

/* Defautl */
/* import cinescape from "main.js" */
export default 
{ 
  // to make the puzzle
  createPuzzle,
  // form used by the puzzle
  PuzzleFormSelect,

  // will count in the level
  timer,
  // manually create the timer
  Timer,

  // the level the user is currently playing
  currentLevel,
  // used to create new users
  User,
  // the user that is logged currently
  loggedUser,

  // create and restore challenges
  createChallenge,
  restoreChallenge,

  // popup
  popup
}
