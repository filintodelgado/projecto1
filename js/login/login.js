
function loginVerifi() {
    let btn = document.getElementById('login-button');
    let btnTexto = btn.textContent;//passa só o texto do botão

    if (btnTexto == 'Entrar') {

        //puxa dos dados e verifica se estão prreenchodos
        var Email = document.getElementById('txtEmail').value;
        var Pass = document.getElementById('txtPass').value;
        if (Email == "" || Pass == "") {
            alert("preencha todos os campos")
            return
        }
        // Recuperar a string armazenada no localStorage
        var accountString = localStorage.getItem(Email);

        // Converter a string para um objeto
        var account = JSON.parse(accountString);

        // Acessar os valores do objeto
        var email = account.email;
        var pass = account.pass;

        //verifica se coeencidem
        if (Email == email && Pass == pass) {
            alert("Logado")
            window.location.href = 'escapeRoom.html';
        } else {
            alert("erro")
        }


    } else if (btnTexto == 'Registar') {
        if (username == "" || email == "" || pass == "" || date == "" || local == "") {
            alert("preencha todos os campos")
            return
        }
        // Coletaa informações para criar a conta
        var username = document.getElementById('txtUser').value;
        var email = document.getElementById('txtEmail').value;
        var pass = document.getElementById('txtPass').value;
        var date = document.getElementById('txtDate').value;
        var local = document.getElementById('txtLocal').value;
        var sex = document.getElementById('txtSex').value;

        //verifica se já é existente
        if (localStorage.getItem(email)){
            alert("Essa conta já existe")
            return
        }

        // Criar um objeto de conta
        var account = {
            username: username,
            email: email,
            pass: pass,
            date: date,
            local: local,
            sexo: sex,
        };

        // Armazenar a conta no localStorage
        localStorage.setItem(email, JSON.stringify(account));

        // Exibir uma mensagem de sucesso ou redirecionar para a página adequada
        alert('Conta criada com sucesso!');

    }
}