import { popup } from "../api/popup.mjs";
import { User, loggedUser } from "../api/user.mjs";

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const challengeLink = document.querySelector("#atividades");
const backLink = document.querySelector("#voltar");

backLink.addEventListener("click", () => {
  location.href = "../"
})

challengeLink.addEventListener("click", () => {
  location.href = "./atividadespanel.html";
})

for(const user of User.instances) createUserRow(user);

const logoutButton = document.querySelector("#sair");
logoutButton.addEventListener("click", () => {
  loggedUser.logout();
  location.reload();
})

function createUserRow(user) {
  const row = document.createElement("tr");

  const email = document.createElement("td");
  email.textContent = user.email;

  const username = document.createElement("td");
  username.textContent = user.name.full;
    
  const deleteUser = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.addEventListener("click", () => {
    user.remove();
    row.remove();
    popup.display(`Utilizador ${user.name} removido.`);

    if(user.email == loggedUser.email) {
      popup.display("Logout em 3 segundos");

      setTimeout(() => {
        location.href = "./escapeRoom.html";
      }, 8000);
    }
  });
  
  deleteUser.appendChild(deleteButton);
  const deleteParagrath = document.createElement("p");
  deleteParagrath.textContent = "Apagar";
  deleteButton.appendChild(deleteParagrath);

  const logAsUserButton = deleteUser.cloneNode(true);
  logAsUserButton.addEventListener("click", () => {
    if(user.email != loggedUser.email) user.login();
    else user.logout();
    location.href = "./escapeRoom.html"
  })
  const logAsUserParagrath = logAsUserButton.querySelector("p");
  logAsUserParagrath.textContent = 
    user.email == loggedUser.email ?
    "Logout" : "Login";

  row.appendChild(email);
  row.appendChild(username);
  row.appendChild(deleteUser);
  row.appendChild(logAsUserButton);

  tbody.appendChild(row);
}