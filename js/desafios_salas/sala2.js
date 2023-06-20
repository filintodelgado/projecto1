import { currentLevel } from "../../api/level.mjs";
import puzzle from "../../api/puzzle.mjs";
import { loggedUser } from "../../api/user.mjs";
import { applyHUD } from "../HUD.js";
import { implementPuzzles } from "./salas.js";

// hasn't completed previous level
// requires to complete bilheteria first
if(loggedUser.levels["Bilheteria"].puzzlesUnsolved > 0) {
   location.href = "../html/s_bilheteira.html";
}

const porta2 = document.getElementById('porta');

porta2.addEventListener('click', function() {
    if(currentLevel.complete) location.href = '../html/s_projecao.html';
});

const cadeira = document.querySelector("#cadeira1");
const youtube = document.querySelector("#youtube");
const cadeira2 = document.querySelector("#cadeira2");

const puzzles = [{ 
        element: cadeira, 
        type: "puzzleSelect", 
        question: "Kevin, um garoto de 8 anos é acidentalmente deixado para traz pela sua familia que estava apreçado para ir de ferias no natal. Qual o nome do filme?", 
        answers: ["Esqueceram de Mim", "O Pestinha", "Uma Babá Quase Perfeita", "Dennis, o Pimentinha"]
    }, {
        element: cadeira2,
        type: "puzzleRange",
        question: "Quantos oscars o filme Titanic recebeu?",
        correct: 11,
        min: 5,
        max: 15
    }, {
        element: youtube,
        type: "puzzleDrag",
        question: "Ordene os filmes por ordem de lançamento, do mais antigo ao mais recente.",
        answers: [
            "../img/esqueçeram de mim-poster.jpg",
            "../img/jurrasic park-poster.jpg",
            "../img/titanic-poster.jpg",
            "../img/matrix-poster.jpg"
        ]
    }
];

implementPuzzles(puzzles)

applyHUD();