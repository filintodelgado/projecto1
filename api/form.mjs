import { Puzzle, PuzzleChoose, PuzzleDrag, PuzzleRange, PuzzleSelect } from "./puzzle.mjs";
import { cloneArray, shuffleArray, shuffleArrayIndex } from "./utils.mjs";

const container = document.createElement("div");
container.classList.add("puzzle-form-container");

export
class PuzzleForm 
extends HTMLFormElement {
  /**
   * The last puzzle that the form was asked to ask.
   * 
   * @type {Puzzle}
   */
  lastPuzzle;
  /**
   * The `puzzle-question` element.
   * 
   * @type {HTMLElement}
   */
  questionElement = document.createElement("puzzle-question");
  /**
   * A container containing all the `puzzle-answer`'s.
   * 
   * @type {HTMLElement}
   */
  answersContainer = document.createElement("puzzle-answers");
  /**
   * The list contaning the `puzzle-answer` elements used by the puzzle.
   * 
   * @type {HTMLElement[]}
   */
  answersElements = [];
  submitButton = document.createElement("button");

  /**
   * Hides the form.
   */
  hide() {
    this.classList.add("hide");
    this.classList.remove("show");
  }

  /**
   * Shows the form.
   */
  show() {
    this.classList.add("show");
    this.classList.remove("hide");
  }

  /**
   * The handler that will hide the form when the user clicks outside it.
   */
  closeOnClickHandler = (function(event) {
    const target = event.target;

    if(!this.contains(target))
        this.hide();
  }).bind(this);

  /**
   * Says if the form is correct.
   * 
   * @interface
   */
  get correct() {}

  /**
   * Will be excuted when the form is submited.
   */
  submitHandler = (function(event) {
    event.preventDefault();
    event.stopPropagation();

    if(this.correct) this.lastPuzzle.solve();
    else this.lastPuzzle.miss();

    this.hide();
  }).bind(this);

  /**
   * If the form should be closed when clicking outside it.
   */
  get closeOnClick() { return this.#closeOnClick };
  set closeOnClick(close) {
    if(close == true)
      document.addEventListener("click", this.closeOnClickHandler);
    else
      document.removeEventListener("click", this.closeOnClickHandler);

    this.#closeOnClick = close;
  }

  /**
   * Will create the answers for the form.
   * 
   * @interface
   */
  _createAnswers() {}

  #closeOnClick = true;

  constructor() {
    super();

    // add the default class
    this.classList.add("puzzle-form");

    // hide by default
    this.hide();

    this.appendChild(this.questionElement);

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
  _createAnswers() {};

  constructor() {
    super();

    this.appendChild(this.answersContainer);

    this.submitButton.remove();
    this.appendChild(this.submitButton);
  }
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
   * input parent and removes from the old checked input.
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
    // we made a container for all answers (puzzle-answers)
    const container = this.answersContainer;

    // we will create 4 answers
    for(let i = 0; i < 4; i++) {
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
   * 
   * @param {PuzzleSelect} puzzle The puzzle instance to ask for. If use reponds it
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

    // the question is already created but the answers we create now
    this._createAnswers();

    // add the class
    this.classList.add("puzzle-form-select");
  }
}

export
class PuzzleFromDrag
extends PuzzleForm {
  /**
   * Holds the answers in their original order.
   * 
   * @type {HTMLElement[]}
   */
  originalAnswersElements;

  /**
   * The element that was dragged.
   * 
   * @type {HTMLElement}
   */
  firstElement;

  /**
   * The element that it was dragged to.
   * 
   * @type {HTMLElement}
   */
  secondElement;

  /**
   * Swaps the {@link firstElement} and {@link secondElement}.
   */
  _swapElements() {
    const firstContainer = this.firstElement.parentElement;
    const secondContainer = this.secondElement.parentElement;

    secondContainer.appendChild(this.firstElement);
    firstContainer.appendChild(this.secondElement);
  }

  _createAnswers() {
    // remake the answers container
    if(this.answersContainer) this.answersContainer.remove();

    this.answersContainer = document.createElement("puzzle-answers");

    // will contain all the answers
    const answersContainer = this.answersContainer;

    for(let i = 0; i < 4; i++) {
      const answer = document.createElement("puzzle-answer");

      // when the user start dragging the element
      this.answersElements[i].addEventListener("dragstart", (event) => {
        // select this as the first element
        this.firstElement = this.answersElements[i];
      });

      // add event to swap the elements when the drag operation ends
      answer.addEventListener("drop", (event) => {
        // the second element will be its only child
        this.secondElement = answer.children[0];

        // there is no need to swap if the elements are the same
        if(this.firstElement == this.secondElement) return;

        this._swapElements();
      })

      // specifies that it is a valid drop target
      answer.addEventListener("dragover", (event) => { event.preventDefault(); })
      answer.addEventListener("dragenter", (event) => { event.preventDefault(); })

      // place the element into the container
      answer.appendChild(this.answersElements[i]);

      answersContainer.appendChild(answer);
    }

    // add to the form
    this.appendChild(answersContainer);
    // re add the button so it stays at the bottom
    this.submitButton.remove();
    this.appendChild(this.submitButton)
  }

  /**
   * The {@link answersElements} in the order the user selected them.
   * 
   * @type {HTMLElement[]}
   */
  get selectedAnswersElements() {
    const answers = [];

    /* The DOM looks like this:
        - form
          - puzzle-question
          - puzzle-answers
            - puzzle-answer (answer) * 4
             - element (answer.children[0])
     */
    for(const answer of this.answersContainer.children)
      answers.push(answer.children[0]);

    return answers;
  }

  /**
   * Tells if the user ordered it corretly.
   */
  get correct() {
    for(let i = 0; i < 4; i++) {
      if(this.originalAnswersElements[i] != this.selectedAnswersElements[i])
        return false;
    }

    return true;
  }

  /**
   * Opens the form and asks and waits for the user interation based on {@link puzzle}.
   * 
   * @param {PuzzleDrag} puzzle The puzzle instance to ask for. If use reponds it
   * wrong {@link Puzzle.miss} is trigged but if it responds right {@link Puzzle.solve}
   * is trigged.
   * 
   * @fires SolveEvent
   * @fires MissEvent
   */
  ask(puzzle) {
    super.ask(puzzle);

    const answerElements = [];

    // clone all the nodes so we don't accedentally change them
    for(let i = 0; i < 4; ++i) {
      console.log(puzzle.answersElements[i].children)
      const element = puzzle.answersElements[i].children[0].cloneNode(true);
      // make them draggable
      element.setAttribute("draggable", "true");
      answerElements.push(element);
    }

    // we use the original answers to verify if the user answered right
    this.originalAnswersElements = cloneArray(answerElements);
    // this is the one that we will suflle
    this.answersElements = shuffleArray(cloneArray(answerElements));

    this._createAnswers();
  }

  constructor() {
    super();

    this.classList.add("puzzle-form-drag")
  }
}

export
class PuzzleFormRange
extends PuzzleForm {
  /**
   * The input element that the user will use to provide tha answer.
   * 
   * @type {HTMLInputElement}
   */
  inputElement;

  labelElement;
  /**
   * The correct answer for the {@link lastPuzzle}.
   */
  correctAnswer = 0;

  _createAnswers(min, max) {
    this.answersContainer.remove();
    this.answersContainer = document.createElement("puzzle-answers");

    const id = "puzzle-form-range:input";

    this.inputElement = document.createElement("input");
    this.inputElement.type = "range";
    this.inputElement.min = min;
    this.inputElement.max = max;
    this.inputElement.id = id;
    this.inputElement.value = min;

    this.labelElement = document.createElement("label");
    this.labelElement.for = id;
    this.labelElement.textContent = min;

    /**
     * Updates the label text content to match the input.
     */
    const updateLabel = (() => {
      this.labelElement.textContent = this.inputElement.value;
    }).bind(this)

    this.inputElement.addEventListener("input", updateLabel); 
    this.inputElement.addEventListener("change", updateLabel);

    this.answersElements.push(this.inputElement);
    this.answersContainer.appendChild(this.labelElement);
    this.answersContainer.appendChild(this.inputElement);

    // add the container to the element
    this.appendChild(this.answersContainer);

    // re-add the button so it stays at the bottom
    this.submitButton.remove();
    this.appendChild(this.submitButton);
  }

  get correct() {
    if(parseInt(this.inputElement.value) == this.correctAnswer)
      return true;

    return false;
  }

  /**
   * Ask the user to select a value from a range of value.
   * 
   * @param {PuzzleRange} puzzle 
   */
  ask(puzzle) {
    super.ask(puzzle);

    this.correctAnswer = puzzle.correct;

    this._createAnswers(puzzle.min, puzzle.max);
  }

  constructor() {
    super();

    this.classList.add("puzzle-form-range");
  }
}

export
class PuzzleFormAsk
extends PuzzleForm {
  inputElement = document.createElement("input");
  correctAnswer;

  get inputAnswer() { return this.inputElement.value.trim().toLowerCase() };
  get correct() { return this.correctAnswer === this.inputAnswer };

  _createAnswers() {
    this.inputElement.remove();
    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Escreva a resposta...";
    this.appendChild(this.inputElement);

    this.submitButton.remove();
    this.appendChild(this.submitButton);
  }

  ask(puzzle) {
    super.ask(puzzle);

    this.correctAnswer = puzzle.correctAnswer;

    this._createAnswers();
  }
}

customElements.define("puzzle-form-select", PuzzleFormSelect, {extends: "form"});
customElements.define("puzzle-form-drag", PuzzleFromDrag, {extends: "form"});
customElements.define("puzzle-form-range", PuzzleFormRange, {extends: "form"});
customElements.define("puzzle-form-ask", PuzzleFormAsk, {extends: "form"});