import { admin, loggedUser } from "../api/user.mjs"

// Displays the username
const usernameElement = document.querySelector("#username");

const navbarContainer = document.querySelector("#responsive-navbar").children[0];
const elementTemplate = navbarContainer.children[0];

if(loggedUser)
  usernameElement.textContent = loggedUser.name;

if(loggedUser.admin) {
  const adminPannels = elementTemplate.cloneNode(true);
  console.log(adminPannels)
  const link = adminPannels.querySelector("a");

  link.textContent = "Administrador";
  link.setAttribute("href", "./adminpanel.html");

  navbarContainer.insertAdjacentElement("afterbegin", adminPannels);
}