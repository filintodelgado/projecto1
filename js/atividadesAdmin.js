import { Challenge, CompleteUnderSecondsChallenge, SolvePuzzleChallenge, createChallenge } from "../api/challenge.mjs";
import { popup } from "../api/popup.mjs";

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const p = document.querySelector("#discription");
const clearButton = document.querySelector("#limpar");
const createButton = document.querySelector("#criar");
const userLink = document.querySelector("#utilizadores");
const backLink = document.querySelector("#voltar")

backLink.addEventListener("click", () => {
  location.href = "../"
})

userLink.addEventListener("click", () => {
  location.href = "./adminpanel.html";
})

clearButton.addEventListener("click", () => {
  clearForm();
})

createButton.addEventListener("click", () => {
  create();
})

function create() {
  const goal = getGoalInput();

  if(!goal || goal == NaN) {
    popup.display("Objetivo invalido.");
    return;
  }

  const challenge = createChallenge(getValue(), goal);

  createRow(challenge);
}

for(const challenge of Challenge.allInstances) 
  createRow(challenge);
  // challenge.remove();

/**
 * The challenge template for readable string.
 */
let template = "";

/**
 * Create input that will contain the value for goal.
 * 
 * @return {HTMLInputElement}
 */
function createGoalInput() {
  let goalInput;
  goalInput = document.createElement("input");
  goalInput.setAttribute("type", "number");
  goalInput.min = 0;
  goalInput.max = 100;
  goalInput.placeholder = "Objetivo";
  goalInput.id = "goalInput";

  return goalInput;
}
function getGoalInput() { return document.querySelector("#goalInput").value }

const select = document.querySelector('select');

select.addEventListener("change", () => {
  clearForm();
})

function getValue() {
  const selectedIndex = select.selectedIndex;
  return select.options[selectedIndex].value;
}

function getChallengeClass() {
  switch(getValue()) {
    case "solvePuzzle": return SolvePuzzleChallenge;
    case "completeUnderSeconds": return CompleteUnderSecondsChallenge;
    default: return false;
  }
}

function getTemplate() {
  return getChallengeClass().readableTeplate;
}

function setDiscription() {
  p.innerHTML = getTemplate().replace("%goal%", createGoalInput().outerHTML);
}

/**
 * 
 * @param {Challenge} challenge 
 */
function createRow(challenge) {
  const row = document.createElement("tr");

  const id = document.createElement("td");
  id.textContent = challenge.id;

  const discription = document.createElement("td");
  discription.textContent = challenge.readable;
    
  const deleteUser = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.addEventListener("click", () => {
    challenge.remove();
    row.remove();
    popup.display(`Desafio "${challenge.readable}" removido.`);
  });
  
  deleteUser.appendChild(deleteButton);
  const deleteParagrath = document.createElement("p");
  deleteParagrath.textContent = "Apagar";
  deleteButton.appendChild(deleteParagrath);

  row.appendChild(id);
  row.appendChild(discription);
  row.appendChild(deleteUser);

  tbody.appendChild(row);
}

function clearForm() {
  setDiscription();
}

clearForm();

// createChallenge("solvePuzzle", 2);