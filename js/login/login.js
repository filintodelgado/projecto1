import { User } from "../../api/user.mjs";

import {
  triggerInputEvents, // to manully make checks
  goLoggedHome, // send the user back to logged home
  /* Fields */
  fields,
  emailElement,
  passwordElement,
  usernameElement,
  dateElement,
  localElement,
  maleElement,
  createUser,
  checkFields,
} from "./validator.mjs";

/* Adds adcional event listeners expecific for this page */

emailElement.addEventListener("input", () => {
  // trying to login with a non-existing email
  if((getMode() == "login" && !User.exists(fields.email))
  /// trying to signup with a existing email
    || (getMode() == "signup" && User.exists(fields.email)))
    fields.email = false;
});

passwordElement.addEventListener("input", () => {
  // trying to login with a non-existing email
  if((getMode() == "login" && !User.exists(fields.email))
  /// trying to signup with a existing email
    || (getMode() == "signup" && User.exists(fields.email)))
    fields.email = false;
})

const button = document.querySelector("#login-button");
button.addEventListener("click", handler);

const modeToggler = document.querySelector("#change-mode");

const loginElements = [emailElement, passwordElement];
function login() {
  // will set the class .incorrect showing the user 
  // vissually which data is invalid
  // but only the necessary inputs
  triggerInputEvents(loginElements);

  if(!fields.email) {
    alert(`O email ${emailElement.value.trim()} é invalido ou não existe.`);
    return;
  }

  if(!fields.password) {
    alert(`Palavra-passe invalido.`);
    return;
  }

  // loggs the user
  User(fields.email).login();

  goLoggedHome();
}

const signupElements = [usernameElement, ...loginElements, dateElement, localElement, maleElement];
function signup() {
  // secure that the date are all right
  triggerInputEvents(signupElements);

  // check failed
  if(!checkFields()) return;

  // create user and loggin
  createUser().login();

  goLoggedHome();
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