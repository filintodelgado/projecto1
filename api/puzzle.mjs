/** @module cinescape/puzzle */
/** @requires cinescape/utils */

import {bindUtils} from "./utils.mjs"

// Unlocks some utility functions on primitive types
bindUtils();

export class Puzzle extends HTMLElement {
  /** 
   * Holds reference to all the puzzles created 
   * 
   * @private
   */
  static #all = {};
  /**
   * Reference of all the puzzles added
   * 
   * The key is the puzzle id
   * @readonly @public
   */
  static get all() { return this.#all.clone() };

  static #ids = [];
  
  /**
   * Adds the puzzle to the all static property.
   * 
   * @param {Puzzle} puzzle
   * @returns {true | false} If the puzzle was added.
   * 
   * @throws {TypeError} When the Puzzle instance is invalid.
   */
  static add(puzzle) {
    if(!(puzzle instanceof this))
      throw TypeError("Puzzle.add(puzzle): puzzle needs to be a instance of Puzzle");
    
    if(this.#all[puzzle.id])
      return false;

    this.#all[String(puzzle.id)] = puzzle;
    return true
  };

  /** 
   * Adds the instance to the all static property.
   * @returns {true | false} If the puzzle was added.
   */
  add() {
    return this.constructor.add(this);
  }
  
  /**
   * Removes the puzzle from the all static property.
   * 
   * @param {Puzzle | String | Number} param Puzzle or the ID to remove.
   * @returns {true | false} If the puzzle was removed.
   * 
   * @throws {TypeError} if the param is invalid.
   */
  static remove(param) {
    if(typeof(param) == "string" || typeof(param) == "number") {
      param = String(param);

      if(!this.#all[param])
        return false;
      
      delete this.#all[param];
    } else if(param instanceof Puzzle) {
      if(!this.#all[param.id])
        return false;
      
      delete this.#all[param.id];
    } else {
      throw TypeError("Puzzle.remove: param needs to be a id or a puzzle instance.");
    }
  }

  /**
   * A callback that will listen to the event
   * 
   * @callback PuzzleEventCallback
   * @param {Event} event The event object
   * @returns {void}
   */

  /** @typedef {"solve" | "unsolve"} PuzzleEventMap */

  /** 
   * All the available types for listening 
   * @type {Array<PuzzleEventMap>}
   * @static @private
   */
  static #listenerType = ["solve", "unsolve"];

  /**
   * All the available types of listener
   * @type {Array<PuzzleEventMap>}
   * @static @public @readonly
   */
  static get listenerType() { return this.#listenerType.clone() }

  /** @typedef {object.<Array<PuzzleEventCallback>>} PuzzleCallbackList*/

  /** 
   * Creates an object with each listenerType define as object
   * 
   * @returns {PuzzleCallbackList}
   */
  static _defineListeners() {
    const listeners = {};

    for(const value in this.listenerType) {
      listeners[value] = [];
    }

    return listeners;
  }

  /**
   * Stores listeners for each specific Puzzle event
   * Each key in the object is a listener type
   * 
   * @type {PuzzleCallbackList}
   * 
   * @listens solve
   * @listens unsolve
   */
  #listeners = this.constructor._defineListeners();

  /**
   * Works similar to the HTMLElement.addEventListener but adds adcional
   * Puzzle specific listeners
   * 
   * @param { PuzzleEventMap | keyof HTMLElementEventMap } type Could be the HTMLElement
   * type or the Puzzle types:
   * 
   * @event solve trigged when the puzzle is solved.
   * @event unsolve trigged when the the puzzle is unsolved.
   * 
   * Could be trigged by changing .solved property or changing the element attribute
   * or using the instance routines .solve and .unsolved.
   * @param { PuzzleEventCallback } listener A callback that listen to the event.
   * @param { Boolean | AddEventListenerOptions | undefined } options
   * The HTMLElement default options, ignored when using a Puzzle event.
   * 
   * @throws {TypeError} When the type or listener are of invalid types
   * 
   * @public @override
   */
  addEventListener(type, listener, options=undefined) {
    if(typeof(listener) != "function")
      throw TypeError("Puzzle.addEventListener: The listener as to be a function.");

    if(typeof(type) != "string")
      throw TypeError("Puzzle.addEventListener: The type as to be a string.");
    
    if(this.#listeners[type])
      this.#listeners[type].push(listener);
    else
      super.addEventListener(type, listener, options);
  }

  /**
   * Removes the event listener in target's event listener list 
   * with the same type, callback, and options (ignored if it is a Puzzle Event).
   * 
   * @param { PuzzleEventCallback | keyof HTMLElementEventMap } type The type can be a HTMLElement type
   * or a Puzzle type
   * @param { PuzzleEventCallback } listener The callback assined previouslly
   * @param { Boolean | AddEventListenerOptions | undefined } options
   * 
   * @throws {TypeError} When the type or listener are of invalid types
   * 
   * @public @override
   */
  removeEventListener(type, listener, options=undefined) {
    if(typeof(listener) != "function")
      throw TypeError("Puzzle.removeEventListener: The listener as to be a function.");

    if(typeof(type) != "string")
      throw TypeError("Puzzle.removeEventListener: The type as to be a string.");
    
    if(this.#listeners[type])
      this.#listeners[type].removeAll(listener);
    else
      super.addEventListener(type, listener, options);
  }

  constructor() {
    super("my-puzzle");
  }
}

customElements.define("puzzle-puzzle", Puzzle);

const puzzle = document.createElement("puzzle-puzzle");
puzzle.innerText = "something";
document.body.appendChild(puzzle)

puzzle.addEventListener("solved", () => {
  console.log("clicked")
})