/**
 * @module cinescape/popup
 */

import { setTime } from "./timer.mjs";

/**
 * Defines all the types the Popup can be:
 * * Info - To show a information on the screen;
 * * Reward - Feedback the user about a new reward;
 * * Error - Display a error.
 * 
 * @typedef {"Info" | "Reward" | "Error"} PopupType
 */

/**
 * An object with the message to display and the type.
 * 
 * @typedef {{message: String, type: PopupType}} PopupMessage
 */

/**
 * Creates a new popup element that display messages in the order they 
 * were defined.
 */
export
class Popup
extends HTMLDivElement {
  /**
   * The stack of messages that will be displayed one after another in a
   * first-in-first-out (fifo) style.
   * 
   * @type {PopupMessage[]}
   */
  #messages = [];
  /**
   * Says if the popup is currently displaying a message or not.
   */
  #displaying = false;
  /**
   * When was the last time the popup showed a message.
   */
  #lastTime = Date.now();

  /**
   * The value of the attribute *type*.
   */
  get type() { return this.getAttribute("type") };
  set type(newType) {
    this.setAttribute("type", newType);
  }

  #lastType = "";

  /**
   * Replace {@link lastValue} with {@link newValue} from the 
   * {@link classList}.
   * 
   * @param {String} newValue 
   * @param {String} lastValue 
   */
  replaceClass(newValue, lastValue) {
    this.classList.remove(lastValue);
    this.classList.add(newValue);
  }

  /**
   * Replaces the type from the {@link className}.
   * @param {PopupType} newType 
   * @param {PopupType} lastType 
   */
  replaceTypeClass(newType, lastType) {
    /**
     * @param {PopupType} type 
     * @returns {`popup-${type}`} The type ready to use as className.
     */
    function classTypeName(type) { return `popup-${type}`};
    this.classList.remove(classTypeName(lastType));
    this.classList.add(classTypeName(newType));
  }

  /**
   * Sets the {@link newType | new type} of the popup.
   * @param {PopupType} newType 
   */
  setType(newType) {
    const lastType = this.#lastType;
    this.#lastType = newType;

    // replace the class
    this.replaceTypeClass(newType, lastType);
    // set the type attribute
    this.type = newType;

    // the last type now is the new type
    this.#lastType = newType;
  }

  /**
   * Sets the {@link textContent} to the value of the {@link message}.
   * @param {String} message 
   */
  setMessage(message) {
    // simply set the text content
    this.textContent = message;
  }

  /**
   * In *seconds* how long should the popup be displayed on the secreen
   * before desapear. 
   * 
   * By default it is 3 second and it is applied to all the
   * intances.
   * 
   * @type {Number}
   */
  static timeout = 3;
  /**
   * In *seconds* how long should the popup be displayed on the secreen
   * before desapear. 
   * 
   * By default it is 3 seconds.
   * 
   * @type {Number}
   */
  timeout;

  /**
   * In *seconds* does it take to show the next message.
   * 
   * By default it is 1 second and it is applied to all the instances.
   */
  static interval = 1;
  /**
   * In *seconds* does it take to show the next message.
   * 
   * By default it is 1 second.
   */
  interval;

  /**
   * In *seconds* how much time as passed since the popup 
   * showed a message.
   * @type {Number}
   */
  get intervalDiference() {
    return (new Date(Date.now() - this.#lastTime)).getSeconds();
  }

  /**
   * How much seconds is left before the next message can be show on the 
   * screen based on {@link inteval}.
   */
  get remainingInterval() {
    return Math.max(this.interval - this.intervalDiference, 0);
  }

  hide() {
    //this.setAttribute("hidden", true);
    this.replaceClass("hide", "show");
    this.#displaying = false;
  }

  show() {
    //this.removeAttribute("hidden");
    this.replaceClass("show", "hide");
    this.#displaying = true;
  }

  /**
   * Will add the message in the stack and
   * empty the messages in the {@link stack} 
   * by displaying them in order.
   * 
   * @param {String} message The message that will be displayed.
   * @param {PopupType} type The type of the message.
   */
  display(message, type="info") {
    // add the message to the stack
    if(message && type) this.#messages.push({
      "message": message,
      "type" : type
    })
    
    // already displaying a message
    if(this.#displaying) return;
    
    // no messages to display
    if(this.#messages.length == 0)
      return;

    // in case the display is called before the interval as runned out
    // we will remark it to the correct time
    if(this.remainingInterval > 0) {
      setTimeout(this.display.bind(this), this.remainingInterval * 1000);
      return;
    }

    // setup the popup message
    const messageToDisplay = this.#messages.shift();

    // show the message
    this.setMessage(messageToDisplay.message);
    this.setType(messageToDisplay.type);
    this.show();

    // set to hide after the timeout
    setTimeout(this.hide.bind(this), this.timeout * 1000);

    // set to display after the interval
    setTimeout(this.display.bind(this),
      (this.timeout + this.interval) * 1000);
  }

  constructor() {
    super();

    // set default values
    this.interval = Popup.interval;
    this.timeout = Popup.timeout;

    // hide by default
    this.hide();

    this.classList.add("pop-up")

    document.body.appendChild(this);
  }
}

customElements.define("pop-up", Popup, {extends: "div"});

/**
 * The default popup.
 * 
 * @type {Popup}
 */
export
const popup = document.createElement("div", {is: "pop-up"});