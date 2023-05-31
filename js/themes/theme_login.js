let darkmode = true

let theme_login = document.getElementById("theme-login")
theme_login.addEventListener("click", function(){
    ThemeLogin()
})

function ThemeLogin(){
    document.body.classList.toggle("light")

    let logo_navbar = document.getElementById("logo-navbar")
    let ticket_title = document.getElementById("ticket-title")

    if(darkmode) {
        logo_navbar.src = "../assets/logo_black.png"
        ticket_title.src = "../assets/login/login_light.png"
        darkmode = false;
    }else {
        logo_navbar.src = "../assets/logo_white.png"
        ticket_title.src = "../assets/login/login_dark.png"
        darkmode = true;
    }
}