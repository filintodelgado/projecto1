import { currentLevel } from "../../api/level.mjs";
import { loggedUser } from "../../api/user.mjs";
import { applyHUD } from "../HUD.js";
import { implementPuzzles } from "./salas.js";

// requires to complete the sala de cinema first
if(loggedUser.levels["Sala de Cinema"].puzzlesUnsolved > 0) {
    location.href = "../html/s_cinema1.html"
}

const porta3 = document.querySelector('#porta')
porta3.addEventListener('click', () => {
    if(currentLevel.completed) location.href = '../html/escapeRoom.html'; 
});

const projetor = document.querySelector("#projetor");
const book = document.querySelector("#verde1fila");
const mesa = document.querySelector("#mesa");

const puzzles = [{ 
        element: projetor, 
        type: "puzzleSelect", 
        question: "Quais desses filmes é sobre a máfia?", 
        answers: ["Goodfellas", "Pulp Fiction", "Jurassic Park", "Forrest Gump"]
    }, {
        element: book, 
        type: "puzzleAsk", 
        question: "Qual o nome do primeiro filme longa metragem de animação 3D totalmente feito em computador?", 
        answers: "Toy Story"
    }, {
        element: mesa,
        type: "puzzleRange", 
        question: "Quantos filmes de Jurassic Park foram lançados nos anos 90'?", 
        correct: 2,
        min: 1,
        max: 10
    }
];

implementPuzzles(puzzles);

applyHUD();