
let login = true

let username = document.getElementById("username")
let date = document.getElementById("date")
let local = document.getElementById("local")
let sex = document.getElementById("sex")

let loginButton = document.getElementById("login-button")

let Change_Mode = document.getElementById("change-mode")
Change_Mode.addEventListener("click", function(){
    ChangeMode()
})

function ChangeMode(){
    if(!login){
        Change_Mode.innerHTML = `<h4>Criar Conta</h4>`


        let TitleContent = document.getElementById("title-content")
        if(document.body.classList == "light"){
            TitleContent.innerHTML = `<img src="../assets/login/login_light.png" height="190" id="ticket-title" style="width: 100%;">`
        }else{
            TitleContent.innerHTML = `<img src="../assets/login/login_dark.png" height="190" id="ticket-title" style="width: 100%;">`
        }

        let TopLogin = document.getElementById("top-login")
        TopLogin.innerHTML = `<h1>Login</h1>`

        username.style.display = "none"
        date.style.display = "none"
        local.style.display = "none"
        sex.style.display = "none"

        loginButton.innerHTML = '<h4 id="login-button">Entrar</h4>'

        login = true
    }else{
        Change_Mode.innerHTML = `<h4>Login</h4>`

        let TitleContent = document.getElementById("title-content")
        if(document.body.classList == "light"){
            TitleContent.innerHTML = `<img src="../assets/login/signup_light.png" height="190" id="ticket-title" style="width: 100%;">`
        }else{
            TitleContent.innerHTML = `<img src="../assets/login/signup_dark.png" height="190" id="ticket-title" style="width: 100%;">`
        }

        let TopLogin = document.getElementById("top-login")
        TopLogin.innerHTML = `<h1>Criar Conta</h1>`
        
        username.style.display = "flex"
        date.style.display = "flex"
        local.style.display = "flex"
        sex.style.display = "flex"

        loginButton.innerHTML = '<h4 id="login-button">Registar</h4>'

        login = false
    }
}
