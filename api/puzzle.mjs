/** Represents any Puzzle component 
 * @extends HTMLElement
*/
class Puzzle 
extends HTMLElement {
  /**
   * Creates a new custom event
   * 
   * @param {String} eventName 
   * @returns {CustomEvent}
   */
  static _createEvent(eventName) {
    return new CustomEvent(eventName);
  }

  /**
   * @typedef {"solve" | "unsolve" | "miss"} PuzzleEventKeyMap
   * 
   * All Puzzle Events available to use:
   * 
   * * *solve* is trigged when the .solved property is set to false
   * and the .solve() method is called, normally when the user
   * responds correctly the form;
   * 
   * * *unsolve* is trigged when the .solved property is set to true
   * and the .unsolve() method is called;
   * 
   * * *miss* is trigged when the .solved property is set to false
   * and the .miss() method is called, normally when the user
   * responds incorrectly the form;
   * 
   */

  /** 
   * Event trigged when the puzzle is solved 
   * 
   * @type {CustomEvent<"solve">}
   * @event SolveEvent
   */
  static #SolveEvent = this._createEvent("solve");
  /** 
   * The CustomEvent that is trigged when the puzzle is solved 
   * 
   * @event SolveEvent
   * @readonly
   */
	static get SolveEvent() { return this.#SolveEvent; };

  /** Says if the puzzle is solved. Default false. */
  #solved = false;
  /** Says if the puzzle is solved */
  get solved() { return this.#solved };
  /** 
   * * Switching the value to true solves the puzzle calling .solve() method
   * * Switching the value to false unsolves the puzzle calling .unsolve() method
   * 
   * @fires SolveEvent when set to true
   * @fires UnsolveEvent when set to false
   */
  set solved(value) {
    // value as to be a boolean and diferent otherwise ignore
    if(typeof(value) != "boolean"
      || value == this.#solved) return;

    // if the value is true solve the puzzle
		if(value) this.solve();
    // else unsolve it
		else this.unsolve();
  }

  /**
   * Replaces a Callback from .addEventListener() stack with a new Callback
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} name 
   * @param {Function} newCallback 
   * @param {Function | null} oldCallback
   * @returns {boolean}
   */
  _replaceCallbackFunction(name, newCallback, oldCallback=null) {
    if(!name || typeof(newCallback) != "function") return false;

    // if there was a callback defined remove it
		if(oldCallback) this.removeEventListener(name, oldCallback);

		// add the new event listener callback
		this.addEventListener(name, newCallback);

    return true;
  }

  /** 
   * The callback to call when the event solve is trigged
   * @type {Function | null}
   * @listens SolveEvent
   */
  #onsolve = null;
  /** 
   * The callback that is called when the event solve is trigged 
   * @listens SolveEvent
   */
	get onsolve() { return this.#onsolve };
  /** 
   * Replaces the callback to the solve event with a new callback
   * if the callback is not valid the it will be replaced with null
   * @listens SolveEvent
   */
	set onsolve(value) {
		if(typeof(value) != "function") {
			this.#onsolve = null; 
			return;
		};

		this._replaceCallbackFunction("solve", value, this.#onsolve);
		this.#onsolve = value;
	}

  /**
   * Solves the puzzle if the it is already not based on the property .solved
   * @returns {Boolean}
   * 
   * @fires SolveEvent
   */
	solve() {
		// puzzle already solved, ignore
		if(this.solved == true) return false;

    // change directly the value of #solved so that the setter
    // is not trigged
		this.#solved = true;
    
    // sets some classes and attributes to the element to help with styles
    // and search
		this.setAttribute("solved", "true");
		this.classList.remove("unsolved");
		this.classList.add("solved");

    // trigger the event
		this.dispatchEvent(Puzzle.SolveEvent);

		return true;
	}

  /** 
   * Event trigged when the puzzle is solved 
   * 
   * @type {CustomEvent<"miss">}
   * @event MissEvent
   */
  static #MissEvent = this._createEvent("miss");
  /** 
   * The CustomEvent that is trigged when the puzzle is solved 
   * 
   * @event MissEvent
   * @readonly
   */
	static get MissEvent() { return this.#MissEvent; };

  /** 
   * The callback to call when the event miss is trigged
   * @type {Function | null}
   * @listens MissEvent
   */
  #onmiss = null;
  /** 
   * The callback that is called when the event miss is trigged 
   * @listens SolveEvent
   */
	get onmiss() { return this.#onsolve };
  /** 
   * Replaces the callback to the miss event with a new callback
   * if the callback is not valid the it will be replaced with null
   * @listens SolveEvent
   */
	set onmiss(value) {
		if(typeof(value) != "function") {
			this.#onmiss = null; 
			return;
		};

		this._replaceCallbackFunction("miss", value, this.#onsolve);
		this.#onmiss = value;
	}

  /**
   * Miss the puzzle if the it is not already solved not 
   * based on the property {@link solved}
   * @returns {Boolean}
   * 
   * @fires MissEvent
   */
	miss() {
		// puzzle already solved, ignore
		if(this.solved == true) return false;

    // trigger the event
		this.dispatchEvent(Puzzle.MissEvent);

		return true;
	}

  /**
   * @inheritdoc
   * 
   * Adds Puzzle events to the 
   * {@link HTMLElement.addEventListener HTMLElement addEventListener method}
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} type The type of the Event
   * which can be any {@link HTMLElementEventMap HTMLElement Event} 
   * or a {@link PuzzleEventKeyMap Puzzle Event};
   * 
   * @param {(this: Puzzle)} listener 
   * 
   * @param {boolean | AddEventListenerOptions | undefined} options
   * 
   * @listens SolveEvent 
   * @listens UnsolveEvent 
   * @listens MissEvent
   */
  addEventListener(type, listener, options=undefined) {
    super.addEventListener(type, listener, options);
  }

  /**
   * @inheritdoc
   * 
   * Adds Puzzle events to the 
   * {@link HTMLElement.removeEventListener HTMLElement removeEventListener method}
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} type The type of the Event
   * which can be any {@link HTMLElementEventMap HTMLElement Event} 
   * or a {@link PuzzleEventKeyMap Puzzle Event};
   * 
   * @param {(this: Puzzle)} listener 
   * 
   * @param {boolean | AddEventListenerOptions | undefined} options
   * 
   * @listens SolveEvent 
   * @listens UnsolveEvent 
   * @listens MissEvent
   */
  removeEventListener(type, listener, options=undefined) {
    super.removeEventListener(type, listener, options);
  }
}

/** 
 * Represents the types of puzzles that 
 * aks the user to select from multiple options
 */

class PuzzleChoose
extends Puzzle {
  

}

/**
 * The Puzzle Select component is a type of Puzzle that
 * provides the user with 4 options to choose from
 */
export
class PuzzleSelect
extends PuzzleChoose {

}

customElements.define("puzzle-select", PuzzleSelect);

/**
 * Adds an event listener to the element.
 * 
 * @name addEventListener
 * @method
 * @memberof Puzzle
 * 
 * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} type
 */

/** @type {PuzzleSelect} */ 
const puzzleTest = document.createElement("puzzle-select");
const element = document.createElement("div"); 

puzzleTest.onsolve = () => {console.log("solved")}
puzzleTest.solve()