/**
 * Define Puzzle components:
 * 
 * * **{@link PuzzleSelect}**: Multiple question puzzle
 * @module cinescape/puzzle
 */

import { PuzzleFormChoose } from "./form.mjs";

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
 * Represents any Puzzle component 
 * 
 * @extends HTMLElement
 */
export
class Puzzle 
extends HTMLElement {
  /**
   * Creates a new custom event
   * 
   * @param {String} eventName 
   * @returns {CustomEvent}
   */
  static _createEvent(eventName) {
    return new CustomEvent(eventName,
      {bubbles: true});
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
   * @type {CustomEvent<"solve">}
   */
  static #SolveEvent = this._createEvent("solve");
  /** 
   * The CustomEvent that is trigged when the puzzle is solved
   * (the user responds correctly).
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
		this.dispatchEvent(Puzzle.SolveEvent);

    this.removeEventListener("click", this.ask)

		return true;
	}

  ask() {}

  /** 
   * @type {CustomEvent<"miss">}
   */
  static #MissEvent = this._createEvent("miss");
  /** 
   * The CustomEvent that is trigged when the puzzle is miss
   * (the user responds incorretly).
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
		this.dispatchEvent(Puzzle.MissEvent);

		return true;
	}

  /** 
   * @type {CustomEvent<"unsolve">}
   */
  static #UnsolveEvent = this._createEvent("unsolve");
  /** 
   * The CustomEvent that is trigged when the puzzle is unsolved
   * (normally called manually).
   * 
   * @event UnsolveEvent
   * @readonly
   */
	static get UnsolveEvent() { return this.#UnsolveEvent; };

  /** 
   * The callback to call when the event unsolve is trigged
   * @type {Function | null}
   * @listens UnsolveEvent
   */
  #onunsolve = null;
  /** 
   * The callback that is called when the event unsolve is trigged 
   * @listens 
   */
	get onunsolve() { return this.#onunsolve };
  /** 
   * Replaces the callback to the unsolve event with a new callback
   * if the callback is not valid the it will be replaced with null
   * @listens SolveEvent
   */
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

  /** The number to be formated for the default ID */
  static #nextId = 0;
  /** 
   * The next default ID that will be define uppon a instance 
   * 
   * **Format**: puzzle:1 _(classname:#nextId)_
   * 
   * @returns {String} a formated string garanted to be unique for
   * each instance that will be used if the instance does not have an
   * ID when it is appended to the DOM
   */
  static get nextId() { return `${this.name.toLowerCase()}:${Puzzle.#nextId}` };

  /** Increases ID */
  static _increaseNextId() {
    this.#nextId++;
  }
  
  /**
   * Gets the next id and increments the ID
   * 
   * @returns {String} the value of {@link nextId}
   * before been incremented
   */
  static getNextId() {
    // store the id
    const id = this.nextId;
    // increase the id;
    this._increaseNextId;

    return id;
  }

  /** Sets a default ID for the Puzzle */
  _setDefaultId() {
    this.id = this.constructor.getNextId();
  }
  
  /** The list of all the default elements */
  static #defaultElements = [
    "puzzle-question", 
    "puzzle-answers",
    "puzzle-answer"
  ]

  /** A copy of the list of all the default elements */
  static get defaultElements() { return this.#defaultElements }

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
    
    // removes the default elements
    this._removeDefaultElements();

    // add puzzle to the class list to tell that it is a puzzle
    this.classList.add("puzzle")

    // add the puzzle type name to the class
    this.classList.add(this.constructor.formatedName);
  }

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

  /** 
   * List of all instances
   * @type {Puzzle[]}
   */
  static instances = [];

  static _addInstance(instance) {
    this.instances.push(instance);
  }

  /**
   * Appends the instance to the {@link Puzzle.instances}
   * 
   * @returns 
   */
  _appendToPuzzle() {
    // already added
    if(Puzzle.instances.includes(this)) 
      return false;

    Puzzle._addInstance(this);

    return true;
  }

  /**
   * Appends the instance to the class 
   * {@link Puzzle.instances | .instance}.
   * 
   * @returns 
   */
  _appendToClass() {
    // already added
    if(this.constructor.instances.includes(this))
      return false;

    this.constructor._addInstance(this);

    return true;
  }

  /** 
   * Appends the instance to both the class
   * and Puzzle {@link Puzzle.instances | .instance}.
   */
  _appendInstance() {
    this._appendToPuzzle();
    this._appendToClass();
  }

  /**
   * Replaces a callback in all {@link Puzzle.instances | instances}
   * using {@link _replaceCallbackFunction} method.
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} name
   * @param {Function | null} newCallback 
   * @param {Function | null} oldCallback 
   */
  static _replaceInstancesCallbackFunction(name, newCallback, oldCallback=null) {
    for(const puzzle of this.instances)
      puzzle._replaceCallbackFunction(name, newCallback, oldCallback);
  }

  /**
   * Removes a {@link callback} from every instance.
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} name 
   * @param {Function} callback 
   */
  static _removeInstancesCallbackFunction(name, callback) {
    for(const puzzle of this.instances)
      puzzle.removeEventListener(name, callback);
  }

  /**
   * Adds the {@link value | callback} to 
   * {@link instances} when the event is set
   * and also removes when the event is unset to the
   * **on[event]** properties.
   * 
   * @param {PuzzleEventKeyMap} type The type of event 
   * @param {Function} value The callback
   * @returns 
   * 
   * @listens SolveEvent
   * @listens MissEvent
   * @listens UnsolveEvent
   */
  static _onEvent(type, value) {
    // construct the name of the property
    // always start with static_on[type]
    const propertyName = `static_on${type}`;

    // remove the event if the value is not a function
    if(typeof(value) != "function") {
      this._removeInstancesCallbackFunction("solve", this[propertyName]);
      this[propertyName] = null;
      return false;
    }

    this._replaceInstancesCallbackFunction(type, value, this[propertyName]);
    this[propertyName] = value;
    return true;
  }

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

  /**
   * {@link addEventListener} to all the {@link instances} of the class.
   * 
   * @param {keyof HTMLElementEventMap | PuzzleEventKeyMap} type 
   * @param {Function} listener 
   * @param {boolean | AddEventListenerOptions | undefined} options 
   */
  static addEventListener(type, listener, options=null) {
    for(const puzzle of this.instances) 
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
    for(const puzzle of this.instances)
      puzzle.removeEventListener(type, listener, options);
  }

  static get formatedName() { return this.name.toLowerCase() };

  constructor() {
    super();

    this._appendInstance();
  }

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
}

/** 
 * Represents the types of puzzles that 
 * aks the user to select from multiple options
 */
export
class PuzzleChoose
extends Puzzle {
  _createErrors(message) {
    return new Error(`${this.constructor.name}: ${message}`);
  }

  /** @type {HTMLElement} */
  question;
  /** @type {HTMLElement} */
  questionElement;
  /**
   * @typedef {Error} QuestionElementError
   */
  /** Error that is throw when there is no valid question element. */
  #QuestionElementError = this._createErrors("Question element invalid."); 
  static questionElementName = "puzzle-question";

  /**
   * Stores the question text content on {@link question} and the element
   * {@link questionElement}.
   * 
   * @throws QuestionElementError
   */
  _getQuestion() {
    this.questionElement = this.querySelector(this.constructor.questionElementName);

    if(!this.questionElement)
      throw new this.#QuestionElementError;
    
    this.question = this.questionElement.textContent;
  }

  /** @type {String[]} */
  answers = [];
  /** @type {HTMLElement[]} */
  answersElements = [];
  /** @type {String} */
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
    
    for(let i = 0; i < 4; ++i) {
      this.answersElements.push(answersElements[i])
      this.answers.push(answersElements[i].textContent);
    }

    for(const answer of answersElements)
      if(answer.getAttribute("correct") == ""
      || answer.getAttribute("correct") == "true")
        this.correctAnswerElement = answer;

    this.correctAnswerElement = this.correctAnswerElement ? this.correctAnswerElement : this.answersElements[0];
    this.correctAnswer = this.correctAnswerElement.textContent;
  }

  /**
   * Get the {@link answer} and the {@link question} and stores them.
   * 
   * @throws AnswersElementError
   * @throws QuestionElementError
   */
  _getComponents() {
    this._getQuestion();
    this._getAnswers();
  }

  connectedCallback() {

    // call it last so it does not delete the elements before we use it
    super.connectedCallback()
  }

  /** If the form should be shuffled by default */
  static defaultShuffle = true;

  /** Query the shuffle property to say if the form should be shuffled. */
  get shuffle() {
    const defaultBoolean = this.constructor.defaultShuffle;
    const defaultValue = String(defaultBoolean);
    const shuffle = this.getAttribute("shuffle")

    return shuffle == defaultValue
      || shuffle == "" 
      ? defaultBoolean : !defaultBoolean;
  }

  static form;
  get form() { return this.constructor.form }

  ask = (function(event) {
    event.stopPropagation();

    const form = this.form;

    form.ask(this);
  }).bind(this)

  constructor() {
    super();

    this._createErrors();
    this._getComponents();
    this.classList.add("puzzle-question");
    this.addEventListener("click", this.ask);
    document.body.appendChild(this.form);
  }
}

/**
 * The Puzzle Select component is a type of Puzzle that
 * provides the user with 4 options to choose from.
 */
export
class PuzzleSelect
extends PuzzleChoose {
  /** The Form that all the instances should use. */
  static form = document.createElement("form", {is: "puzzle-form-select"})
}

customElements.define("puzzle-select", PuzzleSelect);

// Default export
// import puzzle from "./puzzle.mjs"
export default { PuzzleSelect }