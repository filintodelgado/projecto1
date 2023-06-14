import { loggedUser } from "../api/user.mjs"

// Displays the username
const usernameElement = document.querySelector("#username");

if(loggedUser)
  usernameElement.textContent = loggedUser.name;