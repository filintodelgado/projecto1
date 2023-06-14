/**
 * Contains utilities to validate the user form.
 */

import { User } from "../../api/user.mjs";

/* Used to manually trigger the respective events */
const inputEvent = new Event("input");
const changeEvent = new Event("change");

/**
 * All the data that is collected from the inputs.
 */
export const fields = {
  /** The {@link email} extracted from the {@link emailElement | input} */
  "email" : "",
  /** The {@link password} extracted from the {@link passwordElement | input}*/
  "password" : "",
  /** The {@link username} extracted from the {@link usernameElement | input} */
  "username" : "",
  /** The {@link date} extracted from the {@link dateElement | input} */
  "date" : "",
  /** 
   * The {@link gender} extracted from the {@link maleElement | radio buttom}
   * 
   * @type {"male" | "female"} 
   */
  "local" : "",
  /** The {@link local} extracted from the {@link localElement | input} */
  "gender" : ""
}

/** The input that contains the {@link username}. */
export const usernameElement = document.querySelector("#txtUser");
usernameElement.addEventListener("input", () => { fields.username = verifyInput(usernameElement, 3); });

/** 
 * The input that contains the {@link email}. 
 * 
 * @type {HTMLInputElement}
 */
export const emailElement = document.querySelector("#txtEmail");
emailElement.addEventListener("input", () => {
  // first let the browser do the default validation
  fields.email = emailElement.checkValidity()
    // now do manual validations
    ? verifyInput(emailElement, 3, "@.")
    : false;
})

/** 
 * The input that contains the {@link password}.
 * 
 * @type {HTMLInputElement}
 */
export const passwordElement = document.querySelector("#txtPass");
passwordElement.addEventListener("input", () => { fields.password = verifyInput(passwordElement, 8); });

/** 
 * The input that contains the {@link date}. 
 * 
 * @type {HTMLInputElement}
 */
export const dateElement = document.querySelector("#txtDate");
dateElement.addEventListener("input", () => { fields.date = verifyInput(dateElement, 10); });

/** 
 * The input that contains the {@link local}. 
 * 
 * @type {HTMLInputElement}
 */
export const localElement = document.querySelector("#txtLocal");
localElement.addEventListener("input", () => { fields.local = verifyInput(localElement, 5) })

/** 
 * The input that contains the {@link gender | male gender radio buttom}. 
 */
export const maleElement = document.querySelector("#masc");
maleElement.addEventListener("input", () => { fields.gender = maleElement.checked ? "male" : "female" });
export const femaleElement = document.querySelector("#fem");


/**
 * Validates an input based on the parameters.
 * 
 * @param {HTMLInputElement} element The element the value will be verified.
 * @param {Number | String} minLenght The minimun characters the value should have.
 * @param {String} includedCharacters The characters the value should include.
 * 
 * @returns {String | false} The value if valid otherwise `false`.
 */
export
function verifyInput(element, minLenght=0, includedCharacters=null) {
  // the element is considered invalid until it is proven otherwise
  element.classList.add("invalid");

  const value = element.value.trim();

  // its invalid if the length is less than the required
  if(value.length < minLenght) return false;

  if(typeof(includedCharacters) == "string") {
    // clenup the date
    includedCharacters = includedCharacters
      .replace(" ", "")
      .trim()
      .toLowerCase();

    // it is invalid if it does not contain all the required characters
    for(const char of includedCharacters) 
      // validate case insensive
      if(!value.includes(char) || !value.includes(char.toUpperCase())) 
        return false;
  }

  // remove the invalid state
  element.classList.remove("invalid");

  // if it pass all the requirements it is valid
  return value;
}

/**
 * Triggers the {@link inputEvent} and {@link changeEvent} in all the provided
 * inputs.
 * 
 * @param  {...HTMLInputElement} elements The input to trigger the event uppon
 */
export
function triggerInputEvents(...elements) {
  if(elements.length == 1 && elements[0] instanceof Array)
    elements = elements[0];
  // in case whre no elements are provided we will consider all
  else if(!elements || elements.length == 0) elements = [
    usernameElement, 
    emailElement, 
    passwordElement, 
    localElement, 
    maleElement, 
    dateElement
  ]

  // triggers the input and change event in all input
  for(const element of elements) {
    element.dispatchEvent(inputEvent);
    element.dispatchEvent(changeEvent);
  }
}

/**
 * Sends the user to the logged home page.
 */
export
function goLoggedHome() { location.href = "escapeRoom.html"; };

/**
 * Sends the user back to the home page.
 */
export
function goHome() { location.href = "../index.html"; };

/**
 * Creates a new user using the {@link fields}.
 * 
 * If the email already exists it will overwriten the data.
 * 
 * @returns {User}
 */
export
function createUser() {
  return (new User(fields.email, 
    fields.password, 
    fields.username, 
    fields.date, 
    fields.local, 
    fields.gender));
}

/**
 * Check fields and display alerts if the fields are wrong
 */
export
function checkFields() {
  if(!fields.email) {
    alert(`O email ${emailElement.value.trim()} é invalido ou já existe.`);
    return false;
  };

  if(!fields.password) {
    alert('Palavra-passe invalido.');
    return false;
  };

  if(!fields.username) {
    alert('O nome é invalido.');
    return false;
  }

  if(!fields.date) {
    alert('Data de nascimento invalido.');
    return false;
  }

  if(!fields.local) {
    alert('Local invalido.');
    return false;
  }

  return true;
}