/**
 * Define Puzzle components:
 * 
 * * **{@link PuzzleSelect}**: Multiple question puzzle
 * @module cinescape/puzzle
 */

import { PuzzleFormRange, PuzzleFormSelect, PuzzleFromDrag } from "./form.mjs";
import { popup } from "./popup.mjs";
import { cleanup, numberGenerator } from "./utils.mjs";

/**
 * Puzzle in a gerenic Object Form.
 * Use this instead of {@link JSON}.
 * 
 * @typedef {{
*  "id": String,
*  "solved": Boolean
* }} PuzzleObject
*/

/**
 * Error that is trow when the question element is invalid or not found..
 * 
 * @typedef {Error} QuestionElementError
 */

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
 * The type of puzzle that are available.
 * 
 * @typedef {"puzzleSelect" | "puzzleDrag" | "puzzleInput"} PuzzleType
 */

/**
 * Implements a event model for Puzzles including events:
 * * `solve`: when the puzzle is solve;
 * * `miss`: when the user responds incorrectly;
 * * `unsolve`: when the puzzle is unsolved;
 */
class PuzzleEventModel 
extends HTMLElement {
  /********** Solved state **********/
  #solved = false;
  /** 
   * Says if the puzzle is solved. Default is `false`. 
   * 
   * * Switching the value to true solves the puzzle calling .solve() method
   * * Switching the value to false unsolves the puzzle calling .unsolve() method
   * 
   * @fires SolveEvent when set to true.
   * @fires UnsolveEvent when set to false.
   */
  get solved() { return this.#solved };
  /** 
  
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

  /********** Solve Event **********/
  /** 
   * The CustomEvent that is trigged when the puzzle is solved
   * (the user responds correctly).
   * 
   * @type {CustomEvent<"solve">}
   * 
   * @event SolveEvent
   * @readonly
   */
	static SolveEvent = new CustomEvent("solve");;

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
		this._onEvent("solve", value);
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
		this.dispatchEvent(this.constructor.SolveEvent);

    this.removeEventListener("click", this.ask)

		return true;
	}
  
  /********** Miss Event **********/
  /** 
   * The CustomEvent that is trigged when the puzzle is miss
   * (the user responds incorretly).
   * 
   * @type {CustomEvent<"miss">}
   * 
   * @event MissEvent
   * @readonly
   */
	static MissEvent = new CustomEvent("miss");

  #onmiss = null;
  /** 
   * The callback that is called when the event miss is trigged 
   * @type {Function | null}
   * @listens SolveEvent
   */
	get onmiss() { return this.#onsolve };
	set onmiss(value) {
		this._onEvent("miss", value);
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
		this.dispatchEvent(this.constructor.MissEvent);

		return true;
	}

  
  /********** Unsolve Event **********/
  /** 
   * @type {CustomEvent<"unsolve">}
   */
  static #UnsolveEvent = new CustomEvent("unsolve");
  /** 
   * The CustomEvent that is trigged when the puzzle is unsolved
   * (normally called manually).
   * 
   * @event UnsolveEvent
   * @readonly
   */
	static get UnsolveEvent() { return this.#UnsolveEvent; };

  #onunsolve = null;
  /** 
   * The callback that is called when the event unsolve is trigged 
   * @type {Function | null}
   * @listens UnsolveEvent
   */
	get onunsolve() { return this.#onunsolve };
	set onunsolve(value) {
		this._onEvent("unsolve", value);
	}

  /**
   * unsolve the puzzle if the it is not already solved not 
   * based on the property {@link solved}
   * @returns {Boolean}
   * 
   * @fires unsolveEvent
   */
	unsolve() {
		// puzzle already solved, ignore
		if(this.solved == true) return false;

    // sets some classes and attributes to the element to help with styles
    // and search
		this.setAttribute("solved", "false");
		this.classList.remove("solved");
		this.classList.add("unsolved");

    // trigger the event
		this.dispatchEvent(Puzzle.UnsolveEvent);

		return true;
	}
  
  /********** Methods **********/
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

  /**
   * Replaces a Callback from .addEventListener() stack with a new Callback
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} name 
   * @param {Function | null} newCallback 
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
   * Runs when the listener is assined to any
   * on[event] property
   * 
   * @param {PuzzleEventKeyMap} type 
   * @param {Function | null} callback 
   * 
   * @listens SolveEvent
   * @listens MissEvent
   * @listens UnsolveEvent
   */
  _onEvent(type, callback) {
    // how the property is named in the instance
    const propertyName = `on${type}`;

    if(typeof(callback) != "function") {
      // remove the event listener before
      this.removeEventListener(type, this.#onsolve);
			this[propertyName] = null; 
			return;
		};

		this._replaceCallbackFunction(type, callback, this[propertyName]);
		this[propertyName] = callback;
  }

  
  /******************** Static Declarations ********************/
  /********** Solve Event **********/
  /** @type {Function | null} */
  static _static_onsolve = null;
  /** 
   * Apply a event when the Puzzle is {@link solve} to all the instances of the class.
   * 
   * Uses the {@link addEventListener} function.
   * 
   * @listens SolveEvent
   */
  static get onsolve() { return this._static_onsolve };
  static set onsolve(value) {
    return this._onEvent("solve", value);
  };

  /********** Miss Event **********/
  /** @type {Function | null} */
  static _static_onmiss = null;
  /** 
   * Apply a event when the Puzzle is {@link miss} to all the instances of the class.
   * 
   * Uses the {@link addEventListener} function.
   * 
   * @listens MissEvent
   */
  static get onmiss() { return this._static_onmiss };
  static set onmiss(value) {
    return this._onEvent("miss", value)
  }

  /********** Unsolve Event **********/
  /** @type {Function | null} */
  static _static_onunsolve = null;
  /** 
   * Apply a event when the Puzzle is {@link unsolve} to all the instances of the class.
   * 
   * Uses the {@link addEventListener} function.
   * 
   * @listens UnsolveEvent
   */
  static get onunsolve() { return this._static_onunsolve };
  static set onunsolve(value) {
    return this._onEvent("unsolve", value)
  }

  /********** Methods **********/
  /**
   * All the listeners.
   * 
   * @type {{[key: String]: [Function]}}
   */
  static _listeners = {}

  /**
   * {@link addEventListener} to all the {@link instances} of the class.
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} type 
   * @param {Function} listener 
   * @param {boolean | AddEventListenerOptions | undefined} options 
   */
  static addEventListener(type, listener, options=null) {
    // create the stack
    if(!PuzzleEventModel._listeners[type])
      PuzzleEventModel._listeners[type] = []

    // add to the stack
    PuzzleEventModel._listeners[type].push(listener);

    // apply to all instance
    for(const puzzle of Puzzle.instances)
      puzzle.addEventListener(type, listener, options);
  }
  
  /**
   * {@link removeEventListener} to all the {@link instances} of the class.
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} type 
   * @param {Function} listener 
   * @param {boolean | AddEventListenerOptions | undefined} options 
   */
  static removeEventListener(type, listener, options=null) {
    // remove from the stack
    if(PuzzleEventModel._listeners[type])
      PuzzleEventModel._listeners[type]
        .filter((value) => value != listener);
    for(const puzzle of this.instances)
      puzzle.removeEventListener(type, listener, options);
  }

  /**
   * Replaces a callback in all {@link Puzzle.appendedIntances | instances}
   * using {@link _replaceCallbackFunction} method.
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} name
   * @param {Function | null} newCallback 
   * @param {Function | null} oldCallback 
   */
  static replaceEventListener(name, newCallback, oldCallback=null) {
    for(const puzzle of this.instances)
      puzzle._replaceCallbackFunction(name, newCallback, oldCallback);
  }
  
  /**
   * Adds the {@link callback} to 
   * {@link instances} when the event is set
   * and also removes when the event is unset to the
   * **on[event]** properties.
   * 
   * @param {PuzzleEventKeyMap} type The type of event 
   * @param {Function} callback The callback
   * @returns 
   * 
   * @listens SolveEvent
   * @listens MissEvent
   * @listens UnsolveEvent
   */
  static _onEvent(type, callback) {
    // construct the name of the property
    // always start with static_on[type]
    const propertyName = `static_on${type}`;

    // remove the event if the value is not a function
    if(typeof(callback) != "function") {
      this.removeEventListener("solve", this[propertyName]);
      this[propertyName] = null;
      return false;
    }

    this.replaceEventListener(type, callback, this[propertyName]);
    this[propertyName] = callback;
    return true;
  }

  constructor() {
    super();

    // apply all listeners
    for(const type in PuzzleEventModel._listeners) {
      for(const listerner of PuzzleEventModel._listeners[type])
        this.addEventListener(type, listerner)
    }

    Puzzle.instances.push(this);
  }
}

/** 
 * Represents any Puzzle component.
 * 
 * @extends HTMLElement
 */
export
class Puzzle 
extends PuzzleEventModel {
  /**
   * Returns the name of the class in a proper way to use as a identificator.
   * 
   * The name is _lowercased_.
   */
  static get formatedName() { return this.name.toLowerCase() };

  /** A number generator object. */
  static generator = numberGenerator();
  /** 
   * Will generate a number id that is unique to each instance. 
   * @type {Number}
   */
  static get id() { return this.generator.next().value };

  /** Sets a default ID for the Puzzle. */
  _setDefaultId() {
    this.id = `${this.constructor.name}:${this.constructor.id}`;
  }
  
  /** The list of all the default elements */
  static defaultElements = [
    "puzzle-question", 
    "puzzle-answers",
    "puzzle-answer"
  ];

  /** 
   * Removes the all the 
   * {@link defaultElements Default Elements} 
   * from the component.
   */
  _removeDefaultElements() {
    for(const defaultElement of Puzzle.defaultElements) {
      const elements = this.querySelectorAll(defaultElement);

      for(const element of elements) element.remove();
    }
  }

  /**
   * All the instances that were created.
   * 
   * @type {PuzzleEventModel[]}
   */
  static instances = []

  /**
   * How many puzzles have been solved.
   */
  static get numberOfSolvedPuzzle() {
    let number = 0;

    for(const puzzle of Puzzle.instances) {
      if(puzzle.solved) number++;
    }

    return number;
  }

  /**
   * How many puzzle have **not** been solved
   */
  static get numberOfUnsolvedPuzzle() {
    return Math.abs(Puzzle.instances.length - Puzzle.numberOfSolvedPuzzle);
  }

  /** 
   * List of all instances that can be quered in the DOM. 
   * Getted by querying the {@link document} for any element with
   * the class `.puzzle`.
   * 
   * @type {Puzzle[]}
   */
  static get appendedIntances() { 
    const puzzles = [];

    // we intend to return an array not a NodeList
    document.querySelectorAll(".puzzle").forEach((puzzle) => {
      puzzles.push(puzzle)
    })

    return puzzles;
  };

  /**
   * Turns the instance into a generic object.
   * 
   * @returns {PuzzleObject} An object containing the state of the puzzle:
   * * Current {@link id} of the object;
   * * If the puzzle is solved or not;
   */
  objectify() {
    return {
      "id": this.id,
      "solved": this.solved
    };
  }

  /**
   * Used by {@link JSON.stringify} method.
   * @returns 
   */
  toJSON() {
    return this.objectify();
  }

  /** 
   * Create Errors with the name of the class appended. 
   * 
   * @param {String} message The error message.
   * 
   * @returns {Error}
   */
  _createErrors(message) {
    return new Error(`${this.constructor.name}: ${message}`);
  }

  /** 
   * The Form that all the instances should use. 
   * 
   * @type {HTMLFormElement}
   */
  static form;
  // access the puzzle defined as static
  get form() { return this.constructor.form }

  /**
   * Opens a form to that ask the user to solve the puzzle.
   * @interface
   */
  ask = (function(event) {
    event.stopPropagation();

    this.form.ask(this);
  })
  // when the .addEventListener calls a callback the value of this
  // is lost and so set to undefined, using bind prevent this
  .bind(this)

  /**
   * Add the name of the class to the DOM element class. If the class is not
   * {@link Puzzle} it will also add the `.puzzle` class.
   */
  _addClassName() {
    // adds the puzzle class
    if(this.constructor != Puzzle)
      this.classList.add(Puzzle.formatedName)
    
    // and the class
    this.classList.add(this.constructor.formatedName)
  }

  /** 
   * The question of the puzzle found on the `puzzle-question` element.
   * 
   * @type {HTMLElement} 
   */
  question;
  /** 
   * The `puzzle-question` element itself.
   * 
   * @type {HTMLElement} 
   */
  questionElement;
  /** 
   * Error that is throw when there is no valid question element.
   */
  #QuestionElementError = this._createErrors("Question element invalid."); 
  /** The tagname of the question element */
  static questionTagName = "puzzle-question";

  /**
   * Stores the question element (`puzzle-question`) text content on 
   * {@link question} and the element {@link questionElement}.
   * 
   * @throws QuestionElementError
   */
  _getQuestion() {
    this.questionElement = this.querySelector(this.constructor.questionTagName);

    if(!this.questionElement)
      throw this.#QuestionElementError;

    this.question = this.questionElement.textContent;
  }

  /** 
   * Makes some cleanups and configurations when the element 
   * is added to the DOM
   * 
   * 1. Add the default ID if not already added
   * 1. Removes the default elements
   * 1. Add puzzle to the class so it is easier to identify
   * 1. Add the puzzle type to the class list
   */
  connectedCallback() {
    // define a standart id if is not defined
    if(!this.id) this._setDefaultId();

    // will get the question element
    this._getQuestion();
    
    // removes the default elements
    this._removeDefaultElements();

    // add puzzle to the class list to tell that it is a puzzle
    //  good for styling and search porpose
    this._addClassName();

    // form event listener when clicked
    this.addEventListener("click", this.ask);

    // append the form to the body if not already appended
    document.body.appendChild(this.form);
  }

  /********** Attributes Observer **********/
  // observe changes in the solved attribute to trigger the solved method
  static #observedAttributes = ["solved"];
  static get observedAttributes() { return Puzzle.#observedAttributes };

  /**
   * {@link HTMLElement} lifecycle callback that watchs for
   * changes in the attribute.
   * 
   * * *solved* when set to true triggers {@link solve} method
   * otherwise fires {@link unsolve}
   * 
   * @param {String} name 
   * @param {String} newValue 
   * @param {String} oldValue 
   * 
   * @fires SolveEvent
   * @fires UnsolveEvent
   */
  attributeChangedCallback(name, newValue, oldValue) {
    if(name == "solved") {
      if(newValue == "true") this.solve();
      else this.unsolve();
    }
  }
}

/** 
 * Represents the types of puzzles that 
 * aks the user to select from multiple options
 */
export
class PuzzleChoose
extends Puzzle {

  /** 
   * All the {@link PuzzleFormSelect} answers elements.
   * 
   * @type {HTMLElement[]} 
   */
  answersElements = [];
  /** 
   * The corrrect answer for the {@link Puzzle}
   * @type {String} 
   */
  correctAnswer;
  /** @type {HTMLElement} */
  correctAnswerElement;
  #AnswersElementsError = this._createErrors("There should at least 4 answer elements.");
  /** The tagname of the answers */
  static answerElementName = "puzzle-answer";

  /**
   * Parses the answers by: 
   * 1. Collecting the first 4 answer elements and storing it in {@link answersElements};
   * 1. Retrive their text content and storing it in {@link answers};
   * 
   * @throws AnswersElementError
   */
  _getAnswers() {
    const answersElements = this.querySelectorAll(this.constructor.answerElementName);

    if(answersElements.length < 4)
      throw this.#AnswersElementsError;
    
    for(let i = 0; i < 4; ++i)
      this.answersElements.push(answersElements[i])
  }

  connectedCallback() {
    // retrive the components
    this._getAnswers();

    // call it last so it does not delete the elements before we use it
    super.connectedCallback();
  }

  /** If the form should be shuffled by default */
  static defaultShuffle = true;

  /** Query the shuffle property to say if the form should be shuffled. */
  get shuffle() {
    const defaultBoolean = this.constructor.defaultShuffle;
    const defaultValue = String(defaultBoolean);
    const shuffle = this.getAttribute("shuffle")

    // if it is the default 
    return shuffle == defaultValue
      // or is not set
      || !shuffle
      // we will return the default value by default is true
      ? defaultBoolean
      // otherwise its inverse
      : !defaultBoolean;
  }
}

/**
 * The Puzzle Select component is a type of Puzzle that
 * provides the user with 4 options to choose from.
 */
export
class PuzzleSelect
extends PuzzleChoose {
  /** 
   * All the answers for the puzzle.
   * 
   * Having a it as {@link String | Strings} only makes sense in
   * here because {@link PuzzleDrag} don't use this.
   * 
   * @type {String[]} 
   */
  answers = [];
  _getAnswers() {
    super._getAnswers();

    // push the textContent to the arrat
    for(const answer of this.answersElements)
      this.answers.push(answer.textContent);

    // find an element with the 'correct' attribute
    this.correctAnswerElement = this.querySelector("[correct='']")
      // can be either empty attribute like <puzzle-answer correct/>
      ? this.querySelector("[correct='']")
      // or have it set to true
      : this.querySelector("[correct='true']");

    // if there is no element with the correct attribute we default it to the first
    // element
    if(!this.correctAnswerElement) 
      this.correctAnswerElement = this.answersElements[0];

    // retrive the text content
    this.correctAnswer = this.correctAnswerElement.textContent;
  }

  static form = document.createElement("form", {is: "puzzle-form-select"})
}


export
class PuzzleDrag
extends PuzzleChoose {
  static form = document.createElement("form", {is: "puzzle-form-drag"})
}

export
class PuzzleRange
extends Puzzle {
  /**
   * The minimun value acceptable.
   * 
   * Needs to bre less than {@link max}.
   */
  min = 0;
  /**
   * The maximun value.
   * 
   * Needs to be greater than {@link min}.
   */
  max = 0;
  /**
   * The correct answer.
   * 
   * Needs to be a value between {@link min} and {@link max}.
   */
  correct = 0;

  /**
   * Gets the value of {@link min}, {@link max} and {@link correct} from the
   * `HTML Attributes` and stores them.
   */
  _getValues() {
    const min = parseInt(this.getAttribute("min"));
    const max = parseInt(this.getAttribute("max"));
    const correct = parseInt(this.getAttribute("correct"));

    if(min == NaN || max == NaN || correct == NaN)
      throw TypeError("puzzle-range: Attributes invalids.");

    if(min > max) throw TypeError("puzzle-range: The 'min' can't greater than 'max'.")

    if(correct < min || correct > max)
      throw TypeError("puzzle-range: The correct value needs to be between the specified range.")

    this.min = min;
    this.max = max;
    this.correct = correct;
  }

  connectedCallback() {
    super.connectedCallback();

    // will get all the necessary values from the attributes
    this._getValues();
  }

  static form = document.createElement("form", {is: "puzzle-form-range"})
}

export
class PuzzleAsk
extends Puzzle {
  question;
  questionElement;

  static form = document.createElement("form", {is: "puzzle-form-ask"});
}

customElements.define("puzzle-select", PuzzleSelect);
customElements.define("puzzle-drag", PuzzleDrag);
customElements.define("puzzle-range", PuzzleRange);
customElements.define("puzzle-ask", PuzzleAsk);

// Default export
// import puzzle from "./puzzle.mjs"
export default { PuzzleSelect }

/**
 * Creates a new puzzle element.
 * @param {PuzzleType} type 
 * @param {...*} options
 * 
 * @overload
 * @param {"puzzleSelect"} type 
 * @param {String} question 
 * @param {String[]} answers
 * 
 * @overload
 * @param {"puzzleDrag"} type 
 * @param {String} question 
 * @param {HTMLElement[]} answers
 * 
 * @overload
 * @param {"puzzleInput"} type 
 * @param {String} question
 * @param {Number} min
 * @param {Number} max
 */
export
function createPuzzle(type, ...options) {
  type = cleanup(type);
  let puzzle;

  switch(type) {
    case "puzzleSelect":
      puzzle = createPuzzleSelect(...options);
      break;
    default:
      puzzle = false;
      break;
  }

  // append and remove to trigger connectedCallback
  document.body.appendChild(puzzle);
  puzzle.remove();

  return puzzle;
}

function createPuzzleSelect(question, answers) {
  if(!question || answers.length < 4) return;

  const puzzle = document.createElement("puzzle-select");
  const questionElement = document.createElement("puzzle-question");
  questionElement.textContent = question;
  puzzle.appendChild(questionElement)

  for(const answer of answers) {
    const element = document.createElement("puzzle-answer");
    element.textContent = answer;
    puzzle.appendChild(element);
  }

  return puzzle;
}

const puzzleSolvedCallback = () => {
  popup.display(`Quebra-cabeça ${Puzzle.numberOfSolvedPuzzle} de ${Puzzle.instances.length} resolvido.`)
}

function puzzleMissCallback() {
  popup.display(`Resposta errada. Restam ${Puzzle.numberOfUnsolvedPuzzle}.`)
}

Puzzle.addEventListener("solve", puzzleSolvedCallback);
Puzzle.addEventListener("miss", puzzleMissCallback);