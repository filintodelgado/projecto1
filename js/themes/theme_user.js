let darkmode = true

let theme_login = document.getElementById("theme-login")
theme_login.addEventListener("click", function(){
    ThemeLogin()
})

function ThemeLogin(){
    document.body.classList.toggle("light")

    let logo_navbar = document.getElementById("logo-navbar")

    if(darkmode) {
        logo_navbar.src = "/assets/logo_black.png"
        darkmode = false;
    }else {
        logo_navbar.src = "/assets/logo_white.png"
        darkmode = true;
    }
}