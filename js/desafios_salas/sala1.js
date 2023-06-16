import { currentLevel } from "../../api/level.mjs";
import { loggedUser } from "../../api/user.mjs";
import { implementPuzzle } from "./salas.js";

const porta = document.getElementById('porta');
porta.addEventListener('click', () => {
    loggedUser.save();
    // only go if the level is completed
    if(currentLevel.complete) window.location.href = '../html/s_cinema1.html';
});

const poster = document.querySelector("#poster");

poster.addEventListener('click', function () {

    // Seleciona elementos do DOM
    //var openModalBtn = document.getElementById('openModalBtn');
    var modal = document.getElementById('modal');
    var closeBtn = document.getElementsByClassName('close')[0];
    var iframeContainer = document.getElementById('iframeContainer');

    // URL do iframe
    var iframeURL = '../html/desafios/ordenar_imagens.html';

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

const puzzles = [];

puzzles.push(implementPuzzle("puzzleSelect", poster, 
"Qual desses filmes teve a maior bilheteria nos anos 90'", 
["Titanic", "Jurassic Park", "The Lion King", "Independence Day"]));
