import { login, home } from "./module.mjs";


var email = document.getElementById('txtEmail');
var pass = document.getElementById('txtPass');


function loginVerifi() {
    let btn = document.getElementById('login-button');
    let btnTexto = btn.textContent;//passa só o texto do botão

    if (btnTexto == 'Entrar') {
        const success = login(email.value, pass.value, remenber.checked)

        if (!success) {
            div.className = "error"
            return
        }

        home()

    } else {
        alert("registo")
    }
}