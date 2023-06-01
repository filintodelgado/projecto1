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
  inputs = [];
  labels = [];
  answers = [];
  correctIndex;
  correctInput;
  checkedContainer;
  checkedInput;

  _checkInput(input) {
    const container = input.parentElement;
    container.classList.add("checked");
  }

  _uncheckInput(input) {
    const container = input.parentElement;
    container.classList.remove("checked");
  }

  _inputCheckHandler = (function(event) {
    event.stopPropagation();
      
    if(this.checkedInput)
      this._uncheckInput(this.checkedInput);
    
    this._checkInput(event.target);
    
    this.checkedContainer = container;
    this.checkedInput = event.target;
  }).bind(this);

  _createAnswers() {
    for(let i = 0; i < 4; i++) {
      const container = this.answersContainer;
      const answer = document.createElement("puzzle-answer");
      const input = document.createElement("input");
      const label = document.createElement("label");
      
      answer.appendChild(label);
      answer.appendChild(input);
      container.appendChild(answer);

      input.type = "radio";
      input.addEventListener("change", this._inputCheckHandler);

      input.id = `${this.constructor.name.toLowerCase()}:input:${i}`;
      label.setAttribute("for", input.id)

      input.name = `${this.constructor.name.toLocaleLowerCase()}-option`;
      label.name = input.name;

      this.answersElements.push(input);

      this.inputs.push(input);
      this.labels.push(label);
    }
  }

  _fillLabels() {
    for(let i = 0; i < 4; i++)
      this.labels[i].textContent = this.answers[i];
  }

  get correct() {
    return this.inputs[this.correctIndex].checked ? true : false;
  }

  ask(puzzle) {
    super.ask(puzzle);

    this.answers = cloneArray(puzzle.answers);

    if(puzzle.shuffle)
      this.correctIndex = shuffleArrayIndex(this.answers, puzzle.correctAnswer)
    else
      this.correctIndex = 0;

    this.correctInput = this.inputs[this.correctIndex];
    this._fillLabels();
    if(this.checkedInput) 
      this._uncheckInput(this.checkedInput)
  }

  constructor() {
    super();

    this._createAnswers();
  }
}

customElements.define("puzzle-form-choose", PuzzleFormChoose, {extends: "form"});