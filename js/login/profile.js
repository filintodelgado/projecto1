function sair() {
    sessionStorage.clear()
    window.location.href = '../index.html';
}

function guardar() {
    var Email = sessionStorage.getItem("login")

    var username = document.getElementById('txtUser').value;
    var email = document.getElementById('txtEmail').value;
    var pass = document.getElementById('txtPass').value;
    var date = document.getElementById('txtDate').value;
    var local = document.getElementById('txtLocal').value;
    var sex = document.getElementById('txtSex').value;

    // Atualizar os dados
    var account = {
        username: username,
        email: email,
        pass: pass,
        date: date,
        local: local,
        sexo: sex,
    };
    localStorage.setItem(Email, JSON.stringify(account));
    sessionStorage.setItem("login", username);
}
