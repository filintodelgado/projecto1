import { Challenge } from "../api/challenge.mjs";

const container = document.querySelector(".main-content");

function createField(labelText, checked) {
  const fieldContainer = document.createElement("div");
  fieldContainer.className = "field";

  const input = document.createElement("input");
  input.type = "radio";
  input.className = "radio at-done";
  input.checked = checked;

  const label = document.createElement("label");
  label.textContent = labelText;

  fieldContainer.appendChild(input);
  fieldContainer.appendChild(label);

  container.appendChild(fieldContainer);
}

for(const challange of Challenge.allInstances)
  createField(challange.readable, challange.completed);