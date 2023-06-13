import { loggedUser } from "../api/user.mjs"

// Displays the username
const usernameElement = document.querySelector("#username");
usernameElement.textContent = loggedUser.name;