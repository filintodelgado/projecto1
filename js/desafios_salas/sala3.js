import { currentLevel } from "../../api/level.mjs";
import { loggedUser } from "../../api/user.mjs";

// requires to complete the sala de cinema first
if(loggedUser.levels["Sala de Cinema"].puzzlesUnsolved > 0) {
    location.href = "../html/s_cinema1.html"
}

const porta3 = document.getElementById('porta')
porta3.addEventListener('click', () => {
    if(currentLevel.completed) location.href = '../html/escapeRoom.html'; 
});

const filme = document.getElementById('verde1fila').addEventListener('click', function () {

    // Seleciona elementos do DOM
    //var openModalBtn = document.getElementById('openModalBtn');
    var modal = document.getElementById('modal');
    var closeBtn = document.getElementsByClassName('close')[0];
    var iframeContainer = document.getElementById('iframeContainer');

    // URL do iframe
    var iframeURL = '../html/desafios/nome_filme.html';

    // Função para carregar o iframe
    function loadIframe() {
        var iframe = document.createElement('iframe');
        iframe.src = iframeURL;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameborder = '0';
        iframeContainer.appendChild(iframe);
    }

    // Abre o modal quando o botão é clicado e carrega o iframe
    modal.style.display = 'block';
    loadIframe();


    // Fecha o modal quando o botão de fechar é clicado
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        iframeContainer.innerHTML = ''; // Limpa o contêiner do iframe ao fechar
    });

    // Fecha o modal quando o usuário clica fora dele
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            iframeContainer.innerHTML = ''; // Limpa o contêiner do iframe ao fechar
        }
    });
});