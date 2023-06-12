import { PuzzleChoose } from "./puzzle.mjs";
import { cloneArray, shuffleArrayIndex } from "./utils.mjs";

const container = document.createElement("div");
container.classList.add("puzzle-form-container");

export
class PuzzleForm 
extends HTMLFormElement {
  lastPuzzle;
  questionElement = document.createElement("puzzle-question");
  answersContainer = document.createElement("puzzle-answers");
  answersElements = [];
  submitButton = document.createElement("button");

  hide() {
    this.classList.add("hide");
    this.classList.remove("show");
  }

  show() {
    this.classList.add("show");
    this.classList.remove("hide");
  }

  closeOnClickHandler = (function(event) {
    const target = event.target;

    if(!this.contains(target))
        this.hide();
  }).bind(this);

  get correct() {}

  submitHandler = (function(event) {
    event.preventDefault();
    event.stopPropagation();

    if(this.correct) {
      this.lastPuzzle.solve();
    } else {
      this.lastPuzzle.miss();
    }

    this.hide();
  }).bind(this);

  get closeOnClick() { return this.#closeOnClick };
  set closeOnClick(close) {
    if(close == true)
      document.addEventListener("click", this.closeOnClickHandler);
    else
      document.removeEventListener("click", this.closeOnClickHandler);

    this.#closeOnClick = close;
  }

  _createAnswers() {}

  #closeOnClick = true;

  constructor() {
    super();

    // add the default class
    this.classList.add("puzzle-form");

    // hide by default
    this.hide();

    this.appendChild(this.questionElement);
    this.appendChild(this.answersContainer);

    this.submitButton.type = "submit";
    this.appendChild(this.submitButton);

    this.closeOnClick = true;
    this.submitButton.textContent = "Aceitar";
    
    this.addEventListener("submit", this.submitHandler);
  }

  /**
   * Shows the form and waits for user input.
   * When send the form is validated and if it is right
   * {@link module:cinescape/puzzle.Puzzle}
   * 
   * @param {PuzzleChoose} puzzle 
   */
  ask(puzzle) {
    // the question is always the same so no need to change
    if(puzzle != this.lastPuzzle)
      this.questionElement.textContent = puzzle.question;
    this.show();

    this.lastPuzzle = puzzle;
  }
}

export
class PuzzleFormChoose
extends PuzzleForm {
  
}

export
class PuzzleFormSelect
extends PuzzleFormChoose {
  /** 
   * Contains all the inputs used contained in the form.
   * 
   * @type {HTMLInputElement[]}
   */
  inputs = [];
  /** 
   * Contains all the labels associated with the {@link input} 
   * used contained in the form.
   * 
   * @type {HTMLLabelElement[]}
   */
  labels = [];
  /**
   * The answers for the {@link PuzzleSelect} currently in use.
   * 
   * If the {@link PuzzleSelect.shuffle} is se to true it will be
   * ordered in a random way.
   * 
   * @type {String[]}
   */
  answers = [];
  /**
   * The index of the correct answer in the {@link answers} array.
   * 
   * Can also be used to find the correct input and label.
   * 
   * @type {Number}
   */
  correctIndex = 0;
  /**
   * Query the {@link inputs} list to find the correct inpput using
   * {@link correctIndex}.
   * 
   * @type {HTMLInputElement}
   */
  get correctInput() { return this.inputs[this.correctIndex] };
  /**
   * Holds reference to the input that is currently checked.
   * 
   * @type {HTMLInputElement}
   */
  checkedInput;
  /**
   * Returns reference to the parent of the {@link checkedInput}.
   */
  get checkedContainer() { return this.checkedInput.parentElement };

  /**
   * Adds the class _checked_ to the parent of the provided input
   * for styling porpose.
   * @param {HTMLInputElement} input 
   */
  _checkInput(input) {
    input.checked = true;
    const container = input.parentElement;
    container.classList.add("checked");
  }

  /**
   * Removes the class _checked_ to the parent of the provided input
   * for styling porpose.
   * @param {HTMLInputElement} input 
   */
  _uncheckInput(input) {
    input.checked = false;
    const container = input.parentElement;
    container.classList.remove("checked");
  }

  /**
   * Handler for when the input is checked. It adds the class to the checked
   * input parent and removes from the old checked input
   */
  _inputCheckHandler = (function(event) {
    // so that it won't trigger other events
    event.stopPropagation();
    
    // uncheck the old input
    if(this.checkedInput)
      this._uncheckInput(this.checkedInput);
    
    // check the new
    this._checkInput(event.target);
    
    // set the new checked input
    this.checkedInput = event.target;
  }).bind(this);

  _createAnswers() {
    // we will create 4 answers
    for(let i = 0; i < 4; i++) {
      // we made a container for all answers (puzzle-answers)
      const container = this.answersContainer;
      // make a container for the answer (puzzle-answer)
      const answer = document.createElement("puzzle-answer");
      // the input and label
      const input = document.createElement("input");
      const label = document.createElement("label");
      
      // append all together
      answer.appendChild(label);
      answer.appendChild(input);
      container.appendChild(answer);

      // the input in this case is radio
      input.type = "radio";
      input.addEventListener("change", this._inputCheckHandler);

      // create a new id for the input
      input.id = `${this.constructor.name.toLowerCase()}:input:${i}`;
      label.setAttribute("for", input.id)

      // not necessary but good to always have a name
      input.name = `${this.constructor.name.toLocaleLowerCase()}-option`;
      label.name = input.name;

      // store the answer in case we need it later
      this.answersElements.push(answer);

      // do the same with the input and label
      this.inputs.push(input); // !import
      this.labels.push(label);
    }
  }

  /**
   * Will use what ever is in {@link answers} to fill the {@link answers}.
   */
  _fillLabels() {
    for(let i = 0; i < 4; i++)
      this.labels[i].textContent = this.answers[i];
  }

  /**
   * Tells if the input who holds the correct answer is checked or not.
   */
  get correct() {
    return this.inputs[this.correctIndex].checked ? true : false;
  }

  /**
   * Opens the form and asks and waits for the user interation based on {@link puzzle}.
   * @param {PuzzleFormChoose} puzzle The puzzle instance to ask for. If use reponds it
   * wrong {@link Puzzle.miss} is trigged but if it responds right {@link Puzzle.solve}
   * is trigged.
   * 
   * @fires SolveEvent
   * @fires MissEvent
   */
  ask(puzzle) {
    // the super class defines some default interactions
    super.ask(puzzle);

    // make a new clone of the answers so we don't afect the original one
    this.answers = cloneArray(puzzle.answers);

    // shuffle is it says so
    if(puzzle.shuffle)
      this.correctIndex = shuffleArrayIndex(this.answers, puzzle.correctAnswer)
    else
      this.correctIndex = 0;

    //fill the labels now that the answers are in place
    this._fillLabels();
    // uncheck the input if there is any
    if(this.checkedInput) 
      this._uncheckInput(this.checkedInput)
  }

  constructor() {
    super();

    // the question is already created but he answers we create now
    this._createAnswers();
  }
}

customElements.define("puzzle-form-select", PuzzleFormSelect, {extends: "form"});