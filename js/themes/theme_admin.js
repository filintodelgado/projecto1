let darkmode = true

let theme_login = document.getElementById("theme-login")
theme_login.addEventListener("click", function(){
    ThemeLogin()
})

function ThemeLogin(){
    document.body.classList.toggle("light")

    if(darkmode) {
        theme_login.src = "../assets/sun.svg"
        darkmode = false;
    }else {
        theme_login.src = "../assets/moon.svg"
        darkmode = true;
    }
}