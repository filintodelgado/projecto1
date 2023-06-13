import { User } from "../../api/user.mjs";

const button = document.querySelector("#login-button");
button.addEventListener("click", handler);

const usernameElement = document.querySelector("#txtUser");
let username;
usernameElement.addEventListener("input", () => { username = verifyInput(usernameElement, 3); });

const emailElement = document.querySelector("#txtEmail");
let email;
emailElement.addEventListener("input", () => {
  // first let the browser do the default validation
  email = emailElement.checkValidity()
    // now do manual validations
    ? verifyInput(emailElement, 3, "@.")
    : false;

  // trying to login with a non-existing email
  if((getMode() == "login" && !User.exists(email))
  /// trying to signup with a existing email
    || (getMode() == "signup" && User.exists(email)))
    email = false;
})

const passwordElement = document.querySelector("#txtPass");
let password;
passwordElement.addEventListener("input", () => { 
  password = verifyInput(passwordElement, 8);

  // validate the password if the user is trying to loggin
  // but only if the email is valid
  if(email && getMode() == "login") 
    User.checkPassword(email, password);
});

const dateElement = document.querySelector("#txtDate");
let date;
dateElement.addEventListener("input", () => { date = dateElement.value; });

const localElement = document.querySelector("#txtLocal");
let local;
localElement.addEventListener("input", () => { local = verifyInput(localElement, 5) })

const maleElement = document.querySelector("#masc_label");
let gender;
maleElement.addEventListener("change", () => gender = maleElement.checked ? "male" : "female");

const modeToggler = document.querySelector("#change-mode");

/* Used to manually trigger the respective events */
const inputEvent = new Event("input");
const changeEvent = new Event("change");

const loginElements = [emailElement, passwordElement];
function login() {
  // will set the class .incorrect showing the user vissually which data is invalid
  triggerInputEvents(loginElements);

  if(!email) {
    alert(`O email ${emailElement.value.trim()} é invalido ou não existe.`);
    return;
  }

  if(!password) {
    alert(`Palavra-passe invalido.`);
    return;
  }

  (new User(email)).login();

  goHome();
}

const signupElements = [usernameElement, ...loginElements, dateElement, localElement, maleElement];
function signup() {
  triggerInputEvents(signupElements);

  if(!email) {
    alert(`O email ${emailElement.value.trim()} é invalido.`);
    return;
  };

  if(!password) {
    alert('Palavra-passe invalido.');
    return;
  };

  if(!username) {
    alert('O nome é invalido.');
    return;
  }

  if(!date) {
    alert('Data de nascimento invalido.');
    return;
  }

  if(!local) {
    alert('Local invalido.');
    return;
  }

  (new User(email, password, username, date, local, gender)).login();

  goHome();
}

/**
 * Will run when the {@link login} or {@link signup} based on the current {@link getMode | mode}.
 */
function handler() {
  if(getMode() == "login") login();
  else signup();
}

/**
 * Returns the current mode of the page.
 * 
 * @returns {"login" | "signup"}
 */
function getMode() {
  return modeToggler.innerHTML.trim() 
    == "<h4>Criar Conta</h4>" 
    ? "login" 
    : "signup";
}

/**
 * Validates an input based on the parameters.
 * 
 * @param {HTMLInputElement} element The element the value will be verified.
 * @param {Number | String} minLenght The minimun characters the value should have.
 * @param {String} includedCharacters The characters the value should include.
 * 
 * @returns {String | false} The value if valid otherwise `false`.
 */
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
function triggerInputEvents(...elements) {
  if(elements.length == 1 && elements[0] instanceof Array)
    elements = elements[0];

  // triggers the input and change event in all input
  for(const element of elements) {
    element.dispatchEvent(inputEvent);
    element.dispatchEvent(changeEvent);
  }
}

function goHome() { location.href = "escapeRoom.html"; };