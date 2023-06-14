import { User, loggedUser } from "../../api/user.mjs";
import { 
    goHome,
    fields,
    emailElement,
    passwordElement,
    usernameElement,
    dateElement,
    maleElement,
    femaleElement,
    localElement,
    triggerInputEvents,
    checkFields,
    goLoggedHome
} from "./validator.mjs";

fillInputs();

emailElement.addEventListener("input", () => {
    // the same email just ignore
    if(fields.email == loggedUser.email) return;
    // invalid in case the email already exists
    else if(User.exists(fields.email)) fields.email = false;
})

const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", logout);

const saveButton = document.querySelector("#save");
saveButton.addEventListener("click", save);

function save() {
    triggerInputEvents();

    if(!checkFields()) return;

    // create user also can save existing users
    loggedUser.name = fields.username;
    loggedUser.email = fields.email;
    loggedUser.password = fields.password;
    loggedUser.borndate = fields.date;
    loggedUser.gender = fields.gender;
    loggedUser.local = fields.local;

    goLoggedHome();
}

function logout() {
    loggedUser.logout();
    goHome();
}

function fillInputs() {
    emailElement.value = loggedUser.email;
    passwordElement.value = loggedUser.password;
    usernameElement.value = loggedUser.name.full;
    dateElement.value = loggedUser.borndate.toISOString().substring(0, 10);
    localElement.value = loggedUser.local;
    
    if(loggedUser.gender.value == "male") maleElement.checked = true;
    else femaleElement.checked = true;
}