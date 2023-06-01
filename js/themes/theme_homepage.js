let darkmode = truenavbar

let theme_homepage = document.getElementById("theme-homepage")
theme_homepage.addEventListener("click", function(){
    HomepageTheme()
})


function HomepageTheme(){
    let logo = document.getElementById("logo-header")
    let burger = document.getElementById("burger-icon")

    if(darkmode) {
        logo.src = "/assets/logo_black.png"
        darkmode = false;
    }else {
        logo.src = "/assets/logo_white.png"
        darkmode = true;
    }

    document.body.classList.toggle("light")

    let html_levels = document.getElementById("html-levels")
    let iWindow = html_levels.contentWindow;
    let iDocument = iWindow.document;
    iWindow.document.body.classList.toggle("light")

    let html_group = document.getElementById("html-group")
    iWindow = html_group.contentWindow;
    iDocument = iWindow.document;
    iWindow.document.body.classList.toggle("light")

    if(document.body.classList.toggle == "light"){
        burger.innerHTML = `
        <path d="M4 18L20 18" stroke="black" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 12L20 12" stroke="black" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 6L20 6" stroke="black" stroke-width="2" stroke-linecap="round"/>`
    }
}